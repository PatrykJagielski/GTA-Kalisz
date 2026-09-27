/* ================= Kalisz: miasto z danych OpenStreetMap i zabytki ================= */
function rng(seed) {
  return () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const M4 = (x, y, z, ry = 0, sx = 1, sy = 1, sz = 1) =>
  new THREE.Matrix4().compose(V(x, y, z), new THREE.Quaternion().setFromAxisAngle(V(0, 1, 0), ry), V(sx, sy, sz));
function instanced(geom, mat, list, colors) {
  const m = new THREE.InstancedMesh(geom, mat, Math.max(1, list.length));
  list.forEach((mx, i) => m.setMatrixAt(i, mx));
  if (colors) colors.forEach((c, i) => m.setColorAt(i, c));
  m.count = list.length; m.instanceMatrix.needsUpdate = true;
  return m;
}

/* ---------- Kalisz: geometria z OpenStreetMap (kalisz.json, decymetry; x = wschód, z = południe, 0,0 = Główny Rynek) ---------- */
const CITY_URL = __CITY_URL__;                                                 // kalisz.<hash>.json, podstawia scripts/build.mjs
const CITY_BYTES = __CITY_BYTES__;                                             // rozmiar rozpakowanego pliku (pasek postępu)
const CURB = 1.4;                                                              // chodnik 14 cm nad jezdnią
const GRID = 200;                                                              // siatka wyszukiwania 20 m
const gkey = (i, j) => (i + 2000) * 4096 + (j + 2000);
function gridPut(grid, x0, z0, x1, z1, item) {
  for (let i = Math.floor(x0 / GRID); i <= Math.floor(x1 / GRID); i++)
    for (let j = Math.floor(z0 / GRID); j <= Math.floor(z1 / GRID); j++) {
      const k = gkey(i, j); let a = grid.get(k);
      if (!a) grid.set(k, a = []);
      a.push(item);
    }
}
const cellOf = (grid, x, z) => grid.get(gkey(Math.floor(x / GRID), Math.floor(z / GRID))) || [];
function ringBox(r) {
  let x0 = Infinity, z0 = Infinity, x1 = -Infinity, z1 = -Infinity;
  for (let i = 0; i < r.length; i += 2) { x0 = Math.min(x0, r[i]); x1 = Math.max(x1, r[i]); z0 = Math.min(z0, r[i + 1]); z1 = Math.max(z1, r[i + 1]); }
  return [x0, z0, x1, z1];
}
function ringHas(r, x, z) {
  let inside = false;
  for (let i = 0, j = r.length - 2; i < r.length; j = i, i += 2) {
    const xi = r[i], zi = r[i + 1], xj = r[j], zj = r[j + 1];
    if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}
function polyHas(p, x, z) {
  if (!ringHas(p[0], x, z)) return false;
  for (let k = 1; k < p.length; k++) if (ringHas(p[k], x, z)) return false;
  return true;
}
function indexPolys(list, grid = new Map()) {
  for (const p of list) { const b = ringBox(p[0]); gridPut(grid, b[0], b[1], b[2], b[3], { p, b }); }
  return grid;
}
function inGrid(grid, x, z) {
  for (const { p, b } of cellOf(grid, x, z)) if (x > b[0] && x < b[2] && z > b[1] && z < b[3] && polyHas(p, x, z)) return true;
  return false;
}
const ringArea2 = r => { let a = 0; for (let i = 0, j = r.length - 2; i < r.length; j = i, i += 2) a += r[j] * r[i + 1] - r[i] * r[j + 1]; return a; };

// płaskie powierzchnie (jezdnia, chodniki, trawniki, woda) z triangulacji wielokątów z dziurami
function flatGeo(list, y, uvScale) {
  const pos = [], uv = [];
  for (const p of list) {
    const rings = p.map(r => { const a = []; for (let i = 0; i < r.length; i += 2) a.push(new THREE.Vector2(r[i], r[i + 1])); return a; });
    const tris = THREE.ShapeUtils.triangulateShape(rings[0], rings.slice(1)), all = rings.flat();
    for (const [a, b, c] of tris) {
      const A = all[a], B = all[b], C = all[c];
      const up = (B.y - A.y) * (C.x - A.x) - (B.x - A.x) * (C.y - A.y) > 0;
      for (const P of up ? [A, B, C] : [A, C, B]) { pos.push(P.x, y, P.y); uv.push(P.x * uvScale, P.y * uvScale); }
    }
  }
  const g = new THREE.BufferGeometry(), n = new Float32Array(pos.length);
  for (let i = 1; i < n.length; i += 3) n[i] = 1;
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute('normal', new THREE.BufferAttribute(n, 3));
  return g;
}
// ściany wzdłuż pierścienia, skierowane na zewnątrz wielokąta (w dziurach: do środka dziury)
function pushWalls(A, ring, hole, y0, y1, uvFn, col) {
  const f = (ringArea2(ring) > 0 ? 1 : -1) * (hole ? -1 : 1);
  let u = 0;
  for (let i = 0; i < ring.length; i += 2) {
    const x0 = ring[i], z0 = ring[i + 1], j = (i + 2) % ring.length, x1 = ring[j], z1 = ring[j + 1];
    const dx = x1 - x0, dz = z1 - z0, len = Math.hypot(dx, dz);
    if (len < 0.01) continue;
    const nx = f * dz / len, nz = -f * dx / len, u1 = u + len;
    const a = [x0, y0, z0, u, 0], b = [x1, y0, z1, u1, 0], c = [x1, y1, z1, u1, y1 - y0], d = [x0, y1, z0, u, y1 - y0];
    for (const v of f > 0 ? [a, c, b, a, d, c] : [a, b, c, a, c, d]) {
      A.pos.push(v[0], v[1], v[2]); A.nor.push(nx, 0, nz);
      const t = uvFn(v[3], v[4]); A.uv.push(t[0], t[1]);
      if (A.col) A.col.push(col.r, col.g, col.b);
    }
    u = u1;
  }
}
function pushRoof(A, ring, y, col) {
  const pts = []; for (let i = 0; i < ring.length; i += 2) pts.push(new THREE.Vector2(ring[i], ring[i + 1]));
  for (const [a, b, c] of THREE.ShapeUtils.triangulateShape(pts, [])) {
    const P = pts[a], B = pts[b], C = pts[c], up = (B.y - P.y) * (C.x - P.x) - (B.x - P.x) * (C.y - P.y) > 0;
    for (const Q of up ? [P, B, C] : [P, C, B]) { A.pos.push(Q.x, y, Q.y); A.nor.push(0, 1, 0); A.uv.push(0.01, 0.01); A.col.push(col.r, col.g, col.b); }
  }
}
function arrGeo(A) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(A.pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(A.nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(A.uv, 2));
  if (A.col) g.setAttribute('color', new THREE.Float32BufferAttribute(A.col, 3));
  return g;
}
const newArr = (col = true) => ({ pos: [], nor: [], uv: [], col: col ? [] : null });

// tekstury proceduralne
function canvasTex(size, draw, repeat = true) {
  const c = document.createElement('canvas'); c.width = c.height = size; draw(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
function speckle(base, amp, tiles, seed) {
  return canvasTex(128, (g, n) => {
    const R = rng(seed); g.fillStyle = base; g.fillRect(0, 0, n, n);
    for (let i = 0; i < 2600; i++) { const v = (R() - 0.5) * amp; g.fillStyle = v > 0 ? `rgba(255,255,255,${v})` : `rgba(0,0,0,${-v})`; g.fillRect(R() * n, R() * n, 1 + R() * 2, 1 + R() * 2); }
    if (tiles) { g.strokeStyle = 'rgba(0,0,0,.13)'; g.lineWidth = 1; for (let k = 0; k <= n; k += n / tiles) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, n); g.moveTo(0, k); g.lineTo(n, k); g.stroke(); } }
  });
}
// elewacja 4 × 4 okna (komórka 4 m × 3,3 m); druga tekstura: okna zapalone nocą
function facade(big, lit) {
  const R = rng(big ? 77 : 33);
  return canvasTex(256, (g, n) => {
    g.fillStyle = lit ? '#000' : '#fff'; g.fillRect(0, 0, n, n);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
      const [x0, y0, x1, y1] = big ? [3, 6, 61, 58] : [14, 12, 50, 48], ox = i * 64, oy = j * 64, on = R() < 0.38;
      if (lit) { if (on) { g.fillStyle = R() < 0.5 ? '#ffd79a' : '#ffe9c2'; g.fillRect(ox + x0, oy + y0, x1 - x0, y1 - y0); } continue; }
      const gr = g.createLinearGradient(0, oy + y0, 0, oy + y1); gr.addColorStop(0, '#7890a4'); gr.addColorStop(1, '#34475a');
      g.fillStyle = gr; g.fillRect(ox + x0, oy + y0, x1 - x0, y1 - y0);
      g.strokeStyle = '#e4e2dc'; g.lineWidth = 2; g.strokeRect(ox + x0, oy + y0, x1 - x0, y1 - y0);
      g.beginPath(); g.moveTo(ox + 32, oy + y0); g.lineTo(ox + 32, oy + y1); g.stroke();
      if (!big) { g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(ox + x0 - 3, oy + y1, x1 - x0 + 6, 3); }
    }
  });
}

const PAL = {
  wall: [['#eadfc6', '#dcc9a6', '#e6d2b6', '#d3dad4', '#e8d6ab', '#dcbca3', '#cdc6b7', '#f0e8d9', '#d9c39d', '#c4ccce', '#e2c7b8', '#c9d3c0'],
    ['#efe9de', '#ddd1bb', '#d0c4ad', '#e6ddca'], ['#a3a097', '#b4b0a6', '#928f89'], ['#d0d8de', '#b5c3cd', '#dde0e2'], ['#b8694b', '#aa5d43', '#d8cdb8']],
  roof: [['#8c5a45', '#6d7073', '#7c6f66', '#5f6367', '#94604a'], ['#8f4b36', '#7a4130', '#6a5f58'], ['#6b6d70', '#7d7f81'], ['#5c6064', '#6e7276'], ['#7d4331', '#4f5b5e']],
};

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
// ryzalit frontowy: 5 osi, arkady w parterze, okna z balustradą na I piętrze
function ratFrontTex() {
  return canvasTex(512, (g, n) => {
    const H = RAT.H, Y = y => n - y / H * n, bw = n / 5;
    g.fillStyle = '#f4f1ea'; g.fillRect(0, 0, n, n);
    g.fillStyle = '#dcd8cf'; g.fillRect(0, Y(5), n, n);
    g.strokeStyle = 'rgba(0,0,0,.11)'; g.lineWidth = 2;
    for (let y = 9; y < 52; y += 5.5) { g.beginPath(); g.moveTo(0, Y(y)); g.lineTo(n, Y(y)); g.stroke(); }
    g.fillStyle = '#e6e2d9'; g.fillRect(0, Y(57), n, Y(52) - Y(57));
    for (let i = 0; i < 5; i++) {
      const cx = bw * (i + 0.5);
      // arkada
      const aw = bw * 0.62, t = Y(47), b = Y(0);
      g.fillStyle = '#ebe7de'; g.beginPath(); g.moveTo(cx - aw / 2 - 7, b); g.lineTo(cx - aw / 2 - 7, t + aw / 2); g.arc(cx, t + aw / 2, aw / 2 + 7, Math.PI, 0); g.lineTo(cx + aw / 2 + 7, b); g.fill();
      g.fillStyle = '#39342e'; g.beginPath(); g.moveTo(cx - aw / 2, b); g.lineTo(cx - aw / 2, t + aw / 2); g.arc(cx, t + aw / 2, aw / 2, Math.PI, 0); g.lineTo(cx + aw / 2, b); g.fill();
      g.fillStyle = '#e3dfd5'; g.fillRect(cx - 5, t - 4, 10, 9);                // klucz łuku
      // I piętro: okno z półkolistym nadprożem i balustradką
      const w1 = bw * 0.46, t1 = Y(108), b1 = Y(68);
      const gr = g.createLinearGradient(0, t1, 0, b1); gr.addColorStop(0, '#71879a'); gr.addColorStop(1, '#2d3d4c');
      g.fillStyle = '#e5e1d7'; g.fillRect(cx - w1 / 2 - 6, t1 - 4, w1 + 12, b1 - t1 + 6);
      g.fillStyle = gr; g.beginPath(); g.moveTo(cx - w1 / 2, b1); g.lineTo(cx - w1 / 2, t1 + w1 / 2); g.arc(cx, t1 + w1 / 2, w1 / 2, Math.PI, 0); g.lineTo(cx + w1 / 2, b1); g.fill();
      g.fillStyle = '#e9e5dc'; g.fillRect(cx - w1 / 2 - 8, Y(71), w1 + 16, Y(66) - Y(71));
      for (let k = 0; k < 6; k++) g.fillRect(cx - w1 / 2 + k * w1 / 5 - 2, Y(69), 4, Y(62) - Y(69));   // tralki
      // II piętro
      const w2 = bw * 0.42, t2 = Y(140), b2 = Y(119);
      const gr2 = g.createLinearGradient(0, t2, 0, b2); gr2.addColorStop(0, '#71879a'); gr2.addColorStop(1, '#2d3d4c');
      g.fillStyle = '#e5e1d7'; g.fillRect(cx - w2 / 2 - 6, t2 - 5, w2 + 12, b2 - t2 + 9);
      g.fillStyle = gr2; g.fillRect(cx - w2 / 2, t2, w2, b2 - t2);
      g.strokeStyle = '#f5f3ee'; g.lineWidth = 3; g.beginPath();
      g.moveTo(cx, t1 + 3); g.lineTo(cx, b1); g.moveTo(cx, t2); g.lineTo(cx, b2); g.stroke();
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
function clockTex() {
  return canvasTex(256, (g, n) => {
    const c = n / 2;
    g.fillStyle = '#c9a24a'; g.beginPath(); g.arc(c, c, c - 2, 0, 7); g.fill();
    g.fillStyle = '#1f2a33'; g.beginPath(); g.arc(c, c, c - 14, 0, 7); g.fill();
    g.strokeStyle = '#d8b660'; g.lineCap = 'round';
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.lineWidth = i % 3 ? 5 : 9; g.beginPath(); g.moveTo(c + Math.cos(a) * (c - 24), c + Math.sin(a) * (c - 24)); g.lineTo(c + Math.cos(a) * (c - 44), c + Math.sin(a) * (c - 44)); g.stroke(); }
    g.lineWidth = 9; g.beginPath(); g.moveTo(c, c); g.lineTo(c + 42, c - 40); g.stroke();       // 10:10
    g.lineWidth = 6; g.beginPath(); g.moveTo(c, c); g.lineTo(c - 62, c - 58); g.stroke();
    g.fillStyle = '#d8b660'; g.beginPath(); g.arc(c, c, 8, 0, 7); g.fill();
  }, false);
}
function archTex(base, open, frame) {                                           // ściana hełmu / latarni z łukowym otworem
  return canvasTex(128, (g, n) => {
    g.fillStyle = base; g.fillRect(0, 0, n, n);
    g.fillStyle = frame; g.fillRect(24, 16, 80, 106);
    g.fillStyle = open; g.beginPath(); g.moveTo(34, 118); g.lineTo(34, 52); g.arc(64, 52, 30, Math.PI, 0); g.lineTo(94, 118); g.fill();
    g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(0, 0, 5, n);
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

function buildRatusz(R0, group, solid) {
  const plaster = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.88, emissive: 0xfff0d2, emissiveIntensity: 0 });
  const facadeM = plaster.clone(); facadeM.map = ratFacadeTex();
  const frontM = plaster.clone(); frontM.map = ratFrontTex();
  const shaftM = plaster.clone(); shaftM.map = ratShaftTex();
  const roofM = new THREE.MeshStandardMaterial({ color: 0x8e9398, roughness: 0.6, metalness: 0.35 });
  const darkM = new THREE.MeshStandardMaterial({ color: 0x2c3234, roughness: 0.5, metalness: 0.35 });
  const goldM = new THREE.MeshStandardMaterial({ color: 0xd4ab4f, roughness: 0.3, metalness: 0.9 });
  const add = (geo, mat, parent = group) => { const m = new THREE.Mesh(geo, mat); parent.add(m); return m; };

  // korpus z dziedzińcem: elewacje z osiami okiennymi, gzyms wieńczący, płaski dach blaszany
  const walls = newArr(false);
  R0.body.forEach((r, k) => pushWalls(walls, r, k > 0, -2, RAT.H - 8, (u, v) => [u / RAT.bay, (v - 2) / RAT.H]));
  add(arrGeo(walls), facadeM);
  const cor = newArr(false);
  pushWalls(cor, R0.cornice[0], false, RAT.H - 9, RAT.H, () => [0.5, 0.97]);
  R0.body.slice(1).forEach(r => pushWalls(cor, r, true, RAT.H - 9, RAT.H, () => [0.5, 0.97]));
  add(arrGeo(cor), facadeM);
  add(flatGeo([[R0.cornice[0], ...R0.body.slice(1)]], RAT.H, 1 / 40), roofM);
  const bb = ringBox(R0.body[0]);
  gridPut(solid, bb[0], bb[1], bb[2], bb[3], { p: [R0.body[0]], b: bb });

  // układ lokalny frontu: x wzdłuż ryzalitu, +z na zewnątrz (w stronę rynku), 0 = lico ryzalitu
  const [ax, az, bx, bz] = R0.front, L = Math.hypot(bx - ax, bz - az), ux = (bx - ax) / L, uz = (bz - az) / L;
  const F = new THREE.Group(); F.position.set((ax + bx) / 2, 0, (az + bz) / 2); F.rotation.y = Math.atan2(-uz, ux); group.add(F);
  const [tx0, tz0, TS] = R0.tower;
  const dx = tx0 - F.position.x, dz = tz0 - F.position.z;
  const tx = dx * ux + dz * uz, tz = dx * -uz + dz * ux;

  // ryzalit: lico z arkadami, pilastry wielkiego porządku, belkowanie i tympanon z herbem
  const front = add(new THREE.PlaneGeometry(L, RAT.H - 2).translate(0, (RAT.H - 2) / 2, 0.6), frontM, F);
  for (let i = 0; i <= 5; i++) {
    const x = -L / 2 + i * L / 5 + (i === 0 ? 3 : i === 5 ? -3 : 0);
    add(new THREE.BoxGeometry(i % 5 ? 6 : 7, 86, 2.4).translate(x, 57 + 43, 1.6), plaster, F);                     // pilaster
    add(new THREE.BoxGeometry(10, 4, 3.6).translate(x, 145, 2), plaster, F);                                         // głowica
    add(new THREE.BoxGeometry(9, 3, 3.2).translate(x, 58.5, 1.9), plaster, F);                                       // baza
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

  return [plaster, facadeM, frontM, shaftM];
}

/* ---------- Fontanna „Noce i Dnie” (2017, Plac Jana Pawła II): trójkątna niecka z dmuchawcem, okrągła niecka dolna, posadzka z dyszami ---------- */
function plazaTex() {                                                          // granitowy plac z promienistym rysunkiem posadzki
  return canvasTex(1024, (g, n) => {
    const c = n / 2, R = rng(2017);
    g.fillStyle = '#b9b6ae'; g.fillRect(0, 0, n, n);
    for (let i = 0; i < 9000; i++) { const v = (R() - 0.5) * 0.18; g.fillStyle = v > 0 ? `rgba(255,255,255,${v})` : `rgba(0,0,0,${-v})`; g.fillRect(R() * n, R() * n, 2, 2); }
    g.strokeStyle = '#8d8a84'; g.lineWidth = 7;
    for (const r of [0.36, 0.52, 0.7, 0.86]) { g.beginPath(); g.arc(c, c, r * c, 0, 7); g.stroke(); }
    g.lineWidth = 5;
    for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2; g.beginPath(); g.moveTo(c + Math.cos(a) * c * 0.36, c + Math.sin(a) * c * 0.36); g.lineTo(c + Math.cos(a) * c * 0.99, c + Math.sin(a) * c * 0.99); g.stroke(); }
    g.strokeStyle = '#9d9a93'; g.lineWidth = 16; g.beginPath(); g.arc(c, c, c * 0.985, 0, 7); g.stroke();
  }, false);
}
function flutedTex() {                                                         // żłobkowany murek z jasnego kamienia
  const t = canvasTex(64, (g, n) => {
    g.fillStyle = '#e4dccb'; g.fillRect(0, 0, n, n);
    const gr = g.createLinearGradient(0, 0, n, 0);
    gr.addColorStop(0, 'rgba(0,0,0,.16)'); gr.addColorStop(0.35, 'rgba(0,0,0,0)'); gr.addColorStop(0.7, 'rgba(255,255,255,.18)'); gr.addColorStop(1, 'rgba(0,0,0,.16)');
    g.fillStyle = gr; g.fillRect(0, 8, n, n - 16);
    g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, 0, n, 5); g.fillRect(0, n - 5, n, 5);
  });
  return t;
}
function babinkaTex(len, wid) {                                                // szklane płyty posadzki z napisami BABINKA / KANAŁ
  const w = 1024, h = Math.round(w * wid / len);
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  g.fillStyle = '#9fd3e3'; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(40,90,110,.35)'; g.lineWidth = 3;
  for (let x = 0; x <= w; x += w / Math.round(len / 12)) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
  g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke();
  g.fillStyle = 'rgba(46,96,140,.75)'; g.font = `600 ${Math.round(h * 0.2)}px IBM Plex Sans, sans-serif`; g.textBaseline = 'middle';
  for (let x = 30; x < w - 120; x += h * 1.9) { g.fillText('BABINKA', x, h * 0.26); g.fillText('KANAŁ', x + h * 0.7, h * 0.76); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

function buildFountain(FD, group, solid, posts) {
  const [cx, cz] = FD.c, y0 = CURB, F = new THREE.Group(); F.position.set(cx, y0, cz); group.add(F);
  const stone = new THREE.MeshStandardMaterial({ color: 0xe8e1d1, roughness: 0.8 });
  const fluteT = flutedTex();
  const fluted = new THREE.MeshStandardMaterial({ map: fluteT, roughness: 0.85 });
  const water = new THREE.MeshStandardMaterial({ color: 0x5f8f8c, roughness: 0.08, metalness: 0.2, transparent: true, opacity: 0.88, emissive: 0x2a6f88, emissiveIntensity: 0 });
  const jetM = new THREE.MeshStandardMaterial({ color: 0xf4fbff, roughness: 0.3, transparent: true, opacity: 0.78, depthWrite: false, emissive: 0x9fe3ff, emissiveIntensity: 0 });
  const add = (geo, mat, parent = F) => { const m = new THREE.Mesh(geo, mat); parent.add(m); return m; };
  const flat = geo => geo.rotateX(-Math.PI / 2);

  // plac: granitowa posadzka z promienistym wzorem, pas trawy wokół niecki
  const plaza = add(flat(new THREE.CircleGeometry(FD.r, 72)), new THREE.MeshStandardMaterial({ map: plazaTex(), roughness: 0.85, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -24 }));
  plaza.position.y = 0.02;
  add(flat(new THREE.RingGeometry(63, 75, 72)), new THREE.MeshStandardMaterial({ color: 0x6f9f4c, roughness: 1, polygonOffset: true, polygonOffsetFactor: -7, polygonOffsetUnits: -28 })).position.y = 0.04;

  // niecka dolna: okrągła, żłobkowany murek 70 cm z szeroką koroną
  fluteT.repeat.set(64, 1);
  add(new THREE.CylinderGeometry(63, 63, 7, 96, 1, true).translate(0, 3.5, 0), fluted);
  add(new THREE.CylinderGeometry(59.5, 59.5, 7, 96, 1, true).translate(0, 3.5, 0), new THREE.MeshStandardMaterial({ color: 0xd9d2c2, roughness: 0.8, side: THREE.BackSide }));
  add(flat(new THREE.RingGeometry(58.8, 64.2, 96)).translate(0, 7.6, 0), stone);
  add(new THREE.CylinderGeometry(64.2, 64.2, 1.2, 96, 1, true).translate(0, 7, 0), stone);
  add(flat(new THREE.CircleGeometry(59.5, 96)).translate(0, 5, 0), water);

  // niecka górna: trójkąt z zaokrąglonymi narożami (wierzchołki z OSM), wyższy murek
  const tips = FD.tips.map(([x, z]) => new THREE.Vector2(x - cx, -(z - cz)));   // układ kształtu: (x, −z)
  const roundTri = (inset, rad) => {
    const c0 = tips.reduce((a, p) => a.add(p.clone().divideScalar(3)), new THREE.Vector2());
    const P = tips.map(p => c0.clone().add(p.clone().sub(c0).multiplyScalar(1 - inset / p.distanceTo(c0))));
    const sh = new THREE.Shape();
    P.forEach((p, i) => {
      const a = P[(i + 2) % 3], b = P[(i + 1) % 3];
      const pa = p.clone().add(a.clone().sub(p).setLength(rad)), pb = p.clone().add(b.clone().sub(p).setLength(rad));
      if (i === 0) sh.moveTo(pa.x, pa.y); else sh.lineTo(pa.x, pa.y);
      sh.quadraticCurveTo(p.x, p.y, pb.x, pb.y);
    });
    sh.closePath();
    return sh;
  };
  const outer = roundTri(0, 9), inner = roundTri(4.5, 8);
  const rim = new THREE.Shape(outer.getPoints(12)); rim.holes.push(new THREE.Path(inner.getPoints(12)));
  const triWall = new THREE.ExtrudeGeometry(rim, { depth: 12, bevelEnabled: false, curveSegments: 12 }).rotateX(-Math.PI / 2);
  add(triWall, [stone, stone]);
  add(new THREE.ShapeGeometry(inner, 12).rotateX(-Math.PI / 2).translate(0, 10.6, 0), water);

  // dmuchawiec: kula promienistych strumieni na trzonku + parasol łuków opadających do niecki
  add(new THREE.CylinderGeometry(1.1, 1.6, 9, 12).translate(0, 14.5, 0), new THREE.MeshStandardMaterial({ color: 0x9aa3a8, metalness: 0.8, roughness: 0.3 }));
  const dand = new THREE.Group(); dand.position.y = 21; F.add(dand);
  add(new THREE.SphereGeometry(11.5, 28, 18), new THREE.MeshStandardMaterial({ color: 0xf4fbff, transparent: true, opacity: 0.42, depthWrite: false, roughness: 0.2, emissive: 0x9fe3ff, emissiveIntensity: 0 }), dand);
  const rays = [], Rr = rng(99);
  for (let i = 0; i < 420; i++) {
    const u = Rr() * 2 - 1, a = Rr() * Math.PI * 2, y = Math.max(-0.75, u), r = Math.sqrt(1 - y * y);
    rays.push(0, 0, 0, Math.cos(a) * r * 11.8, y * 11.8, Math.sin(a) * r * 11.8);
  }
  const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.Float32BufferAttribute(rays, 3));
  dand.add(new THREE.LineSegments(rg, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 })));
  const arcs = [];
  for (let k = 0; k < 30; k++) {
    const a = k / 30 * Math.PI * 2, d = V(Math.cos(a), 0, Math.sin(a));
    const curve = new THREE.QuadraticBezierCurve3(d.clone().multiplyScalar(3).setY(17), d.clone().multiplyScalar(14).setY(27), d.clone().multiplyScalar(22).setY(10.6));
    arcs.push(new THREE.TubeGeometry(curve, 12, 0.75, 6, false));
  }
  add(mergeGeometries(arcs), jetM);

  // strumienie w niecce dolnej (po 4 przy każdym boku trójkąta) i dysze posadzkowe w pasach „Babinka”
  const jets = [];
  const jet = (x, z, h, r, parent = F) => {
    const m = add(new THREE.CylinderGeometry(r * 0.45, r, 1, 10, 1, true).translate(0, 0.5, 0), jetM, parent);
    m.position.set(x, 0, z); m.userData.h = h; m.userData.ph = jets.length * 1.7; jets.push(m);
    const cap = add(new THREE.SphereGeometry(r * 0.75, 10, 6), jetM, m); cap.position.y = 1; cap.scale.set(1, 0.5 / h, 1);
    return m;
  };
  for (let i = 0; i < 3; i++) {
    const a = tips[i], b = tips[(i + 1) % 3], mid = a.clone().add(b).multiplyScalar(0.5), ang = Math.atan2(-mid.y, mid.x);
    for (const off of [-0.5, -0.17, 0.17, 0.5]) { const q = ang + off; const j = jet(Math.cos(q) * 52, Math.sin(q) * 52, 12, 2.3); j.position.y = 5; }
  }
  const strip = (dist0, len, wid, n, sgn) => {
    const dir = V(0.88, 0, 0.47).multiplyScalar(sgn), mid = dir.clone().multiplyScalar(dist0 + len / 2);
    const S = new THREE.Group(); S.position.set(mid.x, 0, mid.z); S.rotation.y = Math.atan2(-dir.z, dir.x); F.add(S);
    add(flat(new THREE.PlaneGeometry(len, wid)), new THREE.MeshStandardMaterial({ map: babinkaTex(len, wid), roughness: 0.15, metalness: 0.1, polygonOffset: true, polygonOffsetFactor: -8, polygonOffsetUnits: -32 }), S).position.y = 0.06;
    for (let i = 0; i < n; i++) jet(-len / 2 + (i + 0.5) * len / n, 0, 10 + (i % 3) * 3, 1.3, S);
  };
  strip(76, 80, 34, 10, 1);                                                    // długi pas na południowy wschód
  strip(78, 36, 28, 4, -1);                                                    // krótszy na północny zachód

  // pergole z drewna z płóciennym zadaszeniem, ławki, stylowe latarnie
  const wood = new THREE.MeshStandardMaterial({ color: 0x7a5234, roughness: 0.8 });
  const canvasM = new THREE.MeshStandardMaterial({ color: 0xf1ede4, roughness: 0.9, side: THREE.DoubleSide });
  const benchM = new THREE.MeshStandardMaterial({ color: 0x5b3c24, roughness: 0.8 }), ironM = new THREE.MeshStandardMaterial({ color: 0x22272b, roughness: 0.5, metalness: 0.6 });
  const pergola = (ang, rad) => {
    const P = new THREE.Group(); P.position.set(Math.cos(ang) * rad, 0, Math.sin(ang) * rad); P.rotation.y = -ang + Math.PI / 2; F.add(P);
    for (const x of [-15, 15]) for (const z of [-14, 14]) add(new THREE.BoxGeometry(1.4, 28, 1.4).translate(x, 14, z), wood, P);
    for (const z of [-14, 14]) add(new THREE.BoxGeometry(34, 1.8, 1.6).translate(0, 28.5, z), wood, P);
    for (const x of [-15, 15]) add(new THREE.BoxGeometry(1.6, 1.8, 32).translate(x, 28.5, 0), wood, P);
    add(new THREE.PlaneGeometry(30, 27).rotateX(-Math.PI / 2 + 0.05).translate(0, 29.8, 0), canvasM, P);
    add(new THREE.BoxGeometry(16, 0.8, 4.5).translate(0, 4.5, 0), benchM, P);
    add(new THREE.BoxGeometry(16, 4, 0.8).translate(0, 7, -2.4), benchM, P);
    for (const x of [-7, 7]) add(new THREE.BoxGeometry(0.8, 4.5, 4).translate(x, 2.2, 0), ironM, P);
  };
  pergola(-1.05, 150); pergola(-1.55, 152);
  for (let k = 0; k < 8; k++) {
    const a = k / 8 * Math.PI * 2 + 0.2, L = new THREE.Group(); L.position.set(Math.cos(a) * 172, 0, Math.sin(a) * 172); F.add(L);
    add(new THREE.CylinderGeometry(0.7, 1.3, 38, 8).translate(0, 19, 0), ironM, L);
    add(new THREE.CylinderGeometry(2.2, 1.2, 5, 6).translate(0, 40.5, 0), new THREE.MeshStandardMaterial({ color: 0xfff1cf, emissive: 0xffd896, emissiveIntensity: 0.3, roughness: 0.4 }), L);
    add(new THREE.ConeGeometry(2.8, 3, 6).translate(0, 44.5, 0), ironM, L);
    gridPut(posts, cx + L.position.x, cz + L.position.z, cx + L.position.x, cz + L.position.z, [cx + L.position.x, cz + L.position.z, 1.4]);
  }

  // kolizja: otoczka okrągłej niecki i wierzchołków trójkąta
  const pts = [];
  for (let k = 0; k < 32; k++) { const a = k / 32 * Math.PI * 2; pts.push([cx + Math.cos(a) * 65, cz + Math.sin(a) * 65]); }
  for (const [x, z] of FD.tips) pts.push([x, z]);
  pts.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], hi = [];
  for (const p of pts) { while (lo.length > 1 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of pts.slice().reverse()) { while (hi.length > 1 && cross(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
  const ring = lo.slice(0, -1).concat(hi.slice(0, -1)).flat(), bb = ringBox(ring);
  gridPut(solid, bb[0], bb[1], bb[2], bb[3], { p: [ring], b: bb });
  // pergole też stoją na drodze
  for (const ang of [-1.05, -1.55]) for (const x of [-15, 15]) for (const z of [-14, 14]) {
    const px = Math.cos(ang) * 150, pz = Math.sin(ang) * 150, r = -ang + Math.PI / 2;
    const wx = cx + px + x * Math.cos(r) + z * Math.sin(r), wz = cz + pz - x * Math.sin(r) + z * Math.cos(r);
    gridPut(posts, wx, wz, wx, wz, [wx, wz, 1.2]);
  }

  // animacja strumieni (pulsowanie) i obrót dmuchawca
  const anim = t => {
    for (const j of jets) { const s = j.userData.h * (0.86 + 0.14 * Math.sin(t * 3.1 + j.userData.ph) + 0.05 * Math.sin(t * 11 + j.userData.ph * 2)); j.scale.set(1, s, 1); }
    dand.rotation.y = t * 0.15;
  };
  return { mats: [water, jetM, dand.children[0].material], anim, c: [cx, cz], r: FD.r };
}

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

function buildKolegiata(K, group, solid) {
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

function buildGarnizon(K, group, solid) {
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

/* ---------- Sgraffito W. Kościelniaka (1974), ul. Stawiszyńska 3 / róg Warszawskiej: czerwony rysunek na żółtym tynku ---------- */
// ściana frontowa (od Warszawskiej): plan miasta z zabytkami, Prosna, drogi, drzewka, herb i róża wiatrów, napis u dołu;
// wąska ściana boczna po prawej: postacie w strojach ludowych i „Wita Was Ziemia Kaliska”
const SG = { bg: '#dbbf72', line: '#ad4529', fill: 'rgba(173,69,41,.22)', dark: '#2d2b28' };
// końce ścian w układzie świata (dm, z OSM), lewy → prawy patrząc z ulicy; wysokości w dm
const MUR = { map: [[3207, -3901], [3425, -3734]], folk: [[3425, -3734], [3462, -3779]], top: 162, eave: 118, h: 135 };
const SERIF = 'Georgia, "Times New Roman", "DejaVu Serif", serif';

function sgBg(g, W, T, seed) {                                                          // tynk: ugier, plamy, zacieki, odpryski
  g.fillStyle = SG.bg; g.fillRect(0, -5, W, T + 10);
  const R = rng(seed);
  for (let i = 0; i < W * T * 0.5; i++) { const v = (R() - 0.5) * 0.14; g.fillStyle = v > 0 ? `rgba(255,250,225,${v})` : `rgba(90,70,40,${-v})`; g.fillRect(R() * W, R() * T, 0.4, 0.4); }
  for (let i = 0; i < W / 10; i++) {                                                     // duże przybrudzenia
    const x = R() * W, y = R() * T, r = 6 + R() * 18, gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(${R() < 0.5 ? '120,110,85' : '235,222,180'},${0.12 + R() * 0.12})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
  }
  for (let i = 0; i < W / 5; i++) {                                                      // zacieki od góry
    const x = R() * W, len = 8 + R() * 60, gr = g.createLinearGradient(0, 0, 0, len);
    gr.addColorStop(0, `rgba(95,90,75,${0.08 + R() * 0.16})`); gr.addColorStop(1, 'rgba(95,90,75,0)');
    g.fillStyle = gr; g.fillRect(x, 0, 0.8 + R() * 3, len);
  }
}
function sgAge(g, W, T, seed) {                                                          // odpadający tynk: jaśniejsze i szare łaty
  const R = rng(seed);
  for (let i = 0; i < W / 5; i++) {
    const x = R() * W, y = R() * T, r = 0.4 + R() * (R() < 0.15 ? 5 : 1.4);
    g.fillStyle = R() < 0.55 ? 'rgba(160,150,125,.7)' : 'rgba(238,228,195,.8)';
    g.beginPath(); for (let k = 0; k < 9; k++) { const a = k / 9 * 6.283, q = r * (0.55 + R() * 0.7); g.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q); } g.fill();
  }
}
const pen = (g, w = 0.55) => { g.strokeStyle = SG.line; g.fillStyle = SG.line; g.lineWidth = w; g.lineJoin = 'round'; g.lineCap = 'round'; };
const pl = (g, pts, close = false) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); if (close) g.closePath(); g.stroke(); };
const circ = (g, x, y, r, fill) => { g.beginPath(); g.arc(x, y, r, 0, 7); if (fill) g.fill(); else g.stroke(); };
const srect = (g, x, y, w, h) => g.strokeRect(x, y, w, h);
function spaced(g, txt, x, y, font, spacing, maxW, align = 'center') {                 // napis z odstępem liter, ściśnięty do maxW
  g.font = font; g.textBaseline = 'alphabetic';
  const ch = [...txt], ws = ch.map(c => g.measureText(c).width), tot = ws.reduce((a, b) => a + b, 0) + spacing * (ch.length - 1), k = Math.min(1, maxW / tot);
  g.save(); g.translate(x, y); g.scale(k, 1);
  let cx = align === 'center' ? -tot / 2 : 0;
  ch.forEach((c, i) => { g.fillText(c, cx, 0); cx += ws[i] + spacing; }); g.restore();
}
// linia z próbkowanej krzywej Catmull-Roma: punkty i normalne
function curvePts(pts, n = 60) {
  const c = new THREE.CatmullRomCurve3(pts.map(([x, y]) => V(x, y, 0)));
  return c.getSpacedPoints(n).map((p, i, a) => { const q = a[Math.min(i + 1, n)], o = a[Math.max(i - 1, 0)], dx = q.x - o.x, dy = q.y - o.y, l = Math.hypot(dx, dy) || 1; return [p.x, p.y, -dy / l, dx / l]; });
}
function river(g, pts, w, R) {                                                           // rzeka: dwa brzegi i kreskowanie falkami
  const P = curvePts(pts, 90);
  for (const s of [-1, 1]) pl(g, P.map(([x, y, nx, ny]) => [x + nx * s * w / 2, y + ny * s * w / 2]));
  g.lineWidth = 0.3;
  for (let i = 1; i < P.length - 1; i++) {
    const [x, y, nx, ny] = P[i], j = (R() - 0.5) * w * 0.5;
    g.beginPath(); g.moveTo(x + nx * (j - w * 0.18), y + ny * (j - w * 0.18)); g.quadraticCurveTo(x + nx * j + ny * 0.6, y + ny * j - nx * 0.6, x + nx * (j + w * 0.18), y + ny * (j + w * 0.18)); g.stroke();
  }
  g.lineWidth = 0.55;
}
function road(g, a, b, w) {                                                              // droga: dwie równoległe linie
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), nx = -dy / l * w / 2, ny = dx / l * w / 2;
  pl(g, [[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny]]); pl(g, [[a[0] - nx, a[1] - ny], [b[0] - nx, b[1] - ny]]);
}
function tree(g, x, y, s) {                                                              // drzewko-listek z nerwem
  g.beginPath(); g.ellipse(x, y - s * 0.9, s * 0.55, s * 0.7, 0, 0, 7); g.stroke();
  pl(g, [[x, y], [x, y - s * 1.3]]);
  for (const k of [0.6, 0.95]) { pl(g, [[x, y - s * k], [x - s * 0.3, y - s * (k + 0.2)]]); pl(g, [[x, y - s * k], [x + s * 0.3, y - s * (k + 0.2)]]); }
}
// piktogramy zabytków kreską (x = środek, y = podstawa, s = wysokość)
const LINE = {
  katedra(g, x, y, s) { const u = s / 20; srect(g, x - 9 * u, y - 7 * u, 12 * u, 7 * u); pl(g, [[x - 9.5 * u, y - 7 * u], [x - 3 * u, y - 10 * u], [x + 3.5 * u, y - 7 * u]]); for (let i = 0; i < 3; i++) pl(g, [[x - 7.5 * u + i * 3.5 * u, y - 1 * u], [x - 7.5 * u + i * 3.5 * u, y - 4.5 * u], [x - 6.7 * u + i * 3.5 * u, y - 5.4 * u], [x - 5.9 * u + i * 3.5 * u, y - 4.5 * u], [x - 5.9 * u + i * 3.5 * u, y - 1 * u]]); srect(g, x + 3 * u, y - 12 * u, 4.5 * u, 12 * u); pl(g, [[x + 2.6 * u, y - 12 * u], [x + 5.25 * u, y - 20 * u], [x + 7.9 * u, y - 12 * u]]); pl(g, [[x + 5.25 * u, y - 20 * u], [x + 5.25 * u, y - 21.5 * u]]); pl(g, [[x + 4.3 * u, y - 5 * u], [x + 4.3 * u, y - 8.5 * u], [x + 5.25 * u, y - 9.5 * u], [x + 6.2 * u, y - 8.5 * u], [x + 6.2 * u, y - 5 * u]]); },
  bliznieta(g, x, y, s) { const u = s / 20; srect(g, x - 5 * u, y - 10 * u, 10 * u, 10 * u); for (const d of [-1, 1]) { srect(g, x + d * 6.5 * u - 2 * u, y - 15 * u, 4 * u, 15 * u); pl(g, [[x + d * 6.5 * u - 2.4 * u, y - 15 * u], [x + d * 6.5 * u, y - 19 * u], [x + d * 6.5 * u + 2.4 * u, y - 15 * u]]); circ(g, x + d * 6.5 * u, y - 12 * u, 0.8 * u); } pl(g, [[x - 5 * u, y - 10 * u], [x, y - 14 * u], [x + 5 * u, y - 10 * u]]); pl(g, [[x - 1.5 * u, y], [x - 1.5 * u, y - 4 * u], [x, y - 5.5 * u], [x + 1.5 * u, y - 4 * u], [x + 1.5 * u, y]]); circ(g, x, y - 8 * u, 1.2 * u); },
  ratusz(g, x, y, s) { const u = s / 20; srect(g, x - 8 * u, y - 7 * u, 16 * u, 7 * u); for (let i = 0; i < 5; i++) srect(g, x - 7 * u + i * 3 * u, y - 5.5 * u, 1.4 * u, 3 * u); srect(g, x - 2 * u, y - 14 * u, 4 * u, 7 * u); circ(g, x, y - 11.5 * u, 1.1 * u); pl(g, [[x - 2.4 * u, y - 14 * u], [x - 1.2 * u, y - 16 * u], [x + 1.2 * u, y - 16 * u], [x + 2.4 * u, y - 14 * u]]); srect(g, x - 0.8 * u, y - 18 * u, 1.6 * u, 2 * u); pl(g, [[x, y - 18 * u], [x, y - 21 * u]]); },
  teatr(g, x, y, s) { const u = s / 20; srect(g, x - 9 * u, y - 8 * u, 18 * u, 8 * u); for (let i = 0; i < 6; i++) pl(g, [[x - 6.5 * u + i * 2.6 * u, y], [x - 6.5 * u + i * 2.6 * u, y - 7 * u]]); pl(g, [[x - 9.5 * u, y - 8 * u], [x, y - 12 * u], [x + 9.5 * u, y - 8 * u]]); },
  palac(g, x, y, s) { const u = s / 20; srect(g, x - 11 * u, y - 8 * u, 22 * u, 8 * u); pl(g, [[x - 11 * u, y - 8 * u], [x - 10 * u, y - 10.5 * u], [x + 10 * u, y - 10.5 * u], [x + 11 * u, y - 8 * u]]); for (let r = 0; r < 2; r++) for (let i = 0; i < 8; i++) srect(g, x - 10 * u + i * 2.6 * u, y - 7 * u + r * 3.6 * u, 1.3 * u, 2.2 * u); pl(g, [[x - 3 * u, y - 10.5 * u], [x, y - 13 * u], [x + 3 * u, y - 10.5 * u]]); },
  kolegiata(g, x, y, s) { const u = s / 20; srect(g, x - 1 * u, y - 7 * u, 9 * u, 7 * u); pl(g, [[x - 1 * u, y - 7 * u], [x + 3.5 * u, y - 10 * u], [x + 8 * u, y - 7 * u]]); srect(g, x - 6 * u, y - 13 * u, 5 * u, 13 * u); pl(g, [[x - 4.5 * u, y - 9 * u], [x - 4.5 * u, y - 11 * u], [x - 3.5 * u, y - 12 * u], [x - 2.5 * u, y - 11 * u], [x - 2.5 * u, y - 9 * u]]); g.beginPath(); g.ellipse(x - 3.5 * u, y - 15 * u, 2.3 * u, 2 * u, 0, 0, 7); g.stroke(); pl(g, [[x - 3.5 * u, y - 17 * u], [x - 3.5 * u, y - 20.5 * u]]); pl(g, [[x - 4.6 * u, y - 19.2 * u], [x - 2.4 * u, y - 19.2 * u]]); },
  dorotka(g, x, y, s) { const u = s / 20; srect(g, x - 3.5 * u, y - 13 * u, 7 * u, 13 * u); for (let i = 0; i < 4; i++) srect(g, x - 3.8 * u + i * 2 * u, y - 14.4 * u, 1.3 * u, 1.4 * u); pl(g, [[x - 4 * u, y - 14.4 * u], [x, y - 19 * u], [x + 4 * u, y - 14.4 * u]]); for (let r = 1; r < 6; r++) pl(g, [[x - 3.5 * u, y - r * 2.2 * u], [x + 3.5 * u, y - r * 2.2 * u]]); },
  dom(g, x, y, s) { const u = s / 20; srect(g, x - 5 * u, y - 7 * u, 10 * u, 7 * u); pl(g, [[x - 6 * u, y - 7 * u], [x, y - 12 * u], [x + 6 * u, y - 7 * u]]); srect(g, x - 3.5 * u, y - 5 * u, 2 * u, 2 * u); srect(g, x + 1.5 * u, y - 5 * u, 2 * u, 2 * u); },
};
function herbRound(g, x, y, r) {                                                         // herb w ozdobnym medalionie
  circ(g, x, y, r); circ(g, x, y, r * 0.84);
  for (let k = 0; k < 18; k++) { const a = k / 18 * 6.283; g.beginPath(); g.arc(x + Math.cos(a) * r * 1.07, y + Math.sin(a) * r * 1.07, r * 0.12, a - 1.6, a + 1.6); g.stroke(); }
  const u = r / 10;
  srect(g, x - 5.5 * u, y - 1 * u, 11 * u, 6 * u);                                        // mur
  for (const d of [-4, 0, 4]) { srect(g, x + d * u - 1.5 * u, y - (d ? 6 : 8) * u, 3 * u, (d ? 5 : 7) * u); for (let k = 0; k < 2; k++) g.fillRect(x + d * u - 1.5 * u + k * 1.8 * u, y - (d ? 7 : 9) * u, 1.2 * u, 1 * u); }
  g.beginPath(); g.moveTo(x - 2 * u, y + 5 * u); g.lineTo(x - 2 * u, y + 1.5 * u); g.arc(x, y + 1.5 * u, 2 * u, Math.PI, 0); g.lineTo(x + 2 * u, y + 5 * u); g.stroke();
  circ(g, x, y + 2.4 * u, 1 * u, true);                                                   // głowa rycerza w bramie
  for (let k = -3; k <= 3; k += 2) pl(g, [[x + k * 1.2 * u, y + 6.5 * u], [x + k * 1.2 * u + 0.6 * u, y + 7.8 * u]]);
}
function windRose(g, x, y, r) {                                                          // róża wiatrów z lilią na północy
  for (let k = 0; k < 16; k++) {
    const a = k / 16 * 6.283 - Math.PI / 2, L = k % 2 ? r * 0.72 : r, a0 = a - 0.14, a1 = a + 0.14, ri = r * 0.3;
    g.beginPath(); g.moveTo(x + Math.cos(a0) * ri, y + Math.sin(a0) * ri); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); g.lineTo(x + Math.cos(a1) * ri, y + Math.sin(a1) * ri); g.closePath();
    if (k % 2 === 0) g.fill(); else g.stroke();
  }
  circ(g, x, y, r * 0.3); circ(g, x, y, r * 0.16, true);
  const t = y - r - 0.6;                                                                  // lilia
  g.beginPath(); g.moveTo(x, t - 4); g.quadraticCurveTo(x + 1.3, t - 2, x, t); g.quadraticCurveTo(x - 1.3, t - 2, x, t - 4); g.fill();
  for (const d of [-1, 1]) { g.beginPath(); g.moveTo(x, t - 0.6); g.quadraticCurveTo(x + d * 2.6, t - 3.4, x + d * 1.6, t - 1.2); g.stroke(); }
  pl(g, [[x - 1.4, t - 0.2], [x + 1.4, t - 0.2]]);
}
function runner(g, x, y, s) {                                                            // sylwetka biegacza
  const u = s / 10; circ(g, x + 1 * u, y - 9 * u, 0.9 * u, true); g.lineWidth = 0.9 * u;
  pl(g, [[x + 0.6 * u, y - 7.8 * u], [x - 0.4 * u, y - 4 * u]]); pl(g, [[x - 0.4 * u, y - 4 * u], [x + 1.8 * u, y - 2 * u], [x + 1.4 * u, y]]); pl(g, [[x - 0.4 * u, y - 4 * u], [x - 2.4 * u, y - 2.4 * u], [x - 3.6 * u, y - 3]]);
  pl(g, [[x + 0.4 * u, y - 7 * u], [x + 2.6 * u, y - 5.8 * u]]); pl(g, [[x + 0.4 * u, y - 7 * u], [x - 1.8 * u, y - 7.6 * u]]); g.lineWidth = 0.55;
}

// ściana szczytowa (L × T, y w dół od szczytu T; wysokość h -> y = T − h)
function drawMuralMap(g, L, T) {
  const Y = h => T - h, R = rng(1974);
  sgBg(g, L, T + 2, 1974);
  const E = L - 185;                                                                     // kompozycja 18,5 m przy prawym narożniku, plan ciągnie się w lewo
  g.save(); g.translate(E, 0); pen(g);
  const topAt = x => Math.min(MUR.top, MUR.eave + (MUR.top - MUR.eave) * (x + E) / (0.3 * L));
  // Prosna: odnogi w lewym dolnym rogu i nurt przez środek ściany
  river(g, [[-E - 2, Y(58)], [-E / 2, Y(56)], [-2, Y(52)], [20, Y(48)], [40, Y(38)], [58, Y(30)], [70, Y(26)]], 5.5, R);
  river(g, [[-E - 2, Y(34)], [-E / 2, Y(33)], [-2, Y(30)], [18, Y(25)], [38, Y(19)], [60, Y(16)], [74, Y(15)]], 4.5, R);
  river(g, [[70, Y(164)], [69, Y(130)], [72, Y(95)], [73, Y(60)], [76, Y(30)], [80, Y(11)]], 6.5, R);
  // zabytki na planie (kwartały pod nimi zostają puste)
  const icons = [['katedra', 22, Y(110), 16], ['bliznieta', 41, Y(127), 14], ['palac', 20, Y(92), 12], ['ratusz', 42, Y(102), 16], ['kolegiata', 54, Y(86), 14],
    ['teatr', 20, Y(72), 12], ['dorotka', 37, Y(64), 12], ['palac', 58, Y(122), 10], ['dom', 10, Y(56), 8], ['palac', 33, Y(12), 11], ['teatr', 58, Y(12), 10], ['dom', 5, Y(16), 7],
    ['kolegiata', -E + 22, Y(88), 13], ['palac', -E + 50, Y(104), 12], ['bliznieta', -E + 70, Y(78), 13], ['dom', -E + 30, Y(66), 8], ['dorotka', -12, Y(112), 11], ['palac', -E + 40, Y(14), 10], ['dom', -30, Y(18), 8]];
  const nearIcon = ([x, y]) => icons.some(([, ix, iy, s]) => Math.abs(x - ix) < s * 0.75 && y > iy - s * 1.25 && y < iy + 4);
  // plan śródmieścia: kwartały w obróconej siatce ulic
  const a = [0.8, -0.6], b = [0.6, 0.8], O = [2, Y(66)], cw = 13.5, chh = 11;
  const spots = [];
  for (let i = -10; i < 9; i++) for (let j = -12; j < 7; j++) {
    const c = (p, q) => [O[0] + (i + p) * cw * a[0] + (j + q) * chh * b[0], O[1] + (i + p) * cw * a[1] + (j + q) * chh * b[1]];
    const ctr = c(0.5, 0.5), hC = T - ctr[1];
    if (ctr[0] < -E + 4 || ctr[0] > 62 || hC < 50 - Math.max(0, ctr[0]) * 0.25 + (ctr[0] < 0 ? 12 : 0) || hC > topAt(ctr[0]) - 9) continue;
    const ins = 0.12 + R() * 0.04, jit = () => (R() - 0.5) * 0.8;
    const q = [c(ins, ins), c(1 - ins, ins), c(1 - ins, 1 - ins), c(ins, 1 - ins)].map(([x, y]) => [x + jit(), y + jit()]);
    if (nearIcon(ctr)) continue;
    spots.push(ctr);
    if (R() < 0.18) { g.beginPath(); g.ellipse(ctr[0], ctr[1], 3.8, 3, 0.3, 0, 7); g.stroke(); } else pl(g, q, true);
  }
  for (const [k, x, y, s] of icons) LINE[k](g, x, y, s);
  // drogi wylotowe (z numerem drogi krajowej) i drzewka w parku
  road(g, [76, Y(92)], [141, Y(56)], 3.2); road(g, [78, Y(58)], [132, Y(20)], 3.2); road(g, [77, Y(140)], [102, Y(152)], 2.6); road(g, [98, Y(158)], [136, Y(96)], 2.6);
  pl(g, [[136, Y(64)], [146, Y(54)], [136, Y(50)]]); pl(g, [[143, Y(56)], [150, Y(58)]]);
  g.font = `600 5px ${SERIF}`; g.fillText('38', 150, Y(54));
  for (let i = 0; i < 38; i++) { const x = 82 + R() * 60, h = 20 + R() * 125; if (h > topAt(x) - 8 || Math.abs((T - h) - (Y(92) + (x - 76) * 36 / 65)) < 4) continue; tree(g, x, Y(h), 2.4); }
  // drobne symbole: biegacze, drogowskaz, tramwaj, medalion z jabłkiem, piorun
  runner(g, 122, Y(112), 9); runner(g, 117, Y(96), 8);
  pl(g, [[108, Y(152)], [108, Y(143)]]); pl(g, [[104, Y(152)], [112, Y(152)]]);
  circ(g, 97, Y(44), 4); circ(g, 97, Y(44), 3); circ(g, 97, Y(44.5), 1.6); pl(g, [[97, Y(46)], [97.6, Y(47.2)]]);
  srect(g, 102, Y(29), 11, 5); pl(g, [[104, Y(29)], [104, Y(33)], [111, Y(33)], [111, Y(29)]]); circ(g, 104, Y(23), 1.2); circ(g, 111, Y(23), 1.2); pl(g, [[99, Y(22)], [116, Y(22)]]);
  pl(g, [[123, Y(26)], [126, Y(22)], [124, Y(22)], [127, Y(18)]]);
  herbRound(g, 150, Y(140), 12); windRose(g, 150, Y(102), 13);
  g.restore();
  // napis przy chodniku
  g.fillStyle = SG.line; spaced(g, 'KALISZ - MIASTO ZE WSZYSTKICH W POLSCE NAJSTARSZE', L / 2, Y(3), `500 7.2px ${SERIF}`, 1.1, L - 10);
  sgAge(g, L, T + 2, 7401);
}

// postać kreską: woman = chusta, gorset, szeroka spódnica z zapaską; man = kapelusz, sukmana; flag = uniesiona ręka z chorągiewką
function lineFolk(g, x, y, h, woman, flag = false, dir = 1) {
  const u = h / 30, P = pts => pl(g, pts.map(([a, b]) => [x + a * u * dir, y - b * u]));
  pen(g, 0.5);
  if (woman) {
    g.fillStyle = SG.fill; g.beginPath(); [[-6, 3], [6, 3], [3, 15], [-3, 15]].forEach(([a, b], i) => i ? g.lineTo(x + a * u, y - b * u) : g.moveTo(x + a * u, y - b * u)); g.fill();
    P([[-6, 3], [6, 3], [3, 15], [-3, 15], [-6, 3]]); for (const b of [5, 7]) P([[-5.5 + (b - 3) * 0.25, b], [5.5 - (b - 3) * 0.25, b]]);
    P([[-2.2, 4.5], [2.2, 4.5], [1.8, 14.5], [-1.8, 14.5], [-2.2, 4.5]]);                // zapaska
    P([[-1.4, 3], [-1.4, 0]]); P([[1.4, 3], [1.4, 0]]);
    P([[-2.6, 15], [-2.2, 20.5], [2.2, 20.5], [2.6, 15]]); P([[0, 15.5], [0, 20]]);
    P([[-2.2, 20.5], [-4.2, 17], [-3.6, 13]]); P([[2.2, 20.5], [4.2, 17], [3.6, 13]]);
    circ(g, x, y - 23.2 * u, 1.9 * u); P([[-2.4, 22.6], [-2.2, 25.6], [0, 26.8], [2.2, 25.6], [2.4, 22.6]]); P([[2.2, 22.4], [3.6, 21], [3, 20.6]]);
    g.fillStyle = SG.line; for (let i = -2; i <= 2; i++) circ(g, x + i * 0.8 * u, y - 20.8 * u, 0.35 * u, true);
  } else {
    P([[-1.6, 0], [-1.4, 8]]); P([[1.6, 0], [1.4, 8]]); P([[-2.4, 0], [-0.8, 0]]); P([[0.8, 0], [2.4, 0]]);
    P([[-4, 7], [4, 7], [3, 21], [-3, 21], [-4, 7]]); P([[0, 7], [0, 21]]); P([[-3.5, 13.5], [3.5, 13.5]]);
    for (let b = 15; b < 21; b += 2) circ(g, x + 0.9 * u * dir, y - b * u, 0.25 * u, true);
    P([[-3, 21], [-4.6, 17], [-4.4, 12.5]]);
    if (flag) { P([[3, 21], [5, 24], [5.4, 27]]); P([[5.4, 22], [5.4, 33]]); P([[5.4, 33], [10, 31.5], [5.4, 30]]); }
    else P([[3, 21], [4.6, 17], [4.4, 12.5]]);
    circ(g, x, y - 23.6 * u, 1.9 * u); P([[-3.4, 25.6], [3.4, 25.6]]); P([[-1.8, 25.6], [-1.6, 28.4], [1.6, 28.4], [1.8, 25.6]]); P([[-1.2, 22.4], [1.2, 22.4]]);
  }
}
// ściana boczna przy narożniku (W × T)
function drawMuralFolk(g, W, T) {
  const Y = h => T - h;
  sgBg(g, W, T + 2, 1975);
  g.fillStyle = '#e8e3d6'; g.fillRect(44, Y(128), 11, 16); g.fillStyle = '#3c4852'; g.fillRect(45.2, Y(126.8), 8.6, 13.6);   // okno
  g.fillStyle = '#e8e3d6'; g.fillRect(49.1, Y(126.8), 0.8, 13.6); g.fillRect(45.2, Y(119.5), 8.6, 0.8);
  pen(g);
  lineFolk(g, 16, Y(98), 26, false, true);
  lineFolk(g, 30, Y(90), 26, false); lineFolk(g, 40, Y(88), 25, true);
  lineFolk(g, 18, Y(58), 28, false, false, -1); lineFolk(g, 30, Y(60), 27, true);
  lineFolk(g, 16, Y(24), 28, true); lineFolk(g, 30, Y(26), 28, true); lineFolk(g, 42, Y(56), 26, true);
  g.fillStyle = SG.line;
  g.font = `italic 500 5px ${SERIF}`; g.textBaseline = 'alphabetic'; g.fillText('Wita Was', 28, Y(19)); g.fillText('Ziemia Kaliska', 28, Y(12), W - 30);
  sgAge(g, W, T + 2, 7402);
}

function muralTex(W, T, draw) {                                                          // tekstura: 1 dm = 12 px, od h = −2 do h = T
  const k = Math.min(12, 2048 / Math.max(W, T + 2)), c = document.createElement('canvas');
  c.width = Math.round(W * k); c.height = Math.round((T + 2) * k);
  const g = c.getContext('2d'); g.setTransform(k, 0, 0, k, 0, 0); draw(g, W, T);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  return tex;
}
function buildMural(group) {
  const mats = [], up = V(0, 1, 0);
  const frame = ([ax, az], [bx, bz]) => { const L = Math.hypot(bx - ax, bz - az), u = V((bx - ax) / L, 0, (bz - az) / L); return { L, u, n: V().crossVectors(u, up) }; };
  const place = (mesh, u, n, p) => { mesh.matrixAutoUpdate = false; mesh.matrix.makeBasis(u, up, n).setPosition(p); group.add(mesh); return mesh; };
  // ściana szczytowa: obrys z dachem skośnym po lewej, bryła szczytu nad dachem kamienicy, kominy
  {
    const [A, B] = MUR.map, { L, u, n } = frame(A, B), T = MUR.top;
    const sh = new THREE.Shape([[0, -2], [L, -2], [L, T], [0.3 * L, T], [0, MUR.eave]].map(([x, y]) => new THREE.Vector2(x, y)));
    const tex = muralTex(L, T, drawMuralMap); tex.repeat.set(1 / L, 1 / (T + 2)); tex.offset.set(0, 2 / (T + 2));
    const m = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.93, emissive: 0xfff0d2, emissiveIntensity: 0 }); mats.push(m);
    const p0 = V(A[0], 0, A[1]).addScaledVector(n, 0.4);
    place(new THREE.Mesh(new THREE.ShapeGeometry(sh), m), u, n, p0);
    const top = new THREE.Shape([[0, 100], [L, 100], [L, T], [0.3 * L, T], [0, MUR.eave]].map(([x, y]) => new THREE.Vector2(x, y)));
    const D = 56, body = new THREE.ExtrudeGeometry(top, { depth: D, bevelEnabled: false }).translate(0, 0, -D - 0.2);
    place(new THREE.Mesh(body, new THREE.MeshStandardMaterial({ color: 0xcfb676, roughness: 0.95 })), u, n, p0.clone());
    const roofM = new THREE.MeshStandardMaterial({ color: 0x57534e, roughness: 0.85 }), sl = Math.hypot(0.3 * L, T - MUR.eave);
    place(new THREE.Mesh(new THREE.BoxGeometry(0.7 * L, 1, D + 2).translate(0.65 * L, T + 0.5, -D / 2 - 0.2), roofM), u, n, p0.clone());   // papa na dachu
    place(new THREE.Mesh(new THREE.BoxGeometry(sl, 1, D + 2).rotateZ(Math.atan2(T - MUR.eave, 0.3 * L)).translate(0.15 * L, (T + MUR.eave) / 2 + 0.5, -D / 2 - 0.2), roofM), u, n, p0.clone());
    const brick = new THREE.MeshStandardMaterial({ color: 0xb6a172, roughness: 0.95 });
    for (const [f, w, hh] of [[0.36, 8, 9], [0.47, 7, 7], [0.6, 8, 10], [0.9, 6, 8]]) {
      const c = new THREE.Mesh(new THREE.BoxGeometry(w, hh, 6).translate(f * L, T + hh / 2 - 0.5, -4), brick); place(c, u, n, p0.clone());
      place(new THREE.Mesh(new THREE.BoxGeometry(w + 1.4, 1, 7.4).translate(f * L, T + hh, -4), brick), u, n, p0.clone());
    }
    place(new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 16, 6).translate(0.9 * L, T + 16, -4), new THREE.MeshStandardMaterial({ color: 0x6d7074, metalness: 0.6, roughness: 0.4 })), u, n, p0.clone());
  }
  // ściana boczna: pas od narożnika z postaciami
  {
    const [A, B] = MUR.folk, { L: W, u, n } = frame(A, B), T = MUR.top;
    const m = new THREE.MeshStandardMaterial({ map: muralTex(W, T, drawMuralFolk), roughness: 0.93, emissive: 0xfff0d2, emissiveIntensity: 0 }); mats.push(m);
    place(new THREE.Mesh(new THREE.PlaneGeometry(W, T + 2).translate(W / 2, T / 2 - 1, 0), m), u, n, V(A[0], 0, A[1]).addScaledVector(n, 0.4));
  }
  return mats;
}

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

function buildJozef(D, group, solid, posts) {
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
  return [flameM];
}

/* ---------- Kamienica na rogu Placu Jana Pawła II i Placu św. Józefa: 4 kondygnacje, mansarda z lukarnami, taras z kamiennym murem i schody ---------- */
// narożniki bryły głównej z OSM (dm): a–b front (5 osi, na NNE), a–e długi bok wzdłuż Placu Jana Pawła II, d–b bok od strony kamienic
const NAR = { a: [2024, -1502], b: [1826, -1626], d: [1670, -1442], e: [1923, -1283], cor: 160, first: [2024, -1502],
  T: 11, TD: 38, ST: 42 };                                                       // taras: wysokość 1,1 m, głębokość 3,8 m, biegi schodów po 4,2 m
const GREY = '#e3e4e6', BAND = '#d3d5d8', GLASS = ['#6f8494', '#2c3a47'];
function narFacadeTex(front) {                                                  // jedna oś: sklep, dwa piętra, attyka; y: 0 = chodnik, 160 = gzyms
  const H = NAR.cor, w = 256, h = 512;
  return canvasTex(512, (g, n) => {
    const X = x => x * n / w, Y = y => n - y / H * n;
    g.fillStyle = GREY; g.fillRect(0, 0, n, n);
    const bw = front ? 256 : 256;                                                // cała tekstura = jedna oś okienna
    const win = (x0, x1, y0, y1, frame = '#f1f1f2', glass = GLASS, sill = true) => {
      g.fillStyle = frame; g.fillRect(X(x0) - 8, Y(y1) - 8, X(x1) - X(x0) + 16, Y(y0) - Y(y1) + 16);
      const gr = g.createLinearGradient(0, Y(y1), 0, Y(y0)); gr.addColorStop(0, glass[0]); gr.addColorStop(1, glass[1]);
      g.fillStyle = gr; g.fillRect(X(x0), Y(y1), X(x1) - X(x0), Y(y0) - Y(y1));
      g.fillStyle = '#f7f7f8'; g.fillRect((X(x0) + X(x1)) / 2 - 3, Y(y1), 6, Y(y0) - Y(y1)); g.fillRect(X(x0), Y(y0 + (y1 - y0) * 0.72) - 3, X(x1) - X(x0), 6);
      if (sill) { g.fillStyle = BAND; g.fillRect(X(x0) - 14, Y(y0) + 6, X(x1) - X(x0) + 28, 10); }
    };
    // parter: cokół z kamienia, witryna w brązowej ramie
    g.fillStyle = '#8e8c86'; g.fillRect(0, Y(9), n, n - Y(9));
    const R = rng(front ? 5 : 6);
    for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(${R() < 0.5 ? '255,255,255' : '0,0,0'},${0.06 + R() * 0.1})`; g.fillRect(R() * n, Y(9) + R() * (n - Y(9)), 20 + R() * 40, 6 + R() * 10); }
    g.fillStyle = '#7a5a3c'; g.fillRect(X(40), Y(42), X(216) - X(40), Y(10) - Y(42));
    const gr = g.createLinearGradient(0, Y(40), 0, Y(12)); gr.addColorStop(0, '#5f7483'); gr.addColorStop(1, '#27343e');
    g.fillStyle = gr; g.fillRect(X(48), Y(40), X(208) - X(48), Y(12) - Y(40));
    g.fillStyle = BAND; g.fillRect(0, Y(52), n, Y(46) - Y(52));                                   // gzyms nad parterem
    g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(0, Y(46), n, 4);
    // I i II piętro, płyciny z rozetami między oknami
    win(78, 178, 62, 86); win(78, 178, 98, 121);
    g.fillStyle = '#ecedee'; g.fillRect(X(84), Y(95), X(172) - X(84), Y(87) - Y(95));
    g.strokeStyle = '#c9ccd0'; g.lineWidth = 3; g.strokeRect(X(88), Y(94.3), X(168) - X(88), Y(87.7) - Y(94.3));
    g.beginPath(); g.arc(X(128), Y(91), 12, 0, 7); g.stroke();
    // gzyms główny i attyka z małymi oknami
    g.fillStyle = BAND; g.fillRect(0, Y(131), n, Y(123) - Y(131)); g.fillStyle = 'rgba(0,0,0,.1)'; g.fillRect(0, Y(123), n, 5);
    win(86, 170, 134, 149, '#f1f1f2', GLASS, false);
    g.fillStyle = BAND; g.fillRect(0, Y(160), n, Y(153) - Y(160));
    g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(0, Y(153), n, 4);
    if (!front) { g.fillStyle = 'rgba(0,0,0,.05)'; g.fillRect(0, Y(122), 10, Y(52) - Y(122)); g.fillRect(n - 10, Y(122), 10, Y(52) - Y(122)); }
  });
}
function signTex(text, bg, fg) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 96; const g = c.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, 512, 96); g.fillStyle = fg; g.font = '700 52px "Barlow Condensed", Arial, sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 256, 50);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function rubbleTex() {                                                          // mur z łamanego kamienia (granit)
  return canvasTex(256, (g, n) => {
    const R = rng(1111); g.fillStyle = '#5f615f'; g.fillRect(0, 0, n, n);
    for (let y = 0; y < n; y += 22) for (let x = -(y % 44 ? 20 : 0); x < n; x += 30 + R() * 16) {
      const k = 0.7 + R() * 0.45, c = Math.round(140 * k);
      g.fillStyle = `rgb(${c},${c + 2},${c - 3})`;
      g.beginPath(); g.moveTo(x + 2, y + 2 + R() * 3); g.lineTo(x + 26 + R() * 10, y + 1 + R() * 3); g.lineTo(x + 28 + R() * 10, y + 19 - R() * 3); g.lineTo(x + 1, y + 20 - R() * 3); g.closePath(); g.fill();
    }
  });
}

function buildNarozna(group, solid) {
  const std = o => new THREE.MeshStandardMaterial({ roughness: 0.85, ...o });
  const [ax, az] = NAR.a, [bx, bz] = NAR.b, L = Math.hypot(bx - ax, bz - az), ux = (bx - ax) / L, uz = (bz - az) / L;
  const nx = -uz, nz = ux;                                                       // na zewnątrz frontu
  const G = new THREE.Group(); G.position.set(ax, CURB, az); G.rotation.y = Math.atan2(-uz, ux); group.add(G);
  const add = (geo, mat, parent = G) => { const m = new THREE.Mesh(geo, mat); parent.add(m); return m; };
  const box = (x0, x1, y0, y1, z0, z1, mat, parent = G) => add(new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0).translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2), mat, parent);
  const toL = ([x, z]) => [(x - ax) * ux + (z - az) * uz, (x - ax) * nx + (z - az) * nz];
  const white = std({ color: 0xeef0f2 }), band = std({ color: 0xd7d9dc });

  // front: elewacja 5 osi (tekstura) + pilastry wielkiego porządku przez I i II piętro, gzymsy
  const fT = narFacadeTex(true); fT.repeat.set(5, 1);
  add(new THREE.PlaneGeometry(L, NAR.cor + 2).translate(L / 2, NAR.cor / 2 - 1, 0.5), std({ map: fT }));
  for (const x of [0, L]) box(x - 6, x + 6, -1, NAR.cor, -8, 1, std({ map: narFacadeTex(false) }));   // narożniki domknięte z boku
  for (let i = 0; i <= 5; i++) {
    const x = i * L / 5 + (i === 0 ? 4 : i === 5 ? -4 : 0);
    box(x - 5, x + 5, 52, 123, 0.5, 3.2, white);                                 // pilaster
    box(x - 7, x + 7, 118, 123, 0.5, 4.2, band);                                   // głowica
  }
  box(-4, L + 4, 123, 131, 0, 5.5, band); box(-5, L + 5, 153, 161, 0, 7, band); box(-3, L + 3, 46, 52, 0, 4.2, band);
  // szyldy nad witrynami (ogólne, bez logotypów)
  const signs = [['BAR', '#c8241c', '#ffe08a'], ['BAR', '#c8241c', '#ffe08a'], null, ['DROGERIA', '#d8237a', '#ffffff'], ['DROGERIA', '#d8237a', '#ffffff']];
  signs.forEach((s, i) => { if (!s) return; const x = (i + 0.5) * L / 5; add(new THREE.PlaneGeometry(30, 5).translate(x, 39.5, 0.8), std({ map: signTex(...s), roughness: 0.5 })); });
  box(L / 2 - 9, L / 2 + 9, NAR.T, 40, 0.2, 1.2, std({ color: 0x3b3a38, metalness: 0.4, roughness: 0.4 }));        // drzwi wejściowe
  box(L / 2 - 11, L / 2 + 11, 40, 42.5, 0, 8, std({ color: 0x4a4540, metalness: 0.5, roughness: 0.4 }));           // daszek nad wejściem

  // mury pozostałych ścian z obrysu (świat): ta sama elewacja, oś co ok. 2,6 m
  const ring = NAR.ring[0];
  const sT = narFacadeTex(false), sM = std({ map: sT });
  const A = newArr(false), f = ringArea2(ring) > 0 ? 1 : -1;
  let acc = 0;
  for (let i = 0; i < ring.length; i += 2) {
    const j = (i + 2) % ring.length, x0 = ring[i], z0 = ring[i + 1], x1 = ring[j], z1 = ring[j + 1];
    const dx = x1 - x0, dz = z1 - z0, len = Math.hypot(dx, dz); if (len < 0.01) continue;
    const [mx, mz] = toL([(x0 + x1) / 2, (z0 + z1) / 2]);
    const u0 = acc / 26, u1 = (acc + len) / 26; acc += len;
    if (mz > -6 && mx > -2 && mx < L + 2) continue;                              // front ma własną elewację
    const wnx = f * dz / len, wnz = -f * dx / len, y0 = -2, y1 = NAR.cor + CURB;
    const a = [x0, y0, z0, u0, -2 / NAR.cor], b = [x1, y0, z1, u1, -2 / NAR.cor], c = [x1, y1, z1, u1, (NAR.cor + CURB) / NAR.cor], dd = [x0, y1, z0, u0, (NAR.cor + CURB) / NAR.cor];
    for (const v of f > 0 ? [a, c, b, a, dd, c] : [a, b, c, a, c, dd]) { A.pos.push(v[0], v[1], v[2]); A.nor.push(wnx, 0, wnz); A.uv.push(v[3], v[4] - CURB / NAR.cor); }
    // gzymsy jako listwy wzdłuż ściany
    for (const [yy, hh, dp] of [[CURB + 123, 8, 5], [CURB + 153, 8, 6.5], [CURB + 46, 6, 3.5]]) {
      const ledge = new THREE.Mesh(new THREE.BoxGeometry(len + 4, hh, dp).rotateY(Math.atan2(-dz, dx)).translate((x0 + x1) / 2 + wnx * dp / 2, yy + hh / 2, (z0 + z1) / 2 + wnz * dp / 2), band);
      group.add(ledge);
    }
  }
  const walls = new THREE.Mesh(arrGeo(A), sM); group.add(walls);
  group.add(new THREE.Mesh(flatGeo([[ring]], NAR.cor + CURB, 1 / 40), std({ color: 0x77706a })));
  const bb = ringBox(ring); gridPut(solid, bb[0], bb[1], bb[2], bb[3], { p: [ring], b: bb });

  // mansarda nad bryłą główną: stromy pas z blachy, niski dach z dachówki, lukarny z łukowym daszkiem
  const quad = [NAR.a, NAR.b, NAR.d, NAR.e].map(toL);                           // lokalnie, przeciwnie do ruchu wskazówek lub zgodnie
  const inset = (Q, d) => {                                                        // przesunięcie krawędzi do środka i przecięcie sąsiednich
    const c = Q.reduce((s, p) => [s[0] + p[0] / 4, s[1] + p[1] / 4], [0, 0]);
    const lines = Q.map((p, i) => { const q = Q[(i + 1) % 4], ex = q[0] - p[0], ez = q[1] - p[1], l = Math.hypot(ex, ez); let px = -ez / l, pz = ex / l;
      if ((c[0] - p[0]) * px + (c[1] - p[1]) * pz < 0) { px = -px; pz = -pz; } return [p[0] + px * d, p[1] + pz * d, ex, ez]; });
    return lines.map((l1, i) => { const l0 = lines[(i + 3) % 4], det = l0[2] * -l1[3] + l1[2] * l0[3], t = ((l1[0] - l0[0]) * -l1[3] + l1[2] * (l1[1] - l0[1])) / det; return [l0[0] + l0[2] * t, l0[1] + l0[3] * t]; });
  };
  const band3 = (Q0, y0, Q1, y1, mat) => {                                        // pas skośny między dwoma czworobokami
    const pos = [];
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4, p = [Q0[i][0], y0, Q0[i][1]], q = [Q0[j][0], y0, Q0[j][1]], r = [Q1[j][0], y1, Q1[j][1]], s = [Q1[i][0], y1, Q1[i][1]]; pos.push(...p, ...q, ...r, ...p, ...r, ...s); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals();
    return add(g, mat);
  };
  const Y0 = NAR.cor + 1, Q1 = inset(quad, 5), Q2 = inset(quad, 95);
  const zinc = std({ color: 0x93a4b2, metalness: 0.55, roughness: 0.4, side: THREE.DoubleSide });
  const tile = std({ color: 0xa9553a, roughness: 0.8, side: THREE.DoubleSide });
  band3(quad, Y0, Q1, Y0 + 7, zinc);                                               // blaszany okap
  band3(Q1, Y0 + 7, Q2, Y0 + 44, tile);                                            // połać z czerwonej dachówki
  const cap = new THREE.Shape(Q2.map(([x, z]) => new THREE.Vector2(x, -z)));
  add(new THREE.ShapeGeometry(cap).rotateX(-Math.PI / 2).translate(0, Y0 + 44, 0), tile);
  box(-2, 2, Y0 + 44, Y0 + 110, -2, 2, std({ color: 0x55595d, metalness: 0.7 }), G).position.set(...(() => { const c = Q2.reduce((s, p) => [s[0] + p[0] / 4, s[1] + p[1] / 4], [0, 0]); return [c[0], 0, c[1]]; })());   // maszt
  const dormer = (p, q, t) => {                                                  // lukarna na krawędzi p→q w ułamku t
    const ex = q[0] - p[0], ez = q[1] - p[1], l = Math.hypot(ex, ez), ox = ez / l, oz = -ex / l, cx = p[0] + ex * t, cz = p[1] + ez * t;
    const D = new THREE.Group(); D.position.set(cx - ox * 16, Y0 + 6, cz - oz * 16); D.rotation.y = Math.atan2(ox, oz); G.add(D);   // lokalne +z lukarny = na zewnątrz
    box(-8, 8, 0, 14, -10, 2, zinc, D);
    add(new THREE.CylinderGeometry(8.6, 8.6, 13, 16, 1, false, 0, Math.PI).rotateZ(Math.PI / 2).rotateY(Math.PI / 2).translate(0, 14, -4), zinc, D);
    box(-5.2, 5.2, 2, 13, 2, 2.4, white, D); box(-4.2, 4.2, 3, 12.2, 2.4, 2.7, std({ color: 0x2f3c47, roughness: 0.2, metalness: 0.3 }), D);
  };
  // kierunek „na zewnątrz” krawędzi: sprawdzamy względem środka
  const Cq = quad.reduce((s, p) => [s[0] + p[0] / 4, s[1] + p[1] / 4], [0, 0]);
  const outEdge = (p, q) => { const ex = q[0] - p[0], ez = q[1] - p[1]; return ((Cq[0] - p[0]) * ez - (Cq[1] - p[1]) * ex) > 0 ? [q, p] : [p, q]; };   // normalna (ez, −ex) ma wskazywać na zewnątrz
  for (const t of [0.3, 0.5, 0.7]) dormer(...outEdge(quad[0], quad[1]), t);
  for (const t of [0.12, 0.25, 0.38, 0.5, 0.62, 0.75, 0.88]) dormer(...outEdge(quad[3], quad[0]), t);

  // taras przed frontem: mur z łamanego kamienia, posadzka, schody na obu końcach z poręczami
  const rub = rubbleTex(); const rubM = std({ map: rub, roughness: 0.95 });
  const T = NAR.T, TD = NAR.TD, ST = NAR.ST, top = std({ map: speckle('#c9c6bf', 0.14, 4, 71) });
  const wall = new THREE.BoxGeometry(L - 2 * ST, T, TD), uvw = wall.attributes.uv;
  for (let i = 0; i < uvw.count; i++) { const fc = Math.floor(i / 4); uvw.setXY(i, uvw.getX(i) * (fc < 2 ? TD : fc < 4 ? L : L) / 40, uvw.getY(i) * (fc === 2 || fc === 3 ? TD : T) / 40); }
  add(wall.translate(L / 2, T / 2, TD / 2), [rubM, rubM, top, rubM, rubM, rubM]);
  const stepM = std({ color: 0xb9b6ae }), rail = std({ color: 0x3a3f44, metalness: 0.7, roughness: 0.35 });
  for (const [x0, dir] of [[0, 1], [L, -1]]) {
    const n = 7;
    for (let k = 0; k < n; k++) {
      const h = (k + 1) * T / n, xa = x0 + dir * k * ST / n, xb = x0 + dir * (k + 1) * ST / n;
      box(Math.min(xa, xb), Math.max(xa, xb), 0, h, 4, TD, stepM);
    }
    box(Math.min(x0, x0 + dir * ST), Math.max(x0, x0 + dir * ST), 0, T, 0, 4, rubM);        // murek od ulicy
    for (const z of [5, TD - 1]) {                                                              // poręcze
      const p0 = [x0 + dir * 1, 9, z], p1 = [x0 + dir * (ST - 1), T + 9, z];
      add(rodBetween(p0, p1, 0.35, 8), rail);
      for (const t of [0, 0.5, 1]) { const px = p0[0] + (p1[0] - p0[0]) * t, py = p0[1] + (p1[1] - p0[1]) * t; add(rodBetween([px, py - 9, z], [px, py, z], 0.3, 6), rail); }
    }
  }
  // słupki biało-czerwone z łańcuchem przy krawędzi tarasu (jak na zdjęciach)
  const stripe = canvasTex(64, (g, n) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#f2f2f2' : '#d42a24'; g.fillRect(0, i * n / 8, n, n / 8); } });
  const postM = std({ map: stripe, roughness: 0.5 }), chainM = std({ color: 0xd9d9d9, metalness: 0.8, roughness: 0.3 });
  let prev = null;
  for (let x = ST + 4; x <= L - ST - 4; x += (L - 2 * ST - 8) / 4) {
    add(new THREE.CylinderGeometry(0.9, 0.9, 11, 10).translate(x, T + 5.5, TD - 3), postM);
    if (prev !== null) { const c = new THREE.QuadraticBezierCurve3(V(prev, T + 9, TD - 3), V((prev + x) / 2, T + 4, TD - 3), V(x, T + 9, TD - 3)); add(new THREE.TubeGeometry(c, 12, 0.18, 5), chainM); }
    prev = x;
  }
  // przeszkoda: taras ze schodami
  const tr = [[0, 0], [L, 0], [L, TD], [0, TD]].map(([x, z]) => [ax + ux * x + nx * z, az + uz * x + nz * z]).flat(), tb = ringBox(tr);
  gridPut(solid, tb[0], tb[1], tb[2], tb[3], { p: [tr], b: tb });
  return [];
}

function buildCity(D) {
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
  for (const b of D.buildings) {
    const h = b[0], minh = b[1], kind = b[2], ring = b.slice(3);
    if (ring[0] === NAR.first[0] && ring[1] === NAR.first[1]) { NAR.ring = [ring]; continue; }   // kamienica na rogu: model osobny
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
  const jozefM = buildJozef(D, group, solid, posts);
  if (NAR.ring) buildNarozna(group, solid);
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
function streetName(n) {
  return /^(Aleja|Aleje|Plac|Główny|Nowy|Rynek|Most|Rondo|Bulwar|Wał|Skwer|Park|Stary|Rogatka)\b/.test(n) ? n : 'ul. ' + n;
}
function streetAt(x, z) {
  let best = -1, bd = 1e9;
  for (const [x0, z0, x1, z1, id] of cellOf(drive.city.segs, x, z)) {
    const dx = x1 - x0, dz = z1 - z0, L = dx * dx + dz * dz || 1, t = Math.max(0, Math.min(1, ((x - x0) * dx + (z - z0) * dz) / L));
    const d = Math.hypot(x - x0 - dx * t, z - z0 - dz * t);
    if (d < bd) { bd = d; best = id; }
  }
  return best >= 0 && bd < 90 ? streetName(drive.city.names[best]) : 'Kalisz';
}

