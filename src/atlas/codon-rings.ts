import type { GateNumber } from "./ids";

/**
 * The 21 codon rings of the Gene Keys, as public structure only: each ring
 * is a set of gate numbers out of the same 64. Ring names are kept short;
 * no book commentary is reproduced. Toggle: `layer.sky.codon-rings`.
 *
 * Membership follows the published codon-ring tables (each ring groups the
 * gates that share an amino acid, with a start-codon and stop-codon ring).
 * Corrections welcome; the geometry does not change if a number moves.
 */
export interface CodonRing {
  id: string;
  name: string;
  gates: GateNumber[];
}

export const CODON_RINGS: readonly CodonRing[] = [
  { id: "alchemy", name: "Alchemy", gates: [6, 40, 47, 64] },
  { id: "destiny", name: "Destiny", gates: [34, 43] },
  { id: "divinity", name: "Divinity", gates: [22, 36, 37, 63] },
  { id: "fire", name: "Fire", gates: [1, 14] },
  { id: "gaia", name: "Gaia", gates: [19, 60, 61] },
  { id: "humanity", name: "Humanity", gates: [10, 17, 21, 25, 38, 51] },
  { id: "illuminati", name: "Illuminati", gates: [44, 50] },
  { id: "illusion", name: "Illusion", gates: [28, 32] },
  { id: "life-death", name: "Life & death", gates: [3, 20, 23, 24, 27, 42] },
  { id: "light", name: "Light", gates: [5, 9, 11, 26] },
  { id: "matter", name: "Matter", gates: [18, 46, 48, 57] },
  { id: "miracles", name: "Miracles", gates: [35] },
  { id: "no-return", name: "No return", gates: [31, 62] },
  { id: "origin", name: "Origin", gates: [41] },
  { id: "prosperity", name: "Prosperity", gates: [16, 45] },
  { id: "purification", name: "Purification", gates: [13, 30] },
  { id: "seeking", name: "Seeking", gates: [15, 39, 52, 53, 54, 58] },
  { id: "trials", name: "Trials", gates: [12, 33, 56] },
  { id: "union", name: "Union", gates: [4, 7, 29, 59] },
  { id: "water", name: "Water", gates: [2, 8] },
  { id: "whirlwind", name: "Whirlwind", gates: [49, 55] },
];

/** Rings lit when the codon layer first comes on. */
export const DEFAULT_RINGS: readonly string[] = ["fire", "life-death", "gaia", "humanity"];

export const codonRing = (id: string): CodonRing | undefined => CODON_RINGS.find((r) => r.id === id);

/** Sanity: every gate 1..64 appears in exactly one ring. */
export const codonRingsCoverAllGates = (): boolean => {
  const seen = new Map<number, number>();
  for (const r of CODON_RINGS) for (const g of r.gates) seen.set(g, (seen.get(g) ?? 0) + 1);
  if (seen.size !== 64) return false;
  for (const count of seen.values()) if (count !== 1) return false;
  return true;
};
