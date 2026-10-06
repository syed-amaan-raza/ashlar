import { useMemo } from 'react';
import { rng } from '../animations/utils.js';
import { plan } from '../data/campus.js';
import { location } from '../data/campus.js';

const BONE = '#ece9e1', O = '#ff4d17', ICE = '#7fb2ff';

/** Stylised city: river, ring road, arterials, block texture. 1000×640, campus footprint at the centre. */
export function CitySVG() {
  const blocks = useMemo(() => {
    const r = rng(77); const out = [];
    for (let i = 0; i < 520; i++) {
      const x = r() * 1000, y = r() * 640, d = Math.hypot(x - 500, y - 320);
      if (d < 70 || d > 470) continue;
      out.push(<rect key={i} x={x} y={y} width={6 + r() * 20} height={5 + r() * 14} fill={ICE} opacity={0.05 + r() * 0.12} />);
    }
    return out;
  }, []);
  return (
    <svg viewBox="0 0 1000 640" className="map__svg" aria-hidden="true" focusable="false">
      {blocks}
      <path d="M-20,470 C180,380 300,520 520,470 C700,430 800,300 1020,330" fill="none" stroke={ICE} strokeOpacity=".5" strokeWidth="26" strokeLinecap="round" />
      <path d="M-20,470 C180,380 300,520 520,470 C700,430 800,300 1020,330" fill="none" stroke="#050912" strokeWidth="18" strokeLinecap="round" />
      <circle cx="500" cy="320" r="250" fill="none" stroke={BONE} strokeOpacity=".28" strokeWidth="2" strokeDasharray="2 6" />
      <circle cx="500" cy="320" r="150" fill="none" stroke={BONE} strokeOpacity=".2" strokeWidth="1.5" />
      {[[0, 300, 1000, 340], [120, 40, 880, 620], [820, 20, 180, 640], [500, 0, 500, 640]].map(([a, b, c, d], i) => (<line key={i} x1={a} y1={b} x2={c} y2={d} stroke={BONE} strokeOpacity=".3" strokeWidth={i === 3 ? 2.5 : 1.6} />))}
      <rect x="440" y="282" width="120" height="76" fill={O} fillOpacity=".25" stroke={O} strokeWidth="2.2" />
      <circle cx="500" cy="320" r="5" fill={O} />
      <text x="500" y="270" textAnchor="middle" fill={BONE} fontSize="12" fontFamily="IBM Plex Mono, monospace">ASHLAR CAMPUS</text>
      {plan.nearby.map((n) => (<g key={n.id}><circle cx={n.x * 0.82 + 70} cy={n.y * 0.82 + 40} r="3.5" fill={BONE} /><text x={n.x * 0.82 + 80} y={n.y * 0.82 + 44} fill={BONE} fillOpacity=".7" fontSize="11" fontFamily="IBM Plex Mono, monospace">{n.name}</text></g>))}
      <text x="26" y="600" fill={BONE} fillOpacity=".55" fontSize="11" fontFamily="IBM Plex Mono, monospace">{location.city.toUpperCase()}</text>
    </svg>
  );
}

/** Plan of the grounds. Groups carry data-group so the scroll can light them up one at a time. */
export function CampusSVG() {
  return (
    <svg viewBox="0 0 1000 640" className="map__svg map__svg--plan" aria-hidden="true" focusable="false">
      <rect x="150" y="60" width="760" height="470" fill="none" stroke={BONE} strokeOpacity=".28" strokeDasharray="4 6" />
      <path d="M150,330 C300,300 420,360 540,330 S800,300 910,330" fill="none" stroke={BONE} strokeOpacity=".22" strokeWidth="14" />
      <path d="M520,60 C500,200 560,300 520,530" fill="none" stroke={BONE} strokeOpacity=".22" strokeWidth="14" />
      <ellipse cx="270" cy="150" rx="70" ry="38" fill={ICE} fillOpacity=".18" stroke={ICE} strokeOpacity=".5" />
      <g data-group="buildings">
        {plan.buildings.map((b) => (
          <g key={b.id} data-kind={b.dept ? 'dept' : 'facility'}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={b.dept ? O : BONE} fillOpacity={b.dept ? 0.12 : 0.06} stroke={b.dept ? O : BONE} strokeOpacity=".9" strokeWidth="1.6" />
            <text x={b.x + 8} y={b.y + 18} fill={BONE} fontSize="11.5" fontFamily="IBM Plex Mono, monospace">{b.name}</text>
          </g>
        ))}
      </g>
      <g data-group="transport">
        {plan.transport.map((t) => (<g key={t.id}><rect x={t.x - 8} y={t.y - 8} width="16" height="16" transform={`rotate(45 ${t.x} ${t.y})`} fill={O} /><text x={t.x + 18} y={t.y + 4} fill={BONE} fontSize="12" fontFamily="IBM Plex Mono, monospace">{t.name} · {t.note}</text></g>))}
      </g>
      <g data-group="nearby">
        {plan.nearby.map((n) => (<g key={n.id}><line x1="500" y1="320" x2={n.x} y2={n.y} stroke={BONE} strokeOpacity=".35" strokeDasharray="3 6" /><circle cx={n.x} cy={n.y} r="5" fill="none" stroke={BONE} strokeWidth="1.6" /><text x={n.x - 6} y={n.y - 12} textAnchor={n.x > 700 ? 'end' : 'start'} fill={BONE} fontSize="12" fontFamily="IBM Plex Mono, monospace">{n.name} · {n.note}</text></g>))}
      </g>
    </svg>
  );
}
