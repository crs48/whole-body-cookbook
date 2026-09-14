/**
 * Assemble the plate: run the builders of every layer that is on, in paint
 * order, and apply the design's opacity rules.
 */
import { ORDER, ORGAN_LAYERS, POSTERIOR_GHOSTED, type LayerId } from "../atlas/layers";
import { Prims } from "./prims";
import { CENTERS } from "./builders/centers";
import { CHANNELS } from "./builders/channels";
import { FIELD } from "./builders/field";
import { MICRO } from "./builders/micro";
import { SHEET } from "./builders/sheet";
import { SKY } from "./builders/sky";
import { STRUCTURE, topicOverlay } from "./builders/structure";
import type { BuildCtx, Builder } from "./builders/types";

const BUILDERS: Record<LayerId, Builder> = { ...STRUCTURE, ...CHANNELS, ...CENTERS, ...FIELD, ...MICRO, ...SKY, ...SHEET };

export interface BuiltLayer {
  id: string;
  opacity: number;
  prims: Prims;
}

export type CenterSystem = "chakras" | "hdCenters";

export function buildLayers(c: BuildCtx, on: ReadonlySet<LayerId>, peek: LayerId | null, lastCenter: CenterSystem): BuiltLayer[] {
  const out: BuiltLayer[] = [];
  const bothCenters = on.has("chakras") && on.has("hdCenters");
  const peekId = peek && !on.has(peek) ? peek : null;
  const mk = () => new Prims(c.g, c.lw, c.fs, c.labelsOn);
  for (const id of ORDER) {
    if (id === "rooms" && c.topic) {
      const L = mk();
      topicOverlay(L, c);
      out.push({ id: "topic", opacity: 1, prims: L });
    }
    const isPeek = id === peekId;
    const onIt = on.has(id) || isPeek || (id === "acupoints" && on.has("meridians") && c.sel?.kind === "meridian");
    if (!onIt) continue;
    const L = mk();
    BUILDERS[id](L, c);
    let op = 1;
    if (c.proof && id !== "skin") op = 0.3;
    if (isPeek) op = 0.75;
    if (c.post && POSTERIOR_GHOSTED.includes(id)) op = 0.3;
    if (bothCenters && id === (lastCenter === "chakras" ? "hdCenters" : "chakras")) op = Math.min(op, 0.5);
    if (ORGAN_LAYERS.includes(id)) op = Math.min(op, 0.25 + 0.75 * c.organFade);
    out.push({ id, opacity: op, prims: L });
  }
  return out;
}
