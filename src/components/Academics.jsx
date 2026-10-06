import { useLayoutEffect, useRef } from 'react';
import { gsap, MQ, markScene, sceneId, ScrollTrigger } from '../animations/gsap.js';
import { scrollToY } from '../animations/smoothScroll.js';
import { pad2 } from '../animations/utils.js';
import { Chars } from './Split.jsx';
import Plate from './Plate.jsx';
import { academics, academicsIntro } from '../data/academics.js';
import '../styles/academics.css';

const states = [
  { id: 'intro', word: academicsIntro.word, dept: 'Academics', line: academicsIntro.line, facts: [], img: null },
  ...academics,
];

const N = states.length;

/**
 * 04 · ACADEMICS
 *  One giant word, seven states. Letters roll through a mask (outgoing up, incoming from below)
 *  while the word's width axis relaxes from wide to tight. A photo window slides around behind the
 *  word and wipes to the next image; the word blends with `difference` so it inverts over the photo.
 */
export default function Academics() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add({ full: MQ.full, lite: MQ.lite, reduce: MQ.reduce }, (ctx) => {
      const { full, reduce } = ctx.conditions;
      if (reduce) return markScene('academics', el);

      const words = q('.acad__word');
      const chars = words.map((w) => w.querySelectorAll('.ch__i'));
      const metas = q('.acad__meta');
      const plates = q('.acad__plate');
      const win = q('.acad__win')[0];
      const idxBtns = q('.acad__index button');
      const count = q('.acad__count')[0];
      const pos = full
        ? [[0, 0], [26, -2], [-26, 3], [24, -4], [-24, 2], [26, -3], [-26, 3], [24, -2]]
        : [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];

      gsap.set(chars.slice(1), { yPercent: 118 });
      gsap.set(words.slice(1), { '--wdth': 125 });
      gsap.set(metas.slice(1), { autoAlpha: 0, y: 18 });
      gsap.set(plates, { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.set(win, { autoAlpha: 0 });

      const STEP = 1.5, HOLD0 = 0.9;
      const times = states.map((_, k) => (k === 0 ? 0 : HOLD0 + (k - 1) * STEP + 0.9)); // moment state k is fully in
      const total = HOLD0 + (N - 1) * STEP + 0.9;

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: sceneId('academics'), trigger: el, start: 'top top', end: () => `+=${Math.round(window.innerHeight * (full ? 7.4 : 6.4))}`,
          scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 9,
          onUpdate: (s) => {
            const raw = s.progress * total;
            let a = 0; times.forEach((t, k) => { if (raw >= t - 0.4) a = k; });
            idxBtns.forEach((b, k) => b.classList.toggle('is-on', k === a));
            if (count) count.textContent = pad2(a + 1);
          },
        },
      });

      // slow breathing on the overture so the first screen is alive
      tl.to(words[0], { '--wdth': 92, duration: HOLD0 }, 0);

      for (let k = 1; k < N; k++) {
        const t = HOLD0 + (k - 1) * STEP;
        tl.to(chars[k - 1], { yPercent: -118, ease: 'power3.in', duration: 0.6, stagger: 0.035 }, t)
          .to(words[k - 1], { '--wdth': 62, ease: 'power2.in', duration: 0.6 }, t)
          .to(metas[k - 1], { autoAlpha: 0, y: -16, duration: 0.3 }, t)
          .to(chars[k], { yPercent: 0, ease: 'power3.out', duration: 0.75, stagger: 0.045 }, t + 0.45)
          .to(words[k], { '--wdth': 80, ease: 'power2.out', duration: 0.95 }, t + 0.45)
          .to(metas[k], { autoAlpha: 1, y: 0, ease: 'power3.out', duration: 0.55 }, t + 0.9);
        // photo window: slides to this state's slot, wipes to its image
        tl.to(win, { autoAlpha: 1, duration: 0.2 }, t)
          .to(win, { x: () => (window.innerWidth * pos[k][0]) / 100, y: () => (window.innerHeight * pos[k][1]) / 100, ease: 'power3.inOut', duration: 0.95 }, t + 0.1)
          .to(plates[k - 1], { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power3.inOut', duration: 0.9 }, t + 0.1)
          .fromTo(plates[k - 1].firstElementChild, { scale: 1.3 }, { scale: 1, ease: 'power2.out', duration: 1.2 }, t + 0.1);
      }
      tl.to({}, { duration: 0.6 });

      // index buttons jump to a state
      const jumps = idxBtns.map((b, k) => {
        const h = () => {
          const st = ScrollTrigger.getById(sceneId('academics'));
          scrollToY(st.start + (st.end - st.start) * ((times[k] + 0.05) / (total + 0.6)), 1.6);
        };
        b.addEventListener('click', h);
        return () => b.removeEventListener('click', h);
      });
      return () => jumps.forEach((f) => f());
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="academics" className="acad scene" data-theme="night" ref={root} aria-labelledby="acad-h">
      <div className="acad__pin">
        <div className="acad__grid blueprint" aria-hidden="true" />
        <h2 id="acad-h" className="sr">Academics: seven schools, one workshop floor</h2>

        <div className="acad__win" aria-hidden="true">
          {academics.map((d) => (<div className="acad__plate" key={d.id}><Plate id={d.img} tag={false} /></div>))}
          <div className="crop"><i /><i /><i /><i /></div>
        </div>

        <div className="acad__states">
          {states.map((s, k) => {
            const side = k % 2 === 1 ? 'left' : 'right';
            return (
              <article className="acad__state" key={s.id}>
                {s.img && <div className="acad__static-plate"><Plate id={s.img} tag={false} /></div>}
                <p className="acad__word display" style={{ '--n': s.word.length + 1 }}>
                  <Chars text={`${s.word}.`} />
                </p>
                <div className="acad__meta" data-side={side}>
                  <p className="meta"><b>{pad2(k + 1)}</b> · {s.dept}</p>
                  <p className="acad__line">{s.line}</p>
                  {s.facts.length > 0 && <ul className="meta acad__facts">{s.facts.map((f) => <li key={f}>{f}</li>)}</ul>}
                </div>
              </article>
            );
          })}
        </div>

        <nav className="acad__index" aria-label="Jump to a school">
          <ol>
            {states.map((s, k) => (
              <li key={s.id}><button type="button" className={k === 0 ? 'is-on' : ''}><span>{pad2(k + 1)}</span>{k === 0 ? 'Overture' : s.dept.replace('School of ', '')}</button></li>
            ))}
          </ol>
        </nav>
        <p className="acad__counter meta"><span className="acad__count">01</span> / {pad2(N)}</p>
      </div>
    </section>
  );
}
