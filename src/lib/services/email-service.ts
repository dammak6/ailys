// =============================================================================
// AÏLYS Luxury E-commerce — Transactional Email Service Layer
// Graceful reporting: If API key is missing, returns status "PROVIDER_NOT_CONFIGURED"
// and does NOT fail customer orders or transactions.
// =============================================================================

import { AilysRepository } from "@/lib/db/repository";

export interface EmailResult {
  success: boolean;
  status: "SENT" | "PROVIDER_NOT_CONFIGURED" | "FAILED";
  id?: string;
  error?: string;
  recipient?: string;
}

const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY;
const SENDER_EMAIL = process.env.EMAIL_FROM || "Maison AÏLYS <atelier@ailys.tn>";

async function dispatchEmail(payload: {
  to: string;
  subject: string;
  html: string;
}): Promise<EmailResult> {
  if (!RESEND_API_KEY) {
    console.info(`[EmailService] Provider not configured. Skipped email to ${payload.to} with subject "${payload.subject}".`);
    return {
      success: true,
      status: "PROVIDER_NOT_CONFIGURED",
      recipient: payload.to,
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: SENDER_EMAIL,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.warn("[EmailService] Provider error response:", data);
      return {
        success: false,
        status: "FAILED",
        error: data.message || "Failed to send email via provider",
        recipient: payload.to,
      };
    }

    return {
      success: true,
      status: "SENT",
      id: data.id,
      recipient: payload.to,
    };
  } catch (err: any) {
    console.error("[EmailService] Network exception:", err);
    return {
      success: false,
      status: "FAILED",
      error: err.message,
      recipient: payload.to,
    };
  }
}

export const EmailService = {
  /**
   * 1. Order Confirmation Email
   */
  async sendOrderConfirmation(order: any): Promise<EmailResult> {
    const recipient = order.customerEmail || order.email;
    if (!recipient) {
      return {
        success: true,
        status: "PROVIDER_NOT_CONFIGURED",
        recipient: "none",
      };
    }

    const settings = await AilysRepository.getSiteSettings();
    const brandName = settings.brandName || "AÏLYS";
    const atelierAddress = settings.atelierAddress || "Sfax, Tunisie";
    const contactPhone = settings.contactPhone || "+216 11223344";

    const itemsHtml = Array.isArray(order.items)
      ? order.items
          .map(
            (it: any) => `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #E8E6DF; font-family: Georgia, serif; font-size: 14px; color: #0B0B0B;">
                ${it.productName || it.name || "Silhouette AÏLYS"}<br/>
                <span style="font-family: sans-serif; font-size: 11px; color: #7A7770;">Taille: ${it.size || "Standard"} • Qté: ${it.quantity || 1}</span>
              </td>
              <td style="padding: 10px 0; border-bottom: 1px solid #E8E6DF; text-align: right; font-family: sans-serif; font-size: 13px; font-weight: bold; color: #0B0B0B;">
                ${Number(it.price * (it.quantity || 1)).toFixed(3)} TND
              </td>
            </tr>
          `
          )
          .join("")
      : "";

    const html = `
      <div style="background-color: #F5F3EC; padding: 40px 15px; font-family: 'Montserrat', Helvetica, Arial, sans-serif; color: #0B0B0B;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E8E6DF; padding: 35px 30px;">
          <div style="text-align: center; border-bottom: 1px solid #E8E6DF; padding-bottom: 20px;">
            <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 26px; letter-spacing: 0.15em; margin: 0; text-transform: uppercase;">AÏLYS</h1>
            <p style="font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #B79A5B; margin: 5px 0 0 0;">Maison Contemporaine • Sfax</p>
          </div>

          <div style="padding: 30px 0;">
            <h2 style="font-family: Georgia, serif; font-size: 20px; font-weight: normal; margin: 0 0 10px 0;">Confirmation de votre commande</h2>
            <p style="font-size: 13px; line-height: 1.6; color: #555555; margin: 0 0 20px 0;">
              Chère / Cher <strong>${order.customerName || "Cliente / Client"}</strong>,<br/>
              Votre commande <strong>${order.orderCode}</strong> a bien été enregistrée. Nos artisans de l'atelier de Sfax préparent soigneusement votre écrin.
            </p>

            <table style="width: 100%; border-collapse: collapse; margin: 25px 0;">
              ${itemsHtml}
              <tr>
                <td style="padding: 15px 0; font-size: 13px; color: #7A7770;">Sous-total</td>
                <td style="padding: 15px 0; text-align: right; font-size: 13px;">${Number(order.subtotal || order.total).toFixed(3)} TND</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-size: 13px; color: #7A7770;">Livraison (Tunisie)</td>
                <td style="padding: 5px 0; text-align: right; font-size: 13px;">${Number(order.shippingFee || 0).toFixed(3)} TND</td>
              </tr>
              <tr>
                <td style="padding: 15px 0; font-family: Georgia, serif; font-size: 16px; font-weight: bold; border-top: 2px solid #0B0B0B;">Total COD à la livraison</td>
                <td style="padding: 15px 0; text-align: right; font-family: sans-serif; font-size: 18px; font-weight: bold; color: #0B0B0B; border-top: 2px solid #0B0B0B;">
                  ${Number(order.total).toFixed(3)} TND
                </td>
              </tr>
            </table>

            <div style="background-color: #FAF9F5; border: 1px solid #E8E6DF; padding: 15px; margin-top: 20px; font-size: 12px; color: #555555;">
              <strong style="color: #0B0B0B; display: block; margin-bottom: 5px;">Livraison & Paiement :</strong>
              Destination : ${order.address || ""}, ${order.city || ""}, ${order.governorate || ""}<br/>
              Mode : Paiement en espèces à la livraison (Cash on Delivery)<br/>
              Contact livreur : ${order.customerPhone || ""}
            </div>
          </div>

          <div style="border-top: 1px solid #E8E6DF; padding-top: 20px; text-align: center; font-size: 11px; color: #7A7770;">
            <p style="margin: 0;">Maison ${brandName} • ${atelierAddress} • ${contactPhone}</p>
            <p style="margin: 5px 0 0 0; letter-spacing: 0.1em; text-transform: uppercase;">Élégance discrète • Façonnée par la lumière tunisienne</p>
          </div>
        </div>
      </div>
    `;

    return dispatchEmail({
      to: recipient,
      subject: `Confirmation de commande ${order.orderCode} • Maison AÏLYS`,
      html,
    });
  },

  /**
   * 2. Order Status Update Email
   */
  async sendOrderStatusUpdate(order: any, newStatus: string): Promise<EmailResult> {
    const recipient = order.customerEmail || order.email;
    if (!recipient) {
      return { success: true, status: "PROVIDER_NOT_CONFIGURED", recipient: "none" };
    }

    const statusLabels: Record<string, string> = {
      confirme: "Confirmée par l'atelier",
      en_preparation: "En cours de confection / préparation",
      en_livraison: "Remise au coursier pour livraison",
      livre: "Livrée et encaissée",
      annule: "Annulée",
    };

    const label = statusLabels[newStatus] || newStatus;
    const settings = await AilysRepository.getSiteSettings();
    const contactPhone = settings.contactPhone || "+216 11223344";

    const html = `
      <div style="background-color: #F5F3EC; padding: 40px 15px; font-family: 'Montserrat', Helvetica, Arial, sans-serif; color: #0B0B0B;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E8E6DF; padding: 35px 30px;">
          <div style="text-align: center; border-bottom: 1px solid #E8E6DF; padding-bottom: 20px;">
            <h1 style="font-family: Georgia, serif; font-size: 24px; letter-spacing: 0.15em; margin: 0;">AÏLYS</h1>
            <p style="font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #B79A5B; margin: 5px 0 0 0;">Suivi d'Expédition</p>
          </div>

          <div style="padding: 30px 0;">
            <p style="font-size: 14px; line-height: 1.6; color: #333333;">
              Votre commande <strong>${order.orderCode}</strong> a évolué :
            </p>
            <div style="margin: 20px 0; padding: 15px; background-color: #FAF9F5; border-left: 3px solid #B79A5B; font-size: 15px; font-weight: bold; color: #0B0B0B;">
              Statut actuel : ${label}
            </div>
            <p style="font-size: 13px; color: #555555; line-height: 1.6;">
              Notre service logistique et nos coursiers veillent à ce que votre silhouette vous parvienne dans les meilleures conditions.
            </p>
          </div>

          <div style="border-top: 1px solid #E8E6DF; padding-top: 20px; text-align: center; font-size: 11px; color: #7A7770;">
            <p style="margin: 0;">Pour toute question, contactez notre atelier au ${contactPhone}</p>
          </div>
        </div>
      </div>
    `;

    return dispatchEmail({
      to: recipient,
      subject: `Mise à jour de votre commande ${order.orderCode} : ${label}`,
      html,
    });
  },

  /**
   * 3. Return Request Confirmation Email
   */
  async sendReturnRequestConfirmation(returnRequest: any): Promise<EmailResult> {
    const recipient = returnRequest.customerEmail || returnRequest.email;
    if (!recipient) {
      return { success: true, status: "PROVIDER_NOT_CONFIGURED", recipient: "none" };
    }

    const html = `
      <div style="background-color: #F5F3EC; padding: 40px 15px; font-family: 'Montserrat', Helvetica, Arial, sans-serif; color: #0B0B0B;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E8E6DF; padding: 35px 30px;">
          <h2 style="font-family: Georgia, serif; font-size: 20px; margin: 0 0 15px 0;">Demande de Retour / Échange Enregistrée</h2>
          <p style="font-size: 13px; line-height: 1.6; color: #555;">
            Dossier n° <strong>${returnRequest.requestCode || returnRequest.id}</strong><br/>
            Type : <strong>${returnRequest.type === "exchange" ? "Échange de taille" : "Retour & Remboursement"}</strong>
          </p>
          <p style="font-size: 13px; line-height: 1.6; color: #555;">
            Notre conciergerie prend en charge votre demande et vous contactera sous 24h pour organiser la collecte par coursier.
          </p>
        </div>
      </div>
    `;

    return dispatchEmail({
      to: recipient,
      subject: `Dossier de retour ${returnRequest.requestCode || ""} • Maison AÏLYS`,
      html,
    });
  },

  /**
   * 4. Restock Alert Email
   */
  async sendRestockAlert(product: any, contact: string, size?: string): Promise<EmailResult> {
    if (!contact.includes("@")) {
      // SMS contact or phone number
      console.info(`[EmailService] Restock notification for phone contact: ${contact} (Product: ${product.name}, Size: ${size})`);
      return { success: true, status: "PROVIDER_NOT_CONFIGURED", recipient: contact };
    }

    const html = `
      <div style="background-color: #F5F3EC; padding: 40px 15px; font-family: 'Montserrat', Helvetica, Arial, sans-serif; color: #0B0B0B;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E8E6DF; padding: 35px 30px;">
          <h2 style="font-family: Georgia, serif; font-size: 20px;">Silhouette de nouveau disponible en atelier</h2>
          <p style="font-size: 13px; line-height: 1.6; color: #555;">
            La pièce <strong>${product.name}</strong> ${size ? `(Taille ${size})` : ""} est désormais disponible en réassort sur notre boutique en ligne.
          </p>
          <div style="margin: 25px 0; text-align: center;">
            <a href="https://ailys.tn/products/${product.slug}" style="display: inline-block; padding: 12px 25px; background-color: #0B0B0B; color: #F5F3EC; text-decoration: none; text-transform: uppercase; font-size: 11px; letter-spacing: 0.15em;">
              Découvrir la silhouette
            </a>
          </div>
        </div>
      </div>
    `;

    return dispatchEmail({
      to: contact,
      subject: `Réassort : ${product.name} est de nouveau disponible • Maison AÏLYS`,
      html,
    });
  },
};
