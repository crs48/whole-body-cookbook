import pinLexicon from "../../lexicons/earth.wbc.pin.json";
import recipeLexicon from "../../lexicons/earth.wbc.recipe.json";
import { REGIONS } from "../atlas/regions";
import { BSKY_COMPOSE, composeUrl } from "../bsky/compose";
import { BSKY_PUBLIC_API, searchUrl } from "../bsky/search";
import { Disclaimer } from "../ui/Disclaimer";

const EXAMPLE_PIN = {
  $type: "earth.wbc.pin",
  region: "heart",
  side: "midline",
  systems: ["cardiovascular", "meridian"],
  meridians: ["heart", "pericardium"],
  topics: ["pots", "anxiety"],
  text: "Standing heart-rate jump. Compression as ritual.",
  post: "at://did:plc:…/app.bsky.feed.post/…",
  tags: ["POTS", "wbc-heart", "WholeBodyCookbook"],
  createdAt: "2026-09-12T16:00:00.000Z",
};

const pretty = (v: unknown): string => JSON.stringify(v, null, 2);

export function Protocol() {
  const sampleText = "Standing heart-rate jump. Compression as ritual. #POTS #wbc-heart #WholeBodyCookbook";
  return (
    <div className="mx-auto max-w-5xl px-6 pb-12 pt-6 prose-page">
      <p className="kicker mb-1">Atmosphere</p>
      <h1 className="h1">On AT Protocol</h1>
      <p className="lede">
        Whole Body Cookbook lives in the Atmosphere, not in a silo. v1 uses ordinary Bluesky posts, so anything you pin is already
        visible in the main app. A custom lexicon under <span className="mono">earth.wbc</span> rides alongside for apps that know how
        to read a body.
      </p>

      <h2 className="h2">1. Dual-write</h2>
      <p>
        <b>Layer A, shipped:</b> you publish an <span className="mono">app.bsky.feed.post</span> with the hashtags{" "}
        <span className="mono">#WholeBodyCookbook</span> and a region tag such as <span className="mono">#wbc-heart</span>. That post
        is a first-class Bluesky object. The site opens Bluesky's composer with the tags already in place:
      </p>
      <pre className="code">{`${BSKY_COMPOSE}?text=\${encodeURIComponent(text)}\n\n${composeUrl(sampleText)}`}</pre>
      <p>
        <b>Layer B, schema only:</b> later, with OAuth, the site also writes an <span className="mono">earth.wbc.pin</span> record into
        your own repository. Other Atmosphere apps can then index the collection without scraping hashtags. No records are written
        until OAuth exists.
      </p>

      <h2 className="h2">2. Region tags</h2>
      <p>
        One id family. The tag, the atlas region, and <span className="mono">earth.wbc.pin.region</span> all use the same strings.
      </p>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>region id</th>
              <th>tag</th>
              <th>room</th>
            </tr>
          </thead>
          <tbody>
            {REGIONS.map((r) => (
              <tr key={r.id}>
                <td className="mono">{r.id}</td>
                <td className="mono">#{r.tag}</td>
                <td>{r.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="h2">3. Reading the feed</h2>
      <p>
        The browser asks the public AppView directly. No server, no keys. If the request is blocked, the atlas shows sample pins
        labelled <i>sample</i>. Samples are never presented as live posts.
      </p>
      <pre className="code">{`GET ${BSKY_PUBLIC_API}/xrpc/app.bsky.feed.searchPosts\n  ?q=%23wbc-heart+%23WholeBodyCookbook\n  &limit=30\n\n${searchUrl("#wbc-heart #WholeBodyCookbook")}`}</pre>
      <p>
        From each post the site reads <span className="mono">author.handle</span>, <span className="mono">record.text</span>,{" "}
        <span className="mono">record.createdAt</span>, and <span className="mono">uri</span>.
      </p>

      <h2 className="h2">4. Lexicons in this repo</h2>
      <p>
        NSID authority is <b>wbc.earth</b>, reversed to <span className="mono">earth.wbc</span>. Both schema files live at{" "}
        <span className="mono">lexicons/</span> in the repository and are quoted here verbatim.
      </p>
      <p>A proposed pin record:</p>
      <pre className="code">{pretty(EXAMPLE_PIN)}</pre>
      <p className="mono text-[0.8rem]">lexicons/earth.wbc.pin.json</p>
      <pre className="code">{pretty(pinLexicon)}</pre>
      <p className="mono text-[0.8rem]">lexicons/earth.wbc.recipe.json</p>
      <pre className="code">{pretty(recipeLexicon)}</pre>

      <h2 className="h2">5. Proving the namespace</h2>
      <p>
        Lexicon authority is published the way other Atmosphere apps do it: a DNS TXT record on{" "}
        <span className="mono">_lexicon.wbc.earth</span> (or the current atproto lexicon-authority convention) binds the{" "}
        <span className="mono">earth.wbc.*</span> namespace to the publishing DID. Until that record is live the schema is a
        proposal the site already understands.
      </p>

      <h2 className="h2">6. What comes next</h2>
      <ol>
        <li>OAuth AppView (Statusphere pattern) so the site can write pin records for you.</li>
        <li>
          A Jetstream consumer on <span className="mono">#WholeBodyCookbook</span> and the <span className="mono">earth.wbc.pin</span>{" "}
          collection.
        </li>
        <li>A custom feed generator.</li>
        <li>A 3D figure with the same region ids and landmarks.</li>
        <li>
          DNS TXT on wbc.earth proving lexicon authority for <span className="mono">earth.wbc.*</span>.
        </li>
      </ol>

      <Disclaimer />
    </div>
  );
}
