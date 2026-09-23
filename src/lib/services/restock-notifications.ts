import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface PreparedNotification {
  requestId: string;
  productId: string;
  productName: string;
  sizeName: string;
  contactInfo: string;
  channel: 'email' | 'sms' | 'whatsapp';
  subject?: string;
  message: string;
  preparedAt: string;
  status: 'prepare';
}

export class RestockNotificationService {
  /**
   * Prepares notification payloads for pending restock requests without falsely marking them as delivered.
   * Updates state from 'en_attente' -> 'prepare'.
   */
  static async prepareRestockNotifications(filter?: {
    productId?: string;
    variantId?: string;
  }, client?: any): Promise<PreparedNotification[]> {
    const supabase = client || (await createServerSupabaseClient());

    let query = supabase
      .from('restock_requests')
      .select('*, products:product_id(slug)')
      .eq('status', 'en_attente');

    if (filter?.productId) {
      query = query.eq('product_id', filter.productId);
    }
    if (filter?.variantId) {
      query = query.eq('variant_id', filter.variantId);
    }

    const { data: requests, error } = await query;
    if (error) {
      throw new Error(`Erreur lors de la récupération des demandes de réassort: ${error.message}`);
    }

    if (!requests || requests.length === 0) {
      return [];
    }

    const preparedList: PreparedNotification[] = [];
    const nowIso = new Date().toISOString();

    for (const req of requests) {
      const isEmail = req.contact_type === 'email' || req.contact_info.includes('@');
      const channel: 'email' | 'sms' | 'whatsapp' = isEmail ? 'email' : (req.preferred_channel as any) || 'sms';
      const slug = (req.products as any)?.slug || 'collection';
      const productUrl = `https://ailys.tn/shop/${slug}`;

      let subject: string | undefined;
      let message: string;

      if (channel === 'email') {
        subject = `AÏLYS — Réassort exclusif de votre pièce (${req.product_name})`;
        message = `Bonjour,\n\nNous avons le plaisir de vous informer que la création AÏLYS « ${req.product_name} » (Taille : ${req.size_name || 'Standard'}) est de nouveau disponible au sein de notre atelier.\n\nVous pouvez dès à présent finaliser votre commande en ligne :\n${productUrl}\n\nRestant à votre entière disposition,\nLa Conciergerie AÏLYS`;
      } else {
        message = `AÏLYS : Votre pièce « ${req.product_name} » (${req.size_name || 'Standard'}) est de nouveau disponible à l'atelier. Commandez en ligne : ${productUrl}`;
      }

      const payload = {
        channel,
        recipient: req.contact_info,
        subject,
        message,
        prepared_at: nowIso,
        product_id: req.product_id,
        size_name: req.size_name,
      };

      // Transition strictly to 'prepare' (DO NOT falsely claim delivered/notifie)
      const { error: updateError } = await supabase
        .from('restock_requests')
        .update({
          status: 'prepare',
          prepared_at: nowIso,
          notification_payload: payload,
        })
        .eq('id', req.id);

      if (updateError) {
        console.error(`Failed to mark restock request ${req.id} as prepare:`, updateError);
        continue;
      }

      preparedList.push({
        requestId: req.id,
        productId: req.product_id,
        productName: req.product_name,
        sizeName: req.size_name,
        contactInfo: req.contact_info,
        channel,
        subject,
        message,
        preparedAt: nowIso,
        status: 'prepare',
      });
    }

    return preparedList;
  }

  /**
   * Finalizes delivery status once an external carrier (Twilio, Resend, WhatsApp Business API)
   * provides a definitive receipt.
   */
  static async recordDispatchResult(
    requestId: string,
    result: { success: boolean; externalMessageId?: string; error?: string },
    client?: any
  ): Promise<void> {
    const supabase = client || (await createServerSupabaseClient());
    const nowIso = new Date().toISOString();

    const updateFields: any = {
      status: result.success ? 'notifie' : 'echec',
      notified_at: result.success ? nowIso : null,
      admin_notes: result.success
        ? `Notifié avec succès (Message ID: ${result.externalMessageId || 'N/A'})`
        : `Échec notification: ${result.error || 'Erreur passerelle'}`,
    };

    if (result.success) {
      updateFields.resolved_at = nowIso;
    }

    const { error } = await supabase
      .from('restock_requests')
      .update(updateFields)
      .eq('id', requestId);

    if (error) {
      throw new Error(`Erreur lors de la mise à jour du statut de notification: ${error.message}`);
    }
  }

  /**
   * Lists restock requests by status.
   */
  static async listRequests(status?: string, client?: any): Promise<any[]> {
    const supabase = client || (await createServerSupabaseClient());
    let query = supabase.from('restock_requests').select('*').order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }
}
