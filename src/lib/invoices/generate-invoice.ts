import PDFDocument from 'pdfkit';

export interface InvoiceItem {
  title: string;
  sku?: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface InvoiceSellerInfo {
  brandName?: string;
  address?: string;
  email?: string;
  phone?: string;
}

export interface InvoiceData {
  documentNumber: string;
  orderCode: string;
  createdAt: string;
  finalizedAt?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  city: string;
  governorate: string;
  postalCode?: string;
  paymentMethod: string;
  paymentStatus: string;
  items: InvoiceItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount?: number;
  totalAmount: number;
  notes?: string;
  sellerInfo?: InvoiceSellerInfo;
}

/**
 * Generates an immutable, luxury-styled PDF invoice for AÏLYS orders using PDFKit.
 */
export async function generateInvoicePdfBuffer(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
        info: {
          Title: `Facture ${data.documentNumber}`,
          Author: 'AÏLYS Maison de Couture',
          Subject: `Facture pour commande ${data.orderCode}`,
          Keywords: 'AÏLYS, Facture, Invoice, Tunisie, Haute Couture',
        },
      });

      const buffers: Buffer[] = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      // --- COLORS ---
      const primaryColor = '#1A1A1A';
      const secondaryColor = '#666666';
      const accentGold = '#C5A880';
      const borderColor = '#E5E5E5';
      const backgroundLight = '#FBF9F7';

      // --- HEADER ---
      // Brand Name
      doc
        .font('Helvetica-Bold')
        .fontSize(22)
        .fillColor(primaryColor)
        .text('A Ï L Y S', 40, 45, { characterSpacing: 6 });

      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor(accentGold)
        .text('MAISON DE COUTURE — TUNIS', 42, 70, { characterSpacing: 2 });

      // Invoice Title & Info (Right side)
      doc
        .font('Helvetica-Bold')
        .fontSize(16)
        .fillColor(primaryColor)
        .text('FACTURE COMMERCIALE', 300, 45, { align: 'right' });

      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .fillColor(primaryColor)
        .text(`N° ${data.documentNumber}`, 300, 65, { align: 'right' });

      doc
        .font('Helvetica')
        .fontSize(9)
        .fillColor(secondaryColor)
        .text(`Date : ${new Date(data.createdAt).toLocaleDateString('fr-TN', { day: '2-digit', month: 'long', year: 'numeric' })}`, 300, 80, { align: 'right' })
        .text(`Réf. Commande : ${data.orderCode}`, 300, 93, { align: 'right' });

      // Dividing Line
      doc
        .moveTo(40, 115)
        .lineTo(555, 115)
        .strokeColor(accentGold)
        .lineWidth(1)
        .stroke();

      // --- SELLER & CUSTOMER SECTION ---
      const infoTop = 130;
      const sellerBrand = data.sellerInfo?.brandName || 'AÏLYS Tunisie';
      const sellerAddress = data.sellerInfo?.address || 'Sfax, Tunisie';
      const sellerEmail = data.sellerInfo?.email || 'concierge@ailys.tn';
      const sellerPhone = data.sellerInfo?.phone || '+216 11223344';

      // Emetteur (Seller)
      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor(accentGold)
        .text('ÉMETTEUR', 40, infoTop, { characterSpacing: 1 })
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor(primaryColor)
        .text(sellerBrand, 40, infoTop + 14)
        .font('Helvetica')
        .fontSize(8.5)
        .fillColor(secondaryColor)
        .text(sellerAddress, 40, infoTop + 27)
        .text(`Email : ${sellerEmail}`, 40, infoTop + 40)
        .text(`Tél : ${sellerPhone}`, 40, infoTop + 52)
        .text('Matricule Fiscal : 1234567/B/A/M/000', 40, infoTop + 64);

      // Client (Buyer)
      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor(accentGold)
        .text('DESTINATAIRE & LIVRAISON', 300, infoTop, { characterSpacing: 1 })
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor(primaryColor)
        .text(data.customerName, 300, infoTop + 14)
        .font('Helvetica')
        .fontSize(8.5)
        .fillColor(secondaryColor)
        .text(data.shippingAddress, 300, infoTop + 27)
        .text(`${data.city}, ${data.governorate}${data.postalCode ? ' - ' + data.postalCode : ''}`, 300, infoTop + 39)
        .text(`Tél : ${data.customerPhone}`, 300, infoTop + 51)
        .text(data.customerEmail ? `Email : ${data.customerEmail}` : 'Email : Non renseigné', 300, infoTop + 63)
        .text(`Mode de paiement : ${data.paymentMethod}`, 300, infoTop + 75);

      // --- TABLE ITEMS ---
      let tableTop = 230;

      // Header row background
      doc
        .rect(40, tableTop, 515, 22)
        .fillColor(backgroundLight)
        .fill();

      // Header row borders
      doc
        .rect(40, tableTop, 515, 22)
        .strokeColor(borderColor)
        .lineWidth(0.5)
        .stroke();

      // Header columns
      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .fillColor(primaryColor)
        .text('ARTICLE & DESCRIPTION', 50, tableTop + 7)
        .text('QTÉ', 330, tableTop + 7, { width: 40, align: 'center' })
        .text('PRIX UNIT.', 380, tableTop + 7, { width: 75, align: 'right' })
        .text('TOTAL (TND)', 465, tableTop + 7, { width: 80, align: 'right' });

      let currentY = tableTop + 22;

      data.items.forEach((item, index) => {
        const rowHeight = 28;

        // Alternate or white row
        if (index % 2 === 1) {
          doc
            .rect(40, currentY, 515, rowHeight)
            .fillColor('#FAF9F8')
            .fill();
        }

        // Bottom border
        doc
          .moveTo(40, currentY + rowHeight)
          .lineTo(555, currentY + rowHeight)
          .strokeColor(borderColor)
          .lineWidth(0.5)
          .stroke();

        // Title and variant details
        const variantDesc = [item.size ? `Taille: ${item.size}` : null, item.color ? `Couleur: ${item.color}` : null, item.sku ? `SKU: ${item.sku}` : null]
          .filter(Boolean)
          .join(' | ');

        doc
          .font('Helvetica-Bold')
          .fontSize(8.5)
          .fillColor(primaryColor)
          .text(item.title, 50, currentY + 5, { width: 270, ellipsis: true });

        if (variantDesc) {
          doc
            .font('Helvetica')
            .fontSize(7.5)
            .fillColor(secondaryColor)
            .text(variantDesc, 50, currentY + 16, { width: 270, ellipsis: true });
        }

        // Qty
        doc
          .font('Helvetica')
          .fontSize(8.5)
          .fillColor(primaryColor)
          .text(item.quantity.toString(), 330, currentY + 9, { width: 40, align: 'center' });

        // Unit Price
        doc
          .text(`${item.unitPrice.toFixed(3)} DT`, 380, currentY + 9, { width: 75, align: 'right' });

        // Line Total
        doc
          .font('Helvetica-Bold')
          .text(`${item.totalPrice.toFixed(3)} DT`, 465, currentY + 9, { width: 80, align: 'right' });

        currentY += rowHeight;
      });

      // --- TOTALS SUMMARY ---
      const totalsTop = currentY + 15;
      const totalsLeft = 320;
      const totalsWidth = 235;

      doc
        .font('Helvetica')
        .fontSize(8.5)
        .fillColor(secondaryColor)
        .text('Sous-total articles :', totalsLeft, totalsTop)
        .fillColor(primaryColor)
        .text(`${data.subtotal.toFixed(3)} DT`, totalsLeft, totalsTop, { width: totalsWidth, align: 'right' });

      let nextTotalsY = totalsTop + 14;

      if (data.discountAmount && data.discountAmount > 0) {
        doc
          .fillColor(secondaryColor)
          .text('Remise appliquée :', totalsLeft, nextTotalsY)
          .fillColor('#A33')
          .text(`-${data.discountAmount.toFixed(3)} DT`, totalsLeft, nextTotalsY, { width: totalsWidth, align: 'right' });
        nextTotalsY += 14;
      }

      doc
        .fillColor(secondaryColor)
        .text('Frais de livraison :', totalsLeft, nextTotalsY)
        .fillColor(primaryColor)
        .text(data.deliveryFee === 0 ? 'Offerte (Gratuit)' : `${data.deliveryFee.toFixed(3)} DT`, totalsLeft, nextTotalsY, { width: totalsWidth, align: 'right' });
      nextTotalsY += 18;

      // Grand Total Highlight Box
      doc
        .rect(totalsLeft - 10, nextTotalsY - 4, totalsWidth + 20, 26)
        .fillColor(backgroundLight)
        .fill();

      doc
        .rect(totalsLeft - 10, nextTotalsY - 4, totalsWidth + 20, 26)
        .strokeColor(accentGold)
        .lineWidth(1)
        .stroke();

      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .fillColor(primaryColor)
        .text('NET À PAYER (COD) :', totalsLeft, nextTotalsY + 4)
        .fontSize(11)
        .fillColor(primaryColor)
        .text(`${data.totalAmount.toFixed(3)} TND`, totalsLeft, nextTotalsY + 3, { width: totalsWidth, align: 'right' });

      // --- FOOTER LEGAL NOTES ---
      const footerTop = 720;

      doc
        .moveTo(40, footerTop)
        .lineTo(555, footerTop)
        .strokeColor(borderColor)
        .lineWidth(0.5)
        .stroke();

      doc
        .font('Helvetica-Bold')
        .fontSize(7.5)
        .fillColor(accentGold)
        .text('CONDITIONS & POLITIQUE DE RETOUR', 40, footerTop + 8, { characterSpacing: 1 });

      doc
        .font('Helvetica')
        .fontSize(7)
        .fillColor(secondaryColor)
        .text('• Les articles AÏLYS bénéficient d\'un droit d\'échange ou de retour sous 14 jours calendaires suivant la date de réception.', 40, footerTop + 19)
        .text('• Les pièces doivent être restituées non portées, non lavées, avec leurs étiquettes d\'origine scellées et dans leur écrin protecteur.', 40, footerTop + 28)
        .text(`• Pour toute demande de conciergerie ou d'ajustement sur mesure, contactez : ${sellerEmail} ou au ${sellerPhone}.`, 40, footerTop + 37)
        .text('AÏLYS S.A.R.L — Société immatriculée au Registre National des Entreprises de Tunisie. Facture émise sous scellement électronique.', 40, footerTop + 49, { align: 'center', width: 515 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
