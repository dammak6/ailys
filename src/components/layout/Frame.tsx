import React from "react";
import { cn } from "@/lib/utils";
import { BotanicalEmblem } from "../brand/BotanicalEmblem";

interface FrameProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "simple" | "corner-accent" | "top-emblem";
  tone?: "gold" | "dark" | "light";
  inset?: boolean;
}

export function Frame({
  className,
  variant = "simple",
  tone = "gold",
  inset = false,
  children,
  ...props
}: FrameProps) {
  const borderClasses = {
    gold: "border-ailys-gold/40",
    dark: "border-ailys-black/20",
    light: "border-ailys-bone/30",
  }[tone];

  return (
    <div
      className={cn(
        "relative p-6 sm:p-10 border transition-all duration-300",
        borderClasses,
        inset && "m-2 sm:m-4",
        className
      )}
      {...props}
    >
      {variant === "top-emblem" && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 bg-ailys-bone">
          <BotanicalEmblem size={20} variant={tone === "light" ? "bone" : "gold"} />
        </div>
      )}

      {variant === "corner-accent" && (
        <>
          <span className={cn("absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2", borderClasses)} />
          <span className={cn("absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2", borderClasses)} />
          <span className={cn("absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2", borderClasses)} />
          <span className={cn("absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2", borderClasses)} />
        </>
      )}

      {children}
    </div>
  );
}
