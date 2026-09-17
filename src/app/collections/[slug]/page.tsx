import React, { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Frame } from "@/components/layout/Frame";
import { BotanicalEmblem } from "@/components/brand/BotanicalEmblem";
import { ProductCard } from "@/components/common/ProductCard";
import { AilysRepository } from "@/lib/db/repository";

interface SingleCollectionProps {
  params: Promise<{ slug: string }>;
}

export default async function SingleCollectionPage({ params }: SingleCollectionProps) {
  const resolvedParams = await params;
  const collection = await AilysRepository.getCollectionBySlug(resolvedParams.slug);

  if (!collection) {
    notFound();
  }

  const allProducts = await AilysRepository.getProducts();
  const collectionProducts = allProducts.filter((p) =>
    collection.productSlugs?.includes(p.slug)
  );

  return (
    <div className="w-full bg-ailys-bone">
      {/* Editorial Hero */}
      <section className="relative w-full min-h-[50vh] sm:min-h-[65vh] flex items-end bg-ailys-black text-ailys-bone pb-16 pt-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={collection.heroDesktopImage}
            alt={collection.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-55 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ailys-black via-black/40 to-transparent" />
        </div>

        <Container size="xl" className="relative z-10 text-left">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-ailys-gold hover:underline mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Toutes les collections
          </Link>

          <div className="max-w-2xl space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-ailys-gold font-semibold block">
              {collection.subtitle}
            </span>
            <h1 className="font-editorial-heading text-4xl sm:text-6xl text-ailys-bone leading-tight">
              {collection.title}
            </h1>
            <p className="text-sm sm:text-base font-sans text-ailys-bone/80 leading-relaxed max-w-xl">
              {collection.story}
            </p>
          </div>
        </Container>
      </section>

      {/* Collection Products Grid */}
      <section className="py-16 sm:py-24">
        <Container size="xl">
          <div className="flex items-center justify-between pb-6 mb-12 border-b border-ailys-bone-border">
            <div className="flex items-center gap-3">
              <BotanicalEmblem size={18} variant="gold" />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-ailys-black">
                Pièces de la collection ({collectionProducts.length})
              </span>
            </div>
            <Link
              href="/shop"
              className="text-xs uppercase tracking-widest text-ailys-muted hover:text-ailys-gold"
            >
              Voir toute la boutique
            </Link>
          </div>

          {collectionProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
              {collectionProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-3 border border-dashed border-ailys-bone-border">
              <p className="font-editorial-heading text-2xl text-ailys-black">
                Pièces en cours de confection
              </p>
              <p className="text-xs text-ailys-muted font-sans">
                Les créations de cette collection seront bientôt disponibles en boutique.
              </p>
            </div>
          )}

          {/* Lookbook Quote */}
          <div className="mt-20">
            <Frame variant="top-emblem" tone="gold" className="text-center max-w-2xl mx-auto py-8">
              <p className="font-editorial-heading italic text-xl text-ailys-black">
                « Porter AÏLYS, c&apos;est choisir une allure libre, pensée pour les moments précieux comme pour le rythme quotidien. »
              </p>
            </Frame>
          </div>
        </Container>
      </section>
    </div>
  );
}
