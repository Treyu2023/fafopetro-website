import { cn } from "@/lib/utils";

export type GalleryItem = {
  title: string;
  tag: string;
  blurb: string;
  accent?: string;
};

const DEFAULT_ITEMS: GalleryItem[] = [
  {
    title: "FAFO Progen",
    tag: "Prompt console",
    blurb: "Layer prompts like code — camera, light, character, rerolls.",
    accent: "#ffb12a",
  },
  {
    title: "Local Media",
    tag: "New Tab hub",
    blurb: "Your files, your machine — cinema mode, playlists, VFX.",
    accent: "#38bdf8",
  },
  {
    title: "Commander tools",
    tag: "Field software",
    blurb: "Price book drill-down, port status, backup pulls.",
    accent: "#34d399",
  },
  {
    title: "Site AI help",
    tag: "Integration",
    blurb: "Reports, reconciliation structure, complex task assist.",
    accent: "#f472b6",
  },
  {
    title: "C-Site / C-Store",
    tag: "Back office",
    blurb: "Setup guidance so links and accounts land clean.",
    accent: "#a78bfa",
  },
  {
    title: "PA-DSS habits",
    tag: "Guidance",
    blurb: "Practical hardening talk — not a certificate mill.",
    accent: "#fb923c",
  },
];

export function SpinGallery({
  items = DEFAULT_ITEMS,
  className,
}: {
  items?: GalleryItem[];
  className?: string;
}) {
  const n = items.length;
  const radius = 240;

  return (
    <div className={cn("ai-stage py-6", className)}>
      <div className="ai-ring" style={{ transformStyle: "preserve-3d" }}>
        {items.map((item, i) => {
          const angle = (360 / n) * i;
          return (
            <div
              key={item.title}
              className="ai-ring__item"
              style={{
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
              }}
            >
              <div
                className="ai-card-3d"
                style={{
                  borderColor: `color-mix(in oklab, ${item.accent ?? "#ffb12a"} 45%, transparent)`,
                }}
              >
                <span
                  className="mb-2 text-[0.65rem] font-condensed font-bold uppercase tracking-[0.18em]"
                  style={{ color: item.accent ?? "var(--color-primary)" }}
                >
                  {item.tag}
                </span>
                <h3 className="font-sign text-xl uppercase tracking-wide text-fg">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{item.blurb}</p>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-center text-xs text-subtle">
        Hover to pause the spin · drag not required
      </p>
    </div>
  );
}
