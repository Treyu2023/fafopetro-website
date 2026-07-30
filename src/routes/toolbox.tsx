import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/Section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { site, toolboxFeatures } from "@/data/site";
import {
  Layers,
  Sparkles,
  FolderOpen,
  Terminal,
  ExternalLink,
  Download,
  Github,
  Server,
  Tags,
} from "lucide-react";

export const Route = createFileRoute("/toolbox")({
  component: ToolboxPage,
  head: () => ({
    meta: [{ title: `Toolbox | ${site.brandName}` }],
  }),
});

const icons = [Layers, FolderOpen, Tags, Sparkles, Server, Terminal];

function ToolboxPage() {
  return (
    <>
      <Section className="pb-8 pt-14">
        <Badge className="mb-4">FAFO Toolbox</Badge>
        <SectionHeading
          title="Explainoramas for every tool that powers the brand."
          description="Progen, Local Media, Ultimate Tab, Architect, Power Toolbox, and Commander — built for creators and field operators who want control without surrendering data to a black box."
        />

        <div className="panel shine-border mb-8 rounded-2xl p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-2 text-primary">
                <Github className="h-4 w-4" />
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
                  Download hub
                </span>
              </div>
              <h2 className="text-lg font-semibold tracking-tight text-fg">
                GitHub + direct zips — better than Drive for shipping apps.
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted leading-relaxed">
                Versioned Releases, source history, and one-click zips beat a
                shared Drive folder. Grab a zip below (or from GitHub Releases),
                unzip, then Load unpacked in{" "}
                <code className="rounded bg-bg-elevated px-1.5 py-0.5 text-xs text-fg">
                  chrome://extensions
                </code>
                . Chrome Web Store stays available for Local Media when you want
                store install. For public visitors, make the GitHub repos public
                (they’re private today) so Release links work without login.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <a
                href={site.releaseExtensions}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-fg transition hover:brightness-110"
              >
                <Github className="h-4 w-4" />
                Extensions Release
              </a>
              <a
                href={site.releaseToolbox}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-medium text-fg transition hover:border-border-strong"
              >
                <Server className="h-4 w-4" />
                Toolbox Release
              </a>
            </div>
          </div>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Local Media 7.3.0",
                href: site.downloadLocalMedia,
              },
              {
                label: "Local Media full 7.3.0",
                href: site.downloadUltimateTab,
              },
              { label: "Progen", href: site.downloadProgen },
              { label: "Power Toolbox", href: site.downloadToolbox },
            ].map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  download
                  className="flex items-center gap-2 rounded-xl border border-border bg-bg-elevated px-3 py-2.5 text-sm text-muted transition hover:border-border-strong hover:text-fg"
                >
                  <Download className="h-3.5 w-3.5 text-primary" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2">
          {toolboxFeatures.map((f) => (
            <a
              key={f.id}
              href={`#${f.id}`}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-muted hover:border-border-strong hover:text-fg"
            >
              {f.name}
            </a>
          ))}
        </div>
      </Section>

      <Section className="space-y-8 pt-0">
        {toolboxFeatures.map((feat, idx) => {
          const Icon = icons[idx % icons.length];
          return (
            <article
              key={feat.id}
              id={feat.id}
              className="panel shine-border scroll-mt-24 grid gap-6 rounded-2xl p-6 sm:p-8 lg:grid-cols-[0.95fr_1.05fr]"
            >
              <div>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="mb-3">
                  {feat.tag}
                </Badge>
                <h2 className="text-2xl font-semibold tracking-tight text-fg">
                  {feat.name}
                </h2>
                <p className="mt-3 text-sm text-muted leading-relaxed">
                  {feat.summary}
                </p>
                {feat.links ? (
                  <div className="mt-5 flex flex-col gap-2">
                    {feat.links.map((l) => (
                      <a
                        key={l.href + l.label}
                        href={l.href}
                        target={l.href.startsWith("http") ? "_blank" : undefined}
                        rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                        download={l.href.startsWith("/downloads/") ? true : undefined}
                        className={
                          "primary" in l && (l as { primary?: boolean }).primary
                            ? "inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/15"
                            : "inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                        }
                      >
                        {l.label.includes("Chrome") ||
                        l.label.includes("Source") ||
                        l.label.includes("Release") ? (
                          <ExternalLink className="h-3.5 w-3.5" />
                        ) : (
                          <Download className="h-3.5 w-3.5" />
                        )}
                        {l.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
              <div>
                <h3 className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-subtle">
                  What it does
                </h3>
                <ul className="space-y-2.5">
                  {feat.points.map((p) => (
                    <li
                      key={p}
                      className="rounded-xl border border-border bg-bg-elevated px-4 py-3 text-sm text-muted leading-relaxed"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </Section>

      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="Architect deep-dive"
          title="Prompt engineering that stays on your device."
          description="FAFO Architect v15.1 is a single-file client app — local storage only. Technical guide condensed from the original docs."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Auto Mode",
              body: "One-click generation with subject anchors (e.g. “Cyberpunk Samurai”), complexity 1–10 (minimal → chaos), and rating bias toward 5★+ traits.",
            },
            {
              title: "Custom Wizard",
              body: "Three steps: camera/lighting/textures → energy/physics → atmosphere/engine/post. Reroll any set of six choices from the matrix.",
            },
            {
              title: "Library",
              body: "Save favorites, copy to clipboard, export JSON so clears and reinstalls don’t erase your work.",
            },
            {
              title: "Matrix Editor",
              body: "Enable traits, rate 1–10, inject colors, add custom aesthetics to the pool that Auto Mode and Wizard draw from.",
            },
          ].map((c) => (
            <Card key={c.title}>
              <CardHeader>
                <CardTitle className="text-base">{c.title}</CardTitle>
                <CardDescription>{c.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <Card className="mt-6 border-warn/20 bg-warn/5">
          <CardContent className="pt-2 text-sm text-muted leading-relaxed">
            <strong className="text-fg">Local storage note:</strong> Architect
            runs client-side. Clearing browser cache wipes data — use Export in
            the Edit tab regularly. If Library blanks out, Clear Library or
            Factory Reset restores a clean v15.x baseline. URL-sourced media in
            Local Media is not yet backed up across wipes — planned for a later
            release.
          </CardContent>
        </Card>
      </Section>

      <Section className="border-t border-border bg-bg-elevated/40">
        <SectionHeading
          eyebrow="Local Media 7.3"
          title="Unleash the NutKracken."
          description="New Tab becomes a local AI media player with tags, smart dupes, and pairs. Download 7.3.0, unzip, Load unpacked → FAFO Local Media LOAD THIS. Chrome may re-ask for folder access after updates."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Display modes",
              body: "Grid, Carousel, Cinematic ambient (blurred synced background), and Scrapbook for photos only. Scale-capped keeps native size.",
            },
            {
              title: "Library control",
              body: "Paging, folder import, playlists, right-click web import, settings backup — full local inventory.",
            },
            {
              title: "Tags & smart dupes",
              body: "100-char hard cap. AI prompt dumps in file comments are scrubbed and no longer auto-paint every video. Chips scroll instead of filling the screen.",
            },
          ].map((c) => (
            <Card key={c.title}>
              <CardHeader>
                <CardTitle className="text-base">{c.title}</CardTitle>
                <CardDescription>{c.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-sm text-subtle">
          Questions on extensions?{" "}
          <Link
            to="/contact"
            className="text-muted underline-offset-2 hover:text-fg hover:underline"
          >
            Contact support
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
