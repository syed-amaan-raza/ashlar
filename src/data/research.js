// ─────────────────────────────────────────────────────────────
//  RESEARCH  ·  the open questions. `kind` selects the live
//  generative diagram (see components/ResearchCanvas.jsx):
//  network · helix · arm · flow · orbit · lattice
// ─────────────────────────────────────────────────────────────
export const researchIntro = ['THE QUESTIONS', 'THAT HAVEN’T', 'BEEN ANSWERED.'];

export const researchAreas = [
  { id: 'ai',        name: 'AI',        kind: 'network', q: 'Can a model explain how it decided?',
    line: 'Interpretable systems for medicine and public services.', stat: '14 labs · 52 projects' },
  { id: 'biotech',   name: 'BIOTECH',   kind: 'helix',   q: 'Can we program a cell like software?',
    line: 'Synthetic biology for low-cost diagnostics.', stat: '6 labs · 31 projects' },
  { id: 'robotics',  name: 'ROBOTICS',  kind: 'arm',     q: 'Can a machine learn to feel what it grips?',
    line: 'Tactile control and soft manipulators.', stat: '5 labs · 28 projects' },
  { id: 'climate',   name: 'CLIMATE',   kind: 'flow',    q: 'What will the next two degrees do to one city?',
    line: 'Neighbourhood-scale heat and flood models.', stat: '4 labs · 24 projects' },
  { id: 'space',     name: 'SPACE',     kind: 'orbit',   q: 'Can we build where nobody has been?',
    line: 'Student-built nanosatellites and orbital debris tracking.', stat: '3 labs · 11 projects' },
  { id: 'materials', name: 'MATERIALS', kind: 'lattice', q: 'Can a material repair itself?',
    line: 'Self-healing composites and low-carbon cement.', stat: '7 labs · 38 projects' },
];
