import landmarksJson from "../atlas/landmarks.json";
import type { Anchor, BodyPoint, LandmarkId } from "../atlas/ids";

/**
 * Landmarks and anchors in body space (see `ids.ts`): origin at the perineum,
 * +Y to the crown, +X toward the subject's left, +Z toward the viewer.
 * Pins and centers are placed against landmarks so the same formula works
 * on the 2D plate and on a mesh later.
 */

interface LandmarkRow {
  id: string;
  x: number;
  y: number;
  z: number;
}

export const LANDMARKS: ReadonlyMap<LandmarkId, BodyPoint> = new Map((landmarksJson as LandmarkRow[]).map((r) => [r.id, { x: r.x, y: r.y, z: r.z }]));
export const LANDMARK_IDS: readonly LandmarkId[] = [...LANDMARKS.keys()];
export const hasLandmark = (id: LandmarkId): boolean => LANDMARKS.has(id);

export function landmark(id: LandmarkId): BodyPoint {
  const p = LANDMARKS.get(id);
  if (!p) throw new Error(`unknown landmark "${id}"`);
  return p;
}

const lerp = (a: BodyPoint, b: BodyPoint, t: number): BodyPoint => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t });

/** Resolve an anchor to a body-space point. */
export function resolveAnchor(a: Anchor): BodyPoint {
  const base = "at" in a ? landmark(a.at) : lerp(landmark(a.from), landmark(a.to), a.t);
  return { x: base.x + (a.dx ?? 0), y: base.y + (a.dy ?? 0), z: base.z + (a.dz ?? 0) };
}

export interface Vec2 {
  x: number;
  y: number;
}

/** Orthographic drop of Z onto the anterior (or posterior) plate, in body units, Y still up. */
export function project(p: BodyPoint, view: "anterior" | "posterior" = "anterior"): Vec2 {
  return view === "anterior" ? { x: p.x, y: p.y } : { x: -p.x, y: p.y };
}
