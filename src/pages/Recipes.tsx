import { TOPICS, type TopicId } from "../atlas/topics";
import { regionById } from "../atlas/regions";
import { meridianById } from "../atlas/meridians";
import { Card } from "../ui/Card";
import { Pill } from "../ui/Chip";
import { Disclaimer } from "../ui/Disclaimer";

interface RecipesProps {
  onTopic: (id: TopicId) => void;
}

const KIND_LABEL = { condition: "condition", lived: "lived", tradition: "tradition" } as const;

export function Recipes({ onTopic }: RecipesProps) {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-12 pt-6">
      <p className="kicker mb-1">The cookbook</p>
      <h1 className="h1">Recipes</h1>
      <p className="lede">
        Each recipe is a bundle: a condition or tradition, the body rooms it tends to occupy, and the Bluesky threads already talking
        there. Open one to filter the atlas and its feed.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TOPICS.map((t) => (
          <Card
            key={t.id}
            kind={KIND_LABEL[t.kind]}
            title={t.name}
            onClick={() => onTopic(t.id)}
            footer={
              <>
                {t.regions.map((rid) => (
                  <Pill key={rid}>{regionById(rid).name}</Pill>
                ))}
                {t.meridians.length > 0 && t.meridians.length < 12 && t.meridians.map((m) => <Pill key={m} className="border-meridian/60 text-meridian">{meridianById(m).name}</Pill>)}
                {t.meridians.length === 12 && <Pill className="border-meridian/60 text-meridian">twelve regular meridians</Pill>}
              </>
            }
          >
            <p>{t.blurb}</p>
            <p className="mono mt-1 text-[0.75rem]">{t.tags.map((x) => `#${x}`).join(" ")}</p>
          </Card>
        ))}
      </div>
      <Disclaimer />
    </div>
  );
}
