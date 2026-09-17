import React from "react";
import { Truck, Sparkles, Phone } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-ailys-black text-ailys-bone py-2 px-4 border-b border-ailys-dark-border text-[11px] font-sans tracking-[0.18em] uppercase select-none transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Delivery info */}
        <div className="hidden md:flex items-center gap-2 text-ailys-bone/80">
          <Truck className="w-3.5 h-3.5 text-ailys-gold" />
          <span>Livraison partout en Tunisie</span>
        </div>

        {/* Center: Brand tagline */}
        <div className="mx-auto flex items-center gap-2 text-center text-ailys-bone/90 font-medium">
          <Sparkles className="w-3 h-3 text-ailys-gold shrink-0" />
          <span>Élégance intemporelle • Façonnée par la lumière tunisienne</span>
          <Sparkles className="w-3 h-3 text-ailys-gold shrink-0 hidden sm:inline" />
        </div>

        {/* Right: Customer support */}
        <div className="hidden lg:flex items-center gap-2 text-ailys-bone/80 hover:text-ailys-gold transition-colors">
          <Phone className="w-3 h-3 text-ailys-gold" />
          <a href="tel:+21670000000">+216 70 000 000</a>
        </div>
      </div>
    </div>
  );
}
