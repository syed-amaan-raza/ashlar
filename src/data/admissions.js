// ─────────────────────────────────────────────────────────────
//  ADMISSIONS  ·  five states of one journey. Dates are placeholders.
// ─────────────────────────────────────────────────────────────
export const admissions = {
  form: 'FORM A-1',
  title: 'Admission 2027 · Undergraduate programmes',
  rev: 'Rev. 2026 · keep this copy',
  steps: [
    { word: 'DISCOVER', verb: 'Look around',        when: 'Open days · 14 Nov 2026 – 20 Feb 2027',
      line: 'Walk the campus, sit in a class, ask a student anything.' },
    { word: 'CHOOSE',   verb: 'Pick a programme',   when: 'Any time before you apply',
      line: 'Six programmes, thirty tracks. You can switch track until the end of year one.' },
    { word: 'APPLY',    verb: 'Send your application', when: 'Opens 1 Dec 2026 · closes 28 Feb 2027',
      line: 'One form, one essay, one portfolio or test. No application fee for the first round.' },
    { word: 'JOIN',     verb: 'Accept your place',  when: 'Offers 15 Apr · reply by 10 May 2027',
      line: 'Scholarships are decided with your offer, not after it.' },
    { word: 'BEGIN',    verb: 'Start in August',    when: 'Orientation · 2 Aug 2027',
      line: 'Move in, meet your studio, build something in the first week.' },
  ],
  cta: { label: 'Apply for 2027', href: '#', secondary: { label: 'Book a campus visit', href: '#' } },
  exit: { q: 'Does this feel like a college website?', options: ['Yes', 'No', 'Not really'] },
};

export const finale = {
  lines: ['YOUR STORY', 'STARTS HERE.'],
  links: [
    { label: 'APPLY',            sub: 'Applications close 28 Feb',  href: '#' },
    { label: 'VISIT CAMPUS',     sub: 'Open days from 14 Nov',      href: '#' },
    { label: 'EXPLORE PROGRAMS', sub: 'Six degrees, thirty tracks', href: '#programs', scene: 'programs' },
    { label: 'CONTACT US',       sub: 'admissions@ashlar.example',  href: 'mailto:admissions@ashlar.example' },
  ],
};
