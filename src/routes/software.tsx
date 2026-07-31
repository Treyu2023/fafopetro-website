import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Film, Sparkles, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/software")({
  component: SoftwarePage,
  head: () => ({
    meta: [
      { title: "Software | FAFO Petro Services — Local Media, Progen & more" },
      {
        name: "description",
        content:
          "Browser tools from FAFO: Local Media Center new-tab player, FAFO Progen AI prompt console, and support.",
      },
    ],
  }),
});

const products = [
  {
    icon: Film,
    name: "FAFO Local Media",
    tag: "Chrome extension · New Tab",
    description:
      "Turn your Chrome New Tab into a personal media center. Link local video and photo folders for immersive playback — playlists, cinema mode, VFX, and ambilight — with files that stay on your machine.",
    features: [
      "Photos, videos, or simultaneous mode",
      "Playlist manager & visual library",
      "Cinema, grid, carousel, and collage layouts",
      "Particle VFX and theme engine",
    ],
    href: "https://chromewebstore.google.com/detail/fafo-local-media-29/phdfnpaigllbkdjfflapdmcapkapolpe",
    cta: "Chrome Web Store",
  },
  {
    icon: Terminal,
    name: "FAFO Progen",
    tag: "Chrome extension · Prompt engineering",
    description:
      "A precision command console for AI artists and prompt engineers. Build high-fidelity prompts layer by layer for Grok Imagine and other generators — modular sections, dynamic context, and surgical rerolls.",
    features: [
      "Camera, composition, character, lighting modules",
      "Dynamic context / find-replace",
      "Syntax-highlighted terminal output",
      "Local-only — no prompt data to the cloud",
    ],
    href: "https://chromewebstore.google.com/detail/fafo-progen/epmbhjnfllakabbmoblbjbpjlimlaijl",
    cta: "Chrome Web Store",
  },
  {
    icon: Sparkles,
    name: "AI tools & support",
    tag: "Productivity",
    description:
      "AI-focused utilities and prompt-engineering experiments under the FAFO banner. Questions about any extension? Reach support by email.",
    features: [
      "Prompt engineering utilities",
      "Privacy-first, local-first mindset",
      "Active development from Siler City, NC",
      "Support: Rkey@FAFOPETRO.com",
    ],
    href: "mailto:Rkey@FAFOPETRO.com?subject=Software%20support",
    cta: "Email support",
  },
];

function SoftwarePage() {
  return (
    <div>
      <section className="border-b border-border grid-bg py-14 md:py-20">
        <div className="container-site max-w-3xl">
          <Badge className="mb-4">Software</Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Tools built by FAFO
          </h1>
          <p className="mt-4 text-muted leading-relaxed">
            Alongside field service, FAFO ships browser tools for media and AI
            workflows — privacy-first, local-first, and free to try on the Chrome
            Web Store.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="container-site grid gap-5 lg:grid-cols-3">
          {products.map((p) => (
            <Card key={p.name} className="flex flex-col">
              <CardHeader>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-primary-soft text-primary">
                  <p.icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-subtle">
                  {p.tag}
                </p>
                <CardTitle className="mt-1">{p.name}</CardTitle>
                <CardDescription>{p.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm text-muted">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant="secondary" className="w-full">
                  <a href={p.href} target="_blank" rel="noreferrer">
                    {p.cta}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
