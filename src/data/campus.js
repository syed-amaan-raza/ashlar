// ─────────────────────────────────────────────────────────────
//  CAMPUS  ·  (a) the four embedded locations in the panorama,
//             (b) the map: coordinates + the plan of the grounds.
//  Panorama positions are fractions of the image (0–1).
// ─────────────────────────────────────────────────────────────
export const campusSpots = [
  { id: 'library',   name: 'LIBRARY',   code: 'LIB-01', big: '12,000+ BOOKS',              small: 'Reading floor open 6 am – 2 am.', fx: 0.185, fy: 0.60 },
  { id: 'labs',      name: 'LABS',      code: 'LAB-02', big: 'RESEARCH WITHOUT BOUNDARIES', small: '38 teaching labs, 22 research labs.', fx: 0.405, fy: 0.48 },
  { id: 'studios',   name: 'STUDIOS',   code: 'STU-03', big: 'MAKE SOMETHING REAL',          small: 'Fourteen open studios, no locked doors.', fx: 0.645, fy: 0.62 },
  { id: 'cafeteria', name: 'CAFETERIA', code: 'CAF-04', big: 'WHERE IDEAS COLLIDE',          small: 'Nine hundred seats, three kitchens.', fx: 0.865, fy: 0.68 },
];

// ⚠ PLACEHOLDER COORDINATES — set these to the real campus.
// The world and country views are real geography and will re-centre on
// whatever point you put here; the city and campus views are stylised drawings.
export const location = {
  lat: 21.15, lon: 79.09,
  city: 'Placeholder City',
  levels: [
    { key: 'world',   label: 'WORLD',   scale: '1 : 80,000,000' },
    { key: 'country', label: 'COUNTRY', scale: '1 : 12,000,000' },
    { key: 'city',    label: 'CITY',    scale: '1 : 150,000' },
    { key: 'campus',  label: 'CAMPUS',  scale: '1 : 4,000' },
  ],
};

// Campus plan — coordinates on a 1000 × 640 sheet.
export const plan = {
  buildings: [
    { id: 'eng',   name: 'Engineering Block',  dept: true,  x: 360, y: 150, w: 150, h: 70 },
    { id: 'cs',    name: 'Computer Science',   dept: true,  x: 540, y: 120, w: 120, h: 90 },
    { id: 'des',   name: 'Design Studios',     dept: true,  x: 690, y: 170, w: 130, h: 60 },
    { id: 'sci',   name: 'Science Quad',       dept: true,  x: 330, y: 260, w: 110, h: 110 },
    { id: 'hum',   name: 'Humanities Hall',    dept: true,  x: 470, y: 290, w: 100, h: 60 },
    { id: 'media', name: 'Media Centre',       dept: true,  x: 600, y: 280, w: 110, h: 70 },
    { id: 'lib',   name: 'Central Library',    facility: true, x: 470, y: 380, w: 130, h: 60 },
    { id: 'caf',   name: 'Cafeteria',          facility: true, x: 640, y: 390, w: 90,  h: 60 },
    { id: 'sport', name: 'Sports Complex',     facility: true, x: 780, y: 300, w: 120, h: 110 },
    { id: 'host',  name: 'Residences',         facility: true, x: 200, y: 360, w: 100, h: 130 },
  ],
  transport: [
    { id: 'metro', name: 'Ashlar Gate Metro', note: '400 m · Line 2', x: 520, y: 560 },
    { id: 'bus',   name: 'Campus bus bay',    note: 'every 8 min',  x: 280, y: 520 },
  ],
  nearby: [
    { id: 'park',  name: 'Tech Park',  note: '1.2 km', x: 900, y: 120 },
    { id: 'lake',  name: 'Quarry Lake', note: '800 m', x: 120, y: 190 },
    { id: 'old',   name: 'Old Town',   note: '4 km',   x: 900, y: 520 },
  ],
  steps: [
    { key: 'departments', title: 'Departments', pick: 'dept' },
    { key: 'facilities',  title: 'Facilities',  pick: 'facility' },
    { key: 'transport',   title: 'Transport',   pick: 'transport' },
    { key: 'nearby',      title: 'Nearby',      pick: 'nearby' },
  ],
};
