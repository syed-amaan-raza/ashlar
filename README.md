# Ashlar Institute — cinematic scroll site

React + Vite + GSAP (ScrollTrigger) + Lenis. 12 scroll-driven scenes.

## Run on localhost
```
npm install
npm run dev        # http://localhost:5173
npm run build && npm run preview   # production check
```

## Replace content (no animation code to touch)
- `src/data/images.js`  — every image. Set `src: '/images/your.webp'` (drop files in `public/images/`). Placeholders vanish automatically.
- `src/data/site.js`, `academics.js`, `programs.js`, `people.js`, `statistics.js`, `research.js`, `studentLife.js`, `admissions.js`, `story.js`
- `src/data/campus.js` — set real `lat`/`lon`: the world + country map re-centres itself (city/campus plan are stylised drawings).

## Notes
- Reduced-motion users get a static, fully readable layout (no pins/parallax/smooth scroll).
- Phones get a lighter composition (Programmes becomes a vertical list).
- Known rough edges: a few phone layouts (Finale headline width, Admissions spacing) still need polish.
