import { AU, OX, PAPER, VG, alpha as a } from "../../atlas/palette";
import { CHAKRAS, HDC, type HdShape, type Pt } from "../../atlas/plate";
import { polar } from "../geom";
import type { Click, Prims } from "../prims";
import type { BuildCtx, Builder } from "./types";

const chakraDisk = (L: Prims, c: BuildCtx, x: number, y: number, r: number, n: number, name: string, col: string, click: Click, sub?: string) => {
  L.circle(x, y, r, { stroke: col, sw: 1, fill: a(col, 0.08), click });
  L.circle(x, y, r * 0.35, { stroke: col, sw: 0.6, fill: "none" });
  for (let i = 0; i < n; i++) {
    const ang = (i * 360) / n;
    L.path(c.g.poly([polar(r, ang, x, y), polar(r + 0.012, ang, x, y)]), { stroke: col, sw: 0.6 });
  }
  L.label(x + r + 0.03, y, name, { anchor: "start", k: 0.8, fill: col });
  if (sub) L.label(x + r + 0.03, y - 0.035, sub, { anchor: "start", k: 0.65, fill: a(col, 0.8) });
};

const chakras: Builder = (L, c) => {
  CHAKRAS.forEach((ch) => chakraDisk(L, c, 0, ch.y, 0.042, ch.petals, ch.id, OX, c.pick({ kind: "center", id: ch.id })));
};
const soulStar: Builder = (L, c) => chakraDisk(L, c, 0, 1.28, 0.05, 12, "soul star · 8th", AU, c.pick({ kind: "center", id: "soul-star" }));
const earthStar: Builder = (L, c) => {
  chakraDisk(L, c, 0, -1.28, 0.05, 8, "earth star", VG, c.pick({ kind: "center", id: "earth-star" }));
  L.path(c.g.poly([[0, -1.0], [0, -1.23]]), { stroke: a(VG, 0.6), sw: 0.6, dash: "1 3" });
};
const chakras912: Builder = (L) => {
  [1.5, 1.72, 1.94, 2.16].forEach((y, i) => {
    L.circle(0, y, 0.03, { stroke: AU, sw: 0.8, fill: a(AU, 0.08), dash: "2 2" });
    L.label(0.06, y, `${9 + i}th`, { anchor: "start", k: 0.75, fill: AU });
  });
};

const shape = (c: BuildCtx, k: HdShape, x: number, y: number, s: number): string => {
  const P = (pts: Pt[]) => c.g.poly(pts, true);
  switch (k) {
    case "tri":
      return P([[x, y + s], [x + s * 0.9, y - s * 0.55], [x - s * 0.9, y - s * 0.55]]);
    case "tridown":
      return P([[x, y - s], [x + s * 0.9, y + s * 0.55], [x - s * 0.9, y + s * 0.55]]);
    case "trileft":
      return P([[x - s, y], [x + s * 0.55, y + s * 0.9], [x + s * 0.55, y - s * 0.9]]);
    case "triright":
      return P([[x + s, y], [x - s * 0.55, y + s * 0.9], [x - s * 0.55, y - s * 0.9]]);
    case "dia":
      return P([[x, y + s], [x + s, y], [x, y - s], [x - s, y]]);
    default:
      return P([[x - s, y - s], [x + s, y - s], [x + s, y + s], [x - s, y + s]]);
  }
};

const hdCenters: Builder = (L, c) => {
  HDC.forEach((h) => {
    const s = c.sel?.kind === "hd" && c.sel.id === h.id;
    L.path(shape(c, h.shape, h.x, h.y, 0.045), { stroke: AU, sw: s ? 1.6 : 1, fill: a(AU, s ? 0.3 : 0.1), click: c.pick({ kind: "hd", id: h.id }) });
    L.label(h.x + (h.x < 0 ? -0.06 : 0.06), h.y, h.name, { anchor: h.x < 0 ? "end" : "start", k: 0.75, fill: a(AU, 1), sc: true });
  });
};

const endoNodes: Builder = (L) => {
  ([[0, 0.86, "pituitary"], [0, 0.66, "thyroid"], [0, 0.55, "thymus"], [-0.08, 0.27, "adrenal"], [0.08, 0.27, "adrenal"], [0.04, 0.24, "pancreas"], [-0.05, 0, "gonad"], [0.05, 0, "gonad"]] as const).forEach(([x, y, n]) => {
    L.circle(x, y, 0.012, { stroke: AU, sw: 0.9, fill: AU });
    if (x >= 0) L.label(x + 0.03, y, n, { anchor: "start", k: 0.7, fill: AU });
  });
};

const dantien: Builder = (L, c) => {
  L.circle(0, 0.05, 0.055, { stroke: VG, sw: 1.1, fill: a(VG, 0.08), dash: "5 2", click: c.pick({ kind: "center", id: "dantien" }) });
  L.label(-0.08, 0.05, "lower dantien", { anchor: "end", k: 0.8, fill: VG });
  L.label(-0.08, 0.015, "(not svadhisthana)", { anchor: "end", k: 0.6, fill: a(VG, 0.8) });
};

export const CENTERS = { chakras, soulStar, earthStar, chakras912, hdCenters, endoNodes, dantien } satisfies Record<string, Builder>;
void PAPER;
