import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, id, options, children, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-[11px] uppercase tracking-[0.18em] font-medium text-ailys-black/80"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "w-full h-11 pl-4 pr-10 bg-ailys-bone-light/80 text-ailys-black text-sm appearance-none",
              "border border-ailys-bone-border transition-colors duration-200 cursor-pointer",
              "focus:bg-white focus:border-ailys-gold focus:outline-none",
              error && "border-red-600 focus:border-red-600",
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <ChevronDown className="w-4 h-4 text-ailys-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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

Select.displayName = "Select";
