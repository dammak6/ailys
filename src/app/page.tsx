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

// Helper to convert transform metadata to CSS styles
function resolveTransformStyle(transform?: any, defaultFocal = { x: 50, y: 50 }) {
  if (!transform) return undefined;
  const t = transform.desktop || transform.mobile || transform;
  const fx = typeof t.focalPoint?.x === "number" ? t.focalPoint.x : defaultFocal.x;
  const fy = typeof t.focalPoint?.y === "number" ? t.focalPoint.y : defaultFocal.y;
  const zoom = typeof t.zoom === "number" ? t.zoom : 1;
  const rotate = typeof t.rotate === "number" ? t.rotate : 0;

  return {
    objectPosition: `${fx}% ${fy}%`,
    transform: zoom !== 1 || rotate !== 0 ? `scale(${zoom}) rotate(${rotate}deg)` : undefined,
    transformOrigin: `${fx}% ${fy}%`,
  };
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
  const desktopStyle = resolveTransformStyle(dt, { x: 50, y: 40 });
  const mobileStyle = resolveTransformStyle(mt, { x: 50, y: 25 });

  return (
    <section className="relative w-full min-h-[86svh] sm:min-h-[90vh] flex items-end justify-start bg-ailys-black text-ailys-bone overflow-hidden pb-10 sm:pb-24 pt-24 sm:pt-32">
      {/* Desktop Image Composition */}
      <div className="hidden sm:block absolute inset-0 z-0">
        <Image
          src={section.desktopImage || "/images/editorial/01_ailys_hero.webp"}
          alt={section.title || "AÏLYS Campagne"}
          fill
          priority
          sizes="100vw"
          style={desktopStyle}
          className="object-cover object-center opacity-80 brightness-90 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
      </div>

      {/* Mobile Dedicated Composition */}
      <div className="block sm:hidden absolute inset-0 z-0">
        <Image
          src={section.mobileImage || "/images/editorial/02_ailys_portrait.webp"}
          alt={section.title || "AÏLYS Campagne"}
          fill
          priority
          sizes="100vw"
          style={mobileStyle}
          className="object-cover object-top opacity-85 brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
      </div>

      <Container size="xl" className="relative z-10 text-left px-4 sm:px-6">
        <div className="max-w-2xl space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <BotanicalEmblem size={16} variant="gold" />
            <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.25em] sm:tracking-[0.28em] text-ailys-gold font-medium">
              {section.badge || "Nouvelle Collection"}
            </span>
          </div>

          <h1 className="font-editorial-heading text-3xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.08] sm:leading-[1.04] text-ailys-bone max-w-xl">
            {section.title || "L'Élégance Contemporaine au Quotidien"}
          </h1>

          <p className="font-sans text-xs sm:text-base md:text-lg text-ailys-bone/85 max-w-xl font-light leading-relaxed">
            {section.subtitle || section.description}
          </p>

          {/* Single, confident CTA button with comfortable mobile touch target */}
          <div className="pt-2 sm:pt-4">
            <button
              onClick={scrollToNext}
              className="group inline-flex items-center justify-center w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 bg-ailys-gold hover:bg-ailys-gold-light text-ailys-black text-xs uppercase tracking-[0.22em] font-semibold transition-all duration-300 shadow-sm cursor-pointer min-h-[48px]"
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
    <Section id="nouvelle-collection" tone="bone" spacing="xl" className="pt-12 sm:pt-28 pb-12 sm:pb-28">
      <Container size="xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-18 gap-4 sm:gap-6 border-b border-ailys-hairline pb-6 sm:pb-8">
          <div className="space-y-2 sm:space-y-3 max-w-2xl text-left">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-ailys-gold font-medium block">
              {section.badge || "Nouvelle Collection"}
            </span>
            <h2 className="font-editorial-heading text-2xl sm:text-4xl md:text-5xl text-ailys-black">
              {section.title || "Nouvelle Collection"}
            </h2>
            <p className="font-sans text-xs sm:text-base text-ailys-black/70 font-light leading-relaxed">
              {section.subtitle || "Matières douces, coupes nettes et confort contemporain"}
            </p>
          </div>

          <Link
            href="/collections/nouvelle-collection"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-ailys-black hover:text-ailys-gold font-medium transition-colors group self-start md:self-end pt-1 sm:pt-0"
          >
            <span>{section.ctaText || "Voir la collection"}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3-Product Editorial Showcase with 2-column mobile layout */}
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
            {displayProducts.slice(0, 3).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="py-12 sm:py-16 text-center space-y-2 border border-dashed border-ailys-bone-border">
            <p className="font-editorial-heading text-lg sm:text-xl text-ailys-black">
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
function EditorialImageBreak({ section }: { section?: any }) {
  const tStyle = resolveTransformStyle(section?.desktopImageTransform, { x: 50, y: 50 });

  return (
    <section className="relative w-full h-[46vh] sm:h-[70vh] bg-ailys-black overflow-hidden flex items-center justify-center">
      <Image
        src={section?.desktopImage || "/images/editorial/05_movement.webp"}
        alt={section?.title || "L'Allure AÏLYS dans la lumière tunisienne"}
        fill
        sizes="100vw"
        style={tStyle}
        className="object-cover object-center opacity-70 brightness-95"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/60" />
      <Container size="md" className="relative z-10 text-center text-ailys-bone space-y-3 sm:space-y-4 px-4 sm:px-6">
        <BotanicalEmblem size={20} variant="gold" className="mx-auto" />
        <p className="font-serif italic text-base sm:text-3xl text-ailys-bone/95 font-light max-w-xl mx-auto leading-relaxed">
          « Une silhouette fluide sculptée par la clarté méditerranéenne. »
        </p>
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-ailys-gold font-sans block">
          Sfax • Saison 2026
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
    <Section tone="dark" spacing="xl" className="relative overflow-hidden py-14 sm:py-32">
      <Container size="lg" className="px-4 sm:px-6">
        <div className="flex flex-col items-center text-center space-y-5 sm:space-y-8 max-w-3xl mx-auto">
          <BotanicalEmblem size={24} variant="gold" />

          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.35em] text-ailys-gold font-medium">
            {section.badge || "La Philosophie"}
          </span>

          <h2 className="font-editorial-heading text-2xl sm:text-5xl md:text-6xl text-ailys-bone leading-tight">
            {section.title || "L'Allure AÏLYS"}
          </h2>

          <HairlineRule tone="gold" variant="with-emblem" className="max-w-[180px] sm:max-w-xs mx-auto" />

          <blockquote className="font-serif italic text-base sm:text-2xl text-ailys-bone/95 font-light leading-relaxed">
            {section.subtitle || "« Quiet confidence, shaped by Tunisian light. »"}
          </blockquote>

          <p className="font-sans text-xs sm:text-base text-ailys-bone/70 font-light leading-relaxed max-w-xl">
            {section.description ||
              "Une élégance sans artifice. Des volumes équilibrés et des matières agréables à porter pour traverser les journées actives avec aisance."}
          </p>

          <div className="pt-2 sm:pt-4">
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
      image: "/images/craftsmanship/gold-zipper-detail.webp",
      title: "Finitions & Zips Métalliques",
      desc: "Zips métalliques dorés et coutures renforcées pour un usage durable et fluide au quotidien.",
    },
    {
      image: "/images/craftsmanship/woven-label.webp",
      title: "Griffe Tissée AÏLYS",
      desc: "Chaque silhouette porte notre étiquette tissée avec discrétion et sobriété.",
    },
    {
      image: "/images/craftsmanship/care-label.webp",
      title: "Transparence & Entretien",
      desc: "Instructions claires et précises pour préserver la tenue et la douceur de vos vêtements.",
    },
    {
      image: "/images/packaging/luxury-packaging.webp",
      title: "Écrin & Présentation Soignée",
      desc: "Chaque pièce est soigneusement pliée et livrée dans une boîte protectrice épurée.",
    },
  ];

  return (
    <Section tone="bone" spacing="xl" className="py-12 sm:py-28">
      <Container size="xl" className="px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-2 sm:space-y-3">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-ailys-gold font-medium block">
            {section.badge || "Confection & Matières"}
          </span>
          <h2 className="font-editorial-heading text-2xl sm:text-4xl md:text-5xl text-ailys-black">
            {section.title || "Confection & Matières"}
          </h2>
          <p className="font-sans text-xs sm:text-base text-ailys-black/70 font-light leading-relaxed">
            {section.subtitle || "Matières sélectionnées, coupes précises et finitions soignées"}
          </p>
        </div>

        {/* 4 Authentic Photographic Cards in 2-column mobile layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="p-3.5 sm:p-6 flex flex-col flex-1 text-left space-y-1 sm:space-y-2">
                <h3 className="font-serif text-xs sm:text-lg font-medium text-ailys-black group-hover:text-ailys-gold transition-colors line-clamp-2 sm:line-clamp-none">
                  {card.title}
                </h3>
                <p className="font-sans text-[11px] sm:text-xs text-ailys-black/70 leading-relaxed font-light flex-1 line-clamp-3 sm:line-clamp-none">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
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
  const aboutStyle = resolveTransformStyle(at, { x: 50, y: 35 });

  return (
    <Section tone="bone-light" spacing="xl" className="py-12 sm:py-28">
      <Container size="xl" className="px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-14 lg:gap-20 items-center">
          <div className="relative aspect-3/4 rounded-sm overflow-hidden bg-ailys-bone border border-ailys-hairline shadow-sm max-w-lg mx-auto w-full">
            <Image
              src={section.desktopImage || "/images/editorial/07_minimal_studio.webp"}
              alt="Aïcha & la Fleur de Lys — Origine de la marque AÏLYS"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={aboutStyle}
              className="object-cover"
            />
          </div>

          <div className="space-y-4 sm:space-y-6 text-left">
            <div className="flex items-center space-x-2">
              <BotanicalEmblem size={16} variant="gold" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-ailys-gold font-medium">
                {section.badge || "Origine du Nom"}
              </span>
            </div>

            <h2 className="font-editorial-heading text-2xl sm:text-4xl md:text-5xl text-ailys-black leading-tight">
              {section.title || "Aïcha & la Fleur de Lys"}
            </h2>

            <HairlineRule tone="gold" variant="simple" className="max-w-[100px] sm:max-w-[120px]" />

            <p className="font-serif italic text-base sm:text-xl text-ailys-black/90 font-light leading-relaxed">
              {section.subtitle || "L'union du prénom et de la fleur favorite"}
            </p>

            <p className="font-sans text-xs sm:text-base text-ailys-black/70 font-light leading-relaxed">
              {section.description ||
                "Le nom AÏLYS est né de la rencontre intime entre Aïcha, la fille de la fondatrice, et la fleur de lys, symbole d'élégance et de pureté. Fondée sur une transmission mère-fille, la maison imagine des silhouettes sport-chic modernes confectionnées en Tunisie."}
            </p>

            <div className="pt-2 sm:pt-4">
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
    <Section tone="dark" spacing="xl" className="text-center relative overflow-hidden py-16 sm:py-32">
      <div className="absolute inset-0 bg-radial-gradient opacity-10 pointer-events-none" />
      <Container size="md" className="relative z-10 space-y-4 sm:space-y-6 px-4 sm:px-6">
        <BotanicalEmblem size={28} variant="gold" className="mx-auto" />
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-ailys-gold font-medium block">
          {section.badge || "Maison AÏLYS"}
        </span>
        <h2 className="font-editorial-heading text-2xl sm:text-5xl text-ailys-bone leading-tight">
          {section.title || "Découvrir la Collection"}
        </h2>
        <p className="font-sans text-xs sm:text-base text-ailys-bone/70 max-w-lg mx-auto font-light leading-relaxed">
          {section.subtitle || "Une allure contemporaine pensée pour le quotidien"}
        </p>
        <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
          <Link href={section.ctaLink || "/shop"} className="w-full sm:w-auto">
            <Button variant="gold" size="lg" className="w-full sm:w-auto">
              {section.ctaText || "Explorer la Boutique"}
            </Button>
          </Link>
          <Link href="/collections/nouvelle-collection" className="w-full sm:w-auto">
            <Button variant="outline-light" size="lg" className="w-full sm:w-auto">
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
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomepage() {
      try {
        const url = isPreview ? "/api/homepage?preview=true" : "/api/homepage";
        const [resSections, resProducts] = await Promise.all([
          fetch(url, { cache: "no-store" }),
          fetch("/api/products", { cache: "no-store" }),
        ]);

        if (resSections.ok) {
          const data = await resSections.json();
          setSections(data.sections || []);
        }
        if (resProducts.ok) {
          const prodData = await resProducts.json();
          if (Array.isArray(prodData) && prodData.length > 0) {
            setProducts(prodData);
          }
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
                  allProducts={products}
                />
                <EditorialImageBreak section={section} />
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
