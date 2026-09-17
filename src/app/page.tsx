"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Grid } from "@/components/layout/Grid";
import { Frame } from "@/components/layout/Frame";
import { Button } from "@/components/ui/Button";
import { BotanicalEmblem } from "@/components/brand/BotanicalEmblem";
import { HairlineRule } from "@/components/brand/HairlineRule";
import { ProductCard } from "@/components/common/ProductCard";
import { PRODUCTS, COLLECTIONS, Product } from "@/lib/data";

interface SectionProps {
  section: any;
  allProducts: Product[];
}

// -----------------------------------------------------------------------------
// 1. HERO SECTION (Campaign Editorial with Single CTA)
// -----------------------------------------------------------------------------
function DynamicHeroSection({ section }: { section: any }) {
  const scrollToNext = () => {
    document.getElementById("nouvelle-collection")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const dt = section.desktopImageTransform?.desktop || section.desktopImageTransform;
  const mt = section.mobileImageTransform?.mobile || section.mobileImageTransform || dt;

  return (
    <section className="relative w-full min-h-[94vh] sm:min-h-[90vh] flex items-end justify-start bg-ailys-black text-ailys-bone overflow-hidden pb-16 sm:pb-24 pt-32">
      {/* Desktop Image Composition */}
      <div className="hidden sm:block absolute inset-0 z-0">
        <Image
          src={section.desktopImage || "/images/campaign/hero-editorial-woman.jpg"}
          alt={section.title || "AÏLYS Campagne"}
          fill
          priority
          sizes="100vw"
          style={
            dt
              ? {
                  objectPosition: `${dt.focalPoint?.x ?? 50}% ${dt.focalPoint?.y ?? 40}%`,
                  transform: `scale(${dt.zoom ?? 1}) rotate(${dt.rotate ?? 0}deg)`,
                  transformOrigin: `${dt.focalPoint?.x ?? 50}% ${dt.focalPoint?.y ?? 40}%`,
                }
              : undefined
          }
          className="object-cover object-center opacity-80 brightness-90 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
      </div>

      {/* Mobile Dedicated Composition */}
      <div className="block sm:hidden absolute inset-0 z-0">
        <Image
          src={section.mobileImage || "/images/campaign/hero-portrait-woman.jpg"}
          alt={section.title || "AÏLYS Campagne"}
          fill
          priority
          sizes="100vw"
          style={
            mt
              ? {
                  objectPosition: `${mt.focalPoint?.x ?? 50}% ${mt.focalPoint?.y ?? 30}%`,
                  transform: `scale(${mt.zoom ?? 1}) rotate(${mt.rotate ?? 0}deg)`,
                  transformOrigin: `${mt.focalPoint?.x ?? 50}% ${mt.focalPoint?.y ?? 30}%`,
                }
              : undefined
          }
          className="object-cover object-top opacity-80 brightness-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/30" />
      </div>

      <Container size="xl" className="relative z-10 text-left">
        <div className="max-w-2xl space-y-6">
          <div className="flex items-center gap-3">
            <BotanicalEmblem size={18} variant="gold" />
            <span className="text-[11px] font-sans uppercase tracking-[0.28em] text-ailys-gold font-medium">
              {section.badge || "Nouvelle Collection"}
            </span>
          </div>

          <h1 className="font-editorial-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.04] text-ailys-bone">
            {section.title || "L'Élégance Contemporaine au Quotidien"}
          </h1>

          <p className="font-sans text-sm sm:text-base md:text-lg text-ailys-bone/85 max-w-xl font-light leading-relaxed">
            {section.subtitle || section.description}
          </p>

          {/* Single, confident CTA button smoothly scrolling down */}
          <div className="pt-4">
            <button
              onClick={scrollToNext}
              className="group inline-flex items-center justify-center px-8 py-4 bg-ailys-gold hover:bg-ailys-gold-light text-ailys-black text-xs uppercase tracking-[0.22em] font-medium transition-all duration-300 shadow-sm cursor-pointer"
            >
              <span>{section.ctaText || "DÉCOUVRIR AÏLYS"}</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 2. NOUVELLE COLLECTION SECTION (3 Integrated Products)
// -----------------------------------------------------------------------------
function DynamicCollectionSection({
  section,
  allProducts,
}: SectionProps) {
  // Find products selected in CMS or fallback to 3 signature products
  const selectedSlugs = section.selectedProductSlugs || [
    "ensemble-tailleur-lin-ivoire",
    "robe-ceinturee-noire",
    "polo-piquet-ivoire",
  ];
  let displayProducts = allProducts.filter((p) => selectedSlugs.includes(p.slug));
  if (displayProducts.length === 0) {
    displayProducts = allProducts.filter((p) => p.isFeatured).slice(0, 3);
  }

  return (
    <Section id="nouvelle-collection" tone="bone" spacing="xl" className="pt-20 sm:pt-28 pb-20 sm:pb-28">
      <Container size="xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 sm:mb-18 gap-6 border-b border-ailys-hairline pb-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[11px] uppercase tracking-[0.3em] text-ailys-gold font-medium block">
              {section.badge || "Nouvelle Collection"}
            </span>
            <h2 className="font-editorial-heading text-3xl sm:text-4xl md:text-5xl text-ailys-black">
              {section.title || "Nouvelle Collection"}
            </h2>
            <p className="font-sans text-sm sm:text-base text-ailys-black/70 font-light leading-relaxed">
              {section.subtitle || "Matières douces, coupes nettes et confort contemporain"}
            </p>
          </div>

          <Link
            href="/collections/nouvelle-collection"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-ailys-black hover:text-ailys-gold font-medium transition-colors group self-start md:self-end"
          >
            <span>{section.ctaText || "Voir la collection"}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3-Product Editorial Showcase */}
        {displayProducts.length > 0 ? (
          <Grid cols={3} gap="lg" className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {displayProducts.slice(0, 3).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </Grid>
        ) : (
          <div className="py-16 text-center space-y-2 border border-dashed border-ailys-bone-border">
            <p className="font-editorial-heading text-xl text-ailys-black">
              Nouvelles créations en cours de préparation
            </p>
            <p className="text-xs text-ailys-black/60 font-sans">
              Les silhouettes de notre prochaine collection seront bientôt dévoilées.
            </p>
          </div>
        )}
      </Container>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 3. EDITORIAL IMAGE BREAK / VISUAL PAUSE
// -----------------------------------------------------------------------------
function EditorialImageBreak() {
  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] bg-ailys-black overflow-hidden flex items-center justify-center">
      <Image
        src="/images/campaign/editorial-portrait-tunisian-light.jpg"
        alt="L'Allure AÏLYS dans la lumière tunisienne"
        fill
        sizes="100vw"
        className="object-cover object-center opacity-70 brightness-95"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60" />
      <Container size="md" className="relative z-10 text-center text-ailys-bone space-y-4 px-6">
        <BotanicalEmblem size={24} variant="gold" className="mx-auto" />
        <p className="font-serif italic text-xl sm:text-3xl text-ailys-bone/95 font-light max-w-xl mx-auto leading-relaxed">
          « Une silhouette fluide sculptée par la clarté méditerranéenne. »
        </p>
        <span className="text-[11px] uppercase tracking-[0.25em] text-ailys-gold font-sans block">
          Tunis • Saison 2026
        </span>
      </Container>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 4. PHILOSOPHY SECTION
// -----------------------------------------------------------------------------
function DynamicPhilosophySection({ section }: { section: any }) {
  return (
    <Section tone="dark" spacing="xl" className="relative overflow-hidden py-24 sm:py-32">
      <Container size="lg">
        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
          <BotanicalEmblem size={28} variant="gold" />

          <span className="text-[11px] uppercase tracking-[0.35em] text-ailys-gold font-medium">
            {section.badge || "La Philosophie"}
          </span>

          <h2 className="font-editorial-heading text-3xl sm:text-5xl md:text-6xl text-ailys-bone leading-tight">
            {section.title || "L'Allure AÏLYS"}
          </h2>

          <HairlineRule tone="gold" variant="with-emblem" className="max-w-xs mx-auto" />

          <blockquote className="font-serif italic text-lg sm:text-2xl text-ailys-bone/95 font-light leading-relaxed">
            {section.subtitle || "« Quiet confidence, shaped by Tunisian light. »"}
          </blockquote>

          <p className="font-sans text-sm sm:text-base text-ailys-bone/70 font-light leading-relaxed max-w-xl">
            {section.description ||
              "Une élégance sans artifice. Des volumes équilibrés et des matières agréables à porter pour traverser les journées actives avec aisance."}
          </p>

          <div className="pt-4">
            <Link href={section.ctaLink || "/a-propos"}>
              <Button variant="outline-light" size="md">
                {section.ctaText || "L'Esprit AÏLYS"}
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 5. CRAFTSMANSHIP SECTION (Authentic Visual Detail Gallery)
// -----------------------------------------------------------------------------
function DynamicCraftsmanshipSection({ section }: { section: any }) {
  const detailCards = [
    {
      image: "/images/craftsmanship/gold-zipper-detail.jpg",
      title: "Finitions & Zips Métalliques",
      desc: "Zips métalliques dorés et coutures renforcées pour un usage durable et fluide au quotidien.",
    },
    {
      image: "/images/craftsmanship/woven-label.jpg",
      title: "Griffe Tissée AÏLYS",
      desc: "Chaque silhouette porte notre étiquette tissée avec discrétion et sobriété.",
    },
    {
      image: "/images/craftsmanship/care-label.jpg",
      title: "Transparence & Entretien",
      desc: "Instructions claires et précises pour préserver la tenue et la douceur de vos vêtements.",
    },
    {
      image: "/images/packaging/luxury-packaging.jpg",
      title: "Écrin & Présentation Soignée",
      desc: "Chaque pièce est soigneusement pliée et livrée dans une boîte protectrice épurée.",
    },
  ];

  return (
    <Section tone="bone" spacing="xl" className="py-20 sm:py-28">
      <Container size="xl">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[11px] uppercase tracking-[0.3em] text-ailys-gold font-medium block">
            {section.badge || "Confection & Matières"}
          </span>
          <h2 className="font-editorial-heading text-3xl sm:text-4xl md:text-5xl text-ailys-black">
            {section.title || "Confection & Matières"}
          </h2>
          <p className="font-sans text-sm sm:text-base text-ailys-black/70 font-light leading-relaxed">
            {section.subtitle || "Matières sélectionnées, coupes précises et finitions soignées"}
          </p>
        </div>

        {/* 4 Authentic Photographic Cards */}
        <Grid cols={4} gap="md" className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {detailCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white border border-ailys-hairline rounded-sm overflow-hidden flex flex-col hover:border-ailys-gold/50 transition-all duration-300 group"
            >
              <div className="relative aspect-4/3 w-full bg-ailys-bone overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="p-6 flex flex-col flex-1 text-left space-y-2">
                <h3 className="font-serif text-base sm:text-lg font-medium text-ailys-black group-hover:text-ailys-gold transition-colors">
                  {card.title}
                </h3>
                <p className="font-sans text-xs text-ailys-black/70 leading-relaxed font-light flex-1">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </Grid>

        <div className="text-center mt-12">
          <Link href={section.ctaLink || "/a-propos"}>
            <Button variant="primary" size="md">
              {section.ctaText || "En savoir plus sur nos ateliers"}
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 6. ABOUT SECTION (Emotion: Aïcha & la Fleur de Lys)
// -----------------------------------------------------------------------------
function DynamicAboutSection({ section }: { section: any }) {
  const at = section.desktopImageTransform?.desktop || section.desktopImageTransform;

  return (
    <Section tone="bone-light" spacing="xl" className="py-20 sm:py-28">
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative aspect-3/4 rounded-sm overflow-hidden bg-ailys-bone border border-ailys-hairline shadow-sm">
            <Image
              src={section.desktopImage || "/images/campaign/hero-portrait-woman.jpg"}
              alt="Aïcha & la Fleur de Lys — Origine de la marque AÏLYS"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={
                at
                  ? {
                      objectPosition: `${at.focalPoint?.x ?? 50}% ${at.focalPoint?.y ?? 35}%`,
                      transform: `scale(${at.zoom ?? 1}) rotate(${at.rotate ?? 0}deg)`,
                      transformOrigin: `${at.focalPoint?.x ?? 50}% ${at.focalPoint?.y ?? 35}%`,
                    }
                  : undefined
              }
              className="object-cover"
            />
          </div>

          <div className="space-y-6 text-left">
            <div className="flex items-center space-x-2">
              <BotanicalEmblem size={18} variant="gold" />
              <span className="text-[11px] uppercase tracking-[0.3em] text-ailys-gold font-medium">
                {section.badge || "Origine du Nom"}
              </span>
            </div>

            <h2 className="font-editorial-heading text-3xl sm:text-4xl md:text-5xl text-ailys-black leading-tight">
              {section.title || "Aïcha & la Fleur de Lys"}
            </h2>

            <HairlineRule tone="gold" variant="simple" className="max-w-[120px]" />

            <p className="font-serif italic text-lg sm:text-xl text-ailys-black/90 font-light leading-relaxed">
              {section.subtitle || "L'union du prénom et de la fleur favorite"}
            </p>

            <p className="font-sans text-sm sm:text-base text-ailys-black/70 font-light leading-relaxed">
              {section.description ||
                "Le nom AÏLYS est né de la rencontre intime entre Aïcha, la fille de la fondatrice, et la fleur de lys, symbole d'élégance et de pureté. Fondée sur une transmission mère-fille, la maison imagine des silhouettes sport-chic modernes confectionnées en Tunisie."}
            </p>

            <div className="pt-4">
              <Link href={section.ctaLink || "/a-propos"}>
                <Button variant="primary" size="md">
                  {section.ctaText || "Découvrir notre histoire"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 7. FINAL CTA SECTION (Univers AÏLYS)
// -----------------------------------------------------------------------------
function DynamicFinalCTASection({ section }: { section: any }) {
  return (
    <Section tone="dark" spacing="xl" className="text-center relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 bg-radial-gradient opacity-10 pointer-events-none" />
      <Container size="md" className="relative z-10 space-y-6">
        <BotanicalEmblem size={32} variant="gold" />
        <span className="text-[11px] uppercase tracking-[0.3em] text-ailys-gold font-medium block">
          {section.badge || "Maison AÏLYS"}
        </span>
        <h2 className="font-editorial-heading text-3xl sm:text-5xl text-ailys-bone leading-tight">
          {section.title || "Découvrir la Collection"}
        </h2>
        <p className="font-sans text-sm sm:text-base text-ailys-bone/70 max-w-lg mx-auto font-light leading-relaxed">
          {section.subtitle || "Une allure contemporaine pensée pour le quotidien"}
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={section.ctaLink || "/shop"}>
            <Button variant="gold" size="lg">
              {section.ctaText || "Explorer la Boutique"}
            </Button>
          </Link>
          <Link href="/collections/nouvelle-collection">
            <Button variant="outline-light" size="lg">
              Voir la Collection
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// MASTER HOMEPAGE COMPONENT
// -----------------------------------------------------------------------------
function HomePageContent() {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";

  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomepage() {
      try {
        const url = isPreview ? "/api/homepage?preview=true" : "/api/homepage";
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setSections(data.sections || []);
        }
      } catch (err) {
        console.error("Homepage load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHomepage();
  }, [isPreview]);

  return (
    <div className="w-full">
      {/* Preview Mode Alert Banner */}
      {isPreview && (
        <div className="sticky top-0 z-50 bg-amber-500 text-black py-2.5 px-4 text-xs font-semibold flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <span className="animate-pulse w-2 h-2 rounded-full bg-black" />
            <span>Mode Prévisualisation du Brouillon CMS — Contenu non publié visible uniquement par vous.</span>
          </div>
          <Link
            href="/admin/homepage"
            className="px-3 py-1 bg-black text-white rounded text-[11px] uppercase tracking-wider hover:bg-neutral-800 transition-colors"
          >
            Retour à l'Éditeur
          </Link>
        </div>
      )}

      {/* Dynamic Sections Rendered in CMS Configured Order */}
      {(sections.length > 0 ? sections : []).map((section) => {
        if (!section.isEnabled) return null;

        switch (section.key) {
          case "hero":
            return <DynamicHeroSection key={section.id || section.key} section={section} />;
          case "new_collection":
            return (
              <React.Fragment key={section.id || section.key}>
                <DynamicCollectionSection
                  section={section}
                  allProducts={PRODUCTS}
                />
                <EditorialImageBreak />
              </React.Fragment>
            );
          case "philosophy":
            return <DynamicPhilosophySection key={section.id || section.key} section={section} />;
          case "craftsmanship":
            return <DynamicCraftsmanshipSection key={section.id || section.key} section={section} />;
          case "about":
            return <DynamicAboutSection key={section.id || section.key} section={section} />;
          case "final_cta":
            return <DynamicFinalCTASection key={section.id || section.key} section={section} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ailys-bone flex items-center justify-center font-serif text-ailys-black">
          AÏLYS • Maison de Confection
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
