"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Sparkles,
  Scissors,
  Sun,
  Heart,
  CheckCircle2,
  Package,
  Layers,
} from "lucide-react";
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
// 1. HERO SECTION
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
    <section className="relative w-full min-h-[92vh] sm:min-h-[88vh] flex items-end justify-start bg-ailys-black text-ailys-bone overflow-hidden pb-16 sm:pb-24 pt-32">
      {/* Desktop Image Composition */}
      <div className="hidden sm:block absolute inset-0 z-0">
        <Image
          src={section.desktopImage || "/images/campaign/hero-editorial-woman.jpg"}
          alt={section.title}
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
          className="object-cover object-center opacity-75 brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
      </div>

      {/* Mobile Dedicated Composition */}
      <div className="block sm:hidden absolute inset-0 z-0">
        <Image
          src={section.mobileImage || "/images/campaign/hero-portrait-woman.jpg"}
          alt={section.title}
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
          className="object-cover object-top opacity-75 brightness-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30" />
      </div>

      <Container size="xl" className="relative z-10 text-left">
        <div className="max-w-2xl space-y-6">
          <div className="flex items-center gap-3">
            <BotanicalEmblem size={18} variant="gold" />
            <span className="text-[11px] font-sans uppercase tracking-[0.28em] text-ailys-gold font-medium">
              {section.badge || "Nouvelle Collection • 2026"}
            </span>
          </div>

          <h1 className="font-editorial-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.05] text-ailys-bone">
            {section.title}
          </h1>

          <p className="font-sans text-sm sm:text-base md:text-lg text-ailys-bone/85 max-w-xl font-light leading-relaxed">
            {section.subtitle || section.description}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {section.ctaText && (
              <Button
                variant="gold"
                size="lg"
                onClick={scrollToNext}
                className="group cursor-pointer"
              >
                <span>{section.ctaText}</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            )}

            {section.secondaryCtaText && (
              <Link href={section.secondaryCtaLink || "/a-propos"}>
                <Button variant="outline-light" size="lg">
                  {section.secondaryCtaText}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 2. NOUVELLE COLLECTION SECTION
// -----------------------------------------------------------------------------
function DynamicCollectionSection({
  section,
  allProducts,
}: SectionProps) {
  // Find products selected in CMS or fallback to featured
  const selectedSlugs = section.selectedProductSlugs || [];
  let displayProducts = allProducts.filter((p) => selectedSlugs.includes(p.slug));
  if (displayProducts.length === 0) {
    displayProducts = allProducts.filter((p) => p.isFeatured).slice(0, 3);
  }

  return (
    <Section id="nouvelle-collection" tone="bone" spacing="xl">
      <Container size="xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[11px] uppercase tracking-[0.3em] text-ailys-gold font-medium block">
              {section.badge || "Saison 2026"}
            </span>
            <h2 className="font-editorial-heading text-3xl sm:text-4xl md:text-5xl text-ailys-black">
              {section.title}
            </h2>
            <p className="font-sans text-sm sm:text-base text-ailys-black/70 font-light leading-relaxed">
              {section.subtitle}
            </p>
          </div>

          {section.ctaText && (
            <Link
              href={section.ctaLink || "/collections/lumiere-d-ete"}
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-ailys-black hover:text-ailys-gold font-medium transition-colors group self-start md:self-end"
            >
              <span>{section.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* 3-Product Editorial Showcase */}
        <Grid cols={3} gap="lg" className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {displayProducts.slice(0, 3).map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 3. PHILOSOPHY SECTION
// -----------------------------------------------------------------------------
function DynamicPhilosophySection({ section }: { section: any }) {
  return (
    <Section tone="dark" spacing="xl" className="relative overflow-hidden">
      <Container size="lg">
        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
          <BotanicalEmblem size={28} variant="gold" />

          <span className="text-[11px] uppercase tracking-[0.35em] text-ailys-gold font-medium">
            {section.badge || "Philosophie de Maison"}
          </span>

          <h2 className="font-editorial-heading text-3xl sm:text-5xl md:text-6xl text-ailys-bone leading-tight">
            {section.title}
          </h2>

          <HairlineRule tone="gold" variant="with-emblem" className="max-w-xs mx-auto" />

          <blockquote className="font-serif italic text-lg sm:text-2xl text-ailys-bone/90 font-light leading-relaxed">
            {section.subtitle}
          </blockquote>

          <p className="font-sans text-sm sm:text-base text-ailys-bone/70 font-light leading-relaxed max-w-xl">
            {section.description}
          </p>

          {section.ctaText && (
            <div className="pt-4">
              <Link href={section.ctaLink || "/a-propos"}>
                <Button variant="outline-light" size="md">
                  {section.ctaText}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 4. CRAFTSMANSHIP SECTION
// -----------------------------------------------------------------------------
function DynamicCraftsmanshipSection({ section }: { section: any }) {
  const cards = [
    {
      icon: Scissors,
      title: "Coupe & Patronnage",
      desc: "Des silhouettes structurées pour une liberté de mouvement naturelle.",
    },
    {
      icon: Sun,
      title: "Matières Nobles",
      desc: "100% Lin lavé, soies légères et cotons peignés certifiés.",
    },
    {
      icon: Sparkles,
      title: "Détails Signature",
      desc: "Zips laiton doré gravés de l'emblème botanique AÏLYS.",
    },
    {
      icon: Heart,
      title: "Confection Tunisienne",
      desc: "Chaque pièce est assemblée avec soin dans nos ateliers de Tunis.",
    },
  ];

  return (
    <Section tone="bone" spacing="xl">
      <Container size="xl">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[11px] uppercase tracking-[0.3em] text-ailys-gold font-medium block">
            {section.badge || "Excellence de Confection"}
          </span>
          <h2 className="font-editorial-heading text-3xl sm:text-4xl text-ailys-black">
            {section.title}
          </h2>
          <p className="font-sans text-sm text-ailys-black/70 font-light">
            {section.subtitle}
          </p>
        </div>

        <Grid cols={4} gap="md" className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="bg-white border border-ailys-hairline p-8 rounded-sm text-center space-y-4 hover:border-ailys-gold/40 transition-colors"
              >
                <div className="inline-flex p-3 rounded-full bg-ailys-bone text-ailys-gold">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-ailys-black">
                  {c.title}
                </h3>
                <p className="font-sans text-xs text-ailys-black/70 leading-relaxed font-light">
                  {c.desc}
                </p>
              </div>
            );
          })}
        </Grid>

        {section.ctaText && (
          <div className="text-center mt-12">
            <Link href={section.ctaLink || "/a-propos"}>
              <Button variant="primary" size="md">
                {section.ctaText}
              </Button>
            </Link>
          </div>
        )}
      </Container>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 5. ABOUT SECTION
// -----------------------------------------------------------------------------
function DynamicAboutSection({ section }: { section: any }) {
  const at = section.desktopImageTransform?.desktop || section.desktopImageTransform;

  return (
    <Section tone="bone-light" spacing="xl">
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative aspect-3/4 rounded-sm overflow-hidden bg-ailys-bone border border-ailys-hairline">
            <Image
              src={section.desktopImage || "/images/campaign/hero-portrait-woman.jpg"}
              alt="Histoire AÏLYS"
              fill
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

          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <BotanicalEmblem size={18} variant="gold" />
              <span className="text-[11px] uppercase tracking-[0.3em] text-ailys-gold font-medium">
                {section.badge || "Histoire de Marque"}
              </span>
            </div>

            <h2 className="font-editorial-heading text-3xl sm:text-4xl md:text-5xl text-ailys-black leading-tight">
              {section.title}
            </h2>

            <HairlineRule tone="gold" variant="simple" className="max-w-[120px]" />

            <p className="font-serif italic text-lg text-ailys-black/90">
              {section.subtitle}
            </p>

            <p className="font-sans text-sm text-ailys-black/70 font-light leading-relaxed">
              {section.description}
            </p>

            {section.ctaText && (
              <div className="pt-4">
                <Link href={section.ctaLink || "/a-propos"}>
                  <Button variant="primary" size="md">
                    {section.ctaText}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 6. FINAL CTA SECTION
// -----------------------------------------------------------------------------
function DynamicFinalCTASection({ section }: { section: any }) {
  return (
    <Section tone="dark" spacing="xl" className="text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient opacity-10 pointer-events-none" />
      <Container size="md" className="relative z-10 space-y-6">
        <BotanicalEmblem size={32} variant="gold" />
        <span className="text-[11px] uppercase tracking-[0.3em] text-ailys-gold font-medium block">
          {section.badge || "Maison AÏLYS"}
        </span>
        <h2 className="font-editorial-heading text-3xl sm:text-5xl text-ailys-bone leading-tight">
          {section.title}
        </h2>
        <p className="font-sans text-sm sm:text-base text-ailys-bone/70 max-w-lg mx-auto font-light leading-relaxed">
          {section.subtitle}
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={section.ctaLink || "/shop"}>
            <Button variant="gold" size="lg">
              {section.ctaText || "Explorer le Shop"}
            </Button>
          </Link>
          <Link href="/collections">
            <Button variant="outline-light" size="lg">
              Nos Lookbooks
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
      {sections.map((section) => {
        if (!section.isEnabled) return null;

        switch (section.key) {
          case "hero":
            return <DynamicHeroSection key={section.id || section.key} section={section} />;
          case "new_collection":
            return (
              <DynamicCollectionSection
                key={section.id || section.key}
                section={section}
                allProducts={PRODUCTS}
              />
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
