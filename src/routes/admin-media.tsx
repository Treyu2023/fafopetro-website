import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ImageIcon,
  Lock,
  RefreshCw,
  Save,
  Trash2,
  Unlock,
  Video,
} from "lucide-react";
import { Section } from "@/components/Section";
import { site } from "@/data/site";
import { MEDIA_SLOTS } from "@/data/media-slots";
import {
  adminListMediaSlots,
  adminResetMediaSlot,
  adminSaveMediaSlot,
  type MediaSlotResolved,
} from "@/lib/media-slots";
import { bustMediaSlotCache } from "@/components/MediaSlot";

export const Route = createFileRoute("/admin-media")({
  component: AdminMediaPage,
  head: () => ({
    meta: [
      { title: `Media slots admin | ${site.brandName}` },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AdminMediaPage() {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [slots, setSlots] = useState<MediaSlotResolved[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("All");
  const [drafts, setDrafts] = useState<
    Record<string, Partial<MediaSlotResolved>>
  >({});
  const [msg, setMsg] = useState("");

  const pages = useMemo(
    () => ["All", ...Array.from(new Set(MEDIA_SLOTS.map((s) => s.page)))],
    [],
  );

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await adminListMediaSlots({ data: { code } });
      setSlots(res.slots);
      setUnlocked(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function reload() {
    setBusy(true);
    setError("");
    try {
      const res = await adminListMediaSlots({ data: { code } });
      setSlots(res.slots);
      bustMediaSlotCache();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  function draft(key: string): MediaSlotResolved {
    const base = slots.find((s) => s.key === key)!;
    return { ...base, ...drafts[key] };
  }

  function setField(
    key: string,
    field: keyof MediaSlotResolved,
    value: string,
  ) {
    setDrafts((d) => ({
      ...d,
      [key]: { ...d[key], [field]: value },
    }));
  }

  async function save(key: string) {
    setBusy(true);
    setMsg("");
    setError("");
    try {
      const d = draft(key);
      const saved = await adminSaveMediaSlot({
        data: {
          code,
          key,
          kind: d.kind,
          src: d.src,
          poster: d.poster,
          alt: d.alt,
          caption: d.caption,
        },
      });
      setSlots((prev) => prev.map((s) => (s.key === key ? saved : s)));
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      bustMediaSlotCache();
      setMsg(`Saved ${key} — live on the site.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function reset(key: string) {
    if (!confirm(`Reset ${key} to default image?`)) return;
    setBusy(true);
    try {
      await adminResetMediaSlot({ data: { code, key } });
      await reload();
      setMsg(`Reset ${key} to default.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setBusy(false);
    }
  }

  function onFile(key: string, file: File | null) {
    if (!file) return;
    if (file.size > 1_400_000) {
      setError(
        "File over about 1.4MB — host it elsewhere (Drive public link, CDN) and paste the URL instead.",
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      setField(key, "src", dataUrl);
      setMsg(`Loaded ${file.name} into draft for ${key} — click Save.`);
    };
    reader.readAsDataURL(file);
  }

  if (!unlocked) {
    return (
      <Section className="flex min-h-[60dvh] items-center py-16">
        <form
          onSubmit={unlock}
          className="mx-auto w-full max-w-md rounded-2xl border border-border bg-surface p-6"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border text-primary">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold text-fg">Media slots admin</h1>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            Update every website image and video slot in one place. Saves go live
            immediately (no redeploy).
          </p>
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Admin code"
            className="mt-4 h-11 w-full rounded-xl border border-border bg-bg px-3 text-sm text-fg"
            autoComplete="current-password"
          />
          {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-fg"
          >
            <Unlock className="h-4 w-4" />
            Unlock media library
          </button>
        </form>
      </Section>
    );
  }

  const visible = slots.filter((s) => {
    if (filter === "All") return true;
    const def = MEDIA_SLOTS.find((d) => d.key === s.key);
    return def?.page === filter;
  });

  return (
    <Section className="py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
            Admin
          </p>
          <h1 className="text-2xl font-semibold text-fg">Website media slots</h1>
          <p className="mt-1 max-w-xl text-sm text-muted">
            {slots.length} slots · paste a public URL or upload a small image
            (under 1.4MB). Videos: YouTube link or direct .mp4. Changes apply
            live.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void reload()}
            disabled={busy}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-3 text-sm text-muted"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => {
              setUnlocked(false);
              setCode("");
            }}
            className="h-10 rounded-xl border border-border px-3 text-sm text-muted"
          >
            Lock
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setFilter(p)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
              filter === p
                ? "bg-primary text-primary-fg"
                : "border border-border text-muted"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {msg ? <p className="mb-3 text-sm text-success">{msg}</p> : null}
      {error ? <p className="mb-3 text-sm text-danger">{error}</p> : null}

      <div className="space-y-4">
        {visible.map((s) => {
          const d = draft(s.key);
          const def = MEDIA_SLOTS.find((x) => x.key === s.key);
          const dirty = Boolean(drafts[s.key]);
          return (
            <article
              key={s.key}
              className="grid gap-4 rounded-2xl border border-border bg-surface p-4 lg:grid-cols-[160px_1fr]"
            >
              <div className="overflow-hidden rounded-xl border border-border bg-bg-elevated">
                {d.kind === "video" && d.src ? (
                  <div className="flex aspect-square items-center justify-center text-primary">
                    <Video className="h-8 w-8" />
                  </div>
                ) : d.src ? (
                  <img
                    src={d.src}
                    alt={d.alt}
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center text-subtle">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}
              </div>

              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-fg">
                    {def?.label || s.key}
                  </h2>
                  <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-subtle">
                    {s.key}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted">
                    {def?.page} · {d.kind}
                  </span>
                  {s.isOverride ? (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      Custom
                    </span>
                  ) : (
                    <span className="text-[10px] text-subtle">Default</span>
                  )}
                  {dirty ? (
                    <span className="text-[10px] font-semibold text-amber-400">
                      Unsaved
                    </span>
                  ) : null}
                </div>
                {def?.notes ? (
                  <p className="text-xs text-subtle">{def.notes}</p>
                ) : null}

                <label className="block text-xs text-muted">
                  Source URL or data
                  <input
                    value={d.src}
                    onChange={(e) => setField(s.key, "src", e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border border-border bg-bg px-3 font-mono text-xs text-fg"
                    placeholder={
                      d.kind === "video"
                        ? "https://youtube.com/watch?v=… or .mp4 URL"
                        : "https://… or leave default"
                    }
                  />
                </label>

                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="block text-xs text-muted">
                    Alt text
                    <input
                      value={d.alt}
                      onChange={(e) => setField(s.key, "alt", e.target.value)}
                      className="mt-1 h-9 w-full rounded-lg border border-border bg-bg px-3 text-xs text-fg"
                    />
                  </label>
                  <label className="block text-xs text-muted">
                    Caption
                    <input
                      value={d.caption}
                      onChange={(e) =>
                        setField(s.key, "caption", e.target.value)
                      }
                      className="mt-1 h-9 w-full rounded-lg border border-border bg-bg px-3 text-xs text-fg"
                    />
                  </label>
                </div>

                {d.kind === "video" ? (
                  <label className="block text-xs text-muted">
                    Poster image URL
                    <input
                      value={d.poster}
                      onChange={(e) =>
                        setField(s.key, "poster", e.target.value)
                      }
                      className="mt-1 h-9 w-full rounded-lg border border-border bg-bg px-3 text-xs text-fg"
                    />
                  </label>
                ) : null}

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {d.kind === "image" ? (
                    <label className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-border px-3 text-xs text-muted hover:text-fg">
                      Upload image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          onFile(s.key, e.target.files?.[0] ?? null)
                        }
                      />
                    </label>
                  ) : null}
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void save(s.key)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-fg disabled:opacity-50"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save live
                  </button>
                  {s.isOverride || dirty ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void reset(s.key)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs text-muted"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Reset default
                    </button>
                  ) : null}
                  {s.updated_at ? (
                    <span className="text-[10px] text-subtle">
                      Updated {s.updated_at.slice(0, 19)}
                    </span>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-8 max-w-2xl text-xs leading-relaxed text-subtle">
        Tip: for big photos or videos, upload to Google Drive (anyone-with-link)
        or a CDN, then paste the URL here. Small stills can be uploaded
        directly. Tell Grok anytime if you want help polishing captions or
        adding new slots.
      </p>
    </Section>
  );
}
