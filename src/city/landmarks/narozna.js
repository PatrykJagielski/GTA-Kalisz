import * as THREE from 'three';
import { V, rodBetween } from '../../core/geometry.js';
import { rng } from '../../core/random.js';
import { canvasTex, speckle } from '../../core/textures.js';
import { CURB } from '../config.js';
import { arrGeo, flatGeo, newArr } from '../mesh.js';
import { gridPut, ringArea2, ringBox } from '../spatial.js';

/* ---------- Kamienica na rogu Placu Jana Pawła II i Placu św. Józefa: 4 kondygnacje, mansarda z lukarnami, taras z kamiennym murem i schody ---------- */
// narożniki bryły głównej z OSM (dm): a–b front (5 osi, na NNE), a–e długi bok wzdłuż Placu Jana Pawła II, d–b bok od strony kamienic
export const NAR = { a: [2024, -1502], b: [1826, -1626], d: [1670, -1442], e: [1923, -1283], cor: 160, first: [2024, -1502],
  T: 11, TD: 38, ST: 42 };                                                       // taras: wysokość 1,1 m, głębokość 3,8 m, biegi schodów po 4,2 m
const GREY = '#e3e4e6', BAND = '#d3d5d8', GLASS = ['#6f8494', '#2c3a47'];
function narFacadeTex(front) {                                                  // jedna oś: sklep, dwa piętra, attyka; y: 0 = chodnik, 160 = gzyms
  const H = NAR.cor, w = 256;
  return canvasTex(512, (g, n) => {
    const X = x => x * n / w, Y = y => n - y / H * n;
    g.fillStyle = GREY; g.fillRect(0, 0, n, n);
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

export function buildNarozna(group, solid, ring) {
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
