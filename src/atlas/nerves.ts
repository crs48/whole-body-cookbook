import type { NerveId, RegionId } from "./ids";

export interface Nerve {
  id: NerveId;
  name: string;
  regions: RegionId[];
}

export const NERVES: readonly Nerve[] = [
  { id: "vagus", name: "Vagus", regions: ["brain", "throat", "heart", "lungs", "stomach", "intestines"] },
  { id: "sympathetic", name: "Sympathetic chain", regions: ["spine", "heart", "lungs", "autonomic"] },
  { id: "enteric", name: "Enteric nervous system", regions: ["stomach", "intestines", "solar-plexus"] },
  { id: "sciatic", name: "Sciatic", regions: ["pelvis", "left-leg", "right-leg", "feet"] },
  { id: "brachial", name: "Brachial plexus", regions: ["throat", "left-arm", "right-arm", "hands"] },
];

export const nervesForRegion = (regionId: RegionId): Nerve[] =>
  NERVES.filter((n) => n.regions.includes(regionId));
