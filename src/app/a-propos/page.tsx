import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sun, Sparkles, Scissors, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Frame } from "@/components/layout/Frame";
import { BotanicalEmblem } from "@/components/brand/BotanicalEmblem";
import { HairlineRule } from "@/components/brand/HairlineRule";
import { Button } from "@/components/ui/Button";

export default function AboutPage() {
  return (
    <div className="w-full bg-ailys-bone">
      {/* Editorial Hero */}
      <section className="relative w-full min-h-[55vh] sm:min-h-[65vh] flex items-end bg-ailys-black text-ailys-bone pb-16 pt-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/campaign/hero-editorial-woman.jpg"
            alt="L'Histoire AÏLYS - Lumière Tunisienne"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top opacity-50 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ailys-black via-black/50 to-transparent" />
        </div>

        <Container size="xl" className="relative z-10 text-left">
          <div className="max-w-2xl space-y-4">
            <span className="text-[10px] uppercase tracking-[0.28em] text-ailys-gold font-semibold block">
              Maison de Confection Contemporaine
            </span>
            <h1 className="font-editorial-heading text-4xl sm:text-6xl text-ailys-bone leading-tight">
              L&apos;Histoire d&apos;AÏLYS
            </h1>
            <p className="text-sm sm:text-base font-sans text-ailys-bone/80 leading-relaxed max-w-xl">
              Entre tradition tailleur et aisance contemporaine, une vision née sous le ciel de Tunis.
            </p>
          </div>
        </Container>
      </section>

      {/* Origin & Meaning of AÏLYS */}
      <section className="py-20 sm:py-32">
        <Container size="lg">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <BotanicalEmblem size={28} variant="gold" className="mx-auto" />
            <span className="text-xs uppercase tracking-[0.25em] text-ailys-gold-dark font-medium">
              Origine du Nom
            </span>
            <h2 className="font-editorial-heading text-3xl sm:text-5xl text-ailys-black leading-snug">
              L&apos;union intime du prénom et de la fleur
            </h2>
            <div className="space-y-6 text-sm sm:text-base font-sans text-ailys-black/75 leading-relaxed text-left sm:text-center">
              <p>
                <strong>AÏLYS</strong> réunit en son cœur deux présences : <strong>Aïda</strong>,
                la mère, gardienne de la transmission, de la patience et du respect des étoffes ;
                et le <strong>Lys</strong>, emblème de grâce, de renouveau et de pureté architecturale.
              </p>
              <p>
                Fondée par une mère et sa fille à Tunis, la maison s&apos;est construite sur un échange
                constant : le regard bienveillant de l&apos;expérience croisé à l&apos;énergie d&apos;une
                jeune génération active, en quête de vêtements confortables, structurés et dignes des
                meilleurs ateliers européens.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Dual Story Image Section */}
      <section className="py-12 sm:py-20 bg-ailys-bone-light border-y border-ailys-bone-border">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-ailys-bone-dark border border-ailys-bone-border">
              <Image
                src="/images/campaign/editorial-portrait-tunisian-light.jpg"
                alt="Portrait Confection AÏLYS"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="text-left space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-ailys-gold-dark font-medium">
                La Philosophie
              </span>
              <h3 className="font-editorial-heading text-3xl sm:text-4xl text-ailys-black">
                Quiet confidence, shaped by Tunisian light.
              </h3>
              <p className="text-sm sm:text-base font-sans text-ailys-black/75 leading-relaxed">
                La Tunisie que nous aimons n&apos;est pas celle des clichés touristiques. C&apos;est celle
                de la chaux blanche éclatante, des cours intérieures silencieuses, de l&apos;air marin
                et du savoir-faire textile d&apos;exception transmis au sein des familles d&apos;artisans.
              </p>
              <p className="text-sm sm:text-base font-sans text-ailys-black/75 leading-relaxed">
                Nos silhouettes traduisent cette lumière : elles refusent le clinquant et la surcharge
                pour célébrer la noblesse du lin lavé, le piqué de coton peigné et la perfection d&apos;une
                ligne droite.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Tunisian Atelier & Craftsmanship */}
      <section className="py-24 sm:py-32">
        <Container size="xl">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-ailys-gold-dark font-medium">
              Notre Atelier
            </span>
            <h2 className="font-editorial-heading text-3xl sm:text-5xl text-ailys-black">
              Confectionné avec honneur en Tunisie
            </h2>
            <p className="text-sm font-sans text-ailys-black/70 leading-relaxed">
              De la table de coupe au dernier point de boutonnière, chaque pièce AÏLYS passe par les
              mains d&apos;artisans passionnés basés dans la région de Tunis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white border border-ailys-bone-border space-y-4 text-left">
              <Scissors className="w-6 h-6 text-ailys-gold" />
              <h4 className="font-editorial-heading text-xl text-ailys-black">
                Coupes Tailleur Intemporelles
              </h4>
              <p className="text-xs font-sans text-ailys-black/75 leading-relaxed">
                Des patrons dessinés pour épouser le corps avec aisance, sans rigidité inutile,
                permettant une liberté de mouvement adaptée au rythme d&apos;aujourd&apos;hui.
              </p>
            </div>

            <div className="p-8 bg-white border border-ailys-bone-border space-y-4 text-left">
              <Sun className="w-6 h-6 text-ailys-gold" />
              <h4 className="font-editorial-heading text-xl text-ailys-black">
                Matières Naturelles
              </h4>
              <p className="text-xs font-sans text-ailys-black/75 leading-relaxed">
                Lin méditerranéen certifié, voile de coton peigné hypoallergénique et mailles douces
                choisies pour résister à l&apos;épreuve du temps.
              </p>
            </div>

            <div className="p-8 bg-white border border-ailys-bone-border space-y-4 text-left">
              <ShieldCheck className="w-6 h-6 text-ailys-gold" />
              <h4 className="font-editorial-heading text-xl text-ailys-black">
                Précision des Détails
              </h4>
              <p className="text-xs font-sans text-ailys-black/75 leading-relaxed">
                Boutons gravés en corne ou nacre, coutures rabattues impeccables, fermoirs en laiton
                et étiquettes tissées au toucher soyeux.
              </p>
            </div>
          </div>

          {/* Frame Callout */}
          <div className="mt-16">
            <Frame variant="top-emblem" tone="gold" className="text-center max-w-3xl mx-auto py-8">
              <p className="font-editorial-heading italic text-xl sm:text-2xl text-ailys-black">
                « Notre promesse est celle d&apos;une élégance qui dure : un vêtement que l&apos;on aime
                porter aujourd&apos;hui et que l&apos;on transmettra demain. »
              </p>
            </Frame>
          </div>
        </Container>
      </section>

      {/* CTA to Shop */}
      <section className="py-20 bg-ailys-black text-ailys-bone text-center">
        <Container size="md" className="space-y-6">
          <BotanicalEmblem size={24} variant="gold" className="mx-auto" />
          <h3 className="font-editorial-heading text-3xl sm:text-4xl text-ailys-bone">
            Découvrez nos créations
          </h3>
          <p className="text-sm font-sans text-ailys-bone/70 max-w-md mx-auto">
            Retrouvez nos collections pour Femme, Homme et Enfant, livrées chez vous partout en Tunisie.
          </p>
          <div className="pt-2">
            <Link href="/shop">
              <Button variant="gold" size="lg">
                Explorer la boutique
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
