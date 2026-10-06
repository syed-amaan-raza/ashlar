// ─────────────────────────────────────────────────────────────
//  PROGRAMMES  ·  the course explorer. Each entry becomes one
//  panel on the horizontal track. `img` is a key in images.js.
// ─────────────────────────────────────────────────────────────
export const programs = [
  { id: 'cs', name: ['COMPUTER', 'SCIENCE'], degree: 'B.Tech', years: 4, seats: 240, img: 'progCS',
    tracks: ['Programming', 'Artificial intelligence', 'Data', 'Cybersecurity', 'Systems'],
    note: 'Capstone with an industry partner in year four.' },
  { id: 'robo', name: ['ELECTRONICS', '& ROBOTICS'], degree: 'B.Tech', years: 4, seats: 120, img: 'progRobo',
    tracks: ['Embedded', 'Control', 'Machine vision', 'Mechatronics', 'Internet of things'],
    note: 'The arena is open to first-years on day one.' },
  { id: 'design', name: ['DESIGN'], degree: 'B.Des', years: 4, seats: 120, img: 'progDesign',
    tracks: ['Interaction', 'Product', 'Communication', 'Motion', 'Spatial'],
    note: 'Portfolio review replaces the written exam.' },
  { id: 'biz', name: ['BUSINESS &', 'VENTURE'], degree: 'BBA', years: 3, seats: 180, img: 'progBiz',
    tracks: ['Finance', 'Venture building', 'Operations', 'Markets', 'Analytics'],
    note: 'Students run the campus venture fund.' },
  { id: 'sci', name: ['SCIENCES'], degree: 'B.Sc', years: 3, seats: 200, img: 'progSci',
    tracks: ['Physics', 'Chemistry', 'Biotechnology', 'Mathematics', 'Earth systems'],
    note: 'Research placement guaranteed from year two.' },
  { id: 'media', name: ['MEDIA &', 'HUMANITIES'], degree: 'BA', years: 3, seats: 170, img: 'progMedia',
    tracks: ['Film', 'Journalism', 'Economics', 'Literature', 'Philosophy'],
    note: 'Publish in the campus newsroom from week one.' },
];
