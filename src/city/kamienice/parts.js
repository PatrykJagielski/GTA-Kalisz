import * as THREE from 'three';
import { CURB } from '../config.js';
import { gridPut } from '../spatial.js';
import { archDims } from './paint.js';

/* ---------- części frontu w 3D: okna, drzwi, witryny, balkony, łuki, podcień, kolumny, medaliony ---------- */
// Układ lokalny frontu: x wzdłuż ściany od lewego końca (patrząc z Rynku), y w górę od jezdni, z na zewnątrz ściany.
// Bryły trafiają do list wspólnych materiałów (B.st tynk i sztukateria z kolorem wierzchołków, iron, rail, glass, glow).
const tmp = new THREE.Color(), WOOD = '#6a4128', IRON = '#2a2c2f';
export function frameOf(F, B) {
  const M = new THREE.Matrix4().compose(new THREE.Vector3(F.x0, 0, F.z0), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.atan2(F.nx, F.nz)),
    new THREE.Vector3(1, 1, 1));
  return { M, B, n: 0 };
}
export function put(c, geo, color = '#ffffff', list = 'st') {
  const g = (geo.index ? geo.toNonIndexed() : geo).applyMatrix4(c.M), k = tmp.set(color), n = g.attributes.position.count, a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) a.set([k.r, k.g, k.b], i * 3);
  g.setAttribute('color', new THREE.BufferAttribute(a, 3)); c.B[list].push(g);
}
export const box = (c, x0, x1, y0, y1, z0, z1, color, list) =>
  put(c, new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0).translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2), color, list);
// szyba: część okien świeci nocą, witryny (lit) zawsze
const pane = (c, x0, x1, y0, y1, z, lit) => box(c, x0, x1, y0, y1, z, z + 0.1, '#ffffff', lit || c.n++ * 7 % 10 < 4 ? 'glow' : 'glass');
// prostokąt lokalny x0..x1 × z0..z1 jako pierścień na mapie; solidRect = przeszkoda
const worldRing = (c, x0, x1, z0, z1) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]].flatMap(([x, z]) => { const v = new THREE.Vector3(x, 0, z).applyMatrix4(c.M); return [v.x, v.z]; });
export function solidRect(c, x0, x1, z0, z1, solid) {
  const ring = worldRing(c, x0, x1, z0, z1);
  const xs = ring.filter((_, i) => i % 2 === 0), zs = ring.filter((_, i) => i % 2), b = [Math.min(...xs), Math.min(...zs), Math.max(...xs), Math.max(...zs)];
  gridPut(solid, b[0], b[1], b[2], b[3], { p: [ring], b });
}

// okno w opasce: szyba, rama z kwaterami i ślemieniem, parapet (drzwi balkonowe bez parapetu), naczółek
export function window3d(c, x, w, y0, y1, S, o) {
  const a = x - w / 2, b = x + w / 2, j = 1.4, tr = S.trim, fr = S.frame, t = y1 - Math.min(7.5, (y1 - y0) * 0.3);
  pane(c, a, b, y0, y1, 0.1);
  box(c, a - j, a, y0 - 0.4, y1 + j, 0, 0.9, tr); box(c, b, b + j, y0 - 0.4, y1 + j, 0, 0.9, tr); box(c, a - j, b + j, y1, y1 + j, 0, 0.9, tr);
  if (o.door) box(c, a - j, b + j, y0 - 0.8, y0, 0, 0.9, tr);
  else box(c, a - 1.8, b + 1.8, y0 - 1.7, y0 - 0.4, 0, 2.3, tr);
  for (const [p, q] of [[a, a + 0.6], [b - 0.6, b]]) box(c, p, q, y0, y1, 0.1, 0.7, fr);
  box(c, a, b, y0, y0 + 0.6, 0.1, 0.7, fr); box(c, a, b, y1 - 0.6, y1, 0.1, 0.7, fr); box(c, a, b, t - 0.3, t + 0.3, 0.1, 0.7, fr);
  const k = w >= 14 ? 3 : 2;
  for (let i = 1; i < k; i++) { const m = a + w * i / k; box(c, m - 0.3, m + 0.3, y0, y1, 0.1, 0.7, fr); }
  if (o.hood === 'hood') { box(c, a - 2.6, b + 2.6, y1 + j, y1 + j + 1.6, 0, 2.2, tr); box(c, a - 1.6, b + 1.6, y1 + j + 1.6, y1 + j + 2.2, 0, 1.2, tr); }
  if (o.hood === 'ear') for (const s of [a - j - 1, b + j]) box(c, s, s + 1, y1 - 3, y1 + j, 0, 0.9, tr);
}

// płaszczyzna kutej kraty (tekstura z przezroczystością), u przeskalowane do szerokości
function railPlane(c, w, h, fn) {
  const g = new THREE.PlaneGeometry(w, h), uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * w / 10);
  put(c, fn(g), '#ffffff', 'rail');
}
// balkon: płyta na wspornikach, krata z pochwytem; plants = skrzynki z kwiatami za kratą
export function balcony3d(c, x0, x1, y, D, S, plants) {
  const H = 9.5, rt = y + H;
  box(c, x0, x1, y - 2.6, y, 0, D, S.trim);
  for (const x of x1 - x0 > 20 ? [x0 + 2, (x0 + x1) / 2, x1 - 2] : [x0 + 2, x1 - 2]) box(c, x - 0.8, x + 0.8, y - 7, y - 2.6, 0, D * 0.6, S.trim);
  railPlane(c, x1 - x0 - 0.6, H, g => g.translate((x0 + x1) / 2, y + H / 2, D - 0.4));
  for (const x of [x0 + 0.3, x1 - 0.3]) railPlane(c, D - 0.4, H, g => g.rotateY(Math.PI / 2).translate(x, y + H / 2, (D - 0.4) / 2));
  box(c, x0, x1, rt, rt + 0.7, D - 0.9, D, IRON, 'iron');
  for (const x of [x0, x1 - 0.9]) box(c, x, x + 0.9, rt, rt + 0.7, 0, D, IRON, 'iron');
  if (!plants) return;
  box(c, x0 + 1, x1 - 1, y, y + 2.4, D - 3, D - 0.9, '#5d4632');
  for (let x = x0 + 1.2, i = 0; x < x1 - 2.4; x += 2.3, i++) box(c, x, x + 2, y + 2.4, y + 4 + (i % 3) * 0.6, D - 2.8, D - 1.1, i % 3 ? '#4f7d3a' : '#d45b8e');
}
// skrzynka z kwiatami za niską kratą na parapecie
export function flowers(c, x, w, y) {
  box(c, x - w / 2 - 0.4, x + w / 2 + 0.4, y, y + 2.2, 0.4, 2.6, '#5d4632');
  for (let s = x - w / 2, i = 0; s < x + w / 2 - 1; s += 1.9, i++) box(c, s, s + 1.7, y + 2.2, y + 3.4 + (i % 2) * 0.5, 0.8, 2.3, i % 3 ? '#4f7d3a' : '#d45b8e');
  railPlane(c, w + 1.2, 4.2, g => g.translate(x, y + 1.9, 2.9));
}

// drzwi z drewna: skrzydło, przeszklenie w dwóch kwaterach, naświetle, opaska
export function door3d(c, x0, x1, y0, y1, S) {
  const m = (x0 + x1) / 2;
  box(c, x0 - 1.2, x0, y0, y1 + 1.2, 0, 0.8, S.trim); box(c, x1, x1 + 1.2, y0, y1 + 1.2, 0, 0.8, S.trim); box(c, x0 - 1.2, x1 + 1.2, y1, y1 + 1.2, 0, 0.8, S.trim);
  box(c, x0, x1, y0, y1, 0.05, 0.35, WOOD);
  pane(c, x0 + 1, m - 0.5, y0 + 12, y1 - 7, 0.35); pane(c, m + 0.5, x1 - 1, y0 + 12, y1 - 7, 0.35); pane(c, x0 + 1, x1 - 1, y1 - 5.5, y1 - 1, 0.35);
  box(c, m - 0.25, m + 0.25, y0, y1 - 6, 0.35, 0.6, '#4f311e'); box(c, x0, x1, y1 - 6.5, y1 - 5.5, 0.35, 0.6, '#4f311e');
}
// witryna: cokolik, szyba (świeci nocą), słupki co ok. 1 m, drzwi w witrynie; nad szybą pas na szyld
export function shop3d(c, x0, x1, y0, y1, S, o, door) {
  const top = o.sign ? y1 - 7 : y1, fr = o.frame || '#3b3f44', n = Math.max(1, Math.round((x1 - x0) / 10));
  box(c, x0 - 1.2, x0, y0 - 1, y1 + 1.2, 0, 1, S.trim); box(c, x1, x1 + 1.2, y0 - 1, y1 + 1.2, 0, 1, S.trim); box(c, x0 - 1.2, x1 + 1.2, y1, y1 + 1.2, 0, 1, S.trim);
  box(c, x0, x1, y0 - 1, y0 + 2.5, 0, 0.6, '#6d6a64');
  pane(c, x0, x1, y0 + 2.5, top, 0.1, true);
  for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; box(c, x - 0.4, x + 0.4, y0 + 2.5, top, 0.1, 0.6, fr); }
  box(c, x0, x1, top - 0.5, top, 0.1, 0.6, fr);
  if (door) { box(c, door[0], door[1], y0 - 1, y0 + 2.5, 0.2, 0.6, '#9a9690'); for (const x of door) box(c, x - 0.5, x + 0.5, y0, top, 0.1, 0.8, fr); box(c, door[0], door[1], y0 + 26, y0 + 27, 0.1, 0.8, fr); }
}

// wnęka łukowa: ościeża, sklepienie (wycinek walca), w głębi szyba z ramą, a przy door drzwi z przeszkleniem na środku
export function archRecess(c, x0, x1, y0, top, rise, D, S, o) {
  const { xc, sp, R, cy, a0 } = archDims(x0, x1, top, rise), rev = S.base || S.wall, fr = o.frame || WOOD;
  put(c, new THREE.CylinderGeometry(R, R, D, 20, 1, true, a0 + Math.PI / 2, Math.PI - 2 * a0).rotateX(Math.PI / 2).translate(xc, cy, -D / 2), rev);
  if (o.k === 'arcade') return;
  box(c, x0 - 0.3, x0, y0, sp, -D, 0, rev); box(c, x1, x1 + 0.3, y0, sp, -D, 0, rev); box(c, x0, x1, y0 - 0.6, y0, -D, 0.6, S.trim);
  const shape = new THREE.Shape(); shape.moveTo(x0, y0); shape.lineTo(x1, y0); shape.lineTo(x1, sp); shape.absarc(xc, cy, R, a0, Math.PI - a0, false); shape.lineTo(x0, y0);
  put(c, new THREE.ShapeGeometry(shape, 16).translate(0, 0, -D), '#ffffff', 'glow');
  put(c, new THREE.TorusGeometry(R - 0.4, 0.45, 5, 18, Math.PI - 2 * a0).rotateZ(a0).translate(xc, cy, -D + 0.3), fr);
  for (const x of [x0 + 0.4, x1 - 0.4]) box(c, x - 0.4, x + 0.4, y0, sp, -D, -D + 0.7, fr);
  const tt = Math.min(sp, y0 + 25), dw = o.door ? Math.min(11, (x1 - x0) * 0.5) : 0;
  box(c, x0, x1, tt - 0.4, tt + 0.4, -D, -D + 0.7, fr);
  for (const x of dw ? [xc - dw / 2, xc + dw / 2] : [xc]) box(c, x - 0.4, x + 0.4, y0, tt, -D, -D + 0.7, fr);
  if (dw) { box(c, xc - dw / 2, xc + dw / 2, y0, y0 + 9, -D, -D + 0.5, fr); box(c, xc - 0.3, xc + 0.3, y0, tt, -D, -D + 0.8, fr); }
}
// podcień: filary między łukami, przejście w głębi (ściana z drzwiami albo witryną, strop, boki, posadzka);
// przejście jest dziurą w bryle kolizji kamienicy (hit), filary osobnymi przeszkodami, więc da się wejść pod łuki
export function arcade(c, arcs, S, solid, hit, D = 22, P = 6) {
  const a = arcs[0][0] - 2.5, b = arcs[arcs.length - 1][1] + 2.5, inner = '#9c8a6c', top = arcs[0][2] + 1;
  const piers = [[a, arcs[0][0]], ...arcs.slice(1).map((q, i) => [arcs[i][1], q[0]]), [arcs[arcs.length - 1][1], b]];
  for (const [p, q] of piers) { box(c, p, q, 0, top, -P, -0.2, S.base); solidRect(c, p, q, -P, 1, solid); }
  hit.p.push(worldRing(c, a, b, -D, 1));
  box(c, a, b, 0, top + 1, -D - 1, -D, inner); box(c, a, b, top, top + 1, -D, -P, inner);
  box(c, a - 1, a, 0, top + 1, -D, -P, inner); box(c, b, b + 1, 0, top + 1, -D, -P, inner); box(c, a, b, 0, CURB, -D, 0, '#b3ada2');
  for (const [x0, x1, , k] of arcs) {
    const m = (x0 + x1) / 2;
    if (k === 'door') { box(c, m - 5, m + 5, CURB, 25, -D, -D + 0.5, '#5e3b24'); pane(c, m - 4, m + 4, 27, 33, -D + 0.1, true); }
    else { pane(c, m - 7, m + 7, 9, 30, -D + 0.1, true); box(c, m - 7.5, m + 7.5, 30, 31, -D, -D + 0.6, WOOD); box(c, m - 7.5, m + 7.5, 8, 9, -D, -D + 0.6, WOOD); }
  }
}

// kolumna jońska: plinta, trzon, głowica z wolutami
export function column(c, x, y0, y1, z, r, color) {
  box(c, x - r - 0.8, x + r + 0.8, y0, y0 + 1.6, z - r - 0.8, z + r + 0.8, color);
  put(c, new THREE.CylinderGeometry(r * 0.88, r, y1 - y0 - 3.6, 14).translate(x, (y0 + y1 - 0.4) / 2, z), color);
  box(c, x - r - 1, x + r + 1, y1 - 2, y1, z - r - 0.7, z + r + 0.7, color);
  for (const s of [-1, 1]) put(c, new THREE.CylinderGeometry(0.8, 0.8, 2 * r + 1.2, 8).rotateX(Math.PI / 2).translate(x + s * (r + 0.5), y1 - 2.3, z), color);
}
// medalion z popiersiem w płaskorzeźbie i tabliczką z nazwiskiem
export function medallion(c, x, y, r, color) {
  put(c, new THREE.CylinderGeometry(r, r, 0.9, 22).rotateX(Math.PI / 2).translate(x, y, 0.45), color);
  put(c, new THREE.SphereGeometry(1, 10, 8).scale(r * 0.38, r * 0.5, 0.8).translate(x, y + 0.5, 1.1), color);
  put(c, new THREE.SphereGeometry(1, 10, 6).scale(r * 0.62, r * 0.28, 0.6).translate(x, y - r * 0.58, 0.95), color);
  box(c, x - r * 0.9, x + r * 0.9, y + r + 0.7, y + r + 1.6, 0, 0.3, '#6f6a64');
}
