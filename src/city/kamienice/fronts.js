import { ringArea2 } from '../spatial.js';
import { JOZEFA } from './jozefa.js';
import { KROTKA } from './krotka.js';
import { ZAMKOWA_NW } from './zamkowa-nw.js';
import { ZAMKOWA_SE } from './zamkowa-se.js';

/* ---------- fronty kamienic odtworzonych ze zdjęć: krawędź obrysu OSM → opis z danymi (mid = środek krawędzi) ---------- */
// Opis ze span = [[x, z], [x, z]] (w kolejności obrysu) zastępuje całą elewację wzdłuż tego odcinka: wszystkie krawędzie
// obrysu leżące przy nim (ząbki pilastrów, płytkie ryzality) giną pod jednym frontem.
const ALL = [...ZAMKOWA_NW, ...ZAMKOWA_SE, ...JOZEFA, ...KROTKA], SPANS = ALL.filter(s => s.span), NEAR = 8;
export const nearMid = (list, x, z) => list.find(k => !k.span && Math.hypot(k.mid[0] - x, k.mid[1] - z) < 20) || null;
export const edgeMid = (ring, i) => { const j = (i + 2) % ring.length; return [(ring[i] + ring[j]) / 2, (ring[i + 1] + ring[j + 1]) / 2]; };
function offSpan([[ax, az], [bx, bz]], x, z) {                                       // odległość punktu od odcinka span
  const dx = bx - ax, dz = bz - az, t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
  return Math.hypot(x - ax - dx * t, z - az - dz * t);
}

// front dla kamieniceMeshes od punktu a do b (kolejność obrysu), normalna na zewnątrz obrysu
export function realFront(ring, [x0, z0], [x1, z1], spec, hit) {
  const len = Math.hypot(x1 - x0, z1 - z0), sg = ringArea2(ring) > 0 ? 1 : -1, tx = (x1 - x0) / len, tz = (z1 - z0) / len;
  return { x0, z0, x1, z1, nx: sg * tz, nz: -sg * tx, len, spec, hit };
}

// fronty ze zdjęć w obrysie; null, gdy budynek żadnego nie ma
// list = [punkt a, punkt b, opis], skip = maska krawędzi bez zwykłej ściany, eave = najwyższy okap (do niego sięgają ściany i dach)
export function photoFronts(ring) {
  const list = [], skip = [], pt = i => [ring[i % ring.length], ring[(i + 1) % ring.length]];
  for (let i = 0; i < ring.length; i += 2) {
    const s = nearMid(ALL, ...edgeMid(ring, i));
    skip.push(!!s); if (s) list.push([pt(i), pt(i + 2), s]);
  }
  for (const s of SPANS) {
    let hits = 0;
    for (let i = 0; i < ring.length; i += 2) if (offSpan(s.span, ...pt(i)) < NEAR && offSpan(s.span, ...pt(i + 2)) < NEAR) { skip[i / 2] = true; hits++; }
    if (hits) list.push([...s.span, s]);
  }
  if (!list.length) return null;
  return { list, skip, eave: Math.max(...list.map(f => f[2].eave)), wall: list[0][2].wall };
}
