"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Truck,
  ArrowRight,
  CheckCircle2,
  Phone,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { AilysLogo } from "@/components/brand/AilysLogo";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { trackInitiateCheckout, trackPurchase } from "@/lib/tracking/meta-pixel";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [governorate, setGovernorate] = useState("tunis");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState<{
    code: string;
    total: number;
    phone: string;
    governorate: string;
  } | null>(null);

  const freeShippingThreshold = 200;
  const shippingFee = subtotal >= freeShippingThreshold ? 0 : 7;
  const total = subtotal + shippingFee;

  const governorates = [
    { value: "tunis", label: "Tunis" },
    { value: "ariana", label: "Ariana" },
    { value: "ben-arous", label: "Ben Arous" },
    { value: "manouba", label: "Manouba" },
    { value: "nabeul", label: "Nabeul / Cap Bon" },
    { value: "sousse", label: "Sousse" },
    { value: "monastir", label: "Monastir" },
    { value: "mahdia", label: "Mahdia" },
    { value: "sfax", label: "Sfax" },
    { value: "bizerte", label: "Bizerte" },
    { value: "beja", label: "Béja" },
    { value: "jendouba", label: "Jendouba" },
    { value: "le-kef", label: "Le Kef" },
    { value: "siliana", label: "Siliana" },
    { value: "kairouan", label: "Kairouan" },
    { value: "kasserine", label: "Kasserine" },
    { value: "sidi-bouzid", label: "Sidi Bouzid" },
    { value: "gabes", label: "Gabès" },
    { value: "medenine", label: "Médenine / Djerba" },
    { value: "tataouine", label: "Tataouine" },
    { value: "gafsa", label: "Gafsa" },
    { value: "tozeur", label: "Tozeur" },
    { value: "kebili", label: "Kébili" },
    { value: "zaghouan", label: "Zaghouan" },
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Track InitiateCheckout on checkout page entry
  React.useEffect(() => {
    if (items.length > 0) {
      trackInitiateCheckout({
        value: total,
        num_items: items.length,
        currency: "TND",
      });
    }
  }, []);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (items.length === 0) {
      alert("Votre panier est vide.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          altPhone,
          governorate: governorates.find((g) => g.value === governorate)?.label || governorate,
          city,
          address,
          notes,
          subtotal,
          shippingFee,
          total,
          items,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la validation.");
      }

      // Track Purchase event with deduplication ID
      trackPurchase({
        orderId: data.orderCode || data.id,
        value: Number(data.total) || total,
        currency: "TND",
        num_items: items.length,
        content_ids: items.map((i) => i.productId),
      });

      setConfirmedOrder({
        code: data.orderCode,
        total: data.total,
        phone,
        governorate: governorates.find((g) => g.value === governorate)?.label || governorate,
      });

      clearCart();
    } catch (err: any) {
      setErrorMessage(err.message || "Erreur de connexion avec le serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order was just placed, show confirmation screen
  if (confirmedOrder) {
    return (
      <div className="w-full bg-ailys-bone py-10 sm:py-28">
        <Container size="md">
          <div className="bg-white border border-ailys-bone-border p-5 sm:p-12 text-center space-y-6 sm:space-y-8 shadow-editorial animate-in zoom-in-95">
            <div className="flex justify-center">
              <AilysLogo size="lg" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-ailys-gold font-semibold">
                Commande Confirmée avec Succès
              </span>
              <h1 className="font-editorial-heading text-2xl sm:text-4xl text-ailys-black">
                Merci pour votre confiance
              </h1>
              <p className="text-xs sm:text-sm font-sans text-ailys-muted">
                Votre commande est transmise directement à notre atelier de confection à Sfax.
              </p>
            </div>

            {/* Order Code Card */}
            <div className="p-4 sm:p-6 bg-ailys-bone-light border border-ailys-bone-border space-y-3 text-left">
              <div className="flex items-center justify-between pb-3 border-b border-ailys-bone-border">
                <span className="text-xs uppercase tracking-wider text-ailys-muted font-sans">
                  Code de Commande
                </span>
                <span className="font-mono text-base font-bold text-ailys-black">
                  {confirmedOrder.code}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="text-ailys-muted">Mode de paiement :</span>
                <strong className="text-ailys-black">Paiement à la livraison (Cash on Delivery)</strong>
              </div>
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="text-ailys-muted">Gouvernorat de livraison :</span>
                <span className="text-ailys-black font-medium">{confirmedOrder.governorate}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="text-ailys-muted">Total en espèces à remettre :</span>
                <span className="font-sans font-bold text-base text-ailys-black">
                  {formatPrice(confirmedOrder.total)}
                </span>
              </div>
            </div>

            {/* Reassurance delivery instructions */}
            <div className="text-xs font-sans text-ailys-black/75 space-y-2 text-left bg-white p-4 border border-ailys-gold/40">
              <p className="font-semibold text-ailys-black flex items-center gap-2">
                <Phone className="w-4 h-4 text-ailys-gold" /> Consignes pour la livraison :
              </p>
              <ul className="list-disc pl-5 space-y-1 text-ailys-black/70">
                <li>Le transporteur vous contactera par téléphone ({confirmedOrder.phone}) avant son arrivée.</li>
                <li>Merci de prévoir l&apos;appoint exact en espèces ({formatPrice(confirmedOrder.total)}).</li>
                <li>Conservez précieusement votre code commande pour toute demande ultérieure ou échange sous 7 jours.</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/shop" className="w-full sm:w-auto">
                <Button variant="gold" size="lg" className="w-full sm:w-auto min-h-[48px]">
                  Continuer la visite
                </Button>
              </Link>
              <Link
                href={`/retours-echanges?orderCode=${encodeURIComponent(
                  confirmedOrder.code
                )}&phone=${encodeURIComponent(confirmedOrder.phone)}`}
                className="w-full sm:w-auto"
              >
                <Button variant="outline" size="lg" className="w-full sm:w-auto min-h-[48px]">
                  Portail Retours & Échanges
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Normal Checkout Form
  return (
    <div className="w-full bg-ailys-bone py-8 sm:py-20">
      <Container size="xl">
        {/* Checkout Header */}
        <div className="text-left space-y-2 mb-6 sm:mb-10 pb-4 sm:pb-6 border-b border-ailys-bone-border">
          <span className="text-[10px] uppercase tracking-[0.25em] text-ailys-gold font-semibold">
            Commande Invité Express
          </span>
          <h1 className="font-editorial-heading text-2xl sm:text-4xl text-ailys-black">
            Validation de votre commande
          </h1>
          <p className="text-xs sm:text-sm font-sans text-ailys-muted">
            Aucun compte requis. Expédié depuis notre atelier de Sfax. Règlement en espèces à la livraison.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="p-10 sm:p-16 text-center space-y-4 bg-white border border-ailys-bone-border">
            <p className="font-editorial-heading text-2xl text-ailys-black">
              Votre panier est actuellement vide
            </p>
            <p className="text-xs text-ailys-muted font-sans">
              Ajoutez des pièces à votre sélection pour finaliser votre commande.
            </p>
            <Link href="/shop">
              <Button variant="gold" size="md">
                Découvrir la boutique
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start font-sans">
            {/* Left Column: Guest Delivery Info (Col 1-7) */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
              <div className="p-5 sm:p-8 bg-white border border-ailys-bone-border space-y-5 sm:space-y-6">
                <div className="flex items-center gap-2 pb-3 border-b border-ailys-bone-border">
                  <MapPin className="w-4 h-4 text-ailys-gold" />
                  <h2 className="font-editorial-heading text-xl text-ailys-black">
                    Coordonnées & Adresse de Livraison
                  </h2>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Nom complet & Prénom"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex. Yasmine Ben Salem"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Numéro de Téléphone Principal"
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+216 98 000 000"
                      helperText="Le livreur vous appellera sur ce numéro"
                    />
                    <Input
                      label="Téléphone Secondaire (Optionnel)"
                      type="tel"
                      value={altPhone}
                      onChange={(e) => setAltPhone(e.target.value)}
                      placeholder="+216 22 000 000"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Gouvernorat de Livraison"
                      required
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      options={governorates}
                    />
                    <Input
                      label="Ville / Délégation"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ex. La Marsa, Ennasr, etc."
                    />
                  </div>

                  <Input
                    label="Adresse détaillée (Rue, N°, Résidence, Bâtiment)"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ex. 14 Rue des Jasmins, Résidence Les Pins, Appt 3B"
                  />

                  <Textarea
                    label="Instructions pour le livreur (Optionnel)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Précisions de repérage, créneau préféré..."
                    rows={2}
                  />
                </div>
              </div>

              {/* Payment Method Details */}
              <div className="p-5 sm:p-8 bg-white border border-ailys-bone-border space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-ailys-bone-border">
                  <ShieldCheck className="w-4 h-4 text-ailys-gold" />
                  <h2 className="font-editorial-heading text-xl text-ailys-black">
                    Mode de Paiement
                  </h2>
                </div>

                <div className="p-4 bg-ailys-bone-light border-2 border-ailys-black flex items-start justify-between">
                  <div className="space-y-1">
                    <strong className="text-xs uppercase tracking-wider text-ailys-black block">
                      Paiement à la livraison (Cash on Delivery)
                    </strong>
                    <p className="text-xs text-ailys-black/70 leading-relaxed">
                      Réglez en espèces au livreur lors de la réception de votre colis.
                      Expédié depuis notre atelier de Sfax sous 24h à 48h. Aucune carte requise.
                    </p>
                  </div>
                  <span className="w-4 h-4 rounded-full bg-ailys-black flex items-center justify-center text-ailys-bone text-[10px] shrink-0 mt-0.5 ml-2">
                    ✓
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary (Col 8-12) */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="p-5 sm:p-8 bg-white border border-ailys-bone-border space-y-5 sm:space-y-6">
                <h3 className="font-editorial-heading text-xl text-ailys-black pb-3 border-b border-ailys-bone-border">
                  Récapitulatif de la commande ({items.length})
                </h3>

                {/* Items */}
                <div className="space-y-4 max-h-72 overflow-y-auto pr-2 divide-y divide-ailys-bone-border/60">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 pt-4 first:pt-0">
                      <div className="relative w-14 h-18 shrink-0 overflow-hidden bg-ailys-bone-dark border border-ailys-bone-border">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="60px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 text-xs space-y-0.5">
                        <h4 className="font-editorial-heading text-sm text-ailys-black">
                          {item.name}
                        </h4>
                        <p className="text-ailys-muted uppercase tracking-wider text-[11px]">
                          Taille : {item.size} • Qté : {item.quantity}
                        </p>
                        <p className="font-semibold text-ailys-black mt-1">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="pt-4 border-t border-ailys-bone-border space-y-2 text-xs text-ailys-muted">
                  <div className="flex justify-between">
                    <span>Sous-total articles</span>
                    <span className="font-medium text-ailys-black">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais de livraison</span>
                    <span className="font-medium text-ailys-black">
                      {shippingFee === 0 ? "Offerte" : "7 TND"}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-ailys-bone-border flex justify-between items-baseline">
                  <span className="font-editorial-heading text-lg">Total à payer</span>
                  <div className="text-right">
                    <span className="font-editorial-heading text-2xl text-ailys-black">
                      {formatPrice(total)}
                    </span>
                    <p className="text-[10px] uppercase tracking-wider text-ailys-gold font-medium">
                      En espèces à la livraison
                    </p>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700">
                    {errorMessage}
                  </div>
                )}

                <Button
                  variant="gold"
                  size="lg"
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full min-h-[48px] text-xs sm:text-sm uppercase tracking-widest font-sans font-medium"
                >
                  <span>Confirmer la commande</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <div className="pt-2 text-center text-[10px] uppercase tracking-wider text-ailys-muted space-y-1">
                  <p>
                    <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-ailys-gold" />
                    Garantie échange sous 7 jours partout en Tunisie
                  </p>
                  <p className="text-ailys-muted/70">Expédié depuis Sfax • Livraison 24h-48h</p>
                </div>
              </div>
            </div>
          </form>
        )}
      </Container>
    </div>
  );
}
