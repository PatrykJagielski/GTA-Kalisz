/* ---------- profile nadwozia: kształt auta z krzywych opisanych w modelu (car/models/) ---------- */
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
// przekrój połówkowy -> pełna pętla (lustrzane odbicie względem osi auta)
export function fullLoop(h) {
  const n = h.length, L = h.map(p => p.slice());
  L[n - 1][2] = h[n - 2][2]; L[n - 1][3] = h[n - 2][3];
  for (let k = n - 2; k >= 1; k--) L.push([-h[k][0], h[k][1], h[k - 1][2], h[k - 1][3]]);
  return L;
}
function inPoly(L, z, y) {
  let c = false;
  for (let i = 0, j = L.length - 1; i < L.length; j = i++) {
    const [zi, yi] = L[i], [zj, yj] = L[j];
    if ((yi > y) !== (yj > y) && z < (zj - zi) * (y - yi) / (yj - yi) + zi) c = !c;
  }
  return c;
}

// model: { dims, shape } (zob. car/models/audi-a4.js); zwraca funkcje kształtu używane przez nadwozie, dekale i wnętrze
export function makeProfile(model) {
  const C = model.dims, S = model.shape, G = S.glass;
  // górna krawędź dolnej bryły: zderzak tył, klapa bagażnika, linia okien, maska, przód
  const topY = spline1d(S.top);
  const shoulderY = spline1d(S.shoulder);          // ostra linia boczna
  const baseY = spline1d(S.base);
  const roofY = spline1d(S.roof);
  function bottomY(x) {
    let y = baseY(x);
    for (const ax of [C.axF, C.axR]) { const d = x - ax; if (Math.abs(d) < C.archR) y = Math.max(y, C.wr + Math.sqrt(C.archR ** 2 - d * d)); }
    return y;
  }
  function halfW(x) {  // rzut z góry: zaokrąglone narożniki zderzaków
    const [xf, lf, ef] = S.nose, [xr, lr, er] = S.tail;
    if (x > xf) { const u = Math.min(1, (x - xf) / lf); return C.W * Math.pow(1 - Math.pow(u, ef), 1 / ef); }
    if (x < -xr) { const u = Math.min(1, (-x - xr) / lr); return C.W * Math.pow(1 - Math.pow(u, er), 1 / er); }
    return C.W;
  }
  // przekrój poprzeczny (połowa, od środka spodu do środka dachu): [z, y, znacznik segmentu, t]
  function lowerHalf(x) {
    const w = halfW(x), yb = bottomY(x), yt = topY(x);
    const ys = Math.min(Math.max(shoulderY(x), yb + 1.2), yt - 0.35), lo = yb + (ys - yb) * 0.4;
    return [[0, yb, 'bot'], [w - 0.8, yb, 'p'], [w - 0.3, yb + 0.12, 'p'], [w - 0.1, yb + 0.45, 'p'], [w - 0.04, lo, 'p'],
      [w, ys - 0.5, 'p'], [w, ys - 0.12, 'p'], [w - 0.07, ys + 0.04, 'p'], [w - 0.3, ys + (yt - ys) * 0.55, 'p'],
      [w - 0.7, yt - 0.12, 'p'], [w - 1.6, yt - 0.03, 'lid'], [w * 0.45, yt + 0.05, 'lid'], [0, yt + 0.08, 'p']];
  }
  // szyby i dach: boki zwężają się ku górze, dach lekko wypukły
  function glassFrame(x) {
    const y0 = topY(x) - 0.1, h = Math.max(0.001, roofY(x) - y0), wb = C.W - G.inset;
    const wt = wb - Math.min(G.tumble, h * G.tumbleK), crown = Math.min(G.crown, h * G.crownK);
    return { y0, h, wb, wt, crown, y1: y0 + h - crown };
  }
  function glassHalf(x) {
    const { y0, wb, wt, crown, y1 } = glassFrame(x);
    const pts = [[0, y0 - 0.05, 'gbin', 0], [wb - 0.3, y0 - 0.05, 'gb', 0]];
    const NS = 7, NT = 7;
    for (let i = 0; i < NS; i++) { const t = i / NS; pts.push([wb + (wt - wb) * t + 0.12 * Math.sin(Math.PI * t), y0 + (y1 - y0) * t, 'side', (i + 0.5) / NS]); }
    for (let i = 0; i <= NT; i++) { const u = i / NT, z = wt * (1 - u); pts.push([z, y1 + crown * (1 - (z / wt) ** 2), 'top', u]); }
    return pts;
  }
  // wewnętrzna powierzchnia szyby / dachu w punkcie (x, z) — ten sam wzór co glassHalf
  function roofInner(x, z) {
    const { wt, crown, y1 } = glassFrame(x);
    return y1 + crown * (1 - (Math.min(Math.abs(z), wt) / wt) ** 2);
  }
  /* detale dopasowane do powierzchni */
  const inBody = (x, z, y) => inPoly(fullLoop(lowerHalf(x)), z, y);
  function surfX(z, y, front) {           // gdzie zaczyna się karoseria patrząc z przodu / z tyłu
    const a = front ? C.front : C.rear, dir = front ? -1 : 1;
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
  return { C, topY, roofY, roofFront: S.roofFront, lowerHalf, glassHalf, roofInner, surfX, sideZ };
}
