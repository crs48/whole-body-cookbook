# Claude Code — rebuild Whole Body Cookbook

Rebuild **Whole Body Cookbook** as a public, MIT-licensed, TypeScript + Tailwind site on the AT Protocol, deployed with GitHub Pages at **https://wbc.earth**.

We own **wbc.earth**. That is the public origin of the site and the authority for the lexicon namespace. Reverse-domain NSIDs:

- `earth.wbc.pin`
- `earth.wbc.recipe`

Do not use `app.wholebodycookbook.*`. The old sketch files keep that name only as historical notes; the rebuild publishes `earth.wbc.*`.

Existing sketch (vanilla JS, no build): https://github.com/crs48/whole-body-cookbook  
Owner: `crs48`. Keep that repo or replace `web/` in place. Do not invent a new org.

This file is the implementation spec. Implement it. Do not wait for more product questions.

Companion: `CLAUDE_DESIGN.md` is the visual system. Match it.

---

## Stack (lock)

| Piece | Choice |
| --- | --- |
| Language | TypeScript, `strict` |
| Bundler | Vite 6+ |
| UI | React 19 is fine. Vanilla TS + lit is also fine. Pick one and stay. Prefer React if you need a component tree. |
| CSS | Tailwind v4 (`@tailwindcss/vite`). Extend theme with the tokens below. No CSS-in-JS. |
| Deploy | GitHub Pages via GitHub Actions. Static only for v1. |
| Package manager | `pnpm` |
| License | MIT (already in repo) |
| Node | 22 |

v1 **has no server**. No OAuth yet. No custom AppView process. Browser talks to `https://public.api.bsky.app` and opens `https://bsky.app/intent/compose`.

Do not add Next.js, Prisma, Supabase, Auth.js, or a marketing landing generator.

---

## Repo shape after rebuild

```
.
├── CLAUDE_CODE.md
├── CLAUDE_DESIGN.md
├── LICENSE
├── README.md
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
├── index.html
├── public/
│   └── CNAME                 # wbc.earth
├── lexicons/
│   ├── earth.wbc.pin.json
│   └── earth.wbc.recipe.json
├── src/
│   ├── main.ts
│   ├── App.tsx
│   ├── styles.css            # @import "tailwindcss" + a few raw tokens
│   ├── atlas/
│   │   ├── ids.ts              # region / layer / landmark id unions
│   │   ├── regions.ts
│   │   ├── meridians.ts
│   │   ├── nerves.ts
│   │   ├── layers.ts           # families, draw styles, default opacity
│   │   ├── scales.ts           # camera stops: human, subtle, earth, sky
│   │   ├── codon-rings.ts      # 21 Gene Keys codon rings → gate numbers
│   │   ├── gates.ts            # 64 gates = hexagrams = gene keys
│   │   ├── correspondences.ts  # chakra ↔ HD ↔ organ ↔ region
│   │   ├── landmarks.json      # body-space points, z=0 in v1
│   │   ├── topics.ts
│   │   ├── practices.ts
│   │   ├── ecosystem.ts
│   │   └── samples.ts
│   ├── figure/
│   │   ├── Figure.tsx          # 2D anterior view only in v1
│   │   ├── project.ts          # body space → current view
│   │   └── views/anterior.svg  # groups: landmarks, regions, layers, pins
│   ├── bsky/
│   │   ├── compose.ts        # intent URL builder
│   │   ├── search.ts         # public.api.bsky.app searchPosts
│   │   └── tags.ts
│   ├── pages/
│   │   ├── StartHere.tsx
│   │   ├── Atlas.tsx
│   │   ├── Recipes.tsx
│   │   ├── TheWhole.tsx
│   │   ├── Protocol.tsx
│   │   └── About.tsx
│   └── ui/
│       ├── Chip.tsx
│       ├── Card.tsx
│       ├── PinCard.tsx
│       └── Disclaimer.tsx
└── .github/workflows/pages.yml
```

GitHub Pages: build `pnpm build`, publish `dist/`. Custom domain is **wbc.earth**.

- `public/CNAME` contains exactly `wbc.earth`
- `vite.config.ts` `base: '/'` (custom domain, not project-page path)
- DNS: apex + `www` CNAME/ALIAS to GitHub Pages (`crs48.github.io`)
- Enforce HTTPS on the Pages custom domain

Also keep the project URL `https://crs48.github.io/whole-body-cookbook/` as a redirect if GitHub still serves it; canonical is `https://wbc.earth`.

---

## Tailwind tokens

```ts
// theme.extend.colors
paper: "#f3ead6",
paper2: "#e7d9b8",
ink: "#1c1612",
inksoft: "#4a3f35",
rule: "#c9b896",
oxblood: "#7a2e2a",
verdigris: "#2f6b5a",
copper: "#b56a3c",
gold: "#c4a15a",
nerve: "#6b4c9a",
meridian: "#c45a3a",
hot: "#d4533c",
```

Fonts via `index.html` Google Fonts (or fontsource):

- Fraunces
- Source Serif 4
- IBM Plex Mono

Paper grain: keep a faint SVG noise overlay on `body` (see current `web/styles.css`).

---

## Routes

Client state is enough. Query string optional:

- `#/start`
- `#/atlas/:regionId?`
- `#/recipes`
- `#/whole`
- `#/protocol`
- `#/about`

Default hash: `#/start`.

Header nav labels: Start here · Atlas · Recipes · The whole · On AT Protocol · About.

---

## AT Protocol — v1 behavior

### Layer A (ship this)

Compose URL:

```
https://bsky.app/intent/compose?text=${encodeURIComponent(text)}
```

Always append:

```
#WholeBodyCookbook #wbc-{regionTag}
```

plus any topic tags (e.g. `#POTS`, `#actuallyautistic`).

Region tags:

| id | tag |
| --- | --- |
| crown | wbc-crown |
| brain | wbc-brain |
| face | wbc-face |
| throat | wbc-throat |
| heart | wbc-heart |
| lungs | wbc-lungs |
| solar-plexus | wbc-solar |
| stomach | wbc-stomach |
| liver | wbc-liver |
| spleen | wbc-spleen |
| intestines | wbc-gut |
| kidneys | wbc-kidney |
| spine | wbc-spine |
| pelvis | wbc-pelvis |
| left-arm | wbc-larm |
| right-arm | wbc-rarm |
| hands | wbc-hands |
| left-leg | wbc-lleg |
| right-leg | wbc-rleg |
| feet | wbc-feet |
| skin | wbc-skin |
| autonomic | wbc-ans |
| whole | wbc-whole |

Search:

```
GET https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts
  ?q=%23wbc-heart+%23WholeBodyCookbook
  &limit=30
```

CORS: the public API is intended for browsers. If it 403s, fail soft and show `SAMPLE_PINS` filtered to the region. Label them `sample`. Never fake live posts as live.

Parse returned posts for `author.handle`, `record.text`, `record.createdAt`, `uri`.

### Layer B (schema only in v1)

Keep both lexicon files at repo root `lexicons/`. Do not write records until OAuth exists.

NSID authority is **wbc.earth** (reverse: `earth.wbc`). Publish proof the same way other Atmosphere apps do: a DNS TXT record on `_lexicon.wbc.earth` (or the current atproto lexicon-authority convention) binding the namespace to the publishing DID.

Proposed records:

`earth.wbc.pin`

```json
{
  "$type": "earth.wbc.pin",
  "region": "heart",
  "side": "midline",
  "systems": ["cardiovascular", "meridian"],
  "meridians": ["heart", "pericardium"],
  "topics": ["pots", "anxiety"],
  "text": "Standing heart-rate jump. Compression as ritual.",
  "post": "at://did:plc:…/app.bsky.feed.post/…",
  "tags": ["POTS", "wbc-heart", "WholeBodyCookbook"],
  "createdAt": "2026-09-12T16:00:00.000Z"
}
```

`earth.wbc.recipe` — title, summary, topic, regions[], ingredients[{name,kind,note}], links[{href,label,network}].

Document this on the Protocol page. Roadmap in README:

1. OAuth AppView (Statusphere pattern) to write pin records.
2. Jetstream consumer on `#WholeBodyCookbook` + the collection.
3. Custom feed generator.
4. 3D figure, same region ids.
5. DNS TXT on wbc.earth proving lexicon authority for `earth.wbc.*`.

The domain exists. Treat `earth.wbc.*` as the real NSID family. Rename any leftover `app.wholebodycookbook.*` files during the rebuild.

---

## Data you must ship

Copy these into `src/atlas/*`. Do not drop fields.

### Fields (Start here)

Stars, Mind, Body, Earth.

### Twelve practices

1. **Slow down and acknowledge the body might be kinda fucked up right now** (mind → whole, autonomic, brain)  
   Nothing is broken that needs a hero. A fighter after a war has cuts. Living on Earth means cuts. Stop pushing so hard. Take time to heal.  
   It can take decades to notice the pattern. Attention, energy, socializing — keep pushing until the body will not.

2. **Trust yourself** (mind → solar-plexus, heart)  
   Skeptical debate is allowed. For your own experience, trust that above anyone else's map.

3. **Drink distilled water** (earth → kidneys)  
   Distiller + pre-filter. Chlorine, radon, fluoride, lead, PFAS. Author protocol, not a prescription.

4. **Eliminate most skincare** (earth → skin)  
   Diet, movement, mild hand soap. Skin is a boundary and an organ.

5. **Positive self talk** (mind → face, brain, heart)  
   No objective rules. Morning drill: non-dominant hand toothbrush. Left eye in the mirror — “Hey. It's ok. I love you. Thank you for doing your best.”

6. **Move daily** (body → spine, legs, heart, lungs)  
   Walk, sport, Beat Saber. Aerobic if you can, twenty minutes. Sweat is allowed.

7. **Feel your body** (body → skin, whole, autonomic)  
   Touch it. Sit awareness on the uncomfortable spot. Most feelings crest in about ninety seconds if they are actually felt.

8. **Cut down inflammatory food** (earth → intestines, throat, liver)  
   Sugars, starches, many oils. Coconut and greens as a simple counter-weight. Board signal: post-nasal drip easing.

9. **Be open to feeling as good as you want** (stars → heart, crown)  
   Can you prove the ceiling?

10. **Digital detox** (mind → brain, hands)  
    Social, porn, 24/7 work — moderation at least. The cookbook lives on a network. That tension stays.

11. **Learn to poop, and binders** (earth → intestines)  
    Easy elimination. Binders so dumped tissue load does not reabsorb. Board protocol, not a clinic note.

12. **Vitamin D3 and magnesium** (earth → whole)  
    Short list from the board.

Clicking a practice sets `region` and navigates to Atlas.

### Recipes / topics

| id | name | kind | regions | meridians | tags |
| --- | --- | --- | --- | --- | --- |
| depression | Depression | condition | brain, heart, liver, intestines, spine | liver, heart, spleen | depression, WholeBodyCookbook |
| anxiety | Anxiety | condition | heart, lungs, solar-plexus, autonomic, brain | heart, pericardium, lung, kidney | anxiety, WholeBodyCookbook |
| autism | Autism | condition | brain, skin, intestines, hands, face | spleen, stomach | autism, actuallyautistic, WholeBodyCookbook |
| adhd | ADHD | condition | brain, crown, solar-plexus, hands | gallbladder, liver | ADHD, WholeBodyCookbook |
| pots | POTS / dysautonomia | condition | heart, autonomic, spine, brain, feet | heart, kidney, triple-warmer | POTS, dysautonomia, WholeBodyCookbook |
| mobility | Mobility | lived | spine, pelvis, left-leg, right-leg, feet, hands | bladder, gallbladder, stomach | mobility, disability, WholeBodyCookbook |
| astrology | Astrology | tradition | whole, crown, heart | — | astrology, WholeBodyCookbook |
| human-design | Human Design | tradition | crown, brain, throat, heart, solar-plexus, pelvis | — | humandesign, WholeBodyCookbook |
| chinese-medicine | Chinese medicine | tradition | whole, liver, heart, lungs, spleen, kidneys | twelve regular | TCM, acupuncture, WholeBodyCookbook |
| homeopathy | Homeopathy | tradition | whole | — | homeopathy, WholeBodyCookbook |
| mystical | Mystical traditions | tradition | crown, spine, heart, pelvis, whole | — | mysticism, kundalini, WholeBodyCookbook |

Blurbs live in the current `web/data/atlas.js`. Keep that tone.

### Meridians (twelve regular)

lung, large-intestine, stomach, spleen, heart, small-intestine, bladder, kidney, pericardium, triple-warmer, gallbladder, liver — with element + organ + region lists from `web/data/atlas.js`.

### Nerves

vagus, sympathetic, enteric, sciatic — same file.

### The whole

**Audiences:** initial community, CPTSD, CFS, artists improving dexterity, chronic illness.

**Chat AI:**  
- Log — food and supplements as you take them; photo/scan → macros.  
- Query — ask, get recommendations that point at body rooms.  
- Compose — write a recipe by logging the process as you go.

**Money:** subscriptions, sell to practitioners, donations, sponsorships/brand deals.

**Forms:** physical book, physical space, retreat, online course.

**Concern:** “Is this TMI?” / flip: interdependency graph as one-stop shop.

Do not build Log/Query/Compose in v1. Describe them on The whole page only.

### Sample pins

Keep the six demo posts in `web/data/atlas.js` (POTS heart, depression liver, ADHD brain, autistic skin, anxiety lungs, mobility spine).

---

## Figure: one atlas, many views (2D now, 3D later)

**Principle:** one body model, many drawings of it. 2D is a camera. 3D is another camera. Pins, layers, and region ids never live in pixels.

v1 draws only an **anterior SVG**. The data model must already be 3D-ready so a glTF can drop in without renaming the cookbook.

### Body space (lock)

Illustrative, not photoreal. 2D is a copperplate you can click. 3D may get denser later. Every layer — organs, meridians, chakras, HD, aura, Merkaba — is a simple drawing in **one shared frame**.

Canonical units:

| Point | Coordinate |
| --- | --- |
| Perineum / mid-pelvis | origin `(0, 0, 0)` |
| Crown / vertex | `(0, +1, 0)` |
| Soles / Kidney-1 | `y = -1` |
| Midline | `x = 0` |
| Fingertips, arms easy-open (wingspan ≈ height) | `x = ±1` |
| Skin / structure envelope | roughly inside the unit diamond / capsule |
| First aura / wei-qi | radius ~ `1.3–1.6` |
| Outer aura | radius ~ `2` |
| Merkaba / larger field geometries | out to `2–3` |

- +Y up the midline toward the crown. Feet are **negative Y**.
- +X toward the **subject’s left** (viewer’s right on an anterior plate). Comment this; do not silently flip.
- +Z toward the viewer on the anterior view. Field layers may use a sphere / star-tetrahedron in XYZ later; v1 flattens them.
- Not pixels. Not millimeters. A future 3D renderer may map `Δy = 2` (crown to sole) onto ~1.7 m.

Why this frame: the **body is the unit self**. Everything subtler is just a larger radius in the same numbers. Toggling a layer is showing or hiding a group that already sits in place.

2D anterior = orthographic drop of Z.  
2D posterior (later) = rotate 180° about Y, drop Z.  
SVG `viewBox` should include the field, e.g. `-3 -1.4 6 2.8` (x from −3 to +3, y from −1.4 to +1.4) or equivalent. The viewBox is a camera, not the atlas.

Default pose for the plate: standing, arms slightly open so hands reach toward `x = ±1` without a rigid T-pose. Same landmarks if you later draw a T-pose variant.

### Zoom scales (human → field → earth → sky)

Start zoomed on the flesh. The same drawing can pull back. Layers are always in body space; the **camera** changes. Do not swap to a different coordinate system when you show astrology.

Named stops (discrete, not a free-wheel for v1; a wheel is allowed later):

| Stop | Frame (about) | What you see | Click targets |
| --- | --- | --- | --- |
| `tissue` | crop one organ | future only | — |
| `human` | `x ±1.2`, `y -1.15…1.15` | silhouette, organs, meridians, nerves, 7 chakras, **HD centers + defined channels on the body** | regions + centers |
| `subtle` | `x ±2.4`, `y -1.6…1.6` | aura shells, Merkaba, 8th / soul-star above crown, Earth Star below soles | field geometries |
| `earth` | `x ±4`, `y -3…2` | ground disc under the feet, Earth Star dropped into the planet, ley / grid as a quiet circle | `earth-star`, ground |
| `sky` | `x ±6` to `±8` | zodiac wheel, planetary glyphs on that wheel, **Rave / HD mandala** (64 gates = 64 I Ching hexagrams) around the body | signs, gates, planets |

Default stop: `human`. A control on the plate: `Human · Subtle · Earth · Sky` (and pinch/slider later).

**Level of detail:** at `human`, hide the wheel. At `sky`, fade organ tints; keep a small silhouette so you do not lose the person. Never draw all stops’ ink at full opacity at once.

Extra landmarks (same file):

- `soul-star` / 8th: `(0, 1.28, 0)` — above crown
- `earth-star`: `(0, -1.28, 0)` — below soles, into the ground
- optional 9–12 as further +Y beads on the midline

Earth is not a second origin. It is **negative Y past the feet** plus a disc in the XY plane at `y ≈ -1.4`. Astrology is not a second origin either: it is a **circle in XY** (or a disc facing the camera) centered on `(0,0)`, radius ~`4–7`. Planets are points on that circle by ecliptic longitude mapped to angle (`0°` = a documented axis; default Aries rising at left or midheaven-up — pick one, comment it).

Human Design:

- **On-body graph (human stop):** nine centers as disks on the existing midline/torso landmarks; defined channels as straight segments between those disks. This *is* the bodygraph, laid on the person, not a separate poster.
- **Mandala (sky stop):** one ring of 64 gates. Same ids for Human Design gates, I Ching hexagrams, and Gene Keys (`gate.1` … `gate.64`). Do not build a second wheel.
- **Codon rings (Gene Keys):** the 21 codon rings are **subsets of those 64**, not new geometry. Data: `src/atlas/codon-rings.ts` — each ring `{ id, name, gates: number[] }`. Draw as a second, slightly outer (or inner) stroke that lights only the member gates and optional chords between them. Toggle: `layer.sky.codon-rings`. Click a ring → highlight its gates + the on-body channels those gates feed.
- I Ching trigrams can label the eight HD-style houses on the same wheel later; still not a third circle.

A future “your chart” mode only tints which centers/channels/gates are defined. Geometry stays universal. Codon-ring membership is public Gene Keys structure (the 64 numbers and ring groupings), not copyrighted commentary. Keep ring names short; do not paste Gene Keys book text.

v1: implement `human` fully; stub camera stops and empty groups `#layer-field`, `#layer-sky` so zoom-out is a viewBox animation, not a rewrite.

### Semantic ids (never owned by a drawing)

Stable strings. Bluesky tags and `earth.wbc.pin.region` use the same region ids.

Regions (already):  
`crown, brain, face, throat, heart, lungs, solar-plexus, stomach, liver, spleen, intestines, kidneys, spine, pelvis, left-arm, right-arm, hands, left-leg, right-leg, feet, skin, autonomic, whole`

Layer ids use dotted names, for example:

- `layer.structure.respiratory`
- `layer.channel.meridian.liver`
- `layer.channel.nerve.vagus`
- `layer.center.chakra.anahata`
- `layer.center.hd.sacral`
- `layer.field.aura`
- `layer.field.merkaba`
- `layer.field.earth-star`
- `layer.field.soul-star`
- `layer.sky.zodiac`
- `layer.sky.planets`
- `layer.sky.hd-mandala`
- `layer.sky.codon-rings`

Do not invent a second heart id for 3D. Do not invent flat-only ids like `left-chest-squiggle-3`.

### Landmarks before outlines

Outlines will never match between a woodcut and a cadaver mesh. Landmarks will.

Ship `src/atlas/landmarks.json` with at least:

`crown, glabella, pupil-l, pupil-r, sternal-notch, xiphoid, navel, pubic-symphysis, vertex, C7, T12, L4, asis-l, asis-r, acromion-l, acromion-r, lateral-epicondyle-l, lateral-epicondyle-r, styloid-l, styloid-r, greater-trochanter-l, greater-trochanter-r, mid-patella-l, mid-patella-r, medial-malleolus-l, medial-malleolus-r, KS1-l, KS1-r`

Each entry:

```json
{ "id": "navel", "x": 0, "y": 0.12, "z": 0.04 }
```

Approximate Y for this frame: crown `1`, sternal notch `~0.62`, heart `~0.42`, navel `~0.12`, perineum `0`, mid-patella `~-0.5`, sole `-1`.

v1: `z` may be `0` or a small anterior offset. Do not omit the field.

In the SVG, render a hidden `#landmarks` group: `<circle data-landmark="navel" cx="…" cy="…">`. Export those projected positions from body space; do not hand-place pins in raw SVG units in application state.

Place chakras, HD centers, and gold pin dots as **offsets along landmark segments** (e.g. anahata = 0.55 of xiphoid → sternal-notch on the midline). The same formula works in 3D.

### Layer families (toggles)

Not forty checkboxes. Four families, then a picker inside the family.

| Family | What it holds | Draw |
| --- | --- | --- |
| **structure** | skeleton, muscle/fascia, skin, cardiovascular, respiratory, digestive, urinary, endocrine, lymph/immune, reproductive, sensory | tint / organ path |
| **channels** | 12 meridians, 8 extraordinary vessels, ida/pingala/sushumna, HD channels, vagus, sympathetic, enteric, sciatic | polyline through landmarks |
| **centers** | 7 chakras + 8th/soul-star + Earth Star, 9 HD centers, endocrine nodes | disk on midline (and below/above the flesh) |
| **field** | aura / wei-qi, Merkaba (2D hexagram, radius ~2), autonomic cloud | dashed envelope, star |
| **sky** | zodiac wheel, planets, HD/Gene Keys/I Ching 64-gate mandala, earth disc | circle + glyphs; visible from `earth`/`sky` stops |

**Default on:** structure silhouette (the unit body) + meridians.  
**Second:** nerves.  
**Third:** HD centers *or* chakras, never both at full opacity.  
**Field:** off by default; aura then Merkaba. They must compose without shoving the body — they are just bigger circles in the same space.

Draw every layer as a **simple illustration**: enough contour to click and recognize. No cadaver shading in 2D. Photoreal is a later 3D option only.

Gene Keys / I Ching gates are a **label mode on HD channels**, not a fifth geometry. Homeopathy is sensation text on regions, not tubes. Raw natal wheels and Enneagram stay in the panel, not on the plate.

Lived overlays (mobility aids, dysautonomia standing-problem, masking/throat) are field or structure tints that reuse region ids.

`layers.ts` shape:

```ts
{
  id: "layer.channel.meridian.liver",
  family: "channels",
  draw: "path",            // path | disk | tint | points | mesh
  regions: ["feet", "left-leg", "liver"],
  polyline: ["KS1-l", "mid-patella-l", "greater-trochanter-l", "xiphoid"],
  views: ["anterior", "3d"],
  defaultOn: false
}
```

v1 must implement families `channels` (meridians + nerves) and stub the others so adding respiratory / chakras / HD is data, not a rewrite.

UI: one row of family chips on the plate, then a small picker. Match `CLAUDE_DESIGN.md` (copper meridians, violet nerves, gold selection).

### Correspondences

`correspondences.ts` maps rooms across frameworks without merging them into one organ:

- `heart` ↔ pericardium meridian ↔ HD G/ego-adjacent rooms ↔ anahata ↔ Leo / Sun (folk)
- `solar-plexus` ↔ HD solar plexus ↔ manipura ↔ stomach/spleen earth
- `spine` ↔ Du vessel ↔ sushumna ↔ sympathetic chain ↔ kundalini corridor
- `pelvis` ↔ HD sacral + root ↔ svadhisthana / muladhara ↔ dantien

Pins always store a **region id**. Layer is a hint.

### Pins in body space

```ts
{
  region: "heart",
  layerHint: "layer.channel.nerve.autonomic",
  body: { x: 0.02, y: 0.62, z: 0.08 },
  view: "anterior"
}
```

`view` is only the default camera. Project `body` with `project.ts`. Never persist `svgX` / `svgY`.

### SVG group contract (v1 anterior)

```
#landmarks
#regions          /* data-region on every path */
#layer-structure
#layer-meridians
#layer-nerves
#layer-centers    /* empty ok */
#layer-field      /* dashed aura ok */
#pins
```

Keyboard + `aria-label` on regions. `aria-pressed` on family chips.

### 3D later (do not build the renderer now)

When a mesh arrives:

- Same landmark ids as nodes or vertex groups on a neutral anatomical pose (not a fashion pose).
- Prefer an anterior UV island that resembles the 2D plate so the copperplate can become a decal.
- Tubes for `draw: "path"` along the same polyline ids.
- One structure + one channel + one center visible at a time (3D has occlusion; keep the same cap).

Out of scope for this rebuild: WebGL, Three.js, BodyParts3D fetch. **In scope:** ids, landmarks.json with z, project.ts, layer families, body-space pins.

### Refuse

- Separate 2D-heart and 3D-heart ids
- Application state in viewBox units
- Layer UIs that cannot clip in 3D (no “show all forty”)
- Gendered / action-posed mesh as the source of ids
- Invented I Ching anatomy; gates ride HD only

Current `web/figure.js` may be redrawn. Preserve region ids and add the landmark group.

---

## GitHub Actions

```yaml
name: pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.dep.outputs.page_url }}
    steps:
      - id: dep
        uses: actions/deploy-pages@v4
```

Enable Pages on the repo (Actions source). Document that in README.

---

## README requirements

- What it is (one paragraph).
- Why a cookbook.
- Dual-write explanation.
- `pnpm install && pnpm dev` and canonical URL `https://wbc.earth`.
- Medical note + 988.
- MIT.
- Link both Miro boards as historical sources, not runtime deps.

---

## Quality bar

- `pnpm build` is clean.
- No `any` without a comment.
- No tracking pixels, no analytics SDK.
- No “sign up for our newsletter.”
- All copy already in this spec or the current `web/` files. Do not invent clinical claims.
- Practices that mention supplements, binders, distillation stay framed as **author protocol from the v0.1 board**.

---

## Out of scope for this rebuild

- OAuth / writing custom records
- Jetstream indexer
- Photo-calorie scanner
- 3D renderer / WebGL / BodyParts3D (data model for it is in scope)
- Payments
- Native app

Leave those as comments in README roadmap only.

---

## Done when

1. `pnpm dev` shows Start here, Atlas with a clickable figure, Recipes, The whole, Protocol, About.
2. Compose opens Bluesky with the right hashtags.
3. Search hits public API or falls back to sample pins.
4. `pnpm build` emits a static `dist/` GitHub Pages can serve.
5. Lexicon JSON files still exist and the Protocol page quotes them.
6. Visual system matches `CLAUDE_DESIGN.md` closely enough that the paper, oxblood, copper, and Fraunces are obvious in a screenshot.
7. `landmarks.json` exists with x,y,z; pins and layer polylines are stored in body space; SVG is a view.
8. Layer families are encoded in `layers.ts` (structure / channels / centers / field / sky). v1 paints meridians + nerves; other families can be stubbed on.
