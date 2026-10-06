import { useLayoutEffect, useRef } from 'react';
import { gsap, MQ, markScene, sceneId } from '../animations/gsap.js';
import { clamp, pad2 } from '../animations/utils.js';
import Plate from './Plate.jsx';
import { statistics } from '../data/statistics.js';
import '../styles/stats.css';

// trend series → SVG path in a 400×90 box
const sparkPath = (pts) => {
  const lo = Math.min(...pts), hi = Math.max(...pts);
  return pts.map((v, i) => `${i ? 'L' : 'M'}${(i / (pts.length - 1)) * 400},${86 - ((v - lo) / (hi - lo || 1)) * 80}`).join(' ');
};

/**
 * 07 · IMPACT
 *  Four numbers, each given the whole screen. Count-up is scrubbed (reverse the scroll, the number
 *  un-counts). The number's width axis widens as it grows, it skews with scroll velocity, and a
 *  line draws the trend behind it.
 */
export default function Statistics() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add({ full: MQ.full, lite: MQ.lite, reduce: MQ.reduce }, (ctx) => {
      const { full, reduce } = ctx.conditions;
      if (reduce) return markScene('impact', el);

      const stats = q('.stat');
      const bgs = q('.stats__bg');
      const ticks = q('.stats__rail li');
      const nums = q('.stat__num');
      const skewers = nums.map((n) => gsap.quickSetter(n, 'skewY', 'deg'));
      let target = 0, cur = 0;
      const tick = () => { cur += (target - cur) * 0.12; skewers.forEach((f) => f(cur)); };
      gsap.ticker.add(tick);

      gsap.set(stats, { autoAlpha: 0 });
      gsap.set(bgs, { opacity: 0 });

      const STEP = 2.4;
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: sceneId('impact'), trigger: el, start: 'top top', end: () => `+=${Math.round(window.innerHeight * (full ? 5.0 : 4.2))}`,
          scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 6,
          onUpdate: (s) => {
            target = clamp(s.getVelocity() / -350, -7, 7);
            const k = clamp(Math.floor((s.progress * (STEP * statistics.length)) / STEP), 0, statistics.length - 1);
            ticks.forEach((t, i) => t.classList.toggle('is-on', i === k));
          },
        },
      });

      statistics.forEach((s, i) => {
        const st = stats[i];
        const t = i * STEP;
        const val = st.querySelector('.stat__val');
        const o = { v: 0 };
        const path = st.querySelector('.stat__spark path');
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.set(st.querySelector('.stat__num'), { '--wdth': 62 });

        tl.set(st, { autoAlpha: 1 }, t)
          .to(bgs[i], { opacity: 0.5, duration: 0.8 }, t)
          .fromTo(st.querySelector('.stat__num'), { scale: 0.6, yPercent: 14, opacity: 0 }, { scale: 1, yPercent: 0, opacity: 1, ease: 'power3.out', duration: 0.9 }, t)
          .to(st.querySelector('.stat__num'), { '--wdth': 125, ease: 'power2.out', duration: 1.4 }, t)
          .to(o, { v: s.value, ease: 'power2.out', duration: 1.4, onUpdate: () => { val.textContent = Math.round(o.v); } }, t)
          .fromTo(st.querySelectorAll('.stat__label .ch__i'), { yPercent: 115 }, { yPercent: 0, ease: 'power3.out', duration: 0.7, stagger: 0.03 }, t + 0.3)
          .fromTo(st.querySelector('.stat__note'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, t + 0.8)
          .to(path, { strokeDashoffset: 0, ease: 'power1.inOut', duration: 1.5 }, t + 0.2);

        if (i < statistics.length - 1) {
          tl.to(st.querySelector('.stat__num'), { scale: 1.4, opacity: 0, yPercent: -12, ease: 'power2.in', duration: 0.5 }, t + STEP - 0.5)
            .to(st.querySelectorAll('.stat__label, .stat__note, .stat__spark'), { autoAlpha: 0, duration: 0.35 }, t + STEP - 0.5)
            .to(bgs[i], { opacity: 0, duration: 0.5 }, t + STEP - 0.4)
            .set(st, { autoAlpha: 0 }, t + STEP);
        }
      });
      tl.to({}, { duration: 0.7 });

      return () => gsap.ticker.remove(tick);
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="impact" className="stats scene" data-theme="night" ref={root} aria-labelledby="stats-h">
      <div className="stats__pin">
        <div className="stats__bgs" aria-hidden="true">
          {statistics.map((s) => (<div className="stats__bg" key={s.label}><Plate id={s.img} tag={false} /></div>))}
        </div>
        <div className="stats__shade" aria-hidden="true" />
        <h2 id="stats-h" className="stats__h meta">Fig. 05 · Impact, in numbers</h2>

        {statistics.map((s, i) => (
          <article className="stat" key={s.label}>
            <p className="stat__num display" style={{ '--n': String(s.value).length + s.suffix.length }} aria-label={`${s.value}${s.suffix}`}>
              <span aria-hidden="true"><span className="stat__val">{s.value}</span><span className="stat__suffix">{s.suffix}</span></span>
            </p>
            <div className="stat__cap">
              <p className="stat__label display"><span className="sr">{s.label}</span>
                <span aria-hidden="true">{[...s.label.toUpperCase()].map((c, k) => (<span className="ch" key={k}><span className="ch__i">{c === ' ' ? '\u00A0' : c}</span></span>))}</span>
              </p>
              <p className="stat__note">{s.note}</p>
            </div>
            <svg className="stat__spark" viewBox="0 0 400 90" preserveAspectRatio="none" aria-hidden="true"><path d={sparkPath(s.trend)} /></svg>
          </article>
        ))}

        <ol className="stats__rail meta" aria-hidden="true">{statistics.map((s, i) => (<li key={s.label} className={i === 0 ? 'is-on' : ''}>{pad2(i + 1)}</li>))}</ol>
      </div>
    </section>
  );
}
