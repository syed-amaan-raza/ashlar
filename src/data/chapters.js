// ─────────────────────────────────────────────────────────────
//  CHAPTERS  ·  the 12 scenes of the film, in order.
//  `theme` drives navigation, cursor and progress-bar colours.
//    night  = blueprint dark     signal = orange flood     paper = bone form
//  `minutes` is cosmetic: scroll is shown as a running time (see Progress).
// ─────────────────────────────────────────────────────────────
export const chapters = [
  { id: 'hero',       label: 'Opening',      theme: 'night'  },
  { id: 'story',      label: 'The story',    theme: 'signal' },
  { id: 'campus',     label: 'Campus',       theme: 'night'  },
  { id: 'academics',  label: 'Academics',    theme: 'night'  },
  { id: 'programs',   label: 'Programmes',   theme: 'night'  },
  { id: 'life',       label: 'Student life', theme: 'night'  },
  { id: 'impact',     label: 'Impact',       theme: 'night'  },
  { id: 'people',     label: 'People',       theme: 'night'  },
  { id: 'research',   label: 'Research',     theme: 'night'  },
  { id: 'location',   label: 'Location',     theme: 'night'  },
  { id: 'admissions', label: 'Admissions',   theme: 'paper'  },
  { id: 'finale',     label: 'Begin',        theme: 'night'  },
];
export const FILM_LENGTH_SECONDS = 90; // scroll 0→100% is displayed as 00:00→01:30
