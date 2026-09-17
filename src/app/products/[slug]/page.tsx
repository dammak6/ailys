"use client";

import React, { useState, use } from "react";
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
import { PRODUCTS, Product } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const product = PRODUCTS.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const { addItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Related products
  const relatedProducts = PRODUCTS.filter(
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Image Gallery (Col 1-7) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 pb-2 md:pb-0">
              {product.gallery.map((imgUrl, i) => (
                <button
                  key={imgUrl}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`relative w-16 sm:w-20 aspect-[3/4] overflow-hidden border transition-all ${
                    selectedImageIndex === i
                      ? "border-ailys-black ring-1 ring-ailys-black"
                      : "border-ailys-bone-border hover:border-ailys-gold/60 opacity-80 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={imgUrl}
                    alt={`${product.name} vue ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Stage Image */}
            <div className="relative flex-1 aspect-[3/4] overflow-hidden bg-ailys-bone-dark border border-ailys-bone-border">
              <Image
                src={product.gallery[selectedImageIndex] || product.primaryImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition-all duration-500 ease-editorial"
              />

              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
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
          <div className="lg:col-span-5 space-y-6 text-left">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-ailys-gold-dark font-semibold block mb-2">
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
            <div className="pb-4 border-b border-ailys-bone-border">
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
                      className={`w-7 h-7 rounded-full border p-0.5 transition-all ${
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

            {/* Sizes Selection */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-wider text-ailys-black/80 font-medium">
                  Taille : <strong className="text-ailys-black">{selectedSize}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1.5 text-ailys-gold-dark hover:underline uppercase tracking-wider text-[11px]"
                >
                  <Ruler className="w-3.5 h-3.5" /> Guide des tailles
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`py-2.5 text-xs uppercase tracking-wider font-sans border transition-all ${
                      selectedSize === s
                        ? "bg-ailys-black text-ailys-bone border-ailys-black font-medium"
                        : "bg-white text-ailys-black border-ailys-bone-border hover:border-ailys-black/50"
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
                  <span className="w-2 h-2 rounded-full bg-green-600" />
                  <span>En stock à l&apos;atelier de Tunis • Expédié sous 24h à 48h</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <span className="text-red-700 font-medium">Actuellement épuisé en atelier</span>
                </>
              )}
            </div>

            {/* Add to Cart / Notify Button */}
            <div className="space-y-3 pt-2">
              {!product.isSoldOut ? (
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full text-sm"
                  onClick={handleAddToCart}
                >
                  {isAdded ? "Ajouté au panier ✓" : "Ajouter au Panier"}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full text-sm flex items-center justify-center gap-2"
                  onClick={() => setIsNotifyModalOpen(true)}
                >
                  <Bell className="w-4 h-4 text-ailys-gold" />
                  <span>M&apos;avertir du réassort</span>
                </Button>
              )}

              <p className="text-[11px] text-center text-ailys-muted uppercase tracking-wider">
                Livraison gratuite dès 200 TND • Retours sous 7 jours
              </p>
            </div>

            {/* Accordion Specs: Description, Materials, Care, Fit */}
            <div className="pt-6 border-t border-ailys-bone-border space-y-4 text-xs font-sans">
              <div className="space-y-1.5">
                <h4 className="uppercase tracking-[0.2em] font-semibold text-ailys-black">
                  Description
                </h4>
                <p className="text-ailys-black/75 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-ailys-bone-border/60">
                <h4 className="uppercase tracking-[0.2em] font-semibold text-ailys-black">
                  Matière & Origine
                </h4>
                <p className="text-ailys-black/75 leading-relaxed">
                  {product.materials}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-ailys-bone-border/60">
                <h4 className="uppercase tracking-[0.2em] font-semibold text-ailys-black">
                  Conseils de Coupe
                </h4>
                <p className="text-ailys-black/75 leading-relaxed">
                  {product.fit}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-ailys-bone-border/60">
                <h4 className="uppercase tracking-[0.2em] font-semibold text-ailys-black">
                  Entretien
                </h4>
                <p className="text-ailys-black/75 leading-relaxed">
                  {product.care}
                </p>
              </div>
            </div>

            {/* Reassurance Badges */}
            <div className="p-4 bg-ailys-bone-light border border-ailys-bone-border grid grid-cols-2 gap-3 text-[11px] text-ailys-black/80">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-ailys-gold shrink-0" />
                <span>Paiement à la livraison</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-ailys-gold shrink-0" />
                <span>Échanges simples</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related / Matching Outfits Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-ailys-bone-border">
            <div className="text-left space-y-2 mb-10">
              <span className="text-[10px] uppercase tracking-[0.25em] text-ailys-gold font-semibold">
                Harmonie du Vestiaire
              </span>
              <h2 className="font-editorial-heading text-2xl sm:text-3xl text-ailys-black">
                Complétez votre silhouette
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          </div>
        )}
      </Container>

      {/* =========================================================================
          SIZE GUIDE MODAL
          ========================================================================= */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ailys-bone max-w-2xl w-full border border-ailys-bone-border p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-ailys-bone-border">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-ailys-gold" />
                <h3 className="font-editorial-heading text-xl text-ailys-black">
                  Guide des Tailles AÏLYS
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
              Nos silhouettes sont calibrées selon les standards de confection méditerranéens.
              Si vous hésitez entre deux tailles, nous vous conseillons de privilégier la plus grande
              pour une coupe sport-chic aérienne.
            </p>

            {/* Table */}
            <div className="overflow-x-auto border border-ailys-bone-border bg-white text-xs font-sans">
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

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Votre demande a été enregistrée. Vous serez contacté dès disponibilité.");
                setIsNotifyModalOpen(false);
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
                  placeholder="+216 ... ou exemple@domaine.tn"
                  className="w-full h-11 px-4 text-sm bg-white border border-ailys-bone-border focus:border-ailys-gold focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="gold" size="sm" type="submit" className="flex-1">
                  M&apos;avertir par SMS / Email
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
          </div>
        </div>
      )}
    </div>
  );
}
