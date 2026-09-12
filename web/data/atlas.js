export const REGIONS = [
  { id: "crown", name: "Crown", tag: "wbc-crown", group: "head", hint: "Attention, mystical maps, human design head." },
  { id: "brain", name: "Brain", tag: "wbc-brain", group: "head", hint: "ADHD, autism, depression circuitry, vagus stories." },
  { id: "face", name: "Face & senses", tag: "wbc-face", group: "head", hint: "Masking, interoception, expression." },
  { id: "throat", name: "Throat", tag: "wbc-throat", group: "head", hint: "Voice, thyroid, human design throat." },
  { id: "heart", name: "Heart", tag: "wbc-heart", group: "torso", hint: "Grief, POTS, pericardium, Leo / Sun." },
  { id: "lungs", name: "Lungs", tag: "wbc-lungs", group: "torso", hint: "Anxiety breath, grief in Chinese medicine." },
  { id: "solar-plexus", name: "Solar plexus", tag: "wbc-solar", group: "torso", hint: "Human design emotional / ego, gut-brain." },
  { id: "stomach", name: "Stomach", tag: "wbc-stomach", group: "torso", hint: "Earth element, appetite, worry." },
  { id: "liver", name: "Liver", tag: "wbc-liver", group: "torso", hint: "Anger, planning, wood, stagnation." },
  { id: "spleen", name: "Spleen / pancreas", tag: "wbc-spleen", group: "torso", hint: "Earth, blood, rumination." },
  { id: "intestines", name: "Gut", tag: "wbc-gut", group: "torso", hint: "Microbiome, second brain, diet threads." },
  { id: "kidneys", name: "Kidneys", tag: "wbc-kidney", group: "torso", hint: "Fear, jing, adrenal, water." },
  { id: "spine", name: "Spine", tag: "wbc-spine", group: "axis", hint: "Mobility, autonomic highway, kundalini." },
  { id: "pelvis", name: "Pelvis", tag: "wbc-pelvis", group: "torso", hint: "Root, sacral, mobility." },
  { id: "left-arm", name: "Left arm", tag: "wbc-larm", group: "limbs", hint: "Heart, pericardium, lung meridians." },
  { id: "right-arm", name: "Right arm", tag: "wbc-rarm", group: "limbs", hint: "Large intestine and triple warmer." },
  { id: "hands", name: "Hands", tag: "wbc-hands", group: "limbs", hint: "Acupoints, stimming, making." },
  { id: "left-leg", name: "Left leg", tag: "wbc-lleg", group: "limbs", hint: "Spleen, liver, kidney meridians." },
  { id: "right-leg", name: "Right leg", tag: "wbc-rleg", group: "limbs", hint: "Stomach, gallbladder, bladder meridians." },
  { id: "feet", name: "Feet", tag: "wbc-feet", group: "limbs", hint: "Grounding, kidney-1 bubbling spring." },
  { id: "skin", name: "Skin / fascia", tag: "wbc-skin", group: "field", hint: "Boundary, immune, wei qi, sensory." },
  { id: "autonomic", name: "Autonomic field", tag: "wbc-ans", group: "field", hint: "POTS, freeze, vagus, dysautonomia." },
  { id: "whole", name: "Whole body", tag: "wbc-whole", group: "field", hint: "Cross-links, constitutions, charts." }
];

export const MERIDIANS = [
  { id: "lung", name: "Lung", element: "metal", organ: "lungs", regions: ["lungs", "left-arm", "hands"] },
  { id: "large-intestine", name: "Large intestine", element: "metal", organ: "intestines", regions: ["right-arm", "hands", "face"] },
  { id: "stomach", name: "Stomach", element: "earth", organ: "stomach", regions: ["face", "stomach", "right-leg", "feet"] },
  { id: "spleen", name: "Spleen", element: "earth", organ: "spleen", regions: ["feet", "left-leg", "spleen", "stomach"] },
  { id: "heart", name: "Heart", element: "fire", organ: "heart", regions: ["heart", "left-arm", "hands"] },
  { id: "small-intestine", name: "Small intestine", element: "fire", organ: "intestines", regions: ["hands", "right-arm", "spine"] },
  { id: "bladder", name: "Bladder", element: "water", organ: "kidneys", regions: ["face", "spine", "right-leg", "feet"] },
  { id: "kidney", name: "Kidney", element: "water", organ: "kidneys", regions: ["feet", "left-leg", "kidneys", "spine"] },
  { id: "pericardium", name: "Pericardium", element: "fire", organ: "heart", regions: ["heart", "left-arm", "hands"] },
  { id: "triple-warmer", name: "Triple warmer", element: "fire", organ: "autonomic", regions: ["hands", "right-arm", "face"] },
  { id: "gallbladder", name: "Gallbladder", element: "wood", organ: "liver", regions: ["face", "liver", "right-leg", "feet"] },
  { id: "liver", name: "Liver", element: "wood", organ: "liver", regions: ["feet", "left-leg", "liver"] }
];

export const NERVES = [
  { id: "vagus", name: "Vagus", regions: ["brain", "throat", "heart", "lungs", "stomach", "intestines"] },
  { id: "sympathetic", name: "Sympathetic chain", regions: ["spine", "heart", "lungs", "autonomic"] },
  { id: "enteric", name: "Enteric nervous system", regions: ["stomach", "intestines", "solar-plexus"] },
  { id: "sciatic", name: "Sciatic", regions: ["pelvis", "left-leg", "right-leg", "feet"] }
];

export const TOPICS = [
  { id: "depression", name: "Depression", kind: "condition", regions: ["brain", "heart", "liver", "intestines", "spine"], meridians: ["liver", "heart", "spleen"], tags: ["depression", "WholeBodyCookbook"], blurb: "A weather system, not a single organ. Serotonin stories, liver qi stagnation, inflammation, and the politics of getting out of bed." },
  { id: "anxiety", name: "Anxiety", kind: "condition", regions: ["heart", "lungs", "solar-plexus", "autonomic", "brain"], meridians: ["heart", "pericardium", "lung", "kidney"], tags: ["anxiety", "WholeBodyCookbook"], blurb: "Chest weather. Breath that will not drop. Kidney water and heart fire, or a nervous system doing its job too well." },
  { id: "autism", name: "Autism", kind: "condition", regions: ["brain", "skin", "intestines", "hands", "face"], meridians: ["spleen", "stomach"], tags: ["autism", "actuallyautistic", "WholeBodyCookbook"], blurb: "A nervous system with a different sampling rate. Sensory skin, interoception, gut, and the politics of masking." },
  { id: "adhd", name: "ADHD", kind: "condition", regions: ["brain", "crown", "solar-plexus", "hands"], meridians: ["gallbladder", "liver"], tags: ["ADHD", "WholeBodyCookbook"], blurb: "Interest as a scarce resource. Time blindness, body-doubling, movement before focus." },
  { id: "pots", name: "POTS / dysautonomia", kind: "condition", regions: ["heart", "autonomic", "spine", "brain", "feet"], meridians: ["heart", "kidney", "triple-warmer"], tags: ["POTS", "dysautonomia", "WholeBodyCookbook"], blurb: "A standing problem. Blood that will not stay up. Compression, salt, sympathetic chain." },
  { id: "mobility", name: "Mobility", kind: "lived", regions: ["spine", "pelvis", "left-leg", "right-leg", "feet", "hands"], meridians: ["bladder", "gallbladder", "stomach"], tags: ["mobility", "disability", "WholeBodyCookbook"], blurb: "Aids, pain, stairs, and the social model. The body map is also an access map." },
  { id: "astrology", name: "Astrology", kind: "tradition", regions: ["whole", "crown", "heart"], meridians: [], tags: ["astrology", "WholeBodyCookbook"], blurb: "Medical astrology mapped organs to signs for two thousand years. Aries head, Leo heart, Pisces feet." },
  { id: "human-design", name: "Human Design", kind: "tradition", regions: ["crown", "brain", "throat", "heart", "solar-plexus", "pelvis"], meridians: [], tags: ["humandesign", "WholeBodyCookbook"], blurb: "Nine centers on the same silhouette. Defined or open, the body is the chart." },
  { id: "chinese-medicine", name: "Chinese medicine", kind: "tradition", regions: ["whole", "liver", "heart", "lungs", "spleen", "kidneys"], meridians: ["lung", "large-intestine", "stomach", "spleen", "heart", "kidney", "pericardium", "liver"], tags: ["TCM", "acupuncture", "WholeBodyCookbook"], blurb: "Five phases, twelve regular meridians, emotion as organ weather." },
  { id: "homeopathy", name: "Homeopathy", kind: "tradition", regions: ["whole"], meridians: [], tags: ["homeopathy", "WholeBodyCookbook"], blurb: "A controversial pharmacy of similars. The repertories remain a folk encyclopedia of sensation." },
  { id: "mystical", name: "Mystical traditions", kind: "tradition", regions: ["crown", "spine", "heart", "pelvis", "whole"], meridians: [], tags: ["mysticism", "kundalini", "WholeBodyCookbook"], blurb: "Kundalini, hesychasm, Sufi heart, kabbalistic body. Different maps, same rooms." }
];

export const SAMPLE_PINS = [
  { region: "heart", handle: "example.bsky.social", text: "Standing up and my heart rate jumps 40bpm. Compression socks are a character trait now. #POTS #wbc-heart #WholeBodyCookbook", topic: "pots", createdAt: "2026-09-10T16:02:00Z", demo: true },
  { region: "liver", handle: "example.bsky.social", text: "The old books say depression can be liver qi that forgot how to move. Today I walked anyway. #depression #wbc-liver #WholeBodyCookbook", topic: "depression", createdAt: "2026-09-09T11:20:00Z", demo: true },
  { region: "brain", handle: "example.bsky.social", text: "Body doubling is a neurological accessibility tool and I will die on this hill. #ADHD #wbc-brain #WholeBodyCookbook", topic: "adhd", createdAt: "2026-09-08T19:44:00Z", demo: true },
  { region: "skin", handle: "example.bsky.social", text: "The fluorescent lights are a texture. My skin is reading the room before I am. #actuallyautistic #wbc-skin #WholeBodyCookbook", topic: "autism", createdAt: "2026-09-07T08:15:00Z", demo: true },
  { region: "lungs", handle: "example.bsky.social", text: "Anxiety sits under the clavicles. Four counts in, six out. #anxiety #wbc-lungs #WholeBodyCookbook", topic: "anxiety", createdAt: "2026-09-06T21:03:00Z", demo: true },
  { region: "spine", handle: "example.bsky.social", text: "My cane is not a tragedy. It is a meridian I can hold. #mobility #wbc-spine #WholeBodyCookbook", topic: "mobility", createdAt: "2026-09-05T14:12:00Z", demo: true }
];

export const regionById = (id) => REGIONS.find((r) => r.id === id);
export const topicById = (id) => TOPICS.find((t) => t.id === id);
export const topicsForRegion = (regionId) => TOPICS.filter((t) => t.regions.includes(regionId) || t.regions.includes("whole"));
export const meridiansForRegion = (regionId) => MERIDIANS.filter((m) => m.regions.includes(regionId) || m.organ === regionId);
