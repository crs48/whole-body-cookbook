import type { Pin } from "../atlas/samples";
import { regionById } from "../atlas/regions";
import { postWebUrl } from "../bsky/search";

interface PinCardProps {
  pin: Pin;
  onRegion?: (id: Pin["region"]) => void;
}

const when = (iso: string): string => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

/** One pinned post in the design's pin box. Samples are labelled; live posts link to Bluesky. */
export function PinCard({ pin, onRegion }: PinCardProps) {
  const region = regionById(pin.region);
  return (
    <article className="card text-[13.5px] leading-[1.35]">
      <header className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-[12px] text-inksoft">
        <span className="mono">@{pin.handle}</span>
        <span className="flex items-center gap-2">
          {pin.demo && <span className="sc text-copper">sample</span>}
          {onRegion ? (
            <button type="button" className="btn link not-italic" onClick={() => onRegion(pin.region)}>
              {region.name}
            </button>
          ) : (
            <span>{region.name}</span>
          )}
          <time dateTime={pin.createdAt}>{when(pin.createdAt)}</time>
        </span>
      </header>
      <p className="mt-1 text-pretty text-[rgb(28_22_18/.85)]">{pin.text}</p>
      {pin.uri && (
        <p className="mt-1 text-[12.5px]">
          <a href={postWebUrl(pin.uri)} target="_blank" rel="noopener noreferrer" className="border-b border-dotted border-[rgb(122_46_42/.5)]">
            open on Bluesky ↗
          </a>
        </p>
      )}
    </article>
  );
}
