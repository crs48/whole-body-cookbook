import type { Anchor, RegionId } from "./ids";

export type RegionGroup = "head" | "torso" | "axis" | "limbs" | "field";

export interface Region {
  id: RegionId;
  name: string;
  /** Bluesky hashtag without the `#`. Also the `earth.wbc.pin.region` value's tag. */
  tag: string;
  group: RegionGroup;
  hint: string;
  /** Where a pin lands for this room, in body space via landmarks. */
  anchor: Anchor;
}

export const REGIONS: readonly Region[] = [
  { id: "crown", name: "Crown", tag: "wbc-crown", group: "head", hint: "Attention, mystical maps, human design head.", anchor: { at: "crown", dy: -0.03 } },
  { id: "brain", name: "Brain", tag: "wbc-brain", group: "head", hint: "ADHD, autism, depression circuitry, vagus stories.", anchor: { at: "glabella", dy: 0.03, dz: -0.05 } },
  { id: "face", name: "Face & senses", tag: "wbc-face", group: "head", hint: "Masking, interoception, expression.", anchor: { at: "nose", dy: -0.02 } },
  { id: "throat", name: "Throat", tag: "wbc-throat", group: "head", hint: "Voice, thyroid, human design throat.", anchor: { at: "larynx" } },
  { id: "heart", name: "Heart", tag: "wbc-heart", group: "torso", hint: "Grief, POTS, pericardium, Leo / Sun.", anchor: { at: "heart-apex" } },
  { id: "lungs", name: "Lungs", tag: "wbc-lungs", group: "torso", hint: "Anxiety breath, grief in Chinese medicine.", anchor: { at: "nipple-r", dy: 0.05 } },
  { id: "solar-plexus", name: "Solar plexus", tag: "wbc-solar", group: "torso", hint: "Human design emotional / ego, gut-brain.", anchor: { from: "navel", to: "xiphoid", t: 0.8 } },
  { id: "stomach", name: "Stomach", tag: "wbc-stomach", group: "torso", hint: "Earth element, appetite, worry.", anchor: { at: "epigastrium", dx: 0.05 } },
  { id: "liver", name: "Liver", tag: "wbc-liver", group: "torso", hint: "Anger, planning, wood, stagnation.", anchor: { at: "epigastrium", dx: -0.08, dy: 0.02 } },
  { id: "spleen", name: "Spleen / pancreas", tag: "wbc-spleen", group: "torso", hint: "Earth, blood, rumination.", anchor: { at: "rib-l", dx: -0.05, dy: -0.12 } },
  { id: "intestines", name: "Gut", tag: "wbc-gut", group: "torso", hint: "Microbiome, second brain, diet threads.", anchor: { at: "navel" } },
  { id: "kidneys", name: "Kidneys", tag: "wbc-kidney", group: "torso", hint: "Fear, jing, adrenal, water.", anchor: { at: "kidney-r" } },
  { id: "spine", name: "Spine", tag: "wbc-spine", group: "axis", hint: "Mobility, autonomic highway, kundalini.", anchor: { at: "T12" } },
  { id: "pelvis", name: "Pelvis", tag: "wbc-pelvis", group: "torso", hint: "Root, sacral, mobility.", anchor: { at: "pubic-symphysis", dy: -0.02 } },
  { id: "left-arm", name: "Left arm", tag: "wbc-larm", group: "limbs", hint: "Heart, pericardium, lung meridians.", anchor: { from: "acromion-l", to: "lateral-epicondyle-l", t: 0.55 } },
  { id: "right-arm", name: "Right arm", tag: "wbc-rarm", group: "limbs", hint: "Large intestine and triple warmer.", anchor: { from: "acromion-r", to: "lateral-epicondyle-r", t: 0.55 } },
  { id: "hands", name: "Hands", tag: "wbc-hands", group: "limbs", hint: "Acupoints, stimming, making.", anchor: { from: "styloid-l", to: "fingertip-l", t: 0.5 } },
  { id: "left-leg", name: "Left leg", tag: "wbc-lleg", group: "limbs", hint: "Spleen, liver, kidney meridians.", anchor: { from: "greater-trochanter-l", to: "mid-patella-l", t: 0.5, dx: -0.03 } },
  { id: "right-leg", name: "Right leg", tag: "wbc-rleg", group: "limbs", hint: "Stomach, gallbladder, bladder meridians.", anchor: { from: "greater-trochanter-r", to: "mid-patella-r", t: 0.5, dx: 0.03 } },
  { id: "feet", name: "Feet", tag: "wbc-feet", group: "limbs", hint: "Grounding, kidney-1 bubbling spring.", anchor: { at: "KS1-l", dy: 0.04 } },
  { id: "skin", name: "Skin / fascia", tag: "wbc-skin", group: "field", hint: "Boundary, immune, wei qi, sensory.", anchor: { at: "acromion-r", dx: -0.06, dy: 0.08 } },
  { id: "autonomic", name: "Autonomic field", tag: "wbc-ans", group: "field", hint: "POTS, freeze, vagus, dysautonomia.", anchor: { at: "rib-l", dx: 0.2, dy: 0.1 } },
  { id: "whole", name: "Whole body", tag: "wbc-whole", group: "field", hint: "Cross-links, constitutions, charts.", anchor: { at: "soul-star", dy: -0.1 } },
];

export const regionById = (id: RegionId): Region => {
  const r = REGIONS.find((x) => x.id === id);
  if (!r) throw new Error(`unknown region ${id}`);
  return r;
};
