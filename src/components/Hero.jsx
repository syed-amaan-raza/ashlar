import { useLayoutEffect, useRef } from 'react';
import { gsap, MQ, markScene, EASE, sceneId } from '../animations/gsap.js';
import { offsetWithin } from '../animations/utils.js';
import { scrollToScene } from '../animations/smoothScroll.js';
import HeroArt from '../art/HeroArt.jsx';
import { site } from '../data/site.js';
import { location } from '../data/campus.js';
import '../styles/hero.css';

const fmt = (n, p, m) => `${Math.abs(n).toFixed(4)}° ${n >= 0 ? p : m}`;

/**
 * 01 · OPENING
 *  Layers (back→front): sky / skyline · blueprint grid · arch · TITLE · foreground slabs · orb · HUD
 *  Load:   title lines rise through masks, the arch lifts, the orb ignites.            (one orchestrated moment)
 *  Scroll: camera pushes through the arch · slabs fly outward · lines 1+2 part left/right ·
 *          the orb travels to the full stop of "IMPACT." and floods the screen orange.
 */
export default function Hero() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add({ full: MQ.full, lite: MQ.lite, reduce: MQ.reduce }, (ctx) => {
      const { full, reduce } = ctx.conditions;
      if (reduce) return markScene('hero', el);

      const orb = q('.hero__orb')[0];
      const flood = q('.hero__flood')[0];
      const dot = q('.hero__dot')[0];
      const orbSize = 18;
      const dotCenter = () => {
        const p = offsetWithin(dot, el);
        return { x: p.x + p.w / 2 - orbSize / 2, y: p.y + p.h * 0.62 - orbSize / 2 };
      };
      const orbStart = () => ({ x: window.innerWidth * (full ? 0.72 : 0.78), y: window.innerHeight * (full ? 0.3 : 0.22) });

      // ── Load sequence ───────────────────────────────────────────
      gsap.set(orb, { x: () => orbStart().x, y: () => orbStart().y, scale: 0 });
      const intro = gsap.timeline({ defaults: { ease: EASE.type } });
      intro
        .from(q('.hero__line-i'), { yPercent: 118, duration: 1.6, stagger: 0.13 }, 0.15)
        .from(q('.hero__plane--arch'), { yPercent: 7, opacity: 0, duration: 2.2, ease: 'power3.out' }, 0)
        .from(q('.hero__plane--far'), { opacity: 0, duration: 2.4, ease: 'sine.out' }, 0)
        .from(q('.hero__plane--fore'), { yPercent: 12, duration: 1.8, ease: 'power3.out' }, 0.2)
        .from(q('.hero__grid'), { clipPath: 'inset(0 0 100% 0)', duration: 1.8, ease: 'power3.inOut' }, 0.1)
        .from(q('.hero__hud > *'), { opacity: 0, y: 8, duration: 1, stagger: 0.08, ease: 'power2.out' }, 1.1)
        .to(orb, { scale: 1, duration: 1.4, ease: 'back.out(2.2)' }, 1.0);

      // ── Scroll: the camera ───────────────────────────────────────
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: sceneId('hero'), trigger: el, start: 'top top', end: () => `+=${Math.round(window.innerHeight * (full ? 1.7 : 1.45))}`,
          scrub: 0.7, pin: true, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 12,
        },
      });

      tl.to(q('.hero__plane--far'), { scale: 1.14, yPercent: -3, duration: 10 }, 0)
        .to(q('.hero__plane--arch'), { scale: full ? 2.3 : 1.9, transformOrigin: '50% 72%', ease: 'power2.in', duration: 9 }, 0)
        .to(q('.hero__plane--arch'), { opacity: 0, duration: 2, ease: 'power1.in' }, 7.6)
        .to(q('.hero__plane--fore'), { scale: full ? 2.6 : 2.0, transformOrigin: '50% 100%', ease: 'power1.in', duration: 8 }, 0)
        .to(q('.hero__grid'), { opacity: 0.0, duration: 6 }, 3)
        .to(q('.hero__hud > *'), { opacity: 0, duration: 1.6, stagger: 0.1 }, 0)
        .to(q('.hero__line--1'), { xPercent: full ? -42 : -60, opacity: 0, ease: 'power2.in', duration: 5 }, 1.6)
        .to(q('.hero__line--2'), { xPercent: full ? 42 : 60, opacity: 0, ease: 'power2.in', duration: 5 }, 1.9)
        // the orb crosses the frame and lands on the full stop
        .to(orb, { x: () => dotCenter().x, ease: 'power1.inOut', duration: 5.2 }, 1.2)
        .to(orb, { y: () => dotCenter().y, ease: 'power3.inOut', duration: 5.2 }, 1.2)
        .to(q('.hero__orb-glow'), { opacity: 0, duration: 0.8 }, 6.3)
        // …and floods: a vector clip-path circle grows from the full stop (crisp at any radius)
        .set(flood, { '--fx': () => `${dotCenter().x + orbSize / 2}px`, '--fy': () => `${dotCenter().y + orbSize / 2}px` }, 6.3)
        .set(orb, { opacity: 0 }, 6.4)
        .to(flood, { '--r': () => `${Math.hypot(window.innerWidth, window.innerHeight) * 1.05}px`, ease: 'power3.in', duration: 3.6 }, 6.4);

      return () => { intro.kill(); };
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="hero" className="hero scene" data-theme="night" ref={root} aria-labelledby="hero-title">
      <div className="hero__sky" aria-hidden="true" />
      <div className="hero__grid blueprint" aria-hidden="true" />
      <HeroArt />

      <h1 id="hero-title" className="hero__title display">
        <span className="line hero__line hero__line--1"><span className="line__i hero__line-i">WHERE IDEAS</span></span>
        <span className="line hero__line hero__line--2"><span className="line__i hero__line-i">BECOME</span></span>
        <span className="line hero__line hero__line--3"><span className="line__i hero__line-i">IMPACT<span className="hero__dot">.</span></span></span>
      </h1>

      <div className="hero__orb" aria-hidden="true"><span className="hero__orb-glow" /></div>
      <div className="hero__flood" aria-hidden="true" />

      <div className="hero__hud">
        <p className="meta hero__tl"><b>{site.full}</b><br />Est. {site.est} · Admissions {site.intake} open</p>
        <p className="meta hero__tr">{fmt(location.lat, 'N', 'S')}<br />{fmt(location.lon, 'E', 'W')}</p>
        <p className="hero__lede">A university of technology and design, where the people who make things and the people who ask why share one workshop floor.</p>
        <p className="meta hero__bl">Fig. 00 · The Ashlar arch</p>
        <button className="hero__scroll meta" onClick={() => scrollToScene('story')}>
          <span>Scroll to begin</span><i aria-hidden="true" />
        </button>
      </div>
      <div className="crop hero__crop" aria-hidden="true"><i /><i /><i /><i /></div>
    </section>
  );
}
