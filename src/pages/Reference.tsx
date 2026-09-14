import { Suspense, lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { MDXComponents } from "mdx/types";
import { isRegionId, type RegionId } from "../atlas/ids";
import { isTopicId } from "../atlas/topics";
import { regionById } from "../atlas/regions";
import { correspondenceFor } from "../atlas/correspondences";
import { meridianById } from "../atlas/meridians";
import { hdCenter } from "../atlas/gates";
import { ENTRIES, LOADERS, entriesOfKind, entryBySlug, referenceHref, type ReferenceEntry } from "../reference/index";
import { KIND_LABEL, KIND_SINGULAR, REFERENCE_KINDS } from "../reference/schema";
import { mdxComponents } from "../reference/mdxComponents";
import { SearchBox } from "../ui/SearchBox";
import { Card } from "../ui/Card";
import { Pill } from "../ui/Chip";
import { Disclaimer } from "../ui/Disclaimer";

interface Props {
  slug: string | null;
}

/** Where "Open in atlas" lands for an entry: room, plus a selection and sheet when the kind has one. */
function atlasHref(entry: ReferenceEntry): string | null {
  const room: RegionId | null = entry.kind === "region" && entry.id && isRegionId(entry.id) ? entry.id : (entry.regions.find((r) => r !== "whole") ?? entry.regions[0] ?? null);
  const q = new URLSearchParams();
  const id = entry.id ?? "";
  const sel: Record<string, string | null> = {
    meridian: `meridian:${id}`,
    vessel: `vessel:${id}`,
    fascia: entry.id === "anatomy-trains" ? null : `fascia:${id}`,
    reflex: `reflex:${id}`,
    micro: `micro:${id}`,
    tooth: null,
    nerve: `nerve:${id}`,
    chakra: `center:${id}`,
    center: `center:${id}`,
    "hd-center": `hd:${id}`,
    gate: `gate:${id}`,
    planet: `planet:${id}`,
    field: `field:${id}`,
  };
  const selQ = entry.id ? (sel[entry.kind] ?? null) : null;
  if (selQ) q.set("sel", selQ);
  const sheet: Record<string, string> = { gate: "sky", planet: "sky", field: "subtle", reflex: "reflex", micro: "micro", tooth: "micro", fascia: "human" };
  const sh = sheet[entry.kind];
  if (sh) q.set("sheet", sh);
  if (entry.kind === "recipe" && entry.id && isTopicId(entry.id)) q.set("topic", entry.id);
  if (entry.kind === "modality" && entry.id && isTopicId(entry.id)) q.set("topic", entry.id);
  if (!room && !selQ) return null;
  const qs = q.toString();
  return `#/atlas${room ? `/${room}` : ""}${qs ? `?${qs}` : ""}`;
}

type Doc = ComponentType<{ components?: MDXComponents }>;
const lazies = new Map<string, LazyExoticComponent<Doc>>();

/** One React.lazy per entry, cached so re-renders do not re-suspend. */
function docFor(entry: ReferenceEntry): LazyExoticComponent<Doc> | null {
  const cached = lazies.get(entry.slug);
  if (cached) return cached;
  const load = LOADERS[entry.path];
  if (!load) return null;
  const L = lazy(() => load().then((m) => ({ default: m.default })));
  lazies.set(entry.slug, L);
  return L;
}

export function Reference({ slug }: Props) {
  const entry = slug ? entryBySlug(slug) : undefined;
  if (slug && !entry) return <Missing slug={slug} />;
  if (entry) return <Entry entry={entry} />;
  return <Index />;
}

function Index() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-12 pt-6">
      <p className="sc-ox mb-1">whole body cookbook</p>
      <h1 className="h1">Reference</h1>
      <p className="lede mb-4">
        {ENTRIES.length} entries. Rooms of the body, conditions, meridians, nerves, chakras, Human Design centers, and the modalities
        that map them. Everything wikilinks; everything links out. A map of conversation, not a clinic.
      </p>
      <SearchBox variant="page" />
      {REFERENCE_KINDS.map((k) => {
        const list = entriesOfKind(k);
        if (list.length === 0) return null;
        return (
          <section key={k} className="mb-8">
            <h2 className="h2">{KIND_LABEL[k]}</h2>
            {list.length > 20 ? (
              <div className="flex flex-wrap gap-1">
                {list.map((e) => (
                  <a key={e.slug} href={referenceHref(e.slug)} className="chip" title={e.summary}>
                    {e.title}
                  </a>
                ))}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((e) => (
                  <Card key={e.slug} kind={KIND_SINGULAR[e.kind]} title={e.title} onClick={() => (window.location.hash = referenceHref(e.slug))}>
                    {e.summary}
                  </Card>
                ))}
              </div>
            )}
          </section>
        );
      })}
      <Disclaimer />
    </div>
  );
}

function Missing({ slug }: { slug: string }) {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-12 pt-6 prose-page">
      <p className="kicker mb-1">Reference</p>
      <h1 className="h1">No entry yet</h1>
      <p>
        Nothing is written for <span className="mono">{slug}</span>. <a href={referenceHref("")}>Back to the index</a>.
      </p>
    </div>
  );
}

function Entry({ entry }: { entry: ReferenceEntry }) {
  const Doc = docFor(entry);
  const href = atlasHref(entry);
  const corr = entry.kind === "region" && entry.id && isRegionId(entry.id) ? correspondenceFor(entry.id) : undefined;

  return (
    <div className="mx-auto max-w-5xl px-6 pb-12 pt-6">
      <p className="kicker mb-1">
        <a href={referenceHref("")}>Reference</a>{" "}
        · {KIND_SINGULAR[entry.kind]}
      </p>
      <h1 className="h1">{entry.title}</h1>
      <p className="lede mb-3">{entry.summary}</p>
      {entry.where && (
        <p className="mb-3 flex gap-2 text-[13px] leading-[1.4] text-[rgb(28_22_18/.8)]">
          <span className="sc flex-none basis-[58px] text-oxblood">where</span>
          <span className="text-pretty">{entry.where}</span>
        </p>
      )}
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {entry.regions.map((r) => (
          <Pill key={r}>{regionById(r).name}</Pill>
        ))}
        {entry.tags.map((t) => (
          <Pill key={t} className="mono">
            #{t}
          </Pill>
        ))}
        {href && (
          <a href={href} className="btn ml-auto">
            open in atlas
          </a>
        )}
      </div>

      {corr && (
        <div className="mb-4 flex flex-col gap-1">
          <div className="sc">correspondences</div>
          <div className="flex flex-wrap gap-1">
            {corr.meridians?.map((m) => (
              <Pill key={`m-${m}`}>{meridianById(m).name} meridian</Pill>
            ))}
            {corr.hd?.map((c) => (
              <Pill key={`hd-${c}`}>HD {hdCenter(c).name.toLowerCase()}</Pill>
            ))}
            {corr.chakras?.map((c) => (
              <Pill key={`ch-${c}`}>{c}</Pill>
            ))}
            {corr.nerves?.map((n) => (
              <Pill key={`n-${n}`}>{n}</Pill>
            ))}
            {corr.folk?.map((f) => (
              <Pill key={`f-${f}`} className="italic">
                {f}
              </Pill>
            ))}
          </div>
          <p className="text-[13px] italic text-inksoft">{corr.note}</p>
        </div>
      )}

      <article className="prose-page">
        {Doc ? (
          <Suspense fallback={<p className="text-inksoft">Loading…</p>}>
            <Doc components={mdxComponents} />
          </Suspense>
        ) : (
          <p className="text-inksoft">This entry could not be loaded.</p>
        )}
      </article>

      {(entry.wikipedia || entry.backlinks.length > 0) && (
        <aside className="mt-8 grid gap-4 border-t border-rule pt-4 text-[0.9rem] sm:grid-cols-2">
          {entry.wikipedia && (
            <div>
              <p className="kicker-sm mb-1 text-inksoft">Elsewhere</p>
              <a href={entry.wikipedia} target="_blank" rel="noopener noreferrer">
                Wikipedia
              </a>
            </div>
          )}
          {entry.backlinks.length > 0 && (
            <div>
              <p className="kicker-sm mb-1 text-inksoft">Linked from</p>
              <ul className="flex flex-wrap gap-x-3 gap-y-1">
                {entry.backlinks.map((b) => {
                  const e = entryBySlug(b);
                  return (
                    <li key={b}>
                      <a href={referenceHref(b)}>{e?.title ?? b}</a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </aside>
      )}
      <Disclaimer />
    </div>
  );
}
