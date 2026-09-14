/**
 * Community pins for a room: live Bluesky posts tagged to it (or labelled
 * samples), and a composer that opens Bluesky with the tags in place.
 */
import { useEffect, useMemo, useState } from "react";
import type { RegionId } from "../atlas/ids";
import { regionById } from "../atlas/regions";
import type { Pin } from "../atlas/samples";
import type { Topic } from "../atlas/topics";
import { POST_MAX_GRAPHEMES, composeText, graphemeCount, openCompose, withRequiredTags } from "../bsky/compose";
import { samplePinsFor, searchPins, type SearchOutcome } from "../bsky/search";
import { SITE_TAG, regionTag, topicTags } from "../bsky/tags";
import { PinCard } from "./PinCard";

interface Props {
  region: RegionId;
  topic: Topic | null;
  /** First line of the composer, e.g. "Pinning this to the lung meridian (lungs)." */
  lead?: string;
  onRegion?: (id: RegionId) => void;
  onPins?: (pins: Pin[], live: boolean) => void;
}

export function BskyPanel({ region, topic, lead, onRegion, onPins }: Props) {
  const r = regionById(region);
  const [outcome, setOutcome] = useState<SearchOutcome | null>(null);
  const [loading, setLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [draft, setDraft] = useState(() => composeText(region, topic, lead));

  useEffect(() => setDraft(composeText(region, topic, lead)), [region, topic, lead]);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    searchPins(region, topic, ac.signal).then((o) => {
      if (ac.signal.aborted) return;
      setOutcome(o);
      setLoading(false);
    });
    return () => ac.abort();
  }, [region, topic, reloadKey]);

  const samples = useMemo(() => samplePinsFor(region, topic), [region, topic]);
  const live = outcome?.status === "live";
  const pins: Pin[] = live ? outcome.posts : samples;
  useEffect(() => onPins?.(pins, live), [pins, live, onPins]);

  const finalText = withRequiredTags(draft, region, topic);
  const count = graphemeCount(finalText);
  const over = count > POST_MAX_GRAPHEMES;

  const status = (): string => {
    if (loading) return `looking for ${outcome?.query ?? "the tags"} on Bluesky…`;
    if (!outcome) return "";
    if (outcome.status === "live") return `${outcome.posts.length} live post${outcome.posts.length === 1 ? "" : "s"} tagged ${outcome.query}`;
    if (outcome.status === "empty") return `no live posts yet for ${outcome.query} · showing samples`;
    return `live search is blocked from this host (${outcome.error}) · showing samples`;
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="rule flex items-baseline justify-between">
        <span className="text-[14px] font-semibold">Community · Bluesky</span>
        <span className="text-[11px] italic text-inkmute">#{r.tag}</span>
      </div>
      <p className="text-[11.5px] italic text-inkmute">{status()}</p>
      {pins.length === 0 && !loading && <p className="text-[13px] italic text-inksoft">Nothing pinned to this room yet. Be the first note.</p>}
      {pins.slice(0, 30).map((p, i) => (
        <PinCard key={p.uri ?? `s-${i}`} pin={p} onRegion={onRegion} />
      ))}
      <form
        className="mt-1 flex flex-col gap-[5px]"
        onSubmit={(e) => {
          e.preventDefault();
          if (!over) openCompose(finalText);
        }}
      >
        <textarea id="compose-text" value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} className="field resize-y" aria-label="Pin this room on Bluesky" />
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11.5px] italic text-inkmute">
            always appended: <span className="mono not-italic">#{SITE_TAG} #{regionTag(region)}</span>
            {topicTags(topic).length > 0 && <span className="mono not-italic"> {topicTags(topic).map((t) => `#${t}`).join(" ")}</span>}
          </span>
          <span className={`text-[11px] ${over ? "text-hot" : "text-inkmute"}`} aria-live="polite">
            {count}/{POST_MAX_GRAPHEMES}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="submit" className="btn bsky" disabled={over}>
            open Bluesky composer
          </button>
          <button type="button" className="btn" onClick={() => setReloadKey((k) => k + 1)} disabled={loading}>
            refresh
          </button>
        </div>
      </form>
    </div>
  );
}
