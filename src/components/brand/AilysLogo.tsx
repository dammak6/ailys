"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AilysLogoProps {
  className?: string;
  variant?: "dark" | "light" | "gold";
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  onClick?: () => void;
  priority?: boolean;
}

export function AilysLogo({
  className,
  variant = "dark",
  size = "md",
  href = "/",
  onClick,
  priority = true,
}: AilysLogoProps) {
  // Proportional 1:1 aspect ratio strictly preserving the official 566.93 x 566.93 SVG geometry
  const sizeMap = {
    sm: {
      width: 72,
      height: 72,
      className: "w-[64px] h-[64px] sm:w-[72px] sm:h-[72px]",
    },
    md: {
      width: 96,
      height: 96,
      className: "w-[80px] h-[80px] sm:w-[96px] sm:h-[96px]",
    },
    lg: {
      width: 128,
      height: 128,
      className: "w-[110px] h-[110px] sm:w-[128px] sm:h-[128px]",
    },
    xl: {
      width: 160,
      height: 160,
      className: "w-[140px] h-[140px] sm:w-[160px] sm:h-[160px]",
    },
  };

  const currentSize = sizeMap[size];
  const isLight = variant === "light" || variant === "gold";

  const content = (
    <div
      className={cn(
        "relative flex items-center justify-center select-none shrink-0 transition-transform duration-300",
        currentSize.className,
        className
      )}
    >
      <Image
        src="/logo.svg"
        alt="AÏLYS"
        width={currentSize.width}
        height={currentSize.height}
        priority={priority}
        className={cn(
          "w-full h-full object-contain transition-all duration-300",
          isLight && "brightness-0 invert"
        )}
      />
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        aria-label="AÏLYS - Accueil"
        className="inline-flex items-center justify-center transition-opacity hover:opacity-85 focus:outline-none"
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn("inline-flex items-center justify-center", onClick && "cursor-pointer")}
    >
      {content}
    </div>
  );
}
