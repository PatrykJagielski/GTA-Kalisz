import * as THREE from 'three';
import { canvasTex } from '../../core/textures.js';
import { archWall } from './arch-wall.js';
import { TW } from './ratusz-walk.js';
import { archTex, clockTex } from './tower-textures.js';

/* ---------- wieża ratusza: biały trzon z zegarami, galeria, ciemna ośmioboczna izba, hełm, latarnia i iglica ---------- */
// trzon jest pusty (w środku klatka schodowa z ratusz-inside.js), więc skrzynki trzonu i gzymsów nie mają denek;
// posadzka galerii i izby ma właz nad schodami, izba ma prawdziwe drzwi na galerię i okna
function railTex() {
  return canvasTex(128, (g, n) => {
    g.clearRect(0, 0, n, n); g.fillStyle = '#1d2226';
    g.fillRect(0, 0, n, 12); g.fillRect(0, n - 10, n, 10);
    for (let x = 4; x < n; x += 16) g.fillRect(x, 0, 5, n);
  });
}
function plankTex() {
  const t = canvasTex(128, (g, n) => {
    g.fillStyle = '#7a6a58'; g.fillRect(0, 0, n, n);
    for (let i = 0; i < 8; i++) { g.fillStyle = `rgba(0,0,0,${0.05 + (i * 37 % 7) / 60})`; g.fillRect(0, i * 16, n, 15); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, i * 16 + 15, n, 1); }
  });
  t.repeat.set(1 / 16, 1 / 16);
  return t;
}
const V2 = (x, y) => new THREE.Vector2(x, y);

// W = grupa w osi wieży (y = 0 na ziemi); s = bok trzonu; from = dół widocznej części trzonu (nad dachem korpusu)
export function buildTower(W, s, from, { plaster, shaftM, roofM, darkM, goldM }) {
  const add = (geo, mat, parent = W) => { const m = new THREE.Mesh(geo, mat); parent.add(m); return m; };
  const none = new THREE.MeshBasicMaterial({ visible: false }), open = m => [m, m, none, none, m, m];   // skrzynka bez denek
  const top = TW.deck - 3;
  add(new THREE.BoxGeometry(s, top - from, s).translate(0, (top + from) / 2, 0), open(shaftM));
  add(new THREE.BoxGeometry(s + 3, 3, s + 3).translate(0, top - 78, 0), open(plaster));
  add(new THREE.BoxGeometry(s + 8, 7, s + 8).translate(0, top - 3.5, 0), open(plaster));                              // gzyms pod galerią
  const cm = new THREE.MeshStandardMaterial({ map: clockTex(), roughness: 0.4, metalness: 0.3 });
  for (let k = 0; k < 4; k++) {
    const c = add(new THREE.CircleGeometry(17, 40), cm);
    const a = k * Math.PI / 2; c.position.set(Math.sin(a) * (s / 2 + 0.3), top - 40, Math.cos(a) * (s / 2 + 0.3)); c.rotation.y = a;
  }
  // posadzka galerii i izby z włazem nad prostym biegiem schodów
  const g = TW.gallery, [hx0, hx1, hh] = TW.hatch;
  const deck = new THREE.Shape([V2(-g, -g), V2(g, -g), V2(g, g), V2(-g, g)]);
  deck.holes.push(new THREE.Path([V2(hx0, -hh), V2(hx0, hh), V2(hx1, hh), V2(hx1, -hh)]));
  const floorM = new THREE.MeshStandardMaterial({ map: plankTex(), roughness: 0.85 });
  add(new THREE.ExtrudeGeometry(deck, { depth: 3, bevelEnabled: false }).rotateX(-Math.PI / 2).translate(0, top, 0), [floorM, roofM]);
  const railM = new THREE.MeshStandardMaterial({ map: railTex(), transparent: true, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.5, metalness: 0.5 });
  railM.map.repeat.set(6, 1);
  for (let k = 0; k < 4; k++) {
    const r = add(new THREE.PlaneGeometry(2 * g, 10).translate(0, TW.deck + 5, g), railM); r.rotation.y = k * Math.PI / 2;
  }
  // izba: 8 ścian, w ścianach od strony osi drzwi na galerię, w ukośnych okna; wokół włazu balustrada
  const R = s * 0.42, apo = R * Math.cos(Math.PI / 8), len = 2 * R * Math.sin(Math.PI / 8) + 1.2, H = 72;
  const belM = new THREE.MeshStandardMaterial({ color: 0x2b3133, roughness: 0.55, metalness: 0.3 });
  const inM = new THREE.MeshStandardMaterial({ color: 0x4a4f52, roughness: 0.8 });
  for (let k = 0; k < 8; k++) {
    const a = k % 2 ? [[len / 2, 11, 50, 12]] : [[len / 2, 2 * TW.door, 44]];
    add(archWall(len, a, H, apo - TW.oct[0]).translate(-len / 2, TW.deck, apo).rotateY(k * Math.PI / 4), [belM, belM, inM]);
  }
  const ironM = new THREE.MeshStandardMaterial({ color: 0x1d2226, roughness: 0.5, metalness: 0.5 });
  const bar = (x0, z0, x1, z1) => {
    const l = Math.hypot(x1 - x0, z1 - z0);
    add(new THREE.BoxGeometry(l, 0.8, 0.8).rotateY(-Math.atan2(z1 - z0, x1 - x0)).translate((x0 + x1) / 2, TW.deck + 10, (z0 + z1) / 2), ironM);
    for (let t = 0; t <= l + 0.1; t += l / Math.round(l / 5)) add(new THREE.BoxGeometry(0.5, 10, 0.5).translate(x0 + (x1 - x0) * t / l, TW.deck + 5, z0 + (z1 - z0) * t / l), ironM);
  };
  bar(hx0, -hh, hx1, -hh); bar(hx0, hh, hx1, hh); bar(hx0, -hh, hx0, hh);

  // gzyms (jego denko jest sufitem izby), hełm, latarnia, iglica z wiatrowskazem
  const Cr = new THREE.Group(); Cr.position.y = top - 330; W.add(Cr);
  const oct = (r0, r1, y0, y1, mat) => add(new THREE.CylinderGeometry(r1, r0, y1 - y0, 8).rotateY(Math.PI / 8).translate(0, (y0 + y1) / 2, 0), mat, Cr);
  oct(s * 0.47, s * 0.47, 403, 409, darkM);
  const bell = [[s * 0.47, 409], [s * 0.45, 414], [s * 0.36, 424], [s * 0.22, 434], [s * 0.14, 441], [s * 0.13, 447]].map(([r, y]) => V2(r, y));
  add(new THREE.LatheGeometry(bell, 8).rotateY(Math.PI / 8), darkM, Cr);                                              // hełm
  const lanT = archTex('#2b3133', '#0e1113', '#394144'); lanT.repeat.set(8, 1);
  oct(s * 0.13, s * 0.13, 447, 474, new THREE.MeshStandardMaterial({ map: lanT, roughness: 0.55, metalness: 0.3 }));  // latarnia
  oct(s * 0.17, s * 0.17, 474, 478, darkM);
  add(new THREE.SphereGeometry(s * 0.1, 12, 8).scale(1, 1.3, 1).translate(0, 485, 0), darkM, Cr);                     // cebulka
  add(new THREE.ConeGeometry(2.4, 62, 8).translate(0, 522, 0), darkM, Cr);                                            // iglica
  add(new THREE.SphereGeometry(2.8, 12, 8).translate(0, 540, 0), goldM, Cr);
  add(new THREE.BoxGeometry(14, 5, 0.5).translate(4, 560, 0), goldM, Cr);                                             // wiatrowskaz
  add(new THREE.CylinderGeometry(0.4, 0.4, 16, 6).translate(0, 558, 0), goldM, Cr);
}
