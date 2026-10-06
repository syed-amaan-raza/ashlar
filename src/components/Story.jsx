import { useLayoutEffect, useRef } from 'react';
import { gsap, MQ, markScene, sceneId } from '../animations/gsap.js';
import { setThemeOverride } from '../animations/chapterTracker.js';
import { Lines } from './Split.jsx';
import { story } from '../data/story.js';
import '../styles/story.css';

/**
 * 02 · THE COLLEGE AS A STORY
 *  Four phrases. Each one doesn't vanish — it swells past the camera and
 *  hollows into an outline that stays behind, so the next phrase appears
 *  at the end of a tunnel of its predecessors. Orange then cools to night.
 */
export default function Story() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add({ full: MQ.full, lite: MQ.lite, reduce: MQ.reduce }, (ctx) => {
      const { full, reduce } = ctx.conditions;
      if (reduce) return markScene('story', el);

      const pin = q('.story__pin')[0];
      const phrases = q('.phrase');
      const chars = phrases.map((p) => p.querySelectorAll('.ch__i'));
      let progress = 0;
      const off = setThemeOverride('story', () => (progress > 0.86 ? 'night' : 'signal'));

      // everything after the first phrase starts below its mask
      phrases.slice(1).forEach((p, i) => gsap.set(chars[i + 1], { yPercent: 118 }));
      gsap.set(phrases.slice(1), { scale: 0.9 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: sceneId('story'), trigger: el, start: 'top top', end: () => `+=${Math.round(window.innerHeight * (full ? 4.2 : 3.6))}`,
          scrub: 0.7, pin: true, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 11,
          onUpdate: (s) => { progress = s.progress; },
        },
      });

      // phrase 0 — a little scale breathing while we read it
      tl.fromTo(phrases[0], { scale: 1 }, { scale: 1.04, duration: 0.8 }, 0);

      let t = 0.8;
      for (let i = 0; i < phrases.length - 1; i++) {
        const depth = (full ? 2.0 : 1.7) + i * (full ? 1.15 : 0.9);
        // outgoing → hollow ghost, swelling past the lens
        tl.to(phrases[i], { scale: depth, color: 'rgba(20,22,28,0)', opacity: 0.22, ease: 'power2.in', duration: 1.15 }, t)
          // incoming → letters rise from the centre outward
          .to(phrases[i + 1], { scale: 1, ease: 'power3.out', duration: 1.1 }, t + 0.35)
          .to(chars[i + 1], { yPercent: 0, ease: 'power3.out', duration: 0.9, stagger: { each: 0.035, from: 'center' } }, t + 0.35);
        t += 1.7;
      }

      // hold on the last phrase, then the orange cools to night
      t += 0.5;
      tl.to(pin, { backgroundColor: '#050912', '--gridc': 'rgba(140,175,255,.13)', '--ghost': 'rgba(236,233,225,.5)', duration: 1.4 }, t)
        .to(phrases[phrases.length - 1], { color: '#ece9e1', duration: 1.2 }, t)
        .to(phrases.slice(0, -1), { webkitTextStrokeColor: 'rgba(236,233,225,.5)', duration: 1.2 }, t)
        .to([q('.story__fig')[0], q('.story__lede')[0]], { color: '#aab6d0', duration: 1.2 }, t)
        .to({}, { duration: 0.5 });

      return () => off();
    });

    return () => mm.revert();
  }, []);

  const [first, ...rest] = story.phrases;
  return (
    <section id="story" className="story scene" data-theme="signal" ref={root} aria-labelledby="story-h">
      <div className="story__pin">
        <div className="story__grid" aria-hidden="true" />
        <div className="story__stage">
          <h2 id="story-h" className="phrase display"><Lines lines={first} chars /></h2>
          {rest.map((p, i) => (
            <p className="phrase display" key={i}><Lines lines={p} chars /></p>
          ))}
        </div>
        <p className="story__fig meta">Fig. 01 · Not just a campus</p>
        <p className="story__lede">{story.lede}</p>
      </div>
    </section>
  );
}
