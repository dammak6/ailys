"use client";

import React, { useState, useMemo, use, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, SlidersHorizontal, X } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/common/ProductCard";
import { PRODUCTS, CATEGORIES, Product } from "@/lib/data";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params);
  const categoryKey = resolvedParams.category.toLowerCase();
  const category = CATEGORIES[categoryKey];

  if (!category) {
    notFound();
  }

  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [selectedSub, setSelectedSub] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");

  useEffect(() => {
    fetch(`/api/products?category=${categoryKey}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(console.error);
  }, [categoryKey]);

  const categoryProducts = useMemo(() => {
    let list = products.filter((p) => p.category === categoryKey);

    if (selectedSub !== "all") {
      list = list.filter((p) => p.subCategory === selectedSub);
    }

    if (selectedSize !== "all") {
      list = list.filter((p) => p.sizes.includes(selectedSize));
    }

    if (sortBy === "newest") {
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [categoryKey, selectedSub, selectedSize, sortBy]);

  return (
    <div className="w-full bg-ailys-bone">
      {/* Category Hero Banner */}
      <section className="relative w-full min-h-[38vh] sm:min-h-[55vh] flex items-end bg-ailys-black text-ailys-bone pb-8 sm:pb-16 pt-20 sm:pt-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={category.heroImage}
            alt={category.name}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top opacity-55 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ailys-black via-black/40 to-transparent" />
        </div>

        <Container size="xl" className="relative z-10 text-left">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-ailys-gold hover:underline mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Toute la boutique
          </Link>

          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-ailys-gold font-semibold block mb-1.5 sm:mb-2">
            Collection {category.name}
          </span>
          <h1 className="font-editorial-heading text-3xl sm:text-6xl text-ailys-bone leading-tight">
            {category.tagline}
          </h1>
          <p className="text-xs sm:text-base font-sans text-ailys-bone/80 max-w-xl mt-2.5 sm:mt-3 leading-relaxed">
            {category.description}
          </p>
        </Container>
      </section>

      {/* Subcategory Pills & Filter Bar */}
      <section className="py-4 sm:py-10 border-b border-ailys-bone-border bg-ailys-bone-light/60">
        <Container size="xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
            {/* Subcategory Pills - Mobile horizontal scroll */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto -mx-4 px-4 sm:mx-0 pb-1 sm:pb-0 flex-nowrap sm:flex-wrap">
              <button
                onClick={() => setSelectedSub("all")}
                className={`px-3.5 py-2 sm:py-1.5 text-xs uppercase tracking-wider font-sans whitespace-nowrap shrink-0 transition-all ${
                  selectedSub === "all"
                    ? "bg-ailys-black text-ailys-bone font-medium"
                    : "bg-ailys-bone text-ailys-black/70 hover:text-ailys-black border border-ailys-bone-border"
                }`}
              >
                Tout ({PRODUCTS.filter((p) => p.category === categoryKey).length})
              </button>
              {category.subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSub(sub)}
                  className={`px-3.5 py-2 sm:py-1.5 text-xs uppercase tracking-wider font-sans whitespace-nowrap shrink-0 transition-all ${
                    selectedSub === sub
                      ? "bg-ailys-black text-ailys-bone font-medium"
                      : "bg-ailys-bone text-ailys-black/70 hover:text-ailys-black border border-ailys-bone-border"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Sorting & Filters */}
            <div className="flex items-center justify-between w-full sm:w-auto gap-4 text-xs uppercase tracking-wider">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Trier par"
                className="bg-ailys-bone border border-ailys-bone-border px-3 py-2 sm:py-1.5 text-ailys-black focus:outline-none focus:border-ailys-gold cursor-pointer w-full sm:w-auto min-h-[40px] sm:min-h-0 text-xs"
              >
                <option value="newest">Nouveautés d&apos;abord</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>
          </div>
        </Container>
      </section>

      {/* Products Grid */}
      <section className="py-8 sm:py-20">
        <Container size="xl">
          <div className="flex items-center justify-between text-xs uppercase tracking-widest text-ailys-muted mb-5 sm:mb-8">
            <span>{categoryProducts.length} pièces</span>
            {selectedSub !== "all" && (
              <button
                onClick={() => setSelectedSub("all")}
                className="text-ailys-gold-dark hover:underline flex items-center gap-1 text-xs"
              >
                <X className="w-3 h-3" /> Voir tous les rayons
              </button>
            )}
          </div>

          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4 border border-dashed border-ailys-bone-border">
              <p className="font-editorial-heading text-xl text-ailys-black">
                Aucune pièce dans ce rayon pour l&apos;instant
              </p>
              <button
                onClick={() => setSelectedSub("all")}
                className="px-6 py-2 bg-ailys-black text-ailys-bone text-xs uppercase tracking-widest hover:bg-ailys-black/90 transition-colors"
              >
                Voir tout {category.name}
              </button>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
