import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { M4, instanced, rbox, rodBetween } from '../../core/geometry.js';
import { rng } from '../../core/random.js';
import { canvasTex, speckle } from '../../core/textures.js';
import { CURB } from '../config.js';
import { flatGeo } from '../mesh.js';
import { gridPut, polyHas, ringBox } from '../spatial.js';

/* ---------- Plac św. Józefa: granitowy plac, parkingi, żywopłot i pomnik Jana Pawła II (J. Kucz, 1999) ---------- */
// współrzędne w dm z OSM: cokół pomnika (way 1332068015), drzewa, osie jezdni placu
const JOZ = {
  mon: { c: [1960, -958], front: [0.659, 0.756], len: 68, wid: 41 },            // figura zwrócona w stronę bazyliki
  west: [[1487, -561], [1683, -719], [1782, -835], [1873, -965]],                // jezdnia zachodnia (przy kamienicach)
  hedge: [[1805, -455], [1819, -484], [1841, -527], [1862, -571], [1880, -614], [1897, -658], [1914, -704], [1927, -749], [1936, -778]],
  planters: [[1887, -906], [1906, -935], [1924, -967], [1942, -998], [1959, -1029]],
};
const INSCR = ['PRAWO DO ŻYCIA', 'NIE JEST TYLKO KWESTIĄ ŚWIATOPOGLĄDU', 'NIE JEST TYLKO PRAWEM RELIGIJNYM', 'ALE JEST PRAWEM CZŁOWIEKA', '', 'JAN PAWEŁ II · KALISZ 4 VI 1997'];
function inscriptionTex() {
  return canvasTex(512, (g, n) => {
    const gr = g.createLinearGradient(0, 0, n, n); gr.addColorStop(0, '#26282a'); gr.addColorStop(1, '#141516');
    g.fillStyle = gr; g.fillRect(0, 0, n, n);
    const R = rng(1999); for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(255,255,255,${R() * 0.06})`; g.fillRect(R() * n, R() * n, 1.5, 1.5); }
    g.fillStyle = '#cdb27a'; g.textAlign = 'center'; g.textBaseline = 'middle';
    INSCR.forEach((t, i) => { g.font = `${i === 0 ? 700 : 500} ${i === 0 ? 34 : 26}px Georgia, serif`; g.fillText(t, n / 2, 150 + i * 42); });
  }, false);
}
// sylwetka z wyciągniętej bryły obrotowej: fałdy szat i pochylenie w przód (y -> przesunięcie z)
function drapedFigure(profile, seg, folds, foldAmp, bend, flat, trail = 0) {
  const g = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), seg), p = g.attributes.position, top = profile[profile.length - 1][1];
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const a = Math.atan2(z, x), k = 1 + foldAmp * (1 - y / top) * Math.sin(a * folds + y * 0.35) + 0.03 * Math.sin(a * 23);
    x *= k; z *= k * flat;
    const t = y / top;
    if (z < 0) z *= 1 + trail * (1 - t) * (1 - t);                                 // tren płaszcza rozłożony z tyłu
    z += bend * t * t; y -= bend * 0.33 * t * t * t;                              // pochylenie nad dzieckiem
    p.setXYZ(i, x, y, z);
  }
  g.computeVertexNormals();
  return g;
}
function parkedCars(group, solid, list) {
  const CARC = [0xb9bfc6, 0x1d2126, 0x8a1c1c, 0x2d4f7c, 0xe8e8e4, 0x51595f, 0x6b5a3c, 0x9aa3a8].map(c => new THREE.Color(c)), R = rng(588);
  const std = o => new THREE.MeshStandardMaterial({ roughness: 0.4, ...o });
  const mats = list.map(([x, z, r]) => M4(x, CURB, z, r));
  group.add(instanced(rbox(44, 9, 17, 3).translate(0, 7.5, 0), std({ color: 0xffffff, metalness: 0.5, roughness: 0.35 }), mats, list.map(() => CARC[Math.floor(R() * CARC.length)])));
  group.add(instanced(rbox(23, 7, 15, 3).translate(-3, 15, 0), std({ color: 0x1b2430, metalness: 0.5, roughness: 0.15 }), mats));
  const wl = [];
  for (const [x, z, r] of list) for (const [lx, lz] of [[14, 7.6], [14, -7.6], [-14, 7.6], [-14, -7.6]])
    wl.push(M4(x + lx * Math.cos(r) + lz * Math.sin(r), CURB + 3.1, z - lx * Math.sin(r) + lz * Math.cos(r), r));
  group.add(instanced(new THREE.CylinderGeometry(3.1, 3.1, 2.2, 14).rotateX(Math.PI / 2), std({ color: 0x151618, roughness: 0.9 }), wl));
  for (const [x, z, r] of list) {                                                 // obrys auta jako przeszkoda
    const c = Math.cos(r), s = Math.sin(r), pts = [[22, 8.5], [22, -8.5], [-22, -8.5], [-22, 8.5]].map(([lx, lz]) => [x + lx * c + lz * s, z - lx * s + lz * c]);
    const ring = pts.flat(), bb = ringBox(ring); gridPut(solid, bb[0], bb[1], bb[2], bb[3], { p: [ring], b: bb });
  }
}
// punkty wzdłuż łamanej co krok, z kierunkiem
function alongPolyline(pts, step, from = 0, to = Infinity) {
  const out = []; let acc = 0, next = from;
  for (let i = 0; i + 1 < pts.length; i++) {
    const [x0, z0] = pts[i], [x1, z1] = pts[i + 1], L = Math.hypot(x1 - x0, z1 - z0);
    while (next <= acc + L && next <= to) { const t = (next - acc) / L; out.push([x0 + (x1 - x0) * t, z0 + (z1 - z0) * t, (x1 - x0) / L, (z1 - z0) / L]); next += step; }
    acc += L;
  }
  return out;
}

export function buildJozef(D, group, solid, posts) {
  const block = D.blocks.find(p => polyHas(p, JOZ.mon.c[0], JOZ.mon.c[1]));
  if (!block) return [];
  const std = o => new THREE.MeshStandardMaterial({ roughness: 0.85, ...o });
  // granitowa posadzka całego placu
  const pav = std({ map: speckle('#b8b5ae', 0.14, 4, 31), polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -24 });
  group.add(new THREE.Mesh(flatGeo([block], CURB, 1 / 20), pav));
  const inPlaza = (x, z) => polyHas(block, x, z);

  // żywopłot z drzewami przy wschodniej jezdni
  const hedgeM = std({ color: 0x3f6a2e, roughness: 1 }), hg = [];
  for (let i = 0; i + 1 < JOZ.hedge.length; i++) {
    const [x0, z0] = JOZ.hedge[i], [x1, z1] = JOZ.hedge[i + 1], L = Math.hypot(x1 - x0, z1 - z0), a = Math.atan2(-(z1 - z0), x1 - x0);
    hg.push(new THREE.BoxGeometry(L + 4, 12, 20).rotateY(a).translate((x0 + x1) / 2, CURB + 6, (z0 + z1) / 2));
    const c = Math.cos(a), s = Math.sin(a), pts = [[L / 2 + 2, 10], [L / 2 + 2, -10], [-L / 2 - 2, -10], [-L / 2 - 2, 10]].map(([lx, lz]) => [(x0 + x1) / 2 + lx * c + lz * s, (z0 + z1) / 2 - lx * s + lz * c]);
    const ring = pts.flat(), bb = ringBox(ring); gridPut(solid, bb[0], bb[1], bb[2], bb[3], { p: [ring], b: bb });
  }
  group.add(new THREE.Mesh(mergeGeometries(hg), hedgeM));
  // betonowe donice pod drzewkami przy pomniku
  const potM = std({ color: 0xa9a59c }), soilM = std({ color: 0x4a3a2c, roughness: 1 });
  for (const [x, z] of JOZ.planters) {
    group.add(new THREE.Mesh(new THREE.BoxGeometry(15, 6, 15).translate(x, CURB + 3, z), potM));
    group.add(new THREE.Mesh(new THREE.BoxGeometry(12.6, 0.4, 12.6).translate(x, CURB + 6, z), soilM));
    gridPut(posts, x, z, x, z, [x, z, 7.5]);
  }

  // parking ukośny od strony placu przy zachodniej jezdni i drugi rząd za żywopłotem
  const cars = [], lines = [];
  const side = (px, pz, dx, dz) => Math.sign((JOZ.mon.c[0] - px) * -dz + (JOZ.mon.c[1] - pz) * dx) || 1;   // strona placu
  const ok = (x, z, r) => [[20, 7], [20, -7], [-20, -7], [-20, 7]].every(([lx, lz]) => inPlaza(x + lx * Math.cos(r) + lz * Math.sin(r), z - lx * Math.sin(r) + lz * Math.cos(r)))
    && JOZ.planters.every(([tx, tz]) => Math.hypot(tx - x, tz - z) > 26);
  const R = rng(4061997);
  for (const [px, pz, dx, dz] of alongPolyline(JOZ.west, 27, 120, 520)) {           // ok. 60° do osi jezdni, przodem w plac
    const sgn = side(px, pz, dx, dz), nx = -dz * sgn, nz = dx * sgn, ang = 1.05;
    const hx = dx * Math.cos(ang) + nx * Math.sin(ang), hz = dz * Math.cos(ang) + nz * Math.sin(ang);
    const x = px + nx * 46, z = pz + nz * 46, r = Math.atan2(-hz, hx);
    if (ok(x, z, r)) { if (R() < 0.82) cars.push([x, z, r]); lines.push([x - hx * 2 + dx * 13.5, z - hz * 2 + dz * 13.5, r]); }
  }
  for (const [px, pz, dx, dz] of alongPolyline(JOZ.hedge, 27, 20, 330)) {           // za żywopłotem, ok. 40°
    const nx = -dz, nz = dx, sgn = (JOZ.mon.c[0] - px) * nx + (JOZ.mon.c[1] - pz) * nz > 0 ? -1 : 1, ex = nx * sgn, ez = nz * sgn, ang = 0.7;
    const hx = dx * Math.cos(ang) + ex * Math.sin(ang), hz = dz * Math.cos(ang) + ez * Math.sin(ang);
    const x = px + ex * 36, z = pz + ez * 36, r = Math.atan2(-hz, hx);
    if (ok(x, z, r)) { if (R() < 0.75) cars.push([x, z, r]); lines.push([x + dx * 13.5, z + dz * 13.5, r]); }
  }
  parkedCars(group, solid, cars);
  const lineM = std({ color: 0xf1f0ea, roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -8, polygonOffsetUnits: -32 });
  group.add(instanced(new THREE.PlaneGeometry(46, 1.2).rotateX(-Math.PI / 2), lineM, lines.map(([x, z, r]) => M4(x, CURB + 0.03, z, r))));

  // pomnik: trójstopniowy cokół z czarnego granitu z orędziem, figura z brązu (3,5 m)
  const { c: [mx, mz], front: [fx, fz], len, wid } = JOZ.mon;
  const G = new THREE.Group(); G.position.set(mx, CURB, mz); G.rotation.y = Math.atan2(fx, fz); group.add(G);   // lokalne +z = przód figury
  const granite = std({ color: 0x1c1d1f, roughness: 0.28, metalness: 0.25 });
  const add = (geo, mat, parent = G) => { const m = new THREE.Mesh(geo, mat); parent.add(m); return m; };
  add(new THREE.BoxGeometry(len, 3, wid).translate(0, 1.5, 0), granite);
  add(new THREE.BoxGeometry(len - 14, 4, wid - 12).translate(0, 5, -1), granite);
  add(new THREE.BoxGeometry(32, 8, 17).translate(0, 11, -4), [granite, granite, granite, granite, std({ map: inscriptionTex(), roughness: 0.3, metalness: 0.2 }), granite]);
  const bb = [[len / 2, wid / 2], [len / 2, -wid / 2], [-len / 2, -wid / 2], [-len / 2, wid / 2]].map(([lx, lz]) => {
    const r = G.rotation.y, c = Math.cos(r), s = Math.sin(r); return [mx + lx * c + lz * s, mz - lx * s + lz * c];
  }).flat();
  const bbx = ringBox(bb); gridPut(solid, bbx[0], bbx[1], bbx[2], bbx[3], { p: [bb], b: bbx });

  const bronze = std({ color: 0x3d3a35, metalness: 0.6, roughness: 0.42 });
  const P = new THREE.Group(); P.position.set(1, 15, -5); G.add(P);                 // stopy figury na cokole
  // płaszcz papieski: szeroki u dołu, głębokie fałdy, mocne pochylenie w przód
  add(drapedFigure([[0, 0], [11.5, 0], [11, 2], [9.8, 7], [8.3, 13], [7, 18], [6.2, 22], [5.9, 25], [5.4, 27.5], [3.9, 30], [2.2, 31.3], [1.2, 32]], 64, 9, 0.13, 12, 0.86, 0.7), bronze, P);
  // peleryna na ramionach
  add(drapedFigure([[0.5, 17], [7.4, 17.5], [7.6, 20.5], [6.8, 25], [5.8, 28], [3.8, 30.5], [1.5, 31.5]], 44, 7, 0.07, 12, 0.88).translate(0, 0, 0.3), bronze, P);
  // głowa pochylona nad dzieckiem, piuska
  const head = add(new THREE.SphereGeometry(1.75, 18, 14).scale(0.9, 1.05, 1), bronze, P); head.position.set(0, 29.6, 14.2);
  const cap = add(new THREE.SphereGeometry(1.3, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), bronze, P); cap.position.set(0, 30.8, 13.9); cap.rotation.x = 0.7;
  // prawa ręka z pastorałem (po prawej patrząc z przodu, lokalne +x), lewa wyciągnięta do dziewczynki
  const limb = (a, b, r) => add(rodBetween(a, b, r, 12), bronze, P);
  limb([5, 26, 8.5], [6.2, 23, 14], 1.5); limb([6.2, 23, 14], [6.6, 25, 17.5], 1.2);
  add(new THREE.SphereGeometry(1, 10, 8), bronze, P).position.set(6.6, 25.2, 17.8);
  limb([6.8, -0.5, 13], [6.4, 44, 19.5], 0.35);                                     // pastorał
  limb([6.4, 44, 19.5], [6.3, 47.5, 20.8], 0.3);
  add(new THREE.BoxGeometry(4.2, 0.45, 0.45).translate(6.35, 45.8, 20.3), bronze, P);   // poprzeczka krzyża
  add(new THREE.BoxGeometry(0.7, 2.2, 0.6).translate(6.35, 45.2, 20.6), bronze, P);    // korpus
  limb([-5, 25.5, 8.5], [-6.2, 20, 13.5], 1.4); limb([-6.2, 20, 13.5], [-5.6, 16.6, 16], 1.1);
  add(new THREE.SphereGeometry(0.95, 10, 8), bronze, P).position.set(-5.5, 16.2, 16.3);
  // dziewczynka w prostej sukience, przytulona do papieża, z ręką wyciągniętą ku jego dłoni
  const K = new THREE.Group(); K.position.set(-4.6, 0, 12.5); K.rotation.set(-0.12, 0.35, 0); P.add(K);
  add(drapedFigure([[0, 0], [3.3, 0], [3.1, 2], [2.5, 6], [1.8, 9], [1.5, 10.5], [1.1, 11.2]], 32, 6, 0.08, 0, 0.85), bronze, K);
  add(new THREE.SphereGeometry(1.35, 16, 12), bronze, K).position.set(0, 12.6, 0.1);
  add(new THREE.SphereGeometry(1.45, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.62), bronze, K).position.set(0, 12.75, -0.25);   // włosy
  const kl = (a, b, r) => add(rodBetween(a, b, r, 10), bronze, K);
  kl([-1.2, 10.2, 0.3], [-1.3, 13.5, 2.6], 0.55); kl([1.2, 10.2, 0], [1.7, 7.4, -1.2], 0.55);
  // kwiaty i znicze na stopniach
  const potM2 = std({ color: 0x6e4a33 }), flowerCols = [0xc8232c, 0xe8e2d0, 0xf0c33c, 0xd14a7a];
  for (const [x, z] of [[-26, 13], [26, 13], [-30, -12], [30, -12]]) {
    add(new THREE.CylinderGeometry(3.6, 2.6, 5, 16).translate(x, 5.5, z), potM2);
    add(new THREE.SphereGeometry(3.8, 12, 8).scale(1, 0.7, 1).translate(x, 9.5, z), std({ color: flowerCols[(x > 0) + 2 * (z > 0)], roughness: 0.9 }));
  }
  const candleM = std({ color: 0xb3262c, roughness: 0.4 }), flameM = new THREE.MeshStandardMaterial({ color: 0xffd27a, emissive: 0xffb347, emissiveIntensity: 0.6 });
  const Rc = rng(530), cand = [], flames = [];
  for (let i = 0; i < 26; i++) {
    const x = (Rc() - 0.5) * 36, z = 6 + Rc() * 7, y = 7;
    cand.push(M4(x, y, z)); flames.push(M4(x, y + 1.5, z));
  }
  const toWorld = m => m.premultiply(G.matrixWorld);
  G.updateMatrixWorld(true);
  group.add(instanced(new THREE.CylinderGeometry(0.45, 0.45, 1.4, 10).translate(0, 0.7, 0), candleM, cand.map(toWorld)));
  group.add(instanced(new THREE.SphereGeometry(0.22, 8, 6).scale(1, 1.6, 1), flameM, flames.map(toWorld)));
}
