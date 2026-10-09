import { ringArea2 } from '../spatial.js';
import { ZAMKOWA_NW } from './zamkowa-nw.js';
import { ZAMKOWA_SE } from './zamkowa-se.js';

/* ---------- fronty kamienic odtworzonych ze zdjęć: krawędź obrysu OSM → opis z danymi (mid = środek krawędzi) ---------- */
const ZAMKOWA = [...ZAMKOWA_NW, ...ZAMKOWA_SE];
export const nearMid = (list, x, z) => list.find(k => Math.hypot(k.mid[0] - x, k.mid[1] - z) < 20) || null;
export const edgeMid = (ring, i) => { const j = (i + 2) % ring.length; return [(ring[i] + ring[j]) / 2, (ring[i + 1] + ring[j + 1]) / 2]; };

// front dla kamieniceMeshes: krawędź i od ring[i] do następnego wierzchołka, normalna na zewnątrz obrysu
export function realFront(ring, i, spec, hit) {
  const j = (i + 2) % ring.length, x0 = ring[i], z0 = ring[i + 1], len = Math.hypot(ring[j] - x0, ring[j + 1] - z0), sg = ringArea2(ring) > 0 ? 1 : -1;
  const tx = (ring[j] - x0) / len, tz = (ring[j + 1] - z0) / len;
  return { x0, z0, x1: ring[j], z1: ring[j + 1], nx: sg * tz, nz: -sg * tx, len, spec, hit };
}

// ulica Zamkowa: krawędzie obrysu z własnym frontem; null, gdy budynek nie stoi przy Zamkowej
// skip = maska krawędzi bez zwykłej ściany, eave = najwyższy okap frontów (do niego sięgają ściany i dach)
export function zamkowaFronts(ring) {
  const list = [];
  for (let i = 0; i < ring.length; i += 2) { const s = nearMid(ZAMKOWA, ...edgeMid(ring, i)); if (s) list.push([i, s]); }
  if (!list.length) return null;
  const skip = []; for (let i = 0; i < ring.length; i += 2) skip.push(list.some(([k]) => k === i));
  return { list, skip, eave: Math.max(...list.map(([, s]) => s.eave)), wall: list[0][1].wall };
}
