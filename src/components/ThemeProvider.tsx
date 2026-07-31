import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  THEMES,
  getTheme,
  isThemeId,
  type ThemeDef,
  type ThemeId,
} from "@/lib/themes";

type ThemeContextValue = {
  themeId: ThemeId;
  theme: ThemeDef;
  themes: ThemeDef[];
  setTheme: (id: ThemeId) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): ThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeId(raw)) return raw;
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME;
}

function applyThemeToDocument(id: ThemeId) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", id);
  root.style.colorScheme = getTheme(id).mode;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(DEFAULT_THEME);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStoredTheme();
    setThemeId(stored);
    applyThemeToDocument(stored);
    setReady(true);
  }, []);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeId(id);
    applyThemeToDocument(id);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({
      themeId,
      theme: getTheme(themeId),
      themes: THEMES,
      setTheme,
    }),
    [themeId, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {/* Suppress flash: keep children; theme applied on html via data-theme */}
      <div data-theme-ready={ready ? "1" : "0"} className="contents">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
