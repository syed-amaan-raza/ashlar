export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const map = (v, a, b, c, d) => c + ((v - a) / (b - a)) * (d - c);
export const pad2 = (n) => String(n).padStart(2, '0');
export const fmtTime = (s) => `${pad2(Math.floor(s / 60))}:${pad2(Math.floor(s % 60))}`;

/** Position of `el` relative to `ancestor`, ignoring CSS transforms. */
export function offsetWithin(el, ancestor) {
  let x = 0, y = 0, n = el;
  while (n && n !== ancestor) {
    x += n.offsetLeft; y += n.offsetTop;
    n = n.offsetParent;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

/** mulberry32 — tiny seeded PRNG so generative art is identical every load. */
export const rng = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
export const hash = (s) => [...String(s)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

export const isFinePointer = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;
