import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { BotanicalEmblem } from "@/components/brand/BotanicalEmblem";
import { HairlineRule } from "@/components/brand/HairlineRule";
import { Button } from "@/components/ui/Button";

export default function AboutPage() {
  return (
    <div className="w-full bg-ailys-bone text-ailys-black">
      {/* 1. HERO */}
      <section className="relative w-full min-h-[50vh] sm:min-h-[60vh] flex items-end bg-ailys-black text-ailys-bone pb-16 pt-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/editorial/11_ailys_atmosphere.webp"
            alt="Campagne AÏLYS"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top opacity-55 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ailys-black via-black/40 to-transparent" />
        </div>

        <Container size="xl" className="relative z-10 text-left">
          <div className="max-w-2xl space-y-4">
            <span className="text-[10px] uppercase tracking-[0.28em] text-ailys-gold font-semibold block">
              Prêt-à-Porter Contemporain Tunisien
            </span>
            <h1 className="font-editorial-heading text-4xl sm:text-6xl text-ailys-bone leading-tight">
              L&apos;Esprit AÏLYS
            </h1>
            <p className="text-sm sm:text-base font-sans text-ailys-bone/80 leading-relaxed max-w-xl">
              Une allure sport-chic pensée pour le quotidien, où la pureté des lignes rencontre la douceur des matières naturelles.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. SECTION 1: L'ORIGINE DU NOM (AÏCHA + FLEUR DE LYS) */}
      <section className="py-20 sm:py-32">
        <Container size="lg">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <BotanicalEmblem size={28} variant="gold" className="mx-auto" />
            <span className="text-xs uppercase tracking-[0.25em] text-ailys-gold font-semibold">
              Origine du Nom
            </span>
            <h2 className="font-editorial-heading text-3xl sm:text-5xl text-ailys-black leading-snug">
              Aïcha et la Fleur de Lys
            </h2>
            <div className="space-y-6 text-sm sm:text-base font-sans text-ailys-black/80 leading-relaxed text-left sm:text-center">
              <p>
                Le nom <strong>AÏLYS</strong> est né de la rencontre sincère entre deux présences :
                <strong> Aïcha</strong>, la fille de la fondatrice, et la <strong>fleur de lys</strong>,
                sa fleur de prédilection.
              </p>
              <p>
                Cette union symbolise le cœur battant de la marque : un lien mère-fille complice,
                intemporel et tourné vers l&apos;avenir, incarné par une silhouette sobre et naturelle.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. SECTION 2: LA CONNEXION MÈRE-FILLE & LE VESTIAIRE FAMILIAL */}
      <section className="py-16 sm:py-24 bg-ailys-bone-light border-y border-ailys-bone-border">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-ailys-bone-dark border border-ailys-bone-border">
              <Image
                src="/images/editorial/10_the_close_up.webp"
                alt="Portrait AÏLYS"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="text-left space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-ailys-gold font-semibold">
                La Transmission
              </span>
              <h3 className="font-editorial-heading text-3xl sm:text-4xl text-ailys-black">
                Un vestiaire partagé, pensé pour la vie moderne.
              </h3>
              <p className="text-sm sm:text-base font-sans text-ailys-black/80 leading-relaxed">
                AÏLYS s&apos;adresse avant tout à la femme d&apos;aujourd&apos;hui : active, indépendante,
                attentive à son confort sans jamais renoncer à son style.
              </p>
              <p className="text-sm sm:text-base font-sans text-ailys-black/80 leading-relaxed">
                Ce dialogue naturel entre générations s&apos;est tout naturellement étendu à l&apos;ensemble
                de la famille, en proposant des pièces coordonnées pour l&apos;homme et l&apos;enfant conçues
                avec la même exigence de confort et de finitions.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. SECTION 3: LA PHILOSOPHIE SPORT-CHIC & LA LUMIÈRE TUNISIENNE */}
      <section className="py-20 sm:py-32">
        <Container size="xl">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-ailys-gold font-semibold">
              La Philosophie
            </span>
            <h3 className="font-editorial-heading text-3xl sm:text-4xl text-ailys-black">
              Quiet confidence, shaped by Tunisian light.
            </h3>
            <p className="text-sm sm:text-base font-sans text-ailys-black/80 leading-relaxed">
              La Tunisie inspire notre vision par sa clarté, ses volumes architecturaux épurés et son art de vivre équilibré.
            </p>
            <p className="text-sm sm:text-base font-sans text-ailys-black/80 leading-relaxed">
              Nous privilégions les coupes nettes, le lin léger, les cotons souples et les finitions soignées pour créer des vêtements agréables à porter toute la journée.
            </p>

            <HairlineRule tone="gold" emblemSize={20} className="my-8" />

            <div>
              <Link href="/shop">
                <Button variant="primary" size="lg">
                  Explorer la Collection
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
