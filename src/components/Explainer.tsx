import { cn } from "@/lib/utils";

export function ExplainerSteps({
  steps,
}: {
  steps: { step: string; title: string; body: string }[];
}) {
  return (
    <ol className="relative space-y-0">
      {steps.map((s, i) => (
        <li key={s.step} className="relative flex gap-4 pb-10 last:pb-0">
          {i < steps.length - 1 ? (
            <span
              aria-hidden
              className="absolute left-[1.15rem] top-10 h-[calc(100%-1.5rem)] w-px bg-border"
            />
          ) : null}
          <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-mono text-xs font-semibold text-primary">
            {s.step}
          </span>
          <div className="pt-1">
            <h3 className="text-base font-semibold text-fg">{s.title}</h3>
            <p className="mt-1.5 text-sm text-muted leading-relaxed">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function FeatureGrid({
  items,
}: {
  items: { title: string; body: string; icon?: React.ReactNode }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.title}
          className={cn(
            "panel shine-border rounded-2xl p-5 transition-colors hover:border-border-strong",
          )}
        >
          {item.icon ? (
            <div className="mb-3 text-primary">{item.icon}</div>
          ) : null}
          <h3 className="font-semibold text-fg">{item.title}</h3>
          <p className="mt-2 text-sm text-muted leading-relaxed">{item.body}</p>
        </div>
      ))}
    </div>
  );
}
