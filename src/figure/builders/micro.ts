import { AU, CU, INK, NV, OX, PAPER, VG, alpha as a } from "../../atlas/palette";
import { TEETH_LO, TEETH_UP, type Pt } from "../../atlas/plate";
import { polar } from "../geom";
import type { Prims, TextOpts } from "../prims";
import type { BuildCtx, Builder } from "./types";

const MO = { stroke: a(CU, 0.9), sw: 1, fill: a(CU, 0.05) };
const MZ = { stroke: a(CU, 0.6), sw: 0.6, dash: "3 3" };
const SP = { stroke: a(INK, 0.6), sw: 0.8, dash: "2 2" };

/** Inset zone label: only when zoomed close enough (or `always`). */
const ML = (L: Prims, c: BuildCtx, x: number, y: number, t: string, o: TextOpts & { always?: boolean; minScale?: number } = {}) => {
  const { always, minScale, ...rest } = o;
  if (!(always || c.pxScale >= (minScale ?? 1.15))) return;
  L.label(x, y, t, { k: 0.75, fill: a(INK, 0.85), free: true, ...rest });
};
const zoomHint = (L: Prims, c: BuildCtx, x: number, y: number) => {
  if (!c.detail) L.label(x, y, "zoom in for zones", { k: 0.7, fill: a(INK, 0.5) });
};
const place = (pts: readonly Pt[], cx: number, cy: number, m: number): Pt[] => pts.map(([x, y]) => [cx + x * m, cy + y]);

const reflex: Builder = (L, c) => {
  const { g } = c;
  const sole: Pt[] = [[-0.2, 0.45], [-0.18, 0.56], [-0.08, 0.58], [0, 0.55], [0.1, 0.5], [0.2, 0.42], [0.21, 0.1], [0.19, -0.2], [0.16, -0.45], [0.06, -0.58], [-0.08, -0.58], [-0.17, -0.45], [-0.19, -0.15], [-0.16, 0.15]];
  const fcy = -0.55;
  ([[3.12, 1, "right foot"], [3.68, -1, "left foot"]] as const).forEach(([cx, m, n]) => {
    const isL = m < 0;
    L.path(g.smooth(place(sole, cx, fcy, -m), true), { ...MO, click: c.pick({ kind: "reflex", id: "foot" }) });
    [0.36, 0.12, -0.15, -0.4].forEach((zy) => L.path(g.poly(place([[-0.19, zy], [0.2, zy]], cx, fcy, -m)), MZ));
    [-0.06, 0.03, 0.11, 0.17].forEach((tx) => L.path(g.poly(place([[tx, 0.4], [tx, 0.53]], cx, fcy, -m)), MZ));
    L.path(g.smooth(place([[-0.17, 0.4], [-0.19, 0.1], [-0.18, -0.2], [-0.14, -0.5]], cx, fcy, -m)), SP);
    L.label(cx, fcy + 0.45, "head · sinuses", { k: 0.62, fill: a(INK, 0.8) });
    L.label(cx, fcy + 0.24, isL ? "lungs · heart" : "lungs · chest", { k: 0.62, fill: a(INK, 0.8) });
    L.label(cx, fcy - 0.02, isL ? "stomach · spleen" : "liver · gallbladder", { k: 0.62, fill: a(INK, 0.8) });
    L.label(cx, fcy - 0.27, "kidney · colon", { k: 0.62, fill: a(INK, 0.8) });
    L.label(cx, fcy - 0.5, "pelvis · sciatic", { k: 0.62, fill: a(INK, 0.8) });
    L.label(cx, fcy - 0.7, n, { k: 0.7, fill: CU, sc: true });
  });
  L.label(3.4, fcy + 0.05, "spine", { k: 0.6, fill: a(INK, 0.7), rot: -90 });
  const palm: Pt[] = [[-0.17, -0.36], [0.15, -0.36], [0.2, -0.1], [0.19, 0.2], [0.05, 0.26], [-0.12, 0.24], [-0.2, 0.05]];
  const hcy = 0.6;
  ([[3.12, 1, "right hand"], [3.68, -1, "left hand"]] as const).forEach(([cx, m, n]) => {
    L.path(g.smooth(place(palm, cx, hcy, m), true), { ...MO, click: c.pick({ kind: "reflex", id: "hand" }) });
    ([[-0.13, 0.22, 0.52], [-0.045, 0.25, 0.62], [0.04, 0.25, 0.58], [0.13, 0.2, 0.46]] as const).forEach(([fx, y0, y1]) => L.path(g.smooth(place([[fx - 0.035, y0], [fx - 0.035, y1], [fx, y1 + 0.03], [fx + 0.035, y1], [fx + 0.035, y0]], cx, hcy, m), true), { ...MO, fill: "none" }));
    L.path(g.smooth(place([[-0.2, 0.02], [-0.28, 0.14], [-0.31, 0.24], [-0.26, 0.27], [-0.18, 0.16], [-0.15, 0.06]], cx, hcy, m), true), { ...MO, fill: "none" });
    [0.08, -0.12].forEach((zy) => L.path(g.poly(place([[-0.17, zy], [0.18, zy]], cx, hcy, m)), MZ));
    L.path(g.smooth(place([[-0.16, 0.22], [-0.19, 0.0], [-0.17, -0.3]], cx, hcy, m)), SP);
    L.label(cx, hcy + 0.38, "head", { k: 0.62, fill: a(INK, 0.8) });
    L.label(cx, hcy + 0.15, "chest", { k: 0.62, fill: a(INK, 0.8) });
    L.label(cx, hcy - 0.03, "digestion", { k: 0.62, fill: a(INK, 0.8) });
    L.label(cx, hcy - 0.25, "pelvis", { k: 0.62, fill: a(INK, 0.8) });
    L.label(cx, hcy - 0.5, n, { k: 0.7, fill: CU, sc: true });
  });
  const ear: Pt[] = [[0, 0.3], [0.12, 0.28], [0.2, 0.15], [0.2, 0], [0.15, -0.15], [0.08, -0.28], [0, -0.3], [-0.06, -0.25], [-0.08, -0.1], [-0.1, 0.1], [-0.05, 0.25]];
  const ecx = 3.4;
  const ecy = 1.6;
  L.path(g.smooth(place(ear, ecx, ecy, 1), true), { ...MO, click: c.pick({ kind: "reflex", id: "ear" }) });
  L.path(g.smooth(place([[0.03, 0.2], [0.11, 0.1], [0.11, -0.05], [0.05, -0.15]], ecx, ecy, 1)), SP);
  L.circle(ecx + 0.01, ecy - 0.01, 0.045, MZ);
  L.label(ecx + 0.25, ecy + 0.22, "feet · legs", { anchor: "start", k: 0.62, fill: a(INK, 0.8) });
  L.label(ecx + 0.25, ecy + 0.05, "spine", { anchor: "start", k: 0.62, fill: a(INK, 0.8) });
  L.label(ecx + 0.25, ecy - 0.1, "organs (concha)", { anchor: "start", k: 0.62, fill: a(INK, 0.8) });
  L.label(ecx + 0.25, ecy - 0.26, "head · face (lobe)", { anchor: "start", k: 0.62, fill: a(INK, 0.8) });
  L.label(ecx, ecy + 0.42, "ear · auricular", { k: 0.7, fill: CU, sc: true });
  L.label(3.4, 2.22, "reflex maps · the body mapped onto feet, hands, ears", { k: 0.8, fill: CU, sc: true });
  L.path(g.poly([[2.55, -1.3], [2.55, 2.3]]), { stroke: a(INK, 0.25), sw: 0.5, dash: "2 5" });
};

const faceMap: Builder = (L, c) => {
  const { g } = c;
  const cx = -3.4;
  const cy = 2.55;
  const click = c.pick({ kind: "micro", id: "face-map" });
  L.path(g.smooth([[cx, cy + 0.36], [cx + 0.22, cy + 0.28], [cx + 0.28, cy + 0.05], [cx + 0.2, cy - 0.22], [cx, cy - 0.36], [cx - 0.2, cy - 0.22], [cx - 0.28, cy + 0.05], [cx - 0.22, cy + 0.28]], true), { ...MO, click });
  [-1, 1].forEach((s) => L.ellipse(cx + s * 0.11, cy + 0.06, 0.05, 0.025, MZ));
  L.path(g.smooth([[cx - 0.02, cy + 0.06], [cx - 0.03, cy - 0.06], [cx, cy - 0.1], [cx + 0.03, cy - 0.06]]), MZ);
  L.path(g.poly([[cx - 0.07, cy - 0.2], [cx + 0.07, cy - 0.2]]), MZ);
  [0.17, -0.02, -0.14, -0.26].forEach((zy) => L.path(g.poly([[cx - 0.27, cy + zy], [cx + 0.27, cy + zy]]), { ...MZ, op: 0.6 }));
  ML(L, c, cx, cy + 0.27, "bladder · intestines");
  ML(L, c, cx, cy + 0.14, "liver (brows)");
  ML(L, c, cx, cy - 0.02, "heart · spleen");
  [-1, 1].forEach((s) => ML(L, c, cx + s * 0.2, cy - 0.11, "lungs"));
  ML(L, c, cx, cy - 0.16, "stomach (lips)");
  ML(L, c, cx, cy - 0.3, "kidneys · pelvis");
  L.label(cx, cy - 0.44, "face map · mien shiang", { k: 0.7, fill: CU, sc: true });
  zoomHint(L, c, cx, cy);
};

const tongueMap: Builder = (L, c) => {
  const { g } = c;
  const cx = -3.4;
  const cy = 1.7;
  const click = c.pick({ kind: "micro", id: "tongue-map" });
  L.path(g.smooth([[cx - 0.2, cy + 0.28], [cx + 0.2, cy + 0.28], [cx + 0.22, cy + 0.05], [cx + 0.15, cy - 0.2], [cx, cy - 0.3], [cx - 0.15, cy - 0.2], [cx - 0.22, cy + 0.05]], true), { ...MO, click });
  L.path(g.poly([[cx, cy + 0.24], [cx, cy - 0.24]]), { ...MZ, op: 0.5 });
  L.path(g.poly([[cx - 0.21, cy + 0.1], [cx + 0.21, cy + 0.1]]), MZ);
  L.path(g.poly([[cx - 0.19, cy - 0.1], [cx + 0.19, cy - 0.1]]), MZ);
  [-1, 1].forEach((s) => L.path(g.smooth([[cx + s * 0.14, cy + 0.1], [cx + s * 0.15, cy - 0.05], [cx + s * 0.1, cy - 0.18]]), MZ));
  ML(L, c, cx, cy + 0.19, "kidneys · bladder · intestines");
  ML(L, c, cx, cy + 0.0, "spleen · stomach");
  [-1, 1].forEach((s) => ML(L, c, cx + s * 0.27, cy - 0.02, "liver · GB", { anchor: s > 0 ? "start" : "end" }));
  ML(L, c, cx, cy - 0.15, "lungs");
  ML(L, c, cx, cy - 0.25, "heart (tip)");
  L.label(cx, cy - 0.4, "tongue · TCM zones", { k: 0.7, fill: CU, sc: true });
  zoomHint(L, c, cx, cy);
};

const irisMap: Builder = (L, c) => {
  const { g, fs, pxScale } = c;
  const click = c.pick({ kind: "micro", id: "iris-map" });
  const cx = -3.4;
  const r = 0.3;
  const RIGHT: [number, string][] = [[12, "brain · cerebrum"], [12.5, "pituitary"], [1, "forehead · sinus"], [1.5, "eye"], [2, "ear"], [2.5, "jaw · teeth"], [3, "throat · thyroid"], [3.5, "bronchi"], [4, "lung"], [4.5, "kidney (R)"], [5, "adrenal"], [5.5, "pelvis · uterus / prostate"], [6, "leg · foot"], [6.5, "lower back"], [7, "appendix · caecum"], [7.5, "gallbladder"], [8, "liver"], [8.5, "hand"], [9, "shoulder · arm"], [9.5, "breast"], [10, "neck (back)"], [10.5, "cerebellum"], [11, "medulla"], [11.5, "pineal"]];
  const LEFT: [number, string][] = [[12, "brain · cerebrum"], [11.5, "pituitary"], [11, "forehead · sinus"], [10.5, "eye"], [10, "ear"], [9.5, "jaw · teeth"], [9, "throat · thyroid"], [8.5, "bronchi"], [8, "lung"], [7.5, "kidney (L)"], [7, "adrenal"], [6.5, "pelvis · uterus / prostate"], [6, "leg · foot"], [5.5, "lower back"], [5, "sigmoid · rectum"], [4.5, "spleen"], [4, "pancreas"], [3.5, "hand"], [3, "shoulder · arm"], [2.5, "heart"], [2, "breast"], [1.5, "neck (back)"], [1, "cerebellum"], [0.5, "pineal"]];
  const span = Math.min(1.5, Math.max(1.0, ((fs * 1.15) / 100) * 11));
  const irisDetail = (span / 11) * pxScale * 100 >= 0.7 * fs * pxScale * 1.15;
  ([[0.1, "right iris · patient’s right eye", RIGHT], [-1.8, "left iris · patient’s left eye", LEFT]] as const).forEach(([cy, n, zones]) => {
    L.circle(cx, cy, r, { ...MO, click });
    L.circle(cx, cy, 0.085, { stroke: CU, sw: 0.8, fill: a(INK, 0.7) });
    L.circle(cx, cy, 0.14, MZ);
    L.circle(cx, cy, 0.25, { ...MZ, dash: "1 3" });
    for (let i = 0; i < 24; i++) {
      const d = i * 15;
      const p1 = polar(i % 2 ? 0.27 : 0.25, d, cx, cy);
      const p2 = polar(r, d, cx, cy);
      L.path(g.poly([p1, p2]), { stroke: a(CU, i % 2 ? 0.4 : 0.8), sw: 0.6 });
    }
    ML(L, c, cx, cy - 0.11, "stomach", { k: 0.5, fill: a(INK, 0.7) });
    ML(L, c, cx, cy - 0.175, "intestines", { k: 0.5, fill: a(INK, 0.7) });
    if (!irisDetail) zoomHint(L, c, cx, cy - 0.4);
    const right = zones.filter((z) => z[0] < 6 || z[0] === 12).sort((p, q) => (p[0] % 12) - (q[0] % 12));
    const left = zones.filter((z) => z[0] >= 6 && z[0] !== 12).sort((p, q) => p[0] - q[0]);
    const colY = (i: number, n2: number) => cy + span / 2 - (i / (n2 - 1)) * span;
    const draw = (list: [number, string][], side: 1 | -1) =>
      list.forEach(([h, t], i) => {
        const d = 90 - h * 30;
        const [zx, zy] = polar(0.2, d, cx, cy);
        const [ex, ey] = polar(r + 0.05, d, cx, cy);
        const ly = side > 0 ? colY(i, list.length) : colY(list.length - 1 - i, list.length);
        const lx = cx + side * 0.52;
        if (irisDetail) {
          L.path(g.poly([[zx, zy], [ex, ey], [lx - side * 0.03, ly]]), { stroke: a(CU, 0.5), sw: 0.5 });
          L.circle(zx, zy, 0.008, { stroke: "none", fill: CU });
        }
        ML(L, c, lx, ly, t, { k: 0.7, anchor: side > 0 ? "start" : "end", dy: fs * 0.22, always: irisDetail, minScale: 99 });
      });
    draw(right, 1);
    draw(left, -1);
    L.label(cx, Math.min(cy - 0.42, cy - span / 2 - 0.17), n, { k: 0.7, fill: CU, sc: true });
  });
  const ty = Math.max(0.6, 0.1 + span / 2 + 0.14);
  L.label(cx, ty, "iridology · iris clocks (disputed)", { k: 0.7, fill: CU, sc: true });
  ML(L, c, cx, ty, "leaders point to the exact zone · outer rim = skin, lymph · Jensen-type chart, schematic", { k: 0.6, fill: a(INK, 0.6), dy: -fs * 1.15 });
};

const PAIRC: Record<string, string> = { "KI · BL": VG, "LR · GB": OX, "LU · LI": CU, "ST · SP": AU, "HT · SI": NV };

const teethMap: Builder = (L, c) => {
  const { g } = c;
  const cx = -3.4;
  const cy = -3.35;
  const r = 0.32;
  const selT = c.sel?.kind === "tooth" ? c.sel.id : null;
  L.circle(cx, cy, r + 0.06, { stroke: a(CU, 0.35), sw: 0.6, dash: "2 4" });
  L.circle(cx, cy, r - 0.06, { stroke: a(CU, 0.35), sw: 0.6, dash: "2 4" });
  L.path(g.poly([[cx - r - 0.08, cy], [cx + r + 0.08, cy]]), MZ);
  L.path(g.poly([[cx, cy + r + 0.08], [cx, cy - r - 0.08]]), { ...MZ, op: 0.5 });
  const Q = [["UR", 90, 180, TEETH_UP], ["UL", 90, 0, TEETH_UP], ["LL", 270, 360, TEETH_LO], ["LR", 270, 180, TEETH_LO]] as const;
  Q.forEach(([q, a0, a1, map]) => {
    for (let i = 0; i < 8; i++) {
      const ang = a0 + (a1 - a0) * ((i + 0.5) / 8);
      const [x, y] = polar(r, ang, cx, cy);
      const id = `${q}${i + 1}`;
      const hi = selT === id;
      const pair = map[i] ?? "";
      const col = PAIRC[pair] ?? CU;
      L.circle(x, y, i >= 5 ? 0.032 : i >= 3 ? 0.024 : i === 2 ? 0.022 : 0.018, { stroke: hi ? INK : col, sw: hi ? 1.6 : 0.9, fill: hi ? a(col, 0.7) : a(col, 0.28), click: c.pick({ kind: "tooth", id, pair, q, i }) });
    }
  });
  ML(L, c, cx, cy + r + 0.12, "upper arch", { k: 0.55, fill: a(INK, 0.6) });
  ML(L, c, cx, cy - r - 0.14, "lower arch", { k: 0.55, fill: a(INK, 0.6) });
  ML(L, c, cx - r - 0.1, cy, "R", { k: 0.6, fill: a(INK, 0.6), anchor: "end" });
  ML(L, c, cx + r + 0.1, cy, "L", { k: 0.6, fill: a(INK, 0.6), anchor: "start" });
  Object.entries(PAIRC).forEach(([pair, col], i) => {
    const ly = cy + 0.14 - i * 0.07;
    L.circle(cx - 0.16, ly, 0.016, { stroke: col, sw: 0.8, fill: a(col, 0.35) });
    ML(L, c, cx - 0.12, ly, pair, { k: 0.55, anchor: "start", fill: a(INK, 0.85) });
  });
  L.label(cx, cy - r - 0.28, "teeth · meridian tooth chart", { k: 0.7, fill: CU, sc: true });
  zoomHint(L, c, cx, cy);
};

const hara: Builder = (L, c) => {
  const { g, fs } = c;
  const click = c.pick({ kind: "micro", id: "hara" });
  L.path(g.smooth([[-0.16, 0.36], [0, 0.4], [0.16, 0.36], [0.17, 0.1], [0.12, -0.02], [0, -0.03], [-0.12, -0.02], [-0.17, 0.1]], true), { stroke: a(CU, 0.7), sw: 0.7, dash: "4 3", fill: a(CU, 0.04), click });
  ([["HT", 0, 0.33], ["LU", 0.12, 0.32], ["LU", -0.12, 0.32], ["LR", -0.08, 0.27], ["ST", 0.06, 0.27], ["SP", 0.12, 0.23], ["GB", -0.13, 0.22], ["HC", -0.04, 0.17], ["TH", 0.04, 0.17], ["KI", 0.11, 0.14], ["KI", -0.11, 0.14], ["SI", 0, 0.08], ["LI", 0.09, 0.05], ["LI", -0.09, 0.05], ["BL", 0, -0.01]] as const).forEach(([t, x, y]) => {
    L.circle(x, y, 0.026, { stroke: a(CU, 0.8), sw: 0.7, fill: PAPER, click });
    L.text(x, y, t, { k: 0.55, fill: CU, roman: true, dy: fs * 0.2 });
  });
  L.label(0.22, 0.36, "hara · belly zones (Masunaga)", { anchor: "start", k: 0.8, fill: CU });
};

export const MICRO = { reflex, faceMap, tongueMap, irisMap, teethMap, hara } satisfies Record<string, Builder>;
