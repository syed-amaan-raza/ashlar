import { useLayoutEffect, useRef } from 'react';
import { gsap, MQ, markScene, sceneId } from '../animations/gsap.js';
import { clamp, pad2 } from '../animations/utils.js';
import CampusPanorama from '../art/CampusPanorama.jsx';
import { campusSpots } from '../data/campus.js';
import '../styles/campus.css';

/**
 * 03 · CAMPUS EXPERIENCE
 *  One 2.4:1 panorama in three depth planes. Scrolling flies a camera between four places;
 *  a spotlight narrows onto each, and its information is embedded in the scene itself
 *  (anchored to the building, counter-scaled so type never grows with the zoom).
 */
export default function Campus() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add({ full: MQ.full, lite: MQ.lite, reduce: MQ.reduce }, (ctx) => {
      const { full, reduce } = ctx.conditions;
      if (reduce) return markScene('campus', el);

      const cam = q('.campus__camera')[0];
      const spot = q('.campus__spot')[0];
      const labels = q('.spot');
      const idx = q('.campus__index li');
      const counter = q('.campus__count')[0];
      const ZOOM = full ? 2.1 : 2.5;
      const far = q('[data-depth="far"]'), near = q('[data-depth="near"]'), mid = q('[data-depth="mid"]');

      const view = () => ({ vw: window.innerWidth, vh: window.innerHeight, W: cam.offsetWidth, H: cam.offsetHeight });
      const at = (s, k) => {
        const { vw, vh, W, H } = view();
        // keep the focus a little right-of-centre on desktop so the label has room on the left? no — centre it.
        const x = clamp(vw / 2 - s.fx * W * k, vw - W * k, 0);
        const y = clamp(vh * 0.54 - s.fy * H * k, vh - H * k, 0);
        return { x, y };
      };

      gsap.set(cam, { x: () => at({ fx: 0.34, fy: 0.55 }, 1).x, y: () => at({ fx: 0.34, fy: 0.55 }, 1).y, scale: 1, transformOrigin: '0 0' });
      gsap.set(labels, { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: sceneId('campus'), trigger: el, start: 'top top', end: () => `+=${Math.round(window.innerHeight * (full ? 6.2 : 5.2))}`,
          scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 10,
          onUpdate: (self) => {
            const k = gsap.getProperty(cam, 'scale');
            cam.style.setProperty('--inv', String(1 / k));
            const raw = self.progress * tl.duration();
            const i = clamp(Math.floor((raw - 1.2) / 2.6 + 0.35), 0, spots.length - 1);
            idx.forEach((li, n) => li.classList.toggle('is-on', n === i && raw > 1.2));
            if (counter) counter.textContent = raw < 1.2 ? '00' : pad2(i + 1);
          },
        },
      });
      const spots = campusSpots;

      // establishing shot: title swells past, camera drifts
      tl.to(q('.campus__title .ch__i'), { yPercent: -120, stagger: 0.04, ease: 'power3.in', duration: 0.9 }, 0.4)
        .to(q('.campus__lead'), { autoAlpha: 0, duration: 0.5 }, 0.5)
        .to(cam, { x: () => at({ fx: 0.3, fy: 0.55 }, 1.12).x, y: () => at({ fx: 0.3, fy: 0.55 }, 1.12).y, scale: 1.12, duration: 1.2 }, 0)
        .to(far, { xPercent: -3, duration: 12 }, 0).to(near, { xPercent: 5, duration: 12 }, 0).to(mid, { xPercent: 0.5, duration: 12 }, 0);

      let t = 1.2;
      spots.forEach((s, i) => {
        tl.to(cam, { x: () => at(s, ZOOM).x, y: () => at(s, ZOOM).y, scale: ZOOM, ease: 'power2.inOut', duration: 1.5 }, t)
          .to(spot, { '--r': full ? '34vmin' : '46vmin', ease: 'power2.inOut', duration: 1.4 }, t + 0.2)
          .fromTo(labels[i], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, ease: 'power3.out', duration: 0.6 }, t + 1.1)
          .to(labels[i], { autoAlpha: 0, y: -16, ease: 'power2.in', duration: 0.4 }, t + 2.35)
          .to(spot, { '--r': '120vmin', ease: 'power1.in', duration: 0.5 }, t + 2.2);
        t += 2.6;
      });
      // pull back to the wide for a breath before releasing the pin
      tl.to(cam, { x: () => at({ fx: 0.5, fy: 0.55 }, 1.05).x, y: () => at({ fx: 0.5, fy: 0.55 }, 1.05).y, scale: 1.05, ease: 'power2.inOut', duration: 1.4 }, t)
        .to({}, { duration: 0.4 });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="campus" className="campus scene" data-theme="night" ref={root} aria-labelledby="campus-h">
      <div className="campus__pin">
        <div className="campus__camera">
          <CampusPanorama />
          <ul className="campus__spots">
            {campusSpots.map((s) => (
              <li className="spot" key={s.id} style={{ '--x': `${s.fx * 100}%`, '--y': `${s.fy * 100}%` }}>
                <div className="spot__in">
                  <span className="spot__reticle" aria-hidden="true" />
                  <span className="spot__rule" aria-hidden="true" />
                  <div className="spot__body">
                    <p className="meta spot__code">{s.code}</p>
                    <h3 className="spot__name display">{s.name}</h3>
                    <p className="spot__big">{s.big}</p>
                    <p className="meta spot__small">{s.small}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="campus__spot" aria-hidden="true" />

        <h2 id="campus-h" className="campus__title display">
          <span className="sr">The campus. </span>
          <span aria-hidden="true">{[...'THE CAMPUS'].map((c, i) => (<span className="ch" key={i}><span className="ch__i">{c === ' ' ? '\u00A0' : c}</span></span>))}</span>
        </h2>
        <p className="campus__lead meta">Fig. 02 · Move through the grounds<br />Scroll to travel between four places</p>

        <ol className="campus__index meta" aria-label="Places on campus">
          {campusSpots.map((s, i) => (<li key={s.id}><span>{pad2(i + 1)}</span> {s.name}</li>))}
        </ol>
        <p className="campus__counter meta"><span className="campus__count">00</span> / {pad2(campusSpots.length)}</p>
        <div className="crop campus__crop" aria-hidden="true"><i /><i /><i /><i /></div>
      </div>
    </section>
  );
}
