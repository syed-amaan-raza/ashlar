import { useEffect, useRef } from 'react';
import '../styles/chrome.css';

/** One 180×180 noise tile painted once, then shifted in steps by CSS. Cheap and film-like. */
export default function Grain() {
  const ref = useRef(null);
  useEffect(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 180;
    const g = c.getContext('2d');
    const d = g.createImageData(180, 180);
    for (let i = 0; i < d.data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
      d.data[i + 3] = 255;
    }
    g.putImageData(d, 0, 0);
    ref.current.style.backgroundImage = `url(${c.toDataURL('image/png')})`;
  }, []);
  return <div className="grain" ref={ref} aria-hidden="true" />;
}
