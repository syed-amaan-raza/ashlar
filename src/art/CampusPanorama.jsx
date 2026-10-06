import { useMemo } from 'react';
import { rng } from '../animations/utils.js';
import Plate from '../components/Plate.jsx';
import { images } from '../data/images.js';

const O = '#ff4d17', AMB = '#ffb36b', ICE = '#7fb2ff', BONE = '#ece9e1';
const GROUND = 800;

const win = (r, x, y, w, h, p = 0.5) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${r() < p ? (r() > 0.25 ? AMB : O) : ICE}" opacity="${r() < p ? 0.9 : 0.16}"/>`;

function build() {
  const r = rng(2024);

  // ── far layer: sky, sun glow, stars, distant skyline
  let far = `<defs>
    <linearGradient id="cp-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050912"/><stop offset=".5" stop-color="#18204a"/><stop offset=".82" stop-color="#8b3a3a"/><stop offset="1" stop-color="${O}"/></linearGradient>
    <radialGradient id="cp-sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${AMB}" stop-opacity=".85"/><stop offset="1" stop-color="${O}" stop-opacity="0"/></radialGradient></defs>
    <rect width="2400" height="1000" fill="url(#cp-sky)"/><circle cx="1300" cy="760" r="520" fill="url(#cp-sun)"/>`;
  for (let i = 0; i < 90; i++) far += `<circle cx="${r() * 2400}" cy="${r() * 380}" r="${r() * 1.4 + 0.3}" fill="${BONE}" opacity="${0.25 + r() * 0.6}"/>`;
  let x = -20;
  while (x < 2420) { const w = 30 + r() * 80, h = 60 + r() * 190; far += `<rect x="${x}" y="${GROUND - h}" width="${w}" height="${h}" fill="#0a1128" opacity=".9"/>`; x += w + 4 + r() * 10; }

  // ── mid layer: the four buildings
  let mid = '';
  // LIBRARY — long colonnade over a lit reading floor
  mid += `<rect x="230" y="${GROUND - 330}" width="480" height="30" fill="#0c1534"/><rect x="230" y="${GROUND - 300}" width="480" height="300" fill="#0a112a"/>`;
  mid += `<rect x="250" y="${GROUND - 270}" width="440" height="190" fill="${AMB}" opacity=".22"/>`;
  for (let i = 0; i < 13; i++) {
    const cx = 250 + i * 34;
    mid += `<rect x="${cx}" y="${GROUND - 280}" width="14" height="250" fill="#101a3c"/><rect x="${cx + 12}" y="${GROUND - 280}" width="2" height="250" fill="${AMB}" opacity=".45"/>`;
    if (i < 12) for (let k = 0; k < 4; k++) mid += win(r, cx + 18, GROUND - 255 + k * 42, 12, 28, 0.7);
  }
  for (let s = 0; s < 4; s++) mid += `<rect x="${215 - s * 10}" y="${GROUND - 30 + s * 8}" width="${510 + s * 20}" height="8" fill="#0c1534"/>`;

  // LABS — curtain-wall tower, bridge, mast, dish
  mid += `<rect x="900" y="${GROUND - 560}" width="170" height="560" fill="#0b1330"/><rect x="900" y="${GROUND - 560}" width="4" height="560" fill="${ICE}" opacity=".5"/>`;
  for (let row = 0; row < 14; row++) for (let c = 0; c < 4; c++) mid += win(r, 910 + c * 40, GROUND - 545 + row * 38, 28, 26, 0.35);
  mid += `<rect x="740" y="${GROUND - 240}" width="170" height="240" fill="#0a112a"/><rect x="1070" y="${GROUND - 200}" width="190" height="200" fill="#0a112a"/>`;
  for (let c = 0; c < 4; c++) { mid += win(r, 752 + c * 40, GROUND - 205, 28, 120, 0.55); }
  for (let c = 0; c < 5; c++) { mid += win(r, 1082 + c * 36, GROUND - 170, 26, 100, 0.5); }
  mid += `<rect x="910" y="${GROUND - 330}" width="-0" height="0"/><line x1="985" y1="${GROUND - 560}" x2="985" y2="${GROUND - 690}" stroke="${BONE}" stroke-width="3"/><circle cx="985" cy="${GROUND - 696}" r="7" fill="${O}"/>
    <path d="M1040,${GROUND - 590} q30,-34 62,0" fill="none" stroke="${BONE}" stroke-width="3"/><line x1="1071" y1="${GROUND - 585}" x2="1071" y2="${GROUND - 560}" stroke="${BONE}" stroke-width="3"/>`;

  // STUDIOS — sawtooth roofs with north-light glass
  for (let t = 0; t < 6; t++) {
    const sx = 1330 + t * 92;
    mid += `<polygon points="${sx},${GROUND} ${sx},${GROUND - 250} ${sx + 92},${GROUND - 170} ${sx + 92},${GROUND}" fill="#0b1330"/>
            <polygon points="${sx},${GROUND - 250} ${sx + 8},${GROUND - 250} ${sx + 8},${GROUND - 180} ${sx},${GROUND - 168}" fill="${AMB}" opacity=".85"/>`;
    mid += `<rect x="${sx + 14}" y="${GROUND - 150}" width="60" height="70" fill="${AMB}" opacity=".18"/>`;
  }
  mid += `<rect x="1530" y="${GROUND - 110}" width="120" height="110" fill="${O}" opacity=".85"/><rect x="1530" y="${GROUND - 110}" width="120" height="110" fill="none" stroke="#05080f" stroke-width="5"/>
          <line x1="1590" y1="${GROUND - 110}" x2="1590" y2="${GROUND}" stroke="#05080f" stroke-width="4"/>
          <path d="M1920,${GROUND} V${GROUND - 330} H1860" stroke="${BONE}" stroke-width="5" fill="none"/><line x1="1860" y1="${GROUND - 330}" x2="1860" y2="${GROUND - 250}" stroke="${BONE}" stroke-width="2"/><rect x="1848" y="${GROUND - 250}" width="24" height="18" fill="${O}"/>`;

  // CAFETERIA — pavilion, canopy, string lights, tables
  mid += `<rect x="1960" y="${GROUND - 150}" width="320" height="14" fill="#101a3c"/><rect x="1960" y="${GROUND - 150}" width="320" height="3" fill="${AMB}"/>`;
  for (let i = 0; i < 5; i++) mid += `<rect x="${1976 + i * 72}" y="${GROUND - 136}" width="9" height="136" fill="#101a3c"/>`;
  mid += `<rect x="1976" y="${GROUND - 126}" width="288" height="126" fill="${AMB}" opacity=".13"/>`;
  for (let k = 0; k < 4; k++) {
    const x0 = 1976 + k * 72, x1 = x0 + 72; mid += `<path d="M${x0},${GROUND - 150} Q${(x0 + x1) / 2},${GROUND - 112} ${x1},${GROUND - 150}" fill="none" stroke="${BONE}" stroke-opacity=".35"/>`;
    for (let b = 1; b < 6; b++) { const t = b / 6; mid += `<circle cx="${x0 + 72 * t}" cy="${GROUND - 150 + 38 * 2 * t * (1 - t)}" r="3.2" fill="${AMB}"/>`; }
  }
  for (let i = 0; i < 8; i++) { const tx = 1990 + i * 38 + r() * 8; mid += `<ellipse cx="${tx}" cy="${GROUND - 14}" rx="15" ry="5" fill="#0c1534"/><rect x="${tx - 1.5}" y="${GROUND - 14}" width="3" height="14" fill="#0c1534"/>`;
    if (r() > 0.3) mid += `<circle cx="${tx - 7}" cy="${GROUND - 38}" r="6" fill="#02040a"/><rect x="${tx - 12}" y="${GROUND - 32}" width="11" height="18" rx="5" fill="#02040a"/>`;
    if (r() > 0.4) mid += `<circle cx="${tx + 8}" cy="${GROUND - 40}" r="6" fill="#02040a"/><rect x="${tx + 3}" y="${GROUND - 34}" width="11" height="20" rx="5" fill="#02040a"/>`; }

  // ── near layer: ground, path, lamps, trees
  let near = `<defs><linearGradient id="cp-gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a102a"/><stop offset="1" stop-color="#03050b"/></linearGradient></defs>
    <rect y="${GROUND}" width="2400" height="${1000 - GROUND}" fill="url(#cp-gr)"/>
    <polygon points="1020,${GROUND} 1380,${GROUND} 1900,1000 560,1000" fill="${AMB}" opacity=".07"/>
    <line x1="0" y1="${GROUND}" x2="2400" y2="${GROUND}" stroke="${AMB}" stroke-opacity=".45" stroke-width="2"/>`;
  for (let i = 0; i < 9; i++) {
    const lx = 140 + i * 280 + r() * 40;
    near += `<line x1="${lx}" y1="${GROUND + 50}" x2="${lx}" y2="${GROUND - 120}" stroke="#03050b" stroke-width="5"/><circle cx="${lx}" cy="${GROUND - 126}" r="42" fill="${AMB}" opacity=".15"/><circle cx="${lx}" cy="${GROUND - 126}" r="7" fill="${AMB}"/>`;
  }
  for (let i = 0; i < 14; i++) {
    const tx = r() * 2400, ty = GROUND + 40 + r() * 120, tr = 22 + r() * 36;
    near += `<circle cx="${tx}" cy="${ty}" r="${tr}" fill="#050913"/><circle cx="${tx + tr * 0.4}" cy="${ty - tr * 0.5}" r="${tr * 0.7}" fill="#070c1c"/>`;
  }
  return { far, mid, near };
}

const attrs = { viewBox: '0 0 2400 1000', preserveAspectRatio: 'xMidYMid slice', 'aria-hidden': true, focusable: 'false' };

/** Three planes (far / mid / near) of one 2.4:1 panorama. Replace with a photo via images.campus. */
export default function CampusPanorama() {
  const { far, mid, near } = useMemo(build, []);
  if (images.campus.src) {
    return <div className="pano__layer pano__layer--photo"><Plate id="campus" eager tag={false} /></div>;
  }
  return (
    <>
      <div className="pano__layer" data-depth="far"><svg {...attrs} dangerouslySetInnerHTML={{ __html: far }} /></div>
      <div className="pano__layer" data-depth="mid" role="img" aria-label={images.campus.alt}><svg {...attrs} dangerouslySetInnerHTML={{ __html: mid }} /></div>
      <div className="pano__layer" data-depth="near"><svg {...attrs} dangerouslySetInnerHTML={{ __html: near }} /></div>
      <span className="plate__tag plate__tag--pano" aria-hidden="true">placeholder · campus · {images.campus.size}</span>
    </>
  );
}
