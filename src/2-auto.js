/* ================= nadwozie: Audi A4 B7 sedan (2005), srebrny metalik ================= */
// wymiary B7 sedan: dł. 4586 mm, szer. 1772 mm, wys. 1427 mm, rozstaw osi 2648 mm, rozstaw kół 1522 mm
const CAR = { front: 22.9, rear: -22.96, W: 8.86, axF: 13.6, axR: -12.88, wr: 3.16, archR: 3.72, trackZ: 7.61 };
const car = new THREE.Group();
const bodyMats = [];
function bodyMat(o) { const m = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, ...o }); m.userData.op = o.opacity ?? 1; bodyMats.push(m); return m; }
const paint = bodyMat({ color: 0xa4abb2, metalness: 0.9, roughness: 0.3 });          // lodowy srebrny metalik
const glassM = bodyMat({ color: 0x1e2a36, metalness: 0.55, roughness: 0.04, transparent: true, opacity: 0.46 });
const trimM = bodyMat({ color: 0x111316, metalness: 0.25, roughness: 0.5 });
const chromeM = bodyMat({ color: 0xe6eaee, metalness: 1, roughness: 0.1 });
const lampM = bodyMat({ color: 0xe9f1f7, metalness: 0.1, roughness: 0.02, transparent: true, opacity: 0.5 });
const reflM = bodyMat({ color: 0xf0f3f6, metalness: 1, roughness: 0.16 });
const redM = bodyMat({ color: 0xb0121c, metalness: 0.25, roughness: 0.12, emissive: 0x420000 });
const amberM = bodyMat({ color: 0xe8901e, metalness: 0.2, roughness: 0.2, emissive: 0x2a1200 });
// polska tablica rejestracyjna 520 × 114 mm: pasek UE z „PL”, czarne znaki; tylna z naklejką legalizacyjną
const PLATE = 'PKA 02209';
function plateTexture(text, sticker) {
  const c = document.createElement('canvas'); c.width = 1040; c.height = 228;
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const draw = () => {
    const g = c.getContext('2d');
    g.fillStyle = '#f6f6f1'; g.fillRect(0, 0, 1040, 228);
    g.fillStyle = '#1f46a8'; g.fillRect(8, 8, 90, 212);
    g.fillStyle = '#ffd200';
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2, cx = 53 + 30 * Math.cos(a), cy = 72 + 30 * Math.sin(a);
      g.beginPath();
      for (let k = 0; k < 10; k++) { const r = k % 2 ? 2.4 : 6, b = -Math.PI / 2 + k * Math.PI / 5; g.lineTo(cx + r * Math.cos(b), cy + r * Math.sin(b)); }
      g.fill();
    }
    g.fillStyle = '#fff'; g.font = '700 60px "Barlow Condensed", "Arial Narrow", Arial, sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.fillText('PL', 53, 192);
    g.lineWidth = 8; g.strokeStyle = '#111'; g.beginPath(); g.roundRect(4, 4, 1032, 220, 16); g.stroke();
    const [a, b] = text.split(' ');
    g.fillStyle = '#111'; g.font = '700 196px "Barlow Condensed", "Arial Narrow", Arial, sans-serif';
    g.textAlign = 'left'; g.textBaseline = 'middle';
    const gap = sticker ? 104 : 56, wa = g.measureText(a).width, wb = g.measureText(b).width;
    const x0 = 570 - (wa + gap + wb) / 2;
    g.fillText(a, x0, 122); g.fillText(b, x0 + wa + gap, 122);
    if (sticker) {                                    // naklejka legalizacyjna między wyróżnikiem a numerem
      const sx = x0 + wa + gap / 2, gr = g.createLinearGradient(sx - 30, 84, sx + 30, 150);
      gr.addColorStop(0, '#e9e9ef'); gr.addColorStop(0.5, '#c9ccd8'); gr.addColorStop(1, '#e4e4ea');
      g.fillStyle = gr; g.beginPath(); g.roundRect(sx - 30, 82, 60, 76, 8); g.fill();
      g.fillStyle = '#d4202a'; g.fillRect(sx - 30, 82, 60, 22);
      g.fillStyle = '#9aa0b4'; g.beginPath(); g.arc(sx, 130, 14, 0, Math.PI * 2); g.fill();
      g.lineWidth = 3; g.strokeStyle = '#6b7080'; g.beginPath(); g.roundRect(sx - 30, 82, 60, 76, 8); g.stroke();
    }
    tex.needsUpdate = true;
  };
  draw();
  if (document.fonts) document.fonts.load('700 196px "Barlow Condensed"').then(draw).catch(() => {});
  return tex;
}
const plateFrontM = bodyMat({ map: plateTexture(PLATE, false), roughness: 0.45 });
const plateRearM = bodyMat({ map: plateTexture(PLATE, true), roughness: 0.45 });
const tireM = bodyMat({ color: 0x151618, roughness: 0.95 });
const rimM = bodyMat({ color: 0xc9ced3, metalness: 0.95, roughness: 0.22 });

/* ---------- profile nadwozia ---------- */
function spline1d(keys) {
  const n = keys.length;
  const m = keys.map((k, i) => { const a = keys[Math.max(0, i - 1)], b = keys[Math.min(n - 1, i + 1)]; return (b[1] - a[1]) / (b[0] - a[0]); });
  return x => {
    if (x <= keys[0][0]) return keys[0][1];
    if (x >= keys[n - 1][0]) return keys[n - 1][1];
    let i = 0; while (keys[i + 1][0] < x) i++;
    const [x0, y0] = keys[i], [x1, y1] = keys[i + 1], h = x1 - x0, t = (x - x0) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * y0 + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * y1 + (t3 - t2) * h * m[i + 1];
  };
}
// górna krawędź dolnej bryły: zderzak tył, klapa bagażnika, linia okien, maska, przód
const topY = spline1d([[-22.96, 6.3], [-22.85, 7.6], [-22.6, 8.9], [-22.2, 9.75], [-21.6, 10.1], [-20, 10.22], [-16.6, 10.25], [-8, 10.02], [0, 9.82],
  [8.6, 9.56], [9.4, 9.5], [12, 9.28], [16, 8.86], [19.5, 8.3], [21.3, 7.85], [22.3, 7.3], [22.7, 6.6], [22.9, 5.8]]);
const shoulderY = spline1d([[-22.96, 8.4], [-18, 9.25], [0, 9.0], [15, 8.6], [22.9, 8.05]]);   // ostra linia boczna
const baseY = spline1d([[-22.96, 3.0], [-21.5, 2.4], [-19.5, 2.1], [19.5, 2.1], [21.8, 2.3], [22.9, 2.75]]);
const roofY = spline1d([[-16.7, 10.12], [-14.8, 11.45], [-12.5, 12.95], [-10.4, 13.8], [-7, 14.15], [-3, 14.27], [0.5, 14.22], [2.4, 14.0], [4.8, 12.62], [7.4, 10.72], [9.4, 9.42]]);
const ROOF_FRONT = 2.6;                 // górna krawędź szyby przedniej / przód dachu
function bottomY(x) {
  let y = baseY(x);
  for (const ax of [CAR.axF, CAR.axR]) { const d = x - ax; if (Math.abs(d) < CAR.archR) y = Math.max(y, CAR.wr + Math.sqrt(CAR.archR ** 2 - d * d)); }
  return y;
}
function halfW(x) {  // rzut z góry: zaokrąglone narożniki zderzaków
  if (x > 15.5) { const u = Math.min(1, (x - 15.5) / 7.8); return CAR.W * Math.pow(1 - Math.pow(u, 2.6), 1 / 2.6); }
  if (x < -16.5) { const u = Math.min(1, (-x - 16.5) / 6.96); return CAR.W * Math.pow(1 - Math.pow(u, 2.7), 1 / 2.7); }
  return CAR.W;
}
// przekrój poprzeczny (połowa, od środka spodu do środka dachu): [z, y, znacznik segmentu, t]
function lowerHalf(x) {
  const w = halfW(x), yb = bottomY(x), yt = topY(x);
  const ys = Math.min(Math.max(shoulderY(x), yb + 1.2), yt - 0.35), lo = yb + (ys - yb) * 0.4;
  return [[0, yb, 'bot'], [w - 0.8, yb, 'p'], [w - 0.3, yb + 0.12, 'p'], [w - 0.1, yb + 0.45, 'p'], [w - 0.04, lo, 'p'],
    [w, ys - 0.5, 'p'], [w, ys - 0.12, 'p'], [w - 0.07, ys + 0.04, 'p'], [w - 0.3, ys + (yt - ys) * 0.55, 'p'],
    [w - 0.7, yt - 0.12, 'p'], [w - 1.6, yt - 0.03, 'lid'], [w * 0.45, yt + 0.05, 'lid'], [0, yt + 0.08, 'p']];
}
function glassHalf(x) {
  const y0 = topY(x) - 0.1, h = Math.max(0.001, roofY(x) - y0), wb = CAR.W - 0.95;
  const wt = wb - Math.min(1.25, h * 0.3), crown = Math.min(0.42, h * 0.22), y1 = y0 + h - crown;
  const pts = [[0, y0 - 0.05, 'gbin', 0], [wb - 0.3, y0 - 0.05, 'gb', 0]];
  const NS = 7, NT = 7;
  for (let i = 0; i < NS; i++) { const t = i / NS; pts.push([wb + (wt - wb) * t + 0.12 * Math.sin(Math.PI * t), y0 + (y1 - y0) * t, 'side', (i + 0.5) / NS]); }
  for (let i = 0; i <= NT; i++) { const u = i / NT, z = wt * (1 - u); pts.push([z, y1 + crown * (1 - (z / wt) ** 2), 'top', u]); }
  return pts;
}
function fullLoop(h) {
  const n = h.length, L = h.map(p => p.slice());
  L[n - 1][2] = h[n - 2][2]; L[n - 1][3] = h[n - 2][3];
  for (let k = n - 2; k >= 1; k--) L.push([-h[k][0], h[k][1], h[k - 1][2], h[k - 1][3]]);
  return L;
}
// bryła z przekrojów: groupOf(x, znacznik, t) -> indeks materiału
function loft(x0, x1, n, halfFn, groupOf, mats) {
  const pos = [], idx = mats.map(() => []);
  let len = 0;
  const loops = [];
  for (let i = 0; i <= n; i++) {
    const x = x0 + (x1 - x0) * i / n, L = fullLoop(halfFn(x)); len = L.length; loops.push([x, L]);
    for (const [z, y] of L) pos.push(x, y, z);
  }
  for (let i = 0; i < n; i++) {
    const xm = (loops[i][0] + loops[i + 1][0]) / 2, L = loops[i][1];
    for (let j = 0; j < len; j++) {
      const a = i * len + j, b = i * len + (j + 1) % len, c = a + len, d = b + len;
      idx[groupOf(xm, L[j][2], L[j][3])].push(a, c, d, a, d, b);
    }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx.flat()); let s = 0;
  idx.forEach((a, k) => { g.addGroup(s, a.length, k); s += a.length; });
  g.computeVertexNormals();
  const mesh = new THREE.Mesh(g, mats); car.add(mesh);
  // osobne zaślepki końców (bez uśredniania normalnych z bokami)
  for (const [x, L] of [loops[0], loops[n]]) {
    const cp = [], cy = L.reduce((s, p) => s + p[1], 0) / L.length;
    for (let j = 0; j < L.length; j++) { const p = L[j], q = L[(j + 1) % L.length]; cp.push(x, cy, 0, x, p[1], p[0], x, q[1], q[0]); }
    const cg = new THREE.BufferGeometry(); cg.setAttribute('position', new THREE.Float32BufferAttribute(cp, 3)); cg.computeVertexNormals();
    car.add(new THREE.Mesh(cg, mats[groupOf(x, 'cap', 0)]));
  }
  return mesh;
}
// kabina otwarta od góry między szybami, żeby przez okna było widać wnętrze
const hiddenM = new THREE.MeshBasicMaterial({ visible: false });
const inCabin = x => x > -16.2 && x < 9.2;
loft(CAR.rear, CAR.front, 340, lowerHalf, (x, tag) => (tag === 'bot' ? 1 : tag === 'lid' && inCabin(x) ? 2 : 0), [paint, trimM, hiddenM]);
loft(-16.7, 9.4, 200, glassHalf, (x, tag, t) => {
  if (tag === 'gbin') return 3;
  if (tag === 'gb' || tag === 'cap') return 2;
  if (tag === 'top') return t < 0.12 || (x <= ROOF_FRONT && x >= -10.3) ? 1 : 0;   // słupki A/C i dach w kolorze nadwozia
  if (t > 0.86) return 1;                                                  // rynienka dachu
  if (t < 0.1 || x > 8.0 || (x > -3.45 && x < -2.45)) return 2;            // uszczelka, trójkąt lusterka, słupek B
  if (x < -12.4) return 1;                                                 // szeroki słupek C
  return 0;
}, [glassM, paint, trimM, hiddenM]);

/* ---------- detale dopasowane do powierzchni ---------- */
function inPoly(L, z, y) {
  let c = false;
  for (let i = 0, j = L.length - 1; i < L.length; j = i++) {
    const [zi, yi] = L[i], [zj, yj] = L[j];
    if ((yi > y) !== (yj > y) && z < (zj - zi) * (y - yi) / (yj - yi) + zi) c = !c;
  }
  return c;
}
const inBody = (x, z, y) => inPoly(fullLoop(lowerHalf(x)), z, y);
function surfX(z, y, front) {           // gdzie zaczyna się karoseria patrząc z przodu / z tyłu
  const a = front ? CAR.front : CAR.rear, dir = front ? -1 : 1;
  let prev = a, x = a;
  for (let s = 0; s < 200; s++) { x = a + dir * s * 0.08; if (inBody(x, z, y)) break; prev = x; }
  let o = prev, i = x;
  for (let k = 0; k < 12; k++) { const m = (o + i) / 2; inBody(m, z, y) ? (i = m) : (o = m); }
  return i;
}
function sideZ(x, y) {
  const h = lowerHalf(x); let best = 0;
  for (let i = 0; i < h.length - 1; i++) {
    const [z0, y0] = h[i], [z1, y1] = h[i + 1];
    if (y0 !== y1 && (y0 - y) * (y1 - y) <= 0) best = Math.max(best, z0 + (z1 - z0) * (y - y0) / (y1 - y0));
  }
  return best;
}
const tess = new TessellateModifier(0.22, 8);
function outlineGeom(outline) {
  const g = new THREE.ShapeGeometry(new THREE.Shape(outline.map(([a, b]) => new THREE.Vector2(a, b))), 4);
  return tess.modify(g);
}
// dekal na przodzie (front=true) lub tyle; outline w rzucie [z, y]; off = odsunięcie wzdłuż normalnej
function faceDecal(outline, front, off, mat, mirror = true, uvBox = null) {
  const make = (sgn) => {
    const g = outlineGeom(outline.map(([z, y]) => [z * sgn, y])), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const z = p.getX(i), y = p.getY(i), x = surfX(z, y, front), e = 0.06;
      const dz = (surfX(z + e, y, front) - surfX(z - e, y, front)) / (2 * e), dy = (surfX(z, y + e, front) - surfX(z, y - e, front)) / (2 * e);
      const nn = (front ? V(1, -dy, -dz) : V(-1, dy, dz)).normalize();   // normalna zewnętrzna
      if (uvBox) {                      // tekstura czytelna dla patrzącego z przodu lub z tyłu
        const [z0, y0, z1, y1] = uvBox;
        g.attributes.uv.setXY(i, front ? (z1 - z) / (z1 - z0) : (z - z0) / (z1 - z0), (y - y0) / (y1 - y0));
      }
      p.setXYZ(i, x + nn.x * off, y + nn.y * off, z + nn.z * off);
    }
    g.computeVertexNormals(); const m = new THREE.Mesh(g, mat); car.add(m); return m;
  };
  make(1); if (mirror) make(-1);
}
// dekal na boku: outline w rzucie [x, y], obie strony auta
// strony: +1 = prawa (+z), −1 = lewa (−z, strona kierowcy)
function sideDecal(outline, off, mat, sides = [1, -1]) {
  for (const sgn of sides) {
    const g = outlineGeom(outline), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setXYZ(i, x, y, sgn * (sideZ(x, y) + off)); }
    g.computeVertexNormals(); car.add(new THREE.Mesh(g, mat));
  }
}
function strip(pts, w) {                 // cienki pasek wzdłuż łamanej -> obrys
  const L = [], R = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1]; const l = Math.hypot(tx, ty); tx /= l; ty /= l;
    L.push([p[0] - ty * w / 2, p[1] + tx * w / 2]); R.push([p[0] + ty * w / 2, p[1] - tx * w / 2]);
  });
  return L.concat(R.reverse());
}
const circle = (cz, cy, r, n = 28) => Array.from({ length: n }, (_, i) => [cz + r * Math.cos(i / n * 6.283), cy + r * Math.sin(i / n * 6.283)]);
const rect = (z0, y0, z1, y1) => [[z0, y0], [z1, y0], [z1, y1], [z0, y1]];
function rings(x, y, facing) {           // cztery pierścienie
  for (let i = 0; i < 4; i++) {
    const t = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.055, 10, 36), chromeM);
    t.position.set(x, y, (i - 1.5) * 0.52); t.rotation.y = Math.PI / 2; t.rotation.x = 0; if (facing) t.rotation.z = facing;
    car.add(t);
  }
}

// grill single-frame (węższy u góry, ścięte narożniki), chromowana ramka, poziome listwy
const grillHalf = [[0, 7.38], [2.95, 7.38], [3.35, 7.05], [3.8, 3.55], [3.5, 3.05], [0, 3.05]];
const grillOut = grillHalf.concat(grillHalf.slice(1, -1).reverse().map(([z, y]) => [-z, y]));
const shrink = (pts, k) => { const cz = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length; return pts.map(([z, y]) => [cz + (z - cz) * k, cy + (y - cy) * k]); };
const grow = (pts, d) => pts.map(([z, y]) => [z + Math.sign(z) * d, y + (y > 5 ? d : -d)]);
faceDecal(grow(grillOut, 0.16), true, 0.05, chromeM, false);
faceDecal(grillOut, true, 0.09, trimM, false);
for (let y = 3.5; y < 7.1; y += 0.42) {
  if (y > 3.6 && y < 5.0) continue;                   // miejsce na tablicę
  const k = (y - 3.05) / 4.33, hw = 3.7 - k * 0.55;
  faceDecal(rect(-hw, y, hw, y + 0.08), true, 0.13, chromeM, false);
}
faceDecal(rect(-2.6, 3.72, 2.6, 4.86), true, 0.17, plateFrontM, false, [-2.6, 3.72, 2.6, 4.86]);
rings(surfX(0, 6.5, true) + 0.28, 6.55);
// reflektory B7: kanciaste, zawinięte na bok
const headL = [[3.7, 7.36], [6.4, 7.5], [7.9, 7.36], [8.6, 6.98], [8.45, 6.55], [7.2, 6.3], [5.2, 6.0], [3.8, 5.72]];
faceDecal(headL, true, 0.03, trimM);
faceDecal(shrink(headL, 0.88), true, 0.05, reflM);
for (const [cz, cy, r] of [[4.7, 6.62, 0.44], [6.4, 6.8, 0.4]]) { faceDecal(circle(cz, cy, r), true, 0.07, chromeM); faceDecal(circle(cz, cy, r * 0.45), true, 0.09, trimM); }
faceDecal([[7.25, 6.62], [8.2, 6.78], [8.2, 6.98], [7.25, 6.86]], true, 0.07, amberM);
faceDecal(headL, true, 0.12, lampM);
// wloty i halogeny w zderzaku
const intake = [[4.6, 2.95], [7.2, 3.05], [7.6, 4.05], [4.85, 4.15]];
faceDecal(intake, true, 0.04, trimM);
faceDecal(circle(6.25, 3.6, 0.36), true, 0.07, reflM);
faceDecal(circle(6.25, 3.6, 0.36), true, 0.1, lampM);
faceDecal(rect(-3.3, 2.78, 3.3, 2.95), true, 0.04, trimM, false);

// tył: lampy dzielone między klapę a błotnik, tablica na klapie, pierścienie
const tailL = [[3.1, 9.95], [7.4, 9.98], [8.5, 9.7], [8.75, 9.2], [8.2, 8.75], [3.1, 8.95]];
faceDecal(tailL, false, 0.04, redM);
faceDecal([[3.3, 9.08], [5.2, 9.05], [5.2, 9.32], [3.3, 9.35]], false, 0.07, lampM);
faceDecal([[5.25, 9.08], [6.4, 9.05], [6.4, 9.3], [5.25, 9.33]], false, 0.07, amberM);
faceDecal(rect(5.58, 8.9, 5.66, 10.02), false, 0.09, trimM);
faceDecal(rect(-2.6, 7.2, 2.6, 8.34), false, 0.05, plateRearM, false, [-2.6, 7.2, 2.6, 8.34]);
faceDecal(rect(-3.0, 8.45, 3.0, 8.56), false, 0.05, chromeM, false);
rings(surfX(0, 9.25, false) - 0.22, 9.25);
faceDecal(rect(-6.8, 3.1, 6.8, 3.5), false, 0.03, trimM, false);
faceDecal(rect(-7.0, 6.3, 7.0, 6.38), false, 0.03, trimM, false);

// boki: szczeliny drzwi, klamki, listwa progowa
sideDecal(strip([[9.35, 2.45], [9.35, 8.0], [9.2, 9.42]], 0.05), 0.02, trimM);
sideDecal(strip([[-2.95, 2.45], [-2.95, 9.6]], 0.05), 0.02, trimM);
sideDecal(strip([[-9.05, 2.45], [-9.05, 4.6], [-9.7, 6.0], [-10.9, 7.0], [-12.1, 8.0], [-12.35, 9.9]], 0.05), 0.02, trimM);
sideDecal(strip([[-16.8, 8.3], [-15.4, 8.3], [-15.4, 9.15], [-16.8, 9.15], [-16.8, 8.3]], 0.04), 0.025, trimM, [1]);  // klapka wlewu tylko po prawej
for (const x of [1.9, -8.3]) for (const s of [1, -1]) {
  const h = new THREE.Mesh(rbox(1.15, 0.3, 0.22, 0.1), paint); h.position.set(x, 9.05, s * (sideZ(x, 9.05) + 0.07)); car.add(h);
}
// lusterka z kierunkowskazem
for (const s of [1, -1]) {
  const g = new THREE.Group(); g.position.set(8.35, 10.2, s * (CAR.W - 0.3)); car.add(g);
  const arm = new THREE.Mesh(rbox(0.9, 0.35, 0.8, 0.12), trimM); arm.position.set(0, -0.15, s * 0.3); g.add(arm);
  const shell = new THREE.Mesh(rbox(1.0, 0.82, 1.45, 0.3), paint); shell.position.set(-0.05, 0.1, s * 1.05); shell.rotation.y = s * 0.12; g.add(shell);
  const glass = new THREE.Mesh(rbox(0.06, 0.66, 1.25, 0.03), reflM); glass.position.set(-0.56, 0.1, s * 1.05); glass.rotation.y = s * 0.12; g.add(glass);
  const ind = new THREE.Mesh(rbox(0.5, 0.08, 0.9, 0.03), amberM); ind.position.set(0.15, -0.3, s * 1.2); g.add(ind);
}
// wycieraczki
for (const z of [-3.9, 1.2]) car.add(new THREE.Mesh(rodBetween([9.0, 9.62, z - 2.6], [8.1, 10.25, z + 2.6], 0.06, 8), trimM));
/* ---------- wnętrze (widoczne przez szyby) ---------- */
const leatherM = bodyMat({ color: 0x2c2e32, roughness: 0.72 });
const clothM = bodyMat({ color: 0x46494f, roughness: 0.95 });
const dashM = bodyMat({ color: 0x1c1e21, roughness: 0.62 });
const aluM = bodyMat({ color: 0xaab0b6, metalness: 0.9, roughness: 0.3 });
const headM = bodyMat({ color: 0xbdb9b1, roughness: 0.95 });
const carpetM = bodyMat({ color: 0x19191b, roughness: 1 });
const screenM = bodyMat({ color: 0x07080a, roughness: 0.25 });
const ledM = bodyMat({ color: 0x250302, emissive: 0xff2a14, emissiveIntensity: 0.9, roughness: 0.4 });   // czerwone podświetlenie Audi
const put = (geom, mat, pos, rot = [0, 0, 0], parent = car) => { const m = new THREE.Mesh(geom, mat); m.position.set(...pos); m.rotation.set(...rot); parent.add(m); return m; };
const grp = (pos, rot = [0, 0, 0], parent = car) => { const g = new THREE.Group(); g.position.set(...pos); g.rotation.set(...rot); parent.add(g); return g; };

// tarcze zegarów: łuk 270°, wskazówka, opcjonalne czerwone pole
function dialTexture(max, minor, labelStep, label, red) {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const draw = () => {
    const g = c.getContext('2d'), a0 = Math.PI * 0.75, a1 = Math.PI * 2.25, ang = v => a0 + (a1 - a0) * v / max;
    g.clearRect(0, 0, 256, 256);
    g.fillStyle = '#0b0c0e'; g.beginPath(); g.arc(128, 128, 126, 0, 7); g.fill();
    g.strokeStyle = '#c9cdd3'; g.lineWidth = 6; g.beginPath(); g.arc(128, 128, 122, 0, 7); g.stroke();
    if (red) { g.strokeStyle = '#d0141e'; g.lineWidth = 12; g.beginPath(); g.arc(128, 128, 102, ang(red), a1); g.stroke(); }
    g.strokeStyle = g.fillStyle = '#f2f2f2'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '600 24px "Barlow Condensed", "Arial Narrow", Arial, sans-serif';
    for (let v = 0; v <= max + 1e-6; v += minor) {
      const a = ang(v), major = Math.abs(v / labelStep - Math.round(v / labelStep)) < 1e-6, r2 = major ? 88 : 98;
      g.lineWidth = major ? 4 : 2; g.beginPath(); g.moveTo(128 + 110 * Math.cos(a), 128 + 110 * Math.sin(a)); g.lineTo(128 + r2 * Math.cos(a), 128 + r2 * Math.sin(a)); g.stroke();
      if (major) g.fillText(String(v), 128 + 70 * Math.cos(a), 128 + 70 * Math.sin(a));
    }
    g.fillStyle = '#9aa0a8'; g.font = '500 15px "IBM Plex Sans", Arial, sans-serif'; g.fillText(label, 128, 182);
    const av = ang(max * 0.1);
    g.strokeStyle = '#ff2a14'; g.lineWidth = 5; g.beginPath(); g.moveTo(128, 128); g.lineTo(128 + 100 * Math.cos(av), 128 + 100 * Math.sin(av)); g.stroke();
    g.fillStyle = '#2a2c30'; g.beginPath(); g.arc(128, 128, 13, 0, 7); g.fill();
    tex.needsUpdate = true;
  };
  draw();
  if (document.fonts) document.fonts.load('600 24px "Barlow Condensed"').then(draw).catch(() => {});
  return tex;
}

// deska rozdzielcza: profil boczny wyciągnięty na szerokość kabiny
{
  const s = new THREE.Shape();
  [[8.75, 9.3], [6.6, 10.2], [5.6, 10.3], [5.15, 10.05], [5.0, 9.3], [5.25, 8.3], [5.9, 7.2], [6.7, 6.2], [8.6, 5.9], [9.1, 6.6]]
    .forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: 14.0, bevelEnabled: true, bevelSize: 0.18, bevelThickness: 0.25, bevelSegments: 3 });
  g.translate(0, 0, -7.0);
  put(g, dashM, [0, 0, 0]);
}
put(rbox(0.1, 0.16, 13.4, 0.04), aluM, [5.0, 8.95, 0]);                      // aluminiowa listwa
put(rbox(1.5, 0.8, 4.2, 0.35), dashM, [5.75, 10.45, -3.7]);                   // daszek nad zegarami
put(rbox(0.12, 1.45, 3.7, 0.08), screenM, [5.02, 9.72, -3.7]);                // tło zegarów
const tacho = new THREE.Mesh(new THREE.CircleGeometry(0.64, 40), bodyMat({ map: dialTexture(6, 0.5, 1, '1/min ×1000', 4.5), roughness: 0.4 }));
tacho.geometry.rotateY(-Math.PI / 2); tacho.position.set(4.95, 9.72, -4.5); car.add(tacho);
const speedo = new THREE.Mesh(new THREE.CircleGeometry(0.64, 40), bodyMat({ map: dialTexture(260, 10, 40, 'km/h', 0), roughness: 0.4 }));
speedo.geometry.rotateY(-Math.PI / 2); speedo.position.set(4.95, 9.72, -2.9); car.add(speedo);
put(rbox(0.05, 0.5, 0.42, 0.03), ledM, [4.96, 9.62, -3.7]);                   // wyświetlacz między zegarami
for (const z of [-6.2, 6.2]) put(rbox(0.14, 0.45, 0.95, 0.08), screenM, [5.05, 9.45, z]);   // nawiewy boczne

// konsola środkowa: nawiewy, radio, Climatronic
{
  const g = grp([5.45, 8.2, 0], [0, 0, 0.4]);
  put(rbox(0.35, 2.9, 2.6, 0.12), dashM, [0, 0, 0], [0, 0, 0], g);
  for (const z of [-0.62, 0.62]) {
    put(rbox(0.1, 0.55, 1.05, 0.06), screenM, [-0.2, 1.05, z], [0, 0, 0], g);
    for (const y of [0.9, 1.05, 1.2]) put(box(0.12, 0.03, 0.95), aluM, [-0.24, y, z], [0, 0, 0], g);
  }
  put(rbox(0.1, 0.2, 0.2, 0.04), ledM, [-0.22, 0.66, 0], [0, 0, 0], g);        // światła awaryjne
  put(rbox(0.1, 0.78, 2.3, 0.06), screenM, [-0.2, 0.2, 0], [0, 0, 0], g);       // radio
  put(rbox(0.11, 0.2, 1.1, 0.03), ledM, [-0.23, 0.36, 0], [0, 0, 0], g);
  for (const z of [-0.88, 0.88]) put(cyl(0.13, 0.12, 'x', 20), aluM, [-0.28, 0.14, z], [0, 0, 0], g);
  put(rbox(0.1, 0.62, 2.3, 0.06), screenM, [-0.2, -0.62, 0], [0, 0, 0], g);    // Climatronic
  for (const z of [-0.62, 0.62]) put(rbox(0.11, 0.15, 0.46, 0.03), ledM, [-0.23, -0.52, z], [0, 0, 0], g);
  for (let i = 0; i < 5; i++) put(rbox(0.1, 0.1, 0.3, 0.03), aluM, [-0.24, -0.8, -0.8 + i * 0.4], [0, 0, 0], g);
}
put(rbox(6.6, 1.5, 2.3, 0.3), dashM, [2.2, 5.6, 0]);                         // tunel i konsola
put(rbox(2.6, 0.4, 2.2, 0.18), leatherM, [0.0, 6.95, 0]);                    // podłokietnik
put(cyl(0.34, 0.3, 'y', 18, 0.5), leatherM, [4.0, 6.5, 0]);                  // mieszek lewarka
put(rodBetween([4.0, 6.5, 0], [3.9, 7.4, 0], 0.06, 10), aluM, [0, 0, 0]);
put(new THREE.SphereGeometry(0.27, 20, 14), leatherM, [3.88, 7.58, 0]);
put(cyl(0.2, 0.06, 'y', 16), aluM, [3.88, 7.83, 0]);
put(rbox(1.9, 0.22, 0.32, 0.1), leatherM, [2.3, 6.62, 0.62], [0, 0, -0.3]);  // hamulec ręczny

// kierownica 3-ramienna z kolumną (kierowca po lewej stronie)
{
  const w = grp([4.25, 9.15, -3.7], [0, 0, -0.395]);
  put(torus(1.72, 0.17, 'x', 44), leatherM, [0, 0, 0], [0, 0, 0], w);
  put(rbox(0.5, 1.05, 1.25, 0.3), dashM, [0.08, 0, 0], [0, 0, 0], w);
  for (const z of [-1.05, 1.05]) put(rbox(0.16, 0.3, 1.2, 0.1), dashM, [0.06, -0.05, z], [0, 0, 0], w);
  put(rbox(0.16, 1.15, 0.36, 0.1), dashM, [0.06, -1.05, 0], [0, 0, 0], w);
  for (const z of [-1.05, 1.05]) put(rbox(0.05, 0.1, 0.9, 0.03), aluM, [-0.03, 0.08, z], [0, 0, 0], w);
  put(rbox(0.06, 0.18, 0.62, 0.05), aluM, [-0.2, 0.18, 0], [0, 0, 0], w);
  put(rodBetween([0.1, 0, 0], [1.45, 0, 0], 0.22, 16), dashM, [0, 0, 0], [0, 0, 0], w);
}

// fotele przednie z boczkami i zagłówkami
for (const z of [-3.7, 3.7]) {
  const s = grp([1.3, 4.9, z]);
  put(rbox(3.6, 0.7, 3.6, 0.15), dashM, [0, 0.45, 0], [0, 0, 0], s);
  put(rbox(3.9, 0.6, 2.5, 0.25), clothM, [0.05, 1.05, 0], [0, 0, 0], s);
  for (const d of [-1.62, 1.62]) put(rbox(3.9, 0.85, 0.85, 0.32), leatherM, [0.05, 1.15, d], [0, 0, 0], s);
  const b = grp([-1.9, 1.3, 0], [0, 0, 0.22], s);
  put(rbox(0.6, 4.6, 2.5, 0.25), clothM, [0.15, 2.6, 0], [0, 0, 0], b);
  for (const d of [-1.62, 1.62]) put(rbox(1.0, 4.7, 0.85, 0.35), leatherM, [0.05, 2.55, d], [0, 0, 0], b);
  put(rbox(0.35, 5.0, 4.1, 0.2), leatherM, [-0.4, 2.6, 0], [0, 0, 0], b);
  put(rbox(0.8, 1.4, 2.5, 0.35), leatherM, [-0.05, 5.95, 0], [0, 0, 0], b);
  for (const d of [-0.6, 0.6]) put(cyl(0.05, 0.5, 'y', 8), aluM, [-0.1, 5.15, d], [0, 0, 0], b);
}
// kanapa tylna: trzy miejsca, dwa zagłówki
{
  const s = grp([-8.6, 4.9, 0]);
  put(rbox(4.0, 0.8, 13.0, 0.2), dashM, [0, 0.45, 0], [0, 0, 0], s);
  for (const z of [-4.3, 0, 4.3]) put(rbox(3.8, 0.7, 4.1, 0.3), clothM, [0.05, 1.2, z], [0, 0, 0], s);
  const b = grp([-1.9, 1.4, 0], [0, 0, 0.3], s);
  for (const z of [-4.3, 0, 4.3]) put(rbox(0.9, 4.2, 4.1, 0.35), clothM, [0, 2.1, z], [0, 0, 0], b);
  for (const z of [-4.3, 4.3]) {
    put(rbox(0.7, 1.1, 2.3, 0.3), leatherM, [-0.1, 4.85, z], [0, 0, 0], b);
    for (const d of [-0.55, 0.55]) put(cyl(0.05, 0.4, 'y', 8), aluM, [-0.1, 4.2, z + d], [0, 0, 0], b);
  }
}
// boczki drzwi
for (const s of [-1, 1]) for (const [x, len] of [[1.3, 8.2], [-7.4, 8.6]]) {
  put(rbox(len, 4.4, 0.35, 0.15), leatherM, [x, 7.25, s * 7.95]);
  put(rbox(len * 0.5, 0.35, 0.7, 0.12), leatherM, [x - len * 0.05, 7.7, s * 7.55]);
  put(rbox(len * 0.92, 0.08, 0.06, 0.02), aluM, [x, 9.1, s * 7.76]);
  put(rbox(0.8, 0.25, 0.12, 0.05), aluM, [x + len * 0.27, 8.5, s * 7.76]);
  put(cyl(0.55, 0.06, 'z', 24), dashM, [x + len * 0.3, 5.9, s * 7.77]);
}
// podsufitka pod dachem (cienka powłoka o kształcie dachu)
function headHalf(x) {
  const top = glassHalf(x).filter(p => p[2] === 'top'), c = top[0], mid = top[top.length - 1];
  return [[0, mid[1] - 0.38, 'h', 0], [c[0] - 0.35, c[1] - 0.42, 'h', 0], ...top.map(([z, y]) => [z * 0.96, y - 0.14, 'h', 0])];
}
loft(-10.2, ROOF_FRONT - 0.1, 70, headHalf, () => 0, [headM]);
// wewnętrzna powierzchnia szyby / dachu w punkcie (x, z) — ten sam wzór co glassHalf
function roofInner(x, z) {
  const y0 = topY(x) - 0.1, h = Math.max(0.001, roofY(x) - y0), wt = CAR.W - 0.95 - Math.min(1.25, h * 0.3);
  const crown = Math.min(0.42, h * 0.22), y1 = y0 + h - crown;
  return y1 + crown * (1 - (Math.min(Math.abs(z), wt) / wt) ** 2);
}
for (const s of [-1, 1]) {                                                      // osłony przeciwsłoneczne pod szybą
  const xa = ROOF_FRONT - 0.3, xb = ROOF_FRONT + 1.1, zo = s * 5.6, ya = roofInner(xa, zo), yb = roofInner(xb, zo);
  put(rbox(1.45, 0.12, 4.2, 0.06), headM, [(xa + xb) / 2, (ya + yb) / 2 - 0.34, s * 3.5], [0, 0, Math.atan2(yb - ya, xb - xa)]);
}
{                                                                               // lusterko wsteczne na szybie
  const xs = ROOF_FRONT + 1.5, ys = roofInner(xs, 0) - 0.08, xm = ROOF_FRONT + 1.15, ym = roofInner(xm + 0.3, 0.9) - 0.75;
  put(rodBetween([xs, ys, 0], [xm + 0.1, ym + 0.2, 0], 0.06, 8), dashM, [0, 0, 0]);
  put(rbox(0.25, 0.55, 2.4, 0.15), dashM, [xm, ym, 0]);
  put(rbox(0.05, 0.44, 2.2, 0.05), reflM, [xm - 0.13, ym, 0]);
}
// półka tylna, trzecie światło stop, podłoga z tunelem
put(rbox(4.4, 0.25, 14.2, 0.1), carpetM, [-14.0, 10.0, 0]);
put(rbox(0.4, 0.22, 2.6, 0.08), redM, [-15.6, 10.22, 0]);
put(box(20.5, 0.3, 15.2), carpetM, [-1.75, 4.7, 0]);
put(rbox(20, 1.0, 2.4, 0.3), carpetM, [-1.75, 5.0, 0]);
// podłoga pod kabiną
{ const under = new THREE.Mesh(box(20, 0.25, 14.5), trimM); under.position.set(-0.5, 2.3, 0); car.add(under); }

// koła 205/55 R16, felgi 5 podwójnych ramion, tarcze i zaciski
const wheelGroups = [];                 // { w: skręt, spin: obrót koła, front }
for (const x of [CAR.axF, CAR.axR]) for (const s of [-1, 1]) {
  const w = new THREE.Group(); w.position.set(x, CAR.wr, s * CAR.trackZ);
  const t = lathe([[2.03, -1.0], [2.85, -1.03], [3.1, -0.85], [3.16, -0.4], [3.16, 0.4], [3.1, 0.85], [2.85, 1.03], [2.03, 1.0]], 56); t.rotateX(Math.PI / 2);
  w.add(new THREE.Mesh(t, tireM));
  const barrel = new THREE.Mesh(cyl(2.03, 1.9, 'z', 56, 2.03, true), rimM); w.add(barrel);
  const lip = new THREE.Mesh(torus(2.0, 0.07, 'z', 56), rimM); lip.position.z = s * 0.92; w.add(lip);
  const well = new THREE.Mesh(cyl(1.95, 0.05, 'z', 48), trimM); well.position.z = s * 0.35; w.add(well);
  for (let i = 0; i < 5; i++) for (const d of [-0.13, 0.13]) {
    const a = i / 5 * Math.PI * 2 + d;
    const sp = new THREE.Mesh(rbox(0.26, 1.55, 0.18, 0.08), rimM);
    sp.position.set(Math.sin(a) * 1.08, Math.cos(a) * 1.08, s * 0.78); sp.rotation.z = -a; w.add(sp);
  }
  const hub = new THREE.Mesh(cyl(0.48, 0.25, 'z', 32), rimM); hub.position.z = s * 0.82; w.add(hub);
  const cap = new THREE.Mesh(cyl(0.3, 0.06, 'z', 24), trimM); cap.position.z = s * 0.96; w.add(cap);
  const disc = new THREE.Mesh(cyl(1.6, 0.28, 'z', 44), bodyMat({ color: 0x80868c, metalness: 0.9, roughness: 0.45 })); disc.position.z = s * 0.05; w.add(disc);
  const spin = new THREE.Group(); [...w.children].forEach(c => spin.add(c)); w.add(spin);   // zacisk nie obraca się z kołem
  const cal = new THREE.Mesh(rbox(0.7, 1.1, 0.55, 0.12), trimM); cal.position.set(x > 0 ? -1.3 : 1.3, 0.3, s * 0.12); w.add(cal);
  car.add(w); wheelGroups.push({ w, spin, front: x > 0 });
}
const rig = new THREE.Group();          // auto + cień: przesuwane razem po mieście
rig.add(car, shadow);
scene.add(rig);
