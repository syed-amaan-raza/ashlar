// ─────────────────────────────────────────────────────────────
//  IMAGE CONTROL ROOM
//  Every picture on the site is looked up here — nothing is hard-coded
//  in a component. While `src` is null the site draws a clearly-marked
//  generative PLACEHOLDER of the given `kind` so every scene still works.
//
//  TO REPLACE AN IMAGE
//    1. Drop the file in  /public/images/   (WebP or AVIF, ≤ 400 KB each)
//    2. Set  src: '/images/your-file.webp'
//    3. Fill in a real `alt` (describe the photo; use '' only if decorative)
//  Placeholders disappear automatically once `src` is set.
//
//  Suggested sizes are in `size` (px). Images are lazy-loaded and
//  object-fit: cover, so keep the subject near the centre.
// ─────────────────────────────────────────────────────────────
export const images = {
  // Hero backdrop. When a real photo is set, the generative arch/columns are hidden.
  hero:        { src: null, kind: 'dusk',    alt: 'The main arch of the Ashlar campus at dusk',                     size: '3200×1800' },

  // Chapter 03. A very wide panorama (2.4:1). When set, labels still sit on top of it.
  campus:      { src: null, kind: 'campus',  alt: 'Panorama of the library, laboratories, studios and cafeteria',   size: '4800×2000' },

  // Academics — one per department (ids match data/academics.js)
  eng:         { src: null, kind: 'grid3d',  alt: 'Engineering students testing a structure',          size: '1600×2000' },
  cs:          { src: null, kind: 'screens', alt: 'Students at a hackathon, screens glowing',          size: '1600×2000' },
  biz:         { src: null, kind: 'slabs',   alt: 'A pitch session in the venture studio',             size: '1600×2000' },
  design:      { src: null, kind: 'shelves', alt: 'A design studio wall covered in prototypes',        size: '1600×2000' },
  sci:         { src: null, kind: 'contour', alt: 'A physics lab with a long-exposure laser trace',    size: '1600×2000' },
  hum:         { src: null, kind: 'dusk',    alt: 'A seminar under the library colonnade',             size: '1600×2000' },
  media:       { src: null, kind: 'beams',   alt: 'The broadcast studio during a live shoot',          size: '1600×2000' },

  // Programmes (backgrounds, full-bleed)
  progCS:      { src: null, kind: 'screens', alt: 'Computer science lab', size: '2400×1400' },
  progRobo:    { src: null, kind: 'robot',   alt: 'Robotics arena',       size: '2400×1400' },
  progDesign:  { src: null, kind: 'shelves', alt: 'Design studio',        size: '2400×1400' },
  progBiz:     { src: null, kind: 'slabs',   alt: 'Business school atrium', size: '2400×1400' },
  progSci:     { src: null, kind: 'contour', alt: 'Sciences laboratory',  size: '2400×1400' },
  progMedia:   { src: null, kind: 'beams',   alt: 'Media production stage', size: '2400×1400' },

  // Student life collage (ids match data/studentLife.js)
  lifeRobots:  { src: null, kind: 'robot',   alt: 'The robotics club at the inter-college arena', size: '1200×1500' },
  lifeStage:   { src: null, kind: 'beams',   alt: 'Theatre guild on the open-air stage',          size: '1200×1500' },
  lifePitch:   { src: null, kind: 'court',   alt: 'The football league final under floodlights',  size: '1600×1200' },
  lifeFest:    { src: null, kind: 'bunting', alt: 'Ashlar Nights — the autumn festival',          size: '1200×1500' },
  lifeHack:    { src: null, kind: 'screens', alt: 'A 36-hour hackathon',                          size: '1200×1200' },
  lifeDebate:  { src: null, kind: 'slabs',   alt: 'The parliamentary debate finals',              size: '1200×1500' },
  lifeSound:   { src: null, kind: 'waves',   alt: 'The campus band at the Sunday session',        size: '1200×1200' },
  lifeDance:   { src: null, kind: 'bunting', alt: 'Cultural night — classical and contemporary',  size: '1600×1200' },

  // Impact backdrops
  impact1:     { src: null, kind: 'slabs',   alt: '', size: '2400×1400' },
  impact2:     { src: null, kind: 'dusk',    alt: '', size: '2400×1400' },
  impact3:     { src: null, kind: 'contour', alt: '', size: '2400×1400' },
  impact4:     { src: null, kind: 'grid3d',  alt: '', size: '2400×1400' },

  // People portraits — 4:5, subject centred (ids match data/people.js)
  p1:          { src: null, kind: 'portrait', alt: 'Arjun Menon, third-year computer science student', size: '1600×2000' },
  p2:          { src: null, kind: 'portrait', alt: 'Prof. Leela Varma, materials scientist',            size: '1600×2000' },
  p3:          { src: null, kind: 'portrait', alt: 'Kabir Shah, alumnus and founder',                  size: '1600×2000' },
  p4:          { src: null, kind: 'portrait', alt: 'Ananya Rao, final-year design student',            size: '1600×2000' },
  p5:          { src: null, kind: 'portrait', alt: 'Prof. Samuel Okafor, robotics',                    size: '1600×2000' },

  // Finale — the closing shot
  finale:      { src: null, kind: 'dusk',    alt: 'The campus lit at first light', size: '3200×1800' },
};
