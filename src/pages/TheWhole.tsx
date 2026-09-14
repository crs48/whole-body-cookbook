import { APP, AUDIENCES, CONCERN, FORMS, MONEY, WHOLE } from "../atlas/ecosystem";
import { Card } from "../ui/Card";
import { Disclaimer } from "../ui/Disclaimer";

export function TheWhole() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-12 pt-6 prose-page">
      <p className="kicker mb-1">Product map</p>
      <h1 className="h1">The whole</h1>
      <p className="lede">{WHOLE.note}</p>
      <p className="text-[0.85rem]">
        Source: the second Miro board,{" "}
        <a href={WHOLE.source} target="_blank" rel="noopener noreferrer">
          product map
        </a>
        . Historical source, not a runtime dependency.
      </p>

      <h2 className="h2">Audiences</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {AUDIENCES.map((a) => (
          <Card key={a.id} title={a.name}>
            {a.blurb}
          </Card>
        ))}
      </div>

      <h2 className="h2">Chat AI</h2>
      <p>
        Three verbs, described here and not built in v1. When they exist they will point at the same rooms the atlas already has.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {APP.map((a) => (
          <Card key={a.id} kind="not in v1" title={a.name}>
            {a.blurb}
          </Card>
        ))}
      </div>

      <h2 className="h2">Money</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MONEY.map((m) => (
          <Card key={m.id} title={m.name}>
            {m.blurb}
          </Card>
        ))}
      </div>

      <h2 className="h2">Forms</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FORMS.map((f) => (
          <Card key={f.id} title={f.name}>
            {f.blurb}
          </Card>
        ))}
      </div>

      <h2 className="h2">Concern</h2>
      <Card kind="worry / flip" title={CONCERN.title}>
        <p>{CONCERN.worry}</p>
        <p className="mt-1 italic">{CONCERN.flip}</p>
      </Card>

      <Disclaimer />
    </div>
  );
}
