import RAW from "virtual:reference-raw";
import type { ComponentType } from "react";
import type { MDXComponents } from "mdx/types";
import { isRegionId, type RegionId } from "../atlas/ids";
import { extractLenses, extractSources, extractWikilinks, firstParagraph, parseFrontmatter, stripToText, type Lens, type SourceLink } from "./frontmatter";
import { KIND_IDS, REFERENCE_KINDS, isReferenceKind, type ReferenceKind } from "./schema";

/** `RAW`: raw source for every entry, read at build time by vite-reference-raw.ts. */

/** Compiled MDX, lazy: one chunk per entry, loaded when rendered. */
export const LOADERS = import.meta.glob<{ default: ComponentType<{ components?: MDXComponents }> }>("/content/**/*.mdx");

export interface ReferenceEntry {
  slug: string;
  /** Vite glob key, e.g. `/content/region/heart.mdx`. */
  path: string;
  kind: ReferenceKind;
  /** Atlas id this entry describes, when it has one. */
  id: string | null;
  title: string;
  summary: string;
  /** Where on the plate, from frontmatter. */
  where: string | null;
  /** First body paragraph, plain text: the panel's "what". */
  what: string;
  /** Lens sections (body / tradition / evidence / practice / symbol). */
  lenses: Lens[];
  regions: RegionId[];
  tags: string[];
  aliases: string[];
  wikipedia: string | null;
  sources: SourceLink[];
  /** Slugs this entry links to. */
  links: string[];
  /** Slugs that link here. */
  backlinks: string[];
  /** Plain text for search. */
  body: string;
  words: number;
}

const warned = new Set<string>();
function warn(key: string, msg: string): void {
  if (!import.meta.env.DEV || warned.has(key)) return;
  warned.add(key);
  console.error(`[reference] ${msg}`);
}

const asList = (v: string | string[] | undefined): string[] => (Array.isArray(v) ? v : v ? [v] : []);
const asString = (v: string | string[] | undefined): string => (Array.isArray(v) ? v.join(" ") : (v ?? ""));

function build(): ReferenceEntry[] {
  const entries: ReferenceEntry[] = [];
  const seen = new Set<string>();
  for (const [path, raw] of Object.entries(RAW)) {
    const m = /^\/content\/([^/]+)\/([^/]+)\.mdx$/.exec(path);
    const folder = m?.[1] ?? "";
    const slug = m?.[2] ?? "";
    if (!m || !isReferenceKind(folder)) {
      warn(path, `${path} is not under a known kind folder (${REFERENCE_KINDS.join(", ")})`);
      continue;
    }
    const { data, body } = parseFrontmatter(raw);
    const kind = asString(data.kind) || folder;
    if (!isReferenceKind(kind) || kind !== folder) warn(path, `${path}: kind "${kind}" does not match folder "${folder}"`);
    const id = asString(data.id) || null;
    if (id && !KIND_IDS[folder].includes(id)) warn(`${path}#id`, `${path}: id "${id}" is not a known ${folder} id`);
    if (folder === "region" && !id) warn(`${path}#noid`, `${path}: region entries need an id`);
    const title = asString(data.title);
    const summary = asString(data.summary);
    if (!title || !summary) warn(`${path}#ts`, `${path}: title and summary are required`);
    const regions = asList(data.regions).filter((r): r is RegionId => {
      if (isRegionId(r)) return true;
      warn(`${path}#${r}`, `${path}: unknown region "${r}"`);
      return false;
    });
    if (folder === "region" && id && isRegionId(id) && !regions.includes(id)) regions.unshift(id);
    if (seen.has(slug)) warn(`${path}#dup`, `duplicate slug "${slug}" (${path})`);
    seen.add(slug);
    const text = stripToText(body);
    entries.push({
      slug,
      path,
      kind: folder,
      id,
      title: title || slug,
      summary,
      where: asString(data.where) || null,
      what: firstParagraph(body),
      lenses: extractLenses(body),
      regions,
      tags: asList(data.tags),
      aliases: asList(data.aliases),
      wikipedia: asString(data.wikipedia) || null,
      sources: extractSources(body),
      links: extractWikilinks(body),
      backlinks: [],
      body: text,
      words: text ? text.split(" ").length : 0,
    });
  }
  const bySlug = new Map(entries.map((e) => [e.slug, e]));
  for (const e of entries) {
    for (const target of e.links) {
      const t = bySlug.get(target);
      if (!t) {
        warn(`${e.path}#link:${target}`, `${e.path}: wikilink to unknown entry "${target}"`);
        continue;
      }
      if (!t.backlinks.includes(e.slug)) t.backlinks.push(e.slug);
    }
  }
  const order = (k: ReferenceKind): number => REFERENCE_KINDS.indexOf(k);
  entries.sort((a, b) => order(a.kind) - order(b.kind) || a.title.localeCompare(b.title));
  for (const e of entries) e.backlinks.sort((a, b) => (bySlug.get(a)?.title ?? a).localeCompare(bySlug.get(b)?.title ?? b));
  return entries;
}

export const ENTRIES: readonly ReferenceEntry[] = build();

const BY_SLUG: ReadonlyMap<string, ReferenceEntry> = new Map(ENTRIES.map((e) => [e.slug, e]));
const BY_KIND_ID: ReadonlyMap<string, ReferenceEntry> = new Map(ENTRIES.filter((e) => e.id).map((e) => [`${e.kind}:${e.id}`, e]));

export const entryBySlug = (slug: string): ReferenceEntry | undefined => BY_SLUG.get(slug);
export const entryFor = (kind: ReferenceKind, id: string): ReferenceEntry | undefined => BY_KIND_ID.get(`${kind}:${id}`);
/** The knowledge-base lookup the atlas panel uses. Same thing as `entryFor`. */
export const kbFor = entryFor;
export const entriesOfKind = (kind: ReferenceKind): ReferenceEntry[] => ENTRIES.filter((e) => e.kind === kind);
export const referenceHref = (slug: string): string => `#/reference/${slug}`;
