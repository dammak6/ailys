"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Tag,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { BotanicalEmblem } from "@/components/brand/BotanicalEmblem";
import { formatPrice } from "@/lib/utils";
import { SAMPLE_ORDERS } from "@/lib/data";

export default function ReturnsExchangesPage() {
  const [orderCodeInput, setOrderCodeInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [orderData, setOrderData] = useState<any | null>(null);
  const [searchError, setSearchError] = useState("");
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [requestType, setRequestType] = useState<"echange" | "retour">("echange");
  const [exchangeSizes, setExchangeSizes] = useState<Record<string, string>>({});
  const [reason, setReason] = useState("taille-trop-petite");
  const [comment, setComment] = useState("");
  const [submittedRequestCode, setSubmittedRequestCode] = useState<string | null>(null);

  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("orderCode");
      const phone = params.get("phone");
      if (code) setOrderCodeInput(code);
      if (phone) setPhoneInput(phone);
    }
  }, []);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    setIsSearching(true);

    try {
      const cleanCode = orderCodeInput.trim().toUpperCase();
      const res = await fetch(`/api/returns?orderCode=${encodeURIComponent(cleanCode)}&phone=${encodeURIComponent(phoneInput.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Code de commande introuvable.");
      }

      setOrderData(data);
      if (data.items && data.items.length > 0) {
        setSelectedItems({ [data.items[0].id]: true });
      }
    } catch (err: any) {
      setOrderData(null);
      setSearchError(err.message || "Code de commande introuvable. Veuillez vérifier vos coordonnées.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedItemIds = Object.keys(selectedItems).filter((k) => selectedItems[k]);

    if (selectedItemIds.length === 0) {
      alert("Veuillez sélectionner au moins un article à échanger ou retourner.");
      return;
    }

    setIsSubmitting(true);
    try {
      const itemsToSubmit = orderData.items
        .filter((it: any) => selectedItems[it.id])
        .map((it: any) => ({
          orderItemId: it.id,
          productName: it.productName,
          quantity: it.quantity,
          requestedExchangeSize: exchangeSizes[it.id] || "38",
        }));

      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.orderId,
          orderCode: orderData.orderCode,
          customerName: orderData.customerName,
          customerPhone: orderData.phone || phoneInput,
          type: requestType,
          reason,
          comments: comment,
          tagsIntactConfirmed: true,
          items: itemsToSubmit,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'enregistrement de la demande.");
      }

      setSubmittedRequestCode(data.requestCode);
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'envoi de la demande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-ailys-bone py-16 sm:py-24">
      <Container size="lg">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14 sm:mb-18">
          <BotanicalEmblem size={24} variant="gold" className="mx-auto" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-ailys-gold-dark font-semibold">
            Service Après-Vente & Conformité
          </span>
          <h1 className="font-editorial-heading text-4xl sm:text-5xl text-ailys-black">
            Portail Retours & Échanges
          </h1>
          <p className="text-sm font-sans text-ailys-black/70 leading-relaxed">
            Saisissez votre code de commande pour initier un échange de taille ou un retour d&apos;article.
            Notre transporteur se présentera directement à votre adresse pour la reprise.
          </p>
        </div>

        {/* Step 1: Lookup Form */}
        {!submittedRequestCode && (
          <div className="p-8 sm:p-10 bg-white border border-ailys-bone-border max-w-xl mx-auto shadow-subtle mb-12 text-left">
            <h3 className="font-editorial-heading text-xl text-ailys-black mb-4">
              1. Identifier votre commande
            </h3>
            <form onSubmit={handleLookup} className="space-y-4 font-sans">
              <Input
                label="Code de Commande AÏLYS"
                required
                value={orderCodeInput}
                onChange={(e) => setOrderCodeInput(e.target.value)}
                placeholder="Ex. AILYS-2609-4182"
                helperText="Code figurant sur votre bordereau ou reçu de livraison"
              />

              <Input
                label="Numéro de Téléphone"
                required
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="Numéro utilisé lors de la commande"
              />

              {searchError && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{searchError}</span>
                </div>
              )}

              <Button variant="primary" size="md" type="submit" className="w-full">
                <Search className="w-4 h-4 mr-2" /> Rechercher ma commande
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t border-ailys-bone-border text-[11px] text-ailys-muted">
              Le code de commande se trouve sur votre reçu de livraison ou dans votre confirmation de commande (ex. AILYS-2609-XXXX).
            </div>
          </div>
        )}

        {/* Step 2: Order Items Selection and Action Form */}
        {orderData && !submittedRequestCode && (
          <div className="p-8 sm:p-10 bg-white border border-ailys-bone-border max-w-2xl mx-auto shadow-subtle text-left space-y-8 animate-in fade-in">
            {/* Order Details Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-ailys-bone-border">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-ailys-muted">
                  Commande vérifiée
                </span>
                <h3 className="font-editorial-heading text-2xl text-ailys-black">
                  {orderData.orderCode}
                </h3>
              </div>
              <div className="text-left sm:text-right text-xs font-sans text-ailys-black/70">
                <p>Client : <strong>{orderData.customerName}</strong></p>
                <p>Date : {orderData.orderDate}</p>
              </div>
            </div>

            {/* Crucial Tag Requirement Notice */}
            <div className="p-4 bg-ailys-bone-light border border-ailys-gold/40 flex items-start gap-3">
              <Tag className="w-5 h-5 text-ailys-gold shrink-0 mt-0.5" />
              <div className="text-xs font-sans text-ailys-black/85 leading-relaxed">
                <strong className="block font-semibold uppercase tracking-wider text-ailys-black mb-0.5">
                  Condition impérative de reprise
                </strong>
                Les pièces doivent obligatoirement être remises avec leurs étiquettes tissées,
                étiquettes volantes et tickets de confection intacts, exactement tels que livrés.
                Tout article porté ou sans étiquette ne pourra être repris.
              </div>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-8 font-sans">
              {/* Select Items */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-ailys-black">
                  2. Sélectionnez le ou les articles concernés
                </h4>

                <div className="space-y-3">
                  {orderData.items.map((item: any) => (
                    <label
                      key={item.id}
                      className={`flex items-center gap-4 p-4 border transition-all cursor-pointer ${
                        selectedItems[item.id]
                          ? "border-ailys-black bg-ailys-bone-light/60"
                          : "border-ailys-bone-border hover:border-ailys-black/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!selectedItems[item.id]}
                        onChange={(e) =>
                          setSelectedItems((prev) => ({
                            ...prev,
                            [item.id]: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 text-ailys-black rounded border-ailys-bone-border focus:ring-ailys-gold"
                      />

                      <div className="relative w-16 h-20 shrink-0 overflow-hidden bg-ailys-bone-dark border border-ailys-bone-border">
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 text-xs space-y-1">
                        <h5 className="font-editorial-heading text-sm text-ailys-black font-medium">
                          {item.productName}
                        </h5>
                        <p className="text-ailys-muted uppercase tracking-wider">
                          Taille : {item.size} • Couleur : {item.color} • Qté : {item.quantity}
                        </p>
                        <p className="font-semibold text-ailys-black">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* If exchange, select new size */}
                      {selectedItems[item.id] && requestType === "echange" && (
                        <div className="shrink-0 text-right">
                          <label className="block text-[10px] uppercase tracking-wider text-ailys-muted mb-1">
                            Nouvelle taille
                          </label>
                          <select
                            value={exchangeSizes[item.id] || "38"}
                            onChange={(e) =>
                              setExchangeSizes((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))
                            }
                            className="bg-white border border-ailys-bone-border px-2 py-1 text-xs text-ailys-black"
                          >
                            <option value="36">36 (XS)</option>
                            <option value="38">38 (S)</option>
                            <option value="40">40 (M)</option>
                            <option value="42">42 (L)</option>
                            <option value="44">44 (XL)</option>
                          </select>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Action: Return or Exchange */}
              <div className="space-y-3 pt-4 border-t border-ailys-bone-border">
                <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-ailys-black">
                  3. Choisissez le type d&apos;opération
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRequestType("echange")}
                    className={`p-4 border text-left transition-all ${
                      requestType === "echange"
                        ? "border-ailys-black bg-ailys-black text-ailys-bone"
                        : "border-ailys-bone-border bg-white text-ailys-black hover:border-black/50"
                    }`}
                  >
                    <span className="block text-xs uppercase tracking-wider font-semibold">
                      Échange de taille
                    </span>
                    <span className="text-[11px] opacity-80 mt-1 block leading-snug">
                      Remplacement gratuit à votre domicile
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRequestType("retour")}
                    className={`p-4 border text-left transition-all ${
                      requestType === "retour"
                        ? "border-ailys-black bg-ailys-black text-ailys-bone"
                        : "border-ailys-bone-border bg-white text-ailys-black hover:border-black/50"
                    }`}
                  >
                    <span className="block text-xs uppercase tracking-wider font-semibold">
                      Retour & Remboursement
                    </span>
                    <span className="text-[11px] opacity-80 mt-1 block leading-snug">
                      Reprise du colis et virement
                    </span>
                  </button>
                </div>
              </div>

              {/* Reason & Comment */}
              <div className="space-y-4 pt-4 border-t border-ailys-bone-border">
                <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-ailys-black">
                  4. Motif de la demande
                </h4>

                <Select
                  label="Motif principal"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  options={[
                    { value: "taille-trop-petite", label: "Taille trop petite" },
                    { value: "taille-trop-grande", label: "Taille trop grande" },
                    { value: "coupe-ne-convient-pas", label: "La coupe ne convient pas à ma morphologie" },
                    { value: "couleur-differente", label: "La nuance diffère de mes attentes" },
                    { value: "autre", label: "Autre motif (préciser ci-dessous)" },
                  ]}
                />

                <Textarea
                  label="Précisions ou commentaires (Optionnel)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Indiquez toute remarque utile pour notre atelier..."
                  rows={3}
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-ailys-bone-border">
                <Button variant="gold" size="lg" type="submit" className="w-full">
                  <span>Enregistrer ma demande d&apos;{requestType === "echange" ? "échange" : "retour"}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Success Confirmation Screen */}
        {submittedRequestCode && (
          <div className="p-8 sm:p-12 bg-white border border-ailys-bone-border max-w-xl mx-auto text-center space-y-6 shadow-editorial animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-ailys-gold/20 text-ailys-gold-dark flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-ailys-gold" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-ailys-gold font-semibold">
                Demande Enregistrée
              </span>
              <h3 className="font-editorial-heading text-3xl text-ailys-black">
                Référence {submittedRequestCode}
              </h3>
            </div>

            <div className="p-4 bg-ailys-bone-light border border-ailys-bone-border text-xs text-ailys-black/80 font-sans space-y-2 text-left">
              <p>
                <strong>Que se passe-t-il ensuite ?</strong>
              </p>
              <ul className="list-disc pl-4 space-y-1 text-ailys-black/70">
                <li>Notre équipe valide les disponibilités en atelier sous 24h.</li>
                <li>Le transporteur vous appellera pour convenir du créneau de passage.</li>
                <li>Pensez à replacer les articles dans leur boîte ou sac avec leurs étiquettes d&apos;origine.</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setSubmittedRequestCode(null);
                  setOrderData(null);
                }}
              >
                Nouvelle demande
              </Button>
              <Link href="/shop">
                <Button variant="outline" size="md">
                  Retour à la boutique
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
