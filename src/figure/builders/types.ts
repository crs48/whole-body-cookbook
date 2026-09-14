import type { BodyPoint, RegionId } from "../../atlas/ids";
import type { View } from "../../atlas/cameras";
import type { Topic } from "../../atlas/topics";
import type { Flip, Geom } from "../geom";
import type { Click, Prims } from "../prims";
import type { Sel } from "../selection";

/** A pin the plate can paint: body space, projected by the stage. */
export interface PlacedPin {
  id: string;
  region: RegionId;
  body: BodyPoint;
  demo: boolean;
  label: string;
}

export interface BuildCtx {
  g: Geom;
  flip: Flip;
  post: boolean;
  sel: Sel | null;
  view: View;
  viewW: number;
  /** 1 close in, 0 far out; organ washes fade with it. */
  organFade: number;
  /** Label size in user units. */
  fs: number;
  /** Screen px per user unit. */
  pxScale: number;
  /** Zoomed close enough for inset zone labels. */
  detail: boolean;
  labelsOn: boolean;
  lw: number;
  pick: (sel: Sel) => Click;
  rings: ReadonlySet<string>;
  proof: boolean;
  topic: Topic | null;
  pins: readonly PlacedPin[];
}

export type Builder = (L: Prims, c: BuildCtx) => void;
