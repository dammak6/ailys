import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-sans uppercase tracking-[0.18em] transition-all duration-300 font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ailys-gold disabled:pointer-events-none disabled:opacity-40 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-ailys-black text-ailys-bone hover:bg-ailys-black/90 active:scale-[0.99] border border-ailys-black shadow-sm",
        gold:
          "bg-ailys-gold text-ailys-black hover:bg-ailys-gold-light active:scale-[0.99] border border-ailys-gold font-semibold shadow-gold-glow",
        outline:
          "bg-transparent text-ailys-black border border-ailys-black hover:bg-ailys-black hover:text-ailys-bone",
        "outline-gold":
          "bg-transparent text-ailys-gold border border-ailys-gold hover:bg-ailys-gold hover:text-ailys-black",
        "outline-light":
          "bg-transparent text-ailys-bone border border-ailys-bone hover:bg-ailys-bone hover:text-ailys-black",
        secondary:
          "bg-ailys-bone-dark text-ailys-black hover:bg-ailys-bone-border border border-ailys-bone-border",
        ghost:
          "bg-transparent text-ailys-black hover:text-ailys-gold hover:bg-black/5",
        "ghost-light":
          "bg-transparent text-ailys-bone hover:text-ailys-gold-light hover:bg-white/5",
        link:
          "bg-transparent underline-offset-8 hover:underline p-0 h-auto tracking-widest text-ailys-black hover:text-ailys-gold",
      },
      size: {
        sm: "h-9 px-4 text-[11px]",
        md: "h-11 px-6 text-xs",
        lg: "h-13 px-8 text-xs sm:text-sm tracking-[0.22em]",
        xl: "h-15 px-10 text-sm tracking-[0.25em]",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Chargement...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
