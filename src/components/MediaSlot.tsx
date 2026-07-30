import { useEffect, useState, type ReactNode } from "react";
import {
  defaultResolvedSlots,
  getPublicMediaSlots,
  indexSlots,
  type MediaSlotResolved,
} from "@/lib/media-slots";
import { cn } from "@/lib/utils";

let cached: MediaSlotResolved[] | null = null;
let inflight: Promise<MediaSlotResolved[]> | null = null;

async function loadSlots(): Promise<MediaSlotResolved[]> {
  if (cached) return cached;
  if (!inflight) {
    inflight = getPublicMediaSlots()
      .then((rows) => {
        cached = rows;
        return rows;
      })
      .catch(() => {
        const fallback = defaultResolvedSlots();
        cached = fallback;
        return fallback;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

/** Invalidate client cache after admin save (same tab). */
export function bustMediaSlotCache() {
  cached = null;
}

export function useMediaSlots(): {
  slots: Record<string, MediaSlotResolved>;
  list: MediaSlotResolved[];
  loading: boolean;
} {
  const [list, setList] = useState<MediaSlotResolved[]>(
    () => cached ?? defaultResolvedSlots(),
  );
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let alive = true;
    void loadSlots().then((rows) => {
      if (!alive) return;
      setList(rows);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  return { slots: indexSlots(list), list, loading };
}

export function useMediaSlot(key: string): MediaSlotResolved | undefined {
  const { slots } = useMediaSlots();
  return slots[key];
}

/** Renders image or video for a named slot. */
export function MediaSlot({
  slotKey,
  className,
  imgClassName,
  asBackground,
  children,
}: {
  slotKey: string;
  className?: string;
  imgClassName?: string;
  asBackground?: boolean;
  children?: ReactNode;
}) {
  const slot = useMediaSlot(slotKey);
  if (!slot || !slot.src) {
    return asBackground ? (
      <div className={cn("bg-bg-elevated", className)}>{children}</div>
    ) : null;
  }

  if (slot.kind === "video") {
    const yt = youtubeEmbed(slot.src);
    if (yt) {
      return (
        <div className={cn("overflow-hidden", className)}>
          <iframe
            src={yt}
            title={slot.alt || slot.caption || slotKey}
            className={cn("h-full w-full aspect-video border-0", imgClassName)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
          {children}
        </div>
      );
    }
    return (
      <div className={cn("overflow-hidden", className)}>
        <video
          src={slot.src}
          poster={slot.poster || undefined}
          controls
          playsInline
          className={cn("h-full w-full object-cover", imgClassName)}
        />
        {children}
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden", className)}>
      <img
        src={slot.src}
        alt={slot.alt || ""}
        className={cn("h-full w-full object-cover", imgClassName)}
        loading="lazy"
      />
      {children}
    </div>
  );
}

function youtubeEmbed(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      const m = u.pathname.match(/\/embed\/([^/]+)/);
      if (m) return `https://www.youtube.com/embed/${m[1]}`;
    }
  } catch {
    /* not a URL */
  }
  return null;
}
