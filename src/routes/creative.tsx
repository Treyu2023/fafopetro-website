import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/Section";
import { ExplainerSteps } from "@/components/Explainer";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { creativePipeline, site } from "@/data/site";
import { MediaSlot, useMediaSlots } from "@/components/MediaSlot";
import {
  Film,
  Music,
  Maximize,
  Clapperboard,
  Youtube,
  Gauge,
  Workflow,
  Sparkles,
  Upload,
} from "lucide-react";

export const Route = createFileRoute("/creative")({
  component: CreativePage,
  head: () => ({
    meta: [{ title: "Creative Studio | FAFO Petro Services" }],
  }),
});

function CreativeVideos() {
  const { slots } = useMediaSlots();
  const vids = ["creative.video.0", "creative.video.1", "creative.video.2"]
    .map((k) => slots[k])
    .filter((s) => s && s.src);
  const banner = slots["creative.banner"];
  return (
    <Section className="pt-0">
      {banner?.src ? (
        <div className="mb-8 overflow-hidden rounded-2xl border border-border">
          <img
            src={banner.src}
            alt={banner.alt}
            className="max-h-64 w-full object-cover"
          />
        </div>
      ) : null}
      {vids.length ? (
        <>
          <SectionHeading
            eyebrow="Showcase"
            title="Recent cuts"
            description="Swap these from Media admin (YouTube or MP4 URLs)."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {vids.map((v) => (
              <div
                key={v!.key}
                className="overflow-hidden rounded-2xl border border-border bg-surface"
              >
                <MediaSlot slotKey={v!.key} className="aspect-video w-full" />
                {v!.caption ? (
                  <p className="border-t border-border px-3 py-2 text-xs text-muted">
                    {v!.caption}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </>
      ) : null}
    </Section>
  );
}

function CreativePage() {
  return (
    <>
      <Section className="pb-8 pt-14">
        <Badge className="mb-4">Creative studio</Badge>
        <SectionHeading
          title="Music videos from blank project to social release."
          description="End-to-end workflow: write the track, run AI inference for the picture, cut hard in the editor, upscale to 4K, then ship the final cut. Open a step below when you want the detail — home page stays plain language."
        />
        <div className="flex flex-wrap gap-3">
          <a
            href={site.youtube}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-surface px-5 text-sm font-medium text-fg hover:border-border-strong"
          >
            <Youtube className="h-4 w-4 text-primary" />
            YouTube @rwkey
          </a>
          <a
            href={site.youtubePlaylist}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-surface px-5 text-sm font-medium text-fg hover:border-border-strong"
          >
            <Film className="h-4 w-4 text-primary" />
            Visualizer playlist
          </a>
        </div>
      </Section>

      <CreativeVideos />

      <Section className="border-y border-border bg-bg-elevated/40 pt-14">
        <SectionHeading
          eyebrow="Workflow"
          title="Project → inference → edit → 4K → release"
          description="Each stage is intentional. Click into the cards for how that stage works; the strip on the left is the whole path at a glance."
        />
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
          <ExplainerSteps steps={creativePipeline} />
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="mb-2 text-primary">
                  <Music className="h-5 w-5" />
                </div>
                <CardTitle>1 · Write & generate the music</CardTitle>
                <CardDescription>
                  Start with the song. Structure, hooks, and a master mix that
                  the picture will lock to — synthwave, chillstep, dark pop,
                  political anthems, trip-hop / bass, visualizer-ready pieces.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="mb-2 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <CardTitle>2 · AI inference for the picture</CardTitle>
                <CardDescription>
                  Generate stills and short cinematic clips timed to the track
                  (often 60–90 BPM). Build a bank of shots so the edit has real
                  choices — not one lucky generation.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="mb-2 text-primary">
                  <Clapperboard className="h-5 w-5" />
                </div>
                <CardTitle>3 · Edit the cut</CardTitle>
                <CardDescription>
                  Assemble in the NLE: hard cuts, grade, captions, platform
                  crops, and audio/picture lock for Shorts, Reels, or longer
                  visualizers.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="amber-glow border-primary/20">
              <CardHeader>
                <div className="mb-2 text-primary">
                  <Maximize className="h-5 w-5" />
                </div>
                <CardTitle>4 · Upscale to 4K</CardTitle>
                <CardDescription>
                  Push the finished edit through AI upscaling and frame
                  interpolation so the master is <strong className="text-fg">4K</strong>{" "}
                  and motion stays dense before social platforms crush the file.
                  Export platform-safe frame rates after the master is built.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="mb-2 text-primary">
                  <Upload className="h-5 w-5" />
                </div>
                <CardTitle>5 · Final cut & social release</CardTitle>
                <CardDescription>
                  Final export per platform, publish to YouTube @rwkey and
                  socials, archive masters, and note what worked for the next
                  project (and the tools that feed it).
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Why upscale the master"
          title="Build quality first, then meet the platform."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: <Clapperboard className="h-5 w-5" />,
              title: "Dense motion",
              body: "Interpolating frames before export keeps motion readable after compression eats the cut.",
            },
            {
              icon: <Maximize className="h-5 w-5" />,
              title: "4K canvas",
              body: "Upscale first so crops, zooms, and multi-platform exports start from a high-resolution master — not muddy source.",
            },
            {
              icon: <Youtube className="h-5 w-5" />,
              title: "Social release",
              body: "Ship platform-friendly exports for YouTube Shorts and feeds while keeping a true 4K master in the archive.",
            },
          ].map((c) => (
            <Card key={c.title}>
              <CardHeader>
                <div className="mb-2 text-primary">{c.icon}</div>
                <CardTitle className="text-base">{c.title}</CardTitle>
                <CardDescription>{c.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border bg-bg-elevated/40">
        <SectionHeading
          eyebrow="Sync craft"
          title="Music and picture lock together on purpose."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <Gauge className="mb-2 h-5 w-5 text-primary" />
              <CardTitle className="text-base">BPM-aware clips</CardTitle>
              <CardDescription>
                Inference is planned around the track’s pulse so cuts land on
                downbeats and energy shifts — not random montage.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Workflow className="mb-2 h-5 w-5 text-primary" />
              <CardTitle className="text-base">Feedback into tools</CardTitle>
              <CardDescription>
                What works on the timeline feeds back into Progen modes and
                Architect matrix ratings so the next session starts smarter.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <p className="mt-8 text-sm text-subtle">
          Full visualizer archives live on YouTube. This page documents the
          workflow that makes them.
        </p>
      </Section>
    </>
  );
}
