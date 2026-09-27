import * as THREE from 'three';
import { rng } from '../../core/random.js';
import { canvasTex } from '../../core/textures.js';
import { arrGeo, flatGeo, newArr } from '../mesh.js';
import { gridPut, ringArea2, ringBox } from '../spatial.js';
import { archTex, clockTex } from './tower-textures.js';

/* ---------- Bazylika kolegiacka Wniebowzięcia NMP (Sanktuarium św. Józefa): gotyckie prezbiterium z cegły, barokowy korpus i wieża ---------- */
// układ lokalny: x wzdłuż osi od wieży (−x, SSW) do prezbiterium (+x, NNE), z w poprzek; wysokości w dm
const KOL = { aisle: 95, eave: 150, ridge: 210, towerTop: 300, x0: -181, xc: 90, xe: 231, nz0: -65, nz1: 45, cz0: -100, cz1: 62, tx0: -243, tz0: -56, tz1: 38 };
function kolPlasterTex(h, win) {                                             // tynk z lizenami i oknem zamkniętym łukiem, oś 5 m
  return canvasTex(256, (g, n) => {
    const Y = y => n - y / h * n;
    g.fillStyle = '#f3efe6'; g.fillRect(0, 0, n, n);
    g.fillStyle = '#e7e2d6'; g.fillRect(0, 0, 18, n); g.fillRect(n - 18, 0, 18, n);
    g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(18, 0, 2, n); g.fillRect(n - 20, 0, 2, n);
    if (win) {
      const [y0, y1, w] = win, x0 = n / 2 - w / 2, t = Y(y1), b = Y(y0);
      g.fillStyle = '#e2dccf'; g.beginPath(); g.moveTo(x0 - 8, b + 6); g.lineTo(x0 - 8, t + w / 2); g.arc(n / 2, t + w / 2, w / 2 + 8, Math.PI, 0); g.lineTo(x0 + w + 8, b + 6); g.fill();
      const gr = g.createLinearGradient(0, t, 0, b); gr.addColorStop(0, '#5f7282'); gr.addColorStop(1, '#27323c');
      g.fillStyle = gr; g.beginPath(); g.moveTo(x0, b); g.lineTo(x0, t + w / 2); g.arc(n / 2, t + w / 2, w / 2, Math.PI, 0); g.lineTo(x0 + w, b); g.fill();
      g.strokeStyle = 'rgba(210,215,220,.35)'; g.lineWidth = 1.5;
      for (let y = t + w / 2; y < b; y += 11) { g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + w, y); g.stroke(); }
      g.beginPath(); g.moveTo(n / 2, t + 4); g.lineTo(n / 2, b); g.stroke();
    }
    g.fillStyle = '#e4dfd3'; g.fillRect(0, 0, n, Y(h - 6)); g.fillStyle = 'rgba(0,0,0,.1)'; g.fillRect(0, Y(h - 6), n, 3);
    g.fillStyle = '#d6d1c6'; g.fillRect(0, Y(6), n, n - Y(6));
  });
}
function kolBrickTex(h, win) {                                               // gotycka cegła z ostrołukowym lub prostokątnym oknem
  return canvasTex(512, (g, n) => {
    const R = rng(1360), Y = y => n - y / h * n, rowH = Math.max(2.4, n / h * 0.8);
    g.fillStyle = '#9c4c37'; g.fillRect(0, 0, n, n);
    for (let r = 0, y = 0; y < n; r++, y += rowH) for (let x = (r % 2) * 7 - 7; x < n; x += 14) {
      const k = 0.82 + R() * 0.3; g.fillStyle = `rgb(${Math.round(168 * k)},${Math.round(82 * k)},${Math.round(60 * k)})`; g.fillRect(x + 0.6, y + 0.5, 13, rowH - 0.9);
    }
    if (!win) return;
    const [y0, y1, w, lancet] = win, x0 = n / 2 - w / 2, t = Y(y1), b = Y(y0);
    g.fillStyle = '#d9d2c3'; g.beginPath();
    if (lancet) { g.moveTo(x0 - 10, b + 8); g.lineTo(x0 - 10, t + w * 0.7); g.quadraticCurveTo(x0 - 10, t - 14, n / 2, t - 22); g.quadraticCurveTo(x0 + w + 10, t - 14, x0 + w + 10, t + w * 0.7); g.lineTo(x0 + w + 10, b + 8); }
    else g.rect(x0 - 10, t - 10, w + 20, b - t + 18);
    g.fill();
    const gr = g.createLinearGradient(0, t, 0, b); gr.addColorStop(0, '#5a6c7b'); gr.addColorStop(1, '#232d36');
    g.fillStyle = gr; g.beginPath();
    if (lancet) { g.moveTo(x0, b); g.lineTo(x0, t + w * 0.7); g.quadraticCurveTo(x0, t, n / 2, t - 8); g.quadraticCurveTo(x0 + w, t, x0 + w, t + w * 0.7); g.lineTo(x0 + w, b); }
    else g.rect(x0, t, w, b - t);
    g.fill();
    g.strokeStyle = 'rgba(215,210,200,.55)'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(n / 2, t); g.lineTo(n / 2, b); g.moveTo(x0 + w / 4, t + w * 0.6); g.lineTo(x0 + w / 4, b); g.moveTo(x0 + w * 0.75, t + w * 0.6); g.lineTo(x0 + w * 0.75, b); g.stroke();
  });
}
// kondygnacje wieży: 1 – portal z obrazem św. Józefa, 2 – wysokie okno w bogatym obramieniu, 3 – okno z balkonem
function kolTowerTex(stage, front) {
  return canvasTex(256, (g, n) => {
    g.fillStyle = '#f5f2eb'; g.fillRect(0, 0, n, n);
    g.fillStyle = '#ebe6dc'; g.fillRect(0, 0, 26, n); g.fillRect(n - 26, 0, 26, n);
    g.fillStyle = 'rgba(0,0,0,.07)'; g.fillRect(26, 0, 2, n); g.fillRect(n - 28, 0, 2, n);
    const arch = (x0, t, w, b, fill) => { g.fillStyle = fill; g.beginPath(); g.moveTo(x0, b); g.lineTo(x0, t + w / 2); g.arc(x0 + w / 2, t + w / 2, w / 2, Math.PI, 0); g.lineTo(x0 + w, b); g.fill(); };
    const glass = (t, b) => { const gr = g.createLinearGradient(0, t, 0, b); gr.addColorStop(0, '#62788a'); gr.addColorStop(1, '#27323c'); return gr; };
    const c = n / 2;
    if (stage === 1 && front) {
      arch(c - 44, 118, 88, n, '#e3ddcf'); arch(c - 34, 132, 68, n, '#4a3325');     // portal z drewnianymi drzwiami
      g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 2; g.beginPath(); g.moveTo(c, 150); g.lineTo(c, n); g.stroke();
      g.fillStyle = '#e3ddcf'; g.beginPath(); g.moveTo(c - 54, 112); g.lineTo(c, 92); g.lineTo(c + 54, 112); g.closePath(); g.fill();
      g.fillStyle = '#c9a24a'; g.fillRect(c - 25, 30, 50, 58);                        // obraz św. Józefa w złotej ramie
      const gr = g.createLinearGradient(0, 34, 0, 84); gr.addColorStop(0, '#6d8bb0'); gr.addColorStop(1, '#8a5a3a');
      g.fillStyle = gr; g.fillRect(c - 20, 35, 40, 48);
      g.fillStyle = '#e9d9b0'; g.beginPath(); g.arc(c, 50, 7, 0, 7); g.fill();
      g.fillStyle = '#7b4a2f'; g.fillRect(c - 9, 58, 18, 24);
      g.fillStyle = '#e3ddcf'; g.fillRect(c - 30, 88, 60, 5);
    } else if (stage === 1) {
      arch(c - 22, 70, 44, 170, '#e3ddcf'); arch(c - 16, 78, 32, 164, glass(78, 164));
    } else if (stage === 2) {
      g.fillStyle = '#e3ddcf'; g.beginPath(); g.moveTo(c - 44, 26); g.quadraticCurveTo(c, 2, c + 44, 26); g.lineTo(c + 44, 34); g.lineTo(c - 44, 34); g.fill();   // naczółek
      arch(c - 36, 40, 72, 222, '#e3ddcf'); arch(c - 27, 50, 54, 214, glass(50, 214));
      g.strokeStyle = 'rgba(220,225,230,.4)'; g.lineWidth = 2; g.beginPath(); g.moveTo(c, 56); g.lineTo(c, 214); for (let y = 90; y < 214; y += 20) { g.moveTo(c - 27, y); g.lineTo(c + 27, y); } g.stroke();
      g.fillStyle = '#e3ddcf'; g.fillRect(c - 42, 222, 84, 8);
    } else {
      arch(c - 30, 96, 60, 226, '#e3ddcf'); arch(c - 22, 104, 44, 222, glass(104, 222));
      g.fillStyle = '#e8e3d8'; g.fillRect(c - 42, 196, 84, 8);                          // balkon
      g.fillStyle = '#2a2f33'; g.fillRect(c - 40, 172, 80, 3); for (let x = c - 40; x <= c + 40; x += 8) g.fillRect(x, 172, 2, 24);
    }
  });
}

export function buildKolegiata(K, group, solid) {
  const [ux, uz] = K.u, [cx, cz] = K.c;
  const G = new THREE.Group(); G.position.set(cx, 0, cz); G.rotation.y = Math.atan2(-uz, ux); group.add(G);
  const toLocal = (x, z) => [(x - cx) * ux + (z - cz) * uz, (x - cx) * -uz + (z - cz) * ux];
  const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.85, ...o });
  const plasterM = std({ color: 0xf3efe6 }), stoneM = std({ color: 0xe6e0d3 }), roofM = std({ color: 0x5c6166, roughness: 0.55, metalness: 0.35 });
  const copperM = std({ color: 0x69a58c, roughness: 0.5, metalness: 0.3 }), goldM = std({ color: 0xd4ab4f, roughness: 0.3, metalness: 0.9 });
  const add = (geo, mat, parent = G) => { const m = new THREE.Mesh(geo, mat); parent.add(m); return m; };
  const box = (x0, x1, y0, y1, z0, z1, mat, parent = G) => add(new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0).translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2), mat, parent);

  // mury z obrysu OSM: nawy boczne w tynku, prezbiterium i zakrystia w cegle (część wschodnia)
  const aisleM = std({ map: kolPlasterTex(KOL.aisle, [22, 80, 76]) }), brickLowM = std({ map: kolBrickTex(KOL.aisle, [28, 62, 60, false]) });
  const aw = newArr(false), bw = newArr(false), ring = K.ring;
  const f = ringArea2(ring) > 0 ? 1 : -1;
  let acc = 0;
  for (let i = 0; i < ring.length; i += 2) {
    const j = (i + 2) % ring.length, x0 = ring[i], z0 = ring[i + 1], x1 = ring[j], z1 = ring[j + 1];
    const dx = x1 - x0, dz = z1 - z0, len = Math.hypot(dx, dz); if (len < 0.01) continue;
    const [mu] = toLocal((x0 + x1) / 2, (z0 + z1) / 2);
    const A = mu > 68 ? bw : aw, nx = f * dz / len, nz = -f * dx / len, y0 = -2, y1 = KOL.aisle, u0 = acc / 50, u1 = (acc + len) / 50;
    acc += len;
    if (mu < KOL.x0 + 3) continue;
    const a = [x0, y0, z0, u0, 0], b = [x1, y0, z1, u1, 0], c = [x1, y1, z1, u1, 1], d = [x0, y1, z0, u0, 1];
    for (const v of f > 0 ? [a, c, b, a, d, c] : [a, b, c, a, c, d]) { A.pos.push(v[0], v[1], v[2]); A.nor.push(nx, 0, nz); A.uv.push(v[3], v[4]); }
  }
  add(arrGeo(aw), aisleM, group); add(arrGeo(bw), brickLowM, group);             // obrys jest w układzie świata
  const bb = ringBox(ring); gridPut(solid, bb[0], bb[1], bb[2], bb[3], { p: [ring], b: bb });
  add(flatGeo([[ring]], KOL.aisle, 1 / 40), roofM, group);                              // przykrycie niskich części (niewidoczne z ulicy)

  // nawa główna: ściany z oknami w górnej strefie, dach dwuspadowy; dachy pulpitowe naw bocznych
  const clereM = std({ map: kolPlasterTex(KOL.eave - KOL.aisle, [12, 44, 56]) });
  const naveLen = KOL.xc - KOL.x0;
  const nave = new THREE.BoxGeometry(naveLen, KOL.eave - KOL.aisle + 4, KOL.nz1 - KOL.nz0);
  const uvN = nave.attributes.uv;
  for (let i = 0; i < uvN.count; i++) { const face = Math.floor(i / 4); if (face === 4 || face === 5) uvN.setX(i, uvN.getX(i) * naveLen / 50); }
  add(nave.translate((KOL.x0 + KOL.xc) / 2, (KOL.eave + KOL.aisle - 4) / 2, (KOL.nz0 + KOL.nz1) / 2), clereM);
  const gable = (x0, x1, z0, z1, y0, y1, mat, endMat) => {                      // dach dwuspadowy wzdłuż osi x (kształt w płaszczyźnie (−z, y))
    const zm = (z0 + z1) / 2, sh = new THREE.Shape([new THREE.Vector2(-(z0 - 4), 0), new THREE.Vector2(-(z1 + 4), 0), new THREE.Vector2(-zm, y1 - y0)]);
    const g = new THREE.ExtrudeGeometry(sh, { depth: x1 - x0, bevelEnabled: false }).rotateY(Math.PI / 2).translate(x0, y0, 0);
    return add(g, [endMat || mat, mat]);
  };
  gable(KOL.x0, KOL.xc + 2, KOL.nz0, KOL.nz1, KOL.eave, KOL.ridge, roofM, plasterM);
  const shed = [], xa = KOL.x0 + 4, xb = KOL.xc - 2, yt = 120;
  for (const [zo, zi] of [[-126, KOL.nz0], [126, KOL.nz1]]) shed.push(xa, KOL.aisle, zo, xb, KOL.aisle, zo, xb, yt, zi, xa, KOL.aisle, zo, xb, yt, zi, xa, yt, zi);
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(shed, 3)); sg.computeVertexNormals();
  add(sg, std({ color: 0x5c6166, roughness: 0.55, metalness: 0.35, side: THREE.DoubleSide }));

  // prezbiterium: cegła, ostrołukowe okna, szkarpy, zielony dach miedziany i ceglany szczyt
  const chM = std({ map: kolBrickTex(KOL.eave, [30, 118, 64, true]) });
  const chLen = KOL.xe - KOL.xc, ch = new THREE.BoxGeometry(chLen, KOL.eave + 2, KOL.cz1 - KOL.cz0), uvC = ch.attributes.uv;
  for (let i = 0; i < uvC.count; i++) { const face = Math.floor(i / 4); if (face === 4 || face === 5) uvC.setX(i, uvC.getX(i) * chLen / 50); if (face < 2) uvC.setX(i, uvC.getX(i) * (KOL.cz1 - KOL.cz0) / 50); }
  add(ch.translate((KOL.xc + KOL.xe) / 2, KOL.eave / 2 - 1, (KOL.cz0 + KOL.cz1) / 2), chM);
  const brickPlain = std({ map: kolBrickTex(60, null) });
  gable(KOL.xc, KOL.xe + 3, KOL.cz0, KOL.cz1, KOL.eave, KOL.ridge + 6, copperM, brickPlain);
  for (const [x, zs] of [[KOL.xc + 55, [-1, 1]], [KOL.xc + 108, [-1, 1]], [KOL.xe, [0]]]) for (const s of zs) {   // szkarpy z kamiennymi daszkami
    const bx = s === 0 ? KOL.xe + 8 : x, bz = s === 0 ? (KOL.cz0 + KOL.cz1) / 2 - 45 : (s < 0 ? KOL.cz0 - 8 : KOL.cz1 + 8);
    for (const zz of s === 0 ? [bz, bz + 90] : [bz]) {
      box(bx - 7, bx + 7, 0, 112, zz - 8, zz + 8, brickPlain);
      add(new THREE.BoxGeometry(15, 4, 17).rotateZ(s === 0 ? 0.5 : 0).translate(bx, 115, zz), stoneM);
    }
  }
  // sygnaturka na kalenicy między nawą a prezbiterium
  const T = new THREE.Group(); T.position.set(KOL.xc + 6, 0, (KOL.nz0 + KOL.nz1) / 2); G.add(T);
  const darkM = std({ color: 0x2f3437, roughness: 0.5, metalness: 0.35 });
  const sigT = archTex('#343a3d', '#101315', '#454c50'); sigT.repeat.set(8, 1);
  box(-9, 9, KOL.ridge - 22, KOL.ridge + 10, -9, 9, darkM, T);
  add(new THREE.CylinderGeometry(8, 8, 26, 8).rotateY(Math.PI / 8).translate(0, KOL.ridge + 23, 0), std({ map: sigT, roughness: 0.5 }), T);
  add(new THREE.LatheGeometry([[10, 0], [9, 5], [6, 11], [3, 16], [2.4, 20]].map(([r, y]) => new THREE.Vector2(r, KOL.ridge + 36 + y)), 8), darkM, T);
  add(new THREE.ConeGeometry(1.6, 28, 8).translate(0, KOL.ridge + 70, 0), darkM, T);
  box(-0.5, 0.5, KOL.ridge + 82, KOL.ridge + 96, -0.5, 0.5, goldM, T); box(-0.5, 0.5, KOL.ridge + 90, KOL.ridge + 92, -4, 4, goldM, T);

  // fasada: barokowe spływy wolutowe po bokach wieży i wazony na narożach
  for (const s of [-1, 1]) {
    const te = s < 0 ? KOL.tz0 : KOL.tz1, oe = s < 0 ? -122 : 122;
    const sh = new THREE.Shape();
    sh.moveTo(-te, KOL.aisle); sh.lineTo(-oe, KOL.aisle); sh.lineTo(-oe, KOL.aisle + 9);
    sh.bezierCurveTo(-(oe + te) / 2 - s * 10, KOL.aisle + 8, -(te + s * 22), KOL.eave + 10, -te, KOL.eave + 6); sh.closePath();
    add(new THREE.ExtrudeGeometry(sh, { depth: 8, bevelEnabled: false }).rotateY(Math.PI / 2).translate(KOL.x0 - 5, 0, 0), plasterM);
    add(new THREE.BoxGeometry(12, 3, 12).translate(KOL.x0 - 1, KOL.aisle + 1.5, oe - s * 6), stoneM);
    add(new THREE.LatheGeometry([[0, 0], [3.5, 0], [2, 2], [4.5, 6], [3, 10], [1.4, 11], [2, 13], [0, 14]].map(([r, y]) => new THREE.Vector2(r, y)), 12).translate(KOL.x0 - 1, KOL.aisle + 3, oe - s * 6), stoneM);
  }

  // wieża: trzy kondygnacje z parami pilastrów i gzymsami, zegary, zielony hełm z latarnią, cebulą i iglicą
  const W = new THREE.Group(); W.position.set((KOL.tx0 + KOL.x0) / 2, 0, (KOL.tz0 + KOL.tz1) / 2); G.add(W);
  const TW = KOL.x0 - KOL.tx0 + 4, TD = KOL.tz1 - KOL.tz0;                     // głębokość (wzdłuż osi) i szerokość wieży
  const stages = [[0, 138, 1, 0, 0], [138, 216, 2, 3, 8], [216, KOL.towerTop, 3, 6, 14]];
  for (const [y0, y1, st, ix, iz] of stages) {
    const fm = std({ map: kolTowerTex(st, true) }), sm = std({ map: kolTowerTex(st, false) });
    const w = TW - ix * 2, d = TD - iz * 2;
    add(new THREE.BoxGeometry(w, y1 - y0, d).translate(0, (y0 + y1) / 2, 0), [plasterM, fm, plasterM, plasterM, sm, sm], W);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {                       // narożne pilastry
      add(new THREE.BoxGeometry(7, y1 - y0 - 6, 7).translate(sx * (w / 2 + 1.5) - sx * 3, (y0 + y1) / 2 - 3, sz * (d / 2 + 1.5) - sz * 3), stoneM, W);
    }
    add(new THREE.BoxGeometry(w + 9, 5, d + 9).translate(0, y1 - 2.5, 0), stoneM, W);             // gzyms
    add(new THREE.BoxGeometry(w + 5, 3, d + 5).translate(0, y1 - 6.5, 0), stoneM, W);
  }
  const cm = std({ map: clockTex(), roughness: 0.4, metalness: 0.3 });
  const tw3 = TW - 12, td3 = TD - 28;
  for (let k = 0; k < 4; k++) {
    const a = k * Math.PI / 2, off = (k % 2 ? td3 : tw3) / 2 + 0.4;
    const c = add(new THREE.CircleGeometry(11, 40), cm, W);
    c.position.set(Math.sin(a + Math.PI / 2) * off, KOL.towerTop - 16, Math.cos(a + Math.PI / 2) * off);
    c.rotation.y = a + Math.PI / 2;
  }
  // hełm: czworoboczna kopuła, latarnia, cebula, druga latarenka, iglica z kulą i krzyżem
  const H = new THREE.Group(); H.position.y = KOL.towerTop; W.add(H);
  const r0 = tw3 / 2 * Math.SQRT2 + 2;
  const prof = (pts, seg) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg);
  add(prof([[r0, 0], [r0 * 0.98, 5], [r0 * 0.88, 13], [r0 * 0.66, 23], [r0 * 0.46, 32], [r0 * 0.38, 38], [r0 * 0.36, 44]], 4).rotateY(Math.PI / 4).scale(1, 1, td3 / tw3), copperM, H);
  const lanT = archTex('#69a58c', '#1d2a27', '#7fb9a0'); lanT.repeat.set(8, 1);
  add(new THREE.CylinderGeometry(15, 15, 34, 8, 1, false).rotateY(Math.PI / 8).translate(0, 61, 0), std({ map: lanT, roughness: 0.5, metalness: 0.3 }), H);
  add(new THREE.CylinderGeometry(18, 18, 4, 8).rotateY(Math.PI / 8).translate(0, 80, 0), copperM, H);
  add(prof([[18, 82], [17, 86], [12, 94], [9, 100], [6.5, 104], [5.5, 108]], 8).rotateY(Math.PI / 8), copperM, H);
  add(new THREE.CylinderGeometry(5.5, 5.5, 14, 8).rotateY(Math.PI / 8).translate(0, 115, 0), std({ map: lanT, roughness: 0.5, metalness: 0.3 }), H);
  add(prof([[7, 122], [6.5, 126], [4, 131], [2.2, 136]], 8), copperM, H);
  add(new THREE.ConeGeometry(2, 34, 8).translate(0, 153, 0), copperM, H);
  add(new THREE.SphereGeometry(3.2, 14, 10).translate(0, 158, 0), goldM, H);
  box(-0.7, 0.7, 170, 196, -0.7, 0.7, goldM, H); box(-0.7, 0.7, 185, 188, -6, 6, goldM, H);   // krzyż

  return [plasterM, aisleM, clereM];
}
