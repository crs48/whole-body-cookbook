/**
 * Atlas state: sheet, camera, layers, selection, side, rings, labels, local
 * pins. Actions are stable (functional updates), so panels can be memoised.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { CAMS, type View } from "../atlas/cameras";
import { DEFAULT_RINGS } from "../atlas/codon-rings";
import { DEFAULT_SHEET, isLayerId, layerMeta, sheet as sheetById, type LayerId, type SheetId } from "../atlas/layers";
import type { CenterSystem } from "./buildLayers";
import { sameSel, type Sel } from "./selection";

export type Side = "ant" | "post";

export interface LocalPin {
  t: string;
  at: number;
}

export interface AtlasState {
  sheet: SheetId;
  view: View;
  on: ReadonlySet<LayerId>;
  sel: Sel | null;
  side: Side;
  rings: ReadonlySet<string>;
  labels: boolean;
  labelBump: number;
  lastCenter: CenterSystem;
  peek: LayerId | null;
  lens: number;
  pins: Record<string, LocalPin[]>;
  stage: [number, number];
  dragging: boolean;
}

export interface AtlasInit {
  sheet?: SheetId | null;
  sel?: Sel | null;
  side?: Side | null;
}

const PINS_KEY = "bodyAtlas.pins.v1";

function loadPins(): Record<string, LocalPin[]> {
  try {
    const raw = localStorage.getItem(PINS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, LocalPin[]>) : {};
  } catch {
    return {};
  }
}

function initial(init: AtlasInit): AtlasState {
  const s = sheetById(init.sheet ?? DEFAULT_SHEET);
  return {
    sheet: s.id,
    view: CAMS[s.cam].v,
    on: new Set(s.layers),
    sel: init.sel ?? null,
    side: init.side ?? s.side ?? "ant",
    rings: new Set(DEFAULT_RINGS),
    labels: true,
    labelBump: 0,
    lastCenter: "chakras",
    peek: null,
    lens: 0,
    pins: {},
    stage: [900, 600],
    dragging: false,
  };
}

export function useAtlas(init: AtlasInit) {
  const [st, setSt] = useState<AtlasState>(() => initial(init));
  const raf = useRef(0);
  const land = useRef(0);
  const viewRef = useRef<View>(st.view);
  viewRef.current = st.view;

  useEffect(() => {
    const pins = loadPins();
    if (Object.keys(pins).length) setSt((s) => ({ ...s, pins }));
  }, []);

  const stopAnim = useCallback(() => {
    cancelAnimationFrame(raf.current);
    clearTimeout(land.current);
  }, []);

  /** Animate the camera to `v` (520 ms, ease-out cubic). */
  const goView = useCallback(
    (v: View) => {
      stopAnim();
      const from = viewRef.current;
      const t0 = performance.now();
      const dur = 520;
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - k, 3);
        const cur: View = [from[0] + (v[0] - from[0]) * e, from[1] + (v[1] - from[1]) * e, from[2] + (v[2] - from[2]) * e, from[3] + (v[3] - from[3]) * e];
        setSt((s) => ({ ...s, view: cur }));
        if (k < 1) raf.current = requestAnimationFrame(step);
      };
      raf.current = requestAnimationFrame(step);
      land.current = window.setTimeout(() => {
        cancelAnimationFrame(raf.current);
        setSt((s) => ({ ...s, view: v }));
      }, dur + 80);
    },
    [stopAnim],
  );

  /** Set the camera directly (wheel / drag). */
  const setView = useCallback(
    (v: View) => {
      stopAnim();
      setSt((s) => ({ ...s, view: v }));
    },
    [stopAnim],
  );

  const goSheet = useCallback(
    (id: SheetId) => {
      const s = sheetById(id);
      setSt((st0) => ({ ...st0, sheet: s.id, on: new Set(s.layers), sel: null, side: s.side ?? "ant" }));
      goView(CAMS[s.cam].v);
    },
    [goView],
  );

  const toggle = useCallback((id: LayerId) => {
    if (layerMeta(id).auto) return;
    setSt((s) => {
      const on = new Set(s.on);
      if (on.has(id)) on.delete(id);
      else on.add(id);
      const lastCenter = (id === "chakras" || id === "hdCenters") && on.has(id) ? id : s.lastCenter;
      return { ...s, on, lastCenter, peek: null };
    });
  }, []);

  const setLayer = useCallback((id: LayerId, value: boolean) => {
    setSt((s) => {
      if (s.on.has(id) === value) return s;
      const on = new Set(s.on);
      if (value) on.add(id);
      else on.delete(id);
      return { ...s, on };
    });
  }, []);

  const peekOn = useCallback((id: LayerId) => {
    if (layerMeta(id).auto) return;
    setSt((s) => (s.on.has(id) ? s : { ...s, peek: id }));
  }, []);
  const peekOff = useCallback((id: LayerId) => setSt((s) => (s.peek === id ? { ...s, peek: null } : s)), []);
  const clearAll = useCallback(() => setSt((s) => ({ ...s, on: new Set<LayerId>(["skin"]), sel: null })), []);
  const setSide = useCallback((side: Side) => setSt((s) => ({ ...s, side })), []);
  const select = useCallback((sel: Sel | null) => setSt((s) => (sameSel(s.sel, sel) ? s : { ...s, sel, lens: 0 })), []);
  const deselect = useCallback(() => setSt((s) => (s.sel ? { ...s, sel: null } : s)), []);
  const setLens = useCallback((lens: number) => setSt((s) => ({ ...s, lens })), []);
  const toggleLabels = useCallback(() => setSt((s) => ({ ...s, labels: !s.labels })), []);
  const bumpLabels = useCallback((d: number) => setSt((s) => ({ ...s, labelBump: Math.max(-8, Math.min(16, s.labelBump + d)) })), []);
  const toggleRing = useCallback((id: string) => {
    setSt((s) => {
      const rings = new Set(s.rings);
      if (rings.has(id)) rings.delete(id);
      else rings.add(id);
      return { ...s, rings };
    });
  }, []);
  const setStage = useCallback((w: number, h: number) => setSt((s) => (Math.abs(s.stage[0] - w) > 1 || Math.abs(s.stage[1] - h) > 1 ? { ...s, stage: [w, h] } : s)), []);
  const setDragging = useCallback((dragging: boolean) => setSt((s) => (s.dragging === dragging ? s : { ...s, dragging })), []);

  const savePins = (pins: Record<string, LocalPin[]>) => {
    try {
      localStorage.setItem(PINS_KEY, JSON.stringify(pins));
    } catch {
      /* private mode etc. */
    }
  };
  const addPin = useCallback((key: string, text: string) => {
    const v = text.trim();
    if (!v) return;
    setSt((s) => {
      const pins = { ...s.pins, [key]: [...(s.pins[key] ?? []), { t: v, at: Date.now() }] };
      savePins(pins);
      return { ...s, pins };
    });
  }, []);
  const removePin = useCallback((key: string, i: number) => {
    setSt((s) => {
      const list = (s.pins[key] ?? []).filter((_, j) => j !== i);
      const pins = { ...s.pins };
      if (list.length) pins[key] = list;
      else delete pins[key];
      savePins(pins);
      return { ...s, pins };
    });
  }, []);

  useEffect(() => () => stopAnim(), [stopAnim]);

  return { st, goView, setView, goSheet, toggle, setLayer, peekOn, peekOff, clearAll, setSide, select, deselect, setLens, toggleLabels, bumpLabels, toggleRing, setStage, setDragging, addPin, removePin };
}

export type AtlasApi = ReturnType<typeof useAtlas>;

/** Parse a layer list from a URL (`on=skin,meridians`). */
export const parseLayers = (s: string | null): LayerId[] | null => (s ? s.split(",").filter(isLayerId) : null);
