import { memo, useRef, useState, type KeyboardEvent } from "react";
import type { RegionId } from "../../atlas/ids";
import { CODON_RINGS } from "../../atlas/codon-rings";
import { INK, LENS_COLOR, alpha } from "../../atlas/palette";
import type { Topic } from "../../atlas/topics";
import type { Pin } from "../../atlas/samples";
import { referenceHref, type ReferenceEntry } from "../../reference/index";
import { BskyPanel } from "../../ui/BskyPanel";
import type { Described, Sel } from "../../figure/selection";
import type { LocalPin } from "../../figure/useAtlas";

interface Props {
  sel: Sel | null;
  described: Described;
  entry: ReferenceEntry | undefined;
  lens: number;
  setLens: (i: number) => void;
  deselect: () => void;
  localPins: LocalPin[];
  addPin: (text: string) => void;
  removePin: (i: number) => void;
  region: RegionId;
  topic: Topic | null;
  lead: string;
  onRegion: (id: RegionId) => void;
  onPins: (pins: Pin[], live: boolean) => void;
  ringsOn: boolean;
  rings: ReadonlySet<string>;
  toggleRing: (id: string) => void;
}

export const DetailPanel = memo(function DetailPanel({ sel, described, entry, lens, setLens, deselect, localPins, addPin, removePin, region, topic, lead, onRegion, onPins, ringsOn, rings, toggleRing }: Props) {
  const pinRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState("");
  const submitPin = () => {
    addPin(draft);
    setDraft("");
  };
  const onPinKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitPin();
    }
  };
  const lensIdx = entry ? Math.min(lens, Math.max(0, entry.lenses.length - 1)) : 0;
  const cur = entry?.lenses[lensIdx];
  const what = entry ? (sel?.kind === "tooth" ? `This tooth is assigned to ${sel.pair}. ${entry.what}` : entry.what) : "";

  return (
    <aside className="flex flex-col gap-[18px] border-t border-rule px-4 pb-7 pt-[18px] md:overflow-auto md:border-t-0 md:border-l">
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-2">
          <div className="sc">{described.kind}</div>
          {sel && (
            <button type="button" className="btn link" onClick={deselect}>
              deselect
            </button>
          )}
        </div>
        <div className="text-[24px] font-medium leading-[1.05] text-pretty">{described.title}</div>
        <div className="text-[13.5px] italic text-inksoft text-pretty">{described.sub}</div>
        {entry && (
          <div className="mt-[6px] flex flex-col gap-[10px]">
            {what && <div className="text-[15px] leading-[1.45] text-pretty">{what}</div>}
            {entry.where && (
              <div className="flex gap-2 text-[13px] leading-[1.4] text-[rgb(28_22_18/.8)]">
                <span className="sc flex-none basis-[58px] text-oxblood">where</span>
                <span className="text-pretty">{entry.where}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {entry && (
        <div className="flex flex-col gap-[10px]">
          {entry.lenses.length > 0 && (
            <>
              <div className="flex flex-wrap gap-1">
                {entry.lenses.map((l, i) => (
                  <button
                    key={l.label}
                    type="button"
                    onClick={() => setLens(i)}
                    aria-pressed={i === lensIdx}
                    className="rounded-[11px] border px-[10px] py-[2px] text-[12.5px] hover:border-[rgb(28_22_18/.7)]"
                    style={{ fontVariant: "small-caps", letterSpacing: ".06em", background: i === lensIdx ? alpha(INK, 0.08) : "transparent", color: i === lensIdx ? INK : alpha(INK, 0.65), borderColor: i === lensIdx ? alpha(INK, 0.55) : alpha(INK, 0.18) }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              {cur && (
                <div className="border-l-2 pl-[10px] text-[14px] leading-[1.5] text-pretty" style={{ borderColor: LENS_COLOR[cur.label] ?? INK }}>
                  {cur.text}
                </div>
              )}
            </>
          )}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12.5px]">
            {entry.sources.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="border-b border-dotted border-[rgb(122_46_42/.5)]">
                {s.label} ↗
              </a>
            ))}
            <a href={referenceHref(entry.slug)} className="border-b border-dotted border-[rgb(122_46_42/.5)]">
              read the full entry →
            </a>
          </div>
        </div>
      )}

      {described.lines.length > 0 && (
        <div className="flex flex-col gap-[5px]">
          <div className="sc">on this plate</div>
          {described.lines.map((l) => (
            <div key={l.k} className="flex gap-2 border-t border-[rgb(28_22_18/.1)] pt-[5px] text-[13.5px] leading-[1.35]">
              <span className="sc flex-none basis-[74px]" style={{ color: l.c }}>
                {l.k}
              </span>
              <span className="text-pretty">{l.v}</span>
            </div>
          ))}
        </div>
      )}

      {sel && (
        <>
          <div className="flex flex-col gap-2">
            <div className="rule flex items-baseline justify-between">
              <span className="text-[14px] font-semibold">Your pins</span>
              <span className="text-[11px] italic text-inkmute">{localPins.length ? `${localPins.length} pinned` : "none yet"}</span>
            </div>
            {localPins.map((p, i) => {
              const isLink = /^https?:\/\//i.test(p.t);
              let host = "";
              if (isLink) {
                try {
                  host = new URL(p.t).hostname.replace(/^www\./, "");
                } catch {
                  host = p.t;
                }
              }
              return (
                <div key={`${p.at}-${i}`} className="card flex items-start gap-2 text-[13.5px] leading-[1.35]">
                  <div className="flex min-w-0 flex-auto flex-col gap-[2px]">
                    {isLink ? (
                      <a href={p.t} target="_blank" rel="noopener noreferrer" className="break-all">
                        {host} ↗
                      </a>
                    ) : (
                      <span className="text-pretty text-[rgb(28_22_18/.85)]">{p.t}</span>
                    )}
                  </div>
                  <button type="button" title="remove pin" onClick={() => removePin(i)} className="px-[2px] text-[14px] leading-none text-[rgb(28_22_18/.45)]">
                    ×
                  </button>
                </div>
              );
            })}
            <div className="flex flex-col gap-[5px]">
              <input ref={pinRef} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onPinKey} placeholder="paste a link, or write a note…" className="field" aria-label="Add a local pin" />
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11.5px] italic text-inkmute">saved in this browser · Bluesky, YouTube, articles</span>
                <button type="button" className="btn" onClick={submitPin}>
                  pin
                </button>
              </div>
            </div>
          </div>

          <BskyPanel region={region} topic={topic} lead={lead} onRegion={onRegion} onPins={onPins} />
        </>
      )}

      {ringsOn && (
        <div className="flex flex-col gap-[6px]">
          <div className="rule flex items-baseline justify-between">
            <span className="text-[14px] font-semibold">Codon rings</span>
            <span className="text-[11px] italic text-inkmute">21 subsets of the 64</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {CODON_RINGS.map((r) => {
              const isOn = rings.has(r.id);
              return (
                <button key={r.id} type="button" onClick={() => toggleRing(r.id)} aria-pressed={isOn} className="rounded-[11px] border px-[9px] py-[2px] text-[12px] hover:border-[rgb(28_22_18/.7)]" style={{ background: isOn ? alpha(INK, 0.08) : "transparent", borderColor: isOn ? alpha(INK, 0.55) : alpha(INK, 0.18) }}>
                  {r.name} <span className="text-[10px] text-copper">{r.gates.join(" ")}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-[6px]">
        <div className="sc">coordinate lock</div>
        <div className="text-[13px] leading-[1.45] text-[rgb(28_22_18/.8)] text-pretty">Perineum (0, 0). Crown (0, +1). Soles y = −1. Fingertips x = ±1 with arms easy-open. Flesh inside the unit capsule; aura 1.3–2; Merkaba 2.5; earth disc y ≈ −1.4; gate ring 4.5; zodiac 5.6.</div>
      </div>

      <div className="flex flex-col gap-[3px] rounded-[2px] border border-dashed border-[rgb(28_22_18/.3)] px-3 py-[10px]">
        <div className="sc">side panel · not on the plate</div>
        <div className="text-[14px]">Natal wheel · Enneagram</div>
        <div className="text-[12.5px] italic text-inksoft">Personal charts stay here so the body plate stays one shared space.</div>
      </div>

      <p className="text-[12px] italic text-inkmute">A map of conversation, not a clinic. Nothing here diagnoses, treats, or replaces care. US crisis line: call or text 988.</p>
    </aside>
  );
});
