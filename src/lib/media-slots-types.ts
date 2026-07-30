import type { MediaKind } from "@/data/media-slots";

export type MediaSlotResolved = {
  key: string;
  kind: MediaKind;
  src: string;
  alt: string;
  caption: string;
  poster: string;
  isOverride: boolean;
  updated_at: string | null;
};
