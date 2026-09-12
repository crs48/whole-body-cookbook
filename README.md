# Whole Body Cookbook

An [AT Protocol](https://atproto.com) atlas: people pin Bluesky posts to regions of a body.
Meridians, the autonomic nervous system, conditions, and mystical maps share one figure.

Live local copy: serve the `web/` directory.

```bash
cd web
python3 -m http.server 4173
# open http://127.0.0.1:4173
```

Repository: https://github.com/crs48/whole-body-cookbook

## Why a cookbook

A recipe here is not a protocol of care. It is a bundle:

- a condition or tradition (depression, POTS, human design, Chinese medicine...)
- the rooms of the body that conversation keeps returning to
- the social threads already happening on Bluesky

The site visualizes that bundle on a body you can click.

## How it sits on ATProto

Two layers, on purpose.

### Layer A — ordinary Bluesky posts (works today)

Compose via `https://bsky.app/intent/compose?text=...` with:

| tag | meaning |
| --- | --- |
| `#WholeBodyCookbook` | network-wide signal |
| `#wbc-heart`, `#wbc-liver`, `#wbc-brain`, ... | body region |
| `#POTS`, `#ADHD`, `#actuallyautistic`, ... | topic |

The atlas searches `app.bsky.feed.searchPosts` on `public.api.bsky.app` for those tags and draws the hits on the region you selected.

Region tags are defined in `web/data/atlas.js` (`REGIONS[].tag`).

### Layer B — custom lexicon (Atmosphere-native)

```
lexicons/app.wholebodycookbook.pin.json
lexicons/app.wholebodycookbook.recipe.json
```

A pin record names the region, systems, meridians, and topic slugs without forcing other apps to parse hashtags.

Publishing the NSID for real needs a domain you control and a DNS TXT record binding the namespace to your DID (same pattern as Statusphere / Smoke Signal / Frontpage). Until that domain exists, treat `app.wholebodycookbook.*` as a proposed schema the site already speaks.

### Dual-write pattern

Same idea as location check-ins on ATProto: a public `app.bsky.feed.post` plus a typed record in the user's repo. The post is visible everywhere; the record is queryable by any AppView that cares about bodies.

## Project layout

```
lexicons/          proposed ATProto schemas
web/index.html     atlas UI
web/styles.css
web/app.js
web/data/atlas.js  regions, meridians, nerves, recipes, sample pins
```

No build step. ES modules only.

## Roadmap

1. **OAuth AppView** — follow the [Statusphere](https://github.com/bluesky-social/statusphere-example-app) pattern so the site can write `app.wholebodycookbook.pin` into the signed-in repo.
2. **Indexer** — Jetstream consumer on `#WholeBodyCookbook` and the custom collection.
3. **Custom feed** — `app.bsky.feed.generator` of body pins.
4. **3D figure** — swap the SVG for a BodyParts3D / Three.js rendering that keeps the same region ids.
5. **Domain + lexicon publish** — `wholebodycookbook.*` NSID with DNS proof.

## Medical note

This is a map of conversation. It is not diagnosis, treatment, or advice.
Folk maps (meridians, astrology, human design, homeopathy) are shown as maps, not as validated mechanisms.

## License

MIT
