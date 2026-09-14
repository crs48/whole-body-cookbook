import type { BodyPoint, RegionId, ViewId } from "./ids";
import type { LayerId } from "./layers";
import type { TopicId } from "./topics";

/**
 * A pin as the site renders it. Live posts and samples share this shape.
 * `body` is body space, never SVG units; `view` is only the default camera.
 */
export interface Pin {
  region: RegionId;
  handle: string;
  text: string;
  createdAt: string;
  /** at:// uri of the Bluesky post. Samples have none. */
  uri?: string;
  topic?: TopicId;
  layerHint?: LayerId;
  body?: BodyPoint;
  view?: ViewId;
  /** true = shipped with the site, never a live post. */
  demo: boolean;
}

/** Six demo posts. Shown only when live search is empty or blocked, always labelled `sample`. */
export const SAMPLE_PINS: readonly Pin[] = [
  {
    region: "heart",
    handle: "example.bsky.social",
    text: "Standing up and my heart rate jumps 40bpm. Compression socks are a character trait now. #POTS #wbc-heart #WholeBodyCookbook",
    topic: "pots",
    layerHint: "autonomic",
    body: { x: 0.02, y: 0.62, z: 0.08 },
    view: "anterior",
    createdAt: "2026-09-10T16:02:00Z",
    demo: true,
  },
  {
    region: "liver",
    handle: "example.bsky.social",
    text: "The old books say depression can be liver qi that forgot how to move. Today I walked anyway. #depression #wbc-liver #WholeBodyCookbook",
    topic: "depression",
    layerHint: "meridians",
    body: { x: -0.08, y: 0.29, z: 0.05 },
    view: "anterior",
    createdAt: "2026-09-09T11:20:00Z",
    demo: true,
  },
  {
    region: "brain",
    handle: "example.bsky.social",
    text: "Body doubling is a neurological accessibility tool and I will die on this hill. #ADHD #wbc-brain #WholeBodyCookbook",
    topic: "adhd",
    body: { x: 0.02, y: 0.9, z: 0 },
    view: "anterior",
    createdAt: "2026-09-08T19:44:00Z",
    demo: true,
  },
  {
    region: "skin",
    handle: "example.bsky.social",
    text: "The fluorescent lights are a texture. My skin is reading the room before I am. #actuallyautistic #wbc-skin #WholeBodyCookbook",
    topic: "autism",
    layerHint: "aura",
    body: { x: -0.24, y: 0.7, z: 0.02 },
    view: "anterior",
    createdAt: "2026-09-07T08:15:00Z",
    demo: true,
  },
  {
    region: "lungs",
    handle: "example.bsky.social",
    text: "Anxiety sits under the clavicles. Four counts in, six out. #anxiety #wbc-lungs #WholeBodyCookbook",
    topic: "anxiety",
    layerHint: "meridians",
    body: { x: -0.11, y: 0.55, z: 0.07 },
    view: "anterior",
    createdAt: "2026-09-06T21:03:00Z",
    demo: true,
  },
  {
    region: "spine",
    handle: "example.bsky.social",
    text: "My cane is not a tragedy. It is a meridian I can hold. #mobility #wbc-spine #WholeBodyCookbook",
    topic: "mobility",
    layerHint: "autonomic",
    body: { x: 0, y: 0.2, z: -0.07 },
    view: "anterior",
    createdAt: "2026-09-05T14:12:00Z",
    demo: true,
  },
];
