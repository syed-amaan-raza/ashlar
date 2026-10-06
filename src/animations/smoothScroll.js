import Lenis from 'lenis';
import { gsap, ScrollTrigger, sceneStart } from './gsap.js';

let lenis = null;

/** Start Lenis and bind it to GSAP's ticker so ScrollTrigger reads one clock. */
export function startSmoothScroll() {
  if (lenis) return lenis;
  lenis = new Lenis({
    lerp: 0.085,           // inertia — lower = heavier camera
    wheelMultiplier: 0.9,
    smoothWheel: true,
    syncTouch: false,      // keep native momentum on touch devices
    anchors: false,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis;  // handy in the console
  return lenis;
}
const tick = (t) => lenis && lenis.raf(t * 1000);

export function stopSmoothScroll() {
  if (!lenis) return;
  gsap.ticker.remove(tick);
  lenis.destroy();
  lenis = null;
  delete window.__lenis;
}

export const getLenis = () => lenis;

/** Scroll to a scene by id (reduced-motion users get an instant jump). */
export function scrollToScene(id, { offset = 0, duration = 1.8 } = {}) {
  const y = sceneStart(id) + offset;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (lenis && !reduce) lenis.scrollTo(y, { duration, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else window.scrollTo({ top: y, behavior: 'auto' });
}

/** Scroll to an arbitrary absolute y. */
export function scrollToY(y, duration = 1.4) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (lenis && !reduce) lenis.scrollTo(y, { duration, easing: (t) => 1 - Math.pow(1 - t, 3) });
  else window.scrollTo({ top: y, behavior: 'auto' });
}
