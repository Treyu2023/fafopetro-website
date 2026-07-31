import type { ReactNode } from "react";
import { Fuel } from "lucide-react";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  size?: "sm" | "md" | "lg" | "hero";
  className?: string;
  showTagline?: boolean;
};

const sizes = {
  sm: {
    fafo: "text-lg tracking-[0.12em]",
    petro: "text-base tracking-[0.18em]",
    badge: "h-7 w-7",
    icon: "h-3.5 w-3.5",
    gap: "gap-1",
  },
  md: {
    fafo: "text-2xl tracking-[0.14em]",
    petro: "text-xl tracking-[0.2em]",
    badge: "h-9 w-9",
    icon: "h-4 w-4",
    gap: "gap-1.5",
  },
  lg: {
    fafo: "text-4xl tracking-[0.12em] sm:text-5xl",
    petro: "text-3xl tracking-[0.18em] sm:text-4xl",
    badge: "h-12 w-12 sm:h-14 sm:w-14",
    icon: "h-6 w-6",
    gap: "gap-2",
  },
  hero: {
    fafo: "text-5xl tracking-[0.1em] sm:text-6xl lg:text-7xl",
    petro: "text-4xl tracking-[0.16em] sm:text-5xl lg:text-6xl",
    badge: "h-14 w-14 sm:h-16 sm:w-16 lg:h-[4.5rem] lg:w-[4.5rem]",
    icon: "h-7 w-7 sm:h-8 sm:w-8",
    gap: "gap-2",
  },
};

/** Original FAFO pump badge — amber shield, not a third-party brand mark. */
export function PumpBadge({
  className,
  size = "md",
}: {
  className?: string;
  size?: keyof typeof sizes;
}) {
  return (
    <span
      className={cn(
        "pump-badge inline-flex shrink-0 items-center justify-center text-primary-fg",
        sizes[size].badge,
        className,
      )}
      aria-hidden="true"
    >
      <Fuel className={sizes[size].icon} strokeWidth={2.5} />
    </span>
  );
}

export function BrandMark({ size = "md", className, showTagline = false }: BrandMarkProps) {
  const s = sizes[size];
  return (
    <div className={cn("inline-flex flex-col", s.gap, className)}>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <PumpBadge size={size} />
        <span className={cn("font-sign text-primary sign-outline-amber", s.fafo)}>FAFO</span>
        <span className={cn("font-sign text-fg sign-outline", s.petro)}>PETRO</span>
      </div>
      {showTagline ? (
        <p className="font-condensed text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-muted sm:text-xs">
          Services LLC · Field Service · NC Triad
        </p>
      ) : null}
    </div>
  );
}

export function SignHeading({
  children,
  as: Tag = "h2",
  className,
  accent,
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
  accent?: string;
}) {
  return (
    <Tag className={cn("sign-board", className)}>
      {accent ? (
        <span className="sign-board__accent font-condensed">{accent}</span>
      ) : null}
      <span className="sign-board__title font-sign">{children}</span>
    </Tag>
  );
}
