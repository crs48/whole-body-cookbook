/**
 * The Layer atlas: sidebar of sheets / cameras / layers, the plate, and the
 * detail panel. State lives in useAtlas; the URL mirrors room, sheet, sel,
 * side and topic.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RegionId } from "../atlas/ids";
import { regionById } from "../atlas/regions";
import { sheet as sheetById, type LayerId, type SheetId } from "../atlas/layers";
import type { Topic, TopicId } from "../atlas/topics";
import type { Pin } from "../atlas/samples";
import { entryFor } from "../reference/index";
import { buildLayers } from "../figure/buildLayers";
import { makeGeom, type Flip } from "../figure/geom";
import { Stage } from "../figure/Stage";
import { describe, refFor, regionFor, sameSel, serializeSel, type Sel } from "../figure/selection";
import { useAtlas, type AtlasInit, type Side } from "../figure/useAtlas";
import type { BuildCtx, PlacedPin } from "../figure/builders/types";
import { resolveAnchor } from "../figure/project";
import { LayerSidebar } from "./atlas/LayerSidebar";
import { DetailPanel } from "./atlas/DetailPanel";

interface AtlasProps {
  /** Room from the URL, or null for `#/atlas` alone. */
  room: RegionId | null;
  topic: Topic | null;
  init: AtlasInit;
  /** Serialised so effects can compare cheaply. */
  initKey: string;
  /** Push (room changes) or replace (everything else) the hash. */
  onNavigate: (hash: string, replace: boolean) => void;
  onTopic: (id: TopicId | null) => void;
}

/** `#/atlas/heart?sheet=sky&sel=gate:30&side=post&topic=pots`, omitting defaults. */
export function atlasHash(room: RegionId | null, sheet: SheetId, sel: Sel | null, side: Side, topic: Topic | null): string {
  const q: string[] = [];
  if (sheet !== "human") q.push(`sheet=${sheet}`);
  if (sel && !(sel.kind === "room" && sel.id === room)) q.push(`sel=${serializeSel(sel)}`);
  const sheetSide: Side = sheetById(sheet).side ?? "ant";
  if (side !== sheetSide) q.push(`side=${side}`);
  if (topic) q.push(`topic=${topic.id}`);
  return `#/atlas${room ? `/${room}` : ""}${q.length ? `?${q.join("&")}` : ""}`;
}

const LINE_WEIGHT = 1.15;
const LABEL_PX = 17;

export function Atlas({ room, topic, init, initKey, onNavigate, onTopic }: AtlasProps) {
  const api = useAtlas(init);
  const { st } = api;
  const draggingRef = useRef(false);
  const coordRef = useRef<HTMLSpanElement>(null);
  const [posts, setPosts] = useState<PlacedPin[]>([]);

  /* ---- URL → state: every hashchange is an external navigation; absent params mean defaults ---- */
  const applied = useRef<string>("");
  useEffect(() => {
    const key = `${initKey}|${room ?? ""}`;
    if (applied.current === key) return;
    applied.current = key;
    const sheet: SheetId = init.sheet ?? "human";
    if (sheet !== st.sheet) api.goSheet(sheet);
    const side: Side = init.side ?? sheetById(sheet).side ?? "ant";
    if (side !== st.side) api.setSide(side);
    const want: Sel | null = init.sel ?? (room ? { kind: "room", id: room } : null);
    if (!sameSel(st.sel, want)) {
      api.select(want);
      if (want?.kind === "room") api.setLayer("rooms", true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initKey, room]);

  /* ---- state → URL (replace, no history) ---- */
  const urlKey = `${st.sheet}|${st.sel ? serializeSel(st.sel) : ""}|${st.side}`;
  const lastUrl = useRef(urlKey);
  useEffect(() => {
    if (lastUrl.current === urlKey) return;
    lastUrl.current = urlKey;
    // A selected room is the URL's room, so this replace agrees with the push made on click.
    const urlRoom = st.sel?.kind === "room" ? st.sel.id : room;
    onNavigate(atlasHash(urlRoom, st.sheet, st.sel, st.side, topic), true);
  }, [urlKey, room, st.sheet, st.sel, st.side, topic, onNavigate]);

  /* ---- selection ---- */
  const stRef = useRef(st);
  stRef.current = st;
  const topicRef = useRef(topic);
  topicRef.current = topic;
  const pick = useCallback(
    (sel: Sel) => (e: React.MouseEvent<SVGElement>) => {
      e.stopPropagation();
      if (draggingRef.current) return;
      api.select(sel);
      if (sel.kind === "room" && sel.id !== room) onNavigate(atlasHash(sel.id, stRef.current.sheet, sel, stRef.current.side, topicRef.current), false);
    },
    [api, onNavigate, room],
  );
  const onRegion = useCallback(
    (id: RegionId) => {
      const sel: Sel = { kind: "room", id };
      api.select(sel);
      api.setLayer("rooms", true);
      onNavigate(atlasHash(id, stRef.current.sheet, sel, stRef.current.side, topicRef.current), false);
    },
    [api, onNavigate],
  );

  /* ---- pins on the plate (live or sample posts) ---- */
  const onPins = useCallback((pins: Pin[], _live: boolean) => {
    const perRegion = new Map<RegionId, number>();
    setPosts(
      pins.map((p, i) => {
        const k = perRegion.get(p.region) ?? 0;
        perRegion.set(p.region, k + 1);
        const base = p.body ?? resolveAnchor(regionById(p.region).anchor);
        const body = p.body ? base : { x: base.x + ((k % 3) - 1) * 0.035, y: base.y - Math.floor(k / 3) * 0.035, z: base.z };
        return { id: p.uri ?? `sample-${i}`, region: p.region, body, demo: p.demo, label: `@${p.handle}: ${p.text.slice(0, 80)}` };
      }),
    );
  }, []);

  /* ---- build the plate ---- */
  const flip: Flip = st.side === "post" ? -1 : 1;
  const g = useMemo(() => makeGeom(flip), [flip]);
  const [x0, x1, y0, y1] = st.view;
  const viewW = x1 - x0;
  const [stW, stH] = st.stage;
  const pxScale = Math.min(stW / (viewW * 100), stH / ((y1 - y0) * 100));
  const fs = (LABEL_PX + st.labelBump) / pxScale;
  const ctx: BuildCtx = useMemo(
    () => ({
      g,
      flip,
      post: st.side === "post",
      sel: st.sel,
      view: st.view,
      viewW,
      organFade: viewW <= 3 ? 1 : viewW >= 8 ? 0 : (8 - viewW) / 5,
      fs,
      pxScale,
      detail: pxScale >= 1.15,
      labelsOn: st.labels,
      lw: LINE_WEIGHT,
      pick,
      rings: st.rings,
      proof: st.sheet === "proof",
      topic,
      pins: posts,
    }),
    [g, flip, st.side, st.sel, st.view, viewW, fs, pxScale, st.labels, pick, st.rings, st.sheet, topic, posts],
  );
  const layers = useMemo(() => buildLayers(ctx, st.on, st.peek, st.lastCenter), [ctx, st.on, st.peek, st.lastCenter]);

  /* ---- panel data ---- */
  const described = useMemo(() => describe(st.sel), [st.sel]);
  const entry = useMemo(() => (st.sel ? entryFor(...refFor(st.sel)) : undefined), [st.sel]);
  const region = useMemo(() => regionFor(st.sel), [st.sel]);
  const lead = st.sel && st.sel.kind !== "room" ? `Pinning this to the ${described.title} (${regionById(region).name.toLowerCase()}).` : `Pinning this to the ${regionById(region).name.toLowerCase()}.`;
  const selKey = st.sel ? serializeSel(st.sel) : "";
  const localPins = st.pins[selKey] ?? [];
  const addPin = useCallback((t: string) => api.addPin(selKey, t), [api, selKey]);
  const removePin = useCallback((i: number) => api.removePin(selKey, i), [api, selKey]);
  const cur = sheetById(st.sheet);

  const onClearTopic = useCallback(() => onTopic(null), [onTopic]);

  return (
    <div className="grid grid-cols-1 md:h-[calc(100vh-var(--header-h))] md:grid-cols-[minmax(190px,230px)_1fr_minmax(230px,300px)]">
      <LayerSidebar
        sheet={st.sheet}
        side={st.side}
        view={st.view}
        on={st.on}
        peek={st.peek}
        topic={topic}
        goSheet={api.goSheet}
        goView={api.goView}
        toggle={api.toggle}
        peekOn={api.peekOn}
        peekOff={api.peekOff}
        clearAll={api.clearAll}
        onClearTopic={onClearTopic}
      />

      <main className="relative flex min-h-[520px] min-w-0 flex-col">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[rgb(28_22_18/.12)] px-5 pb-2 pt-[14px]">
          <div className="flex min-w-0 flex-col gap-[1px]">
            <div className="text-[20px] font-medium">
              <span className="mr-2 text-[13px] text-copper">{String(SHEET_INDEX[st.sheet] ?? 0).padStart(2, "0")}</span>
              {cur.title}
            </div>
            <div className="text-[13px] italic text-inksoft text-pretty">{cur.desc}</div>
          </div>
          <div className="flex flex-wrap items-center gap-[14px] text-[12.5px] text-inksoft">
            <div className="flex flex-none rounded-[2px] border border-[rgb(28_22_18/.3)]">
              {(["ant", "post"] as const).map((s) => (
                <button key={s} type="button" onClick={() => api.setSide(s)} aria-pressed={st.side === s} className="px-[10px] py-[3px] text-[12.5px] text-ink" style={{ background: st.side === s ? "rgb(28 22 18 / .08)" : "transparent" }}>
                  {s === "ant" ? "front" : "back"}
                </button>
              ))}
            </div>
            <div className="flex flex-none items-center whitespace-nowrap rounded-[2px] border border-[rgb(28_22_18/.3)]">
              <button type="button" onClick={api.toggleLabels} className="border-r border-[rgb(28_22_18/.2)] px-[9px] py-[3px] text-[12.5px] text-ink">
                {st.labels ? "labels on" : "labels off"}
              </button>
              <button type="button" onClick={() => api.bumpLabels(-2)} title="smaller labels" className="px-2 py-[3px] text-[12px] text-ink">
                A−
              </button>
              <span className="min-w-[30px] text-center text-[11px] text-inkmute">{LABEL_PX + st.labelBump}px</span>
              <button type="button" onClick={() => api.bumpLabels(2)} title="larger labels" className="px-2 py-[3px] text-[15px] text-ink">
                A+
              </button>
            </div>
            <span ref={coordRef} className="min-w-[150px] text-right tabular-nums">
              x —  y —
            </span>
            <span className="text-[12px] italic text-inkmute">scroll to zoom · drag to pan</span>
          </div>
        </div>
        <div className="relative min-h-[520px] flex-auto bg-paper">
          <Stage g={g} view={st.view} flip={flip} layers={layers} dragging={st.dragging} draggingRef={draggingRef} coordRef={coordRef} onView={api.setView} onDragging={api.setDragging} onBg={api.deselect} onSize={api.setStage} />
        </div>
      </main>

      <DetailPanel
        sel={st.sel}
        described={described}
        entry={entry}
        lens={st.lens}
        setLens={api.setLens}
        deselect={api.deselect}
        localPins={localPins}
        addPin={addPin}
        removePin={removePin}
        region={region}
        topic={topic}
        lead={lead}
        onRegion={onRegion}
        onPins={onPins}
        ringsOn={st.on.has("codon")}
        rings={st.rings}
        toggleRing={api.toggleRing}
      />
    </div>
  );
}

const SHEET_INDEX: Partial<Record<SheetId, number>> = { reg: 1, human: 2, subtle: 3, earth: 4, sky: 5, proof: 6, post: 7, reflex: 8, micro: 9 };
void (0 as unknown as LayerId);
