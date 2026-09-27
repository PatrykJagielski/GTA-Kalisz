import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { M4, instanced } from '../core/geometry.js';
import { rng } from '../core/random.js';
import { scene } from '../core/renderer.js';
import { speckle } from '../core/textures.js';
import { CURB } from './config.js';
import { PAL, facade } from './facades.js';
import { buildFountain } from './landmarks/fountain.js';
import { buildGarnizon } from './landmarks/garnizon.js';
import { buildJozef } from './landmarks/jozef.js';
import { buildKolegiata } from './landmarks/kolegiata.js';
import { buildMural } from './landmarks/mural.js';
import { NAR, buildNarozna } from './landmarks/narozna.js';
import { buildRatusz } from './landmarks/ratusz.js';
import { arrGeo, flatGeo, newArr, pushRoof, pushWalls } from './mesh.js';
import { gridPut, indexPolys, ringBox } from './spatial.js';

/* ================= Kalisz: miasto z danych OpenStreetMap ================= */
export function buildCity(D) {
  const R = rng(20050427), group = new THREE.Group();                         // do sceny dopiero na końcu: błąd w połowie nie zostawia śmieci
  const [bx0, bz0, bx1, bz1] = D.bounds;
  const layer = (lvl, o = {}) => new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, polygonOffset: lvl !== 0, polygonOffsetFactor: -lvl, polygonOffsetUnits: -lvl * 4, ...o, map: o.map || null });
  const add = (geo, mat) => { const m = new THREE.Mesh(geo, mat); m.matrixAutoUpdate = false; group.add(m); return m; };

  // teren poza mapą, jezdnie, bruk na Głównym Rynku
  const outer = new THREE.Mesh(new THREE.PlaneGeometry(160000, 160000), new THREE.MeshStandardMaterial({ color: 0x7b8a63, roughness: 1 }));
  outer.rotation.x = -Math.PI / 2; outer.position.y = -3.5; group.add(outer);
  add(flatGeo(D.roadArea, 0, 1 / 40), layer(0, { map: speckle('#3e4147', 0.22, 0, 11) }));
  add(flatGeo(D.cobble, 0, 1 / 12), layer(1, { map: speckle('#6a625a', 0.3, 8, 12) }));
  // kwartały: chodnik z krawężnikiem, podwórka, deptaki, zieleń, alejki, woda
  const curb = newArr(false);
  for (const p of D.blocks) p.forEach((r, k) => pushWalls(curb, r, k > 0, -3, CURB, (u, v) => [u / 20, v / 20]));
  add(arrGeo(curb), new THREE.MeshStandardMaterial({ color: 0xcfccc4, roughness: 0.9 }));
  add(flatGeo(D.blocks, CURB, 1 / 20), layer(0, { map: speckle('#bdbab1', 0.16, 4, 13) }));
  add(flatGeo(D.yards, CURB, 1 / 40), layer(1, { map: speckle('#a7a893', 0.2, 0, 14) }));
  add(flatGeo(D.plaza, CURB, 1 / 12), layer(2, { map: speckle('#d3c4a6', 0.22, 6, 15) }));
  add(flatGeo(D.green, CURB, 1 / 30), layer(3, { map: speckle('#6c9a4b', 0.28, 0, 16) }));
  add(flatGeo(D.paths, CURB, 1 / 20), layer(4, { map: speckle('#d9cfb6', 0.18, 0, 17) }));
  add(flatGeo(D.water, -2, 1 / 60), new THREE.MeshStandardMaterial({ color: 0x3d6d93, roughness: 0.12, metalness: 0.25 }));

  // oznakowanie: przerywana oś dróg dwukierunkowych i przejścia dla pieszych
  const paintM = layer(2, { color: 0xecebe6, roughness: 0.7 });
  const dash = [], zebra = [];
  for (const rd of D.roads) {
    const [cls, , w, one] = rd;
    if (cls > 2 || one || w < 70) continue;
    let s = 0;
    for (let i = 5; i + 3 < rd.length; i += 2) {
      const x0 = rd[i], z0 = rd[i + 1], dx = rd[i + 2] - x0, dz = rd[i + 3] - z0, len = Math.hypot(dx, dz), ang = Math.atan2(-dz, dx);
      for (let t = (60 - s % 60) % 60; t + 30 <= len; t += 60) dash.push(M4(x0 + dx * (t + 15) / len, 0.02, z0 + dz * (t + 15) / len, ang));
      s += len;
    }
  }
  for (const [x0, z0, x1, z1] of D.crossings) {
    const dx = x1 - x0, dz = z1 - z0, len = Math.hypot(dx, dz), ang = Math.atan2(-dz, dx);
    for (let t = 6; t < len - 3; t += 11) zebra.push(M4(x0 + dx * t / len, 0.02, z0 + dz * t / len, ang));
  }
  group.add(instanced(new THREE.PlaneGeometry(30, 1.5).rotateX(-Math.PI / 2), paintM, dash));
  group.add(instanced(new THREE.PlaneGeometry(5, 26).rotateX(-Math.PI / 2), paintM, zebra));

  // budynki: ściany z oknami (kolor z palety), płaskie dachy; kolizja dla wszystkiego, co stoi na ziemi
  const solid = new Map(), bArr = [newArr(), newArr(), newArr()], roofs = newArr();
  const winUV = (u, v) => [u / 160, v / 132], blankUV = () => [0.01, 0.01];
  let narRing = null;
  for (const b of D.buildings) {
    const h = b[0], minh = b[1], kind = b[2], ring = b.slice(3);
    if (ring[0] === NAR.first[0] && ring[1] === NAR.first[1]) { narRing = ring; continue; }   // kamienica na rogu: model osobny
    const col = new THREE.Color(PAL.wall[kind][Math.floor(R() * PAL.wall[kind].length)]);
    const roof = new THREE.Color(PAL.roof[kind][Math.floor(R() * PAL.roof[kind].length)]);
    const y0 = minh > 0 ? minh : -2, arr = kind === 3 ? bArr[1] : kind === 2 ? bArr[2] : bArr[0];
    pushWalls(arr, ring, false, y0, h, kind === 2 ? blankUV : winUV, col);
    pushRoof(roofs, ring, h, roof);
    if (minh < 25) { const bb = ringBox(ring); gridPut(solid, bb[0], bb[1], bb[2], bb[3], { p: [ring], b: bb }); }
  }
  const facM = new THREE.MeshStandardMaterial({ map: facade(false), vertexColors: true, roughness: 0.85, emissive: 0xffffff, emissiveMap: facade(false, true), emissiveIntensity: 0 });
  const glassM = new THREE.MeshStandardMaterial({ map: facade(true), vertexColors: true, roughness: 0.35, metalness: 0.3, emissive: 0xffffff, emissiveMap: facade(true, true), emissiveIntensity: 0 });
  add(arrGeo(bArr[0]), facM); add(arrGeo(bArr[1]), glassM); add(arrGeo(bArr[2]), facM);
  add(arrGeo(roofs), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 }));
  const ratM = (D.ratusz ? buildRatusz(D.ratusz, group, solid) : []).concat(D.kolegiata ? buildKolegiata(D.kolegiata, group, solid) : [], D.garnizon ? buildGarnizon(D.garnizon, group, solid) : [], buildMural(group));
  const posts = new Map();
  const fountain = D.fountain ? buildFountain(D.fountain, group, solid, posts) : null;
  buildJozef(D, group, solid, posts);
  if (narRing) buildNarozna(group, solid, narRing);
  // wieże kościołów z hełmem
  const towerM = new THREE.MeshStandardMaterial({ color: 0xc9b89c, roughness: 0.85 }), spireM = new THREE.MeshStandardMaterial({ color: 0x4f6b62, roughness: 0.5, metalness: 0.4 });
  for (const [x, z, s, h, a] of D.towers) {
    const body = new THREE.Mesh(new THREE.BoxGeometry(s, h * 0.72, s).translate(0, h * 0.36, 0), towerM);
    const spire = new THREE.Mesh(new THREE.ConeGeometry(s * 0.72, h * 0.3, 4).rotateY(Math.PI / 4).translate(0, h * 0.72 + h * 0.15, 0), spireM);
    const t = new THREE.Group(); t.add(body, spire); t.position.set(x, 0, z); t.rotation.y = -a; group.add(t);
    gridPut(solid, x - s / 2, z - s / 2, x + s / 2, z + s / 2, { p: [[x - s / 2, z - s / 2, x + s / 2, z - s / 2, x + s / 2, z + s / 2, x - s / 2, z + s / 2]], b: [x - s / 2, z - s / 2, x + s / 2, z + s / 2] });
  }
  indexPolys(D.water, solid);                                                    // do Prosny się nie wjeżdża

  // barierki na mostach
  const rails = [];
  for (const rd of D.roads) {
    if (!rd[4]) continue;
    for (let i = 5; i + 3 < rd.length; i += 2) {
      const x0 = rd[i], z0 = rd[i + 1], dx = rd[i + 2] - x0, dz = rd[i + 3] - z0, len = Math.hypot(dx, dz);
      if (len < 1) continue;
      for (const sd of [1, -1]) {
        const ox = -dz / len * sd * (rd[2] / 2 + 1), oz = dx / len * sd * (rd[2] / 2 + 1);
        rails.push(new THREE.BoxGeometry(len, 10, 1.2).rotateY(Math.atan2(-dz, dx)).translate(x0 + dx / 2 + ox, 5, z0 + dz / 2 + oz));
      }
    }
  }
  if (rails.length) add(mergeGeometries(rails), new THREE.MeshStandardMaterial({ color: 0x5d6770, metalness: 0.5, roughness: 0.45 }));
  // granica mapy
  const W = bx1 - bx0, H = bz1 - bz0, cxm = (bx0 + bx1) / 2, czm = (bz0 + bz1) / 2;
  add(mergeGeometries([[cxm, bz0, W, 3], [cxm, bz1, W, 3], [bx0, czm, 3, H], [bx1, czm, 3, H]].map(([x, z, w, d]) => new THREE.BoxGeometry(w, 8, d).translate(x, 4, z))),
    new THREE.MeshStandardMaterial({ color: 0xd24a2a, roughness: 0.6 }));

  // drzewa i latarnie (przeszkody punktowe)
  const trees = [], lamps = [];
  for (let i = 0; i < D.trees.length; i += 2) trees.push([D.trees[i], D.trees[i + 1], 0.75 + R() * 0.55]);
  for (let i = 0; i < D.lamps.length; i += 3) lamps.push([D.lamps[i], D.lamps[i + 1], -D.lamps[i + 2]]);
  for (const [x, z, s] of trees) gridPut(posts, x, z, x, z, [x, z, 2 * s]);
  for (const [x, z] of lamps) gridPut(posts, x, z, x, z, [x, z, 1.4]);
  const lampHeadM = new THREE.MeshStandardMaterial({ color: 0xfff4d6, emissive: 0xffe2a0, emissiveIntensity: 0.4 });
  const poleM = new THREE.MeshStandardMaterial({ color: 0x3a3f45, metalness: 0.6, roughness: 0.5 });
  group.add(instanced(new THREE.CylinderGeometry(0.8, 1.1, 80, 8).translate(0, CURB + 40, 0), poleM, lamps.map(([x, z]) => M4(x, 0, z))));
  group.add(instanced(new THREE.BoxGeometry(12, 0.9, 0.9).translate(6, CURB + 80, 0), poleM, lamps.map(([x, z, f]) => M4(x, 0, z, f))));
  group.add(instanced(new THREE.BoxGeometry(5, 1.3, 3).translate(11, CURB + 79.4, 0), lampHeadM, lamps.map(([x, z, f]) => M4(x, 0, z, f))));
  const leaf = [0x4e7d38, 0x5a8a3f, 0x436f33, 0x628f45, 0x557a3a].map(c => new THREE.Color(c));
  group.add(instanced(new THREE.CylinderGeometry(1.3, 1.9, 34, 6).translate(0, CURB + 17, 0), new THREE.MeshStandardMaterial({ color: 0x5b4431, roughness: 1 }), trees.map(([x, z, s]) => M4(x, 0, z, 0, s, s, s))));
  group.add(instanced(new THREE.IcosahedronGeometry(17, matchMedia('(pointer:coarse)').matches ? 0 : 1).translate(0, CURB + 46, 0), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }),
    trees.map(([x, z, s]) => M4(x, 0, z, R() * 6, s, s * (0.85 + R() * 0.35), s)), trees.map(() => leaf[Math.floor(R() * leaf.length)])));

  // nazwy ulic: odcinki osi w siatce
  const segs = new Map();
  for (const rd of D.roads) {
    if (rd[1] < 0) continue;
    const hw = rd[2] / 2 + 25;
    for (let i = 5; i + 3 < rd.length; i += 2) {
      const s = [rd[i], rd[i + 1], rd[i + 2], rd[i + 3], rd[1]];
      gridPut(segs, Math.min(s[0], s[2]) - hw, Math.min(s[1], s[3]) - hw, Math.max(s[0], s[2]) + hw, Math.max(s[1], s[3]) + hw, s);
    }
  }

  // minimapa: cały plan narysowany raz, potem wycinek obracany za autem
  const MS = 0.09, map = document.createElement('canvas'); map.width = Math.ceil(W * MS); map.height = Math.ceil(H * MS);
  const mg = map.getContext('2d');
  mg.setTransform(MS, 0, 0, MS, -bx0 * MS, -bz0 * MS);
  const fillPolys = (list, color) => {
    mg.fillStyle = color; mg.beginPath();
    for (const p of list) for (const r of p) { mg.moveTo(r[0], r[1]); for (let i = 2; i < r.length; i += 2) mg.lineTo(r[i], r[i + 1]); mg.closePath(); }
    mg.fill('evenodd');
  };
  mg.fillStyle = '#4a4e54'; mg.fillRect(bx0, bz0, W, H);
  fillPolys(D.blocks, '#c4c1b8'); fillPolys(D.yards, '#aeb09c'); fillPolys(D.plaza, '#dccfb4'); fillPolys(D.green, '#80ad5f');
  fillPolys(D.paths, '#e2d9c3'); fillPolys(D.water, '#4f86b4');
  if (D.fountain) {
    const [fx, fz] = D.fountain.c;
    mg.fillStyle = '#d6d2c8'; mg.beginPath(); mg.arc(fx, fz, D.fountain.r, 0, 7); mg.fill();
    mg.fillStyle = '#4f86b4'; mg.beginPath(); mg.arc(fx, fz, 62, 0, 7); mg.fill();
  }
  fillPolys(D.buildings.map(b => [b.slice(3)]).concat(D.ratusz ? [D.ratusz.body] : [], D.kolegiata ? [[D.kolegiata.ring]] : [], D.garnizon ? [[D.garnizon.ring]] : []), '#8f7766');

  scene.add(group);
  const start = D.start;
  return { group, solid, posts, segs, names: D.names, lampHeadM, facM, glassM, ratM, fountain, map, MS, bounds: D.bounds,
    blockG: indexPolys(D.blocks), greenG: indexPolys(D.green), start };
}
