import { AU, CU, INK, NV, OX, PAPER, VG, alpha as a } from "../../atlas/palette";
import { HOMEO, TREE, TREE_E } from "../../atlas/plate";
import { polar } from "../geom";
import type { Builder } from "./types";

const polarity: Builder = (L, c) => {
  const { g, fs } = c;
  const clk = c.pick({ kind: "field", id: "polarity" });
  L.rect(0, -1.1, 1.15, 2.45, { stroke: "none", fill: a(VG, 0.05), click: clk });
  L.rect(-1.15, -1.1, 1.15, 2.45, { stroke: "none", fill: a(CU, 0.05), click: clk });
  L.path(g.poly([[0, -1.1], [0, 1.35]]), { stroke: a(INK, 0.7), sw: 0.8, dash: "8 4", click: clk });
  L.path(g.poly([[-1.15, 0.5], [1.15, 0.5]]), { stroke: a(INK, 0.4), sw: 0.6, dash: "2 4" });
  const rows = [["yin", "yang", "chinese medicine"], ["ida · lunar", "pingala · solar", "yogic"], ["feminine · receptive", "masculine · active", "esoteric"], ["Boaz · severity", "Jachin · mercy", "kabbalah"]] as const;
  const step = (fs * 2.2) / 100;
  const cxL = 1.75;
  const cxR = -1.75;
  const y0 = 0.5 - (fs * 2.4) / 100;
  rows.forEach(([lft, rgt, src], i) => {
    const y = y0 - i * step;
    L.text(cxL, y, lft, { k: 0.85, fill: VG });
    L.text(cxL, y, src, { k: 0.62, fill: a(INK, 0.55), dy: fs * 1.05 });
    L.text(cxR, y, rgt, { k: 0.85, fill: CU });
    L.text(cxR, y, src, { k: 0.62, fill: a(INK, 0.55), dy: fs * 1.05 });
  });
  L.text(cxL, 0.5, "left side · +x", { k: 0.62, fill: a(INK, 0.6), sc: true, dy: -fs * 0.35 });
  L.text(cxR, 0.5, "right side · −x", { k: 0.62, fill: a(INK, 0.6), sc: true, dy: -fs * 0.35 });
  L.text(0, -1.1, "heaven · upper ▲", { k: 0.62, fill: a(INK, 0.6), dy: -fs * 0.4, dx: -fs * 3.2 });
  L.text(0, -1.1, "▼ earth · lower", { k: 0.62, fill: a(INK, 0.6), dy: -fs * 0.4, dx: fs * 3.2 });
};

const aura: Builder = (L, c) => {
  ([[1.3, 1.45, "4 4", "wei qi · etheric"], [1.6, 1.78, "2 5", "emotional"], [2.0, 2.2, "1 6", "mental"]] as const).forEach(([rx, ry, dash, n], i) => {
    L.ellipse(0, 0.05, rx, ry, { stroke: a(VG, 0.8 - i * 0.15), sw: 0.9, dash, click: c.pick({ kind: "field", id: "aura" }) });
    L.label(0.04, 0.05 + ry + 0.04, n, { anchor: "start", k: 0.8, fill: VG });
  });
};

const torus: Builder = (L, c) => {
  const { g } = c;
  const top = 1;
  const bot = 0;
  const mid = (top + bot) / 2;
  const click = c.pick({ kind: "field", id: "torus" });
  [0.6, 1.0, 1.45, 1.9, 2.4].forEach((Xk, k) => {
    const op = 0.95 - 0.13 * k;
    const h = 1.9 * Xk + 0.2;
    const h2 = 1.0 * Xk;
    [1, -1].forEach((s) => {
      const x = s * Xk;
      const d = `M${g.pt(0, top)}C${g.pt(0, top + h)} ${g.pt(x, mid + h2)} ${g.pt(x, mid)}C${g.pt(x, mid - h2)} ${g.pt(0, bot - h)} ${g.pt(0, bot)}`;
      L.path(d, { stroke: a(CU, op), sw: 0.9, click });
      const cc = 0.035 + 0.01 * k;
      L.path(g.poly([[x - cc, mid - cc * 1.4], [x, mid + cc * 0.2], [x + cc, mid - cc * 1.4]]), { stroke: a(CU, op), sw: 0.9 });
    });
  });
  L.path(g.poly([[0, top], [0, bot]]), { stroke: CU, sw: 1.2, dash: "6 3" });
  [0.85, 0.62, 0.38, 0.15].forEach((y) => L.path(g.poly([[-0.035, y + 0.05], [0, y], [0.035, y + 0.05]]), { stroke: CU, sw: 1 }));
  [top, bot].forEach((y) => {
    L.circle(0, y, 0.03, { stroke: CU, sw: 1, fill: PAPER });
    L.circle(0, y, 0.01, { stroke: CU, sw: 0.8, fill: CU });
  });
  L.label(0, -1.5, "torus field · crown → perineum · spine as axis", { k: 0.8, fill: CU });
  L.label(-0.07, 1.06, "in at the crown", { anchor: "end", k: 0.75, fill: a(CU, 0.9) });
  L.label(-0.22, -0.09, "out at the perineum", { anchor: "end", k: 0.75, fill: a(CU, 0.9) });
};

const merkaba: Builder = (L, c) => {
  const { g } = c;
  const r = 2.5;
  const cy = 0.05;
  const click = c.pick({ kind: "field", id: "merkaba" });
  L.path(g.poly([90, 210, 330].map((d) => polar(r, d, 0, cy)), true), { stroke: AU, sw: 1.1, click });
  L.path(g.poly([270, 30, 150].map((d) => polar(r, d, 0, cy)), true), { stroke: AU, sw: 1.1, click });
  L.label(0.05, cy + r + 0.08, "merkaba · r 2.5", { anchor: "start", k: 0.85, fill: AU });
};

const weather: Builder = (L) => {
  ([[0.02, 0.42, 0.22, 0.16], [0, 0.14, 0.2, 0.16], [0, 0.86, 0.16, 0.14]] as const).forEach(([x, y, rx, ry]) => L.ellipse(x, y, rx, ry, { stroke: "none", fill: a(NV, 0.13), filter: "url(#soft)" }));
  L.label(0.3, 0.28, "autonomic weather", { anchor: "start", k: 0.85, fill: NV });
};

const dosha: Builder = (L, c) => {
  ([[0.36, 1.05, "kapha", VG], [0.1, 0.36, "pitta", OX], [-1.05, 0.1, "vata", CU]] as const).forEach(([ya, yb, n, col]) => {
    L.rect(-1.1, ya, 2.2, yb - ya, { stroke: "none", fill: a(col, 0.12) });
    L.path(c.g.poly([[-0.32, yb], [0.32, yb]]), { stroke: a(col, 0.6), sw: 0.6, dash: "3 3" });
    L.label(0.34, (ya + yb) / 2, n, { anchor: "start", k: 0.9, fill: col });
  });
};

const humoral: Builder = (L, c) => {
  const { g } = c;
  L.rect(-1.1, -1.1, 2.2, 2.2, { stroke: "none", fill: a(OX, 0.05) });
  L.path(g.poly([[-1.05, 0], [1.05, 0]]), { stroke: a(OX, 0.5), sw: 0.6, dash: "2 4" });
  L.path(g.poly([[0, -1.05], [0, 1.05]]), { stroke: a(OX, 0.5), sw: 0.6, dash: "2 4" });
  L.label(0, 1.12, "hot", { k: 0.8, fill: OX, sc: true });
  L.label(0, -1.12, "cold", { k: 0.8, fill: OX, sc: true });
  L.label(-1.08, 0.0, "dry", { anchor: "end", k: 0.8, fill: OX, sc: true });
  L.label(1.08, 0.0, "moist", { anchor: "start", k: 0.8, fill: OX, sc: true });
  L.label(0.55, 0.55, "sanguine", { k: 0.85, fill: a(OX, 0.8) });
  L.label(-0.55, 0.55, "choleric", { k: 0.85, fill: a(OX, 0.8) });
  L.label(0.55, -0.55, "phlegmatic", { k: 0.85, fill: a(OX, 0.8) });
  L.label(-0.55, -0.55, "melancholic", { k: 0.85, fill: a(OX, 0.8) });
};

const tree: Builder = (L, c) => {
  const { g, fs } = c;
  TREE_E.forEach(([i, j]) => {
    const p = TREE[i];
    const q = TREE[j];
    if (p && q) L.path(g.poly([[p.x, p.y], [q.x, q.y]]), { stroke: a(AU, 0.7), sw: 0.7 });
  });
  TREE.forEach((t) => {
    L.circle(t.x, t.y, 0.07, { stroke: AU, sw: 1, fill: PAPER });
    L.text(t.x, t.y, t.name, { k: 0.62, fill: a(INK, 0.85), dy: fs * 0.2 });
  });
  L.label(0.5, 1.06, "tree on the body", { anchor: "start", k: 0.85, fill: AU, sc: true });
};

const homeopathy: Builder = (L, c) => {
  const { g } = c;
  HOMEO.forEach((h) => {
    const lx = 0.36;
    const ly = h.y + 0.04;
    L.path(g.poly([[h.x, h.y], [lx - 0.02, ly]]), { stroke: a(OX, 0.6), sw: 0.6 });
    L.circle(h.x, h.y, 0.008, { stroke: OX, sw: 0.8, fill: OX });
    L.text(lx, ly, `“${h.words}”`, { anchor: "start", k: 0.8, fill: OX });
    L.text(lx, ly - 0.035, `${h.room} · sensation`, { anchor: "start", k: 0.6, fill: a(INK, 0.55), sc: true });
  });
};

export const FIELD = { polarity, aura, torus, merkaba, weather, dosha, humoral, tree, homeopathy } satisfies Record<string, Builder>;
