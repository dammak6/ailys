import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[11px] uppercase tracking-[0.18em] font-medium text-ailys-black/80"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              "w-full h-11 px-4 bg-ailys-bone-light/80 text-ailys-black placeholder:text-ailys-muted/60 text-base sm:text-sm",
              "border border-ailys-bone-border transition-colors duration-200",
              "focus:bg-white focus:border-ailys-gold focus:outline-none",
              error && "border-red-600 focus:border-red-600",
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-[11px] text-red-600 tracking-wide">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-ailys-muted tracking-wide">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
