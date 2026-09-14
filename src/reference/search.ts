import { useMemo } from "react";
import MiniSearch from "minisearch";
import { ENTRIES, entryBySlug, type ReferenceEntry } from "./index";

interface Doc {
  slug: string;
  title: string;
  summary: string;
  where: string;
  tags: string;
  aliases: string;
  body: string;
}

let index: MiniSearch<Doc> | null = null;

/** Built on first use; the corpus is small enough to index synchronously. */
function getIndex(): MiniSearch<Doc> {
  if (index) return index;
  index = new MiniSearch<Doc>({
    idField: "slug",
    fields: ["title", "summary", "where", "tags", "aliases", "body"],
    storeFields: ["slug"],
    searchOptions: {
      boost: { title: 3, summary: 2, tags: 2, aliases: 2 },
      prefix: true,
      fuzzy: 0.2,
      combineWith: "AND",
    },
  });
  index.addAll(
    ENTRIES.map((e) => ({
      slug: e.slug,
      title: e.title,
      summary: e.summary,
      where: e.where ?? "",
      tags: e.tags.join(" "),
      aliases: e.aliases.join(" "),
      body: e.body,
    })),
  );
  return index;
}

export const MIN_QUERY = 2;

export function search(query: string, limit = 8): ReferenceEntry[] {
  const q = query.trim();
  if (q.length < MIN_QUERY) return [];
  const out: ReferenceEntry[] = [];
  for (const r of getIndex().search(q)) {
    const e = entryBySlug(String(r.id));
    if (e) out.push(e);
    if (out.length >= limit) break;
  }
  return out;
}

export const useSearch = (query: string, limit = 8): ReferenceEntry[] => useMemo(() => search(query, limit), [query, limit]);
