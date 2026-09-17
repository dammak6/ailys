"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SlidersHorizontal, ChevronDown, Check, X } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/common/ProductCard";
import { PRODUCTS, CATEGORIES } from "@/lib/data";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const allSizes = ["36", "38", "40", "42", "44", "XS", "S", "M", "L", "XL", "XXL", "4 ans", "6 ans", "8 ans", "10 ans"];

  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
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
  }, [selectedCategory, selectedSize, sortBy]);

  return (
    <div className="w-full py-12 sm:py-16 bg-ailys-bone">
      <Container size="xl">
        {/* Editorial Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
          <span className="text-[10px] uppercase tracking-[0.25em] text-ailys-gold font-semibold">
            Boutique Complète
          </span>
          <h1 className="font-editorial-heading text-4xl sm:text-5xl text-ailys-black">
            Toutes les silhouettes
          </h1>
          <p className="text-sm font-sans text-ailys-black/70 leading-relaxed">
            Explorez notre sélection de prêt-à-porter contemporain confectionné en Tunisie.
            Matières naturelles, finitions tailleur et élégance sport-chic.
          </p>
        </div>

        {/* Filters & Sorting Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-10 border-b border-ailys-bone-border text-xs uppercase tracking-wider font-sans">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            {[
              { id: "all", label: "Tout voir" },
              { id: "femme", label: "Femme" },
              { id: "homme", label: "Homme" },
              { id: "enfant", label: "Enfant" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? "bg-ailys-black text-ailys-bone font-medium shadow-sm"
                    : "bg-transparent text-ailys-black/70 hover:text-ailys-black hover:bg-black/5"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Controls: Size Filter & Sorting */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            {/* Size Dropdown */}
            <div className="relative">
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="bg-transparent border border-ailys-bone-border pl-3 pr-8 py-1.5 text-xs uppercase tracking-wider text-ailys-black focus:outline-none focus:border-ailys-gold cursor-pointer"
              >
                <option value="all">Toutes les tailles</option>
                {allSizes.map((s) => (
                  <option key={s} value={s}>
                    Taille {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border border-ailys-bone-border pl-3 pr-8 py-1.5 text-xs uppercase tracking-wider text-ailys-black focus:outline-none focus:border-ailys-gold cursor-pointer"
              >
                <option value="newest">Nouveautés d&apos;abord</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Count */}
        <div className="flex items-center justify-between text-xs uppercase tracking-widest text-ailys-muted mb-8">
          <span>{filteredProducts.length} pièces trouvées</span>
          {(selectedCategory !== "all" || selectedSize !== "all") && (
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedSize("all");
              }}
              className="text-ailys-gold-dark hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Réinitialiser les filtres
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-4 border border-dashed border-ailys-bone-border">
            <p className="font-editorial-heading text-2xl text-ailys-black">
              Aucune pièce ne correspond à ces critères
            </p>
            <p className="text-xs text-ailys-muted font-sans">
              Modifiez vos filtres de taille ou de catégorie pour découvrir d&apos;autres silhouettes.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedSize("all");
              }}
              className="px-6 py-2.5 bg-ailys-black text-ailys-bone text-xs uppercase tracking-widest hover:bg-ailys-black/90 transition-colors"
            >
              Voir tout le catalogue
            </button>
          </div>
        )}
      </Container>
    </div>
  );
}
