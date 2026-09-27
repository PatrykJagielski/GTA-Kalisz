import * as THREE from 'three';

/* ---------- dachy spadziste nad obrysami budynków ---------- */
// Połać wznosi się od każdej wolnej ściany (od ulicy, od podwórka) pod tym samym kątem; wysokość dachu w punkcie to
// najniższa z połaci, czyli dla obrysu wypukłego dokładnie dach kopertowy. Ściana wspólna z sąsiednim budynkiem nie
// podnosi połaci, tylko dostaje szczyt: w pierzei wychodzi dach dwuspadowy z kalenicą wzdłuż ulicy.
// Obrys wklęsły dzielony jest na wypukłe części (Hertel–Mehlhorn), każda z własnym dachem, np. oficyna za kamienicą.

const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
const area2 = P => P.reduce((s, p, i) => { const q = P[(i + 1) % P.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
const isConvex = P => P.every((p, i) => cross(P[(i + P.length - 1) % P.length], p, P[(i + 1) % P.length]) >= -1e-6);

// porządkuje obrys: przeciwnie do ruchu wskazówek, bez krótkich krawędzi i prawie prostych załamań
// P = [[x, z]], free[i] = czy krawędź P[i] -> P[i+1] jest wolna
function clean(P, free) {
  const n0 = P.length;
  if (area2(P) < 0) { free = P.map((_, k) => free[(2 * n0 - 2 - k) % n0]); P = P.slice().reverse(); }   // krawędź k odwróconego = krawędź n-2-k
  let changed = true;
  while (changed && P.length > 3) {
    changed = false;
    for (let i = 0; i < P.length && P.length > 3; i++) {
      const n = P.length, a = P[(i + n - 1) % n], b = P[i], c = P[(i + 1) % n];
      const la = Math.hypot(b[0] - a[0], b[1] - a[1]), lc = Math.hypot(c[0] - b[0], c[1] - b[1]);
      const turn = Math.abs(Math.asin(Math.max(-1, Math.min(1, cross(a, b, c) / (la * lc || 1)))));
      if (la < 3 || lc < 3 || (turn < 0.14 && (b[0] - a[0]) * (c[0] - b[0]) + (b[1] - a[1]) * (c[1] - b[1]) > 0)) {
        const fi = (i + n - 1) % n;                                                // krawędź a->b znika w a->c
        free[fi] = la >= lc ? free[fi] : free[i];
        P.splice(i, 1); free.splice(i, 1); changed = true; break;
      }
    }
  }
  return [P, free];
}
// podział na wypukłe części: listy indeksów wierzchołków
function convexParts(P) {
  if (isConvex(P)) return [P.map((_, i) => i)];
  const parts = THREE.ShapeUtils.triangulateShape(P.map(p => new THREE.Vector2(p[0], p[1])), [])
    .map(t => (cross(P[t[0]], P[t[1]], P[t[2]]) > 0 ? t : [t[0], t[2], t[1]]));
  for (let merged = true; merged;) {
    merged = false;
    search: for (let i = 0; i < parts.length; i++) for (let j = i + 1; j < parts.length; j++) {
      const a = parts[i], b = parts[j];
      for (let k = 0; k < a.length; k++) {
        const u = a[k], v = a[(k + 1) % a.length], m = b.indexOf(v);
        if (m < 0 || b[(m + 1) % b.length] !== u) continue;
        const U = [];
        for (let s = 1; s <= a.length; s++) U.push(a[(k + s) % a.length]);             // v ... u
        for (let s = 2; s < b.length; s++) U.push(b[(m + s) % b.length]);               // reszta b po u
        if (!isConvex(U.map(q => P[q]))) continue;
        parts[i] = U; parts.splice(j, 1); merged = true; break search;
      }
    }
  }
  return parts;
}
// półpłaszczyzna dot(p, w) <= c (Sutherland–Hodgman)
function clip(poly, wx, wz, c) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length], dp = p[0] * wx + p[1] * wz - c, dq = q[0] * wx + q[1] * wz - c;
    if (dp <= 0) out.push(p);
    if ((dp < 0 && dq > 0) || (dp > 0 && dq < 0)) { const t = dp / (dp - dq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); }
  }
  return out;
}
const polyArea = P => Math.abs(area2(P)) / 2;

// ring = [x0, z0, x1, z1, ...], free[i] dla krawędzi i; base = wysokość okapu; slope = tg kąta; rise = najwyższa kalenica
// brk = { d, s2 }: dach mansardowy — połać o nachyleniu slope do odległości d od ściany, dalej łagodniejsza s2
// (podział na połacie ten sam co w dachu prostym, bo wysokość rośnie z odległością od ściany tak samo dla każdej połaci)
// zwraca { faces: [{ pts: [[x, y, z]], n: [nx, ny, nz], uv: [[u, v]], edge, low }], gables: [[[x, y, z] x 4]], top: [[x, y, z]] }
export function roofShape(ring, free0, base, slope, rise, brk = null) {
  let P = []; for (let i = 0; i < ring.length; i += 2) P.push([ring[i], ring[i + 1]]);
  [P, free0] = clean(P, free0.slice());
  // najwyżej jedna wolna ściana (kamienica wciśnięta między sąsiadów): tylna ściana też podnosi połać,
  // żeby wyszedł dach dwuspadowy zamiast jednospadowego z wysoką ślepą ścianą
  if (free0.filter(Boolean).length <= 1 && P.length >= 4) {
    const dir = i => { const a = P[i], b = P[(i + 1) % P.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / l, (b[1] - a[1]) / l, l]; };
    let f = free0.indexOf(true);
    if (f < 0) f = P.reduce((best, _, i) => (dir(i)[2] > dir(best)[2] ? i : best), 0);        // bez wolnych ścian: najdłuższa
    const [fx, fz] = dir(f);
    let back = -1, bestDot = -0.7;
    P.forEach((_, i) => { const [x, z] = dir(i), d = x * fx + z * fz; if (i !== f && d < bestDot) { bestDot = d; back = i; } });
    free0[f] = true; if (back >= 0) free0[back] = true;
  }
  const faces = [], gables = [], top = [], k = Math.hypot(1, slope);
  const dm = brk && rise > slope * brk.d ? brk.d : Infinity, s2 = brk ? brk.s2 : slope, k2 = Math.hypot(1, s2);
  const capD = dm < Infinity ? dm + (rise - slope * dm) / s2 : rise / slope;
  const hAt = d => (d <= dm ? slope * d : slope * dm + s2 * (d - dm));                   // wysokość połaci w odległości d od ściany
  const vAt = d => (d <= dm ? d * k : dm * k + (d - dm) * k2);                           // długość po połaci (tekstura)
  if (P.length < 3) return { faces, gables, top };
  for (const part of convexParts(P)) {
    const Q = part.map(i => P[i]), n = Q.length, first = faces.length;
    const edges = part.map((i, e) => {
      const j = part[(e + 1) % n], a = P[i], b = P[j], len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const nx = -(b[1] - a[1]) / len, nz = (b[0] - a[0]) / len;                          // normalna do środka
      return { a, b, nx, nz, tx: nz, tz: -nx, len, free: j === (i + 1) % P.length && free0[i], c: a[0] * nx + a[1] * nz };
    });
    const planes = edges.filter(e => e.free);
    const lift = (p, h) => [p[0], base + h, p[1]];
    if (!planes.length) { faces.push({ pts: Q.map(p => lift(p, 0)), n: [0, 1, 0], uv: Q.map(p => [p[0] / 30, p[1] / 30]) }); continue; }
    const d = (e, p) => p[0] * e.nx + p[1] * e.nz - e.c;                                   // odległość od ściany w głąb
    planes.forEach((e, i) => {
      let poly = clip(Q, e.nx, e.nz, capD + e.c);
      planes.forEach((f, j) => {
        if (i === j || !poly.length) return;
        const wx = e.nx - f.nx, wz = e.nz - f.nz;
        if (Math.hypot(wx, wz) < 1e-6) { if (e.c - f.c > 1e-6 || (Math.abs(e.c - f.c) <= 1e-6 && j < i)) poly = []; return; }
        poly = clip(poly, wx, wz, e.c - f.c);
      });
      if (poly.length < 3 || polyArea(poly) < 0.5) return;
      const parts = dm < Infinity ? [[clip(poly, e.nx, e.nz, e.c + dm), slope, k, true], [clip(poly, -e.nx, -e.nz, -(e.c + dm)), s2, k2, false]] : [[poly, slope, k, true]];
      for (const [pp, s, kk, low] of parts) {
        if (pp.length < 3 || polyArea(pp) < 0.5) continue;
        faces.push({ pts: pp.map(p => lift(p, hAt(d(e, p)))), n: [-s * e.nx / kk, 1 / kk, -s * e.nz / kk], uv: pp.map(p => [(p[0] * e.tx + p[1] * e.tz) / 15, vAt(d(e, p)) / 15]), edge: e, low });
      }
    });
    let flat = Q;                                                                         // płaski wierzch głębokich budynków
    for (const e of planes) flat = flat.length ? clip(flat, -e.nx, -e.nz, -(capD + e.c)) : flat;
    if (flat.length >= 3 && polyArea(flat) > 0.5) faces.push({ pts: flat.map(p => lift(p, rise)), n: [0, 1, 0], uv: flat.map(p => [p[0] / 30, p[1] / 30]) });
    // szczyty: pionowe ściany pod dachem wzdłuż krawędzi, które nie podnoszą połaci
    for (const e of edges) {
      if (e.free) continue;
      const on = [];
      for (const f of faces.slice(first)) for (const p of f.pts) {
        if (Math.abs((p[0] - e.a[0]) * e.nx + (p[2] - e.a[1]) * e.nz) < 0.05 && p[1] > base + 0.05) on.push([(p[0] - e.a[0]) * e.tx + (p[2] - e.a[1]) * e.tz, p]);
      }
      on.sort((x, y) => x[0] - y[0]);
      const pts = [[0, [e.a[0], base, e.a[1]]], ...on, [e.len, [e.b[0], base, e.b[1]]]];
      for (let s = 0; s + 1 < pts.length; s++) {
        const p = pts[s][1], q = pts[s + 1][1];
        if (pts[s + 1][0] - pts[s][0] < 0.05 || (p[1] <= base + 0.05 && q[1] <= base + 0.05)) continue;
        gables.push([[p[0], base, p[2]], [q[0], base, q[2]], q, p]);
      }
    }
    const own = faces.slice(first).flatMap(f => f.pts), peak = Math.max(...own.map(p => p[1]));    // kalenica: miejsce na kominy
    if (peak > base + 8) for (const p of own) if (p[1] >= base + (peak - base) * 0.9) top.push(p);
  }
  return { faces, gables, top };
}
