import {
  CENTER_IDS,
  CHAKRA_IDS,
  FASCIA_IDS,
  FIELD_LAYER_IDS,
  GATE_IDS,
  HD_CENTER_IDS,
  MERIDIAN_IDS,
  MICRO_IDS,
  NERVE_IDS,
  PLANET_IDS,
  REFLEX_IDS,
  REGION_IDS,
  TOOTH_IDS,
  VESSEL_IDS,
  type RegionId,
} from "../atlas/ids";
import { START_HERE } from "../atlas/practices";
import { TOPICS } from "../atlas/topics";

/** Kinds of reference entry. Folder name under `content/` is the kind. */
export const REFERENCE_KINDS = [
  "region",
  "recipe",
  "modality",
  "meridian",
  "vessel",
  "fascia",
  "nerve",
  "chakra",
  "center",
  "hd-center",
  "gate",
  "planet",
  "field",
  "reflex",
  "micro",
  "tooth",
  "practice",
] as const;
export type ReferenceKind = (typeof REFERENCE_KINDS)[number];
export const isReferenceKind = (s: string): s is ReferenceKind => (REFERENCE_KINDS as readonly string[]).includes(s);

export const KIND_LABEL: Record<ReferenceKind, string> = {
  region: "Body rooms",
  recipe: "Conditions & lived recipes",
  modality: "Modalities",
  meridian: "Meridians",
  vessel: "Extraordinary vessels",
  fascia: "Fascia lines",
  nerve: "Nerves",
  chakra: "Chakras",
  center: "Centers beyond the seven",
  "hd-center": "Human Design centers",
  gate: "64 gates · hexagrams · gene keys",
  planet: "Planets",
  field: "Fields",
  reflex: "Reflex maps",
  micro: "Head microsystems",
  tooth: "Teeth",
  practice: "Practices",
};

export const KIND_SINGULAR: Record<ReferenceKind, string> = {
  region: "body room",
  recipe: "recipe",
  modality: "modality",
  meridian: "meridian",
  vessel: "extraordinary vessel",
  fascia: "fascia line",
  nerve: "nerve",
  chakra: "chakra",
  center: "center",
  "hd-center": "HD center",
  gate: "gate · hexagram · gene key",
  planet: "planet",
  field: "field",
  reflex: "reflex map",
  micro: "microsystem",
  tooth: "tooth chart",
  practice: "practice",
};

/** Lens labels: H2 sections with these titles become the panel's lens tabs. */
export const LENS_LABELS = ["body", "tradition", "evidence", "practice", "symbol"] as const;
export type LensLabel = (typeof LENS_LABELS)[number];
export const isLensLabel = (s: string): s is LensLabel => (LENS_LABELS as readonly string[]).includes(s);

/** Which atlas id list a kind's `id` must belong to. */
export const KIND_IDS: Record<ReferenceKind, readonly string[]> = {
  region: REGION_IDS,
  recipe: TOPICS.filter((t) => t.kind !== "tradition").map((t) => t.id),
  modality: TOPICS.filter((t) => t.kind === "tradition").map((t) => t.id),
  meridian: MERIDIAN_IDS,
  vessel: VESSEL_IDS,
  fascia: FASCIA_IDS,
  nerve: NERVE_IDS,
  chakra: CHAKRA_IDS,
  center: CENTER_IDS,
  "hd-center": HD_CENTER_IDS,
  gate: GATE_IDS,
  planet: PLANET_IDS,
  field: FIELD_LAYER_IDS,
  reflex: REFLEX_IDS,
  micro: MICRO_IDS,
  tooth: TOOTH_IDS,
  practice: START_HERE.map((p) => p.id),
};

/** What a file's frontmatter may carry. Parsed from the raw source, never trusted as typed. */
export interface ReferenceFrontmatter {
  id?: string;
  kind: ReferenceKind;
  title: string;
  summary: string;
  /** Where on the plate, e.g. "(+0.03, +0.42), slightly left of midline". */
  where?: string;
  regions?: RegionId[];
  tags?: string[];
  aliases?: string[];
  wikipedia?: string;
}
