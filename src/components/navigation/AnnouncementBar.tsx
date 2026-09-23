import React from "react";
import { Truck, Sparkles, Phone, ShieldCheck } from "lucide-react";
import { BotanicalEmblem } from "@/components/brand/BotanicalEmblem";

export function AnnouncementBar() {
  const marqueeItems = [
    {
      icon: <Truck className="w-3.5 h-3.5 text-ailys-gold shrink-0" />,
      text: "Livraison offerte dès 200 DT partout en Tunisie",
    },
    {
      icon: <BotanicalEmblem size={11} variant="gold" className="shrink-0" />,
      text: "Confection artisanale à Sfax",
    },
    {
      icon: <ShieldCheck className="w-3.5 h-3.5 text-ailys-gold shrink-0" />,
      text: "Retours & échanges sous 14 jours",
    },
    {
      icon: <Phone className="w-3 h-3 text-ailys-gold shrink-0" />,
      text: "Service client dédié : +216 29 888 888",
    },
  ];

  const renderMarqueeBlock = (keyPrefix: string) => (
    <div key={keyPrefix} className="flex items-center space-x-8 sm:space-x-12 shrink-0 px-4">
      {marqueeItems.map((item, idx) => (
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
        <div className="animate-marquee-infinite flex shrink-0 items-center">
          {renderMarqueeBlock("set1")}
          {renderMarqueeBlock("set2")}
        </div>
      </div>
    </div>
  );
}
