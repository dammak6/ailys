import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { InvoiceService } from '@/lib/services/invoice-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    // Verify Admin authentication
    const { data: adminProfiles, error: authError } = await supabase.rpc('get_admin_profile' as any);
    const adminProfile = Array.isArray(adminProfiles) ? adminProfiles[0] : adminProfiles;
    if (authError || !adminProfile || !adminProfile.is_active) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 });
    }

    const invoice = await InvoiceService.getInvoiceForOrder(id, supabase);
    if (!invoice) {
      return NextResponse.json({ error: 'Facture non trouvée pour cette commande' }, { status: 404 });
    }

    // Check if direct download/streaming requested
    const download = request.nextUrl.searchParams.get('download');
    if (download === '1' && invoice.storagePath) {
      const pdfBuffer = await InvoiceService.getInvoicePdfStream(invoice.storagePath, supabase);
      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${invoice.documentNumber}.pdf"`,
          'Content-Length': pdfBuffer.length.toString(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      invoice,
    });
  } catch (error: any) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { error: error?.message || 'Erreur lors de la récupération de la facture' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    // Verify Admin authentication
    const { data: adminProfiles, error: authError } = await supabase.rpc('get_admin_profile' as any);
    const adminProfile = Array.isArray(adminProfiles) ? adminProfiles[0] : adminProfiles;
    if (authError || !adminProfile || !adminProfile.is_active) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 });
    }

    let forceRegenerate = false;
    try {
      const body = await request.json();
      forceRegenerate = !!body?.forceRegenerate;
    } catch {
      // Body is optional
    }

    const invoice = await InvoiceService.generateInvoice(id, { forceRegenerate, client: supabase });

    return NextResponse.json({
      success: true,
      invoice,
    });
  } catch (error: any) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { error: error?.message || 'Erreur lors de la génération de la facture' },
      { status: 500 }
    );
  }
}
