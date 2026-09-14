/**
 * What is selected on the plate, how to describe it, and how it maps to the
 * reference and to a Bluesky room. Kinds follow the design.
 */
import {
  CENTER_IDS,
  CHAKRA_IDS,
  FASCIA_IDS,
  FIELD_LAYER_IDS,
  HD_CENTER_IDS,
  MERIDIAN_IDS,
  MICRO_IDS,
  NERVE_IDS,
  REFLEX_IDS,
  VESSEL_IDS,
  isRegionId,
  type CenterId,
  type ChakraId,
  type FasciaId,
  type FieldLayerId,
  type HdCenterId,
  type MeridianId,
  type MicroId,
  type NerveId,
  type PlanetId,
  type ReflexId,
  type RegionId,
  type VesselId,
} from "../atlas/ids";
import { AU, CU, INK, OX, VG, alpha } from "../atlas/palette";
import { CHAKRAS, FASCIA, HDC, HOMEO, MEDASTRO, MER, OVERLAYS, PLANETS, QUADRANT_NAME, ROOMS, RULE, TEETH_LO, TEETH_UP, TOOTH_NAMES, ZOD, hdChannelCounts, hdDisk, meridianByAb, zodiacSign } from "../atlas/plate";
import { GATES, gate, gateStartDeg } from "../atlas/gates";
import { CODON_RINGS } from "../atlas/codon-rings";
import { meridianById } from "../atlas/meridians";
import { entryFor } from "../reference/index";
import type { ReferenceKind } from "../reference/schema";

export type ToothQuadrant = "UR" | "UL" | "LL" | "LR";

export type Sel =
  | { kind: "room"; id: RegionId }
  | { kind: "meridian"; id: MeridianId }
  | { kind: "vessel"; id: VesselId }
  | { kind: "fascia"; id: FasciaId }
  | { kind: "reflex"; id: ReflexId }
  | { kind: "micro"; id: MicroId }
  | { kind: "tooth"; id: string; q: ToothQuadrant; i: number; pair: string }
  | { kind: "nerve"; id: NerveId }
  | { kind: "center"; id: ChakraId | CenterId }
  | { kind: "hd"; id: HdCenterId }
  | { kind: "gate"; id: number }
  | { kind: "planet"; id: PlanetId; lon: number }
  | { kind: "field"; id: FieldLayerId };

export const selKey = (s: Sel): string => `${s.kind}:${s.id}`;
export const sameSel = (a: Sel | null, b: Sel | null): boolean => (a === null && b === null) || (!!a && !!b && selKey(a) === selKey(b));

/* ---------- URL form ---------- */
export const serializeSel = (s: Sel): string => selKey(s);

const inList = <T extends string>(list: readonly T[], v: string): v is T => (list as readonly string[]).includes(v);

export function parseSel(s: string | null | undefined): Sel | null {
  if (!s) return null;
  const at = s.indexOf(":");
  if (at === -1) return null;
  const kind = s.slice(0, at);
  const id = s.slice(at + 1);
  switch (kind) {
    case "room":
      return isRegionId(id) ? { kind, id } : null;
    case "meridian":
      return inList(MERIDIAN_IDS, id) ? { kind, id } : null;
    case "vessel":
      return inList(VESSEL_IDS, id) ? { kind, id } : null;
    case "fascia":
      return inList(FASCIA_IDS, id) ? { kind, id } : null;
    case "reflex":
      return inList(REFLEX_IDS, id) ? { kind, id } : null;
    case "micro":
      return inList(MICRO_IDS, id) ? { kind, id } : null;
    case "nerve":
      return inList(NERVE_IDS, id) ? { kind, id } : null;
    case "center":
      return inList(CHAKRA_IDS, id) || inList(CENTER_IDS, id) ? { kind, id } : null;
    case "hd":
      return inList(HD_CENTER_IDS, id) ? { kind, id } : null;
    case "gate": {
      const n = Number(id);
      return Number.isInteger(n) && n >= 1 && n <= 64 ? { kind, id: n } : null;
    }
    case "planet": {
      const p = PLANETS.find((x) => x.id === id);
      return p ? { kind, id: p.id, lon: p.lon } : null;
    }
    case "field":
      return inList(FIELD_LAYER_IDS, id) ? { kind, id } : null;
    case "tooth": {
      const m = /^(UR|UL|LL|LR)([1-8])$/.exec(id);
      if (!m) return null;
      const q = m[1] as ToothQuadrant;
      const i = Number(m[2]) - 1;
      const pair = (q.startsWith("U") ? TEETH_UP : TEETH_LO)[i] ?? "";
      return { kind, id, q, i, pair };
    }
    default:
      return null;
  }
}

/* ---------- reference + room mapping ---------- */
export function refFor(sel: Sel): [ReferenceKind, string] {
  switch (sel.kind) {
    case "room":
      return ["region", sel.id];
    case "tooth":
      return ["tooth", "tooth-chart"];
    case "center":
      return [inList(CHAKRA_IDS, sel.id) ? "chakra" : "center", sel.id];
    case "hd":
      return ["hd-center", sel.id];
    case "gate":
      return ["gate", String(sel.id)];
    default:
      return [sel.kind, sel.id];
  }
}

/** The room a selection pins to on Bluesky. */
export function regionFor(sel: Sel | null): RegionId {
  if (!sel) return "whole";
  if (sel.kind === "room") return sel.id;
  if (sel.kind === "meridian") return meridianById(sel.id).organ;
  const e = entryFor(...refFor(sel));
  return e?.regions.find((r) => r !== "whole") ?? e?.regions[0] ?? "whole";
}

/* ---------- description ---------- */
export interface Line {
  k: string;
  v: string;
  c: string;
}
export interface Described {
  kind: string;
  title: string;
  sub: string;
  lines: Line[];
}

const sgn = (n: number): string => `${n > 0 ? "+" : ""}${n}`;

function inRoom(r: { cx: number; cy: number; rx: number; ry: number; rot?: number }, x: number, y: number): boolean {
  const t = (-(r.rot ?? 0) * Math.PI) / 180;
  const dx = x - r.cx;
  const dy = y - r.cy;
  const lx = dx * Math.cos(t) - dy * Math.sin(t);
  const ly = dx * Math.sin(t) + dy * Math.cos(t);
  return (lx / r.rx) ** 2 + (ly / r.ry) ** 2 <= 1.25;
}

const NOTHING: Described = {
  kind: "selection",
  title: "Nothing selected",
  sub: "Click a room, a meridian, a center, a gate or a planet. Hover for coordinates.",
  lines: [],
};

const MICRO_TEXT: Record<MicroId, [string, string]> = {
  "face-map": ["face map · mien shiang", "Chinese face reading: forehead → bladder and intestines, between the brows → liver, bridge of the nose → heart, tip → spleen, cheeks → lungs, lips → stomach, chin → kidneys and pelvis. Ayurvedic and Japanese schools place some zones differently."],
  "tongue-map": ["tongue · TCM zones", "the standard diagnostic tongue: tip → heart, behind it → lungs, centre → spleen and stomach, sides → liver and gallbladder, root → kidneys, bladder and intestines. Read for colour, coat and shape."],
  "iris-map": ["iridology · iris clocks", "each iris as a clock of the body: 12 o’clock brain, 6 o’clock legs and feet, the collarette ring around the pupil → stomach and intestines, the outer rim → skin and lymph; heart and spleen on the left iris, liver on the right. No clinical validation — drawn as a map, not a claim."],
  hara: ["hara · belly zones", "Masunaga’s abdominal diagnosis: each meridian has a reflex zone on the belly (HC = heart constrictor / pericardium, TH = triple heater). Tender or empty zones are read for the channel, not the organ."],
};

export function describe(sel: Sel | null): Described {
  if (!sel) return NOTHING;
  switch (sel.kind) {
    case "room": {
      const rs = ROOMS.filter((r) => r.id === sel.id);
      const r = rs[0];
      const kind = "room · pin target";
      if (sel.id === "skin") {
        return { kind, title: "skin / fascia", sub: "the silhouette · unit capsule", lines: [{ k: "lived", v: "interoception / sensory gain", c: VG }, { k: "rulership", v: "♄ Saturn", c: AU }, { k: "sensation", v: "“burning · worse for warmth”", c: OX }] };
      }
      if (!r || sel.id === "whole") return { kind, title: r?.name ?? sel.id, sub: "the whole person · pin above the crown (0, +1.09)", lines: [] };
      const mers = MER.filter((m) => [m.pts, m.pts.map(([x, y]) => [-x, y] as const)].some((p) => p.some(([x, y]) => rs.some((rr) => inRoom(rr, x, y))))).map((m) => m.ab);
      const ch = CHAKRAS.filter((c) => rs.some((rr) => inRoom(rr, 0, c.y))).map((c) => c.id);
      const hd = HDC.filter((c) => rs.some((rr) => inRoom(rr, c.x, c.y))).map((c) => c.name);
      const rule = RULE.filter((x) => x.room === sel.id).map((x) => `${x.glyph} ${x.name}`);
      const ovs = Object.values(OVERLAYS).filter((v) => v.rooms.includes(sel.id)).map((v) => v.name);
      const hom = HOMEO.filter((h) => h.room === sel.id).map((h) => `“${h.words}”`);
      let best = 0;
      MEDASTRO.forEach((m, i) => {
        const cur = MEDASTRO[best];
        if (cur && Math.abs(m.y - r.cy) < Math.abs(cur.y - r.cy)) best = i;
      });
      const sign = MEDASTRO[best];
      const z = sign ? ZOD[sign.sign] : undefined;
      const lines: Line[] = [];
      if (mers.length) lines.push({ k: "meridians", v: mers.join(" · "), c: CU });
      if (ch.length) lines.push({ k: "chakra", v: ch.join(", "), c: OX });
      if (hd.length) lines.push({ k: "hd center", v: hd.join(", "), c: AU });
      if (rule.length) lines.push({ k: "rulership", v: rule.join(" · "), c: AU });
      if (sign && z) lines.push({ k: "sign region", v: `${z.glyph} ${z.name} — ${sign.region}`, c: AU });
      if (ovs.length) lines.push({ k: "lived", v: ovs.join(" · "), c: VG });
      if (hom.length) lines.push({ k: "sensation", v: hom.join(" · "), c: OX });
      return { kind, title: r.name, sub: `center (${sgn(r.cx)}, ${sgn(r.cy)})${rs.length > 1 ? " · bilateral" : ""}`, lines };
    }
    case "meridian": {
      const m = MER.find((x) => x.id === sel.id);
      if (!m) return NOTHING;
      return {
        kind: "meridian · chinese medicine",
        title: `${m.name} (${m.ab})`,
        sub: `${m.pol} · ${m.post ? "posterior course, drawn dashed" : "anterior / lateral course"} · bilateral`,
        lines: [
          { k: "points", v: `${m.pts.length} schematic waypoints shown as acupoints (${m.ab} 1–${m.pts.length}); real point count differs`, c: CU },
          { k: "ink", v: m.pol === "yin" ? "verdigris" : "copper", c: m.pol === "yin" ? VG : CU },
        ],
      };
    }
    case "fascia": {
      const f = FASCIA.find((x) => x.id === sel.id);
      if (!f) return { kind: "fascia line · anatomy trains", title: "Anatomy Trains", sub: "myofascial meridians, schematic", lines: [] };
      const [rhyme, ...course] = f.note.split(" · ");
      return {
        kind: "fascia line · anatomy trains",
        title: `${f.name} (${f.ab})`,
        sub: f.face === "post" ? "runs on the back — drawn dashed on the anterior plate" : f.face === "lat" ? "runs down the side" : "runs on the front — drawn dashed on the posterior plate",
        lines: [
          { k: "rhymes with", v: `${rhyme ?? ""} meridian`, c: CU },
          { k: "course", v: course.join(" · "), c: OX },
          { k: "source", v: "Myers, Anatomy Trains — schematic waypoints, not a dissection", c: alpha(INK, 0.6) },
        ],
      };
    }
    case "reflex":
      return {
        kind: "reflex map",
        title: sel.id === "foot" ? "feet · plantar reflexology" : sel.id === "hand" ? "hands · palmar reflexology" : "ear · auricular map",
        sub: sel.id === "ear" ? "inverted body: head at the lobe, spine along the antihelix, organs in the concha, legs at the top" : "the body laid on the sole / palm: toes and fingers = head, ball = chest, arch = digestion, heel = pelvis; the inner edge is the spine. Right foot / hand = right side of the body.",
        lines: [{ k: "note", v: "these are traditional correspondence maps, drawn schematic; zone boundaries vary by school", c: alpha(INK, 0.6) }],
      };
    case "micro": {
      const [title, sub] = MICRO_TEXT[sel.id];
      return { kind: "microsystem", title, sub, lines: [] };
    }
    case "tooth": {
      const [m1, m2] = sel.pair.split(" · ");
      const mer = MER.filter((m) => m.ab === m1 || m.ab === m2);
      return {
        kind: "tooth · meridian tooth chart",
        title: `${QUADRANT_NAME[sel.q] ?? sel.q} ${TOOTH_NAMES[sel.i] ?? ""}`,
        sub: `quadrant ${sel.q}, tooth ${sel.i + 1} from the midline`,
        lines: [
          { k: "meridians", v: mer.map((m) => `${m.name} (${m.ab})`).join(" · "), c: CU },
          { k: "note", v: "biological-dentistry correspondence chart; a schematic, not a finding", c: alpha(INK, 0.6) },
        ],
      };
    }
    case "vessel":
      return { kind: "extraordinary vessel", title: sel.id === "du" ? "Du mai · governing" : "Ren mai · conception", sub: sel.id === "du" ? "posterior midline, perineum → spine → crown → upper lip" : "anterior midline, perineum → chin", lines: [] };
    case "nerve":
      return {
        kind: "nervous system",
        title: sel.id === "vagus" ? "vagus nerve" : sel.id === "brachial" ? "brachial plexus" : sel.id === "sciatic" ? "sciatic nerve" : sel.id,
        sub: sel.id === "vagus" ? "brainstem → throat → heart → gut · own line, not part of the autonomic cloud" : sel.id === "brachial" ? "neck roots → arm trunks → hand" : sel.id === "sciatic" ? "sacral roots → back of thigh → foot" : "",
        lines: [],
      };
    case "center": {
      const c = CHAKRAS.find((x) => x.id === sel.id);
      if (c) {
        const hd = HDC.filter((h) => Math.abs(h.y - c.y) < 0.1 && Math.abs(h.x) < 0.05).map((h) => h.name);
        return { kind: "center · disk", title: sel.id, sub: `${c.eng} · (0, ${sgn(c.y)}) · ${c.petals} petal ticks`, lines: hd.length ? [{ k: "hd nearby", v: `${hd.join(", ")} — separate system, offset, different stroke`, c: AU }] : [] };
      }
      const sub = sel.id === "dantien" ? "lower dantien · (0, +0.05) · verdigris dashed so it is not read as svadhisthana" : sel.id === "soul-star" ? "8th · (0, +1.28) · gold" : "(0, −1.28) · drops into the earth disc at y −1.4";
      return { kind: "center · disk", title: sel.id.replace("-", " "), sub, lines: [] };
    }
    case "hd": {
      const c = hdDisk(sel.id);
      const gs = GATES.filter((g) => g.center === sel.id).map((g) => String(g.n));
      const chans = hdChannelCounts()
        .filter(([a, b]) => a === sel.id || b === sel.id)
        .map(([a, b, n]) => `${hdDisk(a === sel.id ? b : a).name} ×${n}`);
      return { kind: "human design center", title: c.name, sub: `(${sgn(c.x)}, ${sgn(c.y)}) · geometric, not lotus`, lines: [{ k: "gates", v: gs.join(" · "), c: CU }, { k: "channels", v: chans.join(" · "), c: AU }] };
    }
    case "gate": {
      const g = gate(sel.id);
      const lon = gateStartDeg(g.n);
      const ring = CODON_RINGS.find((r) => r.gates.includes(g.n));
      const lines: Line[] = [{ k: "hd center", v: hdDisk(g.center).name, c: AU }];
      if (ring) lines.push({ k: "codon ring", v: `Ring of ${ring.name} — ${ring.gates.join(", ")}`, c: CU });
      return { kind: "gate · hexagram · gene key", title: `${String.fromCharCode(0x4dc0 + g.n - 1)}  gate.${g.n}  ${g.name}`, sub: `starts at ${(lon % 30).toFixed(1)}° ${zodiacSign(lon).name} · 5.625° wide`, lines };
    }
    case "planet": {
      const rule = RULE.filter((r) => r.planet === sel.id).map((r) => r.room);
      const p = PLANETS.find((x) => x.id === sel.id);
      return { kind: "planet · example position", title: p?.name ?? sel.id, sub: `${(sel.lon % 30).toFixed(0)}° ${zodiacSign(sel.lon).name} · illustrative, not an ephemeris`, lines: rule.length ? [{ k: "rules", v: rule.join(" · "), c: AU }] : [] };
    }
    case "field": {
      const subs: Record<FieldLayerId, string> = {
        polarity: "left / right split on the midline (+x = subject’s left) and an upper / lower split at mid-body. Chinese medicine: left–yang, right–yin for the body’s sides, though sources differ. Yogic: ida (lunar, receptive) on the left, pingala (solar, active) on the right. Kabbalah: with the Tree facing you, Jachin / mercy falls on the subject’s right and Boaz / severity on the left. Merkaba: upper tetrahedron masculine / sun, lower feminine / earth.",
        aura: "three dashed eggs, r 1.3 / 1.6 / 2.0 about (0, +0.05)",
        torus: "cross-section of the body’s toroidal field with the spine as its axis: five apple-shaped lobes each side, every one leaving the crown (0, +1) straight up and returning to the perineum (0, 0) straight from below, widest at x = ±0.6 / 1.0 / 1.45 / 1.9 / 2.4 — the outer one ≈ 1 m (“several feet”, HeartMath) at this scale. Flow drawn in at the crown, down the axis, out at the perineum and up around the outside — sources disagree on direction, so treat the chevrons as a convention.",
        merkaba: "hexagram, two triangles r 2.5, gold stroke, body visible through",
      };
      const titles: Record<FieldLayerId, string> = { aura: "aura · wei qi", torus: "torus field", polarity: "polarity", merkaba: "merkaba" };
      return { kind: "field", title: titles[sel.id], sub: subs[sel.id], lines: [] };
    }
  }
}

/** Meridian selection from a plate abbreviation (LU, LI, …). */
export const meridianSel = (ab: string): Sel | null => {
  const m = meridianByAb(ab);
  return m ? { kind: "meridian", id: m.id } : null;
};
