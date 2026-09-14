import { useCallback, useEffect, useMemo, useState } from "react";
import type { RegionId } from "./atlas/ids";
import { isRegionId } from "./atlas/ids";
import { isTopicId, topicById, type TopicId } from "./atlas/topics";
import { isSheetId } from "./atlas/layers";
import { parseSel, serializeSel } from "./figure/selection";
import type { AtlasInit } from "./figure/useAtlas";
import { StartHere } from "./pages/StartHere";
import { Atlas } from "./pages/Atlas";
import { Recipes } from "./pages/Recipes";
import { TheWhole } from "./pages/TheWhole";
import { Protocol } from "./pages/Protocol";
import { About } from "./pages/About";
import { Reference } from "./pages/Reference";
import { SearchBox } from "./ui/SearchBox";
import { entryBySlug } from "./reference/index";

/* ---------- hash routes ---------- */

type Page = "start" | "atlas" | "recipes" | "reference" | "whole" | "protocol" | "about";

const NAV: readonly { id: Page; label: string }[] = [
  { id: "start", label: "Start here" },
  { id: "atlas", label: "Atlas" },
  { id: "recipes", label: "Recipes" },
  { id: "reference", label: "Reference" },
  { id: "whole", label: "The whole" },
  { id: "protocol", label: "On AT Protocol" },
  { id: "about", label: "About" },
];

const isPage = (s: string | undefined): s is Page => NAV.some((n) => n.id === s);

interface Route {
  page: Page;
  param: string | null;
  query: URLSearchParams;
}

/** `#/atlas/heart?topic=pots` → { page: "atlas", param: "heart", query } */
function parseHash(hash: string): Route {
  const m = /^#\/([a-z]+)(?:\/([^/?#]+))?(?:\?(.*))?$/.exec(hash);
  const page = m?.[1];
  const query = new URLSearchParams(m?.[3] ?? "");
  return isPage(page) ? { page, param: m?.[2] ?? null, query } : { page: "start", param: null, query };
}

const hrefFor = (page: Page, param?: string | null, topic?: TopicId | null): string => {
  const base = param ? `#/${page}/${param}` : `#/${page}`;
  return topic ? `${base}?topic=${topic}` : base;
};

function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    if (!window.location.hash) window.location.replace(hrefFor("start"));
    const on = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}

/* ---------- app ---------- */

export function App() {
  const route = useRoute();
  const [region, setRegion] = useState<RegionId>("heart");
  const [topic, setTopic] = useState<TopicId | null>(null);

  // The hash is the source of truth for the atlas room and recipe filter.
  useEffect(() => {
    if (route.page !== "atlas") return;
    if (route.param && isRegionId(route.param)) setRegion(route.param);
    const t = route.query.get("topic");
    if (t !== null) setTopic(isTopicId(t) ? t : null);
  }, [route]);

  const room: RegionId | null = route.page === "atlas" && route.param && isRegionId(route.param) ? route.param : null;
  const atlasInit = useMemo<AtlasInit>(() => {
    const sheetQ = route.query.get("sheet");
    const sideQ = route.query.get("side");
    return {
      sheet: sheetQ && isSheetId(sheetQ) ? sheetQ : null,
      sel: parseSel(route.query.get("sel")),
      side: sideQ === "post" || sideQ === "ant" ? sideQ : null,
    };
  }, [route.query]);
  const atlasInitKey = `${atlasInit.sheet ?? ""}|${atlasInit.sel ? serializeSel(atlasInit.sel) : ""}|${atlasInit.side ?? ""}`;

  /** The atlas owns its hash: push for room changes, replace for sheet / selection / side. */
  const onNavigate = useCallback((hash: string, replace: boolean) => {
    if (replace) window.history.replaceState(null, "", hash);
    else window.location.hash = hash;
  }, []);

  useEffect(() => {
    const label = NAV.find((n) => n.id === route.page)?.label ?? "";
    const entry = route.page === "reference" && route.param ? entryBySlug(route.param) : undefined;
    document.title =
      route.page === "start" ? "Whole Body Cookbook" : entry ? `${entry.title} · Reference · Whole Body Cookbook` : `${label} · Whole Body Cookbook`;
  }, [route.page, route.param]);

  const goAtlas = (r: RegionId, t: TopicId | null = topic) => {
    window.location.hash = hrefFor("atlas", r, t);
  };

  const onTopicFromRecipes = (id: TopicId) => {
    const t = topicById(id);
    setTopic(id);
    goAtlas(t.regions.find((x) => x !== "whole") ?? "whole", id);
  };

  const onTopicInAtlas = (id: TopicId | null) => {
    setTopic(id);
    window.location.hash = hrefFor("atlas", region, id);
  };

  return (
    <>
      <header className="flex min-h-[var(--header-h)] flex-wrap items-center gap-x-5 gap-y-1 border-b border-rule px-4 py-1">
        <a href={hrefFor("start")} className="sc-ox whitespace-nowrap">
          whole body cookbook
        </a>
        <nav aria-label="Primary" className="flex gap-x-4 overflow-x-auto whitespace-nowrap text-[13px]">
          {NAV.map((n) => {
            const current = route.page === n.id;
            return (
              <a
                key={n.id}
                href={n.id === "atlas" ? hrefFor("atlas", region, topic) : hrefFor(n.id)}
                aria-current={current ? "page" : undefined}
                className={`border-b ${current ? "border-oxblood text-ink" : "border-transparent text-inksoft hover:border-oxblood hover:text-ink"}`}
              >
                {n.label}
              </a>
            );
          })}
        </nav>
        <div className="ml-auto max-sm:basis-full">
          <SearchBox variant="header" />
        </div>
      </header>

      <main className={route.page === "atlas" ? "" : "min-h-[calc(100vh-var(--header-h))]"}>
        {route.page === "start" && <StartHere onPractice={(r) => goAtlas(r, null)} />}
        {route.page === "atlas" && (
          <Atlas room={room} topic={topic ? topicById(topic) : null} init={atlasInit} initKey={atlasInitKey} onNavigate={onNavigate} onTopic={onTopicInAtlas} />
        )}
        {route.page === "recipes" && <Recipes onTopic={onTopicFromRecipes} />}
        {route.page === "reference" && <Reference slug={route.param} />}
        {route.page === "whole" && <TheWhole />}
        {route.page === "protocol" && <Protocol />}
        {route.page === "about" && <About />}
      </main>

      {route.page !== "atlas" && (
        <footer className="border-t border-rule px-4 py-3 text-[12.5px] italic text-inksoft">
          <a href="https://wbc.earth">wbc.earth</a> · MIT · <a href="https://github.com/crs48/whole-body-cookbook">source</a> · a map of
          conversation, not a clinic · US crisis line: call or text 988
        </footer>
      )}
    </>
  );
}
