import { useMemo } from 'react';
import { rng } from '../animations/utils.js';
import Plate from '../components/Plate.jsx';
import { images } from '../data/images.js';

const O = '#ff4d17', AMB = '#ffb36b', ICE = '#7fb2ff';

function skyline() {
  const r = rng(11); let s = '', x = -30;
  while (x < 1640) {
    const w = 36 + r() * 90, h = 110 + r() * 330, y = 900 - h;
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#070b1a"/>`;
    const cols = Math.floor(w / 14), rows = Math.floor(h / 22);
    for (let i = 0; i < cols * rows * 0.16; i++) {
      s += `<rect x="${x + 4 + Math.floor(r() * cols) * 14}" y="${y + 8 + Math.floor(r() * rows) * 22}" width="5" height="7" fill="${r() > 0.2 ? AMB : ICE}" opacity="${0.35 + r() * 0.6}"/>`;
    }
    x += w + 2 + r() * 8;
  }
  return s;
}

const ARCH = `
<defs>
  <linearGradient id="hg-in" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16224e"/><stop offset=".55" stop-color="#8a2f2a"/><stop offset="1" stop-color="${O}"/></linearGradient>
  <linearGradient id="hg-out" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0b1330"/><stop offset=".5" stop-color="#10193a"/><stop offset="1" stop-color="#070b1a"/></linearGradient>
  <linearGradient id="hg-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${AMB}" stop-opacity=".0"/><stop offset="1" stop-color="${AMB}" stop-opacity=".55"/></linearGradient>
  <clipPath id="hg-clip"><path d="M560,900 V520 A240,240 0 0 1 1040,520 V900Z"/></clipPath>
</defs>
<path fill-rule="evenodd" fill="url(#hg-out)" d="M400,900 V520 A400,400 0 0 1 1200,520 V900Z M560,900 V520 A240,240 0 0 1 1040,520 V900Z"/>
<path fill="none" stroke="${AMB}" stroke-opacity=".5" stroke-width="2" d="M560,900 V520 A240,240 0 0 1 1040,520 V900"/>
<path fill="none" stroke="${ICE}" stroke-opacity=".22" stroke-width="1.5" d="M400,900 V520 A400,400 0 0 1 1200,520 V900"/>
<g clip-path="url(#hg-clip)">
  <rect x="540" y="250" width="520" height="650" fill="url(#hg-in)"/>
  <circle cx="800" cy="600" r="64" fill="${O}" opacity=".9"/><circle cx="800" cy="600" r="130" fill="${O}" opacity=".25"/>
  <polygon points="690,520 910,520 1040,900 560,900" fill="url(#hg-beam)"/>
  ${Array.from({ length: 12 }, (_, i) => `<line x1="560" x2="1040" y1="${690 + Math.pow(i / 12, 1.6) * 210}" y2="${690 + Math.pow(i / 12, 1.6) * 210}" stroke="#05080f" stroke-opacity=".55" stroke-width="${2 + i * 0.5}"/>`).join('')}
  <rect x="560" y="820" width="480" height="80" fill="#05080f" opacity=".5"/>
</g>`;

const FORE = `
<defs><linearGradient id="hg-f" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#03050b"/><stop offset="1" stop-color="#0c1530"/></linearGradient>
<linearGradient id="hg-f2" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#03050b"/><stop offset="1" stop-color="#0c1530"/></linearGradient></defs>
<rect x="-80" y="-20" width="250" height="960" fill="url(#hg-f)"/><rect x="166" y="-20" width="3" height="960" fill="${AMB}" opacity=".4"/>
<rect x="1430" y="-20" width="250" height="960" fill="url(#hg-f2)"/><rect x="1431" y="-20" width="3" height="960" fill="${ICE}" opacity=".3"/>
<rect x="0" y="852" width="1600" height="60" fill="#03050b"/><rect x="560" y="850" width="480" height="3" fill="${O}" opacity=".9"/>`;

/** Four planes (sky → skyline → arch → foreground) so GSAP can drive real parallax. */
export default function HeroArt() {
  const sky = useMemo(skyline, []);
  const photo = images.hero.src;
  if (photo) {
    return (
      <div className="hero__plane hero__plane--photo" data-depth="photo">
        <Plate id="hero" eager tag={false} />
      </div>
    );
  }
  const svgAttrs = { viewBox: '0 0 1600 900', preserveAspectRatio: 'xMidYMax slice', 'aria-hidden': true, focusable: 'false' };
  return (
    <>
      <div className="hero__plane hero__plane--far" data-depth="far">
        <svg {...svgAttrs} dangerouslySetInnerHTML={{ __html: sky }} />
      </div>
      <div className="hero__plane hero__plane--arch" data-depth="arch" role="img" aria-label={images.hero.alt}>
        <svg {...svgAttrs} dangerouslySetInnerHTML={{ __html: ARCH }} />
      </div>
      <div className="hero__plane hero__plane--fore" data-depth="fore">
        <svg {...svgAttrs} dangerouslySetInnerHTML={{ __html: FORE }} />
      </div>
      <span className="plate__tag plate__tag--hero" aria-hidden="true">placeholder · hero · {images.hero.size}</span>
    </>
  );
}
