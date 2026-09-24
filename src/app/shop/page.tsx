"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { SlidersHorizontal, ChevronDown, Check, X } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/common/ProductCard";
import { Product } from "@/lib/data";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/products", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch((err) => console.error("Erreur chargement catalogue:", err))
      .finally(() => setLoading(false));
  }, []);

  const allSizes = ["36", "38", "40", "42", "44", "XS", "S", "M", "L", "XL", "XXL", "4 ans", "6 ans", "8 ans", "10 ans"];

  const filteredProducts = useMemo(() => {
    let list = [...products];

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 sm:pb-6 mb-6 sm:mb-10 border-b border-ailys-bone-border text-xs uppercase tracking-wider font-sans">
          {/* Category Tabs: smooth horizontal scroll on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full sm:w-auto -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
            {[
              { id: "all", label: "Tout voir" },
              { id: "femme", label: "Femme" },
              { id: "homme", label: "Homme" },
              { id: "enfant", label: "Enfant" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 transition-all duration-200 shrink-0 text-xs tracking-wider cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-ailys-black text-ailys-bone font-medium shadow-xs"
                    : "bg-white/80 text-ailys-black/70 hover:text-ailys-black border border-ailys-bone-border"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Controls: Size Filter & Sorting */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end pt-1 sm:pt-0">
            {/* Size Dropdown */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full sm:w-auto bg-white border border-ailys-bone-border pl-3 pr-7 py-2 text-xs uppercase tracking-wider text-ailys-black focus:outline-none focus:border-ailys-gold cursor-pointer"
              >
                <option value="all">Toutes tailles</option>
                {allSizes.map((s) => (
                  <option key={s} value={s}>
                    Taille {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-auto bg-white border border-ailys-bone-border pl-3 pr-7 py-2 text-xs uppercase tracking-wider text-ailys-black focus:outline-none focus:border-ailys-gold cursor-pointer"
              >
                <option value="newest">Nouveautés</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Count */}
        <div className="flex items-center justify-between text-xs uppercase tracking-widest text-ailys-muted mb-6 sm:mb-8">
          <span>{filteredProducts.length} pièces trouvées</span>
          {(selectedCategory !== "all" || selectedSize !== "all") && (
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedSize("all");
              }}
              className="text-ailys-gold-dark hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" /> Réinitialiser
            </button>
          )}
        </div>

        {/* Product Grid: 2 columns on mobile */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8 lg:gap-10">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="flex flex-col space-y-3 animate-pulse">
                <div className="w-full aspect-[3/4] bg-ailys-bone-dark/50 border border-ailys-bone-border" />
                <div className="h-4 bg-ailys-bone-dark/40 w-3/4 rounded-xs" />
                <div className="h-3 bg-ailys-bone-dark/30 w-1/4 rounded-xs" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8 lg:gap-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 sm:py-24 text-center space-y-3 sm:space-y-4 border border-dashed border-ailys-bone-border px-4">
            <p className="font-editorial-heading text-xl sm:text-2xl text-ailys-black">
              Catalogue en cours d&apos;actualisation
            </p>
            <p className="text-xs text-ailys-muted font-sans max-w-md mx-auto">
              Nos nouvelles pièces et silhouettes de saison seront mises en ligne très prochainement.
            </p>
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
              className="px-6 py-2.5 bg-ailys-black text-ailys-bone text-xs uppercase tracking-widest hover:bg-ailys-black/90 transition-colors cursor-pointer"
            >
              Voir tout le catalogue
            </button>
          </div>
        )}
      </Container>
    </div>
  );
}
