/**
 * Cameras. A view is [x0, x1, y0, y1] in body units (Y up); the stage turns it
 * into an SVG viewBox. Layers never move; only the camera does.
 */
export type View = readonly [number, number, number, number];

export const CAM_IDS = ["human", "subtle", "earth", "sky", "proof", "reg", "reflex", "micro", "iris", "face", "teeth"] as const;
export type CamId = (typeof CAM_IDS)[number];

export const CAMS: Record<CamId, { label: string; v: View }> = {
  human: { label: "human", v: [-1.2, 1.2, -1.15, 1.15] },
  subtle: { label: "subtle", v: [-2.4, 2.4, -1.6, 1.6] },
  earth: { label: "earth", v: [-4, 4, -3, 2] },
  sky: { label: "sky", v: [-7.2, 7.2, -7, 7] },
  proof: { label: "proof", v: [-1.7, 1.7, -1.55, 1.55] },
  reg: { label: "registration", v: [-6.6, 6.6, -5.2, 5.2] },
  reflex: { label: "reflex", v: [2.3, 4.5, -1.4, 2.4] },
  micro: { label: "head maps", v: [-4.6, -2.2, -4.0, 3.1] },
  iris: { label: "irises", v: [-4.4, -2.4, -2.75, 1.2] },
  face: { label: "face · tongue", v: [-4.3, -2.5, 1.2, 3.05] },
  teeth: { label: "teeth", v: [-4.3, -2.5, -4.1, -2.5] },
};

/** Camera buttons on the plate, in order. */
export const CAM_BUTTONS: readonly CamId[] = ["human", "subtle", "earth", "sky", "reflex", "micro", "face", "iris", "teeth"];

/** Frames drawn on the registration sheet: [id, view, colour key]. */
export const FRAMES: readonly { id: CamId; ink: "INK" | "OX" | "VG" | "AU" }[] = [
  { id: "human", ink: "INK" },
  { id: "subtle", ink: "OX" },
  { id: "earth", ink: "VG" },
  { id: "sky", ink: "AU" },
];

export const sameView = (a: View, b: View): boolean => Math.abs(a[1] - b[1]) < 0.01 && Math.abs(a[0] - b[0]) < 0.01;
