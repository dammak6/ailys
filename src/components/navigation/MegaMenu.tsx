"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { HairlineRule } from "../brand/HairlineRule";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  if (!isOpen) return null;

  const categories = [
    {
      title: "FEMME",
      href: "/shop/femme",
      image: "/images/editorial/02_ailys_portrait.png",
      featuredText: "L'allure sport-chic au féminin",
      sublinks: [
        { label: "Voir tout Femme", href: "/shop/femme" },
        { label: "Ensembles & Tailleurs", href: "/shop/femme?sub=ensembles" },
        { label: "Robes Intemporelles", href: "/shop/femme?sub=robes" },
        { label: "Vestes & Zippés", href: "/shop/femme?sub=vestes" },
        { label: "Pantalons & Jupes", href: "/shop/femme?sub=bas" },
      ],
    },
    {
      title: "HOMME",
      href: "/shop/homme",
      image: "/images/editorial/05_movement.png",
      featuredText: "Coupes épurées & matières nobles",
      sublinks: [
        { label: "Voir tout Homme", href: "/shop/homme" },
        { label: "Polos & Mailles", href: "/shop/homme?sub=polos" },
        { label: "Vestes de Sport-Chic", href: "/shop/homme?sub=vestes" },
        { label: "Pantalons Chino & Lin", href: "/shop/homme?sub=pantalons" },
        { label: "Chemises Légères", href: "/shop/homme?sub=chemises" },
      ],
    },
    {
      title: "ENFANT",
      href: "/shop/enfant",
      image: "/images/editorial/08_mediterranean_street.png",
      featuredText: "L'élégance familiale partagée",
      sublinks: [
        { label: "Voir tout Enfant", href: "/shop/enfant" },
        { label: "Ensembles Fille", href: "/shop/enfant?sub=fille" },
        { label: "Ensembles Garçon", href: "/shop/enfant?sub=garcon" },
        { label: "Mini-Capsules Famille", href: "/shop/enfant?sub=capsule" },
        { label: "Robes & Polos", href: "/shop/enfant?sub=robes-polos" },
      ],
    },
  ];

  return (
    <div
      className="absolute top-full left-0 w-full bg-ailys-bone border-b border-ailys-bone-border shadow-editorial z-40 transition-all duration-300 animate-in fade-in slide-in-from-top-1"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {categories.map((cat) => (
            <div key={cat.title} className="group flex flex-col">
              {/* Category Image */}
              <Link
                href={cat.href}
                onClick={onClose}
                className="relative block w-full aspect-[16/10] overflow-hidden bg-ailys-bone-dark/50 mb-5"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs uppercase tracking-[0.25em] text-white font-medium">
                    {cat.title}
                  </span>
                </div>
              </Link>

              {/* Category Title */}
              <Link
                href={cat.href}
                onClick={onClose}
                className="flex items-center justify-between text-ailys-black group-hover:text-ailys-gold transition-colors pb-2 mb-3 border-b border-ailys-bone-border"
              >
                <h3 className="font-editorial-heading text-xl tracking-wide">
                  {cat.title}
                </h3>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <p className="text-xs font-sans text-ailys-muted mb-4 italic">
                {cat.featuredText}
              </p>

              {/* Sublinks */}
              <ul className="space-y-2 text-xs uppercase tracking-[0.15em] font-sans">
                {cat.sublinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="text-ailys-black/70 hover:text-ailys-gold hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer of mega menu */}
        <div className="mt-8 pt-6 border-t border-ailys-bone-border/60 flex items-center justify-between text-xs tracking-widest uppercase text-ailys-muted">
          <span>Nouvelle collection Automne / Hiver disponible</span>
          <Link
            href="/collections"
            onClick={onClose}
            className="text-ailys-black hover:text-ailys-gold flex items-center gap-1.5 font-medium transition-colors"
          >
            Explorer les lookbooks <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
