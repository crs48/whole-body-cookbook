/**
 * Layer families, draw order and sheets, from the "Body Atlas" design.
 * Not forty checkboxes: seven families, each a row of chips. Every layer is a
 * builder that paints in the one shared body frame; toggling shows or hides.
 */
import { AU, CU, INK, NV, OX, VG } from "./palette";
import type { CamId } from "./cameras";

export const LAYER_IDS = [
  // structure
  "skin", "skeleton", "muscle", "cardio", "resp", "digest", "urinary", "endocrine", "lymph", "repro", "sensory", "rooms", "ovMobility", "ovDysauto", "ovIntero", "ovVoice",
  // channels
  "meridians", "extra", "acupoints", "fascia", "sushumna", "idaPingala", "hdChannels", "cns", "autonomic", "vagus", "enteric", "peripheral", "dermatomes", "homunculus", "srotas", "tibetan",
  // centers
  "chakras", "soulStar", "earthStar", "chakras912", "hdCenters", "endoNodes", "dantien",
  // field
  "polarity", "aura", "torus", "merkaba", "weather", "dosha", "humoral", "tree", "homeopathy",
  // micro
  "reflex", "faceMap", "tongueMap", "irisMap", "teethMap", "hara",
  // sky
  "earthDisc", "ley", "zodiac", "medAstro", "planets", "rulerships", "gates", "codon", "trigrams",
  // sheet
  "grid", "landmarks", "frames",
] as const;
export type LayerId = (typeof LAYER_IDS)[number];
export const isLayerId = (s: string): s is LayerId => (LAYER_IDS as readonly string[]).includes(s);

export const FAMILY_IDS = ["structure", "channels", "centers", "field", "micro", "sky", "sheet"] as const;
export type FamilyId = (typeof FAMILY_IDS)[number];

export interface LayerMeta {
  id: LayerId;
  label: string;
  color: string;
  /** Chip suffix: "default" / "2nd" / "on select". */
  tag?: string;
  /** Not toggleable: appears on its own when a meridian is selected. */
  auto?: true;
}
export interface Family {
  id: FamilyId;
  label: string;
  note: string;
  layers: LayerMeta[];
}

const L = (id: LayerId, label: string, color: string, tag?: string, auto?: true): LayerMeta => {
  const m: LayerMeta = { id, label, color };
  if (tag) m.tag = tag;
  if (auto) m.auto = auto;
  return m;
};

export const FAMILIES: readonly Family[] = [
  { id: "structure", label: "Structure", note: "organs · rooms", layers: [L("skin", "skin / fascia", INK, "default"), L("skeleton", "skeleton", INK), L("muscle", "myofascial", OX), L("cardio", "cardiovascular", OX), L("resp", "respiratory", VG), L("digest", "digestive", CU), L("urinary", "urinary", CU), L("endocrine", "endocrine", AU), L("lymph", "lymph / immune", VG), L("repro", "reproductive", OX), L("sensory", "sensory", NV), L("rooms", "rooms (pins)", INK), L("ovMobility", "mobility / aids", CU), L("ovDysauto", "dysautonomia", OX), L("ovIntero", "interoception", VG), L("ovVoice", "voice / masking", NV)] },
  { id: "channels", label: "Channels", note: "lines through landmarks", layers: [L("meridians", "12 meridians", CU, "default"), L("extra", "8 extraordinary", VG), L("acupoints", "acupoints", CU, "on select", true), L("fascia", "fascia lines · anatomy trains", OX), L("sushumna", "sushumna", AU), L("idaPingala", "ida / pingala", VG), L("hdChannels", "HD channels", AU), L("cns", "central nervous", NV, "2nd"), L("autonomic", "autonomic cloud", NV, "2nd"), L("vagus", "vagus", NV, "2nd"), L("enteric", "enteric", NV), L("peripheral", "peripheral trunks", NV), L("dermatomes", "dermatomes", NV), L("homunculus", "homunculus", NV), L("srotas", "srotas · marma", CU), L("tibetan", "tibetan channel", AU)] },
  { id: "centers", label: "Centers", note: "disks · never fused", layers: [L("chakras", "7 chakras", OX), L("soulStar", "soul star", AU), L("earthStar", "earth star", VG), L("chakras912", "chakras 9–12", AU), L("hdCenters", "9 HD centers", AU), L("endoNodes", "endocrine nodes", AU), L("dantien", "dantien", VG)] },
  { id: "field", label: "Field", note: "washes · shells", layers: [L("polarity", "polarity · left / right", INK), L("aura", "aura / wei qi", VG), L("torus", "torus field", CU), L("merkaba", "merkaba", AU), L("weather", "autonomic weather", NV), L("dosha", "dosha wash", CU), L("humoral", "humoral wash", OX), L("tree", "tree on the body", AU), L("homeopathy", "homeopathy words", OX)] },
  { id: "micro", label: "Microsystems", note: "part as whole", layers: [L("reflex", "reflex · feet hands ears", CU), L("faceMap", "face map", CU), L("tongueMap", "tongue map", CU), L("irisMap", "iridology", CU), L("teethMap", "teeth · meridian chart", CU), L("hara", "hara · belly zones", CU)] },
  { id: "sky", label: "Earth + sky", note: "same origin, zoomed out", layers: [L("earthDisc", "earth disc", VG), L("ley", "ley grid", VG), L("zodiac", "zodiac wheel", AU), L("medAstro", "signs on the body", AU), L("planets", "planets", AU), L("rulerships", "planetary rulerships", AU), L("gates", "64 gates · hexagrams", CU), L("codon", "codon rings", CU), L("trigrams", "trigram houses", INK)] },
  { id: "sheet", label: "Sheet", note: "registration", layers: [L("grid", "grid", INK), L("landmarks", "landmarks", OX), L("frames", "camera frames", INK)] },
];

const META = new Map<LayerId, LayerMeta>();
for (const f of FAMILIES) for (const l of f.layers) META.set(l.id, l);
export const layerMeta = (id: LayerId): LayerMeta => {
  const m = META.get(id);
  if (!m) throw new Error(`unknown layer ${id}`);
  return m;
};

/** Paint order, back to front. */
export const ORDER: readonly LayerId[] = [
  "dosha", "humoral", "earthDisc", "ley", "zodiac", "gates", "codon", "planets", "trigrams", "polarity", "aura", "torus", "merkaba", "tree", "weather", "grid", "frames",
  "skin", "muscle", "skeleton", "lymph", "repro", "urinary", "digest", "resp", "cardio", "endocrine", "sensory", "ovMobility", "ovDysauto", "ovIntero", "ovVoice", "rooms",
  "reflex", "faceMap", "tongueMap", "irisMap", "teethMap", "hara", "rulerships", "medAstro", "fascia", "meridians", "extra", "acupoints", "sushumna", "idaPingala", "hdChannels",
  "cns", "autonomic", "vagus", "enteric", "peripheral", "dermatomes", "homunculus", "srotas", "tibetan", "chakras", "chakras912", "soulStar", "earthStar", "hdCenters", "endoNodes", "dantien", "homeopathy", "landmarks",
];

/** Organ layers that fade as the camera pulls back. */
export const ORGAN_LAYERS: readonly LayerId[] = ["muscle", "skeleton", "lymph", "repro", "urinary", "digest", "resp", "cardio", "endocrine", "sensory"];
/** Anterior organ layers ghosted on the posterior plate. */
export const POSTERIOR_GHOSTED: readonly LayerId[] = ["digest", "cardio", "repro", "sensory", "endocrine", "lymph", "enteric", "vagus", "muscle"];

export const SHEET_IDS = ["reg", "human", "subtle", "earth", "sky", "proof", "post", "reflex", "micro"] as const;
export type SheetId = (typeof SHEET_IDS)[number];
export const isSheetId = (s: string): s is SheetId => (SHEET_IDS as readonly string[]).includes(s);

export interface Sheet {
  id: SheetId;
  title: string;
  cam: CamId;
  desc: string;
  layers: readonly LayerId[];
  side?: "post";
}
export const SHEETS: readonly Sheet[] = [
  { id: "reg", title: "Registration sheet", cam: "reg", desc: "Grid, landmarks and every camera frame drawn as rectangles in the shared space.", layers: ["skin", "grid", "landmarks", "frames"] },
  { id: "human", title: "Human plate", cam: "human", desc: "Silhouette, rooms, ghost organs, meridians, nerves, HD centers and the seven chakras — each its own layer.", layers: ["skin", "rooms", "cardio", "resp", "digest", "urinary", "meridians", "cns", "autonomic", "vagus", "hdCenters", "chakras"] },
  { id: "subtle", title: "Subtle plate", cam: "subtle", desc: "Aura shells, Merkaba, soul star above the crown, earth star below the soles.", layers: ["skin", "chakras", "soulStar", "earthStar", "aura", "torus", "merkaba"] },
  { id: "earth", title: "Earth plate", cam: "earth", desc: "Ground disc under the feet; the earth star drops into the planet.", layers: ["skin", "earthStar", "earthDisc", "ley", "aura"] },
  { id: "sky", title: "Sky plate", cam: "sky", desc: "Tiny body, zodiac, the one 64-tick mandala, codon-ring highlights, a few planets.", layers: ["skin", "earthDisc", "zodiac", "gates", "codon", "planets"] },
  { id: "proof", title: "Overlay proof", cam: "proof", desc: "Body + meridians + one center system + aura at 30 % — still registered.", layers: ["skin", "meridians", "chakras", "aura"] },
  { id: "post", title: "Posterior plate", cam: "human", desc: "Back view in the same space — viewer’s left is the subject’s left. Bladder, Du, sciatic and the sympathetic chain drawn solid; front organs ghosted.", layers: ["skin", "rooms", "skeleton", "urinary", "meridians", "extra", "cns", "autonomic", "peripheral"], side: "post" },
  { id: "reflex", title: "Reflex plate", cam: "reflex", desc: "Feet, hands and ears as maps of the whole body — plantar, palmar, auricular — drawn in a column at x 2.6 … 4.2 so they stay registered.", layers: ["skin", "reflex"] },
  { id: "micro", title: "Head maps plate", cam: "micro", desc: "Face, tongue, irises and the meridian tooth chart — diagnostic microsystems in a column at x −4.2 … −2.6.", layers: ["skin", "faceMap", "tongueMap", "irisMap", "teethMap"] },
];
export const sheet = (id: SheetId): Sheet => {
  const s = SHEETS.find((x) => x.id === id);
  if (!s) throw new Error(`unknown sheet ${id}`);
  return s;
};
export const DEFAULT_SHEET: SheetId = "human";
