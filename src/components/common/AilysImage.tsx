"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { ImageTransformMetadata } from "@/lib/data";

export interface AilysImageProps extends Omit<ImageProps, "onLoad"> {
  aspectRatio?:
    | "portrait"
    | "portrait-tall"
    | "square"
    | "landscape"
    | "hero"
    | "auto"
    | "16:9"
    | "21:9"
    | "16:10"
    | "4:3"
    | "1:1"
    | "3:4"
    | "2:3"
    | "9:16";
  focalPoint?: { x: number; y: number };
  zoom?: number;
  rotate?: number;
  objectPosition?: string;
  transform?: ImageTransformMetadata;
  hoverZoom?: boolean;
  containerClassName?: string;
  overlay?: boolean;
}

export function AilysImage({
  src,
  alt,
  aspectRatio = "portrait",
  focalPoint,
  zoom,
  rotate,
  objectPosition,
  transform,
  hoverZoom = false,
  containerClassName,
  overlay = false,
  className,
  priority = false,
  fill = true,
  ...props
}: AilysImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const effectiveRatio = transform?.aspectRatio && transform.aspectRatio !== "original"
    ? transform.aspectRatio
    : aspectRatio;

  const aspectClasses: Record<string, string> = {
    portrait: "aspect-[3/4]",
    "3:4": "aspect-[3/4]",
    "portrait-tall": "aspect-[2/3]",
    "2:3": "aspect-[2/3]",
    square: "aspect-square",
    "1:1": "aspect-square",
    landscape: "aspect-[16/10]",
    "16:10": "aspect-[16/10]",
    hero: "aspect-[16/9] sm:aspect-[21/9]",
    "16:9": "aspect-[16/9]",
    "21:9": "aspect-[21/9]",
    "4:3": "aspect-[4/3]",
    "9:16": "aspect-[9/16]",
    auto: "",
    original: "",
  };

  const effectiveFocal = transform?.focalPoint || focalPoint;
  const effectiveZoom = transform?.zoom || zoom || 1;
  const effectiveRotate = transform?.rotate || rotate || 0;
  const effectivePosition =
    transform?.objectPosition ||
    objectPosition ||
    (effectiveFocal ? `${effectiveFocal.x}% ${effectiveFocal.y}%` : "center");

  const imageTransformStyle: React.CSSProperties = {
    objectPosition: effectivePosition,
    transform:
      effectiveZoom !== 1 || effectiveRotate !== 0
        ? `scale(${effectiveZoom}) rotate(${effectiveRotate}deg)`
        : undefined,
    transformOrigin: effectiveFocal
      ? `${effectiveFocal.x}% ${effectiveFocal.y}%`
      : "center",
    ...props.style,
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-ailys-bone-dark/50 select-none",
        effectiveRatio !== "auto" && effectiveRatio !== "original" && (aspectClasses[effectiveRatio] || "aspect-[3/4]"),
        containerClassName
      )}
    >
      {!hasError ? (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={imageTransformStyle}
          className={cn(
            "object-cover transition-all duration-700 ease-editorial",
            !isLoaded ? "opacity-0 scale-[1.02] blur-sm" : "opacity-100 blur-0",
            hoverZoom && "group-hover:scale-105 duration-1000",
            className
          )}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          {...props}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-ailys-bone-dark text-ailys-muted text-xs uppercase tracking-widest">
          AÏLYS
        </div>
      )}

      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      )}
    </div>
  );
}

