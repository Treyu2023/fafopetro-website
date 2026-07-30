export const site = {
  name: "FAFO PETRO SERVICES L.L.C.",
  legalName: "FAFO PETRO SERVICES L.L.C.",
  shortName: "FAFO Petro",
  brandName: "FAFO Petro Services",
  tagline: "Field service. Custom tools. Creative systems.",
  founded: "May 8, 2025",
  founder: "Ryan W. Key",
  experience: "26 years field experience",
  email: "Rkey@FAFOPETRO.com",
  phone: "(972) 877-1848",
  phoneRaw: "9728771848",
  location: "Siler City, NC — serving the Triad & surrounding areas",
  address: "1787 W 3rd St, Siler City, NC 27344",
  website: "https://www.fafopetro.com",
  youtube: "https://youtube.com/@rwkey",
  youtubePlaylist:
    "https://youtube.com/playlist?list=PLRXJjFjIfW-kiC809xPcM3X6ZRohe_Rh3",
  /** Chrome Web Store — published Local Media listing */
  chromeLocalMedia:
    "https://chromewebstore.google.com/detail/phdfnpaigllbkdjfflapdmcapkapolpe",
  /** GitHub is the primary download hub (versioned source + Releases). */
  githubOrg: "https://github.com/Treyu2023",
  githubExtensions:
    "https://github.com/Treyu2023/fafo-chrome-extensions",
  githubUltimateTab:
    "https://github.com/Treyu2023/fafo-chrome-extensions/tree/main/FAFO%20Local%20Media%20LOAD%20THIS",
  githubLocalMedia:
    "https://github.com/Treyu2023/fafo-chrome-extensions/tree/main/FAFO%20Local%20Media%20LOAD%20THIS",
  githubProgen:
    "https://github.com/Treyu2023/fafo-chrome-extensions/tree/main/ProGen",
  githubToolbox: "https://github.com/Treyu2023/FAFO-Power-Toolbox",
  /** GitHub Releases (zip installs) */
  releaseExtensions:
    "https://github.com/Treyu2023/fafo-chrome-extensions/releases/tag/v7.3.1",
  releaseUltimateTabZip:
    "https://github.com/Treyu2023/fafo-chrome-extensions/releases/download/v7.3.1/FAFO-Local-Media-7.3.1.zip",
  releaseLocalMediaZip:
    "https://github.com/Treyu2023/fafo-chrome-extensions/releases/download/v7.3.1/FAFO-Local-Media-7.3.1.zip",
  releaseProgenZip:
    "https://github.com/Treyu2023/fafo-chrome-extensions/releases/tag/v7.3.1",
  releaseToolbox:
    "https://github.com/Treyu2023/FAFO-Power-Toolbox/releases/tag/v1.0.0-tagfix",
  releaseToolboxZip:
    "https://github.com/Treyu2023/FAFO-Power-Toolbox/releases/download/v1.0.0-tagfix/FAFO-Power-Toolbox.zip",
  /** On-site zip mirrors (same packages as Releases) */
  downloadLocalMedia: "/downloads/FAFO-Local-Media-7.3.1.zip",
  downloadUltimateTab: "/downloads/FAFO-Local-Media-7.3.1.zip",
  downloadProgen: "/downloads/FAFO-Progen.zip",
  downloadToolbox: "/downloads/FAFO-Power-Toolbox.zip",
  /** Drive fallbacks */
  driveSampleMedia:
    "https://drive.google.com/open?id=1_srvtfS2_7cwmIn3jXdRIDOLOgB43B-c&usp=drive_fs",
  driveInstaller:
    "https://drive.google.com/open?id=1zKrRD7nQCT1fkTaEgySPIwxow3vYkugH&usp=drive_fs",

  /**
   * Public social / presence links.
   * Empty string = not shown. No X/Twitter by design.
   * Paste full profile URLs when ready (Facebook, Instagram, LinkedIn, etc.).
   */
  social: {
    youtube: "https://youtube.com/@rwkey",
    github: "https://github.com/Treyu2023",
    facebook: "",
    instagram: "",
    linkedin: "",
    /** e.g. Invideo, portfolio, or other creator hub — paste full URL when ready */
    ivitai: "",
  } as {
    youtube: string;
    github: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    ivitai: string;
  },
};

/** Only links with a real URL — used by footer / contact. No X/Twitter. */
export const publicSocials = () =>
  (
    [
      { id: "youtube", label: "YouTube", href: site.social.youtube },
      { id: "github", label: "GitHub", href: site.social.github },
      { id: "facebook", label: "Facebook", href: site.social.facebook },
      { id: "instagram", label: "Instagram", href: site.social.instagram },
      { id: "linkedin", label: "LinkedIn", href: site.social.linkedin },
      { id: "ivitai", label: "Ivitai", href: site.social.ivitai },
    ] as const
  ).filter((s) => Boolean(s.href && s.href.trim()));

export const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/quote", label: "Get a quote" },
  { to: "/sites", label: "Sites" },
  { to: "/toolbox", label: "Toolbox" },
  { to: "/creative", label: "Creative" },
  { to: "/gallery", label: "Gallery" },
  { to: "/field-tools", label: "Field Tools" },
  { to: "/fun", label: "Fun Zone" },
  { to: "/contact", label: "Contact" },
] as const;

export const services = [
  {
    title: "Dispenser & POS Service",
    body: "Gilbarco, Wayne, and Verifone dispenser work, EMV/card reader service, and C-store POS support — diagnostics through repair.",
  },
  {
    title: "ATG / Tank Monitoring",
    body: "Veeder-Root TLS-450 configuration, phase separation floats, compliance-minded setup, and ongoing monitor support.",
  },
  {
    title: "Concrete & Site Repairs",
    body: "Gas station concrete repairs including manhole replacements with rebar and 4000 PSI pours, scoped with buffers and clear pricing.",
  },
  {
    title: "Parts & Equipment Resale",
    body: "Sourcing and resale of field-proven equipment such as Gilbarco/Verifone EMV card readers for operators who need gear that works.",
  },
];

export const toolboxFeatures = [
  {
    id: "progen",
    name: "FAFO Progen Reimagined",
    tag: "Chrome Extension / PWA",
    summary:
      "Creator control surface for Grok Imagine video workflows — block+string generation, entropy tracking, session history, visual canvases, and Google Drive sync so your pipeline survives device hops.",
    points: [
      "Block + string prompt composition built for long creative sessions",
      "Entropy / variation tracking so generations stay interesting",
      "Session history and visual canvases for review",
      "Google Drive sync so the pipeline survives device hops",
    ],
    links: [
      {
        label: "Download Progen zip",
        href: site.downloadProgen,
        primary: true,
      },
      { label: "Source on GitHub", href: site.githubProgen },
    ],
  },
  {
    id: "local-media",
    name: "FAFO Local Media",
    tag: "Chrome new-tab / library",
    summary:
      "Local-first media library: folders, tags, pairs, before/after, search, and browser-native speed without shipping your vault to someone else’s cloud.",
    points: [
      "Watch folders, tags, search across large local libraries",
      "Before/after pairs and review queue for upscale workflows",
      "100-char tag cap and cleaner AI-comment scrubbing",
      "Chrome Web Store listing plus full local zip for advanced tools",
    ],
    links: [
      {
        label: "Download Local Media zip",
        href: site.downloadLocalMedia,
        primary: true,
      },
      { label: "Chrome Web Store", href: site.chromeLocalMedia },
      { label: "GitHub Releases", href: site.releaseExtensions },
    ],
  },
  {
    id: "power-toolbox",
    name: "FAFO Power Toolbox",
    tag: "Local desktop toolbox",
    summary:
      "Work hub for field techs: Verifone tools, site/customer DB hooks, brand sections, gated manuals — whole toolbox login-gated for approved accounts.",
    points: [
      "Work section: Verifone, Sites, Gilbarco, Veeder-Root, Wayne, Manuals",
      "Full toolbox login — website account with approved toolbox access",
      "OEM manuals restricted to authorized techs only",
      "Local Python server for file ops, media, and field tools",
    ],
    links: [
      {
        label: "Download Power Toolbox zip",
        href: site.downloadToolbox,
        primary: true,
      },
      { label: "GitHub repo", href: site.githubToolbox },
    ],
  },
];

export const creativePipeline = [
  {
    step: "01",
    title: "Track",
    body: "Write and lock the music — structure, hooks, master mix the picture will cut to.",
  },
  {
    step: "02",
    title: "Inference",
    body: "Generate stills and short clips timed to the track so the edit has real choices.",
  },
  {
    step: "03",
    title: "Edit",
    body: "Assemble the cut: hard cuts, grade, captions, platform crops, audio lock.",
  },
  {
    step: "04",
    title: "4K upscale",
    body: "Upscale and interpolate the master so social compression still looks dense.",
  },
  {
    step: "05",
    title: "Release",
    body: "Export for each platform, publish, archive masters, feed what worked into the next project.",
  },
];

export const fieldTools = [
  {
    name: "Work hub (Power Toolbox)",
    status: "Local desktop",
    body: "Field work section: Verifone tools, sites & customer database, Gilbarco, Veeder-Root, Wayne, and a gated manuals vault. OEM PDFs stay off the public web.",
  },
  {
    name: "Commander / Verifone (info only)",
    status: "In development",
    body: "Site console, status HUD, and punch lists for local VAPS workflows. FAFO Petro is not a Verifone ASC.",
  },
  {
    name: "Sites & customer database",
    status: "Live",
    body: "Shared multi-tech registry near Siler City: search first, soft duplicate handling, progressive surveys.",
  },
  {
    name: "Gilbarco · Wayne · Veeder-Root",
    status: "Restricted (toolbox)",
    body: "Brand sections and manuals unlock only for authorized techs in the Power Toolbox.",
  },
];

export const galleryItems = [
  {
    src: "/images/site-0.jpg",
    alt: "Industrial cyberpunk night scene — neon rail yard",
    caption: "Night rail — industrial synthwave frame",
  },
  {
    src: "/images/aic-2.jpg",
    alt: "Futuristic city skyline with neon reflections",
    caption: "Neon metropolis — Grok Imagine still",
  },
  {
    src: "/images/aic-3.jpg",
    alt: "Figure on neon bridge overlooking city lights",
    caption: "Bridge overlook — visualizer palette",
  },
  {
    src: "/images/site-2.jpg",
    alt: "Abstract purple crystal and energy forms",
    caption: "Crystal energy study",
  },
  {
    src: "/images/site-3.jpg",
    alt: "Abstract orange crystal landscape",
    caption: "Amber crystal field",
  },
  {
    src: "/images/site-4.jpg",
    alt: "Surreal fractal structure over mountain landscape",
    caption: "Fractal summit",
  },
  {
    src: "/images/aic-1.jpg",
    alt: "FAFO Local Media product art — Unleash the NutKracken",
    caption: "Local Media — brand art",
  },
  {
    src: "/images/aic-0.jpg",
    alt: "FAFO Local Media logo mark",
    caption: "Local Media brand mark",
  },
];

export const aicStory = {
  title: "Artificial Intelligence Corner",
  lead: "AI is remarkable when it amplifies skilled people — not when it surveils the crew that keeps sites running.",
  paragraphs: [
    "The advancements in AI are truly remarkable, and its potential to revolutionize industries is undeniable. Applied thoughtfully, it is a powerful tool for productivity, craft, and creative systems — which is exactly how FAFO Petro uses it: Progen, Local Media, Architect, music/video workflows, and field tooling.",
    "It’s with a sense of irony that the founder left a prior role where AI was framed less as a collaborator for field technicians and more as constant monitoring of the people who already carry on-call schedules, long hours, and road miles. Administrative teams on standard office hours felt disconnected from that reality.",
    "FAFO’s stance is simple: AI should serve the operator and the creator — local-first where it matters, transparent about limits, and never a substitute for judgment in the field.",
  ],
};

export const games = [
  {
    id: "snake",
    name: "Snake",
    blurb: "Classic grid snake — eat, grow, don’t hit the walls or yourself.",
  },
  {
    id: "brick",
    name: "Brick Breaker",
    blurb: "Paddle, ball, and a wall of bricks. Clear the board.",
  },
  {
    id: "pac",
    name: "Maze Runner",
    blurb: "Pac-inspired maze chase — grab dots, avoid hunters.",
  },
  {
    id: "tower",
    name: "Tower Defense",
    blurb: "Place towers, stop waves. Simple lane TD with upgrades.",
  },
  {
    id: "survivor",
    name: "Night Swarm",
    blurb: "Vampire-survivors style arena — move, auto-fire, survive.",
  },
];
