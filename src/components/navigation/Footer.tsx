"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Phone, Mail, ShieldCheck, RefreshCw, Truck } from "lucide-react";
import { AilysLogo } from "../brand/AilysLogo";
import { BotanicalEmblem } from "../brand/BotanicalEmblem";
import { HairlineRule } from "../brand/HairlineRule";

export function Footer() {
  const [openSection, setOpenSection] = React.useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <footer className="bg-ailys-black text-ailys-bone pt-12 sm:pt-16 pb-12 border-t border-ailys-dark-border">
      {/* 1. Value Props Reassurance Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-10 sm:pb-16 border-b border-ailys-dark-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-left">
          <div className="flex flex-col sm:flex-row items-start gap-2.5 sm:gap-3.5 p-3 sm:p-0 bg-ailys-black/40 sm:bg-transparent rounded-sm border border-ailys-dark-border/40 sm:border-none">
            <Truck className="w-5 h-5 text-ailys-gold shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs uppercase tracking-[0.16em] font-medium text-ailys-bone">
                Livraison 24h - 48h
              </h4>
              <p className="text-[11px] sm:text-xs text-ailys-bone/60 mt-0.5 sm:mt-1 font-sans">
                Expédié depuis l&apos;atelier de Sfax
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-2.5 sm:gap-3.5 p-3 sm:p-0 bg-ailys-black/40 sm:bg-transparent rounded-sm border border-ailys-dark-border/40 sm:border-none">
            <ShieldCheck className="w-5 h-5 text-ailys-gold shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs uppercase tracking-[0.16em] font-medium text-ailys-bone">
                Paiement à la livraison
              </h4>
              <p className="text-[11px] sm:text-xs text-ailys-bone/60 mt-0.5 sm:mt-1 font-sans">
                Espèces à la réception du colis
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-2.5 sm:gap-3.5 p-3 sm:p-0 bg-ailys-black/40 sm:bg-transparent rounded-sm border border-ailys-dark-border/40 sm:border-none">
            <RefreshCw className="w-5 h-5 text-ailys-gold shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs uppercase tracking-[0.16em] font-medium text-ailys-bone">
                Retours & Échanges
              </h4>
              <p className="text-[11px] sm:text-xs text-ailys-bone/60 mt-0.5 sm:mt-1 font-sans">
                Procédure simplifiée sous 7 jours
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-2.5 sm:gap-3.5 p-3 sm:p-0 bg-ailys-black/40 sm:bg-transparent rounded-sm border border-ailys-dark-border/40 sm:border-none">
            <Phone className="w-5 h-5 text-ailys-gold shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs uppercase tracking-[0.16em] font-medium text-ailys-bone">
                Conciergerie
              </h4>
              <p className="text-[11px] sm:text-xs text-ailys-bone/60 mt-0.5 sm:mt-1 font-sans">
                Disponible par WhatsApp & Tel
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">
          {/* Brand Presentation (Col 1-4) */}
          <div className="md:col-span-4 flex flex-col items-start space-y-4 sm:space-y-6">
            <AilysLogo variant="light" size="lg" />
            <p className="text-xs font-sans text-ailys-bone/70 leading-relaxed max-w-sm">
              Maison de confection contemporaine tunisienne. Des silhouettes
              sport-chic et intemporelles, façonnées dans notre atelier de Sfax.
            </p>
            <div className="flex items-center gap-2 text-ailys-bone/70">
              <a
                href="https://instagram.com/ailys.officiel"
                target="_blank"
                rel="noreferrer"
                className="hover:text-ailys-gold transition-colors w-11 h-11 flex items-center justify-center border border-ailys-dark-border/60 hover:border-ailys-gold/50"
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
                className="hover:text-ailys-gold transition-colors w-11 h-11 flex items-center justify-center border border-ailys-dark-border/60 hover:border-ailys-gold/50"
                aria-label="Facebook AÏLYS"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Boutique Navigation (Col 5-7) */}
          <div className="md:col-span-3 border-t md:border-t-0 border-ailys-dark-border/60 pt-4 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection("boutique")}
              className="w-full flex items-center justify-between text-xs uppercase tracking-[0.25em] font-medium text-ailys-gold md:pointer-events-none pb-2 md:pb-4"
            >
              <span>Boutique</span>
              <span className="md:hidden text-lg font-light">
                {openSection === "boutique" ? "−" : "+"}
              </span>
            </button>
            <ul className={`space-y-2.5 text-xs uppercase tracking-[0.16em] font-sans text-ailys-bone/70 ${openSection === "boutique" ? "block pb-4" : "hidden md:block"}`}>
              <li>
                <Link href="/shop/femme" className="hover:text-ailys-gold transition-colors block py-1">
                  Femme
                </Link>
              </li>
              <li>
                <Link href="/shop/homme" className="hover:text-ailys-gold transition-colors block py-1">
                  Homme
                </Link>
              </li>
              <li>
                <Link href="/shop/enfant" className="hover:text-ailys-gold transition-colors block py-1">
                  Enfant
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-ailys-gold transition-colors block py-1">
                  Collections & Lookbooks
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-ailys-gold transition-colors block py-1">
                  Toutes les pièces
                </Link>
              </li>
            </ul>
          </div>

          {/* Service & Maison (Col 8-9) */}
          <div className="md:col-span-2 border-t md:border-t-0 border-ailys-dark-border/60 pt-4 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection("maison")}
              className="w-full flex items-center justify-between text-xs uppercase tracking-[0.25em] font-medium text-ailys-gold md:pointer-events-none pb-2 md:pb-4"
            >
              <span>Maison & Services</span>
              <span className="md:hidden text-lg font-light">
                {openSection === "maison" ? "−" : "+"}
              </span>
            </button>
            <ul className={`space-y-2.5 text-xs uppercase tracking-[0.16em] font-sans text-ailys-bone/70 ${openSection === "maison" ? "block pb-4" : "hidden md:block"}`}>
              <li>
                <Link href="/a-propos" className="hover:text-ailys-gold transition-colors block py-1">
                  L&apos;Histoire AÏLYS
                </Link>
              </li>
              <li>
                <Link href="/retours-echanges" className="hover:text-ailys-gold transition-colors block py-1">
                  Retours & Échanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-ailys-gold transition-colors block py-1">
                  Questions Fréquentes
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-ailys-gold transition-colors block py-1">
                  Contact & Atelier
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter (Col 10-12) */}
          <div className="md:col-span-3 border-t md:border-t-0 border-ailys-dark-border/60 pt-6 md:pt-0 space-y-3 sm:space-y-4">
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
                className="w-full h-11 bg-transparent px-3 py-2 text-base sm:text-xs text-ailys-bone placeholder:text-ailys-bone/40 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="S'inscrire"
                className="w-11 h-11 flex items-center justify-center bg-ailys-gold text-ailys-black hover:bg-ailys-gold-light transition-colors shrink-0"
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
