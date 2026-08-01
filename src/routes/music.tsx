import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Archive,
  Download,
  ExternalLink,
  Music2,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
  Youtube,
} from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { Section, SectionHeading } from "@/components/Section";
import { Badge } from "@/components/ui/badge";
import { site } from "@/data/site";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";
import {
  MUSIC_STAGE_LABEL,
  MUSIC_STAGES,
  MUSIC_TEMPLATES,
  appendLog,
  createBlankProject,
  createFromTemplate,
  exportProjectsJson,
  importProjectsJson,
  loadMusicProjects,
  saveMusicProjects,
  type MusicProject,
  type MusicStage,
} from "@/lib/music-projects";

export const Route = createFileRoute("/music")({
  component: MusicPage,
  head: () => ({
    meta: [
      { title: `Music Desk | ${site.brandName}` },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function MusicPage() {
  return (
    <RequireAuth>
      <MusicDesk />
    </RequireAuth>
  );
}

function MusicDesk() {
  const user = useCurrentUser();
  const userId = user?.id || "anon";
  const [projects, setProjects] = useState<MusicProject[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState<MusicStage | "all">("all");
  const [logDraft, setLogDraft] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const list = loadMusicProjects(userId);
    setProjects(list);
    setActiveId(list[0]?.id ?? null);
    setReady(true);
  }, [userId]);

  useEffect(() => {
    if (!ready) return;
    saveMusicProjects(userId, projects);
  }, [projects, userId, ready]);

  const active = useMemo(
    () => projects.find((p) => p.id === activeId) ?? null,
    [projects, activeId],
  );

  const visible = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((p) => p.stage === filter);
  }, [projects, filter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length };
    for (const s of MUSIC_STAGES) c[s] = 0;
    for (const p of projects) c[p.stage] = (c[p.stage] || 0) + 1;
    return c;
  }, [projects]);

  function upsert(next: MusicProject) {
    setProjects((prev) => {
      const i = prev.findIndex((p) => p.id === next.id);
      if (i === -1) return [next, ...prev];
      const copy = [...prev];
      copy[i] = { ...next, updatedAt: new Date().toISOString() };
      return copy.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    });
    setActiveId(next.id);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1200);
  }

  function patchActive(patch: Partial<MusicProject>) {
    if (!active) return;
    upsert({ ...active, ...patch, updatedAt: new Date().toISOString() });
  }

  function newProject() {
    const p = createBlankProject({ title: "Untitled track" });
    upsert(p);
  }

  function fromTemplate(id: string) {
    const t = MUSIC_TEMPLATES.find((x) => x.id === id);
    if (!t) return;
    upsert(createFromTemplate(t));
  }

  function removeProject(id: string) {
    if (!window.confirm("Delete this project from your Music Desk?")) return;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setActiveId((cur) => (cur === id ? null : cur));
  }

  function addLog() {
    if (!active || !logDraft.trim()) return;
    upsert(appendLog(active, logDraft));
    setLogDraft("");
  }

  function downloadBackup() {
    const blob = new Blob([exportProjectsJson(projects)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fafo-music-desk-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function onImportFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const incoming = importProjectsJson(String(reader.result || ""));
        setProjects((prev) => {
          const map = new Map(prev.map((p) => [p.id, p]));
          for (const p of incoming) map.set(p.id, p);
          return [...map.values()].sort((a, b) =>
            b.updatedAt.localeCompare(a.updatedAt),
          );
        });
        setActiveId(incoming[0]?.id ?? null);
      } catch (e) {
        window.alert(e instanceof Error ? e.message : "Import failed");
      }
    };
    reader.readAsText(file);
  }

  return (
    <>
      <Section className="pb-6 pt-14">
        <Badge className="mb-4 gap-1.5">
          <Music2 className="h-3.5 w-3.5" />
          Music Desk · signed in
        </Badge>
        <SectionHeading
          title="Your music-to-picture desk."
          description={`Signed in as ${user?.displayName || user?.primaryEmail || "member"}. Projects stay on this device (local), keyed to your account — no extra setup. Follow Track → Inference → Edit → 4K → Release.`}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={newProject}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-fg"
          >
            <Plus className="h-4 w-4" />
            New project
          </button>
          <button
            type="button"
            onClick={downloadBackup}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-medium text-fg"
          >
            <Download className="h-4 w-4 text-primary" />
            Backup JSON
          </button>
          <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-medium text-fg">
            <Upload className="h-4 w-4 text-primary" />
            Import
            <input
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onImportFile(f);
                e.target.value = "";
              }}
            />
          </label>
          <a
            href={site.youtube}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-medium text-fg"
          >
            <Youtube className="h-4 w-4 text-primary" />
            YouTube
          </a>
          <Link
            to="/creative"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-medium text-muted hover:text-fg"
          >
            Workflow guide
          </Link>
          {savedFlash ? (
            <span className="inline-flex h-10 items-center gap-1.5 text-sm text-success">
              <Save className="h-4 w-4" />
              Saved
            </span>
          ) : null}
        </div>
      </Section>

      <Section className="pt-0">
        <div className="mb-4 flex flex-wrap gap-2">
          <FilterChip
            label={`All (${counts.all || 0})`}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          {MUSIC_STAGES.map((s) => (
            <FilterChip
              key={s}
              label={`${MUSIC_STAGE_LABEL[s].replace(/^\d · /, "")} (${counts[s] || 0})`}
              active={filter === s}
              onClick={() => setFilter(s)}
            />
          ))}
        </div>

        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">
            Quick start templates
          </p>
          <div className="flex flex-wrap gap-2">
            {MUSIC_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => fromTemplate(t.id)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 text-xs font-medium text-muted transition hover:border-border-strong hover:text-fg"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                {t.title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-2">
            {visible.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-8 text-center text-sm text-muted">
                No projects yet. Hit <strong className="text-fg">New project</strong>{" "}
                or pick a template.
              </div>
            ) : (
              visible.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActiveId(p.id)}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-left transition",
                    activeId === p.id
                      ? "border-primary/50 bg-primary/10 primary-glow"
                      : "border-border bg-surface hover:border-border-strong",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-fg">{p.title}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {MUSIC_STAGE_LABEL[p.stage]}
                        {p.bpm ? ` · ${p.bpm} BPM` : ""}
                        {p.genre ? ` · ${p.genre}` : ""}
                      </p>
                    </div>
                    {p.stage === "archived" ? (
                      <Archive className="h-4 w-4 shrink-0 text-subtle" />
                    ) : null}
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="panel shine-border rounded-2xl p-5 sm:p-6">
            {!active ? (
              <p className="text-sm text-muted">
                Select a project or create one to edit stages, BPM, notes, and
                session log.
              </p>
            ) : (
              <div className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-subtle">
                      Title
                    </label>
                    <input
                      value={active.title}
                      onChange={(e) => patchActive({ title: e.target.value })}
                      className="mt-1 h-11 w-full rounded-xl border border-border bg-bg px-3 text-lg font-semibold text-fg outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeProject(active.id)}
                    className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-danger/30 px-3 text-sm text-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">
                    Pipeline stage
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {MUSIC_STAGES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          patchActive({ stage: s });
                          upsert(
                            appendLog(
                              { ...active, stage: s },
                              `Moved to ${MUSIC_STAGE_LABEL[s]}`,
                            ),
                          );
                        }}
                        className={cn(
                          "rounded-lg px-2.5 py-1.5 text-xs font-medium transition",
                          active.stage === s
                            ? "bg-primary text-primary-fg"
                            : "bg-surface-2 text-muted hover:text-fg",
                        )}
                      >
                        {MUSIC_STAGE_LABEL[s]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <Field
                    label="BPM"
                    value={active.bpm == null ? "" : String(active.bpm)}
                    onChange={(v) =>
                      patchActive({
                        bpm: v.trim() === "" ? null : Number(v) || null,
                      })
                    }
                    type="number"
                    placeholder="90"
                  />
                  <Field
                    label="Genre"
                    value={active.genre}
                    onChange={(v) => patchActive({ genre: v })}
                    placeholder="Synthwave"
                  />
                  <Field
                    label="Mood"
                    value={active.mood}
                    onChange={(v) => patchActive({ mood: v })}
                    placeholder="Neon · night drive"
                  />
                </div>

                <div className="grid gap-3">
                  <Field
                    label="YouTube / release URL"
                    value={active.youtubeUrl}
                    onChange={(v) => patchActive({ youtubeUrl: v })}
                    placeholder="https://youtube.com/..."
                  />
                  <Field
                    label="Audio / master link"
                    value={active.audioUrl}
                    onChange={(v) => patchActive({ audioUrl: v })}
                    placeholder="Drive, Dropbox, local path note…"
                  />
                  <Field
                    label="Drive / asset folder"
                    value={active.driveUrl}
                    onChange={(v) => patchActive({ driveUrl: v })}
                    placeholder="https://drive.google.com/..."
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {active.youtubeUrl ? (
                    <a
                      href={active.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs text-fg"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open YouTube
                    </a>
                  ) : null}
                  {active.driveUrl ? (
                    <a
                      href={active.driveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs text-fg"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open Drive
                    </a>
                  ) : null}
                  <a
                    href={site.downloadProgen}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs text-muted hover:text-fg"
                  >
                    Download Progen
                  </a>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-subtle">
                    Project notes
                  </label>
                  <textarea
                    value={active.notes}
                    onChange={(e) => patchActive({ notes: e.target.value })}
                    rows={5}
                    className="mt-1 w-full rounded-xl border border-border bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                    placeholder="Structure, hooks, shot bank ideas, export checklist…"
                  />
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">
                    Session log
                  </p>
                  <div className="flex gap-2">
                    <input
                      value={logDraft}
                      onChange={(e) => setLogDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addLog();
                        }
                      }}
                      placeholder="What did you finish this session?"
                      className="h-10 flex-1 rounded-xl border border-border bg-bg px-3 text-sm text-fg outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={addLog}
                      className="h-10 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-fg"
                    >
                      Log
                    </button>
                  </div>
                  <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto">
                    {active.log.length === 0 ? (
                      <li className="text-xs text-subtle">No entries yet.</li>
                    ) : (
                      active.log.map((entry) => (
                        <li
                          key={entry.id}
                          className="rounded-lg border border-border/70 bg-surface-2/60 px-3 py-2 text-xs text-muted"
                        >
                          <span className="font-mono text-[10px] text-subtle">
                            {new Date(entry.at).toLocaleString()}
                          </span>
                          <p className="mt-0.5 text-fg">{entry.text}</p>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                <p className="text-[11px] text-subtle">
                  Updated {new Date(active.updatedAt).toLocaleString()} · stored
                  locally for this account on this browser
                </p>
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition",
        active
          ? "border-primary/40 bg-primary/15 text-fg"
          : "border-border bg-surface text-muted hover:text-fg",
      )}
    >
      {label}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-subtle">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-border bg-bg px-3 text-sm text-fg outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}
