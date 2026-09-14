import { memo } from "react";
import { CAMS, CAM_BUTTONS, sameView, type View } from "../../atlas/cameras";
import { FAMILIES, SHEETS, type LayerId, type SheetId } from "../../atlas/layers";
import { alpha, INK } from "../../atlas/palette";
import type { Topic } from "../../atlas/topics";
import { Chip } from "../../ui/Chip";

interface Props {
  sheet: SheetId;
  side: "ant" | "post";
  view: View;
  on: ReadonlySet<LayerId>;
  peek: LayerId | null;
  topic: Topic | null;
  goSheet: (id: SheetId) => void;
  goView: (v: View) => void;
  toggle: (id: LayerId) => void;
  peekOn: (id: LayerId) => void;
  peekOff: (id: LayerId) => void;
  clearAll: () => void;
  onClearTopic: () => void;
}

export const LayerSidebar = memo(function LayerSidebar({ sheet, side, view, on, peek, topic, goSheet, goView, toggle, peekOn, peekOff, clearAll, onClearTopic }: Props) {
  return (
    <aside className="flex flex-col gap-[18px] border-b border-rule px-3 pb-7 pt-[18px] md:overflow-auto md:border-b-0 md:border-r">
      <div className="flex flex-col gap-[2px]">
        <div className="sc-ox">whole body cookbook</div>
        <div className="text-[22px] font-medium leading-[1.05]">Layer atlas</div>
        <div className="text-[13px] italic text-inksoft">One body space · origin at the perineum · +x is the subject’s left</div>
      </div>

      <div className="flex flex-col gap-[6px]">
        <div className="sc">sheets</div>
        <div className="flex flex-col gap-[3px]">
          {SHEETS.map((s, i) => {
            const active = sheet === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goSheet(s.id)}
                aria-pressed={active}
                className="flex items-baseline justify-between gap-2 rounded-[2px] border px-[9px] py-[5px] text-left text-[14px] hover:border-[rgb(28_22_18/.6)]"
                style={{ background: active ? alpha(INK, 0.08) : "transparent", borderColor: active ? alpha(INK, 0.55) : alpha(INK, 0.18) }}
              >
                <span className="flex items-baseline gap-2">
                  <span className="text-[11px] tabular-nums text-copper">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s.title}</span>
                </span>
                <span className="text-[11px] italic text-inkmute">{s.cam === "reg" ? "±6.6" : s.side === "post" ? "human · back" : s.cam}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-[6px]">
        <div className="sc">camera</div>
        <div className="flex flex-wrap gap-1">
          {CAM_BUTTONS.map((k) => {
            const active = sameView(view, CAMS[k].v);
            return (
              <button key={k} type="button" onClick={() => goView(CAMS[k].v)} aria-pressed={active} className="btn flex-auto" style={{ background: active ? alpha(INK, 0.08) : "transparent" }}>
                {CAMS[k].label}
              </button>
            );
          })}
        </div>
        <div className="text-[11px] italic text-inkmute">{side === "post" ? "posterior · viewer’s left is the subject’s left" : "anterior · +x on the viewer’s right"}</div>
      </div>

      {topic && (
        <div className="flex flex-col gap-[4px] rounded-[2px] border border-dashed border-[rgb(28_22_18/.3)] px-3 py-2">
          <div className="sc">recipe · overlay</div>
          <div className="flex items-baseline justify-between gap-2 text-[14px]">
            <span>{topic.name}</span>
            <button type="button" className="btn link" onClick={onClearTopic}>
              clear
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-[14px]">
        <div className="flex items-baseline justify-between">
          <div className="sc">layers</div>
          <button type="button" className="btn link" onClick={clearAll}>
            clear
          </button>
        </div>
        {FAMILIES.map((f) => (
          <div key={f.id} className="flex flex-col gap-[6px]">
            <div className="rule flex items-baseline justify-between">
              <span className="text-[14px] font-semibold tracking-[.02em]">{f.label}</span>
              <span className="text-[11px] italic text-inkmute">{f.note}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {f.layers.map((l) => {
                const isOn = on.has(l.id);
                const peeking = peek === l.id && !isOn;
                return (
                  <Chip
                    key={l.id}
                    pressed={isOn}
                    peek={peeking}
                    swatch={isOn || peeking ? l.color : alpha(l.color, 0.35)}
                    tag={l.tag}
                    title={l.auto ? "shown after a meridian is selected" : isOn ? l.label : `${l.label} — hover to preview`}
                    onClick={() => toggle(l.id)}
                    onMouseEnter={() => peekOn(l.id)}
                    onMouseLeave={() => peekOff(l.id)}
                    style={l.auto ? { opacity: 0.6 } : undefined}
                  >
                    {l.label}
                  </Chip>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
});
