"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, Sparkles } from "lucide-react";
import { BotanicalEmblem } from "@/components/brand/BotanicalEmblem";
import { HairlineRule } from "@/components/brand/HairlineRule";

export interface FlashcardData {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  editorialDetails: string[];
  image: string;
}

interface FlashcardModalProps {
  card: FlashcardData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FlashcardModal({ card, isOpen, onClose }: FlashcardModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !card) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="flashcard-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative bg-ailys-bone w-full max-w-3xl rounded-sm border border-ailys-bone-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Authentic Editorial Photographic Display */}
        <div className="relative w-full md:w-1/2 aspect-4/3 md:aspect-auto min-h-[220px] md:min-h-[460px] bg-ailys-black shrink-0 overflow-hidden">
          <Image
            src={card.image}
            alt={card.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-xs border border-white/20 md:hidden">
            <BotanicalEmblem size={12} variant="gold" />
            <span className="text-[9px] uppercase tracking-widest text-ailys-bone font-sans font-medium">
              Atelier AÏLYS
            </span>
          </div>
        </div>

        {/* Right: Editorial Narrative Content */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          {/* Header & Close Button */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-ailys-bone-border/70">
              <div className="flex items-center gap-2">
                <BotanicalEmblem size={14} variant="gold" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-ailys-gold-dark font-medium font-sans">
                  {card.badge}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer la fiche"
                className="w-9 h-9 -mr-2 flex items-center justify-center text-ailys-muted hover:text-ailys-black transition-colors rounded-xs focus:outline-none focus-visible:ring-1 focus-visible:ring-ailys-gold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title & Subtitle */}
            <div className="mt-4 space-y-1.5">
              <h3
                id="flashcard-title"
                className="font-editorial-heading text-2xl sm:text-3xl text-ailys-black tracking-tight"
              >
                {card.title}
              </h3>
              <p className="font-serif italic text-xs sm:text-sm text-ailys-black/75">
                {card.subtitle}
              </p>
            </div>

            <HairlineRule tone="gold" className="my-4" />

            {/* Description */}
            <p className="font-sans text-xs sm:text-sm text-ailys-black/80 font-light leading-relaxed">
              {card.description}
            </p>

            {/* Specific Craftsmanship Pillars */}
            {card.editorialDetails && card.editorialDetails.length > 0 && (
              <div className="mt-5 space-y-2.5 pt-4 border-t border-ailys-bone-border/50">
                <span className="text-[10px] uppercase tracking-[0.2em] text-ailys-muted font-sans font-medium block">
                  Exigences de l'Atelier :
                </span>
                <ul className="space-y-2">
                  {card.editorialDetails.map((detail, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs font-sans text-ailys-black/85 font-light"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-ailys-gold shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer Close Action */}
          <div className="pt-6 mt-6 border-t border-ailys-bone-border/60 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-ailys-muted font-sans">
              Maison AÏLYS • Sfax
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-ailys-black hover:bg-ailys-gold hover:text-ailys-black text-ailys-bone text-xs uppercase tracking-[0.18em] font-sans font-medium transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
