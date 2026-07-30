import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Fuel } from "lucide-react";
import { nav, site } from "@/data/site";
import { cn } from "@/lib/utils";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { UserButton, SignedIn, SignedOut } from "@/lib/auth/gates";
import { authEnabled } from "@/lib/auth/client";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isPending } = useCurrentUserState();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-fg">
            <Fuel className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <span className="truncate">
            <span className="block text-sm font-semibold tracking-tight text-fg">
              {site.shortName}
            </span>
            <span className="hidden text-[11px] text-subtle sm:block">
              Services · Tools · Creative
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex">
          {nav.map((item) => {
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-lg px-2.5 py-2 text-[13px] transition-colors",
                  active
                    ? "bg-surface-2 text-fg"
                    : "text-muted hover:bg-surface hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {authEnabled ? (
            <div className="hidden sm:flex sm:items-center sm:gap-2">
              {isPending ? (
                <div className="h-8 w-20 animate-pulse rounded-lg bg-surface-2" />
              ) : (
                <>
                  <SignedOut>
                    <Link
                      to="/login"
                      className="h-9 rounded-lg border border-border px-3 text-sm font-medium text-fg transition hover:border-border-strong"
                    >
                      Sign in
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <Link
                      to="/account"
                      className="text-sm text-muted hover:text-fg"
                    >
                      Account
                    </Link>
                    <UserButton />
                  </SignedIn>
                </>
              )}
            </div>
          ) : null}
          <a
            href={`sms:${site.phoneRaw}`}
            className="hidden h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-fg transition hover:brightness-110 md:inline-flex"
          >
            Text us
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-surface text-fg xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-bg-elevated xl:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-fg hover:bg-surface"
              >
                {item.label}
              </Link>
            ))}
            {authEnabled ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm text-primary"
                >
                  Sign in / account
                </Link>
              </>
            ) : null}
            <a
              href={`mailto:${site.email}`}
              className="rounded-lg px-3 py-3 text-sm text-primary"
              onClick={() => setOpen(false)}
            >
              {site.email}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
