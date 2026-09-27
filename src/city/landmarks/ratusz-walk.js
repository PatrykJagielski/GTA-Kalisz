import { CURB } from '../config.js';

/* ---------- wnętrze ratusza dla pieszego: posadzki i ściany w klatce schodowej wieży, w izbie i na galerii ---------- */
// układ wieży: lx, lz od osi wieży w układzie frontu (x wzdłuż ryzalitu, +z w stronę rynku); wysokości w dm od ziemi.
// W trzonie schody biegną wokół rdzenia (po jednym biegu na bok, w narożnikach podesty) aż do podestu pod izbą,
// dalej prosty bieg przez właz do ośmiobocznej izby, z izby drzwi na galerię z balustradą.
export const TW = {
  wall: 37.5, outer: 39,         // lico wewnętrzne i zewnętrzne ścian klatki (zewnętrzne tuż pod licem trzonu)
  core: 16,                      // pół boku rdzenia
  flights: 13, steps: 12,        // biegi spiralne i stopnie w biegu
  landing: 320,                  // podest pod izbą
  flight: [-26, 18, 7],          // prosty bieg z podestu do izby: x od, x do, pół szerokości
  deck: 351,                     // posadzka izby i galerii
  hatch: [-11, 18, 7],           // właz w posadzce izby nad prostym biegiem
  gallery: 46.5,                 // krawędź galerii z balustradą
  oct: [28, 31.5], door: 5.5,    // ściana izby (od osi) i pół szerokości drzwi na galerię (w ścianach od strony osi)
  towerDoor: [20, 34],           // drzwi z sieni do klatki (lx), w ścianie od strony rynku
  hall: [-30, 38, -102.5, -46],  // sień w układzie frontu: x od, x do, z od, z do
};
export const RISE = (TW.landing - CURB) / TW.flights;
const CLIMB = 6;                 // w środku krok w górę do 60 cm: przy słabym FPS jeden krok obejmuje kilka stopni
const HEAD = 18;                 // pod niższym biegiem się nie przejdzie

// faza biegu spiralnego nad punktem: narożniki 0 (+x+z), 1 (−x+z), 2 (−x−z), 3 (+x−z), między nimi biegi; null = rdzeń
function spiralPhase(lx, lz) {
  const c = TW.core, t = v => (v + c) / (2 * c);
  if (Math.abs(lx) >= c && Math.abs(lz) >= c) return lx > 0 ? (lz > 0 ? 0 : 3) : (lz > 0 ? 1 : 2);
  if (Math.abs(lx) < c && Math.abs(lz) < c) return null;
  if (lz >= c) return 1 - t(lx);
  if (lx <= -c) return 2 - t(lz);
  if (lz <= -c) return 2 + t(lx);
  return 3 + t(lz);
}
const inRect = (lx, lz, [x0, x1, h]) => lx > x0 && lx < x1 && Math.abs(lz) < h;
const flightH = lx => TW.landing + (lx - TW.flight[0]) / (TW.flight[1] - TW.flight[0]) * (TW.deck - TW.landing);
// wszystkie posadzki nad punktem wieży (bez ziemi poza klatką)
function floors(lx, lz, m) {
  const out = [];
  if (m < TW.wall) {
    const p = spiralPhase(lx, lz);
    if (p !== null) for (let q = p; q <= TW.flights + 1e-6; q += 4) out.push(CURB + q * RISE);
    if (!(Math.abs(lx) < TW.core && lz >= TW.core)) out.push(TW.landing);       // podest ma otwór nad ostatnim biegiem
    if (inRect(lx, lz, TW.flight)) out.push(flightH(lx));
  }
  if (m < TW.gallery && !inRect(lx, lz, TW.hatch)) out.push(TW.deck);
  return out;
}
// balustrady: przy otworze w podeście i wokół włazu w izbie (od strony wejścia na schody otwarte)
const near = (v, a) => Math.abs(v - a) < 0.8;
function railAt(lx, lz, y) {
  const c = TW.core, [hx0, hx1, hh] = TW.hatch;
  const [fx0, fx1, fh] = TW.flight;
  if (y > TW.landing + 2 && near(Math.abs(lz), fh - 0.4) && lx > fx0 && lx < fx1) return true;              // pochwyty prostego biegu
  if (y >= TW.landing - 1 && y < TW.deck - 2) return (near(lz, c) && Math.abs(lx) < c) || (near(lx, c) && lz > c);
  if (y >= TW.deck - 1.5) return ((near(Math.abs(lz), hh) && lx > hx0 && lx < hx1) || (near(lx, hx0) && Math.abs(lz) < hh));
  return false;
}

// toLocal(x, z) -> [x, z] w układzie frontu; (tx, tz) = oś wieży w tym układzie
export function towerWalk(toLocal, tx, tz) {
  const [hx0, hx1, hz0, hz1] = TW.hall;
  const tl = (x, z) => { const [fx, fz] = toLocal(x, z); return [fx - tx, fz - tz]; };
  return {
    // wysokość posadzki pod stopami na wysokości y (najwyższa, na którą da się wejść) albo null poza wieżą;
    // Infinity = żadnej osiągalnej (ściana schodów nad głową)
    floorAt(x, z, y = 0) {
      const [lx, lz] = tl(x, z), m = Math.max(Math.abs(lx), Math.abs(lz));
      if (m >= TW.gallery || (m >= TW.wall && y < TW.deck - 3)) return null;
      let best = -Infinity;
      for (const h of floors(lx, lz, m)) if (h <= y + CLIMB && h > best) best = h;
      return best > -Infinity ? best : Infinity;
    },
    // czy punkt na wysokości stóp y jest zajęty (rdzeń, balustrady, ściana izby, niski bieg nad głową); null = poza wieżą
    blockedAt(x, z, y) {
      const [lx, lz] = tl(x, z), ax = Math.abs(lx), az = Math.abs(lz), m = Math.max(ax, az);
      if (y >= TW.deck - 1.5 && m < TW.gallery + 1) {
        if (m > TW.gallery - 0.5 || railAt(lx, lz, y)) return true;
        const d = (ax + az) / Math.SQRT2, o = Math.max(m, d);
        if (o <= TW.oct[0] || o >= TW.oct[1]) return false;
        return d > m || Math.min(ax, az) > TW.door - 1;                           // drzwi tylko w ścianach od strony osi
      }
      if (m >= TW.wall) return null;
      if (y < TW.landing - 2 && ax < TW.core && az < TW.core) return true;       // rdzeń
      if (inRect(lx, lz, TW.flight)) { const h = flightH(lx); if (h > y + CLIMB && h < y + HEAD) return true; }
      return railAt(lx, lz, y);
    },
    // w sieni i w klatce kamera przechodzi na widok z oczu postaci (za plecami byłyby ściany)
    indoor(x, z, y) {
      const [fx, fz] = toLocal(x, z);
      if (fx > hx0 && fx < hx1 && fz > hz0 - 3 && fz < hz1) return true;
      return Math.max(Math.abs(fx - tx), Math.abs(fz - tz)) < TW.outer && y < TW.deck - 2;
    },
  };
}
