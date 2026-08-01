export type ThemeId =
  | "amber-field"
  | "hi-vis"
  | "daylight"
  | "pipeline"
  | "sandstone";

export type ThemeMode = "dark" | "light";

export type ThemeDef = {
  id: ThemeId;
  name: string;
  tagline: string;
  mode: ThemeMode;
  /** Swatch colors for the picker UI */
  swatches: {
    bg: string;
    surface: string;
    primary: string;
    accent: string;
  };
};

export const THEMES: ThemeDef[] = [
  {
    id: "amber-field",
    name: "Amber Field",
    tagline: "Charcoal shop + fuel amber · embers & heat ghosts",
    mode: "dark",
    swatches: {
      bg: "#070809",
      surface: "#13161b",
      primary: "#e8a317",
      accent: "#3d8bfd",
    },
  },
  {
    id: "hi-vis",
    name: "Hi-Vis Ops",
    tagline: "Safety orange + cyan · sparks & flash trails",
    mode: "dark",
    swatches: {
      bg: "#0a0c10",
      surface: "#141820",
      primary: "#f97316",
      accent: "#38bdf8",
    },
  },
  {
    id: "daylight",
    name: "Daylight Pro",
    tagline: "Crisp paper light · soft motes & calm warp",
    mode: "light",
    swatches: {
      bg: "#f5f6f8",
      surface: "#ffffff",
      primary: "#1e3a5f",
      accent: "#0d9488",
    },
  },
  {
    id: "pipeline",
    name: "Steel Pipeline",
    tagline: "Near-black steel · chips & chromatic ghosts",
    mode: "dark",
    swatches: {
      bg: "#060708",
      surface: "#111418",
      primary: "#7eb8d4",
      accent: "#94a3b8",
    },
  },
  {
    id: "sandstone",
    name: "Sandstone",
    tagline: "NC paper + terracotta · dust storm drift",
    mode: "light",
    swatches: {
      bg: "#f7f2ea",
      surface: "#fffdf9",
      primary: "#b45309",
      accent: "#0f766e",
    },
  },
];

export const DEFAULT_THEME: ThemeId = "amber-field";
export const THEME_STORAGE_KEY = "fafo-theme";

export function isThemeId(value: string | null | undefined): value is ThemeId {
  return THEMES.some((t) => t.id === value);
}

export function getTheme(id: ThemeId): ThemeDef {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]!;
}
