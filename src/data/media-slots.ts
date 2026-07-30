/**
 * Canonical media slots for the public site.
 * Defaults ship in the repo; overrides live in the database and apply live
 * without a redeploy when you save from /admin-media.
 */
export type MediaKind = "image" | "video";

export type MediaSlotDef = {
  key: string;
  label: string;
  page: string;
  kind: MediaKind;
  /** Default public path or URL when no DB override */
  defaultSrc: string;
  defaultAlt?: string;
  defaultCaption?: string;
  defaultPoster?: string;
  notes?: string;
};

export const MEDIA_SLOTS: MediaSlotDef[] = [
  // Home hero
  {
    key: "home.hero.0",
    label: "Home hero — main tall",
    page: "Home",
    kind: "image",
    defaultSrc: "/images/site-0.jpg",
    defaultAlt: "Industrial cyberpunk night scene",
    defaultCaption: "Hero primary still",
  },
  {
    key: "home.hero.1",
    label: "Home hero — top right",
    page: "Home",
    kind: "image",
    defaultSrc: "/images/aic-2.jpg",
    defaultAlt: "Futuristic city skyline",
  },
  {
    key: "home.hero.2",
    label: "Home hero — bottom right",
    page: "Home",
    kind: "image",
    defaultSrc: "/images/aic-3.jpg",
    defaultAlt: "Neon bridge overlook",
  },
  // Gallery grid (8)
  {
    key: "gallery.0",
    label: "Gallery 1",
    page: "Gallery",
    kind: "image",
    defaultSrc: "/images/site-0.jpg",
    defaultAlt: "Industrial cyberpunk night scene — neon rail yard",
    defaultCaption: "Night rail — industrial synthwave frame",
  },
  {
    key: "gallery.1",
    label: "Gallery 2",
    page: "Gallery",
    kind: "image",
    defaultSrc: "/images/aic-2.jpg",
    defaultAlt: "Futuristic city skyline with neon reflections",
    defaultCaption: "Neon metropolis — Grok Imagine still",
  },
  {
    key: "gallery.2",
    label: "Gallery 3",
    page: "Gallery",
    kind: "image",
    defaultSrc: "/images/aic-3.jpg",
    defaultAlt: "Figure on neon bridge overlooking city lights",
    defaultCaption: "Bridge overlook — visualizer palette",
  },
  {
    key: "gallery.3",
    label: "Gallery 4",
    page: "Gallery",
    kind: "image",
    defaultSrc: "/images/site-2.jpg",
    defaultAlt: "Abstract purple crystal and energy forms",
    defaultCaption: "Crystal energy study",
  },
  {
    key: "gallery.4",
    label: "Gallery 5",
    page: "Gallery",
    kind: "image",
    defaultSrc: "/images/site-3.jpg",
    defaultAlt: "Abstract orange crystal landscape",
    defaultCaption: "Amber crystal field",
  },
  {
    key: "gallery.5",
    label: "Gallery 6",
    page: "Gallery",
    kind: "image",
    defaultSrc: "/images/site-4.jpg",
    defaultAlt: "Surreal fractal structure over mountain landscape",
    defaultCaption: "Fractal summit",
  },
  {
    key: "gallery.6",
    label: "Gallery 7 — product art",
    page: "Gallery",
    kind: "image",
    defaultSrc: "/images/aic-1.jpg",
    defaultAlt: "FAFO Local Media product art",
    defaultCaption: "Local Media — brand art",
  },
  {
    key: "gallery.7",
    label: "Gallery 8 — brand mark",
    page: "Gallery",
    kind: "image",
    defaultSrc: "/images/aic-0.jpg",
    defaultAlt: "FAFO Local Media logo mark",
    defaultCaption: "Local Media brand mark",
  },
  // Creative
  {
    key: "creative.banner",
    label: "Creative page banner",
    page: "Creative",
    kind: "image",
    defaultSrc: "/images/site-1.jpg",
    defaultAlt: "Creative workflow still",
    defaultCaption: "Music-video pipeline visual",
  },
  {
    key: "creative.video.0",
    label: "Creative showcase video 1",
    page: "Creative",
    kind: "video",
    defaultSrc: "",
    defaultPoster: "/images/aic-2.jpg",
    defaultCaption: "Paste a YouTube or direct MP4 URL",
    notes: "YouTube watch/embed URL or direct .mp4 link",
  },
  {
    key: "creative.video.1",
    label: "Creative showcase video 2",
    page: "Creative",
    kind: "video",
    defaultSrc: "",
    defaultPoster: "/images/site-0.jpg",
    defaultCaption: "Second showcase video",
  },
  {
    key: "creative.video.2",
    label: "Creative showcase video 3",
    page: "Creative",
    kind: "video",
    defaultSrc: "",
    defaultPoster: "/images/aic-3.jpg",
    defaultCaption: "Third showcase video",
  },
  // Contact / card
  {
    key: "contact.business_card",
    label: "Business card image",
    page: "Contact",
    kind: "image",
    defaultSrc: "/images/fafo-business-card.png",
    defaultAlt: "FAFO PETRO SERVICES L.L.C. business card",
  },
  // Services / toolbox accents
  {
    key: "services.accent",
    label: "Services accent image",
    page: "Services",
    kind: "image",
    defaultSrc: "/images/site-2.jpg",
    defaultAlt: "Field service visual",
  },
  {
    key: "toolbox.accent",
    label: "Toolbox accent image",
    page: "Toolbox",
    kind: "image",
    defaultSrc: "/images/aic-1.jpg",
    defaultAlt: "Toolbox product art",
  },
];

export function mediaSlotByKey(key: string): MediaSlotDef | undefined {
  return MEDIA_SLOTS.find((s) => s.key === key);
}

export function mediaSlotsByPage(page: string): MediaSlotDef[] {
  return MEDIA_SLOTS.filter((s) => s.page === page);
}
