import { Disclaimer } from "../ui/Disclaimer";

export function About() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-12 pt-6 prose-page">
      <p className="kicker mb-1">Colophon</p>
      <h1 className="h1">About</h1>
      <p className="lede">
        The fantasy is a kitchen where Chinese medicine, dysautonomia Bluesky, astrology, human design, homeopathy, and mobility
        culture can leave notes on the same body without having to agree.
      </p>
      <h2 className="h2">Why a cookbook</h2>
      <p>
        A cookbook does not claim the recipes are true. It claims they were cooked. Each entry here is a bundle of rooms, threads,
        and practices that someone actually lived in, tagged so the next person can find the room.
      </p>
      <h2 className="h2">One body, many drawings</h2>
      <p>
        The atlas keeps one body model in a shared frame: the perineum at the origin, the crown at +1, the soles at −1, fingertips
        toward ±1. Organs, meridians, nerves, chakras, Human Design centers, the aura, the Merkaba, the zodiac wheel and the 64-gate
        mandala are all drawings in that one frame at larger radii. The 2D plate is a camera. A 3D figure will be another camera with
        the same region ids and landmarks.
      </p>
      <h2 className="h2">Source</h2>
      <p>
        Canonical URL: <a href="https://wbc.earth">wbc.earth</a>. Source lives at{" "}
        <a href="https://github.com/crs48/whole-body-cookbook">github.com/crs48/whole-body-cookbook</a>, MIT licensed. Type is
        Fraunces, Source Serif 4, and IBM Plex Mono. No analytics, no tracking, no newsletter.
      </p>
      <p>
        Historical sources: the{" "}
        <a href="https://miro.com/app/board/uXjVNol7iis=/" target="_blank" rel="noopener noreferrer">
          practices board
        </a>{" "}
        and the{" "}
        <a href="https://miro.com/app/board/uXjVN084J-c=/" target="_blank" rel="noopener noreferrer">
          product map board
        </a>
        .
      </p>
      <Disclaimer crisis>
        Correspondences are historical and communal, not clinical claims. This is a map of conversations, not a clinic. Nothing here
        diagnoses, treats, or replaces care.
      </Disclaimer>
    </div>
  );
}
