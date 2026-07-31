import { useRef, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type TiltCard = {
  title: string;
  body: string;
  badge: string;
};

export function TiltGrid({ cards }: { cards: TiltCard[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <TiltCard key={c.title} {...c} />
      ))}
    </div>
  );
}

function TiltCard({ title, body, badge }: TiltCard) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(8px)`;
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "rotateY(0) rotateX(0) translateZ(0)";
  }

  return (
    <div className="ai-stage" style={{ perspective: "800px" }}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={cn(
          "ai-tilt lit-panel h-full rounded-[var(--radius-xl)] p-5 will-change-transform",
        )}
      >
        <div className="relative z-[1]">
          <span className="font-condensed text-[0.7rem] font-bold uppercase tracking-[0.18em] text-primary">
            {badge}
          </span>
          <h3 className="mt-2 font-display text-lg font-semibold tracking-wide">{title}</h3>
          <p className="mt-2 text-sm text-muted leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
  );
}
