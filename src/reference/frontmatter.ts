/**
 * A deliberately small frontmatter reader: `key: scalar`, `key: [a, b]`,
 * and `key:` followed by `- item` lines. Nothing nested. Anything else is
 * ignored (and reported in dev by index.ts).
 */
export type FrontmatterValue = string | string[];

export interface ParsedFile {
  data: Record<string, FrontmatterValue>;
  body: string;
}

const unquote = (s: string): string => {
  const t = s.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) return t.slice(1, -1);
  return t;
};

const stripComment = (s: string): string => s.replace(/\s+#.*$/, "");

export function parseFrontmatter(raw: string): ParsedFile {
  const text = raw.replace(/^﻿/, "");
  if (!text.startsWith("---\n") && !text.startsWith("---\r\n")) return { data: {}, body: text };
  const end = text.indexOf("\n---", 3);
  if (end === -1) return { data: {}, body: text };
  const block = text.slice(text.indexOf("\n") + 1, end);
  const body = text.slice(end + 4).replace(/^\r?\n/, "");
  const data: Record<string, FrontmatterValue> = {};
  const lines = block.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    const m = /^([A-Za-z_][\w-]*):(.*)$/.exec(line);
    if (!m) continue;
    const key = m[1] ?? "";
    const rest = stripComment(m[2] ?? "").trim();
    if (rest.startsWith("[") && rest.endsWith("]")) {
      data[key] = rest
        .slice(1, -1)
        .split(",")
        .map(unquote)
        .filter(Boolean);
    } else if (rest === "") {
      const items: string[] = [];
      while (i + 1 < lines.length && /^\s+-\s/.test(lines[i + 1] ?? "")) {
        i++;
        items.push(unquote(stripComment((lines[i] ?? "").replace(/^\s+-\s*/, ""))));
      }
      data[key] = items;
    } else {
      data[key] = unquote(rest);
    }
  }
  return { data, body };
}

/** Markdown/MDX → plain text for the search index and excerpts. */
export function stripToText(body: string): string {
  return body
    .replace(/^(import|export)\s[^\n]*$/gm, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\[\[wp:([^\]|]+?)(?:\|([^\]]+?))?\]\]/g, (_m, a: string, b?: string) => b ?? a)
    .replace(/\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g, (_m, a: string, b?: string) => b ?? a.replace(/-/g, " "))
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/\|/g, " ")
    .replace(/(?<!\\)[*_`~]+/g, "")
    .replace(/\\([{}<>|~*_#\\-])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export interface SourceLink {
  label: string;
  href: string;
}

/** `- [label](href)` items under a `## Sources` heading. */
export function extractSources(body: string): SourceLink[] {
  const m = /^##\s+Sources\s*$([\s\S]*?)(?=^##\s|\s*$(?![\s\S]))/m.exec(body);
  const section = m?.[1] ?? "";
  const out: SourceLink[] = [];
  for (const line of section.split(/\r?\n/)) {
    const l = /^\s*[-*]\s+\[([^\]]+)\]\(([^)]+)\)/.exec(line);
    if (l && l[1] && l[2]) out.push({ label: l[1], href: l[2] });
  }
  return out;
}

/** Internal wikilink slugs in a body (wp: links excluded). */
export function extractWikilinks(body: string): string[] {
  const out = new Set<string>();
  for (const m of body.matchAll(/\[\[([^\]|]+?)(?:\|[^\]]+?)?\]\]/g)) {
    const t = (m[1] ?? "").trim();
    if (!t.startsWith("wp:")) out.add(t);
  }
  return [...out];
}

export interface Section {
  /** H2 title; "" for the preamble before the first heading. */
  title: string;
  md: string;
}

/** Split a body on `## ` headings. Assumes no fenced code blocks contain headings. */
export function splitSections(body: string): Section[] {
  const out: Section[] = [];
  let title = "";
  let buf: string[] = [];
  for (const line of body.split(/\r?\n/)) {
    const h = /^##\s+(.+?)\s*$/.exec(line);
    if (h) {
      out.push({ title, md: buf.join("\n") });
      title = h[1] ?? "";
      buf = [];
    } else buf.push(line);
  }
  out.push({ title, md: buf.join("\n") });
  return out;
}

/** The first prose paragraph of a markdown body, as plain text. */
export function firstParagraph(md: string): string {
  for (const block of md.split(/\r?\n\s*\r?\n/)) {
    const t = block.trim();
    if (!t) continue;
    if (/^(#|<|import\s|export\s|-\s|\*\s|>|\||```)/.test(t)) continue;
    return stripToText(t);
  }
  return "";
}

export interface Lens {
  label: string;
  text: string;
}

const LENSES = ["body", "tradition", "evidence", "practice", "symbol"];

/** H2 sections titled Body / Tradition / Evidence / Practice / Symbol, in file order. */
export function extractLenses(body: string): Lens[] {
  return splitSections(body)
    .filter((s) => LENSES.includes(s.title.toLowerCase()))
    .map((s) => ({ label: s.title.toLowerCase(), text: stripToText(s.md) }));
}
