/** Server-only media slot persistence. */
import { getSql } from "@/lib/db";
import { MEDIA_SLOTS, type MediaKind } from "@/data/media-slots";
import type { MediaSlotResolved } from "@/lib/media-slots-types";

export type { MediaSlotResolved };

export type MediaSlotOverride = {
  slot_key: string;
  kind: string;
  src: string | null;
  poster: string | null;
  alt: string | null;
  caption: string | null;
  notes: string | null;
  updated_at: string | null;
};

export const MEDIA_ADMIN_CODE = () =>
  (
    process.env.SITES_ADMIN_CODE ||
    process.env.QUOTE_LEADS_CODE ||
    "FAFO-LEADS"
  ).toUpperCase();

export async function ensureMediaTables() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists media_slots (
      slot_key text primary key,
      kind text not null default 'image',
      src text,
      poster text,
      alt text,
      caption text,
      notes text,
      updated_at timestamptz not null default now()
    )
  `);
  return sql;
}

export async function listOverrides(): Promise<MediaSlotOverride[]> {
  const sql = await ensureMediaTables();
  return sql<MediaSlotOverride>`
    select slot_key, kind, src, poster, alt, caption, notes,
           updated_at::text as updated_at
    from media_slots
    order by slot_key
  `;
}

export async function resolveAllSlots(): Promise<MediaSlotResolved[]> {
  const overrides = await listOverrides();
  const map = new Map(overrides.map((o) => [o.slot_key, o]));
  return MEDIA_SLOTS.map((def) => {
    const o = map.get(def.key);
    return {
      key: def.key,
      kind: ((o?.kind as MediaKind) || def.kind) as MediaKind,
      src: (o?.src && o.src.trim()) || def.defaultSrc || "",
      alt: (o?.alt && o.alt.trim()) || def.defaultAlt || def.label,
      caption: (o?.caption && o.caption.trim()) || def.defaultCaption || "",
      poster: (o?.poster && o.poster.trim()) || def.defaultPoster || "",
      isOverride: Boolean(o),
      updated_at: o?.updated_at ?? null,
    };
  });
}

export async function upsertSlot(input: {
  key: string;
  kind?: string;
  src?: string | null;
  poster?: string | null;
  alt?: string | null;
  caption?: string | null;
  notes?: string | null;
}): Promise<MediaSlotResolved> {
  const def = MEDIA_SLOTS.find((s) => s.key === input.key);
  if (!def) throw new Error("Unknown media slot: " + input.key);

  const sql = await ensureMediaTables();
  const kind = input.kind || def.kind;
  await sql`
    insert into media_slots (slot_key, kind, src, poster, alt, caption, notes, updated_at)
    values (
      ${input.key},
      ${kind},
      ${input.src ?? null},
      ${input.poster ?? null},
      ${input.alt ?? null},
      ${input.caption ?? null},
      ${input.notes ?? null},
      now()
    )
    on conflict (slot_key) do update set
      kind = excluded.kind,
      src = excluded.src,
      poster = excluded.poster,
      alt = excluded.alt,
      caption = excluded.caption,
      notes = excluded.notes,
      updated_at = now()
  `;
  const all = await resolveAllSlots();
  return all.find((s) => s.key === input.key)!;
}

export async function resetSlot(key: string): Promise<void> {
  const sql = await ensureMediaTables();
  await sql`delete from media_slots where slot_key = ${key}`;
}
