import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { BotanicalEmblem } from "@/components/brand/BotanicalEmblem";
import { COLLECTIONS } from "@/lib/data";

export default function CollectionsPage() {
  return (
    <div className="w-full py-16 sm:py-24 bg-ailys-bone">
      <Container size="xl">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16 sm:mb-20">
          <BotanicalEmblem size={24} variant="gold" className="mx-auto" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-ailys-gold font-semibold block">
            Lookbooks & Éditions
          </span>
          <h1 className="font-editorial-heading text-4xl sm:text-6xl text-ailys-black">
            Les Collections AÏLYS
          </h1>
          <p className="text-sm sm:text-base font-sans text-ailys-black/70 leading-relaxed">
            Chaque collection raconte un chapitre de notre attachement à la Tunisie :
            la clarté de son ciel, l&apos;exigence de ses ateliers et l&apos;art de vivre méditerranéen.
          </p>
        </div>

        {/* Collections Editorial Grid */}
        <div className="space-y-20 sm:space-y-28">
          {COLLECTIONS.map((col, index) => (
            <div
              key={col.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-center ${
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
                  className="group relative block w-full aspect-[16/10] overflow-hidden bg-ailys-bone-dark border border-ailys-bone-border"
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
                className={`lg:col-span-5 text-left space-y-5 ${
                  index % 2 === 1 ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <span className="text-[10px] uppercase tracking-[0.25em] text-ailys-gold font-semibold">
                  {col.subtitle}
                </span>

                <h2 className="font-editorial-heading text-3xl sm:text-4xl text-ailys-black leading-tight">
                  {col.title}
                </h2>

                <p className="text-sm font-sans text-ailys-black/75 leading-relaxed">
                  {col.story}
                </p>

                <div className="pt-2">
                  <Link
                    href={`/collections/${col.slug}`}
                    className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-medium text-ailys-black hover:text-ailys-gold transition-colors pb-1 border-b border-ailys-black/30 hover:border-ailys-gold"
                  >
                    <span>Explorer le lookbook</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
