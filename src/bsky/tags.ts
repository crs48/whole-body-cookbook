import type { RegionId } from "../atlas/ids";
import { regionById } from "../atlas/regions";
import type { Topic } from "../atlas/topics";

/** Every cookbook post carries this. */
export const SITE_TAG = "WholeBodyCookbook";

/** `wbc-heart`, `wbc-solar`, … from `regions.ts`. */
export const regionTag = (id: RegionId): string => regionById(id).tag;

/** Topic tags minus the site tag (which is always appended separately). */
export const topicTags = (topic: Topic | null | undefined): string[] =>
  topic ? topic.tags.filter((t) => t !== SITE_TAG) : [];

/** The tag set for a pin: site tag + region tag + topic tags, no duplicates. */
export const pinTags = (region: RegionId, topic?: Topic | null): string[] => {
  const out: string[] = [];
  for (const t of [...topicTags(topic), regionTag(region), SITE_TAG]) if (!out.includes(t)) out.push(t);
  return out;
};

export const hashtag = (tag: string): string => `#${tag}`;

/** Does `text` already contain `#tag` (case-insensitive, word-bounded)? */
export const hasHashtag = (text: string, tag: string): boolean =>
  new RegExp(`(^|\\s)#${tag.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&")}(?=\\s|$)`, "i").test(text);
