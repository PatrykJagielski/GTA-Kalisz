import { ringArea2 } from '../spatial.js';
import { ALEJA_WOLNOSCI } from './aleja-wolnosci.js';
import { BABINA } from './babina.js';
import { BANKOWA } from './bankowa.js';
import { BERKA } from './berka.js';
import { BISKUPIA } from './biskupia.js';
import { BOGUSLAWSKIEGO } from './boguslawskiego.js';
import { BROWARNA } from './browarna.js';
import { CHODYNSKIEGO } from './chodynskiego.js';
import { CHOPINA } from './chopina.js';
import { CIASNA } from './ciasna.js';
import { CZASZKOWSKA } from './czaszkowska.js';
import { CZESTOCHOWSKA } from './czestochowska.js';
import { DLUGOSZA } from './dlugosza.js';
import { FABRYCZNA } from './fabryczna.js';
import { FRANCISZKANSKA } from './franciszkanska.js';
import { GARBARSKA } from './garbarska.js';
import { GLINIANA } from './gliniana.js';
import { GORNOSLASKA } from './gornoslaska.js';
import { GRODZKA } from './grodzka.js';
import { HANDLOWA } from './handlowa.js';
import { JABLKOWSKIEGO } from './jablkowskiego.js';
import { JASNA } from './jasna.js';
import { JOZEFA_BIALA } from './jozefa-biala.js';
import { JOZEFA } from './jozefa.js';
import { JP2 } from './jp2.js';
import { KADECKA } from './kadecka.js';
import { KANONICKA } from './kanonicka.js';
import { KASZTELANSKA } from './kasztelanska.js';
import { KAZIMIERZOWSKA } from './kazimierzowska.js';
import { KILINSKIEGO } from './kilinskiego.js';
import { KOKANINSKA } from './kokaninska.js';
import { KOLEGIALNA } from './kolegialna.js';
import { KOPERNIKA } from './kopernika.js';
import { KOSCIUSZKI } from './kosciuszki.js';
import { KREDYTOWA } from './kredytowa.js';
import { KROTKA } from './krotka.js';
import { LACZNEJ } from './lacznej.js';
import { LAZIENNA } from './lazienna.js';
import { LOTNICZA } from './lotnicza.js';
import { MAJKOWSKA } from './majkowska.js';
import { MARIANSKA } from './marianska.js';
import { MAZURSKA } from './mazurska.js';
import { MOSTOWA } from './mostowa.js';
import { NARUTOWICZA } from './narutowicza.js';
import { NIECALA } from './niecala.js';
import { NOWY_SWIAT } from './nowy-swiat.js';
import { OGRODOWA } from './ogrodowa.js';
import { PARCZEWSKIEGO } from './parczewskiego.js';
import { PIEKARSKA } from './piekarska.js';
import { PISKORZEWIE } from './piskorzewie.js';
import { PISKORZEWSKA } from './piskorzewska.js';
import { PODGORZE } from './podgorze.js';
import { PODWALE } from './podwale.js';
import { POZNANSKA } from './poznanska.js';
import { PROSTA } from './prosta.js';
import { PRZECHODNIA } from './przechodnia.js';
import { PULASKIEGO } from './pulaskiego.js';
import { RZEMIESLNICZA } from './rzemieslnicza.js';
import { RZEZNICZA } from './rzeznicza.js';
import { SRODMIEJSKA } from './srodmiejska.js';
import { STANISLAWA } from './stanislawa.js';
import { STAWISZYNSKA } from './stawiszynska.js';
import { SUKIENNICZA } from './sukiennicza.js';
import { SZKLARSKA } from './szklarska.js';
import { SZKOLNA } from './szkolna.js';
import { TARGOWA } from './targowa.js';
import { TEATRALNA } from './teatralna.js';
import { TOWAROWA } from './towarowa.js';
import { TRZECIEGO_MAJA } from './trzeciego-maja.js';
import { WAL_BERNARDYNSKI } from './wal-bernardynski.js';
import { WAL_STAROMIEJSKI } from './wal-staromiejski.js';
import { WAL } from './wal.js';
import { WIEZIENNA } from './wiezienna.js';
import { WODNA } from './wodna.js';
import { WOJSKA_POLSKIEGO } from './wojska-polskiego.js';
import { WRONIA } from './wronia.js';
import { WSPOLNA } from './wspolna.js';
import { ZACISZE } from './zacisze.js';
import { ZAMKOWA_NW } from './zamkowa-nw.js';
import { ZAMKOWA_SE } from './zamkowa-se.js';
import { ZLOTA } from './zlota.js';

/* ---------- fronty kamienic odtworzonych ze zdjęć: krawędź obrysu OSM → opis z danymi (mid = środek krawędzi) ---------- */
// Opis ze span = [[x, z], [x, z]] (w kolejności obrysu) zastępuje całą elewację wzdłuż tego odcinka: wszystkie krawędzie
// obrysu leżące przy nim (ząbki pilastrów, płytkie ryzality) giną pod jednym frontem.
// Kolejność ma znaczenie: krawędź obrysu bierze pierwszy pasujący opis z listy.
const ALL = [
  ...ZAMKOWA_NW, ...ZAMKOWA_SE, ...JOZEFA, ...PIEKARSKA, ...LAZIENNA, ...SRODMIEJSKA, ...KANONICKA, ...MARIANSKA,
  ...RZEZNICZA, ...STANISLAWA, ...BISKUPIA, ...ZLOTA, ...GARBARSKA, ...KOLEGIALNA, ...BROWARNA, ...GRODZKA,
  ...JOZEFA_BIALA, ...FRANCISZKANSKA, ...PISKORZEWSKA, ...TARGOWA, ...SZKLARSKA, ...KAZIMIERZOWSKA, ...NARUTOWICZA,
  ...KADECKA, ...PARCZEWSKIEGO, ...PRZECHODNIA, ...ALEJA_WOLNOSCI, ...JP2, ...MOSTOWA, ...BABINA, ...WODNA, ...JASNA,
  ...KILINSKIEGO, ...NIECALA, ...WAL, ...WAL_STAROMIEJSKI, ...KREDYTOWA, ...BANKOWA, ...BOGUSLAWSKIEGO, ...CIASNA,
  ...PULASKIEGO, ...CHODYNSKIEGO, ...KROTKA, ...TRZECIEGO_MAJA, ...STAWISZYNSKA, ...MAJKOWSKA, ...PODWALE,
  ...WAL_BERNARDYNSKI, ...CZESTOCHOWSKA, ...TEATRALNA, ...BERKA, ...TOWAROWA, ...CHOPINA, ...FABRYCZNA, ...WSPOLNA,
  ...PISKORZEWIE, ...KOSCIUSZKI, ...SZKOLNA, ...KOPERNIKA, ...CZASZKOWSKA, ...WOJSKA_POLSKIEGO, ...JABLKOWSKIEGO,
  ...ZACISZE, ...SUKIENNICZA, ...MAZURSKA, ...PROSTA, ...NOWY_SWIAT, ...GORNOSLASKA, ...GLINIANA, ...LOTNICZA,
  ...KOKANINSKA, ...WRONIA, ...KASZTELANSKA, ...LACZNEJ, ...DLUGOSZA, ...PODGORZE, ...RZEMIESLNICZA, ...POZNANSKA,
  ...HANDLOWA, ...OGRODOWA, ...WIEZIENNA,
], SPANS = ALL.filter(s => s.span), NEAR = 8;
export const nearMid = (list, x, z) => list.find(k => !k.span && Math.hypot(k.mid[0] - x, k.mid[1] - z) < 20) || null;
export const edgeMid = (ring, i) => { const j = (i + 2) % ring.length; return [(ring[i] + ring[j]) / 2, (ring[i + 1] + ring[j + 1]) / 2]; };
function offSpan([[ax, az], [bx, bz]], x, z) {                                       // odległość punktu od odcinka span
  const dx = bx - ax, dz = bz - az, t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
  return Math.hypot(x - ax - dx * t, z - az - dz * t);
}

// opis z pieces = [[szerokość dm, opis], ...] dzieli jedną krawędź obrysu na kilka kamienic (ostatnia bierze resztę): fronty od a do b
function split([ax, az], [bx, bz], s) {
  const len = Math.hypot(bx - ax, bz - az), at = d => [ax + (bx - ax) * d / len, az + (bz - az) * d / len];
  let d0 = 0;
  return s.pieces.map(([w, spec], i, all) => { const d1 = i === all.length - 1 ? len : d0 + w, f = [at(d0), at(d1), spec]; d0 = d1; return f; });
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
    skip.push(!!s); if (s) list.push(...(s.pieces ? split(pt(i), pt(i + 2), s) : [[pt(i), pt(i + 2), s]]));
  }
  for (const s of SPANS) {
    let hits = 0;
    for (let i = 0; i < ring.length; i += 2) if (offSpan(s.span, ...pt(i)) < NEAR && offSpan(s.span, ...pt(i + 2)) < NEAR) { skip[i / 2] = true; hits++; }
    if (hits) list.push([...s.span, s]);
  }
  if (!list.length) return null;
  return { list, skip, eave: Math.max(...list.map(f => f[2].eave)), wall: list[0][2].wall };
}
