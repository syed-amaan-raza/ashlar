import { useLayoutEffect, useRef } from 'react';
import { gsap, MQ, markScene, sceneId } from '../animations/gsap.js';
import { offsetWithin } from '../animations/utils.js';
import { scrollToScene } from '../animations/smoothScroll.js';
import { Chars } from './Split.jsx';
import { admissions as A } from '../data/admissions.js';
import { programs } from '../data/programs.js';
import '../styles/admissions.css';

const N = A.steps.length;

/**
 * 11 · ADMISSIONS — a form you complete by scrolling.
 *  Hard cut to the paper mode. Five states (DISCOVER → BEGIN); each finished step is struck through
 *  in red on the left-hand checklist while the next word takes the stage. BEGIN's sun floods the
 *  page orange and carries straight into the closing scene.
 */
export default function Admissions() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add({ full: MQ.full, lite: MQ.lite, reduce: MQ.reduce }, (ctx) => {
      const { full, reduce } = ctx.conditions;
      if (reduce) return markScene('admissions', el);

      const pin = q('.adm__pin')[0], sheet = q('.adm__sheet')[0], flood = q('.adm__flood')[0], sun = q('.v-sun__disc')[0];
      const states = q('.adm__state');
      const chars = states.map((s) => s.querySelectorAll('.adm__word .ch__i'));
      const rows = q('.adm__steps li');
      const cta = q('.adm__cta')[0];

      // paper laid onto the desk as it arrives
      gsap.fromTo(sheet, { yPercent: 9, rotate: -1.1 }, { yPercent: 0, rotate: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top top', scrub: true } });

      gsap.set(chars.slice(1), { yPercent: 118 });
      gsap.set(states.slice(1), { autoAlpha: 0 });
      gsap.set(rows, { opacity: 0.4 }); gsap.set(rows[0], { opacity: 1 });
      gsap.set(q('.adm__strike'), { scaleX: 0 }); gsap.set(q('.adm__tick path'), { strokeDashoffset: 24 });
      gsap.set(cta, { autoAlpha: 0, y: 24 });
      gsap.set(q('.v-ring'), { scale: 0.2, opacity: 0 }); gsap.set(q('.v-chip'), { opacity: 0, y: 16 });
      gsap.set(q('.v-bar'), { scaleX: 0 }); gsap.set(q('.v-stamp'), { scale: 2.8, opacity: 0, rotate: -24 });
      gsap.set(q('.v-sun__disc'), { yPercent: 70, opacity: 0 }); gsap.set(q('.v-x path'), { strokeDashoffset: 30 });
      gsap.set(q('.v-sign path'), { strokeDashoffset: 300, strokeDasharray: 300 });

      const HOLD0 = 0.8, STEP = 1.8;
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: sceneId('admissions'), trigger: el, start: 'top top', end: () => `+=${Math.round(window.innerHeight * (full ? 6.2 : 5.4))}`,
          scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 1,
        },
      });

      // state 0 visuals play while we read DISCOVER
      tl.to(q('.v-ring'), { scale: 1, opacity: 1, stagger: 0.12, ease: 'power3.out', duration: 0.8 }, 0.1);

      for (let k = 1; k < N; k++) {
        const t = HOLD0 + (k - 1) * STEP;
        tl.to(chars[k - 1], { yPercent: -118, ease: 'power3.in', duration: 0.5, stagger: 0.03 }, t)
          .to(states[k - 1], { autoAlpha: 0, duration: 0.01 }, t + 0.55)
          // checklist: strike the finished step in red, tick its box, light the next
          .to(rows[k - 1].querySelector('.adm__strike'), { scaleX: 1, ease: 'power2.inOut', duration: 0.45 }, t + 0.05)
          .to(rows[k - 1].querySelectorAll('.adm__tick path'), { strokeDashoffset: 0, duration: 0.35 }, t + 0.15)
          .to(rows[k - 1], { opacity: 0.4, duration: 0.3 }, t + 0.4)
          .to(rows[k], { opacity: 1, duration: 0.4 }, t + 0.5)
          .set(states[k], { autoAlpha: 1 }, t + 0.5)
          .to(chars[k], { yPercent: 0, ease: 'power3.out', duration: 0.75, stagger: 0.04 }, t + 0.55);
        const vis = states[k];
        if (k === 1) tl.to(vis.querySelectorAll('.v-chip'), { opacity: 1, y: 0, stagger: 0.07, ease: 'power3.out', duration: 0.5 }, t + 0.8)
                       .to(vis.querySelectorAll('.v-x path'), { strokeDashoffset: 0, stagger: 0.15, duration: 0.4 }, t + 1.4);
        if (k === 2) tl.to(vis.querySelectorAll('.v-bar'), { scaleX: 1, stagger: 0.18, ease: 'power1.out', duration: 0.5 }, t + 0.8)
                       .to(vis.querySelectorAll('.v-sign path'), { strokeDashoffset: 0, ease: 'power1.inOut', duration: 0.6 }, t + 1.3);
        if (k === 3) tl.to(vis.querySelector('.v-stamp'), { scale: 1, opacity: 1, rotate: -8, ease: 'back.out(1.5)', duration: 0.5 }, t + 1.0);
        if (k === 4) tl.to(vis.querySelector('.v-sun__disc'), { yPercent: 0, opacity: 1, ease: 'power3.out', duration: 0.9 }, t + 0.7)
                       .to(cta, { autoAlpha: 1, y: 0, ease: 'power3.out', duration: 0.6 }, t + 1.0);
      }
      // the last row is struck as the sun floods
      const tEnd = HOLD0 + (N - 1) * STEP + 1.5;
      tl.to(rows[N - 1].querySelector('.adm__strike'), { scaleX: 1, duration: 0.4 }, tEnd - 0.2)
        .to(cta, { autoAlpha: 0, duration: 0.3 }, tEnd)
        .set(flood, { '--fx': () => { const p = offsetWithin(sun, pin); return `${p.x + p.w / 2}px`; }, '--fy': () => { const p = offsetWithin(sun, pin); return `${p.y + p.h / 2}px`; } }, tEnd)
        .to(flood, { '--r': () => `${Math.hypot(window.innerWidth, window.innerHeight) * 1.1}px`, ease: 'power3.in', duration: 1.5 }, tEnd);
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="admissions" className="adm scene" data-theme="paper" ref={root} aria-labelledby="adm-h">
      <div className="adm__pin">
        <div className="adm__sheet">
          <header className="adm__bar">
            <b>{A.form}</b>
            <span id="adm-h">{A.title}</span>
            <span className="adm__rev">{A.rev}</span>
          </header>

          <div className="adm__body">
            <ol className="adm__steps" aria-label="Application steps">
              {A.steps.map((s, i) => (
                <li key={s.word}>
                  <svg className="adm__tick" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M6 12.5l4 4 8-9" fill="none" stroke="#ff4d17" strokeWidth="2.4" strokeDasharray="24" /></svg>
                  <span className="adm__lbl"><span className="meta">Step {i + 1}</span><b>{s.verb}</b><span className="adm__strike" aria-hidden="true" /></span>
                </li>
              ))}
            </ol>

            <div className="adm__stage">
              {A.steps.map((s, i) => (
                <article className="adm__state" key={s.word}>
                  <p className="adm__word display" style={{ '--n': s.word.length + 1 }}><Chars text={`${s.word}.`} /></p>
                  <p className="adm__line">{s.line}</p>
                  <p className="meta adm__when">{s.when}</p>
                  <div className="adm__vis" aria-hidden="true">
                    {i === 0 && <div className="v-rings">{[1, 2, 3, 4].map((r) => <span className="v-ring" key={r} style={{ '--r': r }} />)}<span className="v-ring__dot" /></div>}
                    {i === 1 && (
                      <ul className="v-chips">
                        {programs.map((p, k) => (
                          <li className="v-chip" key={p.id}>
                            <svg viewBox="0 0 20 20" className="v-box"><rect x="1" y="1" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" />{k === 2 && <g className="v-x"><path d="M4 4l12 12M16 4L4 16" stroke="#ff4d17" strokeWidth="2.2" strokeDasharray="30" /></g>}</svg>
                            <span>{p.name.join(' ').toLowerCase()}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {i === 2 && (
                      <div className="v-form">
                        {['Full name', 'Programme', 'Essay or portfolio', 'Signature'].map((f) => (<div className="v-field" key={f}><span className="meta">{f}</span><i className="v-bar" /></div>))}
                        <svg className="v-sign" viewBox="0 0 220 50"><path d="M4 36c20-30 26-30 22-4s14 8 22-8 12 14 26 0 12-18 22-4 30 6 50-6" fill="none" stroke="#14161c" strokeWidth="2" strokeLinecap="round" /></svg>
                      </div>
                    )}
                    {i === 3 && <div className="v-stamp"><span>Place</span><b>ACCEPTED</b><span>{A.steps[3].when.split('·')[0]}</span></div>}
                    {i === 4 && <div className="v-sun"><span className="v-sun__disc" /><i className="v-sun__line" /></div>}
                  </div>
                </article>
              ))}

              <div className="adm__cta">
                <a className="btn btn--xl" href={A.cta.href}>{A.cta.label}</a>
                <a className="btn btn--ghost btn--ink" href={A.cta.secondary.href}>{A.cta.secondary.label}</a>
              </div>
            </div>
          </div>

          <p className="adm__exit meta">
            <b>FORM 9 · EXIT QUESTIONNAIRE</b> &nbsp; {A.exit.q}
            {A.exit.options.map((o, i) => (<span key={o} className={`adm__opt ${i === 2 ? 'is-x' : ''}`}><i aria-hidden="true" />{o}</span>))}
          </p>
        </div>
        <div className="adm__flood" aria-hidden="true" />
      </div>
    </section>
  );
}
