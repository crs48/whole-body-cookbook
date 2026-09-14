import type { Anchor, GateNumber, HdCenterId } from "./ids";

/**
 * 64 gates. One id family for Human Design gates, I Ching hexagrams, and
 * Gene Keys: `gate.N`. There is exactly one wheel; the codon rings in
 * `codon-rings.ts` are subsets of these numbers, not new geometry.
 *
 * `wheel` is the position on the Rave mandala counting counter-clockwise
 * from the gate that straddles 0° Aries (gate 25). Each gate spans 5.625°
 * of the ecliptic. Gate 25 begins at 358.25° (Pisces 28°15'), so
 *   longitudeStart(gate) = (358.25 + wheel * 5.625) mod 360.
 * Names are the short I Ching titles used on the plate (Wilhelm numbering).
 */
export interface Gate {
  n: GateNumber;
  name: string;
  center: HdCenterId;
  wheel: number;
}

const WHEEL_ORDER: readonly GateNumber[] = [
  25, 17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16, 35, 45, 12,
  15, 52, 39, 53, 62, 56, 31, 33, 7, 4, 29, 59, 40, 64, 47, 6,
  46, 18, 48, 57, 32, 50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11,
  10, 58, 38, 54, 61, 60, 41, 19, 13, 49, 30, 55, 37, 63, 22, 36,
];

const NAMES: Record<GateNumber, string> = {
  1: "Creative", 2: "Receptive", 3: "Difficulty at the Beginning", 4: "Youthful Folly",
  5: "Waiting", 6: "Conflict", 7: "The Army", 8: "Holding Together",
  9: "Small Taming", 10: "Treading", 11: "Peace", 12: "Standstill",
  13: "Fellowship", 14: "Great Possession", 15: "Modesty", 16: "Enthusiasm",
  17: "Following", 18: "Work on the Decayed", 19: "Approach", 20: "Contemplation",
  21: "Biting Through", 22: "Grace", 23: "Splitting Apart", 24: "Return",
  25: "Innocence", 26: "Great Taming", 27: "Nourishment", 28: "Great Exceeding",
  29: "The Abysmal", 30: "Clinging Fire", 31: "Influence", 32: "Duration",
  33: "Retreat", 34: "Great Power", 35: "Progress", 36: "Darkening of the Light",
  37: "The Family", 38: "Opposition", 39: "Obstruction", 40: "Deliverance",
  41: "Decrease", 42: "Increase", 43: "Breakthrough", 44: "Coming to Meet",
  45: "Gathering Together", 46: "Pushing Upward", 47: "Oppression", 48: "The Well",
  49: "Revolution", 50: "The Cauldron", 51: "The Arousing", 52: "Keeping Still",
  53: "Development", 54: "The Marrying Maiden", 55: "Abundance", 56: "The Wanderer",
  57: "The Gentle", 58: "The Joyous", 59: "Dispersion", 60: "Limitation",
  61: "Inner Truth", 62: "Small Exceeding", 63: "After Completion", 64: "Before Completion",
};

const CENTER_OF: Record<HdCenterId, GateNumber[]> = {
  head: [64, 61, 63],
  ajna: [47, 24, 4, 17, 11, 43],
  throat: [62, 23, 56, 35, 12, 45, 16, 20, 31, 8, 33],
  g: [7, 1, 13, 10, 25, 15, 46, 2],
  ego: [21, 40, 26, 51],
  sacral: [5, 14, 29, 59, 9, 3, 42, 27, 34],
  spleen: [48, 57, 44, 50, 32, 28, 18],
  "solar-plexus": [6, 37, 22, 36, 30, 55, 49],
  root: [53, 60, 52, 19, 39, 41, 58, 38, 54],
};

const centerOf = (n: GateNumber): HdCenterId => {
  for (const [c, gates] of Object.entries(CENTER_OF) as [HdCenterId, GateNumber[]][]) {
    if (gates.includes(n)) return c;
  }
  throw new Error(`gate ${n} has no center`);
};

export const GATES: readonly Gate[] = Array.from({ length: 64 }, (_, i) => {
  const n = i + 1;
  const name = NAMES[n];
  if (!name) throw new Error(`gate ${n} has no name`);
  return { n, name, center: centerOf(n), wheel: WHEEL_ORDER.indexOf(n) };
});

export const gate = (n: GateNumber): Gate => {
  const g = GATES[n - 1];
  if (!g) throw new Error(`gate ${n} out of range`);
  return g;
};

export const GATE_SPAN_DEG = 5.625;
export const GATE_25_START_DEG = 358.25;
/** The Rave year opens with gate 41 at 2° Aquarius (302°); same wheel, other anchor. */
export const GATE_41_START_DEG = 302;

/** Ecliptic longitude at the START of a gate's slice, in degrees [0, 360). */
export const gateStartDeg = (n: GateNumber): number => (GATE_25_START_DEG + gate(n).wheel * GATE_SPAN_DEG) % 360;

/** Ecliptic longitude at the centre of a gate's slice, in degrees. */
export const gateLongitude = (n: GateNumber): number =>
  (GATE_25_START_DEG + gate(n).wheel * GATE_SPAN_DEG + GATE_SPAN_DEG / 2) % 360;

/**
 * Nine Human Design centers as disks on the person. Positions are offsets
 * along landmark segments, so the same anchors work on a mesh.
 * Bodygraph convention: spleen on the viewer's left (subject's right, −X),
 * solar plexus on the viewer's right (+X). Ego sits with the physical heart.
 */
export interface HdCenter {
  id: HdCenterId;
  name: string;
  anchor: Anchor;
}

export const HD_CENTERS: readonly HdCenter[] = [
  { id: "head", name: "Head", anchor: { from: "glabella", to: "crown", t: 0.55 } },
  { id: "ajna", name: "Ajna", anchor: { at: "glabella" } },
  { id: "throat", name: "Throat", anchor: { at: "larynx" } },
  { id: "g", name: "G / identity", anchor: { from: "xiphoid", to: "sternal-notch", t: 0.5 } },
  { id: "ego", name: "Heart / ego", anchor: { at: "xiphoid", dx: 0.08, dy: 0.02 } },
  { id: "spleen", name: "Spleen", anchor: { at: "rib-r", dx: 0.03, dy: -0.1 } },
  { id: "solar-plexus", name: "Solar plexus", anchor: { at: "rib-l", dx: -0.03, dy: -0.1 } },
  { id: "sacral", name: "Sacral", anchor: { from: "pubic-symphysis", to: "navel", t: 0.5 } },
  { id: "root", name: "Root", anchor: { at: "perineum", dy: -0.03 } },
];

export const hdCenter = (id: HdCenterId): HdCenter => {
  const c = HD_CENTERS.find((x) => x.id === id);
  if (!c) throw new Error(`unknown HD center ${id}`);
  return c;
};

/** The 36 channels as gate pairs. A channel joins the two centers its gates live in. */
export const HD_CHANNELS: readonly [GateNumber, GateNumber][] = [
  [1, 8], [2, 14], [3, 60], [4, 63], [5, 15], [6, 59], [7, 31], [9, 52], [10, 20],
  [10, 34], [10, 57], [11, 56], [12, 22], [13, 33], [16, 48], [17, 62], [18, 58],
  [19, 49], [20, 34], [20, 57], [21, 45], [23, 43], [24, 61], [25, 51], [26, 44],
  [27, 50], [28, 38], [29, 46], [30, 41], [32, 54], [34, 57], [35, 36], [37, 40],
  [39, 55], [42, 53], [47, 64],
];

/** Channels touched by any gate in `gates`. */
export const channelsForGates = (gates: readonly GateNumber[]): [GateNumber, GateNumber][] =>
  HD_CHANNELS.filter(([a, b]) => gates.includes(a) || gates.includes(b));
