import type { ChakraId, HdCenterId, MeridianId, NerveId, RegionId } from "./ids";

/**
 * Rooms across frameworks. These map, they do not merge: a pin always stores
 * a region id; the layer it came from is only a hint.
 */
export interface Correspondence {
  region: RegionId;
  meridians?: MeridianId[];
  hd?: HdCenterId[];
  chakras?: ChakraId[];
  nerves?: NerveId[];
  /** Folk / astrological / other-tradition labels, plain strings. */
  folk?: string[];
  note: string;
}

export const CORRESPONDENCES: readonly Correspondence[] = [
  {
    region: "heart",
    meridians: ["heart", "pericardium"],
    hd: ["g", "ego"],
    chakras: ["anahata"],
    nerves: ["vagus", "sympathetic"],
    folk: ["Leo", "Sun"],
    note: "Pericardium as the heart's minister; HD G / ego-adjacent rooms; anahata; Leo / Sun in the folk map.",
  },
  {
    region: "solar-plexus",
    meridians: ["stomach", "spleen"],
    hd: ["solar-plexus"],
    chakras: ["manipura"],
    nerves: ["enteric", "vagus"],
    folk: ["Virgo"],
    note: "HD solar plexus; manipura; stomach / spleen earth.",
  },
  {
    region: "spine",
    meridians: ["bladder"],
    nerves: ["sympathetic"],
    folk: ["Du vessel", "sushumna", "kundalini corridor", "Leo (back)"],
    note: "Du (governing) vessel; sushumna; sympathetic chain; the kundalini corridor.",
  },
  {
    region: "pelvis",
    meridians: ["kidney", "bladder"],
    hd: ["sacral", "root"],
    chakras: ["svadhisthana", "muladhara"],
    nerves: ["sciatic"],
    folk: ["lower dantien", "Scorpio"],
    note: "HD sacral + root; svadhisthana / muladhara; the lower dantien.",
  },
  {
    region: "crown",
    hd: ["head"],
    chakras: ["sahasrara"],
    folk: ["Aries", "soul-star above"],
    note: "HD head; sahasrara; Aries rules the head in the medical zodiac.",
  },
  {
    region: "brain",
    hd: ["ajna"],
    chakras: ["ajna"],
    nerves: ["vagus"],
    folk: ["Mercury"],
    note: "HD ajna; the ajna chakra; Mercury as the folk planet of thought.",
  },
  {
    region: "throat",
    meridians: ["stomach", "large-intestine"],
    hd: ["throat"],
    chakras: ["vishuddha"],
    nerves: ["vagus"],
    folk: ["Taurus"],
    note: "HD throat; vishuddha; Taurus rules the neck.",
  },
  {
    region: "kidneys",
    meridians: ["kidney", "bladder"],
    folk: ["Libra", "water", "jing"],
    note: "Kidney water; jing; Libra in the medical zodiac.",
  },
  {
    region: "liver",
    meridians: ["liver", "gallbladder"],
    folk: ["Jupiter", "wood"],
    note: "Wood; the general who plans; Jupiter in the folk map.",
  },
  {
    region: "lungs",
    meridians: ["lung", "large-intestine"],
    nerves: ["vagus", "sympathetic"],
    folk: ["Gemini", "metal"],
    note: "Metal; grief; Gemini rules the lungs and arms.",
  },
  {
    region: "intestines",
    meridians: ["large-intestine", "small-intestine"],
    nerves: ["enteric", "vagus"],
    folk: ["Virgo"],
    note: "Enteric second brain; large and small intestine meridians; Virgo.",
  },
  {
    region: "feet",
    meridians: ["kidney", "spleen", "liver", "stomach", "gallbladder", "bladder"],
    folk: ["Pisces", "earth-star below"],
    note: "Kidney-1 bubbling spring; six leg meridians begin or end here; Pisces rules the feet.",
  },
  {
    region: "hands",
    meridians: ["lung", "large-intestine", "heart", "small-intestine", "pericardium", "triple-warmer"],
    folk: ["Gemini"],
    note: "Six arm meridians begin or end at the fingers.",
  },
  {
    region: "skin",
    meridians: ["lung"],
    folk: ["wei qi", "Saturn"],
    note: "Wei qi is the first aura in the same numbers; the lung governs the skin.",
  },
  {
    region: "autonomic",
    meridians: ["triple-warmer"],
    nerves: ["vagus", "sympathetic", "enteric"],
    folk: ["triple warmer", "aura"],
    note: "Triple warmer as the folk autonomic; vagus and sympathetic as the clinical one.",
  },
];

export const correspondenceFor = (region: RegionId): Correspondence | undefined =>
  CORRESPONDENCES.find((c) => c.region === region);
