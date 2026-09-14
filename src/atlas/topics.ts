import type { MeridianId, RegionId, TopicKind } from "./ids";
import { MERIDIAN_IDS } from "./ids";

export type TopicId =
  | "depression"
  | "anxiety"
  | "autism"
  | "adhd"
  | "pots"
  | "mobility"
  | "astrology"
  | "human-design"
  | "chinese-medicine"
  | "homeopathy"
  | "mystical"
  | "cancer"
  | "ocd"
  | "cptsd"
  | "cfs"
  | "long-covid"
  | "eds";

export interface Topic {
  id: TopicId;
  name: string;
  kind: TopicKind;
  regions: RegionId[];
  meridians: MeridianId[];
  /** Hashtags without `#`. The first one is the lead tag used in compose. */
  tags: string[];
  blurb: string;
}

/** Recipes. A recipe is a bundle: a condition or tradition, its rooms, its threads. */
export const TOPICS: readonly Topic[] = [
  {
    id: "depression",
    name: "Depression",
    kind: "condition",
    regions: ["brain", "heart", "liver", "intestines", "spine"],
    meridians: ["liver", "heart", "spleen"],
    tags: ["depression", "WholeBodyCookbook"],
    blurb: "A weather system, not a single organ. Serotonin stories, liver qi stagnation, inflammation, and the politics of getting out of bed.",
  },
  {
    id: "anxiety",
    name: "Anxiety",
    kind: "condition",
    regions: ["heart", "lungs", "solar-plexus", "autonomic", "brain"],
    meridians: ["heart", "pericardium", "lung", "kidney"],
    tags: ["anxiety", "WholeBodyCookbook"],
    blurb: "Chest weather. Breath that will not drop. Kidney water and heart fire, or a nervous system doing its job too well.",
  },
  {
    id: "autism",
    name: "Autism",
    kind: "condition",
    regions: ["brain", "skin", "intestines", "hands", "face"],
    meridians: ["spleen", "stomach"],
    tags: ["autism", "actuallyautistic", "WholeBodyCookbook"],
    blurb: "A nervous system with a different sampling rate. Sensory skin, interoception, gut, and the politics of masking.",
  },
  {
    id: "adhd",
    name: "ADHD",
    kind: "condition",
    regions: ["brain", "crown", "solar-plexus", "hands"],
    meridians: ["gallbladder", "liver"],
    tags: ["ADHD", "WholeBodyCookbook"],
    blurb: "Interest as a scarce resource. Time blindness, body-doubling, movement before focus.",
  },
  {
    id: "pots",
    name: "POTS / dysautonomia",
    kind: "condition",
    regions: ["heart", "autonomic", "spine", "brain", "feet"],
    meridians: ["heart", "kidney", "triple-warmer"],
    tags: ["POTS", "dysautonomia", "WholeBodyCookbook"],
    blurb: "A standing problem. Blood that will not stay up. Compression, salt, sympathetic chain.",
  },
  {
    id: "mobility",
    name: "Mobility",
    kind: "lived",
    regions: ["spine", "pelvis", "left-leg", "right-leg", "feet", "hands"],
    meridians: ["bladder", "gallbladder", "stomach"],
    tags: ["mobility", "disability", "WholeBodyCookbook"],
    blurb: "Aids, pain, stairs, and the social model. The body map is also an access map.",
  },
  {
    id: "astrology",
    name: "Astrology",
    kind: "tradition",
    regions: ["whole", "crown", "heart"],
    meridians: [],
    tags: ["astrology", "WholeBodyCookbook"],
    blurb: "Medical astrology mapped organs to signs for two thousand years. Aries head, Leo heart, Pisces feet.",
  },
  {
    id: "human-design",
    name: "Human Design",
    kind: "tradition",
    regions: ["crown", "brain", "throat", "heart", "solar-plexus", "pelvis"],
    meridians: [],
    tags: ["humandesign", "WholeBodyCookbook"],
    blurb: "Nine centers on the same silhouette. Defined or open, the body is the chart.",
  },
  {
    id: "chinese-medicine",
    name: "Chinese medicine",
    kind: "tradition",
    regions: ["whole", "liver", "heart", "lungs", "spleen", "kidneys"],
    meridians: [...MERIDIAN_IDS],
    tags: ["TCM", "acupuncture", "WholeBodyCookbook"],
    blurb: "Five phases, twelve regular meridians, emotion as organ weather.",
  },
  {
    id: "homeopathy",
    name: "Homeopathy",
    kind: "tradition",
    regions: ["whole"],
    meridians: [],
    tags: ["homeopathy", "WholeBodyCookbook"],
    blurb: "A controversial pharmacy of similars. The repertories remain a folk encyclopedia of sensation.",
  },
  {
    id: "mystical",
    name: "Mystical traditions",
    kind: "tradition",
    regions: ["crown", "spine", "heart", "pelvis", "whole"],
    meridians: [],
    tags: ["mysticism", "kundalini", "WholeBodyCookbook"],
    blurb: "Kundalini, hesychasm, Sufi heart, kabbalistic body. Different maps, same rooms.",
  },
  {
    id: "cancer",
    name: "Cancer",
    kind: "condition",
    regions: ["whole", "skin", "lungs", "intestines", "spleen"],
    meridians: ["spleen", "liver"],
    tags: ["cancer", "WholeBodyCookbook"],
    blurb: "Hundreds of diseases under one word. Treatment weather, appetite, the immune room, and the etiquette of being asked how you are.",
  },
  {
    id: "ocd",
    name: "OCD",
    kind: "condition",
    regions: ["brain", "hands", "skin", "solar-plexus"],
    meridians: ["heart", "spleen"],
    tags: ["OCD", "WholeBodyCookbook"],
    blurb: "A loop, not a personality. Checking, washing, counting, and the gut-level doubt underneath the hands.",
  },
  {
    id: "cptsd",
    name: "CPTSD",
    kind: "condition",
    regions: ["autonomic", "brain", "heart", "solar-plexus", "pelvis"],
    meridians: ["kidney", "heart", "pericardium"],
    tags: ["CPTSD", "complexPTSD", "WholeBodyCookbook"],
    blurb: "Thaw, freeze, stacked feeling. The nervous overlay of a long exposure rather than a single blast.",
  },
  {
    id: "cfs",
    name: "ME / CFS",
    kind: "condition",
    regions: ["autonomic", "brain", "spine", "kidneys", "whole"],
    meridians: ["kidney", "spleen", "triple-warmer"],
    tags: ["MECFS", "pwME", "WholeBodyCookbook"],
    blurb: "Energy as a scarce organ. Pacing as a recipe, crash as a weather report, and the politics of being believed.",
  },
  {
    id: "long-covid",
    name: "Long COVID",
    kind: "condition",
    regions: ["lungs", "heart", "autonomic", "brain"],
    meridians: ["lung", "heart", "triple-warmer"],
    tags: ["LongCovid", "WholeBodyCookbook"],
    blurb: "The infection that did not leave the building. Breath, standing heart rate, brain fog, and a very new room.",
  },
  {
    id: "eds",
    name: "EDS / hypermobility",
    kind: "condition",
    regions: ["skin", "spine", "hands", "pelvis", "left-leg", "right-leg", "autonomic"],
    meridians: ["liver", "spleen", "bladder"],
    tags: ["EDS", "hEDS", "hypermobility", "WholeBodyCookbook"],
    blurb: "Connective tissue that gives too much. Joints, skin, gut, and the dysautonomia that so often moves in next door.",
  },
];

export const topicById = (id: TopicId): Topic => {
  const t = TOPICS.find((x) => x.id === id);
  if (!t) throw new Error(`unknown topic ${id}`);
  return t;
};
export const isTopicId = (s: string): s is TopicId => TOPICS.some((t) => t.id === s);

/** Recipes in a room: direct matches first, then the ones that cover the whole body. */
export const topicsForRegion = (regionId: RegionId): Topic[] => [
  ...TOPICS.filter((t) => t.regions.includes(regionId)),
  ...TOPICS.filter((t) => !t.regions.includes(regionId) && t.regions.includes("whole")),
];
