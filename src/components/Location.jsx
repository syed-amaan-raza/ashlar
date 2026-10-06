import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap, MQ, markScene, sceneId } from '../animations/gsap.js';
import { clamp, lerp } from '../animations/utils.js';
import { drawWorld, countryScale, homeName, point } from '../art/geo.js';
import { CitySVG, CampusSVG } from './CityMap.jsx';
import { location, plan } from '../data/campus.js';
import '../styles/location.css';

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const f4 = (n, p, m) => `${Math.abs(n).toFixed(4)}° ${n >= 0 ? p : m}`;

/**
 * 10 · LOCATION
 *  Scroll is a zoom lens: WORLD → COUNTRY → CITY → CAMPUS. The first two levels are a real
 *  orthographic projection (canvas); the last two are drawn plans that scale into one another.
 *  Then the plan lights up in four passes: departments, facilities, transport, nearby.
 */
export default function Location() {
  const root = useRef(null);
  const cvRef = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add({ full: MQ.full, lite: MQ.lite, reduce: MQ.reduce }, (ctx) => {
      const { full, reduce } = ctx.conditions;
      if (reduce) return markScene('location', el);

      const cv = cvRef.current, c = cv.getContext('2d');
      const city = q('.map__city')[0], plansvg = q('.map__plan')[0];
      const lvl = q('.map__level')[0], coords = q('.map__coords')[0], scaleEl = q('.map__scale')[0];
      const panelItems = q('.map__group');
      const groups = ['buildings', 'transport', 'nearby'].map((g) => plansvg.querySelector(`[data-group="${g}"]`));
      const S = { z: 0, step: 0, hl: 0, pulse: 0 };
      let w = 0, h = 0, sW = 0, sC = 0, lastLevel = -1;
      const rot0 = [-point[0] - 75, -point[1] * 0.3 + 12], rot1 = [-point[0], -point[1]];

      const size = () => {
        const r = cv.getBoundingClientRect(); const dpr = Math.min(2, window.devicePixelRatio || 1);
        w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr; c.setTransform(dpr, 0, 0, dpr, 0, 0);
        sW = Math.min(w, h) * (full ? 0.38 : 0.42); sC = Math.max(countryScale(w, h), sW * 1.6);
      };
      size();

      const render = () => {
        const z = S.z;
        // canvas: zoom from globe to country to city
        const zc = Math.min(z, 2);
        let s, rot;
        if (zc <= 1) { const e = ease(zc); s = Math.exp(lerp(Math.log(sW), Math.log(sC), e)); rot = [lerp(rot0[0], rot1[0], e), lerp(rot0[1], rot1[1], e)]; }
        else { s = Math.exp(lerp(Math.log(sC), Math.log(sC * 70), ease(zc - 1))); rot = rot1; }
        cv.style.opacity = String(z < 1.55 ? 1 : clamp(1 - (z - 1.55) / 0.45));
        if (parseFloat(cv.style.opacity) > 0.01) drawWorld(c, w, h, s, rot, { hl: clamp(z * 1.2) * (1 - clamp((z - 1.2) / 0.4)), pulse: S.pulse });
        // city plan
        const cityIn = clamp((z - 1.55) / 0.45), cityOut = clamp((z - 2.55) / 0.4);
        const cs = z < 2 ? lerp(0.35, 1, ease(cityIn)) : lerp(1, 7, ease(clamp(z - 2)));
        city.style.opacity = String(cityIn * (1 - cityOut)); city.style.transform = `scale(${cs})`;
        // campus plan
        const pIn = clamp((z - 2.45) / 0.55);
        plansvg.style.opacity = String(pIn); plansvg.style.transform = `scale(${lerp(0.2, 1, ease(pIn))})`;
        // HUD
        const li = z < 0.5 ? 0 : z < 1.5 ? 1 : z < 2.5 ? 2 : 3;
        if (li !== lastLevel) { lastLevel = li; lvl.textContent = location.levels[li].label; lvl.classList.remove('pop'); void lvl.offsetWidth; lvl.classList.add('pop'); scaleEl.textContent = location.levels[li].scale; }
        const k = clamp(z / 3), la = lerp(point[1] * 0.3 - 12, point[1], ease(k)), lo = lerp(point[0] + 75, point[0], ease(k));
        coords.textContent = `${f4(la, 'N', 'S')}   ${f4(lo, 'E', 'W')}`;
        // plan groups by step
        groups.forEach((g, i) => { const on = S.step > i; g.style.opacity = String(on ? 1 : 0.07); });
        plansvg.querySelectorAll('[data-kind="dept"] rect').forEach((r) => r.setAttribute('fill-opacity', S.step >= 1 && S.step < 2 ? '0.5' : '0.12'));
        panelItems.forEach((p, i) => p.classList.toggle('is-on', Math.ceil(S.step) - 1 === i || (S.step >= 4 && false)));
      };

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: sceneId('location'), trigger: el, start: 'top top', end: () => `+=${Math.round(window.innerHeight * (full ? 9.5 : 8))}`,
          scrub: 0.7, pin: true, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 2,
          onRefresh: () => { size(); render(); },
        },
        onUpdate: render,
      });
      tl.to(S, { z: 1, duration: 2.4 }, 0)
        .to(S, { pulse: 1, duration: 0.8, repeat: 2, ease: 'power1.out' }, 2.4)
        .to(S, { z: 2, duration: 2.6 }, 3.2)
        .to(S, { z: 3, duration: 2.4 }, 6.2)
        .to(S, { step: 1, duration: 0.8 }, 8.8).to(S, { step: 2, duration: 0.8 }, 10)
        .to(S, { step: 3, duration: 0.8 }, 11.2).to(S, { step: 4, duration: 0.8 }, 12.4).to({}, { duration: 1.2 });
      gsap.set(S, { pulse: 0 });

      const onResize = () => { size(); render(); };
      window.addEventListener('resize', onResize);
      render();
      return () => window.removeEventListener('resize', onResize);
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="location" className="map scene" data-theme="night" ref={root} aria-labelledby="map-h">
      <div className="map__pin">
        <canvas ref={cvRef} className="map__canvas" aria-hidden="true" />
        <div className="map__grid blueprint" aria-hidden="true" />
        <div className="map__layer map__city"><CitySVG /></div>
        <div className="map__layer map__plan"><CampusSVG /></div>

        <header className="map__head">
          <p className="meta">Fig. 08 · Location</p>
          <h2 id="map-h" className="map__level display" aria-live="off">WORLD</h2>
          <p className="meta map__sub">{homeName ? `${homeName} · ` : ''}{location.city}</p>
        </header>

        <p className="meta map__coords">{f4(point[1], 'N', 'S')} {f4(point[0], 'E', 'W')}</p>
        <p className="meta map__scalebox"><span className="map__scale">{location.levels[0].scale}</span><i aria-hidden="true" /></p>

        <aside className="map__panel" aria-label="On and around campus">
          <ul>
            {[['Departments', plan.buildings.filter((b) => b.dept).map((b) => b.name)],
              ['Facilities', plan.buildings.filter((b) => b.facility).map((b) => b.name)],
              ['Transport', plan.transport.map((t) => `${t.name} · ${t.note}`)],
              ['Nearby', plan.nearby.map((n) => `${n.name} · ${n.note}`)]].map(([title, items]) => (
              <li className="map__group" key={title}>
                <h3 className="meta"><b>{title}</b></h3>
                <p>{items.join(' — ')}</p>
              </li>
            ))}
          </ul>
        </aside>
        <div className="crop map__crop" aria-hidden="true"><i /><i /><i /><i /></div>
      </div>
    </section>
  );
}
