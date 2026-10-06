import { useLayoutEffect, useRef } from 'react';
import { gsap, MQ, markScene, sceneId } from '../animations/gsap.js';
import { setThemeOverride } from '../animations/chapterTracker.js';
import { scrollToScene } from '../animations/smoothScroll.js';
import { Lines } from './Split.jsx';
import Plate from './Plate.jsx';
import { finale } from '../data/admissions.js';
import { site } from '../data/site.js';
import '../styles/finale.css';

/**
 * 12 · FINAL EXPERIENCE
 *  Continues the orange flood from Admissions. A sunrise opens on the campus (a growing circle mask),
 *  the headline arrives, then leaves in two directions as the image expands and the four closing
 *  actions arrive like end credits.
 */
export default function Finale() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add({ full: MQ.full, lite: MQ.lite, reduce: MQ.reduce }, (ctx) => {
      const { full, reduce } = ctx.conditions;
      if (reduce) return markScene('finale', el);

      let progress = 0;
      const off = setThemeOverride('finale', () => (progress < 0.14 ? 'signal' : 'night'));
      const img = q('.fin__img')[0], inner = q('.fin__img .plate')[0];
      const chars = q('.fin__h .ch__i'), h = q('.fin__h')[0];
      const l1 = q('.fin__h .line__i')[0], l2 = q('.fin__h .line__i')[1];
      const links = q('.fin__link'), foot = q('.fin__foot')[0], shade = q('.fin__shade')[0];

      gsap.set(img, { clipPath: 'circle(0% at 50% 72%)' });
      gsap.set(chars, { yPercent: 118 });
      gsap.set(links, { autoAlpha: 0, y: 40 });
      gsap.set(q('.fin__rule'), { scaleX: 0 });
      gsap.set(foot, { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: sceneId('finale'), trigger: el, start: 'top top', end: () => `+=${Math.round(window.innerHeight * (full ? 4.2 : 3.6))}`,
          scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 0,
          onUpdate: (s) => { progress = s.progress; },
        },
      });
      tl.to(img, { clipPath: 'circle(140% at 50% 72%)', ease: 'power2.inOut', duration: 1.7 }, 0)
        .fromTo(inner, { scale: 1.4 }, { scale: 1, ease: 'power2.out', duration: 3.2 }, 0)
        .to(chars, { yPercent: 0, ease: 'power3.out', duration: 0.9, stagger: 0.045 }, 1.1)
        // headline leaves in two directions, the scene opens up
        .to(l1, { yPercent: -140, xPercent: -6, ease: 'power3.in', duration: 1.1 }, 3.4)
        .to(l2, { yPercent: 140, xPercent: 6, ease: 'power3.in', duration: 1.1 }, 3.4)
        .to(h, { autoAlpha: 0, duration: 0.01 }, 4.55)
        .to(inner, { scale: 1.12, ease: 'power1.inOut', duration: 3 }, 3.4)
        .to(shade, { opacity: 0.86, duration: 1.2 }, 3.6)
        .to(links, { autoAlpha: 1, y: 0, ease: 'power3.out', duration: 0.8, stagger: 0.22 }, 4.4)
        .to(q('.fin__rule'), { scaleX: 1, ease: 'power2.out', duration: 0.9, stagger: 0.22 }, 4.4)
        .to(foot, { autoAlpha: 1, duration: 0.8 }, 5.6)
        .to({}, { duration: 1.2 });
      return () => off();
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="finale" className="fin scene" data-theme="night" ref={root} aria-labelledby="fin-h">
      <div className="fin__pin">
        <div className="fin__img" aria-hidden="false"><Plate id="finale" eager /></div>
        <div className="fin__shade" aria-hidden="true" />

        <h2 id="fin-h" className="fin__h display"><Lines lines={finale.lines} chars /></h2>

        <nav className="fin__links" aria-label="Next steps">
          <ul>
            {finale.links.map((l) => (
              <li key={l.label}>
                <a className="fin__link" href={l.href} data-cursor="GO" onClick={l.scene ? (e) => { e.preventDefault(); scrollToScene(l.scene); } : undefined}>
                  <span className="fin__lbl display">{l.label}</span>
                  <span className="fin__sub meta">{l.sub}</span>
                  <svg className="fin__arrow" viewBox="0 0 48 20" aria-hidden="true"><path d="M0 10h44M36 2l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
                  <span className="fin__rule" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <footer className="fin__foot meta">
          <p><b>{site.full}</b><br />{site.address.join(', ')}</p>
          <p>{site.email} · {site.phone}</p>
          <p>{site.social.map((s, i) => (<span key={s.label}>{i ? ' · ' : ''}<a href={s.href}>{s.label}</a></span>))}</p>
          <p className="fin__end">© {new Date().getFullYear()} {site.name} · Fin.</p>
        </footer>
      </div>
    </section>
  );
}
