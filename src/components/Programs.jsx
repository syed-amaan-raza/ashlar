import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, MQ, markScene, sceneId } from '../animations/gsap.js';
import { scrollToScene } from '../animations/smoothScroll.js';
import { pad2 } from '../animations/utils.js';
import Plate from './Plate.jsx';
import { programs } from '../data/programs.js';
import '../styles/programs.css';

const trackCount = programs.reduce((n, p) => n + p.tracks.length, 0);

/**
 * 05 · PROGRAMMES — a course explorer, not a grid.
 *  The stage is pinned; the course list slides sideways with the scroll.
 *  Whichever course is under the pointer (or, when untouched, nearest the centre)
 *  takes over the background, widens its name, and unfolds its tracks.
 */
export default function Programs() {
  const root = useRef(null);
  const hover = useRef(-1);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const el = root.current;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add({ full: MQ.full, lite: MQ.lite, reduce: MQ.reduce }, (ctx) => {
      const { full, reduce } = ctx.conditions;
      if (reduce || !full) return markScene('programs', el); // phones & reduced motion get a vertical list (pure CSS)

      const track = q('.crs__track')[0];
      const courses = q('.crs');
      const bar = q('.crs__bar i')[0];
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth + 0);

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: sceneId('programs'), trigger: el, start: 'top top', end: () => `+=${Math.round(dist() * 1.05)}`,
          scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 8,
          onUpdate: () => {
            if (hover.current >= 0) return;
            const mid = window.innerWidth * 0.5;
            let best = 0, bd = 1e9;
            courses.forEach((c, i) => { const r = c.getBoundingClientRect(); const d = Math.abs(r.left + r.width * 0.32 - mid); if (d < bd) { bd = d; best = i; } });
            setActive((a) => (a === best ? a : best));
          },
        },
      });
      tl.to(track, { x: () => -dist(), duration: 1 }, 0).to(bar, { scaleX: 1, duration: 1 }, 0);
    });

    return () => mm.revert();
  }, []);

  const on = (i) => { hover.current = i; setActive(i); };
  const off = () => { hover.current = -1; };

  return (
    <section id="programs" className="crs-scene scene" data-theme="night" ref={root} aria-labelledby="crs-h" data-active={active}>
      <div className="crs__pin">
        <div className="crs__bgs" aria-hidden="true">
          {programs.map((p, i) => (<div className={`crs__bg ${i === active ? 'is-on' : ''}`} key={p.id}><Plate id={p.img} tag={false} /></div>))}
        </div>
        <div className="crs__shade" aria-hidden="true" />

        <header className="crs__head">
          <p className="meta">Fig. 04 · Programmes</p>
          <h2 id="crs-h" className="crs__title">{programs.length} degrees, {trackCount} tracks. Pick the one that fits and change your mind in year one.</h2>
        </header>

        <div className="crs__track">
          {programs.map((p, i) => (
            <article className="crs" key={p.id} data-on={i === active} data-cursor="EXPLORE"
                     onMouseEnter={() => on(i)} onMouseLeave={off} onFocus={() => on(i)} onBlur={off}>
              <div className="crs__thumb" aria-hidden="true"><Plate id={p.img} tag={false} /></div>
              <p className="meta crs__no"><b>{pad2(i + 1)}</b> · {p.degree} · {p.years} years · {p.seats} seats</p>
              <h3 className="crs__name display">
                {p.name.map((l) => (<span key={l} className="crs__l">{l}</span>))}
              </h3>
              <ul className="crs__tracks">
                {p.tracks.map((t, j) => (<li key={t} style={{ '--j': j }}><span aria-hidden="true">→</span> {t}</li>))}
              </ul>
              <p className="crs__note">{p.note}</p>
              <a className="btn btn--ghost crs__go" href="#admissions" onClick={(e) => { e.preventDefault(); scrollToScene('admissions'); }}>
                How to join {p.name.join(' ').toLowerCase()}
              </a>
            </article>
          ))}
        </div>

        <div className="crs__bar" aria-hidden="true"><i /></div>
      </div>
    </section>
  );
}
