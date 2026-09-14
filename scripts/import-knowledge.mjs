#!/usr/bin/env node
/**
 * One-off migration: the Claude Design "Body Atlas" knowledge base
 * (scripts/kb/atlas-knowledge.js, window.ATLAS_KNOWLEDGE keyed "kind:id")
 * → MDX reference entries under content/.
 *
 *   node scripts/import-knowledge.mjs [scripts/kb/atlas-knowledge.js] [--dry]
 *
 * Existing files are merged idempotently (where:, what paragraph, lens
 * sections, Sources links). Missing files are created. Prints a report and
 * exits non-zero if any key maps to zero or more than one file.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import vm from "node:vm";

const args = process.argv.slice(2);
const dry = args.includes("--dry");
const srcPath = args.find((a) => !a.startsWith("--")) ?? "scripts/kb/atlas-knowledge.js";
const ROOT = process.cwd();

let src = readFileSync(srcPath, "utf8");
if (src.trimStart().startsWith('{"method"')) src = JSON.parse(src).content;
const sandbox = { window: {} };
vm.runInNewContext(src, sandbox);
const K = sandbox.window.ATLAS_KNOWLEDGE;
if (!K) throw new Error("ATLAS_KNOWLEDGE not defined by the source");
if (typeof K.gate === "function") {
  for (let n = 1; n <= 64; n++) K[`gate:${n}`] = K.gate(n);
  delete K.gate;
}

/* ---------- id maps (design / KB → repo) ---------- */
const MER = { LU: "lung", LI: "large-intestine", ST: "stomach", SP: "spleen", HT: "heart", SI: "small-intestine", BL: "bladder", KI: "kidney", PC: "pericardium", TW: "triple-warmer", GB: "gallbladder", LR: "liver" };
const MER_ORGAN = { lung: "lungs", "large-intestine": "intestines", stomach: "stomach", spleen: "spleen", heart: "heart", "small-intestine": "intestines", bladder: "kidneys", kidney: "kidneys", pericardium: "heart", "triple-warmer": "autonomic", gallbladder: "liver", liver: "liver" };
const HD = { head: "head", ajna: "ajna", throat: "throat", g: "g", ego: "ego", spleen: "spleen", sp: "solar-plexus", sacral: "sacral", root: "root" };
const HD_REGION = { head: "crown", ajna: "brain", throat: "throat", g: "heart", ego: "heart", spleen: "spleen", sp: "solar-plexus", sacral: "pelvis", root: "pelvis" };
const CHAKRAS = ["muladhara", "svadhisthana", "manipura", "anahata", "vishuddha", "ajna", "sahasrara"];
const HEX = ["Creative", "Receptive", "Difficulty at the Beginning", "Youthful Folly", "Waiting", "Conflict", "The Army", "Holding Together", "Small Taming", "Treading", "Peace", "Standstill", "Fellowship", "Great Possession", "Modesty", "Enthusiasm", "Following", "Work on the Decayed", "Approach", "Contemplation", "Biting Through", "Grace", "Splitting Apart", "Return", "Innocence", "Great Taming", "Nourishment", "Great Exceeding", "The Abysmal", "Clinging Fire", "Influence", "Duration", "Retreat", "Great Power", "Progress", "Darkening of the Light", "The Family", "Opposition", "Obstruction", "Deliverance", "Decrease", "Increase", "Breakthrough", "Coming to Meet", "Gathering Together", "Pushing Upward", "Oppression", "The Well", "Revolution", "The Cauldron", "The Arousing", "Keeping Still", "Development", "The Marrying Maiden", "Abundance", "The Wanderer", "The Gentle", "The Joyous", "Dispersion", "Limitation", "Inner Truth", "Small Exceeding", "After Completion", "Before Completion"];
const GATE_CENTER = {};
for (const [c, gs] of [["head", [64, 61, 63]], ["ajna", [47, 24, 4, 17, 43, 11]], ["throat", [62, 23, 56, 35, 12, 45, 33, 8, 31, 20, 16]], ["g", [1, 13, 25, 46, 2, 15, 10, 7]], ["ego", [21, 40, 26, 51]], ["spleen", [48, 57, 44, 50, 32, 28, 18]], ["sp", [6, 37, 22, 36, 30, 55, 49]], ["sacral", [5, 14, 29, 59, 9, 3, 42, 27, 34]], ["root", [53, 60, 52, 19, 39, 41, 58, 38, 54]]]) for (const g of gs) GATE_CENTER[g] = c;
const FASCIA = { SFL: ["sfl", ["feet", "left-leg", "right-leg", "intestines", "throat"]], SBL: ["sbl", ["feet", "spine", "crown"]], LL: ["ll", ["feet", "pelvis", "throat"]], SL: ["spl", ["whole"]], SPL: ["spl", ["whole"]], DFL: ["dfl", ["feet", "pelvis", "heart", "throat"]], SFAL: ["sfal", ["left-arm", "right-arm", "hands"]], DFAL: ["dfal", ["left-arm", "right-arm", "hands"]], SBAL: ["sbal", ["left-arm", "right-arm", "hands"]], DBAL: ["dbal", ["left-arm", "right-arm", "hands"]], "*": ["anatomy-trains", ["whole", "skin"]] };
const MICRO = { face: "face-map", tongue: "tongue-map", iris: "iris-map", hara: "hara" };
const MICRO_REGION = { face: ["face"], tongue: ["face", "throat"], iris: ["face", "brain"], hara: ["intestines", "stomach"] };
const PLANET_REGION = { sun: ["heart"], moon: ["stomach"], mercury: ["lungs", "hands"], venus: ["kidneys", "throat"], mars: ["face"], jupiter: ["liver"], saturn: ["spine", "skin"] };
const CENTER_EXTRA = { "soul star": ["soul-star", ["crown", "whole"]], "earth star": ["earth-star", ["feet", "whole"]], dantien: ["dantien", ["pelvis", "intestines"]] };
const FIELD_REGION = { aura: ["skin", "whole"], torus: ["whole", "spine"], merkaba: ["whole"], polarity: ["whole"] };
const VESSEL_REGION = { Du: ["spine", "crown", "face"], Ren: ["pelvis", "intestines", "heart", "throat"] };

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** Where a KB key lives. */
function target(key, e) {
  const [kind, id] = key.split(/:(.*)/s);
  const T = (dir, slug, extra = {}) => ({ path: `content/${dir}/${slug}.mdx`, kind: dir, slug, ...extra });
  switch (kind) {
    case "room":
      return T("region", id, { id, regions: [id], tags: [] });
    case "meridian": {
      const m = MER[id];
      if (!m) return null;
      return T("meridian", `${m}-meridian`, { id: m, regions: [MER_ORGAN[m]], tags: ["TCM"], aliases: [id] });
    }
    case "vessel":
      return T("vessel", id.toLowerCase(), { id: id.toLowerCase(), regions: VESSEL_REGION[id] ?? ["spine"], tags: ["TCM"], aliases: [`${id} mai`] });
    case "fascia": {
      const f = FASCIA[id];
      if (!f) return null;
      return T("fascia", f[0], { id: f[0], regions: f[1], tags: ["fascia", "anatomytrains"], aliases: id === "*" ? ["myofascial meridians"] : [id] });
    }
    case "reflex":
      return T("reflex", id, { id, regions: id === "foot" ? ["feet"] : id === "hand" ? ["hands"] : ["face"], tags: ["reflexology"] });
    case "micro":
      return T("micro", MICRO[id] ?? id, { id: MICRO[id] ?? id, regions: MICRO_REGION[id] ?? ["face"], tags: ["diagnosis"] });
    case "tooth":
      return T("tooth", "tooth-chart", { id: "tooth-chart", regions: ["face"], tags: ["teeth", "TCM"], aliases: ["meridian tooth chart", "biological dentistry"] });
    case "nerve":
      return T("nerve", id, { id, regions: id === "brachial" ? ["throat", "left-arm", "right-arm", "hands"] : id === "sciatic" ? ["pelvis", "left-leg", "right-leg", "feet"] : ["brain", "throat", "heart", "lungs", "stomach", "intestines"], tags: [id] });
    case "center": {
      if (CHAKRAS.includes(id)) return T("chakra", id, { id, regions: [], tags: ["chakra"] });
      const c = CENTER_EXTRA[id];
      if (!c) return null;
      return T("center", c[0], { id: c[0], regions: c[1], tags: ["subtlebody"] });
    }
    case "hd": {
      const h = HD[id];
      if (!h) return null;
      return T("hd-center", `hd-${h}`, { id: h, regions: [HD_REGION[id]], tags: ["humandesign"] });
    }
    case "gate": {
      const n = Number(id);
      return T("gate", `gate-${n}`, { id: String(n), regions: [HD_REGION[GATE_CENTER[n]] ?? "whole"], tags: ["humandesign", "iching", "genekeys"], title: `Gate ${n} · ${HEX[n - 1]}`, aliases: [`hexagram ${n}`, `gene key ${n}`, HEX[n - 1]] });
    }
    case "planet":
      return T("planet", id.toLowerCase(), { id: id.toLowerCase(), regions: PLANET_REGION[id.toLowerCase()] ?? ["whole"], tags: ["astrology"] });
    case "field":
      return T("field", id, { id, regions: FIELD_REGION[id] ?? ["whole"], tags: ["subtlebody"] });
    default:
      return null;
  }
}

/* ---------- MDX escaping ---------- */
/** Prose → MDX-safe paragraph. Never applied to URLs. */
function esc(s) {
  let t = String(s ?? "").replace(/\s+/g, " ").trim();
  t = t.replace(/\\/g, "\\\\").replace(/[{}<~*]/g, (m) => `\\${m}`).replace(/\[\[/g, "\\[\\[");
  if (/^(#|-|>|\+|\d+\.)/.test(t)) t = `\\${t}`;
  return t;
}
/** Frontmatter scalar: single line, no " #" (parser comment), no quotes at the ends. */
function fm(s) {
  let t = String(s ?? "").replace(/\s+/g, " ").trim().replace(/\s#/g, " no.").replace(/^---/, "—");
  if (/^["'\[]/.test(t)) t = ` ${t}`.trim();
  return t;
}
const firstSentence = (s) => {
  const t = String(s ?? "").replace(/\s+/g, " ").trim();
  const m = /^(.*?[.!?])(?=\s+[A-Z\(]|\s*$)/.exec(t);
  const out = (m ? m[1] : t).trim();
  return out.length > 220 ? `${out.slice(0, 217).trim()}…` : out;
};

/* ---------- merge / create ---------- */
const lensBlock = ([label, text]) => `## ${cap(label)}\n\n${esc(text)}\n`;
const sourcesLines = (links, existingHrefs) =>
  (links ?? []).filter(([, u]) => !existingHrefs.has(u)).map(([t, u]) => `- [${String(t).replace(/[\[\]]/g, "")}](${u})`);

function merge(text, e) {
  let out = text;
  if (e.where && !/^where:/m.test(out)) out = out.replace(/^(summary:.*\n)/m, `$1where: ${fm(e.where)}\n`);
  const m = /^(---\r?\n[\s\S]*?\r?\n---\r?\n)([\s\S]*)$/.exec(out);
  if (!m) throw new Error("no frontmatter");
  const head = m[1];
  let body = m[2];
  const what = esc(e.what);
  if (what && !body.includes(what.slice(0, 40))) body = `\n${what}\n${body.startsWith("\n") ? "" : "\n"}${body}`;
  const sections = [];
  for (const lens of e.lenses ?? []) {
    const re = new RegExp(`^##\\s+${cap(lens[0])}\\s*$`, "im");
    if (!re.test(body)) sections.push(lensBlock(lens));
  }
  if (sections.length) {
    const block = `\n${sections.join("\n")}`;
    const at = body.search(/^##\s+Sources\s*$/m);
    body = at === -1 ? `${body.replace(/\s*$/, "\n")}${block}` : `${body.slice(0, at)}${block.replace(/^\n/, "")}\n${body.slice(at)}`;
  }
  const hrefs = new Set([...body.matchAll(/\]\(([^)]+)\)/g)].map((x) => x[1]));
  const add = sourcesLines(e.links, hrefs);
  if (add.length) {
    if (/^##\s+Sources\s*$/m.test(body)) {
      const secStart = body.search(/^##\s+Sources\s*$/m);
      const after = body.slice(secStart);
      const nextH = after.slice(1).search(/^##\s/m);
      const end = nextH === -1 ? body.length : secStart + 1 + nextH;
      const sec = body.slice(secStart, end).replace(/\s*$/, "\n");
      body = `${body.slice(0, secStart)}${sec}${add.join("\n")}\n${body.slice(end)}`;
    } else body = `${body.replace(/\s*$/, "\n")}\n## Sources\n\n${add.join("\n")}\n`;
  }
  return head + body.replace(/\n{3,}/g, "\n\n");
}

function create(t, e) {
  const title = t.title ?? cap(e.name ?? t.slug);
  const links = e.links ?? [];
  const wp = links.map(([, u]) => u).find((u) => /en\.wikipedia\.org/.test(u));
  const lines = [
    "---",
    `id: ${t.id}`,
    `kind: ${t.kind}`,
    `title: ${fm(title)}`,
    `summary: ${fm(firstSentence(e.what))}`,
  ];
  if (e.where) lines.push(`where: ${fm(e.where)}`);
  lines.push(`regions: [${t.regions.join(", ")}]`);
  lines.push(`tags: [${t.tags.join(", ")}]`);
  if (t.aliases?.length) lines.push(`aliases: [${t.aliases.map((a) => String(a).replace(/[,\[\]]/g, "")).join(", ")}]`);
  if (wp) lines.push(`wikipedia: ${wp}`);
  lines.push("---", "", esc(e.what), "");
  for (const lens of e.lenses ?? []) lines.push(lensBlock(lens));
  if (links.length) lines.push("## Sources", "", ...sourcesLines(links, new Set()), "");
  return `${lines.join("\n")}\n`.replace(/\n{3,}/g, "\n\n");
}

/* ---------- run ---------- */
const report = [];
const seen = new Map();
let created = 0;
let merged = 0;
let failed = 0;
for (const [key, e] of Object.entries(K)) {
  const t = target(key, e);
  if (!t) {
    report.push(`✗ ${key} → (no target)`);
    failed++;
    continue;
  }
  if (seen.has(t.path)) {
    report.push(`✗ ${key} → ${t.path} (already written by ${seen.get(t.path)})`);
    failed++;
    continue;
  }
  seen.set(t.path, key);
  const abs = join(ROOT, t.path);
  if (existsSync(abs)) {
    const before = readFileSync(abs, "utf8");
    const after = merge(before, e);
    if (!dry && after !== before) writeFileSync(abs, after);
    report.push(`~ ${key} → ${t.path}${after === before ? " (unchanged)" : ""}`);
    merged++;
  } else {
    const text = create(t, e);
    if (!dry) {
      mkdirSync(dirname(abs), { recursive: true });
      writeFileSync(abs, text);
    }
    report.push(`+ ${key} → ${t.path}`);
    created++;
  }
}
console.log(report.join("\n"));
console.log(`\n${Object.keys(K).length} keys → ${merged} merged, ${created} created, ${failed} failed${dry ? " (dry run, nothing written)" : ""}`);
if (failed) process.exit(1);
