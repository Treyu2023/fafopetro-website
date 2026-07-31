import { useEffect, useId, useRef, useState } from "react";
import { Check, Palette, X } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import type { ThemeId } from "@/lib/themes";

export function ThemePicker() {
  const { themeId, themes, setTheme, theme } = useTheme();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    // defer so the open click doesn't immediately close
    const t = window.setTimeout(() => {
      window.addEventListener("mousedown", onPointer);
    }, 0);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  return (
    <div className="fixed bottom-4 right-4 z-[60] sm:bottom-6 sm:right-6" ref={panelRef}>
      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Choose site theme"
          className="mb-3 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_20px_50px_-20px_rgba(0,0,0,0.55)] shine-border fade-up"
        >
          <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold tracking-tight text-fg">
                Interface themes
              </p>
              <p className="mt-0.5 text-xs text-muted">
                Preview looks · preference saves on this device
              </p>
            </div>
            <button
              type="button"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-bg-elevated text-muted transition hover:text-fg"
              aria-label="Close theme picker"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <ul className="max-h-[min(70dvh,28rem)] space-y-1.5 overflow-y-auto p-2">
            {themes.map((t) => {
              const active = t.id === themeId;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => setTheme(t.id as ThemeId)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition",
                      active
                        ? "border-primary/50 bg-primary/10"
                        : "border-transparent bg-bg-elevated/60 hover:border-border hover:bg-bg-elevated",
                    )}
                  >
                    <span
                      className="mt-0.5 flex h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border"
                      aria-hidden
                    >
                      <span
                        className="h-full w-1/2"
                        style={{ background: t.swatches.bg }}
                      />
                      <span className="flex h-full w-1/2 flex-col">
                        <span
                          className="h-1/2 w-full"
                          style={{ background: t.swatches.primary }}
                        />
                        <span
                          className="h-1/2 w-full"
                          style={{ background: t.swatches.surface }}
                        />
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-medium text-fg">
                          {t.name}
                        </span>
                        {active ? (
                          <Check
                            className="h-3.5 w-3.5 text-primary"
                            strokeWidth={2.5}
                          />
                        ) : null}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-muted">
                        {t.tagline}
                      </span>
                      <span className="mt-1.5 inline-flex items-center gap-1.5">
                        {[t.swatches.primary, t.swatches.accent, t.swatches.surface].map(
                          (c) => (
                            <span
                              key={c}
                              className="h-2.5 w-2.5 rounded-full border border-border-strong/40"
                              style={{ background: c }}
                            />
                          ),
                        )}
                        <span className="text-[10px] uppercase tracking-wider text-subtle">
                          {t.mode}
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-border bg-bg-elevated/80 px-4 py-2.5">
            <p className="text-[11px] text-subtle">
              Active: <span className="font-medium text-muted">{theme.name}</span>
              {" · "}Tell us which ones to keep as permanent options.
            </p>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-12 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-medium text-fg shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)] transition hover:border-border-strong primary-glow",
        )}
      >
        <Palette className="h-4 w-4 text-primary" />
        <span className="hidden sm:inline">Themes</span>
        <span className="text-subtle sm:hidden">UI</span>
      </button>
    </div>
  );
}
