import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] text-sm font-medium transition-[color,box-shadow,transform,background-color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-fg glow-amber hover:bg-[color-mix(in_oklab,var(--color-primary)_92%,#fff)]",
        secondary:
          "bg-surface/80 text-fg border border-border-strong backdrop-blur-sm hover:bg-surface-hover shadow-[inset_0_1px_0_color-mix(in_oklab,#fff_8%,transparent)]",
        outline:
          "border border-border-strong bg-bg/40 text-fg backdrop-blur-sm hover:bg-surface hover:shadow-[0_0_20px_color-mix(in_oklab,var(--color-primary)_15%,transparent)]",
        ghost: "text-fg hover:bg-surface/70",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-[var(--radius-xs)] px-3 text-xs",
        lg: "h-12 rounded-[var(--radius-md)] px-7 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
