import { useEffect, useRef } from 'react';
import { site } from '../data/site.js';
import { useStory, setStory } from '../state/story.js';
import { scrollToScene, getLenis } from '../animations/smoothScroll.js';
import '../styles/chrome.css';

export default function Navigation() {
  const { id, theme, index, menuOpen } = useStory();
  const compact = index > 0;
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  const go = (scene) => {
    setStory({ menuOpen: false });
    // wait a frame so the menu closes, then travel
    requestAnimationFrame(() => scrollToScene(scene));
  };

  useEffect(() => {
    const lenis = getLenis();
    if (menuOpen) {
      lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
      menuRef.current?.querySelector('a,button')?.focus();
    } else {
      lenis?.start();
      document.documentElement.style.overflow = '';
    }
    const onKey = (e) => { if (e.key === 'Escape' && menuOpen) { setStory({ menuOpen: false }); btnRef.current?.focus(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <>
      <header className="nav" data-theme={theme} data-compact={compact} data-open={menuOpen}>
        <a className="nav__mark" href="#top" onClick={(e) => { e.preventDefault(); go('hero'); }} aria-label={`${site.full} — back to the start`}>
          <span className="nav__dot" aria-hidden="true" />
          <span className="nav__name">{site.name}</span>
        </a>

        <nav className="nav__pill" aria-label="Primary">
          <ul>
            {site.nav.map((n) => (
              <li key={n.scene}>
                <a href={`#${n.scene}`} data-active={id === n.scene} onClick={(e) => { e.preventDefault(); go(n.scene); }}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button ref={btnRef} className="nav__burger" aria-expanded={menuOpen} aria-controls="menu"
                onClick={() => setStory({ menuOpen: !menuOpen })}>
          <span className="nav__burger-label">{menuOpen ? 'Close' : 'Menu'}</span>
          <span className="nav__burger-bars" aria-hidden="true"><i /><i /></span>
        </button>
      </header>

      <div id="menu" ref={menuRef} className="menu" data-open={menuOpen} role="dialog" aria-modal="true" aria-label="Menu" inert={!menuOpen ? '' : undefined}>
        <ul className="menu__list">
          {site.nav.map((n, i) => (
            <li key={n.scene} style={{ '--i': i }}>
              <a href={`#${n.scene}`} onClick={(e) => { e.preventDefault(); go(n.scene); }}>
                <span className="menu__n">{String(i + 1).padStart(2, '0')}</span>
                <span className="menu__t">{n.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="menu__foot">{site.full}<br />Admissions {site.intake} are open.</p>
      </div>
    </>
  );
}
