import { AU, CU, INK, NV, OX, PAPER, VG, alpha as a } from "../../atlas/palette";
import { MEDASTRO, PLANETS, ROOMS, RULE, ZOD } from "../../atlas/plate";
import { GATES, GATE_SPAN_DEG, gateStartDeg } from "../../atlas/gates";
import { CODON_RINGS } from "../../atlas/codon-rings";
import { polar } from "../geom";
import type { Builder } from "./types";

/** Ecliptic longitude → plate angle: Aries at the left, counter-clockwise. */
const scr = (lon: number): number => 180 - lon;

const earthDisc: Builder = (L, c) => {
  const { g, flip } = c;
  L.ellipse(0, -1.4, 2.2, 0.32, { stroke: VG, sw: 1, fill: a(VG, 0.08) });
  L.path(`M${g.pt(-1.9, -1.55)}A190 190 0 0 ${flip > 0 ? 0 : 1} ${g.pt(1.9, -1.55)}`, { stroke: a(VG, 0.7), sw: 0.9 });
  L.circle(0, -3.3, 1.9, { stroke: a(VG, 0.5), sw: 0.8, dash: "6 4", fill: a(VG, 0.04) });
  L.path(g.poly([[0, -1.28], [0, -1.6]]), { stroke: VG, sw: 0.8, dash: "1 3" });
  L.circle(0, -1.6, 0.03, { stroke: VG, sw: 0.8, fill: a(VG, 0.3) });
  L.label(2.28, -1.4, "earth disc · y −1.4", { anchor: "start", k: 0.85, fill: VG });
  L.label(0, -3.3, "earth", { k: 1, fill: a(VG, 0.7), sc: true });
};

const ley: Builder = (L, c) => {
  const { g } = c;
  L.ellipse(0, -1.4, 1.4, 0.2, { stroke: a(VG, 0.6), sw: 0.6, dash: "2 3" });
  L.path(g.poly([[-2.2, -1.4], [2.2, -1.4]]), { stroke: a(VG, 0.5), sw: 0.5, dash: "1 4" });
  [-1.4, -0.7, 0.7, 1.4].forEach((x) => L.path(g.poly([[x, -1.72], [x, -1.08]]), { stroke: a(VG, 0.4), sw: 0.5, dash: "1 4" }));
  L.label(-1.5, -1.75, "ley / grid circle", { anchor: "end", k: 0.8, fill: VG });
};

const zodiac: Builder = (L, c) => {
  const { g, fs } = c;
  L.circle(0, 0, 5.2, { stroke: a(AU, 0.9), sw: 0.9 });
  L.circle(0, 0, 6, { stroke: a(AU, 0.9), sw: 0.9 });
  ZOD.forEach((z, k) => {
    const l0 = k * 30;
    L.path(g.poly([polar(5.2, scr(l0)), polar(6, scr(l0))]), { stroke: a(AU, 0.8), sw: 0.7 });
    const [gx, gy] = polar(5.6, scr(l0 + 15));
    L.text(gx, gy, z.glyph, { k: 1.4, fill: INK, roman: true, dy: fs * 0.5 });
    const [nx, ny] = polar(6.28, scr(l0 + 15));
    L.text(nx, ny, z.name, { k: 0.75, fill: a(INK, 0.7), sc: true, dy: fs * 0.3 });
  });
  L.label(-6.3, -6.4, "Aries at left · counterclockwise · ecliptic longitude → angle", { anchor: "start", k: 0.8, fill: a(INK, 0.6) });
};

const medAstro: Builder = (L, c) => {
  const { g, fs } = c;
  MEDASTRO.forEach((m) => {
    const z = ZOD[m.sign];
    if (!z) return;
    const side = m.sign % 2 ? 1 : -1;
    L.path(g.poly([[0, m.y], [side * 0.3, m.y]]), { stroke: a(AU, 0.6), sw: 0.6, dash: "1 3" });
    L.text(side * 0.33, m.y, `${z.glyph}  ${m.region}`, { anchor: side > 0 ? "start" : "end", k: 0.8, fill: INK, dy: fs * 0.3 });
  });
  L.label(-0.5, 1.1, "signs on the body · Aries head → Pisces feet", { anchor: "end", k: 0.85, fill: AU, sc: true });
};

const planets: Builder = (L, c) => {
  const { fs } = c;
  PLANETS.forEach((p) => {
    const [x, y] = polar(4.9, scr(p.lon));
    L.circle(x, y, 0.14, { stroke: a(AU, 0.8), sw: 0.7, fill: PAPER, click: c.pick({ kind: "planet", id: p.id, lon: p.lon }) });
    L.text(x, y, p.glyph, { k: 1.1, fill: INK, roman: true, dy: fs * 0.4 });
  });
  L.label(6.3, 6.4, "planets · example positions, not a chart", { anchor: "end", k: 0.8, fill: a(INK, 0.6) });
};

const rulerships: Builder = (L, c) => {
  const { g, fs } = c;
  RULE.forEach((ru) => {
    if (ru.room === "skin") {
      L.path(g.silhouetteD, { stroke: AU, sw: 1.5, fill: "none", op: 0.5 });
      L.label(0.24, -0.7, "♄ skin · bones", { anchor: "start", k: 0.8, fill: AU });
      return;
    }
    const r = ROOMS.find((x) => x.id === ru.room);
    if (!r) return;
    L.ellipse(r.cx, r.cy, r.rx, r.ry, { rot: r.rot, stroke: "none", fill: a(AU, 0.18) });
    L.text(r.cx + (r.cx < 0 ? -r.rx - 0.02 : r.rx + 0.02), r.cy, `${ru.glyph} ${ru.name}`, { anchor: r.cx < 0 ? "end" : "start", k: 0.75, fill: INK, dy: fs * 0.3 });
  });
};

const gates: Builder = (L, c) => {
  const { g, fs } = c;
  const selG = c.sel?.kind === "gate" ? c.sel.id : null;
  L.circle(0, 0, 4.3, { stroke: a(CU, 0.8), sw: 0.8 });
  L.circle(0, 0, 4.6, { stroke: a(CU, 0.8), sw: 0.8 });
  GATES.forEach((gt) => {
    const l0 = gateStartDeg(gt.n);
    const a1 = scr(l0);
    const am = scr(l0 + GATE_SPAN_DEG / 2);
    const hi = selG === gt.n;
    L.path(g.poly([polar(4.3, a1), polar(4.6, a1)]), { stroke: a(CU, 0.7), sw: 0.6 });
    L.path(g.poly([polar(4.3, scr(l0)), polar(4.6, scr(l0)), polar(4.6, scr(l0 + GATE_SPAN_DEG)), polar(4.3, scr(l0 + GATE_SPAN_DEG))], true), { stroke: "none", fill: hi ? a(CU, 0.35) : "rgba(0,0,0,0)", click: c.pick({ kind: "gate", id: gt.n }) });
    const [tx, ty] = polar(4.1, am);
    L.text(tx, ty, String(gt.n), { k: 0.62, fill: hi ? OX : a(INK, 0.75), roman: true, dy: fs * 0.22 });
    const [hx, hy] = polar(4.45, am);
    L.text(hx, hy, String.fromCharCode(0x4dc0 + gt.n - 1), { k: 0.7, fill: a(INK, 0.85), roman: true, dy: fs * 0.25 });
  });
  L.label(0, 4.75, "64 gates · I Ching hexagrams · Gene Keys — one wheel", { k: 0.8, fill: CU, sc: true });
};

const codon: Builder = (L, c) => {
  const { g, fs } = c;
  const cols = [OX, VG, CU, NV, AU];
  CODON_RINGS.forEach((ring, ri) => {
    if (!c.rings.has(ring.id)) return;
    const col = cols[ri % 5] ?? CU;
    const pts = ring.gates.map((n) => polar(4.0, scr(gateStartDeg(n) + GATE_SPAN_DEG / 2)));
    ring.gates.forEach((n) => {
      const l0 = gateStartDeg(n);
      L.path(g.poly([polar(4.3, scr(l0)), polar(4.6, scr(l0)), polar(4.6, scr(l0 + GATE_SPAN_DEG)), polar(4.3, scr(l0 + GATE_SPAN_DEG))], true), { stroke: col, sw: 0.8, fill: a(col, 0.28) });
    });
    const p0 = pts[0];
    if (!p0) return;
    if (pts.length > 1) {
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) L.path(g.poly([pts[i] ?? p0, pts[j] ?? p0]), { stroke: a(col, 0.55), sw: 0.7 });
    } else L.circle(p0[0], p0[1], 0.1, { stroke: col, sw: 0.8 });
    pts.forEach((p) => L.circle(p[0], p[1], 0.05, { stroke: col, sw: 0.7, fill: col }));
    const cen = pts.reduce<[number, number]>((s, p) => [s[0] + p[0] / pts.length, s[1] + p[1] / pts.length], [0, 0]);
    const cl = Math.hypot(cen[0], cen[1]) || 1;
    const lp: [number, number] = pts.length > 1 ? [(cen[0] / cl) * 3.6, (cen[1] / cl) * 3.6] : [p0[0] * 0.88, p0[1] * 0.88];
    L.text(lp[0], lp[1], `ring of ${ring.name.toLowerCase()}`, { k: 0.72, fill: col, dy: fs * 0.25 });
  });
};

const trigrams: Builder = (L, c) => {
  const { fs } = c;
  ([["☰", "heaven", 90], ["☱", "lake", 135], ["☲", "fire", 180], ["☳", "thunder", 225], ["☷", "earth", 270], ["☶", "mountain", 315], ["☵", "water", 0], ["☴", "wind", 45]] as const).forEach(([gl, n, d]) => {
    const [x, y] = polar(6.75, d);
    L.text(x, y, gl, { k: 1.2, fill: INK, roman: true, dy: fs * 0.4 });
    L.text(x, y - 0.32, n, { k: 0.7, fill: a(INK, 0.65), sc: true });
  });
  L.label(6.3, -6.4, "eight houses · Earlier Heaven order · provisional", { anchor: "end", k: 0.8, fill: a(INK, 0.6) });
};

export const SKY = { earthDisc, ley, zodiac, medAstro, planets, rulerships, gates, codon, trigrams } satisfies Record<string, Builder>;
