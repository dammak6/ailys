import React from "react";
import { cn } from "@/lib/utils";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | "editorial-split" | "story-split";
  gap?: "sm" | "md" | "lg" | "xl";
}

export function Grid({
  className,
  cols = 3,
  gap = "lg",
  children,
  ...props
}: GridProps) {
  const colClasses = {
    1: "grid grid-cols-1",
    2: "grid grid-cols-1 sm:grid-cols-2",
    3: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    "editorial-split": "grid grid-cols-1 lg:grid-cols-12 gap-8 items-center",
    "story-split": "grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center",
  }[cols];

  const gapClasses = {
    sm: "gap-4 sm:gap-6",
    md: "gap-6 sm:gap-8",
    lg: "gap-8 sm:gap-10 lg:gap-12",
    xl: "gap-10 sm:gap-14 lg:gap-16",
  }[gap];

  return (
    <div className={cn(colClasses, cols !== "editorial-split" && cols !== "story-split" && gapClasses, className)} {...props}>
      {children}
    </div>
  );
}
