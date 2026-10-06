import { gsap, ScrollTrigger, sceneId } from './gsap.js';
import { chapters } from '../data/chapters.js';
import { setStory } from '../state/story.js';

let starts = [];
const recompute = () => { starts = chapters.map((c) => ScrollTrigger.getById(sceneId(c.id))?.start ?? Infinity); };

// A scene can flip the UI theme part-way through (e.g. orange → night).
// Register a function returning 'night' | 'signal' | 'paper'.
const overrides = {};
export const setThemeOverride = (id, fn) => { overrides[id] = fn; return () => { delete overrides[id]; }; };

/** Watches scroll position and publishes the active chapter. One loop, no layout reads. */
export function startChapterTracker() {
  recompute();
  ScrollTrigger.addEventListener('refresh', recompute);
  const loop = () => {
    const y = window.scrollY + window.innerHeight * 0.45;
    let i = 0;
    for (let k = 0; k < starts.length; k++) if (starts[k] <= y) i = k;
    const c = chapters[i];
    setStory({ index: i, id: c.id, theme: overrides[c.id]?.() ?? c.theme });
  };
  gsap.ticker.add(loop);
  return () => { gsap.ticker.remove(loop); ScrollTrigger.removeEventListener('refresh', recompute); };
}
