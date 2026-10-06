import { useLayoutEffect, useRef } from 'react';
import { gsap, MQ, markScene, sceneId } from '../animations/gsap.js';
import { pad2 } from '../animations/utils.js';
import { Lines } from './Split.jsx';
import Plate from './Plate.jsx';
import { people } from '../data/people.js';
import '../styles/people.css';

const N = people.length;

/**
 * 08 · PEOPLE
 *  A full-screen portrait sequence. Scrolling cuts between people: the portrait wipes in, the
 *  name rolls through its mask, the stage tint shifts. Hovering the portrait tilts it in 3D
 *  and moves a light across it.
 */
export default function People() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add({ full: MQ.full, lite: MQ.lite, reduce: MQ.reduce }, (ctx) => {
      const { full, reduce } = ctx.conditions;
      if (reduce) return markScene('people', el);

      const pin = q('.ppl__pin')[0];
      const portraits = q('.ppl__portrait');
      const names = q('.ppl__name');
      const nameChars = names.map((n) => n.querySelectorAll('.ch__i, .line__i'));
      const infos = q('.ppl__info');
      const count = q('.ppl__count')[0];
      const frame = q('.ppl__frame')[0];

      gsap.set(pin, { backgroundColor: people[0].tint });
      gsap.set(portraits.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.set(names.slice(1), { autoAlpha: 0 });
      gsap.set(infos.slice(1), { autoAlpha: 0, x: 40 });

      const HOLD0 = 0.9, STEP = 1.7;
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: sceneId('people'), trigger: el, start: 'top top', end: () => `+=${Math.round(window.innerHeight * (full ? 5.0 : 4.2))}`,
          scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 5,
          onUpdate: (s) => {
            const k = Math.min(N - 1, Math.max(0, Math.floor((s.progress * (HOLD0 + (N - 1) * STEP + 0.6) - HOLD0 + STEP * 0.5) / STEP)));
            if (count) count.textContent = pad2(k + 1);
          },
        },
      });

      // opening: first name rolls up from its mask
      gsap.set(nameChars[0], { yPercent: 118 });
      tl.to(nameChars[0], { yPercent: 0, ease: 'power3.out', duration: 0.8, stagger: 0.04 }, 0);

      for (let k = 1; k < N; k++) {
        const t = HOLD0 + (k - 1) * STEP;
        gsap.set(nameChars[k], { yPercent: 118 });
        tl.to(nameChars[k - 1], { yPercent: -118, ease: 'power3.in', duration: 0.55, stagger: 0.03 }, t)
          .to(infos[k - 1], { autoAlpha: 0, x: -40, duration: 0.4 }, t)
          .to(names[k - 1], { autoAlpha: 0, duration: 0.01 }, t + 0.6)
          .to(pin, { backgroundColor: people[k].tint, ease: 'power2.inOut', duration: 1.1 }, t + 0.1)
          .to(portraits[k], { clipPath: k % 2 ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 0% 0%)', ease: 'power3.inOut', duration: 1.0 }, t + 0.1)
          .fromTo(portraits[k].firstElementChild, { scale: 1.3, yPercent: 6 }, { scale: 1, yPercent: 0, ease: 'power2.out', duration: 1.3 }, t + 0.1)
          .set(names[k], { autoAlpha: 1 }, t + 0.45)
          .to(nameChars[k], { yPercent: 0, ease: 'power3.out', duration: 0.8, stagger: 0.04 }, t + 0.5)
          .to(infos[k], { autoAlpha: 1, x: 0, ease: 'power3.out', duration: 0.7 }, t + 0.8);
      }
      tl.to({}, { duration: 0.6 });

      // hover: 3D tilt + moving light (fine pointers only)
      let off = () => {};
      if (full && window.matchMedia('(hover: hover)').matches) {
        const rx = gsap.quickTo(frame, 'rotationX', { duration: 0.6, ease: 'power3.out' });
        const ry = gsap.quickTo(frame, 'rotationY', { duration: 0.6, ease: 'power3.out' });
        const move = (e) => {
          const r = frame.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
          ry(px * 9); rx(-py * 7);
          frame.style.setProperty('--mx', `${(px + 0.5) * 100}%`); frame.style.setProperty('--my', `${(py + 0.5) * 100}%`);
        };
        const leave = () => { rx(0); ry(0); };
        frame.addEventListener('pointermove', move); frame.addEventListener('pointerleave', leave);
        off = () => { frame.removeEventListener('pointermove', move); frame.removeEventListener('pointerleave', leave); };
      }
      return off;
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="people" className="ppl scene" data-theme="night" ref={root} aria-labelledby="ppl-h">
      <div className="ppl__pin">
        <h2 id="ppl-h" className="sr">People of Ashlar</h2>
        <p className="ppl__head meta">Fig. 06 · The people</p>

        <div className="ppl__stage">
          <div className="ppl__frame" data-cursor="VIEW">
            {people.map((p) => (
              <div className="ppl__portrait" key={p.id} style={{ '--accent': p.accent, '--tint': p.tint }}>
                <Plate id={p.id} tint={p.tint} tag />
              </div>
            ))}
            <span className="ppl__light" aria-hidden="true" />
            <div className="crop" aria-hidden="true"><i /><i /><i /><i /></div>
          </div>
        </div>

        {people.map((p, i) => (
          <article className="ppl__card" key={p.id} style={{ '--accent': p.accent, '--tint': p.tint }}>
            <h3 className="ppl__name display"><Lines lines={[p.first, p.last]} /></h3>
            <div className="ppl__info">
              <p className="meta"><b>{pad2(i + 1)}</b> · {p.role}</p>
              <p className="ppl__dept">{p.dept}</p>
              <blockquote className="ppl__quote">“{p.quote}”</blockquote>
            </div>
          </article>
        ))}
        <p className="ppl__counter meta"><span className="ppl__count">01</span> / {pad2(N)}</p>
      </div>
    </section>
  );
}
