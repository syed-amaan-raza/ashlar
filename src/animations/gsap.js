import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

// Media conditions — mirrored by @media blocks in styles/scenes.css.
// `full`  = desktop / laptop / tablet landscape, motion allowed
// `lite`  = phones & small tablets, motion allowed (fewer layers, softer parallax)
// `reduce`= prefers-reduced-motion: no pins, no parallax, content just sits there
export const MQ = {
  full: '(min-width: 861px) and (prefers-reduced-motion: no-preference)',
  lite: '(max-width: 860px) and (prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
};

// Motion grammar — one place to tune the whole site's feel.
export const EASE = {
  image: 'power2.inOut',   // large images: slow and smooth
  type: 'expo.out',        // typography: fast and precise
  decor: 'sine.inOut',     // decorative objects: slightly delayed
  bg: 'none',              // background: very slow, linear with the scroll
  micro: 'power3.out',     // micro-interactions
};

// Scene registry: every pinned/major scene registers a ScrollTrigger with
// id `scene-<id>` so navigation and the progress bar can find its true
// start position (pin-spacers make offsetTop unreliable).
export const sceneId = (id) => `scene-${id}`;
export const sceneStart = (id) => ScrollTrigger.getById(sceneId(id))?.start ?? 0;
export const sceneEnd = (id) => ScrollTrigger.getById(sceneId(id))?.end ?? 0;

/** For unpinned / reduced-motion paths: register the scene so nav, scrubber and tracker still find it. Returns a cleanup. */
export const markScene = (id, el) => {
  const st = ScrollTrigger.create({ id: sceneId(id), trigger: el, start: 'top top', end: 'bottom top' });
  return () => st.kill();
};

if (typeof window !== 'undefined') window.__ST = ScrollTrigger; // debug handle

export { gsap, ScrollTrigger };
