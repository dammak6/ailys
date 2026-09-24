"use client";

import React, { useState, use, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Ruler,
  ShieldCheck,
  Truck,
  RefreshCw,
  Sparkles,
  ChevronDown,
  Check,
  Bell,
  X,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProductCard } from "@/components/common/ProductCard";
import { Product } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { trackViewContent, trackAddToCart } from "@/lib/tracking/meta-pixel";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  const { addItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [notifyContact, setNotifyContact] = useState("");
  const [isSubmittingNotify, setIsSubmittingNotify] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("description");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/products?slug=${resolvedParams.slug}`, { cache: "no-store" }).then(async (res) => {
        if (res.status === 404) return null;
        return res.json();
      }),
      fetch(`/api/products`, { cache: "no-store" }).then((res) => res.json()).catch(() => []),
    ])
      .then(([prodData, allProds]) => {
        if (prodData && !prodData.error && prodData.slug) {
          setProduct(prodData);
          if (prodData.colors?.[0]?.name) setSelectedColor(prodData.colors[0].name);
          if (prodData.sizes?.[0]) setSelectedSize(prodData.sizes[0]);
        } else {
          setNotFoundState(true);
        }
        if (Array.isArray(allProds)) {
          setAllProducts(allProds);
        }
      })
      .catch((err) => {
        console.error("Erreur chargement produit PDP:", err);
        setNotFoundState(true);
      })
      .finally(() => setLoading(false));
  }, [resolvedParams.slug]);

  if (notFoundState || (!product && !loading)) {
    notFound();
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-ailys-bone flex items-center justify-center font-serif text-ailys-black">
        AÏLYS • Chargement...
      </div>
    );
  }

  // Track ViewContent on product load
  useEffect(() => {
    if (product) {
      trackViewContent({
        content_name: product.name,
        content_ids: [product.id, product.slug],
        value: product.price,
        currency: "TND",
      });
    }
  }, [product?.id]);

  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  // Related products
  const relatedProducts = allProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  const handleAddToCart = () => {
    if (product.isSoldOut) {
      setIsNotifyModalOpen(true);
      return;
    }

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      image: product.primaryImage,
      quantity: 1,
    });

    trackAddToCart({
      content_name: product.name,
      content_ids: [product.id, product.slug],
      value: product.price,
      currency: "TND",
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="w-full bg-ailys-bone py-10 sm:py-16">
      <Container size="xl">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-ailys-muted mb-8">
          <Link href="/shop" className="hover:text-ailys-gold transition-colors">
            Boutique
          </Link>
          <span>/</span>
          <Link
            href={`/shop/${product.category}`}
            className="hover:text-ailys-gold transition-colors capitalize"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-ailys-black truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column: Image Gallery (Col 1-7) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-3 sm:gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto shrink-0 pb-1 md:pb-0 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
              {product.gallery.map((imgUrl, i) => (
                <button
                  key={imgUrl}
                  onClick={() => setSelectedImageIndex(i)}
                  aria-label={`Vue ${i + 1} de ${product.name}`}
                  className={`relative w-14 sm:w-20 aspect-[3/4] shrink-0 overflow-hidden border transition-all ${
                    selectedImageIndex === i
                      ? "border-ailys-black ring-1 ring-ailys-black"
                      : "border-ailys-bone-border hover:border-ailys-gold/60 opacity-80 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={imgUrl}
                    alt={`${product.name} vue ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Stage Image */}
            <div className="relative flex-1 aspect-[3/4] max-h-[62vh] sm:max-h-none overflow-hidden bg-ailys-bone-dark border border-ailys-bone-border">
              <Image
                src={product.gallery[selectedImageIndex] || product.primaryImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                style={
                  product.primaryImageTransform && selectedImageIndex === 0
                    ? {
                        objectPosition: product.primaryImageTransform.focalPoint
                          ? `${product.primaryImageTransform.focalPoint.x}% ${product.primaryImageTransform.focalPoint.y}%`
                          : undefined,
                        transform: product.primaryImageTransform.zoom
                          ? `scale(${product.primaryImageTransform.zoom})`
                          : undefined,
                        transformOrigin: product.primaryImageTransform.focalPoint
                          ? `${product.primaryImageTransform.focalPoint.x}% ${product.primaryImageTransform.focalPoint.y}%`
                          : undefined,
                      }
                    : undefined
                }
                className="object-cover transition-all duration-500 ease-editorial"
              />

              {/* Mobile photo count badge */}
              <div className="md:hidden absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-ailys-bone text-[10px] tracking-widest px-2.5 py-1 rounded-full uppercase font-sans">
                {selectedImageIndex + 1} / {product.gallery.length}
              </div>

              {/* Status Badges */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-2">
                {product.isSoldOut ? (
                  <Badge variant="soldOut" size="sm">
                    Épuisé
                  </Badge>
                ) : product.isCapsule ? (
                  <Badge variant="capsule" size="sm">
                    Capsule Limitée
                  </Badge>
                ) : product.isNew ? (
                  <Badge variant="gold" size="sm">
                    Nouveauté
                  </Badge>
                ) : null}
              </div>
            </div>
          </div>

          {/* Right Column: Product Purchasing Details (Col 8-12) */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6 text-left">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-ailys-gold-dark font-semibold block mb-1.5 sm:mb-2">
                {product.subCategory}
              </span>
              <h1 className="font-editorial-heading text-2xl sm:text-3xl lg:text-4xl text-ailys-black leading-snug">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm font-sans text-ailys-muted italic mt-1.5">
                {product.subtitle}
              </p>
            </div>

            {/* Price in TND */}
            <div className="pb-3.5 sm:pb-4 border-b border-ailys-bone-border">
              <span className="text-xl sm:text-2xl font-sans font-medium text-ailys-black">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-ailys-muted font-sans ml-3">
                TTC • Paiement en espèces à la livraison
              </span>
            </div>

            {/* Colors Selection */}
            {product.colors.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="uppercase tracking-wider text-ailys-black/80 font-medium">
                    Couleur : <strong className="text-ailys-black">{selectedColor}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setSelectedColor(c.name)}
                      aria-label={`Sélectionner couleur ${c.name}`}
                      className={`w-8 h-8 rounded-full border p-0.5 transition-all ${
                        selectedColor === c.name
                          ? "ring-2 ring-ailys-black ring-offset-2 scale-110"
                          : "border-black/20 hover:scale-105"
                      }`}
                    >
                      <span
                        className="w-full h-full block rounded-full border border-black/10"
                        style={{ backgroundColor: c.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes Selection with >=44px touch targets */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-wider text-ailys-black/80 font-medium">
                  Taille : <strong className="text-ailys-black">{selectedSize}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1.5 text-ailys-gold-dark hover:underline uppercase tracking-wider text-[11px] min-h-[36px]"
                >
                  <Ruler className="w-3.5 h-3.5" /> Guide des Tailles
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`min-h-[44px] flex items-center justify-center text-xs uppercase tracking-wider font-sans border transition-all ${
                      selectedSize === s
                        ? "bg-ailys-black text-ailys-bone border-ailys-black font-medium shadow-sm"
                        : "bg-white text-ailys-black border-ailys-bone-border hover:border-ailys-black/50 active:bg-ailys-bone-dark"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Notice */}
            <div className="flex items-center gap-2 text-xs text-ailys-black/80 pt-1">
              {!product.isSoldOut ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-600 shrink-0" />
                  <span>En stock à l&apos;atelier de Sfax • Expédié sous 24h à 48h</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                  <span className="text-red-700 font-medium">Actuellement épuisé en atelier</span>
                </>
              )}
            </div>

            {/* Add to Cart / Notify Button */}
            <div className="space-y-2.5 pt-2">
              {!product.isSoldOut ? (
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full min-h-[48px] text-xs sm:text-sm uppercase tracking-widest font-sans font-medium"
                  onClick={handleAddToCart}
                >
                  {isAdded ? "Ajouté au panier ✓" : "Ajouter au Panier"}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full min-h-[48px] text-xs sm:text-sm flex items-center justify-center gap-2 uppercase tracking-widest"
                  onClick={() => setIsNotifyModalOpen(true)}
                >
                  <Bell className="w-4 h-4 text-ailys-gold" />
                  <span>M&apos;avertir du réassort</span>
                </Button>
              )}

              <p className="text-[11px] text-center text-ailys-muted uppercase tracking-wider">
                Livraison offerte dès 200 TND • Retours sous 7 jours
              </p>
            </div>

            {/* Reassurance Badges */}
            <div className="p-3.5 sm:p-4 bg-ailys-bone-light border border-ailys-bone-border grid grid-cols-2 gap-3 text-[11px] text-ailys-black/80">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-ailys-gold shrink-0" />
                <span>Expédié de Sfax (24-48h)</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-ailys-gold shrink-0" />
                <span>Paiement à la livraison</span>
              </div>
            </div>

            {/* Accordion Specs: Description, Materials, Care, Fit */}
            <div className="pt-4 border-t border-ailys-bone-border divide-y divide-ailys-bone-border text-xs font-sans">
              {/* Description */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion("description")}
                  className="w-full flex items-center justify-between text-left font-semibold uppercase tracking-[0.18em] text-ailys-black py-1"
                >
                  <span>Description</span>
                  <ChevronDown
                    className={`w-4 h-4 text-ailys-gold-dark transition-transform duration-200 ${
                      openAccordion === "description" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openAccordion === "description" && (
                  <p className="text-ailys-black/75 leading-relaxed pt-2 pb-1 animate-in fade-in">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Matière & Origine */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion("materials")}
                  className="w-full flex items-center justify-between text-left font-semibold uppercase tracking-[0.18em] text-ailys-black py-1"
                >
                  <span>Matière & Origine</span>
                  <ChevronDown
                    className={`w-4 h-4 text-ailys-gold-dark transition-transform duration-200 ${
                      openAccordion === "materials" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openAccordion === "materials" && (
                  <p className="text-ailys-black/75 leading-relaxed pt-2 pb-1 animate-in fade-in">
                    {product.materials}
                  </p>
                )}
              </div>

              {/* Conseils de Coupe */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion("fit")}
                  className="w-full flex items-center justify-between text-left font-semibold uppercase tracking-[0.18em] text-ailys-black py-1"
                >
                  <span>Conseils de Coupe</span>
                  <ChevronDown
                    className={`w-4 h-4 text-ailys-gold-dark transition-transform duration-200 ${
                      openAccordion === "fit" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openAccordion === "fit" && (
                  <p className="text-ailys-black/75 leading-relaxed pt-2 pb-1 animate-in fade-in">
                    {product.fit}
                  </p>
                )}
              </div>

              {/* Entretien */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion("care")}
                  className="w-full flex items-center justify-between text-left font-semibold uppercase tracking-[0.18em] text-ailys-black py-1"
                >
                  <span>Entretien</span>
                  <ChevronDown
                    className={`w-4 h-4 text-ailys-gold-dark transition-transform duration-200 ${
                      openAccordion === "care" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openAccordion === "care" && (
                  <p className="text-ailys-black/75 leading-relaxed pt-2 pb-1 animate-in fade-in">
                    {product.care}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related / Matching Outfits Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-24 pt-10 sm:pt-16 border-t border-ailys-bone-border">
            <div className="text-left space-y-2 mb-6 sm:mb-10">
              <span className="text-[10px] uppercase tracking-[0.25em] text-ailys-gold font-semibold">
                Harmonie du Vestiaire
              </span>
              <h2 className="font-editorial-heading text-2xl sm:text-3xl text-ailys-black">
                Complétez votre silhouette
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          </div>
        )}
      </Container>

      {/* =========================================================================
          SIZE GUIDE MODAL (Custom product guide or default AÏLYS standard)
          ========================================================================= */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ailys-bone max-w-2xl w-full border border-ailys-bone-border p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-ailys-bone-border">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-ailys-gold" />
                <h3 className="font-editorial-heading text-xl text-ailys-black">
                  {product.sizeGuide?.title || `Guide des Tailles • ${product.name}`}
                </h3>
              </div>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="text-xs uppercase tracking-widest text-ailys-muted hover:text-ailys-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-ailys-black/75 font-sans leading-relaxed">
              {product.sizeGuide?.description ||
                "Nos silhouettes sont calibrées selon les standards de confection méditerranéens. Si vous hésitez entre deux tailles, nous vous conseillons de privilégier la plus grande pour une coupe sport-chic aérienne."}
            </p>

            {/* Custom or Default Table */}
            <div className="overflow-x-auto border border-ailys-bone-border bg-white text-xs font-sans">
              {product.sizeGuide?.rows && product.sizeGuide.rows.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-ailys-bone-dark/50 text-ailys-black uppercase tracking-wider text-[11px] border-b border-ailys-bone-border">
                      {(product.sizeGuide.headers || ["Taille", "Tour de Poitrine", "Tour de Taille", "Tour de Bassin"]).map(
                        (h: string, idx: number) => (
                          <th key={idx} className="p-3">
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ailys-bone-border text-ailys-black/80">
                    {product.sizeGuide.rows.map((row: any, rIdx: number) => (
                      <tr key={rIdx}>
                        <td className="p-3 font-semibold">{row.size}</td>
                        {row.chest !== undefined && <td className="p-3">{row.chest}</td>}
                        {row.waist !== undefined && <td className="p-3">{row.waist}</td>}
                        {row.hips !== undefined && <td className="p-3">{row.hips}</td>}
                        {row.length !== undefined && <td className="p-3">{row.length}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-ailys-bone-dark/50 text-ailys-black uppercase tracking-wider text-[11px] border-b border-ailys-bone-border">
                      <th className="p-3">Taille AÏLYS</th>
                      <th className="p-3">Tour de Poitrine</th>
                      <th className="p-3">Tour de Taille</th>
                      <th className="p-3">Tour de Bassin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ailys-bone-border text-ailys-black/80">
                    <tr>
                      <td className="p-3 font-semibold">36 (XS)</td>
                      <td className="p-3">82 - 86 cm</td>
                      <td className="p-3">62 - 66 cm</td>
                      <td className="p-3">88 - 92 cm</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">38 (S)</td>
                      <td className="p-3">86 - 90 cm</td>
                      <td className="p-3">66 - 70 cm</td>
                      <td className="p-3">92 - 96 cm</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">40 (M)</td>
                      <td className="p-3">90 - 94 cm</td>
                      <td className="p-3">70 - 74 cm</td>
                      <td className="p-3">96 - 100 cm</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">42 (L)</td>
                      <td className="p-3">94 - 98 cm</td>
                      <td className="p-3">74 - 78 cm</td>
                      <td className="p-3">100 - 104 cm</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">44 (XL)</td>
                      <td className="p-3">98 - 104 cm</td>
                      <td className="p-3">78 - 84 cm</td>
                      <td className="p-3">104 - 110 cm</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>

            <div className="pt-2 text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSizeGuideOpen(false)}
              >
                Fermer le guide
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          NOTIFY ME MODAL (Out-of-Stock)
          ========================================================================= */}
      {isNotifyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ailys-bone max-w-md w-full border border-ailys-bone-border p-6 sm:p-8 space-y-5 shadow-2xl animate-in fade-in text-left">
            <div className="flex items-center justify-between pb-3 border-b border-ailys-bone-border">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-ailys-gold" />
                <h3 className="font-editorial-heading text-xl">Alerte Réassort Atelier</h3>
              </div>
              <button
                onClick={() => setIsNotifyModalOpen(false)}
                className="text-xs uppercase tracking-widest text-ailys-muted hover:text-ailys-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-ailys-black/75 font-sans leading-relaxed">
              La pièce <strong>{product.name}</strong> (Taille {selectedSize}) est en cours de tissage.
              Laissez vos coordonnées pour être informé en priorité.
            </p>

            {notifySuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans rounded space-y-1 text-center">
                <p className="font-semibold">Demande enregistrée ✓</p>
                <p>Vous serez contacté par SMS ou email dès la réouverture du stock en atelier.</p>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!notifyContact.trim()) return;
                  setIsSubmittingNotify(true);
                  try {
                    const res = await fetch("/api/restock", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        productSlug: product.slug,
                        size: selectedSize,
                        contact: notifyContact.trim(),
                      }),
                    });
                    if (res.ok) {
                      setNotifySuccess(true);
                      setTimeout(() => {
                        setIsNotifyModalOpen(false);
                        setNotifySuccess(false);
                        setNotifyContact("");
                      }, 2500);
                    } else {
                      alert("Une erreur est survenue lors de l'enregistrement.");
                    }
                  } catch (err) {
                    console.error("Restock submit error:", err);
                    alert("Erreur de connexion.");
                  } finally {
                    setIsSubmittingNotify(false);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-ailys-black mb-1.5">
                    Téléphone ou Email
                  </label>
                  <input
                    required
                    type="text"
                    value={notifyContact}
                    onChange={(e) => setNotifyContact(e.target.value)}
                    placeholder="+216 ... ou exemple@domaine.tn"
                    className="w-full h-11 px-4 text-sm bg-white border border-ailys-bone-border focus:border-ailys-gold focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="gold"
                    size="sm"
                    type="submit"
                    className="flex-1"
                    disabled={isSubmittingNotify}
                  >
                    {isSubmittingNotify ? "Enregistrement..." : "M'avertir par SMS / Email"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => setIsNotifyModalOpen(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
