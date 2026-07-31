import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-[var(--radius-sm)] border border-border-strong bg-bg-elevated/90 px-3 py-2 text-sm text-fg placeholder:text-subtle shadow-[inset_0_1px_0_color-mix(in_oklab,#fff_5%,transparent),0_0_0_1px_color-mix(in_oklab,#000_30%,transparent)] transition-[box-shadow,border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:border-primary/40 focus-visible:shadow-[0_0_20px_color-mix(in_oklab,var(--color-primary)_18%,transparent)] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";
