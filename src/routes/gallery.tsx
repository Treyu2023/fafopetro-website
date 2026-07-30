import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/Section";
import { Badge } from "@/components/ui/badge";
import { aicStory, site } from "@/data/site";
import { Sparkles } from "lucide-react";
import { useMediaSlots } from "@/components/MediaSlot";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
  head: () => ({
    meta: [{ title: "Gallery | FAFO Petro Services" }],
  }),
});

function GalleryPage() {
  const { slots } = useMediaSlots();
  const items = Array.from({ length: 8 }, (_, i) => slots[`gallery.${i}`]).filter(
    Boolean,
  );

  return (
    <>
      <Section className="pb-8 pt-14">
        <Badge className="mb-4">Gallery</Badge>
        <SectionHeading
          title="AI art vault & product stills."
          description="Replace any tile from Media admin — changes go live without a redeploy."
        />
      </Section>

      <Section className="pt-0">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((g) => (
            <figure
              key={g!.key}
              className="group overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <div className="aspect-[4/3] overflow-hidden bg-bg-elevated">
                {g!.kind === "video" && g!.src ? (
                  <video
                    src={g!.src}
                    poster={g!.poster || undefined}
                    controls
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={g!.src}
                    alt={g!.alt}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                )}
              </div>
              <figcaption className="border-t border-border px-4 py-3 text-sm text-muted">
                {g!.caption || g!.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border bg-bg-elevated/40" id="aic">
        <div className="mb-3 inline-flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Artificial Intelligence Corner
          </span>
        </div>
        <SectionHeading title={aicStory.title} description={aicStory.lead} />
        <div className="panel shine-border max-w-3xl space-y-4 rounded-2xl p-6 sm:p-8">
          {aicStory.paragraphs.map((p) => (
            <p
              key={p.slice(0, 40)}
              className="text-sm text-muted leading-relaxed"
            >
              {p}
            </p>
          ))}
          <p className="pt-2 text-xs text-subtle">
            — {site.founder}, founder · {site.name}
          </p>
        </div>
      </Section>
    </>
  );
}
