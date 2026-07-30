import { cn } from "@/lib/utils";

export function Section({
  className,
  children,
  id,
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-20", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10 max-w-2xl">
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-base text-muted leading-relaxed">{description}</p>
      ) : null}
    </div>
  );
}
