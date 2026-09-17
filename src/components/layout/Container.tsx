import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  noPadding?: boolean;
}

export function Container({
  className,
  size = "xl",
  noPadding = false,
  children,
  ...props
}: ContainerProps) {
  const sizeClasses = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    "2xl": "max-w-[1536px]",
    full: "max-w-none",
  }[size];

  return (
    <div
      className={cn(
        "w-full mx-auto",
        !noPadding && "px-4 sm:px-6 md:px-8 lg:px-12",
        sizeClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
