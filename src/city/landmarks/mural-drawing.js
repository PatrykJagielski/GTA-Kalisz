import * as THREE from 'three';
import { V } from '../../core/geometry.js';
import { rng } from '../../core/random.js';

/* ---------- sgraffito: tynk, pióro i elementy rysunku (rzeka, drogi, drzewka, herb, róża wiatrów) ---------- */
export const SG = { bg: '#dbbf72', line: '#ad4529', fill: 'rgba(173,69,41,.22)', dark: '#2d2b28' };
// końce ścian w układzie świata (dm, z OSM), lewy → prawy patrząc z ulicy; wysokości w dm
export const MUR = { map: [[3207, -3901], [3425, -3734]], folk: [[3425, -3734], [3462, -3779]], top: 162, eave: 118, h: 135 };
export const SERIF = 'Georgia, "Times New Roman", "DejaVu Serif", serif';

export function sgBg(g, W, T, seed) {                                                          // tynk: ugier, plamy, zacieki, odpryski
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
export function sgAge(g, W, T, seed) {                                                          // odpadający tynk: jaśniejsze i szare łaty
  const R = rng(seed);
  for (let i = 0; i < W / 5; i++) {
    const x = R() * W, y = R() * T, r = 0.4 + R() * (R() < 0.15 ? 5 : 1.4);
    g.fillStyle = R() < 0.55 ? 'rgba(160,150,125,.7)' : 'rgba(238,228,195,.8)';
    g.beginPath(); for (let k = 0; k < 9; k++) { const a = k / 9 * 6.283, q = r * (0.55 + R() * 0.7); g.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q); } g.fill();
  }
}
export const pen = (g, w = 0.55) => { g.strokeStyle = SG.line; g.fillStyle = SG.line; g.lineWidth = w; g.lineJoin = 'round'; g.lineCap = 'round'; };
export const pl = (g, pts, close = false) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); if (close) g.closePath(); g.stroke(); };
export const circ = (g, x, y, r, fill) => { g.beginPath(); g.arc(x, y, r, 0, 7); if (fill) g.fill(); else g.stroke(); };
export const srect = (g, x, y, w, h) => g.strokeRect(x, y, w, h);
export function spaced(g, txt, x, y, font, spacing, maxW, align = 'center') {                 // napis z odstępem liter, ściśnięty do maxW
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
export function river(g, pts, w, R) {                                                           // rzeka: dwa brzegi i kreskowanie falkami
  const P = curvePts(pts, 90);
  for (const s of [-1, 1]) pl(g, P.map(([x, y, nx, ny]) => [x + nx * s * w / 2, y + ny * s * w / 2]));
  g.lineWidth = 0.3;
  for (let i = 1; i < P.length - 1; i++) {
    const [x, y, nx, ny] = P[i], j = (R() - 0.5) * w * 0.5;
    g.beginPath(); g.moveTo(x + nx * (j - w * 0.18), y + ny * (j - w * 0.18)); g.quadraticCurveTo(x + nx * j + ny * 0.6, y + ny * j - nx * 0.6, x + nx * (j + w * 0.18), y + ny * (j + w * 0.18)); g.stroke();
  }
  g.lineWidth = 0.55;
}
export function road(g, a, b, w) {                                                              // droga: dwie równoległe linie
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), nx = -dy / l * w / 2, ny = dx / l * w / 2;
  pl(g, [[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny]]); pl(g, [[a[0] - nx, a[1] - ny], [b[0] - nx, b[1] - ny]]);
}
export function tree(g, x, y, s) {                                                              // drzewko-listek z nerwem
  g.beginPath(); g.ellipse(x, y - s * 0.9, s * 0.55, s * 0.7, 0, 0, 7); g.stroke();
  pl(g, [[x, y], [x, y - s * 1.3]]);
  for (const k of [0.6, 0.95]) { pl(g, [[x, y - s * k], [x - s * 0.3, y - s * (k + 0.2)]]); pl(g, [[x, y - s * k], [x + s * 0.3, y - s * (k + 0.2)]]); }
}
// piktogramy zabytków kreską (x = środek, y = podstawa, s = wysokość)
export const LINE = {
  katedra(g, x, y, s) { const u = s / 20; srect(g, x - 9 * u, y - 7 * u, 12 * u, 7 * u); pl(g, [[x - 9.5 * u, y - 7 * u], [x - 3 * u, y - 10 * u], [x + 3.5 * u, y - 7 * u]]); for (let i = 0; i < 3; i++) pl(g, [[x - 7.5 * u + i * 3.5 * u, y - 1 * u], [x - 7.5 * u + i * 3.5 * u, y - 4.5 * u], [x - 6.7 * u + i * 3.5 * u, y - 5.4 * u], [x - 5.9 * u + i * 3.5 * u, y - 4.5 * u], [x - 5.9 * u + i * 3.5 * u, y - 1 * u]]); srect(g, x + 3 * u, y - 12 * u, 4.5 * u, 12 * u); pl(g, [[x + 2.6 * u, y - 12 * u], [x + 5.25 * u, y - 20 * u], [x + 7.9 * u, y - 12 * u]]); pl(g, [[x + 5.25 * u, y - 20 * u], [x + 5.25 * u, y - 21.5 * u]]); pl(g, [[x + 4.3 * u, y - 5 * u], [x + 4.3 * u, y - 8.5 * u], [x + 5.25 * u, y - 9.5 * u], [x + 6.2 * u, y - 8.5 * u], [x + 6.2 * u, y - 5 * u]]); },
  bliznieta(g, x, y, s) { const u = s / 20; srect(g, x - 5 * u, y - 10 * u, 10 * u, 10 * u); for (const d of [-1, 1]) { srect(g, x + d * 6.5 * u - 2 * u, y - 15 * u, 4 * u, 15 * u); pl(g, [[x + d * 6.5 * u - 2.4 * u, y - 15 * u], [x + d * 6.5 * u, y - 19 * u], [x + d * 6.5 * u + 2.4 * u, y - 15 * u]]); circ(g, x + d * 6.5 * u, y - 12 * u, 0.8 * u); } pl(g, [[x - 5 * u, y - 10 * u], [x, y - 14 * u], [x + 5 * u, y - 10 * u]]); pl(g, [[x - 1.5 * u, y], [x - 1.5 * u, y - 4 * u], [x, y - 5.5 * u], [x + 1.5 * u, y - 4 * u], [x + 1.5 * u, y]]); circ(g, x, y - 8 * u, 1.2 * u); },
  ratusz(g, x, y, s) { const u = s / 20; srect(g, x - 8 * u, y - 7 * u, 16 * u, 7 * u); for (let i = 0; i < 5; i++) srect(g, x - 7 * u + i * 3 * u, y - 5.5 * u, 1.4 * u, 3 * u); srect(g, x - 2 * u, y - 14 * u, 4 * u, 7 * u); circ(g, x, y - 11.5 * u, 1.1 * u); pl(g, [[x - 2.4 * u, y - 14 * u], [x - 1.2 * u, y - 16 * u], [x + 1.2 * u, y - 16 * u], [x + 2.4 * u, y - 14 * u]]); srect(g, x - 0.8 * u, y - 18 * u, 1.6 * u, 2 * u); pl(g, [[x, y - 18 * u], [x, y - 21 * u]]); },
  teatr(g, x, y, s) { const u = s / 20; srect(g, x - 9 * u, y - 8 * u, 18 * u, 8 * u); for (let i = 0; i < 6; i++) pl(g, [[x - 6.5 * u + i * 2.6 * u, y], [x - 6.5 * u + i * 2.6 * u, y - 7 * u]]); pl(g, [[x - 9.5 * u, y - 8 * u], [x, y - 12 * u], [x + 9.5 * u, y - 8 * u]]); },
  palac(g, x, y, s) { const u = s / 20; srect(g, x - 11 * u, y - 8 * u, 22 * u, 8 * u); pl(g, [[x - 11 * u, y - 8 * u], [x - 10 * u, y - 10.5 * u], [x + 10 * u, y - 10.5 * u], [x + 11 * u, y - 8 * u]]); for (let r = 0; r < 2; r++) for (let i = 0; i < 8; i++) srect(g, x - 10 * u + i * 2.6 * u, y - 7 * u + r * 3.6 * u, 1.3 * u, 2.2 * u); pl(g, [[x - 3 * u, y - 10.5 * u], [x, y - 13 * u], [x + 3 * u, y - 10.5 * u]]); },
  kolegiata(g, x, y, s) { const u = s / 20; srect(g, x - 1 * u, y - 7 * u, 9 * u, 7 * u); pl(g, [[x - 1 * u, y - 7 * u], [x + 3.5 * u, y - 10 * u], [x + 8 * u, y - 7 * u]]); srect(g, x - 6 * u, y - 13 * u, 5 * u, 13 * u); pl(g, [[x - 4.5 * u, y - 9 * u], [x - 4.5 * u, y - 11 * u], [x - 3.5 * u, y - 12 * u], [x - 2.5 * u, y - 11 * u], [x - 2.5 * u, y - 9 * u]]); g.beginPath(); g.ellipse(x - 3.5 * u, y - 15 * u, 2.3 * u, 2 * u, 0, 0, 7); g.stroke(); pl(g, [[x - 3.5 * u, y - 17 * u], [x - 3.5 * u, y - 20.5 * u]]); pl(g, [[x - 4.6 * u, y - 19.2 * u], [x - 2.4 * u, y - 19.2 * u]]); },
  dorotka(g, x, y, s) { const u = s / 20; srect(g, x - 3.5 * u, y - 13 * u, 7 * u, 13 * u); for (let i = 0; i < 4; i++) srect(g, x - 3.8 * u + i * 2 * u, y - 14.4 * u, 1.3 * u, 1.4 * u); pl(g, [[x - 4 * u, y - 14.4 * u], [x, y - 19 * u], [x + 4 * u, y - 14.4 * u]]); for (let r = 1; r < 6; r++) pl(g, [[x - 3.5 * u, y - r * 2.2 * u], [x + 3.5 * u, y - r * 2.2 * u]]); },
  dom(g, x, y, s) { const u = s / 20; srect(g, x - 5 * u, y - 7 * u, 10 * u, 7 * u); pl(g, [[x - 6 * u, y - 7 * u], [x, y - 12 * u], [x + 6 * u, y - 7 * u]]); srect(g, x - 3.5 * u, y - 5 * u, 2 * u, 2 * u); srect(g, x + 1.5 * u, y - 5 * u, 2 * u, 2 * u); },
};
export function herbRound(g, x, y, r) {                                                         // herb w ozdobnym medalionie
  circ(g, x, y, r); circ(g, x, y, r * 0.84);
  for (let k = 0; k < 18; k++) { const a = k / 18 * 6.283; g.beginPath(); g.arc(x + Math.cos(a) * r * 1.07, y + Math.sin(a) * r * 1.07, r * 0.12, a - 1.6, a + 1.6); g.stroke(); }
  const u = r / 10;
  srect(g, x - 5.5 * u, y - 1 * u, 11 * u, 6 * u);                                        // mur
  for (const d of [-4, 0, 4]) { srect(g, x + d * u - 1.5 * u, y - (d ? 6 : 8) * u, 3 * u, (d ? 5 : 7) * u); for (let k = 0; k < 2; k++) g.fillRect(x + d * u - 1.5 * u + k * 1.8 * u, y - (d ? 7 : 9) * u, 1.2 * u, 1 * u); }
  g.beginPath(); g.moveTo(x - 2 * u, y + 5 * u); g.lineTo(x - 2 * u, y + 1.5 * u); g.arc(x, y + 1.5 * u, 2 * u, Math.PI, 0); g.lineTo(x + 2 * u, y + 5 * u); g.stroke();
  circ(g, x, y + 2.4 * u, 1 * u, true);                                                   // głowa rycerza w bramie
  for (let k = -3; k <= 3; k += 2) pl(g, [[x + k * 1.2 * u, y + 6.5 * u], [x + k * 1.2 * u + 0.6 * u, y + 7.8 * u]]);
}
export function windRose(g, x, y, r) {                                                          // róża wiatrów z lilią na północy
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
export function runner(g, x, y, s) {                                                            // sylwetka biegacza
  const u = s / 10; circ(g, x + 1 * u, y - 9 * u, 0.9 * u, true); g.lineWidth = 0.9 * u;
  pl(g, [[x + 0.6 * u, y - 7.8 * u], [x - 0.4 * u, y - 4 * u]]); pl(g, [[x - 0.4 * u, y - 4 * u], [x + 1.8 * u, y - 2 * u], [x + 1.4 * u, y]]); pl(g, [[x - 0.4 * u, y - 4 * u], [x - 2.4 * u, y - 2.4 * u], [x - 3.6 * u, y - 3]]);
  pl(g, [[x + 0.4 * u, y - 7 * u], [x + 2.6 * u, y - 5.8 * u]]); pl(g, [[x + 0.4 * u, y - 7 * u], [x - 1.8 * u, y - 7.6 * u]]); g.lineWidth = 0.55;
}
