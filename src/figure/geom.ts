/**
 * Body units → SVG user units. One body unit = 100 user units; Y is flipped
 * once here. `flip` is +1 on the anterior plate and −1 on the posterior
 * plate (viewer's left = subject's left).
 */
import type { Pt } from "../atlas/plate";
import { SIL } from "../atlas/plate";

export type Flip = 1 | -1;
export const U = 100;

export interface Geom {
  flip: Flip;
  X: (x: number) => number;
  Y: (y: number) => number;
  pt: (x: number, y: number) => string;
  poly: (pts: readonly Pt[], close?: boolean) => string;
  smooth: (pts: readonly Pt[], closed?: boolean) => string;
  circPath: (cx: number, cy: number, r: number) => string;
  silhouetteD: string;
}

const cache = new Map<Flip, Geom>();

export function makeGeom(flip: Flip): Geom {
  const hit = cache.get(flip);
  if (hit) return hit;
  const X = (x: number): number => Math.round(x * flip * U * 10) / 10;
  const Y = (y: number): number => Math.round(-y * U * 10) / 10;
  const pt = (x: number, y: number): string => `${X(x)} ${Y(y)}`;
  const poly = (pts: readonly Pt[], close = false): string => `M${pts.map((p) => pt(p[0], p[1])).join("L")}${close ? "Z" : ""}`;
  const smooth = (pts: readonly Pt[], closed = false): string => {
    const n = pts.length;
    if (n < 2) return "";
    const g = (i: number): Pt => {
      const p = closed ? pts[((i % n) + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
      if (!p) throw new Error("bad index");
      return p;
    };
    const p00 = g(0);
    let d = `M${pt(p00[0], p00[1])}`;
    const m = closed ? n : n - 1;
    for (let i = 0; i < m; i++) {
      const p0 = g(i - 1);
      const p1 = g(i);
      const p2 = g(i + 1);
      const p3 = g(i + 2);
      const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${pt(c1[0], c1[1])} ${pt(c2[0], c2[1])} ${pt(p2[0], p2[1])}`;
    }
    return closed ? `${d}Z` : d;
  };
  const circPath = (cx: number, cy: number, r: number): string =>
    `M${pt(cx + r, cy)}A${r * U} ${r * U} 0 1 0 ${pt(cx - r, cy)}A${r * U} ${r * U} 0 1 0 ${pt(cx + r, cy)}`;
  const g: Geom = { flip, X, Y, pt, poly, smooth, circPath, silhouetteD: smooth(SIL, true) };
  cache.set(flip, g);
  return g;
}

export const rad = (d: number): number => (d * Math.PI) / 180;
export const polar = (r: number, deg: number, cx = 0, cy = 0): Pt => [cx + r * Math.cos(rad(deg)), cy + r * Math.sin(rad(deg))];
export const both = (pts: readonly Pt[]): [readonly Pt[], Pt[]] => [pts, pts.map(([x, y]) => [-x, y])];
