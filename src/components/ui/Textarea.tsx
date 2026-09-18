import React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-[11px] uppercase tracking-[0.18em] font-medium text-ailys-black/80"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            id={textareaId}
            ref={ref}
            rows={rows}
            className={cn(
              "w-full p-4 bg-ailys-bone-light/80 text-ailys-black placeholder:text-ailys-muted/60 text-base sm:text-sm",
              "border border-ailys-bone-border transition-colors duration-200 resize-y",
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

Textarea.displayName = "Textarea";
