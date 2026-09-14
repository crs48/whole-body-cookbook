import { AU, INK, OX, PAPER, VG, alpha as a } from "../../atlas/palette";
import { CAMS, FRAMES } from "../../atlas/cameras";
import { PLATE_LANDMARKS } from "../../atlas/plate";
import type { Builder } from "./types";

const grid: Builder = (L, c) => {
  const { g, fs, flip } = c;
  const [x0, x1, y0, y1] = c.view;
  const gx0 = Math.floor(x0) - 1;
  const gx1 = Math.ceil(x1) + 1;
  const gy0 = Math.floor(y0) - 1;
  const gy1 = Math.ceil(y1) + 1;
  const stepMinor = c.viewW > 6 ? 0.5 : 0.25;
  for (let x = gx0; x <= gx1; x += stepMinor) {
    const maj = Math.abs(x - Math.round(x)) < 1e-6;
    L.path(g.poly([[x, gy0], [x, gy1]]), { stroke: a(INK, maj ? 0.28 : 0.1), sw: maj ? 0.7 : 0.5 });
    if (maj && x !== 0) L.text(x, y0 + 0.08, `${x > 0 ? "+" : ""}${x}`, { k: 0.7, fill: a(INK, 0.5), roman: true });
  }
  for (let y = gy0; y <= gy1; y += stepMinor) {
    const maj = Math.abs(y - Math.round(y)) < 1e-6;
    L.path(g.poly([[gx0, y], [gx1, y]]), { stroke: a(INK, maj ? 0.28 : 0.1), sw: maj ? 0.7 : 0.5 });
    if (maj && y !== 0) L.text(x0 + 0.1, y, `${y > 0 ? "+" : ""}${y}`, { k: 0.7, fill: a(INK, 0.5), roman: true, anchor: "start", dy: fs * 0.3 });
  }
  L.path(g.poly([[0, gy0], [0, gy1]]), { stroke: a(OX, 0.8), sw: 0.9 });
  L.path(g.poly([[gx0, 0], [gx1, 0]]), { stroke: a(OX, 0.8), sw: 0.9 });
  ([[1.3, "aura 1.3"], [1.6, "aura 1.6"], [2, "aura 2"], [2.5, "merkaba 2.5"], [4.45, "gates 4.3–4.6"], [5.6, "zodiac 5.2–6"]] as const).forEach(([r, n]) => {
    L.circle(0, 0, r, { stroke: a(INK, 0.35), sw: 0.5, dash: "2 4" });
    L.text(r * 0.707 + 0.05, r * 0.707 + 0.05, n, { anchor: "start", k: 0.7, fill: a(INK, 0.55) });
  });
  L.text(x1 - 0.15, 0.1, flip > 0 ? "+x  subject’s left  →" : "←  +x  subject’s left", { anchor: "end", k: 0.8, fill: OX, sc: true });
  L.text(x0 + 0.15, 0.1, flip > 0 ? "←  subject’s right  −x" : "subject’s right  −x  →", { anchor: "start", k: 0.8, fill: OX, sc: true });
  L.text(0.08, y1 - 0.25, "+y crown", { anchor: "start", k: 0.8, fill: OX, sc: true });
};

const landmarks: Builder = (L, c) => {
  const { g, fs } = c;
  const left = PLATE_LANDMARKS.filter((l) => l.x <= 0);
  const right = PLATE_LANDMARKS.filter((l) => l.x > 0);
  const place = (list: typeof left, side: 1 | -1) => {
    const sorted = [...list].sort((p, q) => q.y - p.y);
    let ly = 1.45;
    sorted.forEach((l) => {
      L.circle(l.x, l.y, 0.025, { stroke: OX, sw: 0.9, fill: PAPER });
      L.circle(l.x, l.y, 0.006, { stroke: OX, sw: 0.6, fill: OX });
      const lx = side * 1.55;
      L.path(g.poly([[l.x + side * 0.03, l.y], [lx - side * 0.06, ly]]), { stroke: a(OX, 0.5), sw: 0.5 });
      L.text(lx, ly, `${l.name}  (${l.x > 0 ? "+" : ""}${l.x}, ${l.y > 0 ? "+" : ""}${l.y})`, { anchor: side > 0 ? "start" : "end", k: 0.72, fill: INK, dy: fs * 0.3 });
      ly -= 0.3;
    });
  };
  place(left, -1);
  place(right, 1);
};

const frames: Builder = (L, c) => {
  const { fs } = c;
  const ink = { INK, OX, VG, AU };
  FRAMES.forEach((f) => {
    const [fx0, fx1, fy0, fy1] = CAMS[f.id].v;
    const col = ink[f.ink];
    L.rect(fx0, fy0, fx1 - fx0, fy1 - fy0, { stroke: col, sw: 0.9, dash: "6 3" });
    L.text(fx0 + 0.08, fy1 - 0.06, `${f.id}  x ±${fx1}  y ${fy0}…${fy1}`, { anchor: "start", k: 0.8, fill: col, sc: true, dy: fs * 0.6 });
  });
};

export const SHEET = { grid, landmarks, frames } satisfies Record<string, Builder>;
