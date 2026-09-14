/* From the Miro board: Whole Body Cookbook v0.1-prerelease
   https://miro.com/app/board/uXjVNol7iis=/
   Author protocol, not medical advice. */
import type { FieldId, RegionId } from "./ids";

export interface Field {
  id: FieldId;
  name: string;
  note: string;
}

export const FIELDS: readonly Field[] = [
  { id: "stars", name: "Stars", note: "Charts, timing, the sky map laid over the body." },
  { id: "mind", name: "Mind", note: "Attention, story, the part that kept pushing." },
  { id: "body", name: "Body", note: "Sensation, food, movement, the rooms themselves." },
  { id: "earth", name: "Earth", note: "Water, toxins, the ground the body stands on." },
];

export interface Practice {
  id: string;
  title: string;
  field: FieldId;
  /** Rooms this practice points at. The first one is where Atlas opens. */
  regions: RegionId[];
  text: string;
  detail: string;
  /** Supplements, binders, distillation: author protocol from the v0.1 board. */
  protocol?: true;
}

export const START_HERE: readonly Practice[] = [
  {
    id: "slow-down",
    title: "Slow down and acknowledge the body might be kinda fucked up right now",
    field: "mind",
    regions: ["whole", "autonomic", "brain"],
    text: "Nothing is broken that needs a hero. A fighter after a war has cuts. Living on Earth means cuts. Stop pushing so hard. Take time to heal.",
    detail: "It can take decades to notice the pattern. Attention, energy, socializing — keep pushing until the body will not. Then the ignored sensations arrive all at once.",
  },
  {
    id: "trust-yourself",
    title: "Trust yourself",
    field: "mind",
    regions: ["solar-plexus", "heart", "whole"],
    text: "Skeptical debate is allowed. For your own experience, trust that above anyone else's map. Every body has its own instruments.",
    detail: "The job of the body is to guide you into feeling more alive, not to match a protocol.",
  },
  {
    id: "distilled-water",
    title: "Drink distilled water",
    field: "earth",
    regions: ["kidneys", "whole"],
    text: "A cheap distiller plus a pre-filter. Chlorine, radon, fluoride, lead, PFAS — distillation is the blunt tool.",
    detail: "Earth-layer practice from the v0.1 board, not a prescription.",
    protocol: true,
  },
  {
    id: "eliminate-skincare",
    title: "Eliminate most skincare",
    field: "earth",
    regions: ["skin"],
    text: "Soap on the whole body and a cabinet of products often fight the skin. Diet, movement, mild hand soap.",
    detail: "Skin is a boundary and an organ.",
  },
  {
    id: "positive-self-talk",
    title: "Positive self talk",
    field: "mind",
    regions: ["face", "brain", "heart"],
    text: "No objective rules. You cannot do life wrong. Accept what is, including the wish to change.",
    detail: "Morning drill: non-dominant hand toothbrush. Left eye in the mirror — “Hey. It's ok. I love you. Thank you for doing your best.”",
  },
  {
    id: "move-daily",
    title: "Move daily",
    field: "body",
    regions: ["spine", "left-leg", "right-leg", "heart", "lungs"],
    text: "Walk, sport, Beat Saber. Aerobic if you can, twenty minutes. Sweat is allowed.",
    detail: "Motion is a meridian you can hold.",
  },
  {
    id: "feel-your-body",
    title: "Feel your body",
    field: "body",
    regions: ["skin", "whole", "autonomic"],
    text: "Touch it. Hands on the part that hurts. Then sit awareness on the uncomfortable spot until it can soften.",
    detail: "Most feelings crest in about ninety seconds if they are actually felt. Zen just-sit.",
  },
  {
    id: "inflammatory-food",
    title: "Cut down inflammatory food",
    field: "earth",
    regions: ["intestines", "throat", "liver"],
    text: "Sugars, starches, and many oils load inflammation. Coconut and greens as a simple counter-weight.",
    detail: "Board signal: post-nasal drip easing.",
  },
  {
    id: "feel-as-good",
    title: "Be open to feeling as good as you want",
    field: "stars",
    regions: ["heart", "crown", "whole"],
    text: "Can you prove the ceiling? People claim abiding good feeling. Replication exists.",
    detail: "More often, more situations, deeper degrees.",
  },
  {
    id: "digital-detox",
    title: "Digital detox",
    field: "mind",
    regions: ["brain", "hands"],
    text: "Social, porn, 24/7 work — moderation at least. Brains were not evolved for the rectangle.",
    detail: "The cookbook lives on a network. That tension stays.",
  },
  {
    id: "elimination-binders",
    title: "Learn to poop, and binders",
    field: "earth",
    regions: ["intestines"],
    text: "Easy elimination. Binders so what the tissues dump does not reabsorb.",
    detail: "Board protocol, not a clinic note.",
    protocol: true,
  },
  {
    id: "d3-magnesium",
    title: "Vitamin D3 and magnesium",
    field: "earth",
    regions: ["whole"],
    text: "A long list exists. The board short list: D3 and magnesium.",
    detail: "Two minerals the body spends constantly.",
    protocol: true,
  },
];
