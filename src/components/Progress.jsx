import { useEffect, useRef } from 'react';
import { chapters, FILM_LENGTH_SECONDS } from '../data/chapters.js';
import { gsap, ScrollTrigger, sceneStart } from '../animations/gsap.js';
import { scrollToScene } from '../animations/smoothScroll.js';
import { fmtTime, pad2 } from '../animations/utils.js';
import { useStory } from '../state/story.js';
import '../styles/chrome.css';

/**
 * Scroll is time. The bar is a film scrubber: a playhead on a line with a tick per scene,
 * a timecode, and the current scene name. Updates via refs on GSAP's ticker (no re-renders).
 */
export default function Progress() {
  const { index, theme } = useStory();
  const head = useRef(null), fill = useRef(null), time = useRef(null), ticksRef = useRef(null);

  useEffect(() => {
    const place = () => {
      const max = ScrollTrigger.maxScroll(window) || 1;
      ticksRef.current?.querySelectorAll('button').forEach((b, i) => {
        const st = ScrollTrigger.getById(`scene-${chapters[i].id}`);
        b.style.display = st ? '' : 'none';
        b.style.left = `${((st?.start ?? 0) / max) * 100}%`;
      });
    };
    ScrollTrigger.addEventListener('refresh', place);
    place();
    let last = -1;
    const loop = () => {
      const max = ScrollTrigger.maxScroll(window) || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      if (Math.abs(p - last) < 0.0002) return;
      last = p;
      if (head.current) head.current.style.left = `${p * 100}%`;
      if (fill.current) fill.current.style.transform = `scaleX(${p})`;
      if (time.current) time.current.textContent = `${fmtTime(p * FILM_LENGTH_SECONDS)} / ${fmtTime(FILM_LENGTH_SECONDS)}`;
    };
    gsap.ticker.add(loop);
    return () => { gsap.ticker.remove(loop); ScrollTrigger.removeEventListener('refresh', place); };
  }, []);

  return (
    <footer className="prog" data-theme={theme} aria-label="Story progress">
      <p className="prog__scene" aria-live="off">
        <span className="prog__n">{pad2(index + 1)}<i>/</i>{pad2(chapters.length)}</span>
        <span className="prog__t">{chapters[index].label}</span>
      </p>
      <div className="prog__line" ref={ticksRef}>
        <span className="prog__rail" aria-hidden="true" />
        <span className="prog__fill" ref={fill} aria-hidden="true" />
        {chapters.map((c, i) => (
          <button key={c.id} className="prog__tick" data-on={i <= index} onClick={() => scrollToScene(c.id)} aria-label={`Go to scene ${i + 1}: ${c.label}`} />
        ))}
        <span className="prog__head" ref={head} aria-hidden="true" />
      </div>
      <p className="prog__time" ref={time} aria-hidden="true">00:00 / {fmtTime(FILM_LENGTH_SECONDS)}</p>
    </footer>
  );
}
