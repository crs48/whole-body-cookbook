import { useState } from "react";
import type { FieldId, RegionId } from "../atlas/ids";
import { FIELDS, START_HERE } from "../atlas/practices";
import { regionById } from "../atlas/regions";
import { Card } from "../ui/Card";
import { Chip, Pill } from "../ui/Chip";
import { Disclaimer } from "../ui/Disclaimer";

interface StartHereProps {
  onPractice: (region: RegionId) => void;
}

export function StartHere({ onPractice }: StartHereProps) {
  const [field, setField] = useState<FieldId | null>(null);
  const practices = field ? START_HERE.filter((p) => p.field === field) : START_HERE;

  return (
    <div className="mx-auto max-w-5xl px-6 pb-12 pt-6">
      <p className="kicker mb-1">v0.1 board</p>
      <h1 className="h1">Start here</h1>
      <p className="lede">
        Twelve practices from the first board, sorted into four fields. Each one points at rooms of the body. Click a practice to open
        that room in the atlas. Author protocol, not medical advice.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FIELDS.map((f) => (
          <Card key={f.id} kind={field === f.id ? "filtering" : "field"} title={f.name} onClick={() => setField(field === f.id ? null : f.id)}>
            {f.note}
          </Card>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Chip pressed={field === null} onClick={() => setField(null)}>
          All twelve
        </Chip>
        {FIELDS.map((f) => (
          <Chip key={f.id} pressed={field === f.id} onClick={() => setField(f.id)}>
            {f.name}
          </Chip>
        ))}
      </div>

      <ol className="mt-4 grid gap-3 md:grid-cols-2">
        {practices.map((p) => {
          const n = START_HERE.indexOf(p) + 1;
          const first = p.regions[0] ?? "whole";
          return (
            <li key={p.id} className="list-none">
              <Card
                kind={`${n}. ${p.field}`}
                title={p.title}
                onClick={() => onPractice(first)}
                footer={
                  <>
                    {p.regions.map((rid) => (
                      <Pill key={rid}>{regionById(rid).name}</Pill>
                    ))}
                    {p.protocol && <Pill className="border-copper text-copper">author protocol</Pill>}
                  </>
                }
              >
                <p>{p.text}</p>
                <p className="mt-1 text-[0.85rem] italic">{p.detail}</p>
              </Card>
            </li>
          );
        })}
      </ol>

      <Disclaimer crisis>
        These practices are one author's protocol from the v0.1 board. Supplements, binders, and distillation are described, not
        prescribed. Nothing here diagnoses, treats, or replaces care.
      </Disclaimer>
    </div>
  );
}
