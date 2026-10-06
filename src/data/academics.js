// ─────────────────────────────────────────────────────────────
//  ACADEMICS  ·  one entry per department. The giant `word` morphs
//  into the next as you scroll. Add / remove / reorder freely —
//  the timeline is built from this array.
//  First entry is the overture ("LEARN.") and has no department.
// ─────────────────────────────────────────────────────────────
export const academicsIntro = { word: 'LEARN', line: 'Seven schools. One workshop floor.' };

export const academics = [
  { id: 'eng',    word: 'ENGINEER', dept: 'School of Engineering',  img: 'eng',
    line: 'Structures, circuits and machines — tested to failure, then rebuilt better.',
    facts: ['6 programmes', '420 seats', '38 labs'] },
  { id: 'cs',     word: 'BUILD',    dept: 'Computer Science',       img: 'cs',
    line: 'From first compiler to production AI. Every semester ends with something that runs.',
    facts: ['5 tracks', '240 seats', '24/7 compute'] },
  { id: 'biz',    word: 'LEAD',     dept: 'Business & Venture',     img: 'biz',
    line: 'Run a real company from year one, with real customers and a real balance sheet.',
    facts: ['4 programmes', '180 seats', '60 startups'] },
  { id: 'design', word: 'DESIGN',   dept: 'School of Design',       img: 'design',
    line: 'Interaction, product and communication, taught in open studios with no locked doors.',
    facts: ['4 programmes', '120 seats', '14 studios'] },
  { id: 'sci',    word: 'DISCOVER', dept: 'Sciences',               img: 'sci',
    line: 'Physics, chemistry, biotech and mathematics — with undergraduates in the lab by week three.',
    facts: ['5 programmes', '200 seats', '22 labs'] },
  { id: 'hum',    word: 'QUESTION', dept: 'Humanities',             img: 'hum',
    line: 'Philosophy, economics and literature, so the engineers learn what to ask and why.',
    facts: ['3 programmes', '90 seats', '1 big library'] },
  { id: 'media',  word: 'TELL',     dept: 'Media & Film',           img: 'media',
    line: 'Film, journalism and sound. A working newsroom and broadcast studio on campus.',
    facts: ['3 programmes', '80 seats', '2 studios'] },
];
