/**
 * Semantic ids for the atlas.
 *
 * These strings are the contract between the drawings (2D today, 3D later),
 * the Bluesky hashtags, and the `earth.wbc.pin` record. A drawing never owns
 * an id; it only paints one.
 */

export const REGION_IDS = [
  "crown",
  "brain",
  "face",
  "throat",
  "heart",
  "lungs",
  "solar-plexus",
  "stomach",
  "liver",
  "spleen",
  "intestines",
  "kidneys",
  "spine",
  "pelvis",
  "left-arm",
  "right-arm",
  "hands",
  "left-leg",
  "right-leg",
  "feet",
  "skin",
  "autonomic",
  "whole",
] as const;
export type RegionId = (typeof REGION_IDS)[number];
export const isRegionId = (s: string): s is RegionId =>
  (REGION_IDS as readonly string[]).includes(s);

export const MERIDIAN_IDS = [
  "lung",
  "large-intestine",
  "stomach",
  "spleen",
  "heart",
  "small-intestine",
  "bladder",
  "kidney",
  "pericardium",
  "triple-warmer",
  "gallbladder",
  "liver",
] as const;
export type MeridianId = (typeof MERIDIAN_IDS)[number];

export const NERVE_IDS = ["vagus", "sympathetic", "enteric", "sciatic", "brachial"] as const;
export type NerveId = (typeof NERVE_IDS)[number];

export const CHAKRA_IDS = [
  "muladhara",
  "svadhisthana",
  "manipura",
  "anahata",
  "vishuddha",
  "ajna",
  "sahasrara",
] as const;
export type ChakraId = (typeof CHAKRA_IDS)[number];

export const HD_CENTER_IDS = [
  "head",
  "ajna",
  "throat",
  "g",
  "ego",
  "sacral",
  "spleen",
  "solar-plexus",
  "root",
] as const;
export type HdCenterId = (typeof HD_CENTER_IDS)[number];

/** Extraordinary vessels drawn on the plate (two of eight). */
export const VESSEL_IDS = ["du", "ren"] as const;
export type VesselId = (typeof VESSEL_IDS)[number];

/** Anatomy Trains fascia lines (Myers), plus the overview entry. */
export const FASCIA_IDS = ["sfl", "sbl", "ll", "spl", "dfl", "sfal", "dfal", "sbal", "dbal", "anatomy-trains"] as const;
export type FasciaId = (typeof FASCIA_IDS)[number];

export const REFLEX_IDS = ["foot", "hand", "ear"] as const;
export type ReflexId = (typeof REFLEX_IDS)[number];

export const MICRO_IDS = ["face-map", "tongue-map", "iris-map", "hara"] as const;
export type MicroId = (typeof MICRO_IDS)[number];

export const TOOTH_IDS = ["tooth-chart"] as const;
export type ToothId = (typeof TOOTH_IDS)[number];

/** Centers beyond the seven chakras and nine HD centers. */
export const CENTER_IDS = ["soul-star", "earth-star", "dantien"] as const;
export type CenterId = (typeof CENTER_IDS)[number];

export const PLANET_IDS = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn"] as const;
export type PlanetId = (typeof PLANET_IDS)[number];

/** Field geometries with a reference entry. (`FieldId` is the Start-here field: stars/mind/body/earth.) */
export const FIELD_LAYER_IDS = ["aura", "torus", "merkaba", "polarity"] as const;
export type FieldLayerId = (typeof FIELD_LAYER_IDS)[number];

/** Gate ids as strings "1".."64" so they can key reference entries. */
export const GATE_IDS: readonly string[] = Array.from({ length: 64 }, (_, i) => String(i + 1));

export const ELEMENT_IDS = ["wood", "fire", "earth", "metal", "water"] as const;
export type ElementId = (typeof ELEMENT_IDS)[number];

/** Which drawings a pin can default to. `3d` is reserved for the mesh renderer. */
export type ViewId = "anterior" | "posterior" | "3d";

/** A landmark id from `landmarks.json`. Validated at runtime by `project.ts`. */
export type LandmarkId = string;

/** Gate 1..64. Same number for Human Design gate, I Ching hexagram, Gene Key. */
export type GateNumber = number;

/**
 * Body space. Not pixels, not millimetres.
 *  - origin (0,0,0) = perineum / mid-pelvis
 *  - +Y up the midline toward the crown (crown = +1, soles = -1)
 *  - +X toward the SUBJECT'S LEFT (viewer's right on an anterior plate)
 *  - +Z toward the viewer on the anterior view
 */
export interface BodyPoint {
  x: number;
  y: number;
  z: number;
}

/**
 * Where something sits, expressed against landmarks so the same formula
 * works on a woodcut and on a mesh. Either a landmark (with an optional
 * body-space nudge) or a fraction `t` along the segment from → to.
 */
export type Anchor =
  | { at: LandmarkId; dx?: number; dy?: number; dz?: number }
  | { from: LandmarkId; to: LandmarkId; t: number; dx?: number; dy?: number; dz?: number };

export type TopicKind = "condition" | "lived" | "tradition";
export type FieldId = "stars" | "mind" | "body" | "earth";
