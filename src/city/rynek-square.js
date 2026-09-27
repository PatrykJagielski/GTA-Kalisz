import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { M4, instanced } from '../core/geometry.js';
import { CURB } from './config.js';
import { block, chairGeo } from './rynek-street.js';

/* ---------- płyta Rynku: fortepian plenerowy ze sceną przy ratuszu i namioty restauracji The Jack ---------- */
// Położenie ze zdjęć Street View i widoku 3D Map Google (lokalnie jak RYNEK w rynek.js: u wzdłuż pierzei NW/SE, v na SE):
// niska scena z ciemnym blatem tuż przy północno-zachodnim narożniku ratusza, obok niej na płycie czarny fortepian;
// namioty The Jack w zachodnim rogu płyty: trzy moduły z beżowego płótna na grafitowych słupach, w rzędzie wzdłuż pierzei NW,
// czarne donice z czerwonymi kwiatami, pod dachem stoliki i krzesła.
const STAGE = { c: [-55, -232], w: 80, d: 55, h: 5 }, PIANO = [-112, -222], TENT = { c: [-305, -262], n: 3, s: 70 };
const std = o => new THREE.MeshStandardMaterial({ roughness: 0.8, ...o });
const box = (w, h, d, x, y, z) => new THREE.BoxGeometry(w, h, d).translate(x, y, z);
const merge = gs => mergeGeometries(gs.map(g => (g.index ? g.toNonIndexed() : g)));                // bryły wyciągnięte nie mają indeksów

// fortepian koncertowy (klawiatura od strony -z, długość wzdłuż +z) z ławą
function pianoGeos() {
  const outline = [[-7.5, 0], [7.5, 0], [7.5, 5], [6, 9], [3.5, 13], [1.5, 17], [-1.5, 19.6], [-5, 20.2], [-7.5, 19]];
  const shape = new THREE.Shape(outline.map(([x, z]) => new THREE.Vector2(x, -z)));
  const slab = (d, y) => new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false }).rotateX(-Math.PI / 2).translate(0, y, 0);
  const black = merge([slab(3.4, 6.4), slab(0.3, 9.9), box(15, 1.6, 3, 0, 6.8, -1.5), box(15, 3, 0.8, 0, 8.3, -3.2),
    ...[[-6, 1.5], [6, 1.5], [-5, 17]].map(([x, z]) => new THREE.CylinderGeometry(0.7, 0.5, 6.4, 8).translate(x, 3.2, z)), box(2, 5, 1, 0, 2.5, 5),
    box(9, 0.9, 3.8, 0, 5, -9), ...[[-4, -10.5], [4, -10.5], [-4, -7.5], [4, -7.5]].map(([x, z]) => box(0.6, 4.6, 0.6, x, 2.3, z))]);
  const keys = box(14, 0.3, 2.4, 0, 7.75, -1.6);
  return { black, keys };
}

export function rynekSquare(R, solid) {
  const [ux, uz] = R.u, W = (pu, pv) => [R.c[0] + ux * pu - uz * pv, R.c[1] + uz * pu + ux * pv];
  const a = Math.atan2(-uz, ux), vx = -uz, vz = ux;                                       // obrót: lokalne x = u, lokalne z = v
  const put = (pu, pv, ry = 0) => { const [x, z] = W(pu, pv); return M4(x, CURB, z, a + ry); };
  const out = [];
  // scena: ciemny blat na aluminiowej ramie
  const { c, w, d, h } = STAGE, sm = [put(c[0], c[1])];
  const top = box(w, 1, d, 0, h - 0.5, 0), frame = mergeGeometries([box(w, 1.2, 0.5, 0, h - 1.6, d / 2), box(w, 1.2, 0.5, 0, h - 1.6, -d / 2), box(0.5, 1.2, d, w / 2, h - 1.6, 0),
    box(0.5, 1.2, d, -w / 2, h - 1.6, 0), ...[-1, 0, 1].flatMap(i => [-1, 1].map(j => box(0.8, h - 1, 0.8, i * (w / 2 - 1), (h - 1) / 2, j * (d / 2 - 1))))]);
  out.push(instanced(top, std({ color: 0x2a2a2c, roughness: 0.9 }), sm), instanced(frame, std({ color: 0xb8bcc0, roughness: 0.4, metalness: 0.7 }), sm));
  block(solid, ...W(c[0], c[1]), ux, uz, vx, vz, w / 2, d / 2);
  // fortepian przodem (klawiaturą) do płyty Rynku
  const pm = [put(PIANO[0], PIANO[1], Math.PI / 2)], { black, keys } = pianoGeos();
  out.push(instanced(black, std({ color: 0x0c0c0e, roughness: 0.18, metalness: 0.2 }), pm), instanced(keys, std({ color: 0xf4f2ec, roughness: 0.4 }), pm));
  block(solid, ...W(PIANO[0], PIANO[1]), ux, uz, vx, vz, 11, 8);
  // namioty The Jack
  const { n, s } = TENT, u0 = TENT.c[0] - (n - 1) * s / 2, mods = [], posts = [], pots = [], tables = [], seats = [];
  for (let i = 0; i < n; i++) {
    const cu = u0 + i * s, cv = TENT.c[1];
    mods.push(put(cu, cv));
    for (const [du, dv] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      if (i > 0 && du < 0) continue;                                                     // słupy wspólne z sąsiednim modułem
      posts.push(put(cu + du * s / 2, cv + dv * s / 2)); pots.push(put(cu + du * (s / 2 - 4), cv + dv * (s / 2 - 4)));
    }
    for (const [du, dv] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const tu = cu + du * 17, tv = cv + dv * 15;
      tables.push(put(tu, tv));
      seats.push(put(tu, tv - 5.5, 0), put(tu, tv + 5.5, Math.PI));
    }
  }
  const canopy = mergeGeometries([new THREE.ConeGeometry(s / Math.SQRT2, 9, 4, 1).rotateY(Math.PI / 4).translate(0, 30.5, 0),
    box(s, 3, 0.3, 0, 24.5, s / 2), box(s, 3, 0.3, 0, 24.5, -s / 2), box(0.3, 3, s, s / 2, 24.5, 0), box(0.3, 3, s, -s / 2, 24.5, 0)]);
  const post = mergeGeometries([new THREE.CylinderGeometry(0.9, 0.9, 26, 8).translate(0, 13, 0), box(2.4, 0.6, 2.4, 0, 0.3, 0)]);
  const pot = box(5.5, 9, 5.5, 0, 4.5, 0), bloom = new THREE.IcosahedronGeometry(3.6, 1).scale(1, 1.25, 1).translate(0, 12.5, 0);
  const table = mergeGeometries([box(7, 0.5, 7, 0, 7.3, 0), new THREE.CylinderGeometry(0.4, 0.4, 7, 6).translate(0, 3.5, 0), box(4, 0.4, 4, 0, 0.2, 0)]);
  out.push(instanced(canopy, std({ color: 0xd8c7a3, roughness: 0.95, side: THREE.DoubleSide }), mods), instanced(post, std({ color: 0x3a3d41, roughness: 0.5, metalness: 0.5 }), posts),
    instanced(pot, std({ color: 0x151515, roughness: 0.6 }), pots), instanced(bloom, std({ color: 0xd8344a, roughness: 0.9 }), pots),
    instanced(table, std({ color: 0x3b3430 }), tables), instanced(chairGeo(), std({ color: 0x2d2d2f, roughness: 0.6 }), seats));
  block(solid, ...W(TENT.c[0], TENT.c[1]), ux, uz, vx, vz, n * s / 2, s / 2);
  return out;
}
