/**
 * Drawing primitives in SVG user units, produced by the layer builders and
 * rendered by the stage. Factories mirror the design's P / C / E / R / T.
 */
import type { MouseEvent } from "react";
import { INK } from "../atlas/palette";
import type { Geom } from "./geom";

export type Click = (e: MouseEvent<SVGElement>) => void;

export interface PathPrim {
  d: string;
  stroke: string;
  sw: number;
  fill: string;
  dash?: string;
  op: number;
  click?: Click;
  cursor: string;
  clip?: string;
  filter?: string;
}
export interface CirclePrim {
  cx: number;
  cy: number;
  r: number;
  stroke: string;
  sw: number;
  fill: string;
  dash?: string;
  op: number;
  click?: Click;
  cursor: string;
}
export interface EllipsePrim {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  tf?: string;
  stroke: string;
  sw: number;
  fill: string;
  dash?: string;
  op: number;
  click?: Click;
  cursor: string;
  filter?: string;
  clip?: string;
  /** Room hit target: hover fill via CSS. */
  hover?: boolean;
}
export interface RectPrim {
  x: number;
  y: number;
  w: number;
  h: number;
  stroke: string;
  sw: number;
  fill: string;
  dash?: string;
  op: number;
  click?: Click;
}
export interface TextPrim {
  x: number;
  y: number;
  t: string;
  fs: number;
  anchor: "start" | "middle" | "end";
  fill: string;
  op: number;
  fstyle: "normal" | "italic";
  fv: "normal" | "small-caps";
  ls: string;
  tf?: string;
}

export interface PrimOpts {
  stroke?: string;
  sw?: number;
  fill?: string;
  dash?: string;
  op?: number;
  click?: Click;
  clip?: string;
  filter?: string;
  rot?: number;
  hover?: boolean;
}
export interface TextOpts {
  dx?: number;
  dy?: number;
  k?: number;
  anchor?: "start" | "middle" | "end";
  fill?: string;
  op?: number;
  sc?: boolean;
  roman?: boolean;
  free?: boolean;
  rot?: number;
}

export class Prims {
  paths: PathPrim[] = [];
  circles: CirclePrim[] = [];
  ellipses: EllipsePrim[] = [];
  rects: RectPrim[] = [];
  texts: TextPrim[] = [];

  constructor(
    private readonly g: Geom,
    private readonly lw: number,
    /** Label size in user units (constant on screen). */
    readonly fs: number,
    private readonly labelsOn: boolean,
  ) {}

  path(d: string, o: PrimOpts = {}): void {
    this.paths.push({ d, stroke: o.stroke ?? INK, sw: Math.max(o.sw ?? 1, 0.75) * this.lw, fill: o.fill ?? "none", dash: o.dash, op: o.op ?? 1, click: o.click, cursor: o.click ? "pointer" : "default", clip: o.clip, filter: o.filter });
  }
  circle(x: number, y: number, r: number, o: PrimOpts = {}): void {
    this.circles.push({ cx: this.g.X(x), cy: this.g.Y(y), r: r * 100, stroke: o.stroke ?? INK, sw: Math.max(o.sw ?? 1, 0.75) * this.lw, fill: o.fill ?? "none", dash: o.dash, op: o.op ?? 1, click: o.click, cursor: o.click ? "pointer" : "default" });
  }
  ellipse(x: number, y: number, rx: number, ry: number, o: PrimOpts = {}): void {
    const cx = this.g.X(x);
    const cy = this.g.Y(y);
    this.ellipses.push({ cx, cy, rx: rx * 100, ry: ry * 100, tf: o.rot ? `rotate(${o.rot * this.g.flip} ${cx} ${cy})` : undefined, stroke: o.stroke ?? INK, sw: Math.max(o.sw ?? 1, 0.75) * this.lw, fill: o.fill ?? "none", dash: o.dash, op: o.op ?? 1, click: o.click, cursor: o.click ? "pointer" : "default", filter: o.filter, clip: o.clip, hover: o.hover });
  }
  rect(x: number, y: number, w: number, h: number, o: PrimOpts = {}): void {
    this.rects.push({ x: Math.min(this.g.X(x), this.g.X(x + w)), y: this.g.Y(y + h), w: w * 100, h: h * 100, stroke: o.stroke ?? INK, sw: (o.sw ?? 1) * this.lw, fill: o.fill ?? "none", dash: o.dash, op: o.op ?? 1, click: o.click });
  }
  /** Always-drawn text (zone labels that must show even with labels off use this). */
  text(x: number, y: number, t: string, o: TextOpts = {}): void {
    const flip = this.g.flip;
    const anchor0 = o.anchor ?? "middle";
    const anchor = flip > 0 ? anchor0 : anchor0 === "start" ? "end" : anchor0 === "end" ? "start" : anchor0;
    const X = this.g.X(x);
    const Y = this.g.Y(y);
    this.texts.push({
      x: X + (o.dx ?? 0) * flip,
      y: Y + (o.dy ?? 0),
      t,
      fs: this.fs * (o.free ? (o.k ?? 1) : Math.max(o.k ?? 1, 0.85)),
      anchor,
      fill: o.fill ?? INK,
      op: o.op ?? 1,
      fstyle: o.sc || o.roman ? "normal" : "italic",
      fv: o.sc ? "small-caps" : "normal",
      ls: o.sc ? "0.08em" : "0",
      tf: o.rot ? `rotate(${o.rot * flip} ${X} ${Y})` : undefined,
    });
  }
  /** A label: only when labels are on. */
  label(x: number, y: number, t: string, o: TextOpts = {}): void {
    if (this.labelsOn) this.text(x, y, t, o);
  }
}
