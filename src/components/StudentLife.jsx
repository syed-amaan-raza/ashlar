import { useLayoutEffect, useRef } from 'react';
import { gsap, MQ, markScene, sceneId } from '../animations/gsap.js';
import { Lines } from './Split.jsx';
import Plate from './Plate.jsx';
import { studentLife } from '../data/studentLife.js';
import '../styles/life.css';

const FROM = (dir) => {
  const w = window.innerWidth, h = window.innerHeight;
  return { left: { x: -w * 0.8 }, right: { x: w * 0.8 }, top: { y: -h * 0.9 }, bottom: { y: h * 0.9 }, zoom: { scale: 0.15, opacity: 0 } }[dir];
};

/**
 * 06 · STUDENT LIFE
 *  A collage on a pinned stage. Tiles arrive from the sides at different speeds, drift on separate
 *  parallax rates, and cross. Statement one sits BEHIND the photos; statement two arrives IN FRONT.
 */
export default function StudentLife() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add({ full: MQ.full, lite: MQ.lite, reduce: MQ.reduce }, (ctx) => {
      const { full, reduce } = ctx.conditions;
      if (reduce) return markScene('life', el);

      const tiles = q('.tile');
      const t1 = q('.life__t1 .line__i');
      const t1el = q('.life__t1')[0];
      const t2chars = q('.life__t2 .ch__i');
      const facts = q('.life__facts li');

      // initial positions (function values re-evaluate on resize)
      gsap.set(t1, { yPercent: 115 });
      gsap.set(t2chars, { yPercent: 120 });
      gsap.set(facts, { autoAlpha: 0, y: 10 });
      tiles.forEach((t, i) => {
        const d = studentLife.tiles[i];
        gsap.set(t, { rotation: d.rot * 3, ...(d.from === 'zoom' ? { scale: 0.15, opacity: 0 } : { x: () => FROM(d.from).x ?? 0, y: () => FROM(d.from).y ?? 0 }) });
      });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: sceneId('life'), trigger: el, start: 'top top', end: () => `+=${Math.round(window.innerHeight * (full ? 4.6 : 3.8))}`,
          scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 7,
        },
      });

      tl.to(t1, { yPercent: 0, ease: 'power3.out', duration: 1.0, stagger: 0.15 }, 0);
      tiles.forEach((t, i) => {
        const d = studentLife.tiles[i];
        const dur = 2.8 / d.speed;
        tl.to(t, { x: 0, y: 0, scale: d.from === 'zoom' ? 0.8 : 1, opacity: 1, rotation: d.rot, ease: 'power3.out', duration: dur }, 0.5 + i * 0.3)
          // each tile keeps drifting at its own rate → real parallax between them
          .to(t, { y: () => -window.innerHeight * 0.06 * d.speed, rotation: d.rot * -0.6, ease: 'none', duration: 4 }, 3.4);
      });
      // one tile crosses the whole frame, over the statement
      const hero = tiles[studentLife.tiles.findIndex((x) => x.from === 'zoom')];
      if (hero) tl.to(hero, { scale: full ? 2.1 : 1.6, x: () => window.innerWidth * (full ? 0.02 : -0.05), y: () => window.innerHeight * 0.02, rotation: 0, ease: 'power2.inOut', duration: 2.2, zIndex: 4 }, 4.4);

      // hand-over: statement one swells away, tiles recede, statement two arrives in front
      tl.to(t1el, { scale: 1.5, opacity: 0, ease: 'power2.in', duration: 1.6 }, 6.6)
        .to(tiles, { scale: (i, t) => (t === hero ? 1.1 : 0.88), opacity: 0.5, ease: 'power2.inOut', duration: 1.4, stagger: 0.04 }, 6.8)
        .to(t2chars, { yPercent: 0, ease: 'power3.out', duration: 0.9, stagger: { each: 0.035, from: 'start' } }, 7.3)
        .to(facts, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.12 }, 8.4)
        .to({}, { duration: 1.0 });
    });

    return () => mm.revert();
  }, []);

  const { tiles, line1, line2, facts } = studentLife;
  return (
    <section id="life" className="life scene" data-theme="night" ref={root} aria-labelledby="life-h">
      <div className="life__pin">
        <div className="life__grid blueprint" aria-hidden="true" />
        <h2 id="life-h" className="life__t1 display"><Lines lines={line1} /></h2>

        <div className="life__tiles">
          {tiles.map((t) => (
            <figure className={`tile ${t.m ? '' : 'tile--nom'}`} key={t.id} data-cursor="VIEW"
              style={{ '--x': t.x, '--y': t.y, '--w': t.w, '--ratio': t.ratio, '--mx': t.m?.x, '--my': t.m?.y, '--mw': t.m?.w }}>
              <Plate id={t.id} tag={false} />
              <figcaption className="meta">{t.label}</figcaption>
            </figure>
          ))}
        </div>

        <p className="life__t2 display"><Lines lines={line2} chars /></p>
        <ul className="life__facts meta">{facts.map((f) => <li key={f}>{f}</li>)}</ul>
      </div>
    </section>
  );
}
