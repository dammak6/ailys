"use client";

import React from "react";
import { Truck, Sparkles, Phone, ShieldCheck } from "lucide-react";
import { BotanicalEmblem } from "@/components/brand/BotanicalEmblem";
import { useSiteSettings } from "@/lib/site-settings-context";

export function AnnouncementBar() {
  const { settings } = useSiteSettings();

  if (!settings.announcementBarActive) {
    return null;
  }

  const marqueeItems = [
    {
      icon: <Sparkles className="w-3.5 h-3.5 text-ailys-gold shrink-0" />,
      text: settings.announcementBarMessage,
    },
    {
      icon: <Truck className="w-3.5 h-3.5 text-ailys-gold shrink-0" />,
      text: `Livraison offerte dès ${settings.freeShippingThreshold} DT partout en Tunisie`,
    },
    {
      icon: <BotanicalEmblem size={11} variant="gold" className="shrink-0" />,
      text: `Confection artisanale à ${settings.atelierAddress || "Sfax, Tunisie"}`,
    },
    {
      icon: <Phone className="w-3 h-3 text-ailys-gold shrink-0" />,
      text: `Service client dédié : ${settings.contactPhone}`,
    },
  ];

  // Duplicate items within each block to guarantee full coverage of wide viewports with zero reset jump
  const displayItems = [...marqueeItems, ...marqueeItems];

  const renderMarqueeBlock = (keyPrefix: string) => (
    <div key={keyPrefix} className="flex items-center space-x-8 sm:space-x-12 shrink-0 px-4">
      {displayItems.map((item, idx) => (
        <React.Fragment key={`${keyPrefix}-${idx}`}>
          <div className="flex items-center gap-2.5 text-ailys-bone/90 hover:text-ailys-gold transition-colors whitespace-nowrap">
            {item.icon}
            <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-medium">
              {item.text}
            </span>
          </div>
          <span className="text-ailys-gold/40 text-xs select-none">•</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div
      role="region"
      aria-label="Annonces Maison AÏLYS"
      className="bg-ailys-black text-ailys-bone py-2 overflow-hidden border-b border-ailys-dark-border select-none relative z-40"
    >
      <div className="w-full overflow-hidden flex">
        <div
          className="animate-marquee-infinite flex shrink-0 items-center"
          style={{ willChange: "transform" }}
        >
          {renderMarqueeBlock("set1")}
          {renderMarqueeBlock("set2")}
        </div>
      </div>
    </div>
  );
}
