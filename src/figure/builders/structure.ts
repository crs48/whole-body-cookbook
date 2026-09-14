import { AU, CU, INK, NV, OX, PAPER, VG, alpha as a } from "../../atlas/palette";
import { OVERLAYS, ROOMS, type OverlayId } from "../../atlas/plate";
import type { Pt } from "../../atlas/plate";
import { both } from "../geom";
import type { Builder } from "./types";

const skin: Builder = (L, c) => {
  const { g } = c;
  L.path(g.silhouetteD, { stroke: INK, sw: 1.3, fill: c.viewW > 5 ? a(INK, 0.06) : a(INK, 0.025), click: c.pick({ kind: "room", id: "skin" }) });
  if (c.post) {
    L.path(g.smooth([[-0.085, 0.86], [-0.06, 0.79], [0, 0.77], [0.06, 0.79], [0.085, 0.86]]), { stroke: a(INK, 0.5), sw: 0.7 });
    L.label(0, 1.12, "posterior view", { k: 0.8, fill: a(INK, 0.7), sc: true });
  }
};

const skeleton: Builder = (L, c) => {
  const { g } = c;
  const o = { stroke: a(INK, 0.7), sw: 0.8 };
  L.ellipse(0, 0.88, 0.078, 0.1, o);
  L.path(g.smooth([[-0.065, 0.8], [-0.045, 0.755], [0, 0.745], [0.045, 0.755], [0.065, 0.8]]), o);
  L.path(g.smooth([[0, 0.735], [0.005, 0.6], [-0.008, 0.45], [0.006, 0.3], [0, 0.15], [-0.01, 0.05]]), { ...o, sw: 1.6 });
  for (let y = 0.7; y > 0.06; y -= 0.03) L.path(g.poly([[-0.015, y], [0.015, y]]), { ...o, sw: 0.6 });
  both([[0, 0.62], [0.1, 0.645], [0.2, 0.655]]).forEach((p) => L.path(g.smooth(p), o));
  for (let i = 0; i < 7; i++) {
    const y = 0.6 - i * 0.035;
    both([[0, y], [0.1, y - 0.005], [0.17, y - 0.04], [0.12, y - 0.07], [0.02, y - 0.075]]).forEach((p) => L.path(g.smooth(p), { ...o, sw: 0.6 }));
  }
  L.path(g.poly([[0, 0.62], [0, 0.4]]), o);
  both([[0, 0.12], [0.08, 0.14], [0.17, 0.11], [0.15, 0.02], [0.09, -0.02], [0.03, 0.02]]).forEach((p) => L.path(g.smooth(p), o));
  if (c.post) {
    both([[0.05, 0.62], [0.17, 0.64], [0.19, 0.5], [0.07, 0.44]]).forEach((p) => L.path(g.smooth(p, true), { ...o, sw: 0.7, fill: a(INK, 0.04) }));
    L.path(g.smooth([[-0.05, 0.1], [0, 0.12], [0.05, 0.1], [0.02, 0.0], [-0.02, 0.0]], true), { ...o, sw: 0.7 });
  }
  both([[0.22, 0.64], [0.57, 0.48]]).forEach((p) => L.path(g.poly(p), o));
  both([[0.57, 0.48], [0.85, 0.35]]).forEach((p) => L.path(g.poly(p), o));
  both([[0.58, 0.455], [0.85, 0.33]]).forEach((p) => L.path(g.poly(p), { ...o, sw: 0.6 }));
  ([[0.99, 0.325], [1, 0.3], [0.985, 0.285], [0.985, 0.27], [0.96, 0.34]] as Pt[]).forEach((f) => both([[0.87, 0.34], f]).forEach((p) => L.path(g.poly(p), { ...o, sw: 0.5 })));
  both([[0.1, 0], [0.1, -0.5]]).forEach((p) => L.path(g.poly(p), { ...o, sw: 1.2 }));
  [0.1, -0.1].forEach((x) => L.circle(x, -0.5, 0.025, o));
  both([[0.1, -0.52], [0.07, -0.92]]).forEach((p) => L.path(g.poly(p), o));
  both([[0.13, -0.53], [0.09, -0.9]]).forEach((p) => L.path(g.poly(p), { ...o, sw: 0.6 }));
  both([[0.07, -0.93], [0.06, -0.99]]).forEach((p) => L.path(g.poly(p), { ...o, sw: 0.6 }));
  both([[0.07, -0.93], [0.12, -0.99]]).forEach((p) => L.path(g.poly(p), { ...o, sw: 0.6 }));
};

const muscle: Builder = (L, c) => {
  const { g } = c;
  const o = { stroke: a(OX, 0.55), sw: 0.7, fill: a(OX, 0.05) };
  const shapes: Pt[][] = [
    [[0.2, 0.66], [0.27, 0.64], [0.32, 0.58], [0.27, 0.54], [0.22, 0.56]],
    [[0.05, 0.62], [0.19, 0.6], [0.2, 0.5], [0.1, 0.47], [0.04, 0.5]],
    [[0.02, 0.42], [0.08, 0.4], [0.1, 0.25], [0.08, 0.06], [0.02, 0.02]],
    [[0.12, -0.02], [0.18, -0.1], [0.16, -0.4], [0.1, -0.46], [0.07, -0.3], [0.06, -0.08]],
    [[0.09, -0.55], [0.14, -0.6], [0.13, -0.8], [0.09, -0.88], [0.06, -0.75], [0.06, -0.58]],
    [[0.28, 0.6], [0.4, 0.57], [0.5, 0.52], [0.48, 0.46], [0.38, 0.5], [0.3, 0.55]],
  ];
  shapes.forEach((s) => both(s).forEach((p) => L.path(g.smooth(p, true), o)));
  L.label(-0.34, 0.6, "myofascial masses", { fill: a(OX, 0.8), k: 0.9 });
};

const cardio: Builder = (L, c) => {
  const { g } = c;
  const o = { stroke: a(OX, 0.8), sw: 0.9, fill: a(OX, 0.12 * c.organFade) };
  L.path(g.smooth([[0, 0.48], [0.06, 0.47], [0.09, 0.42], [0.06, 0.36], [0.01, 0.34], [-0.04, 0.38], [-0.04, 0.44]], true), { ...o, click: c.pick({ kind: "room", id: "heart" }) });
  L.path(g.smooth([[0.0, 0.47], [-0.01, 0.53], [0.02, 0.56], [0.05, 0.53], [0.02, 0.5], [-0.02, 0.44], [-0.02, 0.2], [0, 0.08]]), { stroke: a(OX, 0.7), sw: 0.9 });
  both([[0, 0.08], [0.06, 0.02], [0.1, -0.1], [0.1, -0.5], [0.08, -0.92], [0.06, -0.99]]).forEach((p) => L.path(g.smooth(p), { stroke: a(OX, 0.45), sw: 0.6 }));
  both([[0.02, 0.56], [0.03, 0.7], [0.05, 0.82]]).forEach((p) => L.path(g.smooth(p), { stroke: a(OX, 0.45), sw: 0.6 }));
  both([[0.03, 0.56], [0.2, 0.6], [0.57, 0.47], [0.85, 0.34]]).forEach((p) => L.path(g.smooth(p), { stroke: a(OX, 0.45), sw: 0.6 }));
  L.label(0.16, 0.44, "heart · great vessels", { anchor: "start", fill: a(OX, 0.85), k: 0.9 });
};

const resp: Builder = (L, c) => {
  const { g } = c;
  const o = { stroke: a(VG, 0.8), sw: 0.9, fill: a(VG, 0.1 * c.organFade) };
  const lungs = c.pick({ kind: "room", id: "lungs" });
  L.path(g.smooth([[-0.05, 0.6], [-0.13, 0.58], [-0.18, 0.48], [-0.17, 0.38], [-0.08, 0.36], [-0.05, 0.45]], true), { ...o, click: lungs });
  L.path(g.smooth([[0.05, 0.6], [0.13, 0.58], [0.18, 0.48], [0.17, 0.38], [0.1, 0.36], [0.07, 0.42], [0.05, 0.5]], true), { ...o, click: lungs });
  L.path(g.poly([[0, 0.72], [0, 0.58]]), o);
  both([[0, 0.58], [0.07, 0.52]]).forEach((p) => L.path(g.poly(p), o));
  L.path(g.smooth([[-0.19, 0.36], [-0.1, 0.4], [0, 0.415], [0.1, 0.4], [0.19, 0.36]]), { stroke: a(VG, 0.7), sw: 0.8, dash: "3 3" });
  L.label(-0.2, 0.5, "lungs · diaphragm", { anchor: "end", fill: a(VG, 0.9), k: 0.9 });
};

const digest: Builder = (L, c) => {
  const { g } = c;
  const o = { stroke: a(CU, 0.85), sw: 0.9, fill: a(CU, 0.13 * c.organFade) };
  L.path(g.smooth([[0, 0.34], [0.07, 0.35], [0.12, 0.3], [0.09, 0.24], [0.03, 0.22], [0, 0.26], [0.02, 0.31]], true), { ...o, click: c.pick({ kind: "room", id: "stomach" }) });
  L.path(g.smooth([[-0.19, 0.36], [-0.03, 0.36], [0.03, 0.33], [-0.02, 0.27], [-0.12, 0.25], [-0.18, 0.3]], true), { ...o, fill: a(CU, 0.08 * c.organFade), click: c.pick({ kind: "room", id: "liver" }) });
  L.ellipse(0.15, 0.29, 0.03, 0.045, { ...o, rot: -20, click: c.pick({ kind: "room", id: "spleen" }) });
  L.ellipse(-0.06, 0.265, 0.015, 0.01, o);
  L.path(g.poly([[0, 0.58], [0, 0.36]]), { stroke: a(CU, 0.5), sw: 0.6 });
  const gut = c.pick({ kind: "room", id: "intestines" });
  L.path(g.smooth([[-0.12, 0.05], [-0.13, 0.15], [-0.11, 0.23], [0, 0.245], [0.11, 0.23], [0.12, 0.14], [0.11, 0.05], [0.04, 0.02], [0, 0.03]]), { ...o, sw: 1.1, click: gut });
  L.path(g.smooth([[-0.06, 0.2], [0.04, 0.19], [0.07, 0.15], [-0.04, 0.15], [-0.07, 0.11], [0.06, 0.1], [0.05, 0.06], [-0.05, 0.06], [-0.01, 0.03]]), { stroke: a(CU, 0.65), sw: 0.7, click: gut });
  L.label(0.16, 0.12, "stomach → gut", { anchor: "start", fill: a(CU, 0.9), k: 0.9 });
};

const urinary: Builder = (L, c) => {
  const { g } = c;
  const o = { stroke: a(CU, 0.75), sw: 0.8, fill: a(CU, 0.08 * c.organFade) };
  [-0.09, 0.09].forEach((x) => L.ellipse(x, 0.2, 0.028, 0.045, { ...o, rot: x > 0 ? -12 : 12, click: c.pick({ kind: "room", id: "kidneys" }) }));
  both([[0.085, 0.16], [0.05, 0.09], [0.02, 0.06]]).forEach((p) => L.path(g.smooth(p), { stroke: a(CU, 0.5), sw: 0.6 }));
  L.ellipse(0, 0.05, 0.035, 0.025, o);
  L.label(-0.15, 0.2, "kidneys", { anchor: "end", fill: a(CU, 0.9), k: 0.9 });
};

const endocrine: Builder = (L, c) => {
  const { g } = c;
  const o = { stroke: a(AU, 1), sw: 0.9, fill: a(AU, 0.25 * c.organFade) };
  L.path(g.smooth([[-0.03, 0.67], [-0.01, 0.645], [0.01, 0.645], [0.03, 0.67], [0.02, 0.64], [0, 0.655], [-0.02, 0.64]], true), o);
  L.ellipse(0, 0.55, 0.02, 0.03, o);
  [-0.08, 0.08].forEach((x) => L.path(g.poly([[x - 0.02, 0.245], [x, 0.27], [x + 0.02, 0.245]], true), o));
  L.path(g.smooth([[-0.03, 0.245], [0.03, 0.25], [0.1, 0.235], [0.08, 0.22], [0, 0.225]], true), o);
  [-0.05, 0.05].forEach((x) => L.circle(x, 0.0, 0.014, o));
  L.circle(0, 0.86, 0.008, o);
  L.circle(0, 0.885, 0.005, o);
  L.label(0.05, 0.67, "thyroid", { anchor: "start", fill: a(AU, 1), k: 0.8 });
  L.label(-0.12, 0.28, "adrenals", { anchor: "end", fill: a(AU, 1), k: 0.8 });
  L.label(0.07, 0.0, "gonads", { anchor: "start", fill: a(AU, 1), k: 0.8 });
  L.label(0.03, 0.86, "pituitary", { anchor: "start", fill: a(AU, 1), k: 0.8 });
};

const lymph: Builder = (L, c) => {
  const { g } = c;
  const o = { stroke: a(VG, 0.7), sw: 0.6, fill: a(VG, 0.15) };
  ([[0.07, 0.72], [0.06, 0.75], [0.22, 0.58], [0.24, 0.56], [0.09, -0.03], [0.11, -0.06], [0.17, 0.62]] as Pt[]).forEach(([x, y]) => [x, -x].forEach((xx) => L.circle(xx, y, 0.008, o)));
  L.path(g.smooth([[0, 0.1], [-0.01, 0.3], [-0.02, 0.5], [-0.03, 0.62]]), { stroke: a(VG, 0.6), sw: 0.6, dash: "2 3" });
  L.label(-0.27, 0.58, "lymph · nodes", { anchor: "end", fill: a(VG, 0.9), k: 0.85 });
};

const repro: Builder = (L, c) => {
  const { g } = c;
  const o = { stroke: a(OX, 0.7), sw: 0.8, fill: a(OX, 0.08 * c.organFade) };
  L.path(g.smooth([[-0.16, 0.06], [-0.1, -0.005], [0, -0.02], [0.1, -0.005], [0.16, 0.06]]), { stroke: a(OX, 0.6), sw: 0.8, dash: "4 3" });
  L.path(g.smooth([[0, 0.08], [0.03, 0.05], [0.02, 0.01], [0, 0.0], [-0.02, 0.01], [-0.03, 0.05]], true), o);
  L.label(0.19, 0.03, "pelvic bowl", { anchor: "start", fill: a(OX, 0.85), k: 0.85 });
};

const sensory: Builder = (L, c) => {
  const { g } = c;
  const o = { stroke: a(NV, 0.8), sw: 0.7, fill: a(NV, 0.1) };
  [-0.04, 0.04].forEach((x) => {
    L.ellipse(x, 0.89, 0.016, 0.009, o);
    L.circle(x, 0.89, 0.005, { ...o, fill: a(NV, 0.6) });
  });
  ([[-0.09, 1], [0.09, -1]] as const).forEach(([x, s]) => {
    L.path(g.smooth([[x, 0.9], [x + s * 0.012, 0.88], [x + s * 0.008, 0.855], [x, 0.85]]), o);
    L.circle(x + s * 0.02, 0.885, 0.007, { ...o, dash: "1 1" });
  });
  L.label(0.14, 0.9, "eyes · ears · vestibular", { anchor: "start", fill: a(NV, 0.9), k: 0.85 });
};

const rooms: Builder = (L, c) => {
  const sel = c.sel;
  ROOMS.forEach((r) => {
    const s = sel?.kind === "room" && sel.id === r.id;
    L.ellipse(r.cx, r.cy, r.rx, r.ry, { rot: r.rot, stroke: s ? OX : a(INK, 0.45), sw: s ? 1.2 : 0.6, dash: s ? undefined : "2 3", fill: s ? a(OX, 0.14) : a(INK, 0.02), click: c.pick({ kind: "room", id: r.id }), hover: true });
    if (r.id === "autonomic" || r.id === "whole") L.label(r.cx + (r.id === "whole" ? 0.03 : -0.03), r.cy, r.name, { anchor: r.id === "whole" ? "start" : "end", k: 0.8, fill: a(INK, 0.6) });
  });
  // gold dots for pinned posts, body space → plate
  c.pins.forEach((p) => L.circle(p.body.x, p.body.y, 0.013, { stroke: "#5a3a12", sw: 0.6, fill: p.demo ? PAPER : AU, click: c.pick({ kind: "room", id: p.region }) }));
};

const overlay =
  (id: OverlayId, col: string): Builder =>
  (L, c) => {
    const { name, rooms: rs } = OVERLAYS[id];
    ROOMS.filter((r) => rs.includes(r.id)).forEach((r) => L.ellipse(r.cx, r.cy, r.rx * 1.1, r.ry * 1.1, { rot: r.rot, stroke: "none", fill: a(col, 0.16) }));
    if (rs.includes("skin")) L.path(c.g.silhouetteD, { stroke: col, sw: 2, fill: "none", op: 0.5 });
    L.label(-0.3, -0.2 - Object.keys(OVERLAYS).indexOf(id) * 0.08, name, { anchor: "end", fill: col, k: 0.9 });
  };

/** The active recipe's rooms, tinted like a lived overlay. Pseudo-layer. */
export const topicOverlay: Builder = (L, c) => {
  const t = c.topic;
  if (!t) return;
  ROOMS.filter((r) => t.regions.includes(r.id)).forEach((r) => L.ellipse(r.cx, r.cy, r.rx * 1.12, r.ry * 1.12, { rot: r.rot, stroke: a(VG, 0.5), sw: 0.6, dash: "1 3", fill: a(VG, 0.14) }));
  if (t.regions.includes("skin") || t.regions.includes("whole")) L.path(c.g.silhouetteD, { stroke: VG, sw: 1.6, fill: "none", op: 0.35 });
  L.label(-0.3, -0.55, `recipe · ${t.name}`, { anchor: "end", fill: VG, k: 0.9 });
};

export const STRUCTURE = {
  skin, skeleton, muscle, cardio, resp, digest, urinary, endocrine, lymph, repro, sensory, rooms,
  ovMobility: overlay("ovMobility", CU),
  ovDysauto: overlay("ovDysauto", OX),
  ovIntero: overlay("ovIntero", VG),
  ovVoice: overlay("ovVoice", NV),
} satisfies Record<string, Builder>;
