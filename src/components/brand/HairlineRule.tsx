import React from "react";
import { cn } from "@/lib/utils";
import { BotanicalEmblem } from "./BotanicalEmblem";

interface HairlineRuleProps {
  className?: string;
  variant?: "simple" | "with-emblem" | "with-diamond";
  tone?: "gold" | "dark" | "light";
  emblemSize?: number;
}

export function HairlineRule({
  className,
  variant = "with-emblem",
  tone = "gold",
  emblemSize = 22,
}: HairlineRuleProps) {
  const lineClasses = {
    gold: "border-ailys-gold/40",
    dark: "border-ailys-black/20",
    light: "border-ailys-bone/30",
  }[tone];

  const diamondFill = {
    gold: "bg-ailys-gold",
    dark: "bg-ailys-black",
    light: "bg-ailys-bone",
  }[tone];

  if (variant === "simple") {
    return <hr className={cn("w-full border-t border-solid", lineClasses, className)} />;
  }

  if (variant === "with-diamond") {
    return (
      <div className={cn("flex items-center justify-center gap-4 w-full", className)}>
        <span className={cn("flex-1 border-t border-solid", lineClasses)} />
        <span className={cn("w-1.5 h-1.5 rotate-45 shrink-0", diamondFill)} />
        <span className={cn("flex-1 border-t border-solid", lineClasses)} />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center gap-4 w-full select-none", className)}>
      <span className={cn("flex-1 border-t border-solid", lineClasses)} />
      <BotanicalEmblem
        size={emblemSize}
        variant={tone === "light" ? "bone" : tone === "dark" ? "black" : "gold"}
        className="shrink-0"
      />
      <span className={cn("flex-1 border-t border-solid", lineClasses)} />
    </div>
  );
}
