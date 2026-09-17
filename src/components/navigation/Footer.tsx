"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Phone, Mail, ShieldCheck, RefreshCw, Truck } from "lucide-react";
import { AilysLogo } from "../brand/AilysLogo";
import { BotanicalEmblem } from "../brand/BotanicalEmblem";
import { HairlineRule } from "../brand/HairlineRule";

export function Footer() {
  return (
    <footer className="bg-ailys-black text-ailys-bone pt-16 pb-12 border-t border-ailys-dark-border">
      {/* 1. Value Props Reassurance Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-16 border-b border-ailys-dark-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
            <Truck className="w-5 h-5 text-ailys-gold shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs uppercase tracking-[0.18em] font-medium text-ailys-bone">
                Livraison en Tunisie
              </h4>
              <p className="text-xs text-ailys-bone/60 mt-1 font-sans">
                Expédition soignée sur tout le territoire
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
            <ShieldCheck className="w-5 h-5 text-ailys-gold shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs uppercase tracking-[0.18em] font-medium text-ailys-bone">
                Paiement à la livraison
              </h4>
              <p className="text-xs text-ailys-bone/60 mt-1 font-sans">
                Réglez en espèces à la réception de votre colis
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
            <RefreshCw className="w-5 h-5 text-ailys-gold shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs uppercase tracking-[0.18em] font-medium text-ailys-bone">
                Retours & Échanges
              </h4>
              <p className="text-xs text-ailys-bone/60 mt-1 font-sans">
                Procédure simplifiée avec votre code commande
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
            <Phone className="w-5 h-5 text-ailys-gold shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs uppercase tracking-[0.18em] font-medium text-ailys-bone">
                Service Conciergerie
              </h4>
              <p className="text-xs text-ailys-bone/60 mt-1 font-sans">
                Disponible par téléphone et WhatsApp
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand Presentation (Col 1-4) */}
          <div className="md:col-span-4 flex flex-col items-start space-y-6">
            <AilysLogo variant="gold" size="lg" />
            <p className="text-xs font-sans text-ailys-bone/70 leading-relaxed max-w-sm">
              Maison de confection contemporaine tunisienne. Des silhouettes
              sport-chic et intemporelles, pensées pour le quotidien et façonnées
              par la lumière méditerranéenne.
            </p>
            <div className="flex items-center gap-4 text-ailys-bone/70">
              <a
                href="https://instagram.com/ailys.officiel"
                target="_blank"
                rel="noreferrer"
                className="hover:text-ailys-gold transition-colors p-1"
                aria-label="Instagram AÏLYS"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://facebook.com/ailys"
                target="_blank"
                rel="noreferrer"
                className="hover:text-ailys-gold transition-colors p-1"
                aria-label="Facebook AÏLYS"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Boutique Navigation (Col 5-7) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] font-medium text-ailys-gold">
              Boutique
            </h4>
            <ul className="space-y-2.5 text-xs uppercase tracking-[0.16em] font-sans text-ailys-bone/70">
              <li>
                <Link href="/shop/femme" className="hover:text-ailys-gold transition-colors">
                  Femme
                </Link>
              </li>
              <li>
                <Link href="/shop/homme" className="hover:text-ailys-gold transition-colors">
                  Homme
                </Link>
              </li>
              <li>
                <Link href="/shop/enfant" className="hover:text-ailys-gold transition-colors">
                  Enfant
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-ailys-gold transition-colors">
                  Collections & Lookbooks
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-ailys-gold transition-colors">
                  Toutes les pièces
                </Link>
              </li>
            </ul>
          </div>

          {/* Service & Maison (Col 8-9) */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] font-medium text-ailys-gold">
              Maison
            </h4>
            <ul className="space-y-2.5 text-xs uppercase tracking-[0.16em] font-sans text-ailys-bone/70">
              <li>
                <Link href="/a-propos" className="hover:text-ailys-gold transition-colors">
                  L&apos;Histoire AÏLYS
                </Link>
              </li>
              <li>
                <Link href="/retours-echanges" className="hover:text-ailys-gold transition-colors">
                  Retours & Échanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-ailys-gold transition-colors">
                  Questions Fréquentes
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-ailys-gold transition-colors">
                  Contact & Atelier
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter (Col 10-12) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] font-medium text-ailys-gold">
              Correspondance
            </h4>
            <p className="text-xs text-ailys-bone/70 font-sans leading-relaxed">
              Recevez en avant-première nos lancements de collections et séries limitées.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center border border-ailys-dark-border focus-within:border-ailys-gold transition-colors"
            >
              <input
                type="email"
                placeholder="Votre adresse email"
                className="w-full bg-transparent px-3 py-2.5 text-xs text-ailys-bone placeholder:text-ailys-bone/40 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="S'inscrire"
                className="p-2.5 bg-ailys-gold text-ailys-black hover:bg-ailys-gold-light transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 3. Bottom Hairline & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-8 border-t border-ailys-dark-border/60">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.18em] text-ailys-bone/50">
          <div className="flex items-center gap-2">
            <BotanicalEmblem size={16} variant="gold" />
            <span>© {new Date().getFullYear()} AÏLYS. Tous droits réservés.</span>
          </div>
          <div>
            <span>Quiet confidence, shaped by Tunisian light.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
