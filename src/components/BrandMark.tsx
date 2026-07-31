import type { ReactNode } from "react";
import { Fuel } from "lucide-react";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  size?: "sm" | "md" | "lg" | "hero";
  className?: string;
  showTagline?: boolean;
  /** Use brand kit logo image. */
  useLogoMark?: boolean;
  /** which kit mark: primary (pumpjack), drop (dark bg), unchained */
  logoVariant?: "primary" | "drop" | "unchained";
};

const sizes = {
  sm: {
    fafo: "text-lg tracking-[0.12em]",
    petro: "text-base tracking-[0.18em]",
    badge: "h-7 w-7",
    icon: "h-3.5 w-3.5",
    gap: "gap-1",
    logo: "h-9 w-auto max-w-[9.5rem]",
  },
  md: {
    fafo: "text-2xl tracking-[0.14em]",
    petro: "text-xl tracking-[0.2em]",
    badge: "h-9 w-9",
    icon: "h-4 w-4",
    gap: "gap-1.5",
    logo: "h-12 w-auto max-w-[12rem]",
  },
  lg: {
    fafo: "text-4xl tracking-[0.12em] sm:text-5xl",
    petro: "text-3xl tracking-[0.18em] sm:text-4xl",
    badge: "h-12 w-12 sm:h-14 sm:w-14",
    icon: "h-6 w-6",
    gap: "gap-2",
    logo: "h-16 w-auto max-w-[16rem] sm:h-20",
  },
  hero: {
    fafo: "text-5xl tracking-[0.1em] sm:text-6xl lg:text-7xl",
    petro: "text-4xl tracking-[0.16em] sm:text-5xl lg:text-6xl",
    badge: "h-14 w-14 sm:h-16 sm:w-16 lg:h-[4.5rem] lg:w-[4.5rem]",
    icon: "h-7 w-7 sm:h-8 sm:w-8",
    gap: "gap-2",
    logo: "h-28 w-auto max-w-[min(100%,18rem)] sm:h-32",
  },
};

const LOGO_SRC = {
  primary: "/media/brand/fafo-logo-primary.png",
  drop: "/media/brand/fafo-drop-logo.png",
  unchained: "/media/brand/fafo-unchained.png",
} as const;

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

export function LogoMark({
  className,
  size = "sm",
  variant = "primary",
}: {
  className?: string;
  size?: keyof typeof sizes;
  variant?: keyof typeof LOGO_SRC;
}) {
  const lightPlate = variant === "primary";
  return (
    <span
      className={cn(
        "inline-flex items-center",
        lightPlate && "rounded-md bg-[#f3eee4] px-1.5 py-0.5 shadow-[0_0_20px_color-mix(in_oklab,var(--color-primary)_15%,transparent)]",
      )}
    >
      <img
        src={LOGO_SRC[variant]}
        alt="FAFO Petro Services L.L.C."
        className={cn("object-contain object-left", sizes[size].logo, className)}
        width={280}
        height={200}
      />
    </span>
  );
}

export function BrandMark({
  size = "md",
  className,
  showTagline = false,
  useLogoMark = false,
  logoVariant = "primary",
}: BrandMarkProps) {
  const s = sizes[size];

  if (useLogoMark) {
    // Header: drop logo reads clean on asphalt; hero: primary plate
    const variant =
      logoVariant ??
      (size === "sm" || size === "md" ? "drop" : "primary");
    return (
      <div className={cn("inline-flex flex-col", s.gap, className)}>
        <LogoMark
          size={size}
          variant={size === "sm" || size === "md" ? "drop" : variant}
        />
        {showTagline ? (
          <p className="font-condensed text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-muted sm:text-xs">
            Field Service · NC Triad · Forged Autonomy
          </p>
        ) : null}
      </div>
    );
  }

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
  accent,
  as: Tag = "h2",
  className,
}: {
  children: ReactNode;
  accent?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={className}>
      {accent ? (
        <p className="mb-2 font-condensed text-xs font-bold uppercase tracking-[0.28em] text-primary">
          {accent}
        </p>
      ) : null}
      <Tag className="font-sign text-3xl uppercase tracking-wide text-fg sign-outline sm:text-4xl">
        {children}
      </Tag>
    </div>
  );
}
