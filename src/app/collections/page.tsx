import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { BotanicalEmblem } from "@/components/brand/BotanicalEmblem";
import { AilysRepository } from "@/lib/db/repository";

export default async function CollectionsPage() {
  const collections = await AilysRepository.getCollections();

  return (
    <div className="w-full py-10 sm:py-24 bg-ailys-bone">
      <Container size="xl">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4 mb-10 sm:mb-20">
          <BotanicalEmblem size={24} variant="gold" className="mx-auto" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-ailys-gold font-semibold block">
            Lookbooks & Éditions
          </span>
          <h1 className="font-editorial-heading text-3xl sm:text-6xl text-ailys-black">
            Les Collections AÏLYS
          </h1>
          <p className="text-xs sm:text-base font-sans text-ailys-black/70 leading-relaxed px-2">
            Chaque collection raconte un chapitre de notre attachement à la Tunisie :
            la clarté de son ciel, l&apos;exigence de ses ateliers et l&apos;art de vivre méditerranéen.
          </p>
        </div>

        {/* Collections Editorial Grid */}
        {collections.length > 0 ? (
          <div className="space-y-12 sm:space-y-28">
            {collections.map((col, index) => (
              <div
                key={col.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-14 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Image Block */}
                <div
                  className={`lg:col-span-7 relative ${
                    index % 2 === 1 ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <Link
                    href={`/collections/${col.slug}`}
                    className="group relative block w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-ailys-bone-dark border border-ailys-bone-border"
                  >
                    <Image
                      src={col.heroDesktopImage}
                      alt={col.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  </Link>
                </div>

                {/* Text Block */}
                <div
                  className={`lg:col-span-5 text-left space-y-3 sm:space-y-5 ${
                    index % 2 === 1 ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-[0.25em] text-ailys-gold font-semibold block">
                    {col.subtitle}
                  </span>
                  <h2 className="font-editorial-heading text-2xl sm:text-5xl text-ailys-black leading-tight">
                    {col.title}
                  </h2>
                  <p className="text-xs sm:text-sm font-sans text-ailys-black/75 leading-relaxed">
                    {col.description}
                  </p>
                  <div className="pt-2">
                    <Link
                      href={`/collections/${col.slug}`}
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-ailys-black hover:text-ailys-gold transition-colors"
                    >
                      <span>Explorer le lookbook</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-3 border border-dashed border-ailys-bone-border">
            <p className="font-editorial-heading text-2xl text-ailys-black">
              Nouvelles collections en préparation
            </p>
            <p className="text-xs text-ailys-muted font-sans">
              Les lookbooks et capsules de la saison seront bientôt dévoilés.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
