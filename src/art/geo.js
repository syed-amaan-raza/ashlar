// World geometry, computed once. Real Natural-Earth data (110m) via world-atlas.
import { geoOrthographic, geoPath, geoGraticule10, geoContains } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import world from 'world-atlas/countries-110m.json';
import { location } from '../data/campus.js';

export const countries = feature(world, world.objects.countries).features;
export const land = feature(world, world.objects.land);
export const borders = mesh(world, world.objects.countries, (a, b) => a !== b);
export const grat = geoGraticule10();
export const sphere = { type: 'Sphere' };
export const point = [location.lon, location.lat];
export const home = countries.find((c) => geoContains(c, point)) || null;
export const homeName = home?.properties?.name ?? '';

/** Orthographic scale at which the home country fills the stage. */
export function countryScale(w, h) {
  if (!home) return Math.min(w, h) * 1.1;
  const p = Math.min(w, h) * 0.14;
  return geoOrthographic().rotate([-point[0], -point[1]]).fitExtent([[p, p], [w - p, h - p]], home).scale();
}

export function drawWorld(ctx, w, h, s, rot, { hl = 0, pulse = 0 } = {}) {
  ctx.clearRect(0, 0, w, h);
  const proj = geoOrthographic().translate([w / 2, h / 2]).scale(s).rotate(rot).clipAngle(90);
  const path = geoPath(proj, ctx);
  const g = ctx.createRadialGradient(w / 2 - s * 0.3, h / 2 - s * 0.3, s * 0.1, w / 2, h / 2, s * 1.05);
  g.addColorStop(0, '#13204a'); g.addColorStop(1, '#050912');
  ctx.beginPath(); path(sphere); ctx.fillStyle = g; ctx.fill();
  ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(140,175,255,.14)'; ctx.beginPath(); path(grat); ctx.stroke();
  ctx.beginPath(); path(land); ctx.fillStyle = 'rgba(185,196,220,.12)'; ctx.fill();
  ctx.beginPath(); path(borders); ctx.strokeStyle = 'rgba(185,196,220,.3)'; ctx.stroke();
  if (home && hl > 0) {
    ctx.beginPath(); path(home); ctx.fillStyle = `rgba(255,77,23,${0.18 * hl})`; ctx.fill();
    ctx.lineWidth = 1.8; ctx.strokeStyle = `rgba(255,77,23,${0.95 * hl})`; ctx.stroke();
  }
  ctx.beginPath(); path(sphere); ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(140,175,255,.4)'; ctx.stroke();
  const m = proj(point);
  if (m) {
    ctx.fillStyle = 'rgb(255,77,23)'; ctx.beginPath(); ctx.arc(m[0], m[1], 4.5, 0, 7); ctx.fill();
    ctx.strokeStyle = `rgba(255,77,23,${0.8 * (1 - pulse)})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(m[0], m[1], 6 + pulse * 34, 0, 7); ctx.stroke();
  }
}
