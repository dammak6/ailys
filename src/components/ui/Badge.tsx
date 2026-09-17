import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "dark" | "soldOut" | "capsule" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-ailys-bone-dark text-ailys-black border border-ailys-bone-border",
    gold: "bg-ailys-gold/10 text-ailys-gold-dark border border-ailys-gold/40",
    dark: "bg-ailys-black text-ailys-bone border border-ailys-black",
    soldOut: "bg-ailys-black/80 text-ailys-bone border border-ailys-black/90",
    capsule: "bg-ailys-gold text-ailys-black font-semibold tracking-[0.2em]",
    outline: "bg-transparent text-ailys-black border border-ailys-black/30",
  }[variant];

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-[11px]",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center uppercase tracking-[0.16em] font-medium transition-colors select-none",
        variantStyles,
        sizeStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
