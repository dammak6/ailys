"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, Phone, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { BotanicalEmblem } from "@/components/brand/BotanicalEmblem";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "0-0": true,
    "1-0": true,
  });

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const faqData: FAQCategory[] = [
    {
      title: "Commandes & Modalités de Paiement",
      items: [
        {
          q: "Comment s'effectue le paiement de ma commande ?",
          a: "Chez AÏLYS, nous proposons exclusivement le paiement à la livraison (Cash on Delivery). Vous ne payez rien en ligne : vous réglez le montant exact en espèces auprès du transporteur au moment où votre colis vous est remis en main propre.",
        },
        {
          q: "Dois-je créer un compte pour commander ?",
          a: "Non. Nous privilégions une expérience d'achat épurée et immédiate en commande invité (guest checkout). Seules les informations nécessaires à l'acheminement de votre colis (nom, téléphone, adresse en Tunisie) vous sont demandées.",
        },
        {
          q: "Comment puis-je confirmer ma commande ?",
          a: "Dès validation de votre panier, vous recevez un récapitulatif avec un code de commande unique (ex. AILYS-2609-XXXX). Notre service conciergerie peut également vous joindre par téléphone pour valider les détails de livraison.",
        },
      ],
    },
    {
      title: "Livraison Partout en Tunisie",
      items: [
        {
          q: "Quels sont les délais de livraison ?",
          a: "Nos colis sont expédiés depuis notre atelier de Tunis. La livraison intervient sous 24 à 48 heures ouvrées pour le Grand Tunis et les grandes villes (Sousse, Sfax, Nabeul, Bizerte), et sous 48 à 72 heures pour le reste des gouvernorats tunisiens.",
        },
        {
          q: "Quels sont les frais de livraison ?",
          a: "La livraison est entièrement offerte pour toute commande égale ou supérieure à 200 TND. Pour les commandes inférieures, un tarif forfaitaire de 7 TND s'applique sur l'ensemble du territoire tunisien.",
        },
        {
          q: "Que faire si je suis absent lors du passage du livreur ?",
          a: "Le livreur vous contacte systématiquement par téléphone avant son passage. En cas d'indisponibilité, une seconde présentation est planifiée selon votre convenance.",
        },
      ],
    },
    {
      title: "Retours, Échanges & Conformité",
      items: [
        {
          q: "Quel est le délai pour demander un retour ou un échange ?",
          a: "Vous disposez d'un délai de 7 jours calendaires à compter de la réception de votre commande pour faire une demande d'échange de taille ou de retour via notre portail dédié.",
        },
        {
          q: "Quelle est la condition impérative pour les articles retournés ?",
          a: "Les articles doivent impérativement être retournés neufs, non portés, non lavés, dans leur emballage d'origine et avec toutes leurs étiquettes et tickets de confection intacts tels que livrés.",
        },
        {
          q: "Comment procéder pour retourner un article ?",
          a: "Rendez-vous simplement sur notre page 'Retours & Échanges', saisissez votre code de commande et votre numéro de téléphone. Vous pourrez choisir l'article à échanger ou retourner et sélectionner votre motif. Notre livreur viendra récupérer l'article à votre adresse.",
        },
      ],
    },
    {
      title: "Tailles, Coupes & Entretien",
      items: [
        {
          q: "Comment choisir ma taille idéale ?",
          a: "Chaque fiche produit comporte un bouton 'Guide des Tailles' avec les mensurations détaillées en centimètres. Nos coupes sport-chic sont pensées pour un tombé fluide et décontracté.",
        },
        {
          q: "Comment entretenir les pièces en lin et coton AÏLYS ?",
          a: "Nous recommandons un lavage à 30°C cycle délicat avec des couleurs similaires, et un séchage naturel à l'ombre. Pour le lin, le repassage à fer doux sur l'envers alors que le tissu est encore légèrement humide garantit un tombé parfait.",
        },
      ],
    },
  ];

  return (
    <div className="w-full bg-ailys-bone py-16 sm:py-24">
      <Container size="lg">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16 sm:mb-20">
          <BotanicalEmblem size={24} variant="gold" className="mx-auto" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-ailys-gold-dark font-semibold">
            Aide & Réponses
          </span>
          <h1 className="font-editorial-heading text-4xl sm:text-5xl text-ailys-black">
            Foire Aux Questions
          </h1>
          <p className="text-sm font-sans text-ailys-black/70 leading-relaxed">
            Retrouvez toutes les précisions sur les commandes en Tunisie, le paiement à la livraison,
            les essayages et les retours d&apos;articles.
          </p>
        </div>

        {/* Categories of FAQ */}
        <div className="space-y-12">
          {faqData.map((category, catIndex) => (
            <div key={category.title} className="text-left space-y-4">
              <h3 className="font-editorial-heading text-xl sm:text-2xl text-ailys-black pb-2 border-b border-ailys-bone-border">
                {category.title}
              </h3>

              <div className="space-y-3">
                {category.items.map((item, itemIndex) => {
                  const key = `${catIndex}-${itemIndex}`;
                  const isOpen = !!openItems[key];

                  return (
                    <div
                      key={item.q}
                      className="border border-ailys-bone-border bg-white transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(catIndex, itemIndex)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                      >
                        <span className="font-editorial-heading text-base sm:text-lg text-ailys-black font-normal">
                          {item.q}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-ailys-gold shrink-0 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm font-sans text-ailys-black/75 leading-relaxed border-t border-ailys-bone-border/50">
                          <p>{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-16 p-8 bg-ailys-bone-light border border-ailys-bone-border text-center space-y-4">
          <h4 className="font-editorial-heading text-2xl text-ailys-black">
            Une question spécifique ?
          </h4>
          <p className="text-xs sm:text-sm font-sans text-ailys-black/70 max-w-md mx-auto leading-relaxed">
            Notre conciergerie est joignable du lundi au samedi pour vous assister personnellement.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="tel:+21670000000"
              className="px-6 py-2.5 bg-ailys-black text-ailys-bone text-xs uppercase tracking-widest hover:bg-ailys-black/90 transition-colors"
            >
              Appeler le +216 70 000 000
            </a>
            <Link
              href="/contact"
              className="px-6 py-2.5 bg-transparent border border-ailys-black text-ailys-black text-xs uppercase tracking-widest hover:bg-ailys-black hover:text-ailys-bone transition-colors"
            >
              Formulaire de contact
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
