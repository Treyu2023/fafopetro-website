/**
 * Client-safe media slot RPC + helpers.
 * Defaults come from @/data/media-slots; overrides from DB (live).
 */
import { createServerFn } from "@tanstack/react-start";
import { MEDIA_SLOTS, type MediaSlotDef } from "@/data/media-slots";
import type { MediaSlotResolved } from "@/lib/media-slots-types";

export type { MediaSlotResolved };
export type { MediaSlotDef };

export const getPublicMediaSlots = createServerFn({ method: "GET" }).handler(
  async (): Promise<MediaSlotResolved[]> => {
    const { resolveAllSlots } = await import("@/lib/media-slots-core.server");
    return resolveAllSlots();
  },
);

export const adminListMediaSlots = createServerFn({ method: "POST" })
  .validator((data: unknown) => ({
    code: String((data as { code?: string })?.code || ""),
  }))
  .handler(async ({ data }): Promise<{ slots: MediaSlotResolved[]; catalog: MediaSlotDef[] }> => {
    const { MEDIA_ADMIN_CODE, resolveAllSlots } = await import(
      "@/lib/media-slots-core.server"
    );
    if (data.code.trim().toUpperCase() !== MEDIA_ADMIN_CODE()) {
      throw new Error("Invalid access code");
    }
    const slots = await resolveAllSlots();
    return { slots, catalog: MEDIA_SLOTS };
  });

export const adminSaveMediaSlot = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = data as {
      code?: string;
      key?: string;
      kind?: string;
      src?: string;
      poster?: string;
      alt?: string;
      caption?: string;
      notes?: string;
    };
    return {
      code: String(d?.code || ""),
      key: String(d?.key || ""),
      kind: d?.kind ? String(d.kind) : undefined,
      src: d?.src != null ? String(d.src) : null,
      poster: d?.poster != null ? String(d.poster) : null,
      alt: d?.alt != null ? String(d.alt) : null,
      caption: d?.caption != null ? String(d.caption) : null,
      notes: d?.notes != null ? String(d.notes) : null,
    };
  })
  .handler(async ({ data }): Promise<MediaSlotResolved> => {
    const { MEDIA_ADMIN_CODE, upsertSlot } = await import(
      "@/lib/media-slots-core.server"
    );
    if (data.code.trim().toUpperCase() !== MEDIA_ADMIN_CODE()) {
      throw new Error("Invalid access code");
    }
    if (!data.key) throw new Error("key required");
    // Cap data-URL uploads (~1.8MB base64 ≈ reasonable for hero stills)
    if (data.src && data.src.startsWith("data:") && data.src.length > 2_500_000) {
      throw new Error(
        "Upload too large for live DB storage (~1.5MB max). Use a public URL (Drive, CDN, GitHub raw) instead.",
      );
    }
    return upsertSlot({
      key: data.key,
      kind: data.kind,
      src: data.src,
      poster: data.poster,
      alt: data.alt,
      caption: data.caption,
      notes: data.notes,
    });
  });

export const adminResetMediaSlot = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = data as { code?: string; key?: string };
    return {
      code: String(d?.code || ""),
      key: String(d?.key || ""),
    };
  })
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { MEDIA_ADMIN_CODE, resetSlot } = await import(
      "@/lib/media-slots-core.server"
    );
    if (data.code.trim().toUpperCase() !== MEDIA_ADMIN_CODE()) {
      throw new Error("Invalid access code");
    }
    if (!data.key) throw new Error("key required");
    await resetSlot(data.key);
    return { ok: true };
  });

/** Client helper: map by key from resolved list */
export function indexSlots(
  slots: MediaSlotResolved[],
): Record<string, MediaSlotResolved> {
  const out: Record<string, MediaSlotResolved> = {};
  for (const s of slots) out[s.key] = s;
  return out;
}

/** Fallback when RPC fails — static defaults only */
export function defaultResolvedSlots(): MediaSlotResolved[] {
  return MEDIA_SLOTS.map((def) => ({
    key: def.key,
    kind: def.kind,
    src: def.defaultSrc || "",
    alt: def.defaultAlt || def.label,
    caption: def.defaultCaption || "",
    poster: def.defaultPoster || "",
    isOverride: false,
    updated_at: null,
  }));
}
