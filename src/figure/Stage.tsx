/**
 * The plate. One SVG whose viewBox is the camera; wheel zooms about the
 * cursor, drag pans, click on paper deselects. Labels are <text> nodes.
 */
import { useEffect, useRef, type CSSProperties, type MouseEvent as RMouseEvent, type RefObject } from "react";
import type { View } from "../atlas/cameras";
import type { BuiltLayer } from "./buildLayers";
import { U, type Flip, type Geom } from "./geom";

interface Props {
  g: Geom;
  view: View;
  flip: Flip;
  layers: BuiltLayer[];
  dragging: boolean;
  draggingRef: RefObject<boolean>;
  coordRef: RefObject<HTMLSpanElement | null>;
  onView: (v: View) => void;
  onDragging: (d: boolean) => void;
  onBg: () => void;
  onSize: (w: number, h: number) => void;
}

interface Units {
  x: number;
  y: number;
  s: number;
}

const FONT: CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

export function Stage({ g, view, flip, layers, dragging, draggingRef, coordRef, onView, onDragging, onBg, onSize }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const viewRef = useRef(view);
  viewRef.current = view;
  const flipRef = useRef(flip);
  flipRef.current = flip;

  const toUnits = (clientX: number, clientY: number): Units | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const r = svg.getBoundingClientRect();
    const [x0, x1, y0, y1] = viewRef.current;
    const vw = (x1 - x0) * U;
    const vh = (y1 - y0) * U;
    const s = Math.min(r.width / vw, r.height / vh);
    const ox = (r.width - vw * s) / 2;
    const oy = (r.height - vh * s) / 2;
    const f = flipRef.current;
    const xminPx = f > 0 ? x0 * U : -x1 * U;
    return { x: (f * ((clientX - r.left - ox) / s + xminPx)) / U, y: -((clientY - r.top - oy) / s - y1 * U) / U, s: s * U };
  };

  /* wheel zoom about the cursor: needs a non-passive listener */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const p = toUnits(e.clientX, e.clientY);
      if (!p) return;
      const [x0, x1, y0, y1] = viewRef.current;
      const w = x1 - x0;
      const k = Math.exp(e.deltaY * 0.0016);
      const nw = Math.min(24, Math.max(0.15, w * k));
      const f = nw / w;
      onView([p.x - (p.x - x0) * f, p.x + (x1 - p.x) * f, p.y - (p.y - y0) * f, p.y + (y1 - p.y) * f]);
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onView]);

  /* stage size → label scale */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const measure = () => {
      const r = svg.getBoundingClientRect();
      if (r.width && r.height) onSize(r.width, r.height);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(svg);
    return () => ro.disconnect();
  }, [onSize]);

  const onDown = (e: RMouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    const p = toUnits(e.clientX, e.clientY);
    if (!p) return;
    const start = { x: e.clientX, y: e.clientY, view: viewRef.current, s: p.s };
    let moved = false;
    const f = flipRef.current;
    const mv = (ev: MouseEvent) => {
      if (!moved && Math.hypot(ev.clientX - start.x, ev.clientY - start.y) < 3) return;
      moved = true;
      draggingRef.current = true;
      onDragging(true);
      const dx = (f * (ev.clientX - start.x)) / start.s;
      const dy = (ev.clientY - start.y) / start.s;
      onView([start.view[0] - dx, start.view[1] - dx, start.view[2] + dy, start.view[3] + dy]);
    };
    const up = () => {
      window.removeEventListener("mousemove", mv);
      window.removeEventListener("mouseup", up);
      if (moved) {
        onDragging(false);
        setTimeout(() => {
          draggingRef.current = false;
        }, 0);
      }
    };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseup", up);
  };

  const onMove = (e: RMouseEvent<SVGSVGElement>) => {
    const el = coordRef.current;
    const p = toUnits(e.clientX, e.clientY);
    if (!p || !el) return;
    const fmt = (v: number) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(2)}`;
    el.textContent = `x ${fmt(p.x)}  y ${fmt(p.y)}${Math.abs(p.x) > 0.03 ? (p.x > 0 ? "  · subject’s left" : "  · subject’s right") : ""}`;
  };

  const [x0, x1, y0, y1] = view;
  const viewBox = `${Math.min(g.X(x0), g.X(x1))} ${g.Y(y1)} ${(x1 - x0) * U} ${(y1 - y0) * U}`;

  return (
    <svg
      ref={svgRef}
      className="stage-svg"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      onMouseMove={onMove}
      onMouseDown={onDown}
      onClick={() => {
        if (!draggingRef.current) onBg();
      }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", overflow: "hidden", cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
      role="group"
      aria-label="Body atlas plate"
    >
      <defs>
        <clipPath id="bodyClip">
          <path d={g.silhouetteD} />
        </clipPath>
        <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      <g strokeLinecap="round" strokeLinejoin="round">
        {layers.map((L) => (
          <g key={L.id} opacity={L.opacity} data-layer={L.id} style={{ transition: "opacity .35s" }}>
            {L.prims.rects.map((p, i) => (
              <rect key={`r${i}`} x={p.x} y={p.y} width={p.w} height={p.h} fill={p.fill} stroke={p.stroke} strokeWidth={p.sw} strokeDasharray={p.dash} opacity={p.op} vectorEffect="non-scaling-stroke" onClick={p.click} />
            ))}
            {L.prims.ellipses.map((p, i) => (
              <ellipse key={`e${i}`} className={p.hover ? "room-hit" : undefined} cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry} transform={p.tf} fill={p.fill} stroke={p.stroke} strokeWidth={p.sw} strokeDasharray={p.dash} opacity={p.op} filter={p.filter} clipPath={p.clip} vectorEffect="non-scaling-stroke" onClick={p.click} style={{ cursor: p.cursor }} />
            ))}
            {L.prims.paths.map((p, i) => (
              <path key={`p${i}`} d={p.d} fill={p.fill} stroke={p.stroke} strokeWidth={p.sw} strokeDasharray={p.dash} opacity={p.op} filter={p.filter} clipPath={p.clip} vectorEffect="non-scaling-stroke" onClick={p.click} style={{ cursor: p.cursor }} />
            ))}
            {L.prims.circles.map((p, i) => (
              <circle key={`c${i}`} cx={p.cx} cy={p.cy} r={p.r} fill={p.fill} stroke={p.stroke} strokeWidth={p.sw} strokeDasharray={p.dash} opacity={p.op} vectorEffect="non-scaling-stroke" onClick={p.click} style={{ cursor: p.cursor }} />
            ))}
            <g style={{ pointerEvents: "none", userSelect: "none" }}>
              {L.prims.texts.map((p, i) => (
                <text key={`t${i}`} x={p.x} y={p.y} fontSize={p.fs} textAnchor={p.anchor} fill={p.fill} opacity={p.op} transform={p.tf} style={{ ...FONT, fontStyle: p.fstyle, fontVariant: p.fv, letterSpacing: p.ls }}>
                  {p.t}
                </text>
              ))}
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}
