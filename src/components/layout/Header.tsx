import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/ai", label: "AI" },
  { to: "/software", label: "Software" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 border-b border-primary/15 bg-bg/75 backdrop-blur-xl shadow-[0_8px_32px_color-mix(in_oklab,#000_45%,transparent)]">
      <div className="canopy-bar w-full" aria-hidden="true" />
      <div className="container-site flex h-[4.25rem] items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center text-fg no-underline"
          onClick={() => setOpen(false)}
          aria-label="FAFO Petro Services home"
        >
          <BrandMark size="sm" />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {nav.map((item) => {
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname === item.to || pathname.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-[var(--radius-sm)] px-2.5 py-2 font-condensed text-[0.9rem] font-semibold uppercase tracking-[0.12em] transition-colors no-underline",
                  active
                    ? "bg-primary/15 text-primary shadow-[0_0_16px_color-mix(in_oklab,var(--color-primary)_20%,transparent)]"
                    : "text-muted hover:bg-surface/80 hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild size="sm" variant="secondary" className="font-condensed uppercase tracking-wider">
            <a href="tel:+19728771848">(972) 877-1848</a>
          </Button>
          <Button asChild size="sm" className="font-condensed uppercase tracking-wider">
            <Link to="/request">Request Service</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] border border-border-strong bg-surface/50 text-fg lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-primary/15 bg-bg-elevated/95 backdrop-blur-xl lg:hidden">
          <nav className="container-site flex flex-col gap-1 py-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-[var(--radius-sm)] px-3 py-3 font-condensed text-base font-semibold uppercase tracking-wider text-fg no-underline hover:bg-surface"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/request"
              className="mt-1 rounded-[var(--radius-sm)] bg-primary px-3 py-3 text-center font-condensed text-sm font-bold uppercase tracking-wider text-primary-fg no-underline glow-amber"
              onClick={() => setOpen(false)}
            >
              Request Service
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
