"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { PRODUCTS } from "@/lib/data";
import { AilysLogo } from "../brand/AilysLogo";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";

interface HeaderProps {
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
}

export function Header({
  cartCount,
  onOpenCart,
  onOpenSearch,
}: HeaderProps) {
  const cart = useCart();
  const activeCartCount = cartCount !== undefined ? cartCount : cart.totalItems;
  const handleOpenCart = onOpenCart || (() => cart.setIsCartOpen(true));
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenSearch = onOpenSearch || (() => setIsSearchModalOpen(true));

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-500 ease-editorial",
          isScrolled
            ? "bg-ailys-bone/95 backdrop-blur-md border-b border-ailys-bone-border/70 py-2.5 shadow-subtle"
            : "bg-ailys-bone border-b border-ailys-bone-border py-4 sm:py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden w-12">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="p-1.5 text-ailys-black hover:text-ailys-gold transition-colors focus:outline-none"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Left: Clean Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-sans uppercase tracking-[0.2em] font-medium text-ailys-black lg:w-1/3">
            {/* SHOP with MegaMenu trigger */}
            <div
              className="relative py-2"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
            >
              <button
                type="button"
                className={cn(
                  "flex items-center gap-1.5 hover:text-ailys-gold transition-colors tracking-[0.22em]",
                  isMegaMenuOpen && "text-ailys-gold"
                )}
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              >
                <span>Boutique</span>
                <ChevronDown
                  className={cn(
                    "w-3 h-3 transition-transform duration-300",
                    isMegaMenuOpen && "rotate-180 text-ailys-gold"
                  )}
                />
              </button>
            </div>

            <Link
              href="/collections"
              className="hover:text-ailys-gold transition-colors tracking-[0.22em]"
            >
              Collections
            </Link>

            <Link
              href="/a-propos"
              className="hover:text-ailys-gold transition-colors tracking-[0.22em]"
            >
              À Propos
            </Link>
          </nav>

          {/* Center: Authoritative AÏLYS Official Logo */}
          <div className="flex-1 lg:w-1/3 flex justify-center items-center px-4">
            <AilysLogo
              size={isScrolled ? "sm" : "md"}
              className={cn(
                "transition-all duration-500",
                isScrolled ? "scale-95" : "scale-100"
              )}
            />
          </div>

          {/* Right: Search & Cart (No Accounts per instructions) */}
          <div className="flex items-center justify-end gap-4 sm:gap-6 text-ailys-black lg:w-1/3">
            <button
              type="button"
              onClick={handleOpenSearch}
              className="p-1.5 hover:text-ailys-gold transition-colors"
              aria-label="Rechercher"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            <button
              type="button"
              onClick={handleOpenCart}
              className="relative p-1.5 hover:text-ailys-gold transition-colors"
              aria-label="Panier d'achats"
            >
              <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              {activeCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-ailys-black text-ailys-bone text-[9px] font-sans flex items-center justify-center font-medium border border-ailys-bone">
                  {activeCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Mega Menu Dropdown */}
        <MegaMenu
          isOpen={isMegaMenuOpen}
          onClose={() => setIsMegaMenuOpen(false)}
        />
      </header>

      {/* Interactive Search Overlay Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-ailys-bone/98 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col h-full">
            {/* Top Row: Search Input & Close Button */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-ailys-bone-border">
              <div className="flex items-center gap-3 flex-1">
                <Search className="w-5 h-5 text-ailys-gold shrink-0" />
                <input
                  type="search"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un modèle, matière (lin, soie, polo, tailleur)..."
                  className="w-full bg-transparent text-lg sm:text-2xl font-editorial-heading text-ailys-black placeholder:text-ailys-muted/50 focus:outline-none"
                />
              </div>
              <button
                onClick={() => {
                  setIsSearchModalOpen(false);
                  setSearchQuery("");
                }}
                className="p-2 text-ailys-black hover:text-ailys-gold transition-colors"
                aria-label="Fermer la recherche"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Live Search Results */}
            <div className="flex-1 overflow-y-auto py-6">
              {searchQuery.trim() === "" ? (
                <div className="text-left space-y-4 pt-4">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-ailys-muted font-medium">
                    Recherches fréquentes
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["Tailleur", "Robe Midi", "Polo Homme", "Lin Lavé", "Soie", "Enfant"].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setSearchQuery(term)}
                        className="px-3.5 py-1.5 text-xs font-sans tracking-wider uppercase border border-ailys-bone-border hover:border-ailys-gold hover:text-ailys-gold transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {(() => {
                    const q = searchQuery.toLowerCase();
                    const matches = PRODUCTS.filter(
                      (p) =>
                        p.name.toLowerCase().includes(q) ||
                        p.category.toLowerCase().includes(q) ||
                        p.subCategory.toLowerCase().includes(q) ||
                        p.description.toLowerCase().includes(q) ||
                        p.materials.toLowerCase().includes(q)
                    );

                    if (matches.length === 0) {
                      return (
                        <div className="text-center py-16 space-y-2">
                          <p className="font-editorial-heading text-xl text-ailys-black">
                            Aucun résultat pour « {searchQuery} »
                          </p>
                          <p className="text-xs text-ailys-muted font-sans">
                            Essayez une recherche plus générale ou consultez notre catalogue complet.
                          </p>
                          <Link
                            href="/shop"
                            onClick={() => setIsSearchModalOpen(false)}
                            className="inline-block text-xs uppercase tracking-widest text-ailys-gold hover:underline pt-4"
                          >
                            Voir toute la boutique &rarr;
                          </Link>
                        </div>
                      );
                    }

                    return (
                      <div>
                        <div className="text-xs font-sans text-ailys-muted uppercase tracking-widest mb-4">
                          {matches.length} résultat{matches.length > 1 ? "s" : ""} trouvé{matches.length > 1 ? "s" : ""}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {matches.map((item) => (
                            <Link
                              key={item.id}
                              href={`/products/${item.slug}`}
                              onClick={() => {
                                setIsSearchModalOpen(false);
                                setSearchQuery("");
                              }}
                              className="group flex gap-4 p-3 border border-ailys-bone-border/70 hover:border-ailys-gold bg-white transition-all"
                            >
                              <div className="relative w-16 h-22 shrink-0 bg-ailys-bone-dark overflow-hidden">
                                <Image
                                  src={item.primaryImage}
                                  alt={item.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                              <div className="flex flex-col justify-between text-left">
                                <div>
                                  <span className="text-[9px] uppercase tracking-[0.2em] text-ailys-muted block">
                                    {item.category}
                                  </span>
                                  <h4 className="font-editorial-heading text-sm text-ailys-black group-hover:text-ailys-gold transition-colors leading-snug">
                                    {item.name}
                                  </h4>
                                </div>
                                <span className="text-xs font-sans font-semibold text-ailys-black">
                                  {formatPrice(item.price)}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        cartCount={activeCartCount}
        onOpenCart={handleOpenCart}
      />
    </>
  );
}
