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
      width: 90,
      height: 90,
      className: "w-[80px] h-[80px] sm:w-[90px] sm:h-[90px]",
    },
    md: {
      width: 120,
      height: 120,
      className: "w-[100px] h-[100px] sm:w-[120px] sm:h-[120px]",
    },
    lg: {
      width: 150,
      height: 150,
      className: "w-[130px] h-[130px] sm:w-[150px] sm:h-[150px]",
    },
    xl: {
      width: 180,
      height: 180,
      className: "w-[160px] h-[160px] sm:w-[180px] sm:h-[180px]",
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
