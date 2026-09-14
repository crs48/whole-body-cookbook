import type { ElementId, MeridianId, RegionId } from "./ids";

export interface Meridian {
  id: MeridianId;
  name: string;
  element: ElementId;
  organ: RegionId;
  regions: RegionId[];
}

/** The twelve regular meridians. Region lists are illustrative routing for the plate. */
export const MERIDIANS: readonly Meridian[] = [
  { id: "lung", name: "Lung", element: "metal", organ: "lungs", regions: ["lungs", "left-arm", "hands"] },
  { id: "large-intestine", name: "Large intestine", element: "metal", organ: "intestines", regions: ["right-arm", "hands", "face"] },
  { id: "stomach", name: "Stomach", element: "earth", organ: "stomach", regions: ["face", "stomach", "right-leg", "feet"] },
  { id: "spleen", name: "Spleen", element: "earth", organ: "spleen", regions: ["feet", "left-leg", "spleen", "stomach"] },
  { id: "heart", name: "Heart", element: "fire", organ: "heart", regions: ["heart", "left-arm", "hands"] },
  { id: "small-intestine", name: "Small intestine", element: "fire", organ: "intestines", regions: ["hands", "right-arm", "spine"] },
  { id: "bladder", name: "Bladder", element: "water", organ: "kidneys", regions: ["face", "spine", "right-leg", "feet"] },
  { id: "kidney", name: "Kidney", element: "water", organ: "kidneys", regions: ["feet", "left-leg", "kidneys", "spine"] },
  { id: "pericardium", name: "Pericardium", element: "fire", organ: "heart", regions: ["heart", "left-arm", "hands"] },
  { id: "triple-warmer", name: "Triple warmer", element: "fire", organ: "autonomic", regions: ["hands", "right-arm", "face"] },
  { id: "gallbladder", name: "Gallbladder", element: "wood", organ: "liver", regions: ["face", "liver", "right-leg", "feet"] },
  { id: "liver", name: "Liver", element: "wood", organ: "liver", regions: ["feet", "left-leg", "liver"] },
];

export const meridianById = (id: MeridianId): Meridian => {
  const m = MERIDIANS.find((x) => x.id === id);
  if (!m) throw new Error(`unknown meridian ${id}`);
  return m;
};

export const meridiansForRegion = (regionId: RegionId): Meridian[] =>
  MERIDIANS.filter((m) => m.regions.includes(regionId) || m.organ === regionId);
