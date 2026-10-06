// ─────────────────────────────────────────────────────────────
//  STUDENT LIFE  ·  collage tiles. Position / size are in % of
//  the stage (desktop). `from` is the direction a tile enters.
//  `m` overrides the layout on mobile (null = hidden on mobile).
// ─────────────────────────────────────────────────────────────
export const studentLife = {
  line1: ['AFTER', 'THE', 'CLASSROOM.'],
  line2: ['THIS IS WHERE', 'LIFE HAPPENS.'],
  tiles: [
    { id: 'lifeRobots', label: 'Robotics Arena',   x: 5,  y: 10, w: 21, ratio: '4/5', rot: -3, from: 'left',   speed: 1.0, m: { x: 4,  y: 14, w: 42 } },
    { id: 'lifeStage',  label: 'Theatre Guild',    x: 72, y: 6,  w: 20, ratio: '4/5', rot: 2.5, from: 'right', speed: 1.4, m: { x: 52, y: 8,  w: 42 } },
    { id: 'lifePitch',  label: 'Football League',  x: 29, y: 54, w: 27, ratio: '3/2', rot: 1.5, from: 'bottom', speed: 0.8, m: { x: 8,  y: 54, w: 62 } },
    { id: 'lifeFest',   label: 'Ashlar Nights',    x: 73, y: 50, w: 19, ratio: '4/5', rot: -2, from: 'right',  speed: 1.2, m: { x: 56, y: 62, w: 38 } },
    { id: 'lifeHack',   label: 'Hack-36',          x: 46, y: 9,  w: 15, ratio: '1/1', rot: 4,  from: 'top',    speed: 1.6, m: null },
    { id: 'lifeDebate', label: 'Debate Finals',    x: 3,  y: 56, w: 17, ratio: '4/5', rot: 2,  from: 'left',   speed: 1.1, m: { x: 3,  y: 76, w: 36 } },
    { id: 'lifeSound',  label: 'Sunday Sessions',  x: 41, y: 33, w: 14, ratio: '1/1', rot: -4, from: 'zoom',   speed: 1.8, m: null },
    { id: 'lifeDance',  label: 'Cultural Night',   x: 58, y: 66, w: 18, ratio: '3/2', rot: 3,  from: 'bottom', speed: 0.9, m: null },
  ],
  facts: ['60+ clubs', '14 varsity teams', '9 festivals a year', '1 open-air stage'],
};
