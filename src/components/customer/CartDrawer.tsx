"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  React.useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCartOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 200;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-ailys-bone text-ailys-black border-l border-ailys-bone-border flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-5 border-b border-ailys-bone-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-editorial-heading text-xl tracking-tight">Votre Panier</h2>
              <span className="text-xs uppercase tracking-widest text-ailys-muted">
                ({totalItems} {totalItems > 1 ? "articles" : "article"})
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-ailys-black hover:text-ailys-gold transition-colors"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3.5 bg-ailys-bone-dark/60 border-b border-ailys-bone-border text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="font-sans text-ailys-black/80">
                Plus que <strong className="font-semibold text-ailys-black">{formatPrice(remainingForFreeShipping)}</strong> pour bénéficier de la{" "}
                <span className="text-ailys-gold-dark font-medium">livraison offerte</span> en Tunisie.
              </p>
            ) : (
              <p className="font-sans text-ailys-black font-medium flex items-center gap-1.5 text-green-800">
                <Truck className="w-4 h-4 text-green-700" /> Félicitations ! La livraison vous est offerte.
              </p>
            )}
            <div className="w-full h-1 bg-ailys-bone-border rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-ailys-gold transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <span className="w-12 h-12 rounded-full bg-ailys-bone-dark flex items-center justify-center text-ailys-muted">
                  <Truck className="w-5 h-5" />
                </span>
                <p className="font-editorial-heading text-2xl text-ailys-black">Votre panier est vide</p>
                <p className="text-xs text-ailys-muted max-w-xs font-sans">
                  Découvrez nos dernières silhouettes et confectionnez votre garde-robe contemporaine.
                </p>
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2"
                >
                  <Link href="/shop">Explorer la boutique</Link>
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-6 border-b border-ailys-bone-border/70 last:border-0">
                  <div className="relative w-20 h-26 shrink-0 overflow-hidden bg-ailys-bone-dark border border-ailys-bone-border">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-editorial-heading text-sm sm:text-base leading-snug hover:text-ailys-gold transition-colors"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-ailys-muted hover:text-red-700 transition-colors p-1"
                          aria-label="Supprimer l'article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-ailys-muted mt-1 uppercase tracking-wider font-sans">
                        <span>Taille : {item.size}</span>
                        <span>•</span>
                        <span>{item.color}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-ailys-bone-border bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-ailys-bone transition-colors"
                          aria-label="Diminuer la quantité"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-ailys-bone transition-colors"
                          aria-label="Augmenter la quantité"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs sm:text-sm font-sans font-semibold text-ailys-black">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 bg-ailys-bone-light border-t border-ailys-bone-border space-y-4">
              <div className="space-y-1.5 text-xs text-ailys-muted font-sans">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span className="font-medium text-ailys-black text-sm">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison estimée</span>
                  <span>{subtotal >= freeShippingThreshold ? "Offerte" : "7 TND"}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-ailys-bone-border flex justify-between items-baseline">
                <span className="font-editorial-heading text-lg">Total à régler</span>
                <div className="text-right">
                  <span className="font-editorial-heading text-xl text-ailys-black">
                    {formatPrice(subtotal + (subtotal >= freeShippingThreshold ? 0 : 7))}
                  </span>
                  <p className="text-[10px] uppercase tracking-widest text-ailys-gold font-medium">
                    Paiement en espèces à la livraison
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full block"
                >
                  <Button variant="gold" size="lg" className="w-full group">
                    <span>Valider ma commande</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>

                <div className="flex items-center justify-center gap-2 text-[10px] text-ailys-muted uppercase tracking-wider text-center pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-ailys-gold" />
                  <span>Aucun paiement en ligne requis • Commande express</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
