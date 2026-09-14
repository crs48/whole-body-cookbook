/**
 * Wikilinks for the reference.
 *
 *   [[heart]]                → <a href="#/reference/heart" class="wikilink" data-wikilink="heart">heart</a>
 *   [[heart|the heart]]      → same href, label "the heart"
 *   [[wp:Vagus nerve|vagus]] → https://en.wikipedia.org/wiki/Vagus_nerve, class "wikilink wp"
 *
 * Internal targets must exist as `content/**​/<slug>.mdx`. A dangling link is a
 * console warning in dev and a hard failure in a production build.
 */
import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { PhrasingContent, Root, Text } from "mdast";
import { visit } from "unist-util-visit";

export const WIKILINK_RE = /\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;

interface Options {
  contentDir: string;
}

interface FileLike {
  path?: string;
  fail: (message: string) => never;
}

function slugsIn(dir: string): Set<string> {
  const out = new Set<string>();
  for (const e of readdirSync(dir, { withFileTypes: true, recursive: true })) {
    if (e.isFile() && e.name.endsWith(".mdx")) out.add(e.name.slice(0, -4));
  }
  return out;
}

export default function remarkWikiLinks({ contentDir }: Options) {
  return (tree: Root, file: FileLike): void => {
    // Fresh scan per file so new entries are picked up without a restart.
    const known = slugsIn(join(process.cwd(), contentDir));
    visit(tree, "text", (node: Text, index, parent) => {
      if (index === undefined || !parent) return;
      const matches = [...node.value.matchAll(WIKILINK_RE)];
      if (matches.length === 0) return;
      const out: PhrasingContent[] = [];
      let last = 0;
      for (const m of matches) {
        const whole = m[0];
        const rawTarget = m[1] ?? "";
        const alias = m[2];
        const at = m.index ?? 0;
        if (at > last) out.push({ type: "text", value: node.value.slice(last, at) });
        const target = rawTarget.trim();
        const wp = target.startsWith("wp:");
        const name = wp ? target.slice(3).trim() : target;
        const url = wp ? `https://en.wikipedia.org/wiki/${encodeURIComponent(name.replace(/ /g, "_"))}` : `#/reference/${name}`;
        if (!wp && !known.has(name)) {
          const msg = `dangling wikilink [[${name}]] in ${file.path ?? "?"}`;
          if (process.env.NODE_ENV === "production") file.fail(msg);
          else console.warn(`[wikilinks] ${msg}`);
        }
        out.push({
          type: "link",
          url,
          data: { hProperties: wp ? { className: ["wikilink", "wp"] } : { className: ["wikilink"], "data-wikilink": name } },
          children: [{ type: "text", value: (alias ?? name).trim() }],
        });
        last = at + whole.length;
      }
      if (last < node.value.length) out.push({ type: "text", value: node.value.slice(last) });
      parent.children.splice(index, 1, ...out);
      return index + out.length;
    });
  };
}
