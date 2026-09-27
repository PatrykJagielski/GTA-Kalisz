import * as THREE from 'three';
import { rng } from '../../core/random.js';
import { canvasTex } from '../../core/textures.js';
import { arrGeo, flatGeo, newArr } from '../mesh.js';
import { gridPut, ringArea2, ringBox } from '../spatial.js';

/* ---------- Kościół garnizonowy św. Wojciecha i św. Stanisława (dawny jezuicki, ul. Kolegialna): manierystyczna fasada z terakotowymi polami ---------- */
// układ lokalny: +x = kierunek fasady (lico przy x ≈ 196 dm), z w poprzek; wysokości w dm
const GAR = { face: 196, wall: 130, chWall: 110, ent: 14, ridge: 232, chRidge: 192, xch: -130, z0: -128, z1: 114, zc: 3, W: 242 };
const TERRA = '#d0704f', WHITE = '#efe9dd';
function garFrontTex() {                                                       // dolna kondygnacja fasady: 24,2 m × 13 m
  const w = 1024, h = Math.round(w * GAR.wall / GAR.W);
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  const X = z => (z + GAR.W / 2) / GAR.W * w, Y = y => h - y / GAR.wall * h, S = w / GAR.W;
  g.fillStyle = TERRA; g.fillRect(0, 0, w, h);
  g.fillStyle = WHITE; g.fillRect(0, Y(7), w, h - Y(7));                         // cokół
  const archWin = (zc, y0, y1, ww, glass) => {
    const x0 = X(zc) - ww * S / 2, t = Y(y1), b = Y(y0), r = ww * S / 2;
    g.fillStyle = WHITE; g.beginPath(); g.moveTo(x0 - 6, b + 5); g.lineTo(x0 - 6, t + r); g.arc(x0 + r, t + r, r + 6, Math.PI, 0); g.lineTo(x0 + ww * S + 6, b + 5); g.fill();
    if (glass) { const gr = g.createLinearGradient(0, t, 0, b); gr.addColorStop(0, '#5b6f80'); gr.addColorStop(1, '#222c35'); g.fillStyle = gr; }
    else g.fillStyle = '#c4613f';
    g.beginPath(); g.moveTo(x0, b); g.lineTo(x0, t + r); g.arc(x0 + r, t + r, r, Math.PI, 0); g.lineTo(x0 + ww * S, b); g.fill();
    if (glass) {                                                                 // szprosy w romby
      g.save(); g.clip(); g.strokeStyle = 'rgba(200,205,210,.35)'; g.lineWidth = 1.5;
      for (let k = -h; k < w; k += 9) { g.beginPath(); g.moveTo(k, t); g.lineTo(k + (b - t), b); g.moveTo(k + (b - t), t); g.lineTo(k, b); g.stroke(); }
      g.restore();
    }
  };
  const diamond = (zc, yc) => {
    const x = X(zc), y = Y(yc); g.strokeStyle = WHITE; g.lineWidth = 3; g.strokeRect(x - 22, y - 16, 44, 32);
    g.beginPath(); g.moveTo(x, y - 14); g.lineTo(x + 20, y); g.lineTo(x, y + 14); g.lineTo(x - 20, y); g.closePath(); g.stroke();
  };
  for (const zc of [-82, -42, 42, 82]) { archWin(zc, 14, 58, 17, true); archWin(zc, 82, 118, 17, true); diamond(zc, 70); }
  for (const zc of [-111, 111]) archWin(zc, 20, 52, 9, false);                    // ślepe nisze przy narożach
  const rx = X(0), ry = Y(96);                                              // rozeta nad portalem
  g.fillStyle = WHITE; g.beginPath(); g.arc(rx, ry, 30, 0, 7); g.fill();
  g.fillStyle = '#2d3943'; g.beginPath(); g.arc(rx, ry, 23, 0, 7); g.fill();
  g.strokeStyle = 'rgba(210,215,220,.6)'; g.lineWidth = 2;
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; g.beginPath(); g.moveTo(rx, ry); g.lineTo(rx + Math.cos(a) * 23, ry + Math.sin(a) * 23); g.stroke(); }
  g.beginPath(); g.arc(rx, ry, 11, 0, 7); g.stroke();
  // portal: kamienne obramienie, łuk, drzwi
  const px = X(0), pw = 28 * S;
  g.fillStyle = '#ddd6c6'; g.fillRect(px - pw / 2 - 10, Y(58), pw + 20, Y(0) - Y(58));
  g.fillStyle = '#3a342d'; g.beginPath(); g.moveTo(px - pw / 2 + 12, Y(0)); g.lineTo(px - pw / 2 + 12, Y(36)); g.arc(px, Y(36), pw / 2 - 12, Math.PI, 0); g.lineTo(px + pw / 2 - 12, Y(0)); g.fill();
  g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(px, Y(0)); g.lineTo(px, Y(44)); g.stroke();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}
function garGableTex() {                                                       // szczyt: pilastry, okno, okulus, ślimacznice
  return canvasTex(512, (g, n) => {
    const X = z => (z + 100) / 200 * n, Y = y => n - y / 120 * n;             // kształt: z ∈ [−100, 100], y ∈ [0, 120]
    g.fillStyle = TERRA; g.fillRect(0, 0, n, n);
    g.fillStyle = WHITE;
    for (const z of [-78, -45, 45, 78]) g.fillRect(X(z) - 7, Y(56), 14, Y(0) - Y(56));      // pilastry I kondygnacji szczytu
    for (const z of [-45, -22, 22, 45]) g.fillRect(X(z) - 6, Y(96), 12, Y(58) - Y(96));     // pilastry II kondygnacji
    for (const z of [-62, 62]) { const x = X(z); g.fillStyle = WHITE; g.beginPath(); g.arc(x, Y(20), 16, 0, 7); g.fill(); g.fillStyle = TERRA; g.beginPath(); g.arc(x + 3, Y(21), 9, 0, 7); g.fill(); }   // ślimacznice
    const x0 = X(-12), x1 = X(12), t = Y(46), b = Y(8), r = (x1 - x0) / 2;         // wysokie okno w osi
    g.fillStyle = WHITE; g.beginPath(); g.moveTo(x0 - 6, b + 4); g.lineTo(x0 - 6, t + r); g.arc(x0 + r, t + r, r + 6, Math.PI, 0); g.lineTo(x1 + 6, b + 4); g.fill();
    const gr = g.createLinearGradient(0, t, 0, b); gr.addColorStop(0, '#5b6f80'); gr.addColorStop(1, '#222c35');
    g.fillStyle = gr; g.beginPath(); g.moveTo(x0, b); g.lineTo(x0, t + r); g.arc(x0 + r, t + r, r, Math.PI, 0); g.lineTo(x1, b); g.fill();
    for (const z of [-33, 33]) { g.fillStyle = WHITE; g.beginPath(); const x = X(z), y0 = Y(40), y1 = Y(10), rr = 16; g.moveTo(x - rr, y1); g.lineTo(x - rr, y0 + rr); g.arc(x, y0 + rr, rr, Math.PI, 0); g.lineTo(x + rr, y1); g.fill(); g.fillStyle = '#c4613f'; g.beginPath(); g.moveTo(x - rr + 5, y1 - 4); g.lineTo(x - rr + 5, y0 + rr); g.arc(x, y0 + rr, rr - 5, Math.PI, 0); g.lineTo(x + rr - 5, y1 - 4); g.fill(); }
    g.fillStyle = '#2d3943'; g.beginPath(); g.arc(X(0), Y(78), 12, 0, 7); g.fill();    // okulus
    g.strokeStyle = WHITE; g.lineWidth = 5; g.beginPath(); g.arc(X(0), Y(78), 14, 0, 7); g.stroke();
    g.fillStyle = WHITE; g.fillRect(X(-8), Y(92), X(8) - X(-8), 10);
    g.fillStyle = WHITE; g.beginPath(); g.arc(X(0), Y(110), 7, 0, 7); g.fill();      // medalion w zwieńczeniu
  });
}
function garSideTex(h) {                                                       // ściany boczne: terakota, białe lizeny, okna zamknięte łukiem
  return canvasTex(256, (g, n) => {
    const Y = y => n - y / h * n;
    g.fillStyle = TERRA; g.fillRect(0, 0, n, n);
    g.fillStyle = WHITE; g.fillRect(0, 0, 20, n); g.fillRect(n - 20, 0, 20, n); g.fillRect(0, Y(7), n, n - Y(7)); g.fillRect(0, 0, n, Y(h - 8));
    const w = 64, x0 = n / 2 - w / 2, t = Y(h - 26), b = Y(h * 0.34), r = w / 2;
    g.beginPath(); g.moveTo(x0 - 7, b + 5); g.lineTo(x0 - 7, t + r); g.arc(n / 2, t + r, r + 7, Math.PI, 0); g.lineTo(x0 + w + 7, b + 5); g.fill();
    const gr = g.createLinearGradient(0, t, 0, b); gr.addColorStop(0, '#5b6f80'); gr.addColorStop(1, '#222c35');
    g.fillStyle = gr; g.beginPath(); g.moveTo(x0, b); g.lineTo(x0, t + r); g.arc(n / 2, t + r, r, Math.PI, 0); g.lineTo(x0 + w, b); g.fill();
  });
}
function tileTex() {                                                           // czerwona dachówka
  return canvasTex(128, (g, n) => {
    const R = rng(1592); g.fillStyle = '#9d4a33'; g.fillRect(0, 0, n, n);
    for (let y = 0, r = 0; y < n; y += 8, r++) for (let x = (r % 2) * 6 - 6; x < n; x += 12) {
      const k = 0.85 + R() * 0.3; g.fillStyle = `rgb(${Math.round(176 * k)},${Math.round(86 * k)},${Math.round(60 * k)})`;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + 11, y); g.lineTo(x + 11, y + 6); g.quadraticCurveTo(x + 5.5, y + 9, x, y + 6); g.fill();
    }
  });
}

export function buildGarnizon(K, group, solid) {
  const [ux, uz] = K.u, [cx, cz] = K.c, ring = K.ring;
  const G = new THREE.Group(); G.position.set(cx, 0, cz); G.rotation.y = Math.atan2(-uz, ux); group.add(G);
  const toU = (x, z) => (x - cx) * ux + (z - cz) * uz;
  const std = o => new THREE.MeshStandardMaterial({ roughness: 0.85, ...o });
  const whiteM = std({ color: 0xefe9dd }), stoneM = std({ color: 0xdcd5c5 }), tileT = tileTex(), goldM = std({ color: 0xd4ab4f, roughness: 0.3, metalness: 0.9 });
  const add = (geo, mat, parent = G) => { const m = new THREE.Mesh(geo, mat); parent.add(m); return m; };
  const box = (x0, x1, y0, y1, z0, z1, mat, parent = G) => add(new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0).translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2), mat, parent);

  // mury z obrysu OSM (świat): nawa do gzymsu 13 m, prezbiterium i zakrystia niżej; lico fasady pomijamy
  const sideM = std({ map: garSideTex(GAR.wall) }), sideChM = std({ map: garSideTex(GAR.chWall) });
  const hi = newArr(false), lo = newArr(false), f = ringArea2(ring) > 0 ? 1 : -1;
  let acc = 0;
  for (let i = 0; i < ring.length; i += 2) {
    const j = (i + 2) % ring.length, x0 = ring[i], z0 = ring[i + 1], x1 = ring[j], z1 = ring[j + 1];
    const dx = x1 - x0, dz = z1 - z0, len = Math.hypot(dx, dz); if (len < 0.01) continue;
    const mu = toU((x0 + x1) / 2, (z0 + z1) / 2), u0 = acc / 50, u1 = (acc + len) / 50; acc += len;
    if (mu > GAR.face - 12) continue;
    const ch = mu < GAR.xch + 2, A = ch ? lo : hi, y1 = ch ? GAR.chWall : GAR.wall, nx = f * dz / len, nz = -f * dx / len;
    const a = [x0, -2, z0, u0, 0], b = [x1, -2, z1, u1, 0], c = [x1, y1, z1, u1, 1], d = [x0, y1, z0, u0, 1];
    for (const v of f > 0 ? [a, c, b, a, d, c] : [a, b, c, a, c, d]) { A.pos.push(v[0], v[1], v[2]); A.nor.push(nx, 0, nz); A.uv.push(v[3], v[4]); }
  }
  add(arrGeo(hi), sideM, group); add(arrGeo(lo), sideChM, group);
  add(flatGeo([[ring]], GAR.chWall - 1, 1 / 40), std({ color: 0x8c4a36 }), group);
  const bb = ringBox(ring); gridPut(solid, bb[0], bb[1], bb[2], bb[3], { p: [ring], b: bb });

  // dachy: nawa (dwuspadowy, dachówka), prezbiterium niższe z wielobocznym zamknięciem
  const roof = (x0, x1, z0, z1, y0, y1) => {
    const zm = (z0 + z1) / 2, sh = new THREE.Shape([new THREE.Vector2(-(z0 - 5), 0), new THREE.Vector2(-(z1 + 5), 0), new THREE.Vector2(-zm, y1 - y0)]);
    const tm = std({ map: tileT.clone(), roughness: 0.75 }); tm.map.needsUpdate = true; tm.map.repeat.set(1 / 25, 1 / 25);
    return add(new THREE.ExtrudeGeometry(sh, { depth: x1 - x0, bevelEnabled: false }).rotateY(Math.PI / 2).translate(x0, y0, 0), [std({ map: garSideTex(y1 - y0) }), tm]);
  };
  roof(GAR.xch, GAR.face - 4, GAR.z0, GAR.z1, GAR.wall, GAR.ridge);
  roof(-188, GAR.xch + 2, -68, 44, GAR.chWall, GAR.chRidge);
  const apse = new THREE.ConeGeometry(55, GAR.chRidge - GAR.chWall, 6, 1, true, 0, Math.PI).rotateY(Math.PI).translate(-188, (GAR.chWall + GAR.chRidge) / 2, -7);   // połowa stożka za prezbiterium
  const am = std({ map: tileT, roughness: 0.75, side: THREE.DoubleSide }); am.map.repeat.set(4, 2);
  add(apse, am);
  // sygnaturka na kalenicy
  const T = new THREE.Group(); T.position.set(110, GAR.ridge - 14, (GAR.z0 + GAR.z1) / 2); G.add(T);
  const darkM = std({ color: 0x3a3f42, roughness: 0.5, metalness: 0.35 });
  box(-6, 6, 0, 26, -6, 6, whiteM, T);
  add(new THREE.CylinderGeometry(5.5, 5.5, 14, 8).rotateY(Math.PI / 8).translate(0, 33, 0), darkM, T);
  add(new THREE.LatheGeometry([[7, 0], [6, 4], [3.5, 9], [1.5, 13]].map(([r, y]) => new THREE.Vector2(r, 40 + y)), 8), darkM, T);
  add(new THREE.ConeGeometry(1, 14, 6).translate(0, 60, 0), darkM, T);

  // fasada: dolna kondygnacja (tekstura + pilastry, cokół, belkowanie), portal, szczyt z wolutami, obeliski, krzyż
  const F = new THREE.Group(); F.position.set(GAR.face, 0, GAR.zc); G.add(F);
  add(new THREE.PlaneGeometry(GAR.W, GAR.wall).rotateY(Math.PI / 2).translate(0, GAR.wall / 2, 0), std({ map: garFrontTex() }), F);
  box(-4, 1.5, 0, 7, -GAR.W / 2 - 2, GAR.W / 2 + 2, whiteM, F);
  for (const z of [-119, -102, -62, -22, 22, 62, 102, 119]) box(0, 2.6, 7, GAR.wall, z - 6, z + 6, whiteM, F);              // pilastry
  for (const z of [-119, -102, -62, -22, 22, 62, 102, 119]) box(-0.5, 4, GAR.wall - 5, GAR.wall, z - 8, z + 8, stoneM, F);   // głowice
  const friezeT = canvasTex(256, (g, n) => {
    g.fillStyle = '#ddd6c8'; g.fillRect(0, 0, n, n); g.fillStyle = '#b9b1a1';
    for (let x = 6; x < n; x += 32) { g.fillRect(x, n * 0.3, 20, n * 0.4); g.fillStyle = '#cfc7b8'; g.fillRect(x + 22, n * 0.42, 8, n * 0.16); g.fillStyle = '#b9b1a1'; }
  });
  friezeT.repeat.set(14, 1);
  add(new THREE.BoxGeometry(6, GAR.ent, GAR.W + 10).translate(1, GAR.wall + GAR.ent / 2, 0), [std({ map: friezeT }), whiteM, whiteM, whiteM, whiteM, whiteM], F);
  box(-2, 7, GAR.wall + GAR.ent, GAR.wall + GAR.ent + 3, -GAR.W / 2 - 8, GAR.W / 2 + 8, whiteM, F);                       // gzyms
  // portal: kolumny, belkowanie, trójkątny naczółek z płaskorzeźbą
  for (const z of [-17, 17]) add(new THREE.CylinderGeometry(1.8, 2.1, 42, 12).translate(3.5, 6 + 21, z), stoneM, F);
  box(1.5, 6, 48, 56, -22, 22, stoneM, F);
  const ped = new THREE.Shape([new THREE.Vector2(-24, 0), new THREE.Vector2(24, 0), new THREE.Vector2(0, 13)]);
  add(new THREE.ExtrudeGeometry(ped, { depth: 4, bevelEnabled: false }).rotateY(Math.PI / 2).translate(1.5, 56, 0), stoneM, F);
  box(1, 4, 62, 72, -6, 6, stoneM, F);                                                                                    // kartusz z herbem
  // szczyt (kształt w płaszczyźnie (−z, y) od gzymsu w górę)
  const y0 = GAR.wall + GAR.ent + 3, sh = new THREE.Shape();
  sh.moveTo(-100, 0); sh.lineTo(100, 0); sh.quadraticCurveTo(80, 6, 78, 52); sh.lineTo(78, 58); sh.quadraticCurveTo(50, 62, 45, 94);
  sh.lineTo(45, 98); sh.lineTo(24, 98); sh.lineTo(0, 118); sh.lineTo(-24, 98); sh.lineTo(-45, 98); sh.lineTo(-45, 94);
  sh.quadraticCurveTo(-50, 62, -78, 58); sh.lineTo(-78, 52); sh.quadraticCurveTo(-80, 6, -100, 0);
  const gT = garGableTex(); gT.repeat.set(1 / 200, 1 / 120); gT.offset.set(0.5, 0);
  const gable = new THREE.ExtrudeGeometry(sh, { depth: 8, bevelEnabled: false, curveSegments: 16 }).rotateY(Math.PI / 2).translate(-6, y0, 0);
  add(gable, [std({ map: gT }), whiteM], F);
  box(-7, 5, y0 + 54, y0 + 58, -80, 80, whiteM, F); box(-7, 5, y0 + 94, y0 + 98, -47, 47, whiteM, F);                      // gzymsy szczytu
  const obelisk = (z, y, s) => { box(-5, 3, y, y + 3, z - s, z + s, stoneM, F); add(new THREE.ConeGeometry(s * 0.9, s * 4.5, 4).rotateY(Math.PI / 4).translate(-1, y + 3 + s * 2.25, z), whiteM, F); };
  for (const sgn of [-1, 1]) { obelisk(sgn * 100, y0, 4); obelisk(sgn * 80, y0 + 58, 3.5); obelisk(sgn * 47, y0 + 98, 3); }
  box(-2.5, 2.5, y0 + 118, y0 + 124, -2.5, 2.5, stoneM, F);
  box(-0.6, 0.6, y0 + 124, y0 + 146, -0.6, 0.6, goldM, F); box(-0.6, 0.6, y0 + 137, y0 + 140, -6, 6, goldM, F);          // krzyż

  return [];
}
