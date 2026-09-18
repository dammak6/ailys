"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { BotanicalEmblem } from "@/components/brand/BotanicalEmblem";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full bg-ailys-bone py-16 sm:py-24">
      <Container size="xl">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16 sm:mb-20">
          <BotanicalEmblem size={24} variant="gold" className="mx-auto" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-ailys-gold-dark font-semibold">
            Conciergerie & Relation Client
          </span>
          <h1 className="font-editorial-heading text-4xl sm:text-5xl text-ailys-black">
            Contactez la Maison AÏLYS
          </h1>
          <p className="text-sm font-sans text-ailys-black/70 leading-relaxed">
            Notre équipe se tient à votre écoute pour vous conseiller sur les coupes,
            suivre une expédition ou répondre à vos questions.
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Contact Info (Col 1-5) */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="p-8 bg-white border border-ailys-bone-border space-y-6">
              <h3 className="font-editorial-heading text-2xl text-ailys-black pb-3 border-b border-ailys-bone-border">
                Service Clientèle
              </h3>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-ailys-bone-light flex items-center justify-center shrink-0 text-ailys-gold">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-ailys-black">
                    Téléphone Direct
                  </h4>
                  <a
                    href="tel:+21670000000"
                    className="text-sm sm:text-base font-sans font-medium text-ailys-black hover:text-ailys-gold transition-colors block mt-0.5"
                  >
                    +216 70 000 000
                  </a>
                  <span className="text-[11px] text-ailys-muted">Du lundi au samedi, 9h — 19h</span>
                </div>
              </div>

              {/* WhatsApp Concierge */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-ailys-bone-light flex items-center justify-center shrink-0 text-green-700">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-ailys-black">
                    Conciergerie WhatsApp
                  </h4>
                  <a
                    href="https://wa.me/21670000000"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-sans font-medium text-ailys-black hover:text-ailys-gold transition-colors block mt-0.5"
                  >
                    +216 70 000 000 (Discussion instantanée)
                  </a>
                  <span className="text-[11px] text-ailys-muted">Conseil personnalisé & tailles</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-ailys-bone-light flex items-center justify-center shrink-0 text-ailys-gold">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-ailys-black">
                    Courrier Électronique
                  </h4>
                  <a
                    href="mailto:contact@ailys.tn"
                    className="text-sm font-sans font-medium text-ailys-black hover:text-ailys-gold transition-colors block mt-0.5"
                  >
                    contact@ailys.tn
                  </a>
                  <span className="text-[11px] text-ailys-muted">Réponse sous 24h ouvrées</span>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4 pt-2 border-t border-ailys-bone-border/60">
                <div className="w-10 h-10 rounded-full bg-ailys-bone-light flex items-center justify-center shrink-0 text-ailys-gold">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-ailys-black">
                    Atelier Central
                  </h4>
                  <p className="text-xs font-sans text-ailys-black/75 leading-relaxed mt-0.5">
                    Atelier AÏLYS<br />
                    Sfax, Tunisie
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (Col 6-12) */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 bg-white border border-ailys-bone-border text-left space-y-6">
              <h3 className="font-editorial-heading text-2xl text-ailys-black pb-2">
                Écrivez-nous
              </h3>

              {submitted ? (
                <div className="py-12 text-center space-y-4 bg-ailys-bone-light p-6 border border-ailys-bone-border">
                  <div className="w-12 h-12 rounded-full bg-ailys-gold/20 text-ailys-gold-dark flex items-center justify-center mx-auto">
                    <Send className="w-5 h-5" />
                  </div>
                  <h4 className="font-editorial-heading text-2xl text-ailys-black">
                    Message transmis avec succès
                  </h4>
                  <p className="text-xs text-ailys-black/70 font-sans max-w-sm mx-auto leading-relaxed">
                    Merci pour votre message. Notre service conciergerie prendra contact avec vous dans les plus brefs délais.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSubmitted(false)}
                    className="mt-2"
                  >
                    Envoyer un autre message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-sans">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Votre Nom & Prénom" required placeholder="Ex. Yasmine Ben Salem" />
                    <Input label="Numéro de Téléphone" required type="tel" placeholder="+216 98 000 000" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Adresse Email" required type="email" placeholder="nom@domaine.tn" />
                    <Select
                      label="Sujet de votre demande"
                      options={[
                        { value: "conseil", label: "Conseil taille ou silhouette" },
                        { value: "commande", label: "Question sur ma commande" },
                        { value: "retour", label: "Demande de retour ou échange" },
                        { value: "pro", label: "Partenariat ou presse" },
                        { value: "autre", label: "Autre demande" },
                      ]}
                    />
                  </div>

                  <Textarea
                    label="Votre Message"
                    required
                    placeholder="Précisez votre demande ou votre référence de commande..."
                    rows={5}
                  />

                  <div className="pt-2">
                    <Button variant="gold" size="lg" type="submit" className="w-full sm:w-auto">
                      <span>Transmettre mon message</span>
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
