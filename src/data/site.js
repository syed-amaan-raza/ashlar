// ─────────────────────────────────────────────────────────────
//  SITE  ·  identity, navigation and contact details.
//  Edit this file to rebrand. Nothing in /components hard-codes copy.
// ─────────────────────────────────────────────────────────────
export const site = {
  name: 'Ashlar',
  full: 'Ashlar Institute of Technology & Design',
  est: 1987,
  intake: '2027',
  address: ['Ashlar Campus', '1 Quarry Road', 'Placeholder City, 000 000'], // ← placeholder
  email: 'admissions@ashlar.example',
  phone: '+00 000 000 0000',
  social: [
    { label: 'Instagram', href: '#' },
    { label: 'YouTube', href: '#' },
    { label: 'LinkedIn', href: '#' },
  ],
  // Floating navigation. `scene` must match an id in chapters.js
  nav: [
    { label: 'About', scene: 'story' },
    { label: 'Academics', scene: 'academics' },
    { label: 'Campus', scene: 'campus' },
    { label: 'Research', scene: 'research' },
    { label: 'Student life', scene: 'life' },
    { label: 'Admissions', scene: 'admissions' },
  ],
};
