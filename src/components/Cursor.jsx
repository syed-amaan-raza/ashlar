import { useEffect, useRef, useState } from 'react';
import { gsap } from '../animations/gsap.js';
import { isFinePointer } from '../animations/utils.js';
import { useStory } from '../state/story.js';
import '../styles/chrome.css';

/**
 * Custom cursor (fine pointers only, never under reduced motion).
 *  default → small dot + ring     [data-cursor="VIEW"] → ring grows and carries a label
 *  a / button → ring grows         [data-cursor-drag] → label "DRAG"
 */
export default function Cursor() {
  const { theme } = useStory();
  const [enabled, setEnabled] = useState(false);
  const dot = useRef(null), ring = useRef(null);
  const [label, setLabel] = useState('');

  useEffect(() => {
    const ok = isFinePointer() && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(ok);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('has-cursor');
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power3.out' });
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power3.out' });
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3.out' });
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3.out' });
    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    const move = (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); };
    const over = (e) => {
      const t = e.target.closest?.('[data-cursor]');
      const hit = e.target.closest?.('a,button,[role="button"],input,textarea,summary,.tick');
      if (t) { setLabel(t.getAttribute('data-cursor')); ring.current.dataset.state = 'label'; }
      else if (hit) { setLabel(''); ring.current.dataset.state = 'hover'; }
      else { setLabel(''); ring.current.dataset.state = ''; }
    };
    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 });
    const enter = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 });
    const down = () => (ring.current.dataset.press = '1');
    const up = () => delete ring.current.dataset.press;

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    document.addEventListener('pointerleave', leave);
    document.addEventListener('pointerenter', enter);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.removeEventListener('pointerleave', leave);
      document.removeEventListener('pointerenter', enter);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div className="cursor" data-theme={theme} aria-hidden="true">
      <div className="cursor__ring" ref={ring}><span>{label}</span></div>
      <div className="cursor__dot" ref={dot} />
    </div>
  );
}
