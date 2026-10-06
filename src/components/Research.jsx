import { useLayoutEffect, useRef } from 'react';
import { gsap, MQ, markScene, sceneId } from '../animations/gsap.js';
import { pad2 } from '../animations/utils.js';
import { Lines } from './Split.jsx';
import ResearchCanvas from './ResearchCanvas.jsx';
import { researchIntro, researchAreas } from '../data/research.js';
import '../styles/research.css';

/**
 * 09 · RESEARCH
 *  Darkest scene. A perspective floor (the reel's 3D grid) glides toward the camera while the
 *  statement assembles line by line; then six open questions, each with a live diagram that
 *  only runs while it is on screen.
 */
export default function Research() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add({ full: MQ.full, lite: MQ.lite, reduce: MQ.reduce }, (ctx) => {
      const { full, reduce } = ctx.conditions;
      if (reduce) return markScene('research', el);

      const intro = q('.res__intro')[0];
      const lines = q('.res__h .line__i');
      const floor = q('.res__floor')[0];

      gsap.set(lines, { yPercent: 118 });
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: sceneId('research'), trigger: intro, start: 'top top', end: () => `+=${Math.round(window.innerHeight * (full ? 2.6 : 2.2))}`,
          scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 3,
        },
      });
      tl.to(floor, { backgroundPositionY: '520px', duration: 4 }, 0)
        .fromTo(q('.res__q'), { scale: 0.55, opacity: 0, rotate: -8 }, { scale: 1, opacity: 1, rotate: 0, ease: 'power2.out', duration: 3.2 }, 0.2);
      lines.forEach((l, i) => {
        tl.to(l, { yPercent: 0, ease: 'power3.out', duration: 0.9 }, 0.2 + i * 0.9);
        if (i > 0) tl.to(lines[i - 1], { opacity: 0.32, duration: 0.5 }, 0.2 + i * 0.9);
      });
      tl.to(q('.res__h'), { scale: 0.96, duration: 1.2 }, 3.2).to(q('.res__intro-meta'), { autoAlpha: 0, duration: 0.5 }, 3.4).to({}, { duration: 0.6 });

      // each row assembles as it enters (scrubbed, not pinned)
      q('.rrow').forEach((row) => {
        const name = row.querySelectorAll('.rrow__name .ch__i');
        gsap.fromTo(name, { yPercent: 118 }, { yPercent: 0, ease: 'power3.out', stagger: 0.04, scrollTrigger: { trigger: row, start: 'top 82%', end: 'top 42%', scrub: 0.6 } });
        gsap.fromTo(row.querySelector('.rrow__vis'), { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', ease: 'power2.out', scrollTrigger: { trigger: row, start: 'top 80%', end: 'top 45%', scrub: 0.6 } });
        gsap.fromTo(row.querySelector('.rrow__rule'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: row, start: 'top 90%', end: 'top 55%', scrub: 0.6 } });
        gsap.fromTo(row.querySelectorAll('.rrow__q, .rrow__line, .rrow__stat'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: row, start: 'top 70%', end: 'top 45%', scrub: 0.6 } });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="research" className="res scene" data-theme="night" ref={root} aria-labelledby="res-h">
      <div className="res__intro">
        <div className="res__floor" aria-hidden="true" />
        <div className="res__fade" aria-hidden="true" />
        <span className="res__q display" aria-hidden="true">?</span>
        <h2 id="res-h" className="res__h display"><Lines lines={researchIntro} /></h2>
        <p className="res__intro-meta meta">Fig. 07 · Research and innovation</p>
      </div>

      <ol className="res__list">
        {researchAreas.map((a, i) => (
          <li className="rrow" key={a.id} data-cursor="EXPLORE">
            <span className="rrow__rule" aria-hidden="true" />
            <p className="rrow__idx meta">R/{pad2(i + 1)}</p>
            <h3 className="rrow__name display">
              <span className="sr">{a.name}</span>
              <span aria-hidden="true" className="chars">{[...a.name].map((c, k) => (<span className="ch" key={k}><span className="ch__i">{c}</span></span>))}</span>
            </h3>
            <div className="rrow__txt">
              <p className="rrow__q">{a.q}</p>
              <p className="rrow__line">{a.line}</p>
              <p className="rrow__stat meta">{a.stat}</p>
            </div>
            <div className="rrow__vis"><ResearchCanvas kind={a.kind} label={`Live diagram: ${a.name.toLowerCase()}`} /></div>
          </li>
        ))}
      </ol>
    </section>
  );
}
