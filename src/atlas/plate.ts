/**
 * Plate geometry from the "Body Atlas" design. Everything is in body units:
 * origin at the perineum, crown +1, soles −1, +x the subject's left. Points
 * are [x, y]. Bilateral things are given for +x and mirrored when drawn.
 */
import type { ChakraId, FasciaId, HdCenterId, MeridianId, PlanetId, RegionId } from "./ids";
import { HD_CHANNELS, gate } from "./gates";

export type Pt = readonly [number, number];

export const mir = (pts: readonly Pt[]): Pt[] => pts.map(([x, y]) => [-x, y]);

/* ---------- silhouette (+x half, mirrored) ---------- */
export const SIL_R: readonly Pt[] = [
  [0, 1], [0.055, 0.985], [0.085, 0.92], [0.088, 0.85], [0.075, 0.79], [0.052, 0.75], [0.06, 0.72], [0.065, 0.69], [0.14, 0.675], [0.22, 0.665],
  [0.28, 0.65], [0.45, 0.595], [0.622, 0.53], [0.735, 0.475], [0.845, 0.412], [0.95, 0.352], [1, 0.3], [0.965, 0.262], [0.9, 0.262], [0.815, 0.335],
  [0.7, 0.383], [0.578, 0.43], [0.45, 0.495], [0.3, 0.55], [0.215, 0.54], [0.2, 0.45], [0.165, 0.3], [0.155, 0.18], [0.17, 0.06], [0.19, -0.03],
  [0.195, -0.15], [0.175, -0.35], [0.15, -0.5], [0.15, -0.65], [0.125, -0.8], [0.09, -0.92], [0.105, -0.97], [0.14, -1], [0.03, -1], [0.03, -0.92],
  [0.045, -0.75], [0.045, -0.5], [0.04, -0.3], [0.03, -0.12], [0.015, -0.02],
];
export const SIL: readonly Pt[] = [...SIL_R, [0, 0], ...mir(SIL_R.slice(1)).reverse()];

/* ---------- registration landmarks ---------- */
export const PLATE_LANDMARKS: readonly { name: string; x: number; y: number }[] = [
  { name: "perineum · origin", x: 0, y: 0 },
  { name: "crown / vertex", x: 0, y: 1 },
  { name: "soles · K1", x: 0, y: -1 },
  { name: "navel", x: 0, y: 0.12 },
  { name: "heart · anahata", x: 0, y: 0.42 },
  { name: "sternal notch", x: 0, y: 0.62 },
  { name: "mid-patella", x: 0.1, y: -0.5 },
  { name: "soul star · 8th", x: 0, y: 1.28 },
  { name: "earth star", x: 0, y: -1.28 },
  { name: "fingertip (subject’s left)", x: 1, y: 0.3 },
  { name: "fingertip (subject’s right)", x: -1, y: 0.3 },
];

/* ---------- rooms (pin targets) ---------- */
export interface Room {
  id: RegionId;
  name: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rot?: number;
}
const room = (id: RegionId, name: string, cx: number, cy: number, rx: number, ry: number, rot?: number): Room =>
  rot === undefined ? { id, name, cx, cy, rx, ry } : { id, name, cx, cy, rx, ry, rot };
export const ROOMS: readonly Room[] = [
  room("crown", "crown", 0, 0.985, 0.055, 0.035), room("brain", "brain", 0, 0.88, 0.08, 0.085), room("face", "face", 0, 0.79, 0.07, 0.045), room("throat", "throat", 0, 0.69, 0.045, 0.04),
  room("heart", "heart", 0.03, 0.42, 0.075, 0.065), room("lungs", "lungs", 0, 0.5, 0.19, 0.11), room("solar-plexus", "solar plexus", 0, 0.31, 0.06, 0.035), room("stomach", "stomach", 0.07, 0.27, 0.06, 0.04),
  room("liver", "liver", -0.1, 0.3, 0.085, 0.05), room("spleen", "spleen", 0.15, 0.29, 0.035, 0.03), room("intestines", "intestines", 0, 0.12, 0.13, 0.1), room("kidneys", "kidneys", 0, 0.2, 0.13, 0.05),
  room("spine", "spine", 0, 0.36, 0.03, 0.36), room("pelvis", "pelvis", 0, 0.03, 0.17, 0.06),
  room("left-arm", "left arm", 0.58, 0.47, 0.36, 0.065, 23.5), room("right-arm", "right arm", -0.58, 0.47, 0.36, 0.065, -23.5),
  room("hands", "hands", 0.93, 0.31, 0.075, 0.05, 23.5), room("hands", "hands", -0.93, 0.31, 0.075, 0.05, -23.5),
  room("left-leg", "left leg", 0.1, -0.5, 0.08, 0.42), room("right-leg", "right leg", -0.1, -0.5, 0.08, 0.42),
  room("feet", "feet", 0.085, -0.96, 0.075, 0.045), room("feet", "feet", -0.085, -0.96, 0.075, 0.045),
  room("autonomic", "autonomic", -0.055, 0.6, 0.02, 0.02), room("whole", "whole", 0, 1.09, 0.02, 0.02),
];

/* ---------- meridians (+x waypoints, mirrored) ---------- */
export interface MeridianPath {
  ab: string;
  id: MeridianId;
  name: string;
  pol: "yin" | "yang";
  pts: readonly Pt[];
  /** Runs on the back; drawn dashed on the anterior plate. */
  post?: true;
}
export const MER: readonly MeridianPath[] = [
  { ab: "LU", id: "lung", name: "lung", pol: "yin", pts: [[0.17, 0.53], [0.25, 0.6], [0.42, 0.56], [0.57, 0.5], [0.72, 0.44], [0.86, 0.385], [0.99, 0.325]] },
  { ab: "LI", id: "large-intestine", name: "large intestine", pol: "yang", pts: [[0.985, 0.285], [0.86, 0.37], [0.72, 0.43], [0.58, 0.485], [0.4, 0.575], [0.23, 0.66], [0.09, 0.7], [0.06, 0.78], [-0.015, 0.835]] },
  { ab: "ST", id: "stomach", name: "stomach", pol: "yang", pts: [[0.045, 0.86], [0.075, 0.78], [0.06, 0.7], [0.11, 0.6], [0.11, 0.48], [0.07, 0.3], [0.06, 0.14], [0.1, 0], [0.11, -0.25], [0.1, -0.5], [0.09, -0.75], [0.07, -0.93], [0.06, -1]] },
  { ab: "SP", id: "spleen", name: "spleen", pol: "yin", pts: [[0.035, -0.99], [0.04, -0.9], [0.06, -0.7], [0.07, -0.5], [0.085, -0.25], [0.11, -0.03], [0.14, 0.2], [0.175, 0.45], [0.2, 0.52], [0.19, 0.43]] },
  { ab: "HT", id: "heart", name: "heart", pol: "yin", pts: [[0.2, 0.53], [0.4, 0.5], [0.57, 0.435], [0.72, 0.375], [0.85, 0.32], [0.985, 0.275]] },
  { ab: "SI", id: "small-intestine", name: "small intestine", pol: "yang", pts: [[0.985, 0.27], [0.85, 0.325], [0.72, 0.385], [0.58, 0.445], [0.4, 0.53], [0.23, 0.6], [0.1, 0.7], [0.09, 0.8], [0.11, 0.87]] },
  { ab: "BL", id: "bladder", name: "bladder", pol: "yang", pts: [[0.02, 0.9], [0.03, 0.97], [0, 1], [0.03, 0.72], [0.04, 0.5], [0.04, 0.25], [0.035, 0.05], [0.08, -0.1], [0.1, -0.5], [0.1, -0.75], [0.085, -0.92], [0.135, -0.99]], post: true },
  { ab: "KI", id: "kidney", name: "kidney", pol: "yin", pts: [[0.05, -0.985], [0.05, -0.9], [0.06, -0.7], [0.07, -0.5], [0.065, -0.25], [0.03, 0], [0.025, 0.2], [0.04, 0.45], [0.06, 0.6]] },
  { ab: "PC", id: "pericardium", name: "pericardium", pol: "yin", pts: [[0.12, 0.48], [0.4, 0.52], [0.57, 0.465], [0.72, 0.405], [0.855, 0.35], [1, 0.3]] },
  { ab: "TW", id: "triple-warmer", name: "triple warmer", pol: "yang", pts: [[0.985, 0.29], [0.86, 0.355], [0.72, 0.415], [0.58, 0.465], [0.4, 0.55], [0.22, 0.64], [0.1, 0.73], [0.125, 0.85], [0.08, 0.905]], post: true },
  { ab: "GB", id: "gallbladder", name: "gallbladder", pol: "yang", pts: [[0.07, 0.9], [0.12, 0.94], [0.1, 0.8], [0.1, 0.7], [0.2, 0.64], [0.19, 0.4], [0.17, 0.15], [0.2, -0.02], [0.17, -0.25], [0.15, -0.5], [0.14, -0.75], [0.09, -0.92], [0.115, -1]] },
  { ab: "LR", id: "liver", name: "liver", pol: "yin", pts: [[0.045, -0.99], [0.05, -0.9], [0.07, -0.7], [0.08, -0.5], [0.09, -0.25], [0.1, -0.02], [0.14, 0.25], [0.12, 0.42]] },
];
export const meridianByAb = (ab: string): MeridianPath | undefined => MER.find((m) => m.ab === ab);

/* ---------- fascia lines (Anatomy Trains, schematic) ---------- */
export interface FasciaLine {
  id: FasciaId;
  ab: string;
  name: string;
  face: "ant" | "post" | "lat";
  pts: readonly Pt[];
  /** "rhymes-with meridian · course". */
  note: string;
}
export const FASCIA: readonly FasciaLine[] = [
  { id: "sfl", ab: "SFL", name: "superficial front line", face: "ant", pts: [[0.08, -1], [0.09, -0.9], [0.1, -0.7], [0.1, -0.5], [0.1, -0.25], [0.09, -0.02], [0.06, 0.2], [0.05, 0.45], [0.03, 0.62], [0.05, 0.72], [0.08, 0.82], [0.06, 0.93]], note: "stomach (ST) · toes → shin → quads → rectus abdominis → sternum → SCM → skull" },
  { id: "sbl", ab: "SBL", name: "superficial back line", face: "post", pts: [[0.08, -0.99], [0.07, -0.92], [0.1, -0.7], [0.1, -0.5], [0.09, -0.25], [0.04, 0.02], [0.03, 0.3], [0.03, 0.6], [0.02, 0.75], [0.04, 0.9], [0.03, 1], [0.02, 0.94]], note: "bladder (BL) · sole → calf → hamstrings → sacrum → erectors → scalp" },
  { id: "ll", ab: "LL", name: "lateral line", face: "lat", pts: [[0.13, -0.99], [0.09, -0.92], [0.14, -0.7], [0.15, -0.5], [0.17, -0.25], [0.19, -0.02], [0.16, 0.2], [0.19, 0.45], [0.17, 0.55], [0.1, 0.7], [0.09, 0.85]], note: "gallbladder (GB) · outer foot → peroneals → IT band → obliques → intercostals → neck" },
  { id: "spl", ab: "SPL", name: "spiral line", face: "ant", pts: [[-0.06, 0.9], [-0.1, 0.72], [0.2, 0.63], [0.15, 0.45], [-0.17, 0.05], [-0.16, -0.25], [-0.14, -0.5], [-0.1, -0.75], [-0.05, -1], [-0.1, -0.9]], note: "crosses the midline twice · skull → opposite shoulder → across the belly → opposite hip → outer leg → under the arch" },
  { id: "dfl", ab: "DFL", name: "deep front line", face: "ant", pts: [[0.04, -0.99], [0.05, -0.9], [0.06, -0.7], [0.07, -0.5], [0.06, -0.25], [0.02, 0], [0.03, 0.15], [0.02, 0.35], [0.02, 0.42], [0.01, 0.6], [0.02, 0.7], [0.03, 0.77]], note: "kidney / liver / spleen (KI · LR · SP) · inner arch → inner leg → pelvic floor → psoas → diaphragm → pericardium → throat → jaw" },
  { id: "sfal", ab: "SFAL", name: "superficial front arm line", face: "ant", pts: [[0.1, 0.5], [0.22, 0.57], [0.58, 0.47], [0.84, 0.36], [1, 0.3]], note: "pericardium (PC) · pecs → biceps → palm" },
  { id: "dfal", ab: "DFAL", name: "deep front arm line", face: "ant", pts: [[0.12, 0.55], [0.24, 0.6], [0.58, 0.5], [0.85, 0.39], [0.99, 0.325]], note: "lung (LU) · pec minor → biceps → thumb" },
  { id: "sbal", ab: "SBAL", name: "superficial back arm line", face: "post", pts: [[0.05, 0.7], [0.22, 0.66], [0.6, 0.52], [0.85, 0.41], [0.985, 0.29]], note: "triple warmer (TW) · trapezius → deltoid → back of hand" },
  { id: "dbal", ab: "DBAL", name: "deep back arm line", face: "post", pts: [[0.04, 0.6], [0.2, 0.62], [0.58, 0.44], [0.82, 0.34], [0.985, 0.27]], note: "small intestine / heart (SI · HT) · rhomboids → rotator cuff → little finger" },
];

/* ---------- centers ---------- */
export interface ChakraDisk {
  id: ChakraId;
  eng: string;
  y: number;
  petals: number;
}
export const CHAKRAS: readonly ChakraDisk[] = [
  { id: "muladhara", eng: "root", y: 0, petals: 4 },
  { id: "svadhisthana", eng: "sacral", y: 0.08, petals: 6 },
  { id: "manipura", eng: "solar plexus", y: 0.25, petals: 10 },
  { id: "anahata", eng: "heart", y: 0.42, petals: 12 },
  { id: "vishuddha", eng: "throat", y: 0.69, petals: 16 },
  { id: "ajna", eng: "brow", y: 0.9, petals: 2 },
  { id: "sahasrara", eng: "crown", y: 1.02, petals: 32 },
];

export type HdShape = "tri" | "tridown" | "sq" | "dia" | "trileft" | "triright";
export interface HdDisk {
  id: HdCenterId;
  name: string;
  x: number;
  y: number;
  shape: HdShape;
}
export const HDC: readonly HdDisk[] = [
  { id: "head", name: "Head", x: 0, y: 0.955, shape: "tri" },
  { id: "ajna", name: "Ajna", x: 0, y: 0.84, shape: "tridown" },
  { id: "throat", name: "Throat", x: 0, y: 0.66, shape: "sq" },
  { id: "g", name: "G", x: 0, y: 0.5, shape: "dia" },
  { id: "ego", name: "Heart / Ego", x: 0.1, y: 0.4, shape: "tri" },
  { id: "spleen", name: "Spleen", x: -0.17, y: 0.2, shape: "trileft" },
  { id: "solar-plexus", name: "Solar Plexus", x: 0.17, y: 0.2, shape: "triright" },
  { id: "sacral", name: "Sacral", x: 0, y: 0.16, shape: "sq" },
  { id: "root", name: "Root", x: 0, y: -0.06, shape: "sq" },
];
export const hdDisk = (id: HdCenterId): HdDisk => {
  const d = HDC.find((h) => h.id === id);
  if (!d) throw new Error(`unknown HD center ${id}`);
  return d;
};

/** Channels between centers as [a, b, count], derived from the 36 channels. */
export function hdChannelCounts(): [HdCenterId, HdCenterId, number][] {
  const m = new Map<string, [HdCenterId, HdCenterId, number]>();
  for (const [ga, gb] of HD_CHANNELS) {
    const a = gate(ga).center;
    const b = gate(gb).center;
    if (a === b) continue;
    const key = [a, b].sort().join("|");
    const cur = m.get(key);
    if (cur) cur[2]++;
    else m.set(key, [a, b, 1]);
  }
  return [...m.values()];
}

/* ---------- sky ---------- */
const V = "︎"; // text presentation, never emoji
export const ZOD: readonly { name: string; glyph: string }[] = [
  { name: "Aries", glyph: `♈${V}` }, { name: "Taurus", glyph: `♉${V}` }, { name: "Gemini", glyph: `♊${V}` }, { name: "Cancer", glyph: `♋${V}` },
  { name: "Leo", glyph: `♌${V}` }, { name: "Virgo", glyph: `♍${V}` }, { name: "Libra", glyph: `♎${V}` }, { name: "Scorpio", glyph: `♏${V}` },
  { name: "Sagittarius", glyph: `♐${V}` }, { name: "Capricorn", glyph: `♑${V}` }, { name: "Aquarius", glyph: `♒${V}` }, { name: "Pisces", glyph: `♓${V}` },
];
export const zodiacSign = (lon: number): { name: string; glyph: string } => {
  const z = ZOD[Math.floor((((lon % 360) + 360) % 360) / 30)];
  if (!z) throw new Error("bad longitude");
  return z;
};

/** Example positions only. No ephemeris. */
export interface Planet {
  id: PlanetId;
  name: string;
  glyph: string;
  lon: number;
}
export const PLANETS: readonly Planet[] = [
  { id: "sun", name: "Sun", glyph: `☉${V}`, lon: 170 },
  { id: "moon", name: "Moon", glyph: `☽${V}`, lon: 96 },
  { id: "mercury", name: "Mercury", glyph: `☿${V}`, lon: 188 },
  { id: "venus", name: "Venus", glyph: `♀${V}`, lon: 212 },
  { id: "mars", name: "Mars", glyph: `♂${V}`, lon: 222 },
  { id: "jupiter", name: "Jupiter", glyph: `♃${V}`, lon: 128 },
  { id: "saturn", name: "Saturn", glyph: `♄${V}`, lon: 4 },
];

/** Melothesia: sign index → body region label and y on the plate. */
export const MEDASTRO: readonly { sign: number; region: string; y: number }[] = [
  { sign: 0, region: "head", y: 0.88 }, { sign: 1, region: "throat, neck", y: 0.69 }, { sign: 2, region: "arms, lungs", y: 0.56 }, { sign: 3, region: "chest, stomach", y: 0.35 },
  { sign: 4, region: "heart, spine", y: 0.44 }, { sign: 5, region: "intestines", y: 0.14 }, { sign: 6, region: "kidneys, lower back", y: 0.21 }, { sign: 7, region: "pelvis, genitals", y: 0.0 },
  { sign: 8, region: "thighs", y: -0.25 }, { sign: 9, region: "knees", y: -0.5 }, { sign: 10, region: "shins, ankles", y: -0.78 }, { sign: 11, region: "feet", y: -0.97 },
];

/** Planetary rulerships of rooms (folk). */
export const RULE: readonly { planet: PlanetId; name: string; glyph: string; room: RegionId }[] = [
  { planet: "sun", name: "Sun", glyph: `☉${V}`, room: "heart" },
  { planet: "moon", name: "Moon", glyph: `☽${V}`, room: "stomach" },
  { planet: "mercury", name: "Mercury", glyph: `☿${V}`, room: "lungs" },
  { planet: "mercury", name: "Mercury", glyph: `☿${V}`, room: "hands" },
  { planet: "venus", name: "Venus", glyph: `♀${V}`, room: "kidneys" },
  { planet: "venus", name: "Venus", glyph: `♀${V}`, room: "throat" },
  { planet: "mars", name: "Mars", glyph: `♂${V}`, room: "face" },
  { planet: "jupiter", name: "Jupiter", glyph: `♃${V}`, room: "liver" },
  { planet: "saturn", name: "Saturn", glyph: `♄${V}`, room: "spine" },
  { planet: "saturn", name: "Saturn", glyph: `♄${V}`, room: "skin" },
];

/* ---------- lived overlays, homeopathy, tree, marma, teeth ---------- */
export const OVERLAY_IDS = ["ovMobility", "ovDysauto", "ovIntero", "ovVoice"] as const;
export type OverlayId = (typeof OVERLAY_IDS)[number];
export const OVERLAYS: Record<OverlayId, { name: string; rooms: RegionId[] }> = {
  ovMobility: { name: "mobility / aids", rooms: ["pelvis", "left-leg", "right-leg", "feet", "spine", "hands"] },
  ovDysauto: { name: "dysautonomia · standing problem", rooms: ["heart", "feet", "left-leg", "right-leg", "brain"] },
  ovIntero: { name: "interoception / sensory gain", rooms: ["intestines", "stomach", "face", "skin"] },
  ovVoice: { name: "voice / masking", rooms: ["throat", "face"] },
};

export const HOMEO: readonly { room: RegionId; x: number; y: number; words: string }[] = [
  { room: "heart", x: 0.03, y: 0.42, words: "bursting · worse lying left" },
  { room: "intestines", x: 0, y: 0.12, words: "better for pressure" },
  { room: "skin", x: 0.19, y: -0.1, words: "burning · worse for warmth" },
];

export const TREE: readonly { name: string; x: number; y: number }[] = [
  { name: "Kether", x: 0, y: 1.06 }, { name: "Chokmah", x: -0.42, y: 0.82 }, { name: "Binah", x: 0.42, y: 0.82 }, { name: "Chesed", x: -0.42, y: 0.46 }, { name: "Geburah", x: 0.42, y: 0.46 },
  { name: "Tiphareth", x: 0, y: 0.42 }, { name: "Netzach", x: -0.42, y: 0.1 }, { name: "Hod", x: 0.42, y: 0.1 }, { name: "Yesod", x: 0, y: -0.06 }, { name: "Malkuth", x: 0, y: -1.02 },
];
export const TREE_E: readonly [number, number][] = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [3, 6], [4, 7], [5, 6], [5, 7], [6, 7], [6, 8], [7, 8], [5, 8], [8, 9], [0, 5]];

export const MARMA: readonly { name: string; x: number; y: number }[] = [
  { name: "adhipati", x: 0, y: 1 }, { name: "sthapani", x: 0, y: 0.9 }, { name: "nila", x: 0.03, y: 0.68 }, { name: "hridaya", x: 0, y: 0.42 }, { name: "nabhi", x: 0, y: 0.12 }, { name: "basti", x: 0, y: 0.05 },
  { name: "guda", x: 0, y: 0 }, { name: "talahridaya", x: 0.93, y: 0.31 }, { name: "kurpara", x: 0.57, y: 0.48 }, { name: "janu", x: 0.1, y: -0.5 }, { name: "gulpha", x: 0.06, y: -0.9 }, { name: "talahridaya (sole)", x: 0.08, y: -0.98 },
];

/** Meridian tooth chart per quadrant, from the midline: incisors, canine, premolars, molars, wisdom. */
export const TEETH_UP: readonly string[] = ["KI · BL", "KI · BL", "LR · GB", "LU · LI", "LU · LI", "ST · SP", "ST · SP", "HT · SI"];
export const TEETH_LO: readonly string[] = ["KI · BL", "KI · BL", "LR · GB", "ST · SP", "ST · SP", "LU · LI", "LU · LI", "HT · SI"];
export const TOOTH_NAMES: readonly string[] = ["central incisor", "lateral incisor", "canine", "first premolar", "second premolar", "first molar", "second molar", "third molar (wisdom)"];
export const QUADRANT_NAME: Record<string, string> = { UR: "upper right", UL: "upper left", LL: "lower left", LR: "lower right" };
