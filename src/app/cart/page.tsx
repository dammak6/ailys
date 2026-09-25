"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, Truck, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/cart-context";
import { useSiteSettings } from "@/lib/site-settings-context";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  const { settings } = useSiteSettings();
  const freeShippingThreshold = settings.freeShippingThreshold;
  const standardShippingFee = settings.standardShippingFee;
  const shippingCurrency = settings.shippingCurrency;
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);
  const shippingFee = subtotal >= freeShippingThreshold ? 0 : standardShippingFee;
  const total = subtotal + shippingFee;

  return (
    <div className="w-full bg-ailys-bone py-8 sm:py-20">
      <Container size="xl">
        <div className="text-left space-y-2 mb-6 sm:mb-10 pb-4 sm:pb-6 border-b border-ailys-bone-border">
          <span className="text-[10px] uppercase tracking-[0.25em] text-ailys-gold font-semibold">
            Panier d&apos;achats
          </span>
          <h1 className="font-editorial-heading text-2xl sm:text-4xl text-ailys-black">
            Votre Sélection ({totalItems})
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="p-10 sm:p-16 text-center space-y-4 bg-white border border-ailys-bone-border max-w-xl mx-auto">
            <p className="font-editorial-heading text-2xl text-ailys-black">
              Votre panier est vide
            </p>
            <p className="text-xs text-ailys-muted font-sans max-w-sm mx-auto">
              Découvrez notre collection contemporaine façonnée par la lumière tunisienne.
            </p>
            <Link href="/shop">
              <Button variant="gold" size="md">
                Explorer la boutique
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start font-sans">
            {/* Left Items Table (Col 1-8) */}
            <div className="lg:col-span-8 space-y-4 text-left">
              {/* Free delivery banner */}
              <div className="p-3.5 sm:p-4 bg-ailys-bone-light border border-ailys-bone-border text-xs flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-ailys-gold shrink-0" />
                {remainingForFree > 0 ? (
                  <span className="text-ailys-black/90">
                    Ajoutez encore <strong>{formatPrice(remainingForFree)}</strong> pour bénéficier de la{" "}
                    <strong className="text-ailys-gold-dark">livraison offerte</strong> partout en Tunisie.
                  </span>
                ) : (
                  <span className="text-green-800 font-medium">
                    Félicitations ! Vous bénéficiez de la livraison offerte depuis {settings.atelierAddress}.
                  </span>
                )}
              </div>

              {/* Items Card */}
              <div className="bg-white border border-ailys-bone-border divide-y divide-ailys-bone-border">
                {items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                    <div className="flex items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
                      <div className="relative w-20 h-24 shrink-0 overflow-hidden bg-ailys-bone-dark border border-ailys-bone-border">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-editorial-heading text-base text-ailys-black hover:text-ailys-gold transition-colors block truncate"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-ailys-muted uppercase tracking-wider">
                          Taille : {item.size} • Couleur : {item.color}
                        </p>
                        <p className="text-xs font-semibold text-ailys-black sm:hidden pt-0.5">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-ailys-bone-border/50">
                      {/* Quantity with >=44px touch targets */}
                      <div className="flex items-center border border-ailys-bone-border bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-ailys-bone transition-colors"
                          aria-label="Diminuer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-mono font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-ailys-bone transition-colors"
                          aria-label="Augmenter"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="hidden sm:inline font-semibold text-sm text-ailys-black min-w-[80px] text-right">
                        {formatPrice(item.price * item.quantity)}
                      </span>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-ailys-muted hover:text-red-700 transition-colors w-10 h-10 flex items-center justify-center"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Summary (Col 9-12) */}
            <div className="lg:col-span-4 p-5 sm:p-8 bg-white border border-ailys-bone-border space-y-5 sm:space-y-6 text-left">
              <h3 className="font-editorial-heading text-xl text-ailys-black pb-3 border-b border-ailys-bone-border">
                Récapitulatif
              </h3>

              <div className="space-y-2 text-xs text-ailys-muted">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span className="font-medium text-ailys-black">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison en Tunisie</span>
                  <span className="font-medium text-ailys-black">
                    {shippingFee === 0 ? "Offerte" : `${standardShippingFee} ${shippingCurrency}`}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-ailys-bone-border flex justify-between items-baseline">
                <span className="font-editorial-heading text-lg">Total</span>
                <div className="text-right">
                  <span className="font-editorial-heading text-2xl text-ailys-black">
                    {formatPrice(total)}
                  </span>
                  <p className="text-[10px] uppercase tracking-wider text-ailys-gold font-medium">
                    Paiement à la livraison
                  </p>
                </div>
              </div>

              <Link href="/checkout" className="w-full block">
                <Button variant="gold" size="lg" className="w-full min-h-[48px] text-xs sm:text-sm uppercase tracking-widest font-sans font-medium">
                  <span>Commander maintenant</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <div className="text-center text-[10px] uppercase tracking-wider text-ailys-muted space-y-1">
                <p>Expédié depuis notre atelier de {settings.atelierAddress} sous {settings.deliveryDelayTunis}</p>
                <p>Paiement sécurisé en espèces à la livraison</p>
                <p>Échange sous 7 jours partout en Tunisie</p>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
