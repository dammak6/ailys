"use client";

import React from "react";
import Link from "next/link";
import { X, ChevronRight, Phone, Truck, ShieldCheck } from "lucide-react";
import { AilysLogo } from "../brand/AilysLogo";
import { HairlineRule } from "../brand/HairlineRule";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
}

export function MobileNav({
  isOpen,
  onClose,
}: MobileNavProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-ailys-bone text-ailys-black overflow-y-auto animate-in fade-in duration-300">
      {/* Top Bar with Logo and Close */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-ailys-bone-border sticky top-0 bg-ailys-bone/95 backdrop-blur-md z-10">
        <AilysLogo size="sm" onClick={onClose} />
        <button
          onClick={onClose}
          aria-label="Fermer le menu"
          className="w-11 h-11 flex items-center justify-center -mr-2 text-ailys-black hover:text-ailys-gold transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ailys-gold"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation Body */}
      <div className="flex-1 px-5 sm:px-8 py-6 flex flex-col justify-between">
        <nav className="space-y-7">
          {/* PRIMARY SHOPPING CATEGORIES */}
          <div className="space-y-1 pb-6 border-b border-ailys-bone-border">
            {[
              { href: "/shop", label: "Nouveautés", badge: "2026" },
              { href: "/shop/femme", label: "Femme" },
              { href: "/shop/homme", label: "Homme" },
              { href: "/shop/enfant", label: "Enfant" },
              { href: "/collections", label: "Collections" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between min-h-[48px] py-2 text-xl sm:text-2xl font-editorial-heading tracking-wide text-ailys-black hover:text-ailys-gold transition-colors active:text-ailys-gold"
              >
                <div className="flex items-center gap-2.5">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] uppercase tracking-[0.2em] px-1.5 py-0.5 bg-ailys-gold/15 text-ailys-gold-dark font-sans font-medium rounded-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-ailys-muted" />
              </Link>
            ))}
          </div>

          {/* SECONDARY BRAND & SERVICE LINKS */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-ailys-gold-dark font-semibold block mb-2 font-sans">
              Maison & Services
            </span>
            {[
              { href: "/a-propos", label: "À Propos de la Maison" },
              { href: "/faq", label: "FAQ & Questions Fréquentes" },
              { href: "/contact", label: "Contact & Conciergerie" },
              { href: "/retours-echanges", label: "Retours & Échanges" },
            ].map((link, idx) => (
              <Link
                key={`${link.href}-${idx}`}
                href={link.href}
                onClick={onClose}
                className="flex items-center min-h-[42px] py-1.5 text-xs uppercase tracking-[0.18em] font-sans text-ailys-black/75 hover:text-ailys-gold transition-colors active:text-ailys-gold"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* BOTTOM ATELIER REASSURANCE */}
        <div className="pt-6 mt-8 border-t border-ailys-bone-border space-y-4 font-sans text-xs">
          <div className="flex items-center gap-2.5 text-ailys-black/85 font-medium">
            <Truck className="w-4 h-4 text-ailys-gold shrink-0" />
            <span>Livraison offerte dès 200 DT partout en Tunisie</span>
          </div>

          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-ailys-muted pt-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-ailys-gold" />
              Paiement à la livraison
            </span>
            <span className="font-semibold text-ailys-black">TND / DT</span>
          </div>

          <HairlineRule tone="gold" emblemSize={16} className="my-3" />

          <p className="text-[10px] text-center text-ailys-muted tracking-widest uppercase">
            AÏLYS • Maison Contemporaine Tunisienne
          </p>
        </div>
      </div>
    </div>
  );
}

