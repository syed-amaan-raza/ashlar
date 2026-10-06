import { useEffect, useRef } from 'react';

const BONE = '236,233,225', ICE = '127,178,255', OR = '255,77,23', AMB = '255,179,107';

// Each diagram says something about its field. All are pure functions of (ctx, w, h, t, state).
const DRAW = {
  // AI — layered network; signals travel the edges
  network: {
    init: () => ({ L: [3, 5, 5, 2] }),
    draw(c, w, h, t, S) {
      const cols = S.L.length, nodes = S.L.map((n, i) => Array.from({ length: n }, (_, j) => [w * (0.12 + (i / (cols - 1)) * 0.76), h * (0.5 + (j - (n - 1) / 2) * 0.17)]));
      c.lineWidth = 1;
      nodes.forEach((layer, i) => i < cols - 1 && layer.forEach((a, ai) => nodes[i + 1].forEach((b, bi) => {
        c.strokeStyle = `rgba(${ICE},.16)`; c.beginPath(); c.moveTo(...a); c.lineTo(...b); c.stroke();
        const ph = (t * 0.5 + ai * 0.21 + bi * 0.37 + i * 0.3) % 1;
        if (ph < 0.18 + ((ai + bi) % 3) * 0.05) { c.fillStyle = `rgba(${OR},.95)`; c.beginPath(); c.arc(a[0] + (b[0] - a[0]) * (ph / 0.3), a[1] + (b[1] - a[1]) * (ph / 0.3), 2.4, 0, 7); c.fill(); }
      })));
      nodes.flat().forEach(([x, y], k) => { c.fillStyle = `rgba(${BONE},${0.5 + 0.5 * Math.sin(t * 2 + k)})`; c.beginPath(); c.arc(x, y, 3.6, 0, 7); c.fill(); });
    },
  },
  // Biotech — double helix with base-pair rungs
  helix: {
    init: () => ({}),
    draw(c, w, h, t) {
      const n = Math.floor(w / 9);
      for (let i = 0; i < n; i++) {
        const x = 12 + (i / (n - 1)) * (w - 24), a = i * 0.42 + t * 1.6;
        const y1 = h / 2 + Math.sin(a) * h * 0.3, y2 = h / 2 - Math.sin(a) * h * 0.3, z = Math.cos(a);
        if (i % 2 === 0) { c.strokeStyle = `rgba(${BONE},.22)`; c.beginPath(); c.moveTo(x, y1); c.lineTo(x, y2); c.stroke(); }
        c.fillStyle = `rgba(${OR},${0.45 + z * 0.4})`; c.beginPath(); c.arc(x, y1, 3 + z * 1.6, 0, 7); c.fill();
        c.fillStyle = `rgba(${ICE},${0.45 - z * 0.4})`; c.beginPath(); c.arc(x, y2, 3 - z * 1.6, 0, 7); c.fill();
      }
    },
  },
  // Robotics — two-link arm chasing a target (inverse kinematics)
  arm: {
    init: () => ({}),
    draw(c, w, h, t) {
      const bx = w * 0.18, by = h * 0.86, L1 = h * 0.5, L2 = h * 0.46;
      const tx = w * 0.62 + Math.sin(t * 0.9) * w * 0.22, ty = h * 0.42 + Math.sin(t * 1.4) * h * 0.2;
      let dx = tx - bx, dy = ty - by, d = Math.min(Math.hypot(dx, dy), L1 + L2 - 1);
      const a = Math.atan2(dy, dx), k = Math.acos(Math.min(1, Math.max(-1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
      const j = [bx + Math.cos(a - k) * L1, by + Math.sin(a - k) * L1], e = [bx + Math.cos(a - k) * L1 + Math.cos(a - k + Math.acos(Math.min(1, Math.max(-1, (L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2)))) * -1 + Math.PI) * 0, 0];
      const ang2 = Math.atan2(ty - j[1], tx - j[0]); const end = [j[0] + Math.cos(ang2) * L2, j[1] + Math.sin(ang2) * L2];
      c.strokeStyle = `rgba(${OR},.5)`; c.setLineDash([3, 5]); c.beginPath(); c.arc(tx, ty, 14 + Math.sin(t * 6) * 2, 0, 7); c.stroke(); c.setLineDash([]);
      c.lineCap = 'round'; c.lineWidth = 5; c.strokeStyle = `rgba(${BONE},.85)`; c.beginPath(); c.moveTo(bx, by); c.lineTo(...j); c.lineTo(...end); c.stroke();
      c.lineWidth = 1; c.fillStyle = `rgb(5,9,18)`; [[bx, by], j].forEach(([x, y]) => { c.beginPath(); c.arc(x, y, 8, 0, 7); c.fill(); c.strokeStyle = `rgba(${BONE},.9)`; c.stroke(); });
      c.fillStyle = `rgb(${OR})`; c.beginPath(); c.arc(end[0], end[1], 6, 0, 7); c.fill();
    },
  },
  // Climate — a flow field leaving trails
  flow: {
    init: (w, h) => ({ p: Array.from({ length: 140 }, () => [Math.random() * w, Math.random() * h, Math.random() * 200]), first: true }),
    draw(c, w, h, t, S) {
      c.fillStyle = 'rgba(2,4,10,.1)'; c.fillRect(0, 0, w, h);
      S.p.forEach((p) => {
        const a = Math.sin(p[0] * 0.012 + t * 0.4) + Math.cos(p[1] * 0.015 - t * 0.3) * 1.2;
        const nx = p[0] + Math.cos(a) * 1.7, ny = p[1] + Math.sin(a) * 1.7;
        const heat = (p[1] / h);
        c.strokeStyle = `rgba(${heat < 0.45 ? ICE : OR},.7)`; c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(nx, ny); c.stroke();
        p[0] = nx; p[1] = ny; p[2]--;
        if (p[2] < 0 || nx < 0 || nx > w || ny < 0 || ny > h) { p[0] = Math.random() * w; p[1] = Math.random() * h; p[2] = 100 + Math.random() * 120; }
      });
    },
  },
  // Space — nested orbits
  orbit: {
    init: () => ({}),
    draw(c, w, h, t) {
      const cx = w / 2, cy = h / 2;
      c.fillStyle = `rgb(${AMB})`; c.beginPath(); c.arc(cx, cy, 7, 0, 7); c.fill();
      [[0.18, 0.5, 1.4], [0.3, 0.62, 0.9], [0.42, 0.74, 0.55], [0.54, 0.86, 0.32]].forEach(([rx, ry, sp], i) => {
        c.strokeStyle = `rgba(${ICE},.24)`; c.beginPath(); c.ellipse(cx, cy, w * rx, h * ry * 0.5, -0.35, 0, 7); c.stroke();
        for (let k = 0; k < 14; k++) { const a = t * sp + i * 2 - k * 0.045; c.fillStyle = `rgba(${i === 1 ? OR : BONE},${(1 - k / 14) * 0.9})`;
          const x = cx + Math.cos(a) * w * rx * Math.cos(-0.35) - Math.sin(a) * h * ry * 0.5 * Math.sin(-0.35), y = cy + Math.cos(a) * w * rx * Math.sin(-0.35) + Math.sin(a) * h * ry * 0.5 * Math.cos(-0.35);
          c.beginPath(); c.arc(x, y, k ? 1.6 : 4.2, 0, 7); c.fill(); }
      });
    },
  },
  // Materials — a lattice with a crack that heals itself
  lattice: {
    init: () => ({}),
    draw(c, w, h, t) {
      const cols = 14, rows = 8, gx = w / (cols + 1), gy = h / (rows + 1);
      const heal = 0.5 + 0.5 * Math.sin(t * 0.7); // 0 = cracked, 1 = healed
      const P = (i, j) => {
        let x = (i + 1) * gx, y = (j + 1) * gy;
        const dist = Math.abs(j - (rows - 1) / 2 + 0.5), crack = (1 - heal) * Math.max(0, 1.6 - dist) * (i > 3 && i < 11 ? 1 : 0);
        return [x + Math.sin(i * 3.1 + j) * crack * 2, y + (j < rows / 2 ? -1 : 1) * crack * 12];
      };
      c.lineWidth = 1;
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const a = P(i, j);
        [[1, 0], [0, 1]].forEach(([di, dj]) => { if (i + di < cols && j + dj < rows) { const b = P(i + di, j + dj), broken = Math.hypot(b[0] - a[0], b[1] - a[1]) > gx * 1.35;
          c.strokeStyle = broken ? `rgba(${OR},.9)` : `rgba(${ICE},.3)`; c.setLineDash(broken ? [2, 4] : []); c.beginPath(); c.moveTo(...a); c.lineTo(...b); c.stroke(); } });
        c.setLineDash([]); c.fillStyle = `rgba(${BONE},.85)`; c.beginPath(); c.arc(a[0], a[1], 2.4, 0, 7); c.fill();
      }
    },
  },
};

/** Live diagram. Runs only while on screen; draws one still frame under reduced motion. */
export default function ResearchCanvas({ kind, label }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, c = cv.getContext('2d');
    const spec = DRAW[kind] || DRAW.network;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0, vis = false, S = null;
    const size = () => {
      const r = cv.getBoundingClientRect(); const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr; c.setTransform(dpr, 0, 0, dpr, 0, 0); S = spec.init(w, h);
      if (!vis || reduce) { c.clearRect(0, 0, w, h); spec.draw(c, w, h, 3, S); }
    };
    const loop = (ms) => { if (!vis) { raf = 0; return; } if (kind !== 'flow') c.clearRect(0, 0, w, h); spec.draw(c, w, h, ms / 1000, S); raf = requestAnimationFrame(loop); };
    const ro = new ResizeObserver(size); ro.observe(cv); size();
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !raf && !reduce) raf = requestAnimationFrame(loop); }, { rootMargin: '80px' });
    io.observe(cv);
    return () => { ro.disconnect(); io.disconnect(); cancelAnimationFrame(raf); };
  }, [kind]);
  return <canvas ref={ref} className="rcv" role="img" aria-label={label} />;
}
