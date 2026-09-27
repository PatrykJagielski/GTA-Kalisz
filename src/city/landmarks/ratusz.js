import * as THREE from 'three';
import { canvasTex } from '../../core/textures.js';
import { arrGeo, flatGeo, newArr, pushWalls } from '../mesh.js';
import { gridPut, ringBox } from '../spatial.js';
import { ARC, arcadeHole, archX, buildArcade } from './ratusz-arcade.js';
import { archTex, clockTex } from './tower-textures.js';

/* ---------- Ratusz w Kaliszu (Główny Rynek 20, 1920–1925): neoklasycystyczny gmach z wieżą ---------- */
const RAT = { H: 158, bay: 38 };                                               // wysokość do gzymsu 15,8 m, oś okienna 3,8 m
function ratFacadeTex() {                                                      // jedna oś okienna na całą wysokość
  return canvasTex(256, (g, n) => {
    const Y = y => n - y / RAT.H * n;                                          // dm od ziemi -> piksel
    g.fillStyle = '#f2efe8'; g.fillRect(0, 0, n, n);
    g.fillStyle = '#d9d5cc'; g.fillRect(0, Y(6), n, n - Y(6));                 // cokół
    g.strokeStyle = 'rgba(0,0,0,.10)'; g.lineWidth = 2;
    for (let y = 10; y < 50; y += 5.5) { g.beginPath(); g.moveTo(0, Y(y)); g.lineTo(n, Y(y)); g.stroke(); }   // boniowanie parteru
    g.fillStyle = '#e6e2d9'; g.fillRect(0, Y(55), n, Y(50) - Y(55));           // gzyms kordonowy
    const win = (y0, y1, w, arch) => {
      const x0 = n / 2 - w / 2, t = Y(y1), b = Y(y0);
      g.fillStyle = '#e4e0d6'; g.fillRect(x0 - 10, t - 8, w + 20, b - t + 12);  // opaska
      const gr = g.createLinearGradient(0, t, 0, b); gr.addColorStop(0, '#6f8598'); gr.addColorStop(1, '#2f3f4e');
      g.fillStyle = gr; g.beginPath();
      if (arch) { g.moveTo(x0, b); g.lineTo(x0, t + w / 2); g.arc(n / 2, t + w / 2, w / 2, Math.PI, 0); g.lineTo(x0 + w, b); }
      else g.rect(x0, t, w, b - t);
      g.fill();
      g.strokeStyle = '#f7f5f0'; g.lineWidth = 3; g.beginPath(); g.moveTo(n / 2, t + 2); g.lineTo(n / 2, b); g.moveTo(x0, t + (b - t) * 0.35); g.lineTo(x0 + w, t + (b - t) * 0.35); g.stroke();
    };
    win(14, 43, 78, true);                                                     // parter: okna zamknięte łukiem
    win(66, 103, 84, false);                                                   // I piętro: wysokie okna
    g.fillStyle = '#dcd8ce'; g.beginPath(); g.moveTo(n / 2 - 62, Y(106)); g.lineTo(n / 2, Y(114)); g.lineTo(n / 2 + 62, Y(106)); g.closePath(); g.fill();   // naczółek
    g.fillRect(n / 2 - 56, Y(66), 112, 6);                                     // parapet
    win(118, 141, 76, false);                                                  // II piętro
    g.fillStyle = '#e1ddd3'; g.fillRect(0, Y(158), n, Y(146) - Y(158));        // fryz
    g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(0, Y(147), n, 3);
  });
}
// ryzalit frontowy nad podcieniami: 3 osie nad łukami; I piętro: wysokie okna z gzymsem nadokiennym, II: okna zamknięte łukiem
function ratFrontTex(L) {
  return canvasTex(512, (g, n) => {
    const y0 = ARC.top, Y = y => n - (y - y0) / (RAT.H - 2 - y0) * n, k = n / L;
    g.fillStyle = '#f4f1ea'; g.fillRect(0, 0, n, n);
    const glass = (t, b) => { const gr = g.createLinearGradient(0, t, 0, b); gr.addColorStop(0, '#71879a'); gr.addColorStop(1, '#2d3d4c'); return gr; };
    const arched = (cx, w, t, b) => { g.beginPath(); g.moveTo(cx - w / 2, b); g.lineTo(cx - w / 2, t + w / 2); g.arc(cx, t + w / 2, w / 2, Math.PI, 0); g.lineTo(cx + w / 2, b); g.fill(); };
    for (const c of archX()) {
      const cx = (c / L + 0.5) * n;
      // I piętro
      const w1 = 17 * k, t1 = Y(101), b1 = Y(68);
      g.fillStyle = '#e5e1d7'; g.fillRect(cx - w1 / 2 - 2 * k, t1 - 4, w1 + 4 * k, b1 - t1 + 4);
      g.fillStyle = glass(t1, b1); g.fillRect(cx - w1 / 2, t1, w1, b1 - t1);
      g.fillStyle = '#e9e5dc'; g.fillRect(cx - w1 / 2 - 4 * k, Y(106), w1 + 8 * k, Y(101.5) - Y(106));   // gzyms nadokienny
      g.fillRect(cx - w1 / 2 - 3 * k, Y(68), w1 + 6 * k, Y(64.5) - Y(68));                            // parapet
      // II piętro: okno zamknięte łukiem
      const w2 = 15 * k, t2 = Y(141), b2 = Y(118);
      g.fillStyle = '#e5e1d7'; arched(cx, w2 + 4 * k, t2 - 2 * k, b2 + 3);
      g.fillStyle = glass(t2, b2); arched(cx, w2, t2, b2);
      g.strokeStyle = '#f5f3ee'; g.lineWidth = 3; g.beginPath();
      g.moveTo(cx, t1); g.lineTo(cx, b1); g.moveTo(cx - w1 / 2, Y(92)); g.lineTo(cx + w1 / 2, Y(92));
      g.moveTo(cx, t2 + 2); g.lineTo(cx, b2); g.moveTo(cx - w2 / 2, Y(126)); g.lineTo(cx + w2 / 2, Y(126)); g.stroke();
    }
    g.fillStyle = '#e1ddd3'; g.fillRect(0, Y(158), n, Y(146) - Y(158));
  });
}
function ratShaftTex() {                                                        // trzon wieży (15–33 m): lizeny, okno, miejsce na zegar
  return canvasTex(256, (g, n) => {
    g.fillStyle = '#f5f3ee'; g.fillRect(0, 0, n, n);
    g.fillStyle = '#e8e5de'; g.fillRect(0, 0, 22, n); g.fillRect(n - 22, 0, 22, n);
    g.fillStyle = 'rgba(0,0,0,.07)'; g.fillRect(22, 0, 3, n); g.fillRect(n - 25, 0, 3, n);
    const gr = g.createLinearGradient(0, 150, 0, 225); gr.addColorStop(0, '#6d8295'); gr.addColorStop(1, '#2d3d4c');
    g.fillStyle = '#e6e3dc'; g.fillRect(n / 2 - 22, 140, 44, 92);
    g.fillStyle = gr; g.beginPath(); g.moveTo(n / 2 - 16, 226); g.lineTo(n / 2 - 16, 162); g.arc(n / 2, 162, 16, Math.PI, 0); g.lineTo(n / 2 + 16, 226); g.fill();
    g.fillStyle = '#e4e1d9'; g.fillRect(0, 118, n, 7);
  });
}
function railTex() {
  const t = canvasTex(128, (g, n) => {
    g.clearRect(0, 0, n, n); g.fillStyle = '#1d2226';
    g.fillRect(0, 0, n, 12); g.fillRect(0, n - 10, n, 10);
    for (let x = 4; x < n; x += 16) g.fillRect(x, 0, 5, n);
  });
  return t;
}

export function buildRatusz(R0, group, solid) {
  const plaster = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.88, emissive: 0xfff0d2, emissiveIntensity: 0 });
  const facadeM = plaster.clone(); facadeM.map = ratFacadeTex();
  const shaftM = plaster.clone(); shaftM.map = ratShaftTex();
  const roofM = new THREE.MeshStandardMaterial({ color: 0x8e9398, roughness: 0.6, metalness: 0.35 });
  const darkM = new THREE.MeshStandardMaterial({ color: 0x2c3234, roughness: 0.5, metalness: 0.35 });
  const goldM = new THREE.MeshStandardMaterial({ color: 0xd4ab4f, roughness: 0.3, metalness: 0.9 });
  const add = (geo, mat, parent = group) => { const m = new THREE.Mesh(geo, mat); parent.add(m); return m; };

  // układ lokalny frontu: x wzdłuż ryzalitu, +z na zewnątrz (w stronę rynku), 0 = lico ryzalitu
  const [ax, az, bx, bz] = R0.front, L = Math.hypot(bx - ax, bz - az), ux = (bx - ax) / L, uz = (bz - az) / L;
  const F = new THREE.Group(); F.position.set((ax + bx) / 2, 0, (az + bz) / 2); F.rotation.y = Math.atan2(-uz, ux); group.add(F);
  const toWorld = (x, z) => [F.position.x + x * ux - z * uz, F.position.z + x * uz + z * ux];
  const [tx0, tz0, TS] = R0.tower;
  const dx = tx0 - F.position.x, dz = tz0 - F.position.z;
  const tx = dx * ux + dz * uz, tz = dx * -uz + dz * ux;

  // korpus z dziedzińcem: elewacje z osiami okiennymi, gzyms wieńczący, płaski dach blaszany;
  // ściany ryzalitu zaczynają się dopiero nad podcieniami
  const outer = R0.body[0], n = outer.length / 2;
  const inRis = i => { const j = 2 * (i % n); return (outer[j] - F.position.x) * -uz + (outer[j + 1] - F.position.z) * ux > -ARC.depth - 0.5; };
  const ris = Array.from({ length: n }, (_, i) => inRis(i) && inRis(i + 1));
  const walls = newArr(false);
  R0.body.forEach((r, k) => pushWalls(walls, r, k > 0, -2, RAT.H - 8, (u, v) => [u / RAT.bay, (v - 2) / RAT.H], null, k ? null : ris));
  pushWalls(walls, outer, false, ARC.top, RAT.H - 8, (u, v) => [u / RAT.bay, (v + ARC.top) / RAT.H], null, ris.map(r => !r));
  add(arrGeo(walls), facadeM);
  const cor = newArr(false);
  pushWalls(cor, R0.cornice[0], false, RAT.H - 9, RAT.H, () => [0.5, 0.97]);
  R0.body.slice(1).forEach(r => pushWalls(cor, r, true, RAT.H - 9, RAT.H, () => [0.5, 0.97]));
  add(arrGeo(cor), facadeM);
  add(flatGeo([[R0.cornice[0], ...R0.body.slice(1)]], RAT.H, 1 / 40), roofM);
  const bb = ringBox(outer);                                                     // kolizja korpusu bez przestrzeni pod ryzalitem
  gridPut(solid, bb[0], bb[1], bb[2], bb[3], { p: [outer, arcadeHole(L).flatMap(([x, z]) => toWorld(x, z))], b: bb });
  const arcM = buildArcade(F, L, toWorld, solid, plaster);

  // ryzalit: lico nad podcieniami, pary pilastrów wielkiego porządku nad filarami, belkowanie i tympanon z herbem
  const frontM = plaster.clone(); frontM.map = ratFrontTex(L);
  add(new THREE.PlaneGeometry(L, RAT.H - 2 - ARC.top).translate(0, (RAT.H - 2 + ARC.top) / 2, 0.6), frontM, F);
  const [a0, , a2] = archX();
  for (const px of [-L / 2 + 7, a0 / 2, a2 / 2, L / 2 - 7]) for (const o of [-4.2, 4.2]) {
    const x = px + o;
    add(new THREE.BoxGeometry(5.5, 86, 2.4).translate(x, ARC.top + 43, 1.6), plaster, F);                            // pilaster
    add(new THREE.BoxGeometry(7.5, 4, 3.6).translate(x, 145, 2), plaster, F);                                        // głowica
    add(new THREE.BoxGeometry(7, 3, 3.2).translate(x, ARC.top + 1.5, 1.9), plaster, F);                               // baza
  }
  add(new THREE.BoxGeometry(L + 8, 10, 5).translate(0, RAT.H - 5, 1.2), plaster, F);                                 // belkowanie
  const gableW = L / 2 + 4, gableH = 44, gableD = 70;
  const tri = new THREE.Shape([new THREE.Vector2(-gableW, 0), new THREE.Vector2(gableW, 0), new THREE.Vector2(0, gableH)]);
  const gable = new THREE.ExtrudeGeometry(tri, { depth: gableD, bevelEnabled: false });
  gable.translate(0, RAT.H, -gableD + 3);
  add(gable, [plaster, roofM], F);                                                                                    // szczyt z dachem dwuspadowym
  const rake = (s) => add(new THREE.BoxGeometry(Math.hypot(gableW, gableH) + 4, 3.2, 5).rotateZ(s * Math.atan2(gableH, gableW)).translate(-s * gableW / 2, RAT.H + gableH / 2 + 1, 3.2), plaster, F);
  rake(1); rake(-1);                                                                                                  // gzyms naczółka
  const shield = new THREE.Shape(); shield.moveTo(-6, 7); shield.lineTo(6, 7); shield.lineTo(6, -1); shield.quadraticCurveTo(6, -7, 0, -9); shield.quadraticCurveTo(-6, -7, -6, -1); shield.closePath();
  add(new THREE.ExtrudeGeometry(shield, { depth: 1.2, bevelEnabled: false }).translate(0, RAT.H + 17, 3.3), goldM, F); // herb Kalisza w tympanonie
  add(new THREE.TorusGeometry(10, 0.9, 6, 24, Math.PI).rotateZ(Math.PI).translate(0, RAT.H + 17, 3.8), goldM, F);                    // wieniec

  // wieża: biały trzon z zegarami, galeria, ciemna ośmioboczna izba, hełm, latarnia i iglica z wiatrowskazem
  const W = new THREE.Group(); W.position.set(tx, 0, tz); F.add(W);
  const s = TS, top = 348;
  add(new THREE.BoxGeometry(s, top - RAT.H + 20, s).translate(0, (top + RAT.H - 20) / 2, 0), shaftM, W);
  add(new THREE.BoxGeometry(s + 3, 3, s + 3).translate(0, top - 78, 0), plaster, W);
  add(new THREE.BoxGeometry(s + 8, 7, s + 8).translate(0, top - 3.5, 0), plaster, W);                                // gzyms pod galerią
  const cm = new THREE.MeshStandardMaterial({ map: clockTex(), roughness: 0.4, metalness: 0.3 });
  for (let k = 0; k < 4; k++) {
    const c = add(new THREE.CircleGeometry(17, 40).translate(0, 0, 0), cm, W);
    const a = k * Math.PI / 2; c.position.set(Math.sin(a) * (s / 2 + 0.3), top - 40, Math.cos(a) * (s / 2 + 0.3)); c.rotation.y = a;
  }
  const Cr = new THREE.Group(); Cr.position.y = top - 330; W.add(Cr);
  const T0 = 330;
  add(new THREE.BoxGeometry(s + 14, 3, s + 14).translate(0, T0 + 1.5, 0), roofM, Cr);                               // posadzka galerii
  const railM = new THREE.MeshStandardMaterial({ map: railTex(), transparent: true, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.5, metalness: 0.5 });
  railM.map.repeat.set(6, 1);
  for (let k = 0; k < 4; k++) {
    const r = add(new THREE.PlaneGeometry(s + 14, 10).translate(0, T0 + 8, (s + 14) / 2), railM, Cr); r.rotation.y = k * Math.PI / 2;
  }
  const belfryT = archTex('#2b3133', '#101416', '#3a4245'); belfryT.repeat.set(8, 1);
  const belfryM = new THREE.MeshStandardMaterial({ map: belfryT, roughness: 0.55, metalness: 0.3 });
  const oct = (r0, r1, y0, y1, mat, open = false) => add(new THREE.CylinderGeometry(r1, r0, y1 - y0, 8, 1, open).rotateY(Math.PI / 8).translate(0, (y0 + y1) / 2, 0), mat, Cr);
  oct(s * 0.42, s * 0.42, T0 + 3, 405, belfryM);                                                                      // izba z otworami
  oct(s * 0.47, s * 0.47, 403, 409, darkM);                                                                            // gzyms
  const bell = [[s * 0.47, 409], [s * 0.45, 414], [s * 0.36, 424], [s * 0.22, 434], [s * 0.14, 441], [s * 0.13, 447]].map(([r, y]) => new THREE.Vector2(r, y));
  add(new THREE.LatheGeometry(bell, 8).rotateY(Math.PI / 8), darkM, Cr);                                              // hełm
  const lanT = archTex('#2b3133', '#0e1113', '#394144'); lanT.repeat.set(8, 1);
  oct(s * 0.13, s * 0.13, 447, 474, new THREE.MeshStandardMaterial({ map: lanT, roughness: 0.55, metalness: 0.3 }));  // latarnia
  oct(s * 0.17, s * 0.17, 474, 478, darkM);
  add(new THREE.SphereGeometry(s * 0.1, 12, 8).scale(1, 1.3, 1).translate(0, 485, 0), darkM, Cr);                     // cebulka
  add(new THREE.ConeGeometry(2.4, 62, 8).translate(0, 522, 0), darkM, Cr);                                            // iglica
  add(new THREE.SphereGeometry(2.8, 12, 8).translate(0, 540, 0), goldM, Cr);
  add(new THREE.BoxGeometry(14, 5, 0.5).translate(4, 560, 0), goldM, Cr);                                             // wiatrowskaz
  add(new THREE.CylinderGeometry(0.4, 0.4, 16, 6).translate(0, 558, 0), goldM, Cr);

  return [plaster, facadeM, frontM, shaftM, ...arcM];
}
