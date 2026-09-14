import { AU, CU, INK, NV, OX, PAPER, VG, alpha as a } from "../../atlas/palette";
import { FASCIA, MARMA, MER, hdChannelCounts, hdDisk, type Pt } from "../../atlas/plate";
import { both, polar } from "../geom";
import type { Builder } from "./types";

const meridians: Builder = (L, c) => {
  const { g } = c;
  const selM = c.sel?.kind === "meridian" ? c.sel.id : null;
  MER.forEach((m) => {
    const col = m.pol === "yin" ? VG : CU;
    const isS = selM === m.id;
    const dim = !!selM && !isS;
    const hidden = c.post ? !m.post : !!m.post;
    const click = c.pick({ kind: "meridian", id: m.id });
    both(m.pts).forEach((p) => {
      L.path(g.smooth(p), { stroke: col, sw: isS ? 1.8 : 0.9, dash: hidden ? "4 3" : undefined, op: dim ? 0.25 : hidden ? 0.7 : 1, click });
      L.path(g.smooth(p), { stroke: "rgba(0,0,0,0)", sw: 10, click });
    });
    const e = m.pts[Math.floor(m.pts.length / 2)];
    if (!dim && e) L.label(e[0], e[1], m.ab, { k: 0.7, fill: a(col, 1), dx: 6, anchor: "start", roman: true });
  });
};

const extra: Builder = (L, c) => {
  const { g } = c;
  const o = { stroke: a(VG, 0.75), sw: 0.8 };
  L.path(g.smooth([[0, 0], [0.02, 0.3], [0.015, 0.72], [0, 1], [0.0, 0.85]]), { ...o, dash: c.post ? undefined : "5 3", click: c.pick({ kind: "vessel", id: "du" }) });
  L.path(g.smooth([[0, 0], [0, 0.3], [0, 0.62], [0, 0.735]]), { ...o, dash: c.post ? "5 3" : undefined, click: c.pick({ kind: "vessel", id: "ren" }) });
  both([[0.005, 0.0], [0.035, 0.15], [0.035, 0.45], [0.01, 0.7]]).forEach((p) => L.path(g.smooth(p), { ...o, sw: 0.6, dash: "1 3" }));
  L.ellipse(0, 0.12, 0.165, 0.03, { ...o, dash: "2 2" });
  both([[0.05, -0.9], [0.08, -0.5], [0.12, 0.0], [0.16, 0.45], [0.06, 0.72], [0.03, 0.9]]).forEach((p) => L.path(g.smooth(p), { stroke: a(VG, 0.35), sw: 0.5 }));
  both([[0.09, -0.92], [0.15, -0.5], [0.19, 0.1], [0.2, 0.6], [0.1, 0.85]]).forEach((p) => L.path(g.smooth(p), { stroke: a(VG, 0.35), sw: 0.5, dash: "2 2" }));
  L.label(0.02, 0.77, "Ren ↓  Du ↑", { anchor: "start", k: 0.7, fill: a(VG, 1), roman: true });
  L.label(0.19, 0.12, "Dai", { anchor: "start", k: 0.7, fill: a(VG, 1), roman: true });
};

const fascia: Builder = (L, c) => {
  const { g } = c;
  const selF = c.sel?.kind === "fascia" ? c.sel.id : null;
  FASCIA.forEach((f) => {
    const isS = selF === f.id;
    const dim = !!selF && !isS;
    const hidden = f.face === "post" ? !c.post : f.face === "ant" ? c.post : false;
    const arm = f.ab.endsWith("AL");
    const click = c.pick({ kind: "fascia", id: f.id });
    both(f.pts).forEach((p) => {
      L.path(g.smooth(p), { stroke: OX, sw: isS ? 2 : arm ? 0.8 : 1.1, dash: hidden ? "5 3" : undefined, op: dim ? 0.2 : hidden ? 0.55 : arm ? 0.75 : 0.95, click });
      L.path(g.smooth(p), { stroke: "rgba(0,0,0,0)", sw: 10, click });
    });
    const e = f.pts[Math.floor(f.pts.length * 0.6)];
    if (!dim && e) L.label(e[0], e[1], f.ab, { k: 0.7, fill: OX, dx: -7, anchor: "end", roman: true });
  });
  L.label(-0.36, 0.98, "fascia lines · anatomy trains", { anchor: "end", k: 0.85, fill: OX, sc: true });
};

const acupoints: Builder = (L, c) => {
  if (c.sel?.kind !== "meridian") return;
  const id = c.sel.id;
  const m = MER.find((x) => x.id === id);
  if (!m) return;
  const col = m.pol === "yin" ? VG : CU;
  both(m.pts).forEach((p, side) =>
    p.forEach(([x, y], i) => {
      L.circle(x, y, 0.009, { stroke: col, sw: 0.8, fill: PAPER });
      if (side === 0) L.label(x, y, `${m.ab} ${i + 1}`, { k: 0.6, dx: 8, dy: -4, anchor: "start", fill: a(col, 1), roman: true });
    }),
  );
};

const sushumna: Builder = (L, c) => {
  L.path(c.g.poly([[0, 0], [0, 1]]), { stroke: AU, sw: 1.4 });
  L.label(0.02, 0.58, "sushumna", { anchor: "start", k: 0.75, fill: AU });
};

const idaPingala: Builder = (L, c) => {
  const { g } = c;
  const ys = [0, 0.08, 0.25, 0.42, 0.69, 0.9];
  const mkS = (sign: number): Pt[] => {
    const pts: Pt[] = [];
    for (let s = 0; s < ys.length - 1; s++) {
      const y0 = ys[s] ?? 0;
      const y1 = ys[s + 1] ?? 0;
      for (let k = 0; k < 8; k++) {
        const t = k / 8;
        pts.push([sign * (s % 2 ? -1 : 1) * 0.05 * Math.sin(Math.PI * t), y0 + (y1 - y0) * t]);
      }
    }
    pts.push([0, 0.9]);
    return pts;
  };
  L.path(g.smooth(mkS(1)), { stroke: VG, sw: 1 });
  L.path(g.smooth(mkS(-1)), { stroke: CU, sw: 1 });
  L.label(0.08, 0.05, "ida", { anchor: "start", k: 0.75, fill: VG });
  L.label(-0.08, 0.05, "pingala", { anchor: "end", k: 0.75, fill: CU });
};

const hdChannels: Builder = (L, c) => {
  const { g } = c;
  hdChannelCounts().forEach(([A, B, n]) => {
    const ca = hdDisk(A);
    const cb = hdDisk(B);
    const dx = cb.x - ca.x;
    const dy = cb.y - ca.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    for (let i = 0; i < n; i++) {
      const off = (i - (n - 1) / 2) * 0.014;
      L.path(g.poly([[ca.x + nx * off, ca.y + ny * off], [cb.x + nx * off, cb.y + ny * off]]), { stroke: a(AU, 0.9), sw: 0.8 });
    }
  });
};

const cns: Builder = (L, c) => {
  const { g } = c;
  const o = { stroke: a(NV, 0.85), sw: 0.9, fill: a(NV, 0.1 * c.organFade) };
  L.path(g.smooth([[-0.072, 0.86], [-0.06, 0.935], [0, 0.965], [0.06, 0.935], [0.072, 0.86], [0.045, 0.8], [-0.045, 0.8]], true), { ...o, click: c.pick({ kind: "room", id: "brain" }) });
  L.path(g.smooth([[-0.02, 0.9], [0.0, 0.85], [0.03, 0.92], [0.05, 0.86]]), { stroke: a(NV, 0.5), sw: 0.5 });
  L.path(g.smooth([[-0.06, 0.88], [-0.04, 0.83], [-0.01, 0.93]]), { stroke: a(NV, 0.5), sw: 0.5 });
  L.ellipse(0, 0.79, 0.03, 0.015, o);
  L.path(g.smooth([[0, 0.78], [0.004, 0.6], [-0.006, 0.45], [0.004, 0.3], [0, 0.14]]), { stroke: NV, sw: 1.4, click: c.pick({ kind: "room", id: "spine" }) });
  ([[0.02, 0.1], [-0.02, 0.1], [0.03, 0.05], [-0.03, 0.05]] as Pt[]).forEach((p) => L.path(g.poly([[0, 0.14], p]), { stroke: a(NV, 0.6), sw: 0.5 }));
  L.label(-0.14, 0.94, "brain · cord", { anchor: "end", fill: NV, k: 0.9 });
};

const autonomic: Builder = (L, c) => {
  const { g } = c;
  [-0.03, 0.03].forEach((x) => {
    L.path(g.poly([[x, 0.62], [x, 0.08]]), { stroke: a(NV, 0.6), sw: 0.6, dash: "2 2" });
    for (let y = 0.6; y > 0.08; y -= 0.045) L.circle(x, y, 0.006, { stroke: a(NV, 0.8), sw: 0.6, fill: a(NV, 0.3) });
  });
  ([[-0.05, 0.65], [0.05, 0.65], [-0.06, 0.03], [0.06, 0.03]] as Pt[]).forEach(([x, y]) => L.path(g.smooth([[0, y > 0.5 ? 0.72 : 0.06], [x * 0.6, y + 0.02], [x, y]]), { stroke: a(NV, 0.6), sw: 0.6 }));
  L.ellipse(0, 0.35, 0.11, 0.3, { stroke: "none", fill: a(NV, 0.06), filter: "url(#soft)" });
  L.label(-0.08, 0.35, "sympathetic chain", { anchor: "end", k: 0.8, fill: NV });
  L.label(0.09, 0.03, "sacral parasympathetic", { anchor: "start", k: 0.75, fill: NV });
};

const vagus: Builder = (L, c) => {
  const { g } = c;
  const p: Pt[] = [[0, 0.78], [-0.035, 0.72], [-0.03, 0.62], [0, 0.5], [0.02, 0.42], [0.04, 0.33], [0.05, 0.27], [0, 0.2], [-0.02, 0.14]];
  const click = c.pick({ kind: "nerve", id: "vagus" });
  L.path(g.smooth(p), { stroke: NV, sw: 1.3, click });
  L.path(g.smooth(p), { stroke: "rgba(0,0,0,0)", sw: 10, click });
  ([[0.02, 0.42], [0.05, 0.27], [-0.02, 0.14]] as Pt[]).forEach(([x, y]) => L.circle(x, y, 0.01, { stroke: NV, sw: 0.8, fill: PAPER }));
  L.label(-0.06, 0.7, "vagus", { anchor: "end", k: 0.85, fill: NV });
};

const enteric: Builder = (L, c) => {
  const { g } = c;
  const pts: Pt[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    pts.push([-0.09 + 0.18 * t + 0.01 * Math.sin(t * 40), 0.2 - 0.16 * t + 0.02 * Math.sin(t * 22)]);
  }
  L.path(g.smooth(pts), { stroke: a(NV, 0.75), sw: 0.7 });
  L.path(g.smooth([[-0.12, 0.06], [-0.13, 0.15], [-0.11, 0.23], [0, 0.245], [0.11, 0.23], [0.12, 0.14], [0.11, 0.05]]), { stroke: a(NV, 0.5), sw: 0.5, dash: "1 2" });
  L.label(0.15, 0.07, "enteric", { anchor: "start", k: 0.8, fill: NV });
};

const peripheral: Builder = (L, c) => {
  const { g } = c;
  const o = { stroke: a(NV, 0.8), sw: 0.7 };
  both([[0.04, 0.7], [0.12, 0.66], [0.2, 0.6]]).forEach((p) => L.path(g.smooth(p), o));
  both([[0.06, 0.64], [0.2, 0.6]]).forEach((p) => L.path(g.poly(p), o));
  both([[0.2, 0.6], [0.57, 0.47], [0.85, 0.35], [1, 0.3]]).forEach((p) => L.path(g.smooth(p), { ...o, click: c.pick({ kind: "nerve", id: "brachial" }) }));
  both([[0.2, 0.6], [0.57, 0.43], [0.85, 0.315], [0.985, 0.275]]).forEach((p) => L.path(g.smooth(p), { ...o, sw: 0.5 }));
  both([[0.2, 0.6], [0.57, 0.51], [0.86, 0.38], [0.99, 0.325]]).forEach((p) => L.path(g.smooth(p), { ...o, sw: 0.5 }));
  both([[0.03, 0.06], [0.1, -0.05], [0.11, -0.5]]).forEach((p) => L.path(g.smooth(p), { ...o, sw: 1, click: c.pick({ kind: "nerve", id: "sciatic" }) }));
  both([[0.11, -0.5], [0.09, -0.75], [0.07, -0.98]]).forEach((p) => L.path(g.smooth(p), o));
  both([[0.11, -0.5], [0.14, -0.7], [0.12, -0.98]]).forEach((p) => L.path(g.smooth(p), { ...o, sw: 0.5 }));
  L.label(0.3, 0.66, "brachial", { anchor: "start", k: 0.8, fill: NV });
  L.label(0.16, -0.4, "sciatic", { anchor: "start", k: 0.8, fill: NV });
};

const dermatomes: Builder = (L, c) => {
  const { g, fs } = c;
  const o = { stroke: a(NV, 0.65), sw: 0.6, clip: "url(#bodyClip)" };
  const lab = (x: number, y: number, t: string, an?: "start" | "middle" | "end") => L.text(x, y, t, { k: 0.6, fill: NV, roman: true, anchor: an ?? "middle", dy: fs * 0.2 });
  ([[0.7, "C3"], [0.58, "T2"], [0.48, "T4"], [0.38, "T6"], [0.3, "T8"], [0.12, "T10"], [0.03, "T12"], [-0.03, "L1"]] as const).forEach(([y, t]) => {
    L.path(g.poly([[-0.3, y], [0.3, y]]), o);
    lab(0.24, y, t, "start");
  });
  both([[0.24, 0.63], [0.6, 0.5], [0.87, 0.385], [1, 0.31]]).forEach((p) => L.path(g.smooth(p), o));
  both([[0.26, 0.57], [0.6, 0.45], [0.85, 0.345], [0.985, 0.275]]).forEach((p) => L.path(g.smooth(p), o));
  ([[0.42, 0.63, "C5"], [0.72, 0.47, "C6"], [1.03, 0.31, "C7"], [1.03, 0.26, "C8"], [0.72, 0.36, "T1"], [0.42, 0.47, "T2"]] as const).forEach(([x, y, t]) => [1, -1].forEach((s) => lab(s * x, y, t)));
  both([[0.07, -0.05], [0.1, -0.5], [0.08, -0.9]]).forEach((p) => L.path(g.smooth(p), o));
  both([[0.14, -0.1], [0.13, -0.5], [0.11, -0.9]]).forEach((p) => L.path(g.smooth(p), o));
  ([[0.1, -0.2, "L2"], [0.1, -0.45, "L3"], [0.04, -0.7, "L4"], [0.11, -0.7, "L5"], [0.17, -0.7, "S1"], [0.09, -1.06, "L5 · S1"]] as const).forEach(([x, y, t]) => [1, -1].forEach((s) => lab(s * x, y, t)));
  L.label(-0.36, 0.7, "dermatomes · anterior, schematic", { anchor: "end", k: 0.8, fill: NV });
};

const homunculus: Builder = (L, c) => {
  const { g } = c;
  const words = ["toes", "leg", "trunk", "arm", "hand", "face", "tongue"];
  words.forEach((w, i) => {
    const ang = 95 + i * 13;
    const [x, y] = polar(0.135, ang, 0, 0.87);
    L.text(x, y, w, { k: 0.55, fill: a(NV, 0.8), rot: -(ang - 90) });
    const p2 = polar(0.105, ang, 0, 0.87);
    const p3 = polar(0.12, ang, 0, 0.87);
    L.path(g.poly([p2, p3]), { stroke: a(NV, 0.6), sw: 0.5 });
  });
  L.path(g.smooth(Array.from({ length: 12 }, (_, i) => polar(0.11, 90 + i * 8, 0, 0.87))), { stroke: a(NV, 0.6), sw: 0.6, dash: "2 2" });
  L.label(-0.2, 0.98, "homunculus (noisy · off by default)", { anchor: "end", k: 0.75, fill: NV });
};

const srotas: Builder = (L, c) => {
  const { g } = c;
  const o = { stroke: a(CU, 0.7), sw: 0.6, dash: "3 2" };
  L.path(g.smooth([[0, 0.83], [0, 0.7], [-0.1, 0.5], [-0.12, 0.4]]), o);
  L.path(g.smooth([[0, 0.75], [0, 0.58], [0.06, 0.3], [0, 0.1], [0, 0.02]]), o);
  both([[0.02, 0.42], [0.2, 0.5], [0.57, 0.46], [0.93, 0.31]]).forEach((p) => L.path(g.smooth(p), { ...o, stroke: a(CU, 0.4) }));
  MARMA.forEach((m) => {
    [m.x, -m.x].forEach((xx, i) => {
      if (i === 1 && m.x === 0) return;
      L.circle(xx, m.y, 0.011, { stroke: CU, sw: 0.8, fill: a(CU, 0.25) });
    });
    L.label(m.x + 0.03, m.y, m.name, { anchor: "start", k: 0.65, fill: CU });
  });
};

const tibetan: Builder = (L, c) => {
  const { g } = c;
  L.path(g.poly([[0, 1.0], [0, 0.06]]), { stroke: a(AU, 0.9), sw: 1.1, dash: "6 3" });
  ([[1.0, "crown"], [0.69, "throat"], [0.42, "heart"], [0.12, "navel"], [0.02, "secret"]] as const).forEach(([y, n]) => {
    L.path(g.poly([[-0.012, y - 0.012], [0.012, y - 0.012], [0.012, y + 0.012], [-0.012, y + 0.012]], true), { stroke: AU, sw: 0.8 });
    L.label(-0.03, y, `${n} wheel`, { anchor: "end", k: 0.7, fill: AU });
  });
  L.circle(0, 0.42, 0.006, { stroke: AU, sw: 1, fill: AU });
  L.label(0.03, 0.42, "indestructible drop", { anchor: "start", k: 0.7, fill: AU });
};

export const CHANNELS = { meridians, extra, fascia, acupoints, sushumna, idaPingala, hdChannels, cns, autonomic, vagus, enteric, peripheral, dermatomes, homunculus, srotas, tibetan } satisfies Record<string, Builder>;
void INK;
