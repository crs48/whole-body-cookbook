/** The plate's ink. Same hexes as the Tailwind theme; used where SVG needs literal colour. */
export const INK = "#1c1612";
export const OX = "#7a2e2a";
export const CU = "#b56a3c";
export const VG = "#2f6b5a";
export const AU = "#c4a15a";
export const NV = "#6b4c9a";
export const PAPER = "#f3ead6";

/**
 * Ink at an alpha. Alphas ≥ .35 are strokes and labels and get lifted ×1.35
 * for legibility; lower alphas are washes and stay muted.
 */
export function alpha(hex: string, al: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const k = al >= 0.35 ? Math.min(1, al * 1.35) : al;
  return `rgba(${r},${g},${b},${+k.toFixed(3)})`;
}

export const LENS_COLOR: Record<string, string> = { body: VG, tradition: OX, evidence: INK, practice: CU, symbol: AU };
