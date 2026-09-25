"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/common/ProductCard";
import { Product } from "@/lib/data";

function normalizeCategory(val?: string | null): "all" | "femme" | "homme" | "enfant" {
  if (!val) return "all";
  const v = val.trim().toLowerCase();
  if (v === "all" || v === "tout" || v === "tous") return "all";
  if (v === "femme" || v === "women" || v === "femmes" || v === "woman") return "femme";
  if (v === "homme" || v === "men" || v === "hommes" || v === "man") return "homme";
  if (v === "enfant" || v === "kids" || v === "enfants" || v === "children" || v === "kid") return "enfant";
  return "all";
}

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = normalizeCategory(searchParams.get("category"));
  const initialSize = searchParams.get("size") || "all";
  const initialSort = (searchParams.get("sort") as "newest" | "price-asc" | "price-desc") || "newest";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSize, setSelectedSize] = useState<string>(initialSize);
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">(initialSort);

  // Sync state if URL searchParams change (browser back/forward navigation)
  useEffect(() => {
    const cat = normalizeCategory(searchParams.get("category"));
    setSelectedCategory(cat);
    if (searchParams.get("size")) setSelectedSize(searchParams.get("size")!);
    if (searchParams.get("sort")) setSortBy(searchParams.get("sort") as any);
  }, [searchParams]);

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

  const allSizes = [
    "36", "38", "40", "42", "44",
    "XS", "S", "M", "L", "XL", "XXL",
    "4 ans", "6 ans", "8 ans", "10 ans"
  ];

  const updateUrlParams = (cat: string, size: string, sort: string) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (cat === "all") {
      url.searchParams.delete("category");
    } else {
      url.searchParams.set("category", cat);
    }
    if (size === "all") {
      url.searchParams.delete("size");
    } else {
      url.searchParams.set("size", size);
    }
    if (sort === "newest") {
      url.searchParams.delete("sort");
    } else {
      url.searchParams.set("sort", sort);
    }
    window.history.replaceState({}, "", url.toString());
  };

  const handleCategoryChange = (catId: string) => {
    const normalized = normalizeCategory(catId);
    setSelectedCategory(normalized);
    updateUrlParams(normalized, selectedSize, sortBy);
  };

  const handleSizeChange = (newSize: string) => {
    setSelectedSize(newSize);
    updateUrlParams(selectedCategory, newSize, sortBy);
  };

  const handleSortChange = (newSort: "newest" | "price-asc" | "price-desc") => {
    setSortBy(newSort);
    updateUrlParams(selectedCategory, selectedSize, newSort);
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedSize("all");
    updateUrlParams("all", "all", sortBy);
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];

    const targetCategory = normalizeCategory(selectedCategory);
    if (targetCategory !== "all") {
      list = list.filter((p) => normalizeCategory(p.category) === targetCategory);
    }

    if (selectedSize !== "all") {
      list = list.filter((p) => Array.isArray(p.sizes) && p.sizes.includes(selectedSize));
    }

    if (sortBy === "newest") {
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, selectedCategory, selectedSize, sortBy]);

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
            ].map((cat) => {
              const isActive = normalizeCategory(selectedCategory) === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-3.5 py-1.5 transition-all duration-200 shrink-0 text-xs tracking-wider cursor-pointer ${
                    isActive
                      ? "bg-ailys-black text-ailys-bone font-medium shadow-xs"
                      : "bg-white/80 text-ailys-black/70 hover:text-ailys-black border border-ailys-bone-border"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Controls: Size Filter & Sorting */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end pt-1 sm:pt-0">
            {/* Size Dropdown */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={selectedSize}
                onChange={(e) => handleSizeChange(e.target.value)}
                aria-label="Filtrer par taille"
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
                onChange={(e) => handleSortChange(e.target.value as any)}
                aria-label="Trier par"
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
          {(normalizeCategory(selectedCategory) !== "all" || selectedSize !== "all") && (
            <button
              onClick={handleResetFilters}
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
              onClick={handleResetFilters}
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

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full py-12 sm:py-16 bg-ailys-bone min-h-[60vh] flex items-center justify-center font-serif text-ailys-black">
          AÏLYS • Chargement...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
