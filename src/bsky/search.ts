import type { RegionId } from "../atlas/ids";
import { REGIONS } from "../atlas/regions";
import type { Pin } from "../atlas/samples";
import { SAMPLE_PINS } from "../atlas/samples";
import type { Topic } from "../atlas/topics";
import { SITE_TAG, hashtag, pinTags } from "./tags";

export const BSKY_PUBLIC_API = "https://public.api.bsky.app";
export const SEARCH_LIMIT = 30;

/** Minimal shape of what `app.bsky.feed.searchPosts` returns; we only read these fields. */
interface PostView {
  uri: string;
  author?: { handle?: string };
  record?: unknown;
  indexedAt?: string;
}
interface SearchPostsResponse {
  posts?: PostView[];
  cursor?: string;
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

export type SearchOutcome =
  | { status: "live"; query: string; posts: Pin[] }
  | { status: "empty"; query: string; posts: [] }
  | { status: "blocked"; query: string; posts: []; error: string };

/** `#wbc-heart #WholeBodyCookbook` (plus topic tags). Bluesky ANDs hashtags. */
export function searchQuery(region: RegionId, topic?: Topic | null): string {
  return pinTags(region, topic).map(hashtag).join(" ");
}

export function searchUrl(query: string): string {
  const params = new URLSearchParams({ q: query, limit: String(SEARCH_LIMIT), sort: "latest" });
  return `${BSKY_PUBLIC_API}/xrpc/app.bsky.feed.searchPosts?${params.toString()}`;
}

/** at://did/app.bsky.feed.post/rkey → https://bsky.app/profile/did/post/rkey */
export function postWebUrl(uri: string): string {
  const parts = uri.replace(/^at:\/\//, "").split("/");
  const did = parts[0];
  const rkey = parts[2];
  return did && rkey ? `https://bsky.app/profile/${did}/post/${rkey}` : "https://bsky.app";
}

/** Read the first `#wbc-*` tag out of a live post so it lands on the right room. */
function regionFromText(text: string, fallback: RegionId): RegionId {
  const m = /#(wbc-[a-z]+)/i.exec(text);
  const tag = m?.[1]?.toLowerCase();
  const hit = tag ? REGIONS.find((r) => r.tag === tag) : undefined;
  return hit ? hit.id : fallback;
}

function toPin(post: PostView, region: RegionId): Pin | null {
  const rec = isRecord(post.record) ? post.record : {};
  const text = typeof rec.text === "string" ? rec.text : "";
  if (!text) return null;
  const createdAt = typeof rec.createdAt === "string" ? rec.createdAt : (post.indexedAt ?? new Date().toISOString());
  return {
    region: regionFromText(text, region),
    handle: post.author?.handle ?? "unknown",
    text,
    createdAt,
    uri: post.uri,
    demo: false,
  };
}

/**
 * Search the public AppView. Fails soft: any network / CORS / HTTP problem
 * becomes `blocked`, and an OK response with no posts is `empty`. Callers
 * fall back to `samplePinsFor` and must label those as samples.
 */
export async function searchPins(region: RegionId, topic?: Topic | null, signal?: AbortSignal): Promise<SearchOutcome> {
  const query = searchQuery(region, topic);
  try {
    const res = await fetch(searchUrl(query), { signal, headers: { accept: "application/json" } });
    if (!res.ok) return { status: "blocked", query, posts: [], error: `HTTP ${res.status}` };
    const data = (await res.json()) as SearchPostsResponse;
    const posts = (data.posts ?? [])
      .map((p) => toPin(p, region))
      .filter((p): p is Pin => p !== null && p.text.toLowerCase().includes(`#${SITE_TAG.toLowerCase()}`));
    return posts.length ? { status: "live", query, posts } : { status: "empty", query, posts: [] };
  } catch (e) {
    if (signal?.aborted) return { status: "empty", query, posts: [] };
    return { status: "blocked", query, posts: [], error: e instanceof Error ? e.message : String(e) };
  }
}

/** Sample pins for a region (or topic), never mixed with live posts. */
export function samplePinsFor(region: RegionId, topic?: Topic | null): Pin[] {
  const byRegion = SAMPLE_PINS.filter((p) => p.region === region);
  if (byRegion.length) return byRegion;
  if (topic) {
    const byTopic = SAMPLE_PINS.filter((p) => p.topic === topic.id);
    if (byTopic.length) return byTopic;
  }
  return [];
}
