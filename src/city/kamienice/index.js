import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { CURB } from '../config.js';
import { facadeTex, railTex, signTex } from './paint.js';
import { arcade, archRecess, balcony3d, box, column, door3d, flowers, frameOf, medallion, put, shop3d, solidRect, window3d } from './parts.js';

/* ---------- kamienice odtworzone ze zdjęć (dane w spec.js): front z teksturą tynku i detalami w 3D ---------- */
const std = o => new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85, ...o });
const mesh = (geo, mat) => { const m = new THREE.Mesh(geo, mat); m.matrixAutoUpdate = false; return m; };

// szyld na płaszczyźnie (lokalnie): tło albo same litery; lit = świeci nocą (sky.js razem z kamienicami Rynku)
function plane(c, w, h, s, fn) {
  const map = signTex(w, h, s), mat = std({ map, roughness: 0.55, alphaTest: s.bg && !s.round ? 0 : 0.5, emissive: s.lit ? 0xffffff : 0, emissiveMap: s.lit ? map : null, emissiveIntensity: 0 });
  c.B.own.push(mesh(fn(new THREE.PlaneGeometry(w, h)).applyMatrix4(c.M), mat));
  if (s.lit) c.B.lit.push(mat);
}
const sign = (c, x0, x1, y0, y1, z, s) => plane(c, x1 - x0, y1 - y0, s, g => g.translate((x0 + x1) / 2, (y0 + y1) / 2, z));

// F = { x0, z0, x1, z1, nx, nz, len } front z obrysu, S = opis kamienicy
function build(F, S, B, solid, cafes) {
  const c = frameOf(F, B), len = F.len, P = f => f * len, holes = [], arches = [], arcs = [], bal = S.balconies || [];
  // piętra: okna, nad balkonem drzwi balkonowe do płyty, skrzynki z kwiatami
  S.floors.forEach((fl, i) => (fl.at || S.axes).forEach((f, k) => {
    const x = P(f), w = fl.wide?.[k] || fl.w, door = bal.some(([b, x0, x1]) => b === i && x > P(x0) && x < P(x1)), y0 = door ? fl.y[0] - 8 : fl.y[0];
    holes.push([x - w / 2, x + w / 2, y0, fl.y[1]]);
    window3d(c, x, w, y0, fl.y[1], S, { hood: fl.hood, door });
    if (S.flowers?.[i]?.includes(k)) flowers(c, x, w, y0 - 0.4);
  }));
  for (const [i, x0, x1, D, plants] of bal) balcony3d(c, P(x0), P(x1), S.floors[i].y[0] - 8, D, S, plants);
  for (const [y0, y1, d, f0 = 0, f1 = 1, col = S.trim] of S.bands) box(c, P(f0), P(f1), y0, y1, 0, d, col);
  if (S.dentils) for (let x = 0.8; x < len - 1.2; x += 2.2) box(c, x, x + 1.1, S.dentils[0], S.dentils[1], 0, 1.6, S.trim);
  for (const [f0, f1] of S.strips || []) box(c, P(f0), P(f1), -2, S.dentils ? S.dentils[0] : S.eave, 0, 0.9, S.trim);   // pilastry na narożach

  // parter
  for (const o of S.ground) {
    const [x0, x1] = o.x.map(P), [y0, y1] = o.y;
    if (o.k === 'shop') { holes.push([x0, x1, y0, y1]); shop3d(c, x0, x1, y0, y1, S, o, o.door && o.door.map(P)); if (o.sign) sign(c, x0, x1, y1 - 7, y1, 0.5, o.sign); }
    if (o.k === 'door') { holes.push([x0, x1, y0, y1]); door3d(c, x0, x1, y0, y1, S); }
    if (o.k === 'arch' || o.k === 'arcade') {
      const rise = o.rise || (x1 - x0) / 2, open = o.k === 'arcade';
      arches.push([x0, x1, open ? -2 : y0, y1, rise]);
      archRecess(c, x0, x1, open ? CURB : y0, y1, rise, open ? 6 : 2.4, S, o);
      if (open) arcs.push([x0, x1, y1, o.inner]);
    }
  }
  if (arcs.length) arcade(c, arcs, S, solid, F.hit);
  if (S.cartouche) {                                                                     // kartusz nad drzwiami
    const x = P(S.cartouche[0]), y = S.cartouche[1];
    box(c, x - 4.5, x + 4.5, y - 3, y + 2.5, 0, 0.7, S.trim);
    put(c, new THREE.CylinderGeometry(2.4, 2.4, 1, 16).rotateX(Math.PI / 2).translate(x, y, 1), S.trim);
    for (const s of [-1, 1]) put(c, new THREE.TorusGeometry(1.4, 0.45, 5, 10).translate(x + s * 4.2, y + 0.5, 0.8), S.trim);
  }
  if (S.basket) {                                                                        // kosz z petuniami pod łukiem
    const x = P(S.basket[0]), y = S.basket[1];
    put(c, new THREE.SphereGeometry(3.2, 10, 8).scale(1, 0.75, 1).translate(x, y, -2.5), '#d9529a');
    put(c, new THREE.CylinderGeometry(2.2, 1.4, 2.2, 10).translate(x, y - 2, -2.5), '#5a4632');
    box(c, x - 0.1, x + 0.1, y + 2, 45.5, -2.6, -2.4, '#2a2c2f', 'iron');
  }
  for (const f of S.medallions || []) medallion(c, P(f), S.medY, 3.3, '#f1ece6');
  if (S.columns) {                                                                       // podest i pary kolumn między łukami
    const [p0, p1] = S.platform.map(P), cols = S.columns.map(P), y0 = CURB + 1.2;
    box(c, p0, p1, 0, y0, 0, 5.5, '#8d4d3c'); solidRect(c, p0, p1, 0, 5.5, solid);
    cols.forEach(x => column(c, x, y0, S.colTop, 2.8, 2.1, S.trim));
    for (let i = 0; i + 1 < cols.length; i += 2) box(c, cols[i] - 3.6, cols[i + 1] + 3.6, S.colTop, S.colTop + 2.6, 0, 5.4, S.trim);
  }
  if (S.attic) {                                                                         // górna kondygnacja i attyka z kulami
    const [a, b] = S.attic.map(P), yb = S.top, hs = [9, 11, 13, 11, 9];
    box(c, a, b, S.eave, yb, -26, -0.15, S.wall);
    box(c, a - 1, b + 1, yb, yb + 5.5, -1.2, 1.2, S.wall);
    hs.forEach((h, i) => {
      const x = a + (b - a) * i / 4;
      box(c, x - 1.3, x + 1.3, yb, yb + h, -1.4, 1.4, S.trim);
      if (i && i < 4) box(c, x - (b - a) / 8, x + (b - a) / 8, yb + 5.5, yb + h - 3, -1, 1, S.wall);
      put(c, new THREE.SphereGeometry(1.9, 12, 8).translate(x, yb + h + 1.8, 0), '#948e84');
    });
  }
  for (const s of S.signs || []) sign(c, P(s.x[0]), P(s.x[1]), s.y[0], s.y[1], 0.4, s);
  for (const s of S.blades || []) {                                                     // wysięgniki: szyld z obu stron
    const x = P(s.x), o = s.w / 2 + 1.2;
    box(c, x - 0.3, x + 0.3, s.y + s.h / 2 + 0.2, s.y + s.h / 2 + 0.8, 0, o + s.w / 2, '#2a2c2f', 'iron');
    for (const d of [1, -1]) plane(c, s.w, s.h, s, g => g.rotateY(d * Math.PI / 2).translate(x + d * 0.08, s.y, o));
  }
  for (const f of S.boards || []) {                                                      // potykacze przed barem
    const x = P(f), h = 11, t = 0.2, z = 8, s = { bg: '#1f1f1f', border: '#7a5433', lines: [['POD FILARAMI', 0.1, 0.12, '#f2a33a'], ['KEBAB', 0.09, 0.36],
      ['BURGERY', 0.09, 0.52], ['FRYTKI', 0.09, 0.68], ['24 zł', 0.12, 0.86, '#f2d15c']] };
    plane(c, 6.5, h, s, g => g.rotateX(-t).translate(x, CURB + h / 2 * Math.cos(t), z + h / 2 * Math.sin(t)));
    plane(c, 6.5, h, s, g => g.rotateY(Math.PI).rotateX(t).translate(x, CURB + h / 2 * Math.cos(t), z - h / 2 * Math.sin(t)));
    solidRect(c, x - 3.5, x + 3.5, z - 3, z + 3, solid);
  }
  if (S.cafe) {                                                                          // ogródek: odcinek wzdłuż frontu dla rynekCafes
    const at = f => new THREE.Vector3(P(f), 0, 0).applyMatrix4(c.M), a = at(S.cafe[0]), b = at(S.cafe[1]);
    cafes.push({ x0: a.x, z0: a.z, x1: b.x, z1: b.z, nx: F.nx, nz: F.nz, len: P(S.cafe[1] - S.cafe[0]) });
  }
  // tynk frontu: tekstura z przezroczystymi łukami i niebem przy attyce; szarość materiału jak w elewacjach Rynku
  const top = S.top || S.eave;
  B.own.push(mesh(new THREE.PlaneGeometry(len, top + 2).translate(len / 2, top / 2 - 1, 0).applyMatrix4(c.M), std({ color: 0xdcdcdc, map: facadeTex(S, len, holes, arches), alphaTest: 0.5 })));
}

// list = fronty rozpoznanych kamienic { ..., spec }; zwraca siatki, materiały świecące nocą i ogródki
export function kamieniceMeshes(list, glowM, solid) {
  const B = { st: [], iron: [], rail: [], glass: [], glow: [], own: [], lit: [] }, cafes = [];
  for (const F of list) build(F, F.spec, B, solid, cafes);
  const mats = {
    st: std({ vertexColors: true, side: THREE.DoubleSide }), iron: std({ color: 0x2a2c2f, roughness: 0.5, metalness: 0.5 }),
    rail: std({ map: railTex(), alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.5, metalness: 0.5 }),
    glass: std({ color: 0x3c4c5a, roughness: 0.12, metalness: 0.55 }), glow: glowM,
  };
  const meshes = Object.keys(mats).filter(k => B[k].length).map(k => mesh(mergeGeometries(B[k]), mats[k]));
  return { meshes: meshes.concat(B.own), lit: B.lit, cafes };
}
