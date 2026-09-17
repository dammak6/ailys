import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BotanicalEmblem } from "./BotanicalEmblem";

interface AilysLogoProps {
  className?: string;
  variant?: "dark" | "light" | "gold";
  size?: "sm" | "md" | "lg" | "xl";
  showEmblem?: boolean;
  href?: string;
  useImage?: boolean;
  onClick?: () => void;
}

export function AilysLogo({
  className,
  variant = "dark",
  size = "md",
  showEmblem = true,
  href = "/",
  useImage = true,
  onClick,
}: AilysLogoProps) {
  const sizeMap = {
    sm: { width: 110, height: 50, textSize: "text-xl", emblemSize: 16 },
    md: { width: 140, height: 64, textSize: "text-2xl", emblemSize: 20 },
    lg: { width: 190, height: 86, textSize: "text-3xl", emblemSize: 26 },
    xl: { width: 260, height: 118, textSize: "text-5xl", emblemSize: 34 },
  };

  const currentSize = sizeMap[size];

  const content = useImage ? (
    <div className={cn("relative flex items-center justify-center select-none", className)}>
      <Image
        src={
          variant === "light"
            ? "/brand/ailys-logo-reversed.png"
            : variant === "gold"
            ? "/brand/ailys-logo-gold-transparent.png"
            : "/brand/ailys-logo-black-transparent.png"
        }
        alt="AÏLYS"
        width={currentSize.width}
        height={currentSize.height}
        priority
        className={cn(
          "object-contain transition-all duration-300",
          variant === "light" && "brightness-0 invert"
        )}
      />
    </div>
  ) : (
    <div
      className={cn(
        "flex flex-col items-center justify-center select-none group",
        variant === "light" ? "text-ailys-bone" : variant === "gold" ? "text-ailys-gold" : "text-ailys-black",
        className
      )}
    >
      {/* Editorial wordmark */}
      <span
        className={cn(
          "font-editorial-heading tracking-[0.18em] leading-none font-medium transition-colors",
          currentSize.textSize
        )}
      >
        AÏLYS
      </span>

      {/* Emblem with flanking hairline rules */}
      {showEmblem && (
        <div className="flex items-center justify-center gap-2 mt-1.5 w-full max-w-[120px]">
          <span
            className={cn(
              "flex-1 border-t",
              variant === "light"
                ? "border-ailys-bone/30"
                : variant === "gold"
                ? "border-ailys-gold/40"
                : "border-ailys-black/20"
            )}
          />
          <BotanicalEmblem
            size={currentSize.emblemSize}
            variant={variant === "gold" ? "gold" : variant === "light" ? "bone" : "black"}
          />
          <span
            className={cn(
              "flex-1 border-t",
              variant === "light"
                ? "border-ailys-bone/30"
                : variant === "gold"
                ? "border-ailys-gold/40"
                : "border-ailys-black/20"
            )}
          />
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className="inline-block transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={cn(onClick && "cursor-pointer")}>
      {content}
    </div>
  );
}
