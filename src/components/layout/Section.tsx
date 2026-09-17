import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  tone?: "bone" | "bone-light" | "black" | "dark";
  spacing?: "none" | "sm" | "md" | "lg" | "xl" | "hero";
  eyebrow?: string;
  title?: string;
  description?: string;
  align?: "center" | "left" | "right";
}

export function Section({
  as: Component = "section",
  className,
  tone = "bone",
  spacing = "lg",
  eyebrow,
  title,
  description,
  align = "center",
  children,
  ...props
}: SectionProps) {
  const toneClasses = {
    bone: "bg-ailys-bone text-ailys-black",
    "bone-light": "bg-ailys-bone-light text-ailys-black",
    black: "bg-ailys-black text-ailys-bone",
    dark: "bg-ailys-dark-surface text-ailys-bone",
  }[tone];

  const spacingClasses = {
    none: "py-0",
    sm: "py-10 sm:py-12",
    md: "py-14 sm:py-20",
    lg: "py-20 sm:py-28 lg:py-32",
    xl: "py-24 sm:py-36 lg:py-44",
    hero: "pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32",
  }[spacing];

  const alignClasses = {
    center: "text-center mx-auto items-center",
    left: "text-left items-start",
    right: "text-right items-end",
  }[align];

  return (
    <Component
      className={cn("w-full relative transition-colors", toneClasses, spacingClasses, className)}
      {...props}
    >
      {(eyebrow || title || description) && (
        <div className={cn("flex flex-col max-w-2xl mb-12 sm:mb-16 md:mb-20 px-4", alignClasses)}>
          {eyebrow && (
            <span
              className={cn(
                "text-[11px] uppercase tracking-[0.25em] font-medium mb-3",
                tone === "black" || tone === "dark"
                  ? "text-ailys-gold"
                  : "text-ailys-gold-dark"
              )}
            >
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 className="font-editorial-heading text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight">
              {title}
            </h2>
          )}
          {description && (
            <p
              className={cn(
                "mt-4 text-sm sm:text-base font-sans leading-relaxed",
                tone === "black" || tone === "dark"
                  ? "text-ailys-bone/70"
                  : "text-ailys-black/70"
              )}
            >
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </Component>
  );
}
