/** Local-first music / MV project desk. Keyed by user id — no extra backend required. */

export const MUSIC_STAGES = [
  "track",
  "inference",
  "edit",
  "upscale",
  "release",
  "archived",
] as const;

export type MusicStage = (typeof MUSIC_STAGES)[number];

export const MUSIC_STAGE_LABEL: Record<MusicStage, string> = {
  track: "1 · Track",
  inference: "2 · Inference",
  edit: "3 · Edit",
  upscale: "4 · 4K upscale",
  release: "5 · Release",
  archived: "Archived",
};

export type MusicLogEntry = {
  id: string;
  at: string;
  text: string;
};

export type MusicProject = {
  id: string;
  title: string;
  stage: MusicStage;
  bpm: number | null;
  genre: string;
  mood: string;
  notes: string;
  youtubeUrl: string;
  audioUrl: string;
  driveUrl: string;
  log: MusicLogEntry[];
  createdAt: string;
  updatedAt: string;
};

export type MusicTemplate = {
  id: string;
  title: string;
  bpm: number;
  genre: string;
  mood: string;
  notes: string;
};

export const MUSIC_TEMPLATES: MusicTemplate[] = [
  {
    id: "synthwave-viz",
    title: "Synthwave visualizer",
    bpm: 90,
    genre: "Synthwave",
    mood: "Neon · night drive",
    notes:
      "Lock a 90 BPM master. Generate stills + short clips timed to downbeats. Hard cuts, amber/cyan grade, 4K upscale before Shorts export.",
  },
  {
    id: "chillstep",
    title: "Chillstep drop",
    bpm: 140,
    genre: "Chillstep / bass",
    mood: "Atmospheric · heavy drop",
    notes:
      "Build → drop structure. Inference around the drop moment. Soft grade pre-drop, high contrast on impact frames.",
  },
  {
    id: "dark-pop",
    title: "Dark pop anthem",
    bpm: 100,
    genre: "Dark pop",
    mood: "Moody · vocal-led",
    notes:
      "Vocal-forward mix first. Picture follows lyric beats. Captions for social cuts. Archive 4K master after release.",
  },
  {
    id: "trip-hop",
    title: "Trip-hop / ambient",
    bpm: 75,
    genre: "Trip-hop",
    mood: "Slow · cinematic",
    notes:
      "Slow pulse. Longer holds, less hard-cut density. Interpolation matters — soft motion, 4K canvas.",
  },
  {
    id: "political",
    title: "Political / message cut",
    bpm: 95,
    genre: "Anthem",
    mood: "Urgent · declarative",
    notes:
      "Message clarity first. Strong caption hierarchy. Platform crops planned before final grade.",
  },
];

const STORAGE_PREFIX = "fafo-music-projects-v1:";

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId || "anon"}`;
}

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function loadMusicProjects(userId: string): MusicProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MusicProject[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((p) => p && typeof p.id === "string" && typeof p.title === "string")
      .map(normalizeProject)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch {
    return [];
  }
}

function normalizeProject(p: MusicProject): MusicProject {
  return {
    id: p.id,
    title: p.title || "Untitled",
    stage: MUSIC_STAGES.includes(p.stage) ? p.stage : "track",
    bpm: typeof p.bpm === "number" && Number.isFinite(p.bpm) ? p.bpm : null,
    genre: p.genre || "",
    mood: p.mood || "",
    notes: p.notes || "",
    youtubeUrl: p.youtubeUrl || "",
    audioUrl: p.audioUrl || "",
    driveUrl: p.driveUrl || "",
    log: Array.isArray(p.log) ? p.log : [],
    createdAt: p.createdAt || new Date().toISOString(),
    updatedAt: p.updatedAt || p.createdAt || new Date().toISOString(),
  };
}

export function saveMusicProjects(userId: string, projects: MusicProject[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(userId), JSON.stringify(projects));
  } catch {
    /* quota / private mode */
  }
}

export function createBlankProject(partial?: Partial<MusicProject>): MusicProject {
  const now = new Date().toISOString();
  return {
    id: uid("mv"),
    title: partial?.title || "New project",
    stage: partial?.stage || "track",
    bpm: partial?.bpm ?? null,
    genre: partial?.genre || "",
    mood: partial?.mood || "",
    notes: partial?.notes || "",
    youtubeUrl: partial?.youtubeUrl || "",
    audioUrl: partial?.audioUrl || "",
    driveUrl: partial?.driveUrl || "",
    log: partial?.log || [],
    createdAt: now,
    updatedAt: now,
  };
}

export function createFromTemplate(t: MusicTemplate): MusicProject {
  return createBlankProject({
    title: t.title,
    bpm: t.bpm,
    genre: t.genre,
    mood: t.mood,
    notes: t.notes,
    stage: "track",
    log: [
      {
        id: uid("log"),
        at: new Date().toISOString(),
        text: `Started from template: ${t.title}`,
      },
    ],
  });
}

export function appendLog(project: MusicProject, text: string): MusicProject {
  const entry: MusicLogEntry = {
    id: uid("log"),
    at: new Date().toISOString(),
    text: text.trim(),
  };
  if (!entry.text) return project;
  return {
    ...project,
    log: [entry, ...project.log].slice(0, 80),
    updatedAt: new Date().toISOString(),
  };
}

export function exportProjectsJson(projects: MusicProject[]): string {
  return JSON.stringify(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      projects,
    },
    null,
    2,
  );
}

export function importProjectsJson(raw: string): MusicProject[] {
  const data = JSON.parse(raw) as { projects?: MusicProject[] } | MusicProject[];
  const list = Array.isArray(data) ? data : data.projects;
  if (!Array.isArray(list)) throw new Error("Invalid music project backup");
  return list.map(normalizeProject);
}
