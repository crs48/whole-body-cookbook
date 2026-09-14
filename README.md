# Whole Body Cookbook

**https://wbc.earth** · an [AT Protocol](https://atproto.com) atlas.

People pin Bluesky posts to rooms of a body. Meridians, the autonomic nervous
system, conditions, Human Design, chakras, astrology, and lived overlays share
one figure in one coordinate frame. The 2D plate is a camera on that frame; a
3D figure will be another camera with the same region ids and landmarks.

## Why a cookbook

A cookbook does not claim the recipes are true. It claims they were cooked.
Each recipe here is a bundle: a condition or tradition, the body rooms it tends
to occupy, and the threads already talking there. Folk correspondences sit
beside lived-experience tags so they can be compared, not collapsed.

## Dual-write

- **Layer A (shipped).** A pin is an ordinary `app.bsky.feed.post` carrying
  `#WholeBodyCookbook` and a region tag such as `#wbc-heart`. The site opens
  `https://bsky.app/intent/compose?text=…` with the tags in place and reads
  the feed back from `https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts`.
  If the public API is unreachable the atlas shows sample pins, labelled
  `sample`. Samples are never presented as live posts.
- **Layer B (schema only).** `lexicons/earth.wbc.pin.json` and
  `lexicons/earth.wbc.recipe.json` describe custom records under the
  `earth.wbc` namespace (reverse of **wbc.earth**). No records are written
  until OAuth exists. Region ids in the record are the same strings as the
  hashtags and the atlas.

## Run it

```bash
pnpm install && pnpm dev
```

`pnpm build` type-checks and emits a static `dist/`. `pnpm preview` serves it.
Node 22, pnpm, TypeScript strict, Vite, React 19, Tailwind v4. No server, no
analytics, no accounts.

## Deploy

GitHub Actions (`.github/workflows/pages.yml`) builds on every push to `main`
and publishes `dist/` to GitHub Pages. To enable it once:

1. Repository → Settings → Pages → Source: **GitHub Actions**.
2. Custom domain: `wbc.earth` (the file `public/CNAME` keeps it set). Tick
   **Enforce HTTPS** once the certificate is issued.
3. DNS: apex `wbc.earth` → the GitHub Pages A/AAAA records (or ALIAS to
   `crs48.github.io`); `www` → CNAME `crs48.github.io`.

Canonical URL is `https://wbc.earth`. The project URL
`https://crs48.github.io/whole-body-cookbook/` keeps redirecting while GitHub
serves it.

## The Layer atlas

The atlas page is a port of the Claude Design project *Body Atlas multi-layer
system* (`Body Atlas.dc.html`). Three panes:

- **Sheets, cameras, layers.** Nine sheets (registration, human, subtle,
  earth, sky, overlay proof, posterior, reflex, head maps), each a camera plus
  a layer set. Seven families of layers: structure, channels, centers, field,
  microsystems, earth + sky, sheet. Hover a chip to preview a layer; click to
  keep it.
- **The plate.** One SVG in body units. Scroll to zoom about the cursor, drag
  to pan, click a room, meridian, center, gate, planet or fascia line. Labels
  stay a constant size on screen. Front / back flips X so the viewer's left is
  the subject's left on the posterior plate.
- **The detail panel.** Knowledge from the MDX entry (what, where, lens tabs:
  body / tradition / evidence / practice / symbol, sources, a link to the full
  entry), what else sits on the plate at that spot, your own pins (saved in
  this browser), the Bluesky community feed and composer for the room, and
  codon-ring toggles when the codon layer is on.

Geometry lives in `src/atlas/plate.ts`, cameras in `src/atlas/cameras.ts`,
families / order / sheets in `src/atlas/layers.ts`, the drawing code in
`src/figure/builders/*`. The URL mirrors the state:
`#/atlas/heart?sheet=sky&sel=gate:30&side=post&topic=pots`.

## Repo shape

```
lexicons/           earth.wbc.pin.json, earth.wbc.recipe.json
src/atlas/          ids, regions, meridians, nerves, plate (design geometry),
                    cameras, layers (families · order · sheets), palette,
                    gates (64 = hexagrams = gene keys), codon-rings,
                    correspondences, landmarks.json, topics, practices,
                    ecosystem, samples
src/figure/         geom (body units → SVG), prims, builders/* (one file per
                    family), buildLayers, Stage.tsx, useAtlas, selection,
                    project.ts (landmark anchors for pins)
src/bsky/           compose, search, tags
src/reference/      MDX index, frontmatter parser, MiniSearch, MDX components
src/pages/          StartHere, Atlas (+ atlas/LayerSidebar, atlas/DetailPanel),
                    Recipes, Reference, TheWhole, Protocol, About
src/ui/             Chip, Card, PinCard, BskyPanel, Disclaimer, SearchBox
content/            172 MDX reference entries (see Reference below)
scripts/            import-knowledge.mjs (one-off KB → MDX migration) and kb/
remark-wikilinks.ts [[wikilink]] remark plugin for the MDX pipeline
vite-reference-raw.ts serves content/**/*.mdx sources as `virtual:reference-raw`
```

### Body space

One shared frame. Perineum at the origin, crown at `y = +1`, soles at
`y = -1`, fingertips toward `x = ±1` with arms easy-open. `+X` is the
subject's left (viewer's right on the anterior plate), `+Z` toward the viewer.
The aura is a larger radius in the same numbers, the Earth is negative Y past
the feet, and the zodiac / 64-gate mandala are circles centred on the origin.
Pins, layer polylines, and centers are stored against landmarks
(`src/atlas/landmarks.json`, with `z`), never in SVG units.

Camera stops: `Human · Subtle · Earth · Sky`. The SVG `viewBox` animates; the
data does not move.

## Roadmap

1. OAuth AppView (Statusphere pattern) to write `earth.wbc.pin` records.
2. Jetstream consumer on `#WholeBodyCookbook` and the `earth.wbc.pin` collection.
3. Custom feed generator.
4. 3D figure with the same region ids and landmark ids (WebGL / mesh out of
   scope for now; the data model is already 3D-ready).
5. DNS TXT on `_lexicon.wbc.earth` proving lexicon authority for `earth.wbc.*`.

Also out of scope for now: the Log / Query / Compose chat verbs described on
*The whole*, payments, a native app, a photo-calorie scanner.

## Reference

`content/` holds one MDX file per entry, grouped by kind. The folder is the
kind; the filename is the slug and the route (`#/reference/<slug>`).

```
content/region/heart.mdx          kind: region     id = atlas region id
content/recipe/pots.mdx           kind: recipe     id = topic id
content/modality/astrology.mdx    kind: modality   id = topic id (gene-keys has none)
content/meridian/liver-meridian.mdx
content/vessel/du.mdx             kind: vessel
content/fascia/sfl.mdx            kind: fascia     (anatomy-trains is the overview)
content/nerve/vagus.mdx
content/chakra/anahata.mdx
content/center/soul-star.mdx      kind: center     (soul-star, earth-star, dantien)
content/hd-center/hd-g.mdx
content/gate/gate-30.mdx          kind: gate       id = "30"
content/planet/sun.mdx            kind: planet
content/field/aura.mdx            kind: field
content/reflex/foot.mdx           kind: reflex
content/micro/iris-map.mdx        kind: micro
content/tooth/tooth-chart.mdx     kind: tooth
```

Frontmatter (scalars and flat lists only):

```yaml
---
id: heart                # atlas id, when the entry describes one
kind: region
title: Heart
summary: One sentence for cards and search results.
where: (+0.03, +0.42), slightly left of midline behind the sternum.
regions: [heart, lungs]  # rooms this entry touches
tags: [wbc-heart]
aliases: [cardiac]       # extra search terms
wikipedia: https://en.wikipedia.org/wiki/Heart
---
```

Body conventions: the first paragraph is the entry's *what* (shown in the
atlas panel); `## Body`, `## Tradition`, `## Evidence`, `## Practice`,
`## Symbol` sections become the panel's lens tabs; `## In the atlas` carries
wikilinks; `## Sources` is a markdown list (extracted into the entry); and
`<Protocol>…</Protocol>` wraps supplements, binders, or distillation so they
read as author protocol from the v0.1 board.

The design's knowledge base was migrated into these files once with
`node scripts/import-knowledge.mjs` (source kept at `scripts/kb/`). Edit the
MDX, not the script.

Wikilinks: `[[heart]]`, `[[heart|the heart]]`, `[[wp:Vagus nerve|the vagus]]`
(Wikipedia). Internal targets must exist; a dangling link warns in `pnpm dev`
and fails `pnpm build`. Backlinks are computed at load time.

Search is client-side (MiniSearch) over title, summary, tags, aliases, and
body. Press `/` anywhere to focus the header search. No analytics, no server.

TypeScript keeps structure (ids, tags, geometry, region lists in
`src/atlas/*.ts`); MDX keeps prose. Do not invent clinical claims: entries
describe what people talk about in a room and link out.

## Historical sources

Two Miro boards fed the copy. They are sources, not runtime dependencies.

- Practices (v0.1): https://miro.com/app/board/uXjVNol7iis=/
- Product map: https://miro.com/app/board/uXjVN084J-c=/

The earlier vanilla-JS sketch lives in git history under `web/`.

## Medical note

This is a map of conversation. It is not diagnosis, treatment, or advice.
Practices that mention supplements, binders, or distilled water are one
author's protocol from the v0.1 board, not a prescription. If you are in crisis
in the US, call or text **988**.

## License

MIT. See `LICENSE`.
