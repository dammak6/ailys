"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, ChevronRight, Phone, Search, ShoppingBag } from "lucide-react";
import { AilysLogo } from "../brand/AilysLogo";
import { BotanicalEmblem } from "../brand/BotanicalEmblem";
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
  cartCount = 0,
  onOpenCart,
}: MobileNavProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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
      {/* Top Bar inside Mobile Nav */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-ailys-bone-border">
        <AilysLogo size="sm" onClick={onClose} />
        <button
          onClick={onClose}
          aria-label="Fermer le menu"
          className="p-2 text-ailys-black hover:text-ailys-gold transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 px-6 py-8 flex flex-col justify-between">
        <nav className="space-y-6">
          {/* SHOP Mega Section */}
          <div className="space-y-3 pb-6 border-b border-ailys-bone-border">
            <span className="text-[10px] uppercase tracking-[0.25em] text-ailys-gold-dark font-semibold">
              Boutique
            </span>
            <div className="space-y-3">
              <Link
                href="/shop/femme"
                onClick={onClose}
                className="flex items-center justify-between text-2xl font-editorial-heading tracking-wide hover:text-ailys-gold transition-colors"
              >
                <span>Femme</span>
                <ChevronRight className="w-5 h-5 text-ailys-muted" />
              </Link>
              <Link
                href="/shop/homme"
                onClick={onClose}
                className="flex items-center justify-between text-2xl font-editorial-heading tracking-wide hover:text-ailys-gold transition-colors"
              >
                <span>Homme</span>
                <ChevronRight className="w-5 h-5 text-ailys-muted" />
              </Link>
              <Link
                href="/shop/enfant"
                onClick={onClose}
                className="flex items-center justify-between text-2xl font-editorial-heading tracking-wide hover:text-ailys-gold transition-colors"
              >
                <span>Enfant</span>
                <ChevronRight className="w-5 h-5 text-ailys-muted" />
              </Link>
              <Link
                href="/shop"
                onClick={onClose}
                className="flex items-center justify-between text-base uppercase tracking-[0.2em] text-ailys-gold font-medium pt-2"
              >
                <span>Tout Découvrir</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Secondary Brand Links */}
          <div className="space-y-4 pt-2">
            <Link
              href="/collections"
              onClick={onClose}
              className="block text-sm uppercase tracking-[0.2em] hover:text-ailys-gold transition-colors"
            >
              Collections & Lookbooks
            </Link>
            <Link
              href="/a-propos"
              onClick={onClose}
              className="block text-sm uppercase tracking-[0.2em] hover:text-ailys-gold transition-colors"
            >
              L&apos;Histoire AÏLYS
            </Link>
            <Link
              href="/retours-echanges"
              onClick={onClose}
              className="block text-sm uppercase tracking-[0.2em] hover:text-ailys-gold transition-colors"
            >
              Retours & Échanges
            </Link>
            <Link
              href="/contact"
              onClick={onClose}
              className="block text-sm uppercase tracking-[0.2em] hover:text-ailys-gold transition-colors"
            >
              Service Client
            </Link>
            <Link
              href="/faq"
              onClick={onClose}
              className="block text-sm uppercase tracking-[0.2em] hover:text-ailys-gold transition-colors"
            >
              FAQ
            </Link>
          </div>
        </nav>

        {/* Bottom Contact & Reassurance */}
        <div className="pt-8 mt-8 border-t border-ailys-bone-border space-y-4">
          <div className="flex items-center justify-between text-xs tracking-wider uppercase text-ailys-muted">
            <span>Paiement à la livraison</span>
            <span>TND / DT</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-ailys-black">
            <Phone className="w-4 h-4 text-ailys-gold" />
            <a href="tel:+21670000000" className="hover:text-ailys-gold transition-colors">
              +216 70 000 000
            </a>
          </div>

          <HairlineRule tone="gold" emblemSize={18} className="my-4" />

          <p className="text-[11px] text-center text-ailys-muted tracking-widest uppercase">
            Façonné par la lumière tunisienne
          </p>
        </div>
      </div>
    </div>
  );
}
