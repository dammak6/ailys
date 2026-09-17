"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, formatPrice } from "@/lib/utils";
import { Badge } from "../ui/Badge";

export interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  categoryName?: string;
  price: number;
  salePrice?: number;
  primaryImage: string;
  secondaryImage?: string;
  colors?: { name: string; hex: string }[];
  isSoldOut?: boolean;
  isNew?: boolean;
  isCapsule?: boolean;
  className?: string;
  onQuickView?: () => void;
  onNotifyMe?: () => void;
}

export function ProductCard({
  slug,
  name,
  categoryName,
  price,
  salePrice,
  primaryImage,
  secondaryImage,
  colors = [],
  isSoldOut = false,
  isNew = false,
  isCapsule = false,
  className,
  onNotifyMe,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  return (
    <div
      className={cn(
        "group flex flex-col text-left transition-all duration-300",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with secondary hover swap */}
      <Link
        href={`/products/${slug}`}
        className="relative block w-full aspect-[3/4] overflow-hidden bg-ailys-bone-dark/40 mb-4"
      >
        {/* Primary Image */}
        <Image
          src={primaryImage}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={cn(
            "object-cover transition-opacity duration-700 ease-editorial",
            isHovered && secondaryImage ? "opacity-0" : "opacity-100"
          )}
        />

        {/* Secondary Image on Hover */}
        {secondaryImage && (
          <Image
            src={secondaryImage}
            alt={`${name} - détail`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={cn(
              "object-cover transition-opacity duration-700 ease-editorial",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          />
        )}

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isSoldOut ? (
            <Badge variant="soldOut" size="sm">
              Épuisé
            </Badge>
          ) : isCapsule ? (
            <Badge variant="capsule" size="sm">
              Capsule
            </Badge>
          ) : isNew ? (
            <Badge variant="gold" size="sm">
              Nouveauté
            </Badge>
          ) : null}
        </div>

        {/* Sold out overlay button */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center p-4">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onNotifyMe?.();
              }}
              className="px-4 py-2.5 bg-ailys-bone text-ailys-black text-[11px] font-sans uppercase tracking-[0.2em] font-medium border border-ailys-bone shadow-md hover:bg-white transition-all"
            >
              M&apos;avertir
            </button>
          </div>
        )}
      </Link>

      {/* Product Meta */}
      <div className="flex flex-col gap-1.5 px-0.5">
        {categoryName && (
          <span className="text-[10px] uppercase tracking-[0.2em] text-ailys-muted">
            {categoryName}
          </span>
        )}

        <Link
          href={`/products/${slug}`}
          className="group-hover:text-ailys-gold transition-colors duration-300"
        >
          <h3 className="font-editorial-heading text-base sm:text-lg tracking-tight font-normal text-ailys-black">
            {name}
          </h3>
        </Link>

        {/* Price in TND */}
        <div className="flex items-center gap-2 mt-0.5">
          {salePrice ? (
            <>
              <span className="text-xs sm:text-sm font-sans font-medium text-ailys-black">
                {formatPrice(salePrice)}
              </span>
              <span className="text-xs sm:text-sm font-sans text-ailys-muted line-through">
                {formatPrice(price)}
              </span>
            </>
          ) : (
            <span className="text-xs sm:text-sm font-sans font-medium text-ailys-black">
              {formatPrice(price)}
            </span>
          )}
        </div>

        {/* Color swatches */}
        {colors.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            {colors.map((c, i) => (
              <button
                key={c.hex}
                type="button"
                aria-label={`Couleur ${c.name}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColor(i);
                }}
                className={cn(
                  "w-3 h-3 rounded-full border transition-all duration-200",
                  selectedColor === i
                    ? "ring-1 ring-ailys-black ring-offset-1 scale-110"
                    : "border-black/20 hover:scale-105"
                )}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
