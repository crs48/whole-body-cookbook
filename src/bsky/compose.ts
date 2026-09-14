import type { RegionId } from "../atlas/ids";
import { regionById } from "../atlas/regions";
import type { Topic } from "../atlas/topics";
import { SITE_TAG, hasHashtag, hashtag, pinTags, regionTag } from "./tags";

export const BSKY_COMPOSE = "https://bsky.app/intent/compose";
export const POST_MAX_GRAPHEMES = 300;

/** Count graphemes the way Bluesky does, falling back to code points. */
export function graphemeCount(text: string): number {
  const Seg = (Intl as unknown as { Segmenter?: new (locale: string, o: { granularity: string }) => { segment(s: string): Iterable<unknown> } }).Segmenter;
  if (Seg) {
    let n = 0;
    for (const _ of new Seg("en", { granularity: "grapheme" }).segment(text)) n++;
    return n;
  }
  return [...text].length;
}

/** Default text for the composer: a one-line lead plus the tag block. */
export function composeText(region: RegionId, topic?: Topic | null, lead?: string): string {
  const r = regionById(region);
  const first = lead ?? `Pinning this to the ${r.name.toLowerCase()}.`;
  return `${first} ${pinTags(region, topic).map(hashtag).join(" ")}`;
}

/**
 * Whatever the user typed, always append `#WholeBodyCookbook #wbc-{region}`
 * (plus topic tags) unless they are already present.
 */
export function withRequiredTags(text: string, region: RegionId, topic?: Topic | null): string {
  const missing = pinTags(region, topic).filter((t) => !hasHashtag(text, t));
  // Site and region tags are non-negotiable; topic tags ride along.
  const required = [SITE_TAG, regionTag(region)];
  const toAdd = missing.filter((t) => required.includes(t) || topic?.tags.includes(t));
  if (toAdd.length === 0) return text.trim();
  return `${text.trim()} ${toAdd.map(hashtag).join(" ")}`.trim();
}

/** `https://bsky.app/intent/compose?text=…` */
export function composeUrl(text: string): string {
  return `${BSKY_COMPOSE}?text=${encodeURIComponent(text)}`;
}

/** Open Bluesky's composer in a new tab. Returns the URL used. */
export function openCompose(text: string): string {
  const url = composeUrl(text);
  window.open(url, "_blank", "noopener");
  return url;
}
