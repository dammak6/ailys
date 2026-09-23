import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateInvoicePdfBuffer, InvoiceData } from '@/lib/invoices/generate-invoice';

export interface InvoiceResult {
  id: string;
  orderId: string;
  documentNumber: string;
  documentType: string;
  storagePath: string;
  isFinalized: boolean;
  generatedAt: string;
  downloadUrl?: string;
  metadata?: any;
}

export class InvoiceService {
  /**
   * Fetches existing invoice document for an order, including a fresh signed URL.
   */
  static async getInvoiceForOrder(orderId: string, client?: any): Promise<InvoiceResult | null> {
    const supabase = client || (await createServerSupabaseClient());

    const { data: doc, error } = await supabase
      .from('order_documents')
      .select('*')
      .eq('order_id', orderId)
      .eq('document_type', 'invoice')
      .order('generated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !doc) {
      return null;
    }

    let downloadUrl: string | undefined;
    if (doc.storage_path) {
      const { data: signedData, error: signError } = await supabase.storage
        .from('invoices')
        .createSignedUrl(doc.storage_path, 3600); // 1 hour validity

      if (!signError && signedData?.signedUrl) {
        downloadUrl = signedData.signedUrl;
      }
    }

    return {
      id: doc.id,
      orderId: doc.order_id,
      documentNumber: doc.document_number,
      documentType: doc.document_type,
      storagePath: doc.storage_path,
      isFinalized: doc.is_finalized,
      generatedAt: doc.generated_at,
      downloadUrl,
      metadata: doc.metadata,
    };
  }

  /**
   * Generates, uploads, and registers an invoice for an order.
   * If an invoice already exists and forceRegenerate is false, returns the existing one (guaranteeing immutability).
   */
  static async generateInvoice(orderId: string, options?: { forceRegenerate?: boolean; client?: any }): Promise<InvoiceResult> {
    const supabase = options?.client || (await createServerSupabaseClient());

    // 1. Check if invoice already exists
    if (!options?.forceRegenerate) {
      const existing = await this.getInvoiceForOrder(orderId, supabase);
      if (existing) {
        return existing;
      }
    }

    // 2. Fetch order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error(`Commande introuvable pour l'ID: ${orderId}`);
    }

    // 3. Fetch order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError || !items || items.length === 0) {
      throw new Error(`Aucun article trouvé pour la commande: ${order.order_code}`);
    }

    // 4. Generate collision-safe invoice number from DB sequence
    const { data: invoiceNumData, error: seqError } = await supabase.rpc('generate_invoice_number');
    if (seqError || !invoiceNumData) {
      throw new Error(`Échec de la génération du numéro de facture: ${seqError?.message || 'Inconnu'}`);
    }
    const documentNumber = invoiceNumData as string;

    // 5. Build InvoiceData
    const invoiceData: InvoiceData = {
      documentNumber,
      orderCode: order.order_code,
      createdAt: order.created_at,
      finalizedAt: new Date().toISOString(),
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      customerEmail: order.customer_email || undefined,
      shippingAddress: order.address,
      city: order.city,
      governorate: order.governorate,
      paymentMethod: order.payment_method === 'cod' ? 'Paiement à la livraison (COD)' : order.payment_method,
      paymentStatus: order.payment_status === 'paye' ? 'Payé' : 'À percevoir à la livraison',
      subtotal: Number(order.subtotal),
      deliveryFee: Number(order.shipping_fee),
      discountAmount: Number(order.discount_amount || 0),
      totalAmount: Number(order.total),
      notes: order.delivery_notes || undefined,
      items: items.map((it: any) => ({
        title: it.product_name,
        sku: it.sku || undefined,
        size: it.size || undefined,
        color: it.color || undefined,
        quantity: it.quantity,
        unitPrice: Number(it.unit_price),
        totalPrice: Number(it.total_price),
      })),
    };

    // 6. Generate PDF Buffer
    const pdfBuffer = await generateInvoicePdfBuffer(invoiceData);

    // 7. Upload to Supabase Storage bucket 'invoices'
    const storagePath = `${order.order_code}/${documentNumber}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from('invoices')
      .upload(storagePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Erreur lors de l'enregistrement du PDF dans le stockage: ${uploadError.message}`);
    }

    // 8. Insert or Update order_documents
    const metadata = {
      order_code: order.order_code,
      total_amount: Number(order.total),
      subtotal: Number(order.subtotal),
      delivery_fee: Number(order.shipping_fee),
      discount_amount: Number(order.discount_amount || 0),
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      items_count: items.length,
      file_size_bytes: pdfBuffer.length,
    };

    const { data: docRecord, error: docError } = await supabase
      .from('order_documents')
      .insert({
        order_id: orderId,
        document_type: 'invoice',
        document_number: documentNumber,
        storage_path: storagePath,
        is_finalized: true,
        generated_at: new Date().toISOString(),
        finalized_at: new Date().toISOString(),
        metadata,
      })
      .select()
      .single();

    if (docError || !docRecord) {
      throw new Error(`Erreur lors de l'enregistrement du document en base: ${docError?.message}`);
    }

    // 9. Generate signed URL for immediate download
    const { data: signedData } = await supabase.storage
      .from('invoices')
      .createSignedUrl(storagePath, 3600);

    return {
      id: docRecord.id,
      orderId: docRecord.order_id,
      documentNumber: docRecord.document_number,
      documentType: docRecord.document_type,
      storagePath: docRecord.storage_path,
      isFinalized: docRecord.is_finalized,
      generatedAt: docRecord.generated_at,
      downloadUrl: signedData?.signedUrl,
      metadata: docRecord.metadata,
    };
  }

  /**
   * Retrieves the raw PDF buffer for direct streaming.
   */
  static async getInvoicePdfStream(storagePath: string, client?: any): Promise<Buffer> {
    const supabase = client || (await createServerSupabaseClient());
    const { data, error } = await supabase.storage.from('invoices').download(storagePath);
    if (error || !data) {
      throw new Error(`Impossible de télécharger le fichier de facture: ${error?.message}`);
    }
    const arrayBuffer = await data.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}
