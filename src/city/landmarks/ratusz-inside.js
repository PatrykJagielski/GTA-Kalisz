import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { canvasTex, speckle } from '../../core/textures.js';
import { CURB } from '../config.js';
import { archWall } from './arch-wall.js';
import { RISE, TW } from './ratusz-walk.js';

/* ---------- wnętrze ratusza: sień za podcieniami i klatka schodowa w trzonie wieży (układ i wysokości w ratusz-walk.js) ---------- */
export const HALL_H = 52;                                                        // strop sieni
// ściana sieni: tynk z ciemniejszą lamperią do 1,2 m
export function hallWallTex() {
  return canvasTex(256, (g, n) => {
    g.fillStyle = '#ece6da'; g.fillRect(0, 0, n, n);
    const Y = y => n - y / HALL_H * n;
    g.fillStyle = '#b9ad98'; g.fillRect(0, Y(12), n, n - Y(12));
    g.fillStyle = '#8f8270'; g.fillRect(0, Y(12.6), n, Y(12) - Y(12.6));
  });
}
function signTex() {                                                             // tabliczka 2 : 1 nad drzwiami do wieży
  return canvasTex(256, (g, n) => {
    g.fillStyle = '#23324a'; g.fillRect(0, 0, n, n);
    g.setTransform(0.5, 0, 0, 1, 0, 0);                                          // płótno kwadratowe, tabliczka dwa razy szersza
    g.fillStyle = '#f2ecd8'; g.textAlign = 'center'; g.font = 'bold 70px sans-serif';
    g.fillText('WIEŻA', n, n * 0.42); g.font = 'bold 44px sans-serif'; g.fillText('widokowa  ↑', n, n * 0.78);
  });
}
function brickTex() {                                                            // mur z cegły: 8 warstw, wiązanie pospolite
  return canvasTex(256, (g, n) => {
    g.fillStyle = '#b9a992'; g.fillRect(0, 0, n, n);
    const h = n / 8;
    for (let r = 0; r < 8; r++) for (let i = -1; i < 4; i++) {
      const v = (r * 7 + i * 13) % 5;
      g.fillStyle = ['#9a5a40', '#8e5138', '#a4654a', '#874b34', '#96583e'][v];
      g.fillRect(i * n / 4 + (r % 2) * n / 8 + 2, r * h + 2, n / 4 - 4, h - 4);
    }
  });
}
function woodTex() {                                                             // deski stopni i podestów
  return canvasTex(128, (g, n) => {
    g.fillStyle = '#6e5540'; g.fillRect(0, 0, n, n);
    for (let i = 0; i < 6; i++) { g.fillStyle = `rgba(0,0,0,${0.04 + (i * 3 % 5) / 40})`; g.fillRect(0, i * n / 6, n, n / 6 - 2); }
  });
}
const tiled = (base, amp, tiles, seed, rx, ry) => { const t = speckle(base, amp, tiles, seed); t.repeat.set(rx, ry); return t; };

// F = grupa frontu; (tx, tz) = oś wieży w układzie frontu; hallM = ściany sieni (także tył ściany w głębi podcieni)
export function buildInside(F, tx, tz, hallM) {
  const add = (geo, mat, parent = F) => { const m = new THREE.Mesh(geo, mat); parent.add(m); return m; };
  const std = o => { const m = new THREE.MeshStandardMaterial({ roughness: 0.85, emissive: 0xffd9a8, emissiveIntensity: 0, ...o }); m.emissiveMap = m.map || null; return m; };   // nocą ciepłe światło
  const lampM = new THREE.MeshBasicMaterial({ color: 0xfff1d0 });

  // sień: posadzka z płyt, strop, ściany boczne; od tyłu ściana klatki z drzwiami do wieży i tabliczką
  const [x0, x1, z0, z1] = TW.hall, w = x1 - x0, d = z1 - z0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
  const floorM = std({ map: tiled('#cbc2b2', 0.12, 2, 31, w / 12, d / 12) });
  add(new THREE.PlaneGeometry(w, d).rotateX(-Math.PI / 2).translate(cx, CURB + 0.03, cz), floorM);
  const ceilM = std({ color: 0xf4f0e8 });
  add(new THREE.PlaneGeometry(w, d).rotateX(Math.PI / 2).translate(cx, HALL_H, cz), ceilM);
  add(new THREE.PlaneGeometry(d, HALL_H).rotateY(Math.PI / 2).translate(x0, HALL_H / 2, cz), hallM);
  add(new THREE.PlaneGeometry(d, HALL_H).rotateY(-Math.PI / 2).translate(x1, HALL_H / 2, cz), hallM);
  const [dx0, dx1] = TW.towerDoor, dc = tx + (dx0 + dx1) / 2;
  add(archWall(w, [[dc - x0, dx1 - dx0, 32]], HALL_H, 0.3).translate(x0, 0, z0 + 0.3), [hallM, hallM, hallM]);
  add(new THREE.PlaneGeometry(22, 11).translate(dc, 38, z0 + 0.4), std({ map: signTex() }));
  for (const lx of [cx - w / 4, cx + w / 4]) add(new THREE.CylinderGeometry(3, 3, 0.6, 16).translate(lx, HALL_H - 0.3, cz), lampM);

  // klatka w trzonie: ściany (od strony sieni z drzwiami), rdzeń, schody wokół rdzenia z podestami w narożnikach
  const T = new THREE.Group(); T.position.set(tx, 0, tz); F.add(T);
  const top = TW.deck - 3, c = TW.core, wl = TW.wall, mid = (wl + c) / 2, cw = wl - c;
  const brick = brickTex(); brick.repeat.set(2 * TW.outer / 12, top / 6);
  const towerM = std({ map: brick, roughness: 0.95 });
  for (let k = 0; k < 4; k++) {
    const len = k % 2 ? 2 * wl : 2 * TW.outer, door = k ? [] : [[(dx0 + dx1) / 2 + len / 2, dx1 - dx0, 32]];
    add(archWall(len, door, top, TW.outer - wl).translate(-len / 2, 0, TW.outer).rotateY(k * Math.PI / 2), [towerM, towerM, towerM], T);
  }
  add(new THREE.PlaneGeometry(2 * wl, 2 * wl).rotateX(-Math.PI / 2).translate(0, CURB + 0.03, 0), floorM, T);   // posadzka parteru klatki
  const coreM = std({ map: tiled('#e8e0d0', 0.1, 0, 33, 1, TW.landing / 30) });
  add(new THREE.BoxGeometry(2 * c, TW.landing - 2, 2 * c).translate(0, (TW.landing - 2) / 2, 0), coreM, T);
  const n = TW.steps, run = 2 * c / n, steps = [];
  const slab = (x, z, sx, sz, h, t = 4) => steps.push(new THREE.BoxGeometry(sx, t, sz).translate(x, h - t / 2, z));
  const corner = j => [j === 0 || j === 3 ? 1 : -1, j < 2 ? 1 : -1];
  for (let k = 0; k < TW.flights; k++) {
    const [sx, sz] = corner(k % 4), h0 = CURB + k * RISE;
    slab(sx * mid, sz * mid, cw, cw, h0);                                        // podest w narożniku
    add(new THREE.CylinderGeometry(1.1, 0.7, 2.2, 8).translate(sx * (wl - 1.2), h0 + 22, sz * mid), lampM, T);   // kinkiet
    for (let i = 0; i < n; i++) {
      const u = c - (i + 0.5) * run, h = h0 + (i + 0.5) / n * RISE;             // u: od narożnika k w stronę k + 1
      const p = k % 4;
      if (p === 0) slab(u, mid, run, cw, h); else if (p === 1) slab(-mid, u, cw, run, h);
      else if (p === 2) slab(-u, -mid, run, cw, h); else slab(mid, -u, cw, run, h);
    }
  }
  // podest pod izbą z otworem nad ostatnim biegiem, balustrada nad otworem, prosty bieg do włazu w izbie
  slab(0, (c - wl) / 2, 2 * wl, wl + c, TW.landing, 2);
  for (const s of [1, -1]) slab(s * mid, mid, cw, cw, TW.landing, 2);
  const [fx0, fx1, fh] = TW.flight, fn = 15, frun = (fx1 - fx0) / fn;
  for (let i = 0; i < fn; i++) slab(fx0 + (i + 0.5) * frun, 0, frun, 2 * fh, TW.landing + (i + 0.5) / fn * (TW.deck - TW.landing));
  const stairM = std({ map: woodTex(), roughness: 0.75 });
  add(mergeGeometries(steps), stairM, T);
  const ironM = new THREE.MeshStandardMaterial({ color: 0x1d2226, roughness: 0.5, metalness: 0.5 });
  const rail = (ax, ay, az, bx, by, bz) => {                                      // pochwyt na słupkach, 10 dm nad stopniami
    const l = Math.hypot(bx - ax, by - ay, bz - az), dir = new THREE.Vector3(bx - ax, by - ay, bz - az).normalize();
    const bar = new THREE.BoxGeometry(0.7, 0.7, l).lookAt(dir).translate((ax + bx) / 2, (ay + by) / 2 + 10, (az + bz) / 2);
    const posts = [bar];
    for (let i = 0, m = Math.max(1, Math.round(l / 6)); i <= m; i++) posts.push(new THREE.BoxGeometry(0.5, 10, 0.5).translate(ax + (bx - ax) * i / m, ay + (by - ay) * i / m + 5, az + (bz - az) * i / m));
    add(mergeGeometries(posts), ironM, T);
  };
  rail(-c, TW.landing, c, c, TW.landing, c); rail(c, TW.landing, c, c, TW.landing, wl);
  for (const s of [1, -1]) rail(fx0, TW.landing, s * (fh - 0.4), fx1, TW.deck, s * (fh - 0.4));
  return [floorM, ceilM, towerM, coreM, stairM];
}
