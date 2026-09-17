import React from "react";
import { cn } from "@/lib/utils";

interface BotanicalEmblemProps {
  className?: string;
  size?: number | string;
  color?: string;
  variant?: "gold" | "black" | "bone" | "current";
}

export function BotanicalEmblem({
  className,
  size = 28,
  variant = "gold",
}: BotanicalEmblemProps) {
  const colorMap = {
    gold: "#B79A5B",
    black: "#0B0B0B",
    bone: "#F5F3EC",
    current: "currentColor",
  };

  const fill = colorMap[variant];

  return (
    <svg
      width={size}
      height={typeof size === "number" ? Math.round(size * 0.75) : size}
      viewBox="0 0 100 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block transition-transform duration-300", className)}
      aria-hidden="true"
    >
      {/* Central petal */}
      <path
        d="M50 4 C50 4 39 20 40 46 C44 48 49 49 50 49 C51 49 56 48 60 46 C61 20 50 4 50 4Z"
        fill={fill}
      />
      <path
        d="M50 10 L50 46"
        stroke="#F5F3EC"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Mid Left petal */}
      <path
        d="M48 24 C48 24 28 20 20 38 C27 48 37 49 42 48 C41 40 45 28 48 24Z"
        fill={fill}
      />
      <path
        d="M46 27 C36 31 29 37 26 41"
        stroke="#F5F3EC"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Mid Right petal */}
      <path
        d="M52 24 C52 24 72 20 80 38 C73 48 63 49 58 48 C59 40 55 28 52 24Z"
        fill={fill}
      />
      <path
        d="M54 27 C64 31 71 37 74 41"
        stroke="#F5F3EC"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Bottom Left petal */}
      <path
        d="M41 49 C41 49 18 42 12 55 C22 66 36 62 42 57 C41 54 41 51 41 49Z"
        fill={fill}
      />
      <path
        d="M38 51 C27 52 20 57 17 60"
        stroke="#F5F3EC"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Bottom Right petal */}
      <path
        d="M59 49 C59 49 82 42 88 55 C78 66 64 62 58 57 C59 54 59 51 59 49Z"
        fill={fill}
      />
      <path
        d="M62 51 C73 52 80 57 83 60"
        stroke="#F5F3EC"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Bottom decorative base calyx */}
      <path
        d="M45 56 C47 62 50 65 50 65 C50 65 53 62 55 56 C52 57 48 57 45 56Z"
        fill={fill}
      />
    </svg>
  );
}
