import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { V } from '../../core/geometry.js';
import { rng } from '../../core/random.js';
import { canvasTex } from '../../core/textures.js';
import { CURB } from '../config.js';
import { gridPut, ringBox } from '../spatial.js';

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

export function buildFountain(FD, group, solid, posts) {
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
  const ring = lo.slice(0, -1).concat(hi.slice(0, -1)).flat(), bb = ringBox(ring), hull = { p: [ring], b: bb };
  gridPut(solid, bb[0], bb[1], bb[2], bb[3], hull);
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
  return { mats: [water, jetM, dand.children[0].material], anim, c: [cx, cz], r: FD.r, hull, floorAt: fountainFloor(FD, y0) };
}

// pieszy na fontannie (auto zatrzymuje cała otoczka): wysokość, na której stoi, albo null poza fontanną;
// korona murków, dno niecek 30 cm pod wodą (brodzi), trzonek dmuchawca jako ściana
function fountainFloor(FD, y0) {
  const [cx, cz] = FD.c, T = FD.tips;
  const c0 = [(T[0][0] + T[1][0] + T[2][0]) / 3, (T[0][1] + T[1][1] + T[2][1]) / 3];
  const inner = T.map(([x, z]) => { const d = Math.hypot(x - c0[0], z - c0[1]), k = 1 - 4.5 / d; return [c0[0] + (x - c0[0]) * k, c0[1] + (z - c0[1]) * k]; });
  const side = (a, b, x, z) => (b[0] - a[0]) * (z - a[1]) - (b[1] - a[1]) * (x - a[0]);
  const inTri = (P, x, z) => { const s0 = side(P[0], P[1], x, z), s1 = side(P[1], P[2], x, z), s2 = side(P[2], P[0], x, z); return (s0 >= 0 && s1 >= 0 && s2 >= 0) || (s0 <= 0 && s1 <= 0 && s2 <= 0); };
  return (x, z) => {
    const d = Math.hypot(x - cx, z - cz);
    if (d < 2.5) return y0 + 40;
    if (inTri(inner, x, z)) return y0 + 7.6;                                    // górna niecka: woda 10,6
    if (inTri(T, x, z)) return y0 + 12;                                        // murek trójkąta
    if (d < 58.8) return y0 + 2;                                               // dolna niecka: woda 5
    if (d < 64.2) return y0 + 7.6;                                             // korona okrągłego murka
    return null;
  };
}
