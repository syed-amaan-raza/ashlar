// ─────────────────────────────────────────────────────────────
//  Generative PLACEHOLDER plates. Each returns an SVG string.
//  They exist so every scene is fully art-directed before real
//  photography arrives; <Plate> hides them once `src` is set.
// ─────────────────────────────────────────────────────────────
import { rng, hash } from '../animations/utils.js';

const O = '#ff4d17', AMB = '#ffb36b', ICE = '#7fb2ff', BONE = '#ece9e1';
const W = 800, H = 600;

const grad = (id, stops, x2 = 0, y2 = 1) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops
    .map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`)
    .join('')}</linearGradient>`;

const kinds = {
  // Tall monoliths with a lit edge and a slit of light — architectural.
  slabs(u, r) {
    let s = `<defs>${grad(u + 'a', [[0, '#0b1430'], [1, '#05080f']])}${grad(u + 'b', [[0, '#1a2a55'], [1, '#080d1c']], 1, 0)}${grad(u + 'c', [[0, O, 0.9], [1, O, 0]])}</defs>
      <rect width="${W}" height="${H}" fill="url(#${u}a)"/>
      <ellipse cx="${300 + r() * 200}" cy="${H * 0.75}" rx="420" ry="160" fill="url(#${u}c)" opacity=".28"/>`;
    let x = -40;
    while (x < W) {
      const w = 70 + r() * 150, h = 160 + r() * 360, y = H - h;
      s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${u}b)"/>
            <rect x="${x + w - 3}" y="${y}" width="3" height="${h}" fill="${AMB}" opacity="${0.15 + r() * 0.5}"/>`;
      if (r() > 0.55) s += `<rect x="${x + w * 0.35}" y="${y + h * 0.25}" width="${w * 0.08}" height="${h * 0.5}" fill="${O}" opacity=".9"/>`;
      x += w + 6 + r() * 30;
    }
    return s + `<rect y="${H - 36}" width="${W}" height="36" fill="#04070d"/>`;
  },
  // Stage beams with haze and a silhouetted crowd.
  beams(u, r) {
    let s = `<defs>${grad(u + 'a', [[0, '#050912'], [1, '#101a3a']])}${grad(u + 'b', [[0, BONE, 0.55], [1, BONE, 0]])}</defs>
      <rect width="${W}" height="${H}" fill="url(#${u}a)"/>`;
    for (let i = 0; i < 6; i++) {
      const x0 = 80 + i * 130 + r() * 30, x1 = x0 + (r() - 0.5) * 360;
      const col = i % 3 === 0 ? O : i % 3 === 1 ? ICE : AMB;
      s += `<polygon points="${x0 - 6},0 ${x0 + 6},0 ${x1 + 120},${H} ${x1 - 120},${H}" fill="${col}" opacity="${0.12 + r() * 0.18}"/>`;
    }
    s += `<ellipse cx="${W / 2}" cy="${H - 110}" rx="360" ry="40" fill="${BONE}" opacity=".14"/>`;
    for (let i = 0; i < 38; i++) {
      const x = 10 + i * 21 + r() * 8, y = H - 28 - r() * 40;
      s += `<circle cx="${x}" cy="${y}" r="${9 + r() * 4}" fill="#02040a"/><rect x="${x - 11}" y="${y + 6}" width="22" height="70" rx="9" fill="#02040a"/>`;
    }
    return s;
  },
  // Pitch from above: lines, players, floodlight bloom.
  court(u, r) {
    let s = `<defs>${grad(u + 'a', [[0, '#0a1a2c'], [1, '#050912']])}<radialGradient id="${u}b"><stop offset="0" stop-color="${AMB}" stop-opacity=".45"/><stop offset="1" stop-color="${AMB}" stop-opacity="0"/></radialGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#${u}a)"/><ellipse cx="${W / 2}" cy="${H / 2}" rx="520" ry="360" fill="url(#${u}b)"/>
      <g fill="none" stroke="${BONE}" stroke-opacity=".6" stroke-width="3"><rect x="90" y="90" width="620" height="420"/><line x1="400" y1="90" x2="400" y2="510"/>
      <circle cx="400" cy="300" r="62"/><rect x="90" y="205" width="90" height="190"/><rect x="620" y="205" width="90" height="190"/></g>`;
    for (let i = 0; i < 14; i++) {
      const x = 130 + r() * 540, y = 120 + r() * 360;
      s += `<circle cx="${x}" cy="${y}" r="9" fill="${i % 2 ? O : ICE}"/>`;
    }
    return s + `<circle cx="${400 + (r() - 0.5) * 120}" cy="${300 + (r() - 0.5) * 80}" r="6" fill="${BONE}"/>`;
  },
  // Perspective floor + ceiling + a glowing object (labs, robotics arena).
  grid3d(u, r) {
    let s = `<defs>${grad(u + 'a', [[0, '#050912'], [0.55, '#0c1630'], [1, '#050912']])}<radialGradient id="${u}b"><stop offset="0" stop-color="${O}" stop-opacity=".7"/><stop offset="1" stop-color="${O}" stop-opacity="0"/></radialGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#${u}a)"/><g stroke="${ICE}" stroke-opacity=".28" fill="none">`;
    const hy = 250;
    for (let i = -10; i <= 10; i++) s += `<line x1="${W / 2 + i * 26}" y1="${hy}" x2="${W / 2 + i * 150}" y2="${H}"/>`;
    for (let k = 1; k < 12; k++) { const y = hy + Math.pow(k / 12, 2.2) * (H - hy); s += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`; }
    s += `</g><ellipse cx="${W / 2}" cy="${hy + 80}" rx="190" ry="120" fill="url(#${u}b)"/>`;
    const cx = 340 + r() * 120, cy = 330;
    s += `<g stroke="${BONE}" stroke-width="3" fill="none" stroke-linecap="round"><path d="M${cx},${H - 90} L${cx + 40},${cy + 20} L${cx + 130},${cy - 60}"/><circle cx="${cx + 40}" cy="${cy + 20}" r="9" fill="#050912"/><circle cx="${cx + 130}" cy="${cy - 60}" r="7" fill="${O}" stroke="${O}"/></g>`;
    return s;
  },
  // A wall of lit screens.
  screens(u, r) {
    let s = `<rect width="${W}" height="${H}" fill="#050912"/>`;
    const cols = 8, rows = 6, cw = W / cols, rh = H / rows;
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const lit = r(); const c = lit > 0.82 ? O : lit > 0.45 ? ICE : '#101a3a';
      s += `<rect x="${x * cw + 8}" y="${y * rh + 8}" width="${cw - 16}" height="${rh - 16}" fill="${c}" opacity="${c === '#101a3a' ? 1 : 0.18 + r() * 0.3}"/>`;
      if (c !== '#101a3a') for (let l = 0; l < 3; l++) s += `<rect x="${x * cw + 18}" y="${y * rh + 22 + l * 14}" width="${(cw - 36) * (0.3 + r() * 0.7)}" height="3" fill="${BONE}" opacity=".55"/>`;
    }
    return s;
  },
  // Bunting and lanterns — festivals, cultural night.
  bunting(u, r) {
    let s = `<defs>${grad(u + 'a', [[0, '#0b1230'], [1, '#3a1a1a']])}</defs><rect width="${W}" height="${H}" fill="url(#${u}a)"/>`;
    for (let k = 0; k < 4; k++) {
      const y0 = 60 + k * 70, sag = 70 + r() * 40; let d = `M-10,${y0} Q${W / 2},${y0 + sag} ${W + 10},${y0}`;
      s += `<path d="${d}" fill="none" stroke="${BONE}" stroke-opacity=".5" stroke-width="2"/>`;
      for (let i = 1; i < 18; i++) {
        const t = i / 18, x = -10 + (W + 20) * t, y = (1 - t) * (1 - t) * y0 + 2 * t * (1 - t) * (y0 + sag) + t * t * y0;
        s += `<polygon points="${x - 11},${y} ${x + 11},${y} ${x},${y + 30}" fill="${[O, AMB, ICE, BONE][(i + k) % 4]}" opacity=".85"/>`;
      }
    }
    for (let i = 0; i < 9; i++) { const x = 60 + i * 85 + r() * 20, y = 360 + r() * 140; s += `<circle cx="${x}" cy="${y}" r="26" fill="${AMB}" opacity=".16"/><circle cx="${x}" cy="${y}" r="8" fill="${AMB}"/>`; }
    return s;
  },
  // Equaliser bars — music, sound.
  waves(u, r) {
    let s = `<rect width="${W}" height="${H}" fill="#060a14"/>`;
    const n = 48, bw = W / n;
    for (let i = 0; i < n; i++) {
      const h = 40 + Math.abs(Math.sin(i * 0.37 + r())) * 240 * (0.4 + r() * 0.6);
      s += `<rect x="${i * bw + 3}" y="${H / 2 - h / 2}" width="${bw - 6}" height="${h}" fill="${i % 7 === 0 ? O : i % 3 === 0 ? AMB : ICE}" opacity="${0.35 + r() * 0.55}"/>`;
    }
    return s + `<line x1="0" y1="${H / 2}" x2="${W}" y2="${H / 2}" stroke="${BONE}" stroke-opacity=".35"/>`;
  },
  // Shelves / studio wall — rows of spines and prototypes.
  shelves(u, r) {
    let s = `<defs>${grad(u + 'a', [[0, '#0d1226'], [1, '#04060c']])}</defs><rect width="${W}" height="${H}" fill="url(#${u}a)"/>`;
    for (let row = 0; row < 5; row++) {
      const y = 40 + row * 112; let x = 14;
      while (x < W - 20) {
        const w = 10 + r() * 34, h = 52 + r() * 46, c = r();
        s += `<rect x="${x}" y="${y + 100 - h}" width="${w}" height="${h}" fill="${c > 0.9 ? O : c > 0.7 ? AMB : c > 0.45 ? '#223566' : '#16224a'}" opacity="${0.55 + r() * 0.45}"/>`;
        x += w + 3;
      }
      s += `<rect x="0" y="${y + 100}" width="${W}" height="4" fill="${AMB}" opacity=".22"/>`;
    }
    return s;
  },
  // Topographic contours — sciences, climate.
  contour(u, r) {
    let s = `<rect width="${W}" height="${H}" fill="#050912"/><g fill="none" stroke="${ICE}" stroke-opacity=".38" stroke-width="1.6">`;
    const cx = 300 + r() * 200, cy = 260 + r() * 100;
    for (let k = 1; k < 22; k++) {
      let d = ''; const base = k * 22;
      for (let a = 0; a <= 64; a++) {
        const t = (a / 64) * Math.PI * 2;
        const rad = base * (1 + 0.18 * Math.sin(t * 3 + k * 0.4) + 0.1 * Math.sin(t * 5 - k * 0.2));
        d += `${a ? 'L' : 'M'}${(cx + Math.cos(t) * rad * 1.3).toFixed(1)},${(cy + Math.sin(t) * rad).toFixed(1)}`;
      }
      s += `<path d="${d}Z" ${k % 7 === 0 ? `stroke="${O}" stroke-opacity=".9" stroke-width="2.4"` : ''}/>`;
    }
    return s + '</g>';
  },
  // Dusk sky and skyline.
  dusk(u, r) {
    let s = `<defs>${grad(u + 'a', [[0, '#050912'], [0.55, '#1b2350'], [0.85, '#7a2f3a'], [1, O]])}</defs><rect width="${W}" height="${H}" fill="url(#${u}a)"/>`;
    for (let i = 0; i < 40; i++) s += `<circle cx="${r() * W}" cy="${r() * 260}" r="${r() * 1.3 + 0.3}" fill="${BONE}" opacity="${0.3 + r() * 0.6}"/>`;
    let x = -20;
    while (x < W) { const w = 30 + r() * 80, h = 80 + r() * 220; s += `<rect x="${x}" y="${H - h}" width="${w}" height="${h}" fill="#070b18"/>`; if (r() > 0.4) for (let k = 0; k < 6; k++) s += `<rect x="${x + 6 + r() * (w - 14)}" y="${H - h + 12 + r() * (h - 30)}" width="4" height="5" fill="${AMB}" opacity=".85"/>`; x += w + 2; }
    return s;
  },
  // Placeholder portrait: silhouette, halftone, scan line.
  portrait(u, r, tint = '#0c1a3a') {
    const w = 600, h = 750;
    let s = `<defs>${grad(u + 'a', [[0, tint], [1, '#04060c']])}<radialGradient id="${u}b" cx=".5" cy=".38" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <pattern id="${u}p" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="1.4" fill="#fff" opacity=".14"/></pattern></defs>
      <rect width="${w}" height="${h}" fill="url(#${u}a)"/><rect width="${w}" height="${h}" fill="url(#${u}b)"/>
      <path d="M60,${h} C70,540 150,500 300,490 C450,500 530,540 540,${h}Z" fill="#05080f"/>
      <ellipse cx="300" cy="300" rx="112" ry="140" fill="#05080f"/><rect x="262" y="410" width="76" height="90" fill="#05080f"/>
      <rect width="${w}" height="${h}" fill="url(#${u}p)"/>`;
    return { svg: s, w, h };
  },
};

export function plateSVG(kind, key, tint) {
  const u = 'p' + hash(key + kind).toString(36);
  const r = rng(hash(key));
  const fn = kinds[kind] || kinds.slabs;
  const out = fn(u, r, tint);
  if (typeof out === 'object') {
    return `<svg viewBox="0 0 ${out.w} ${out.h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${out.svg}</svg>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${out}</svg>`;
}
