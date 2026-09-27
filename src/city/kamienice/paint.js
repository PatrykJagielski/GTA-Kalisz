import * as THREE from 'three';
import { rng } from '../../core/random.js';

/* ---------- tekstury kamienic: tynk frontu, szyldy, kuta balustrada ---------- */
const PX = 5;                                                                            // pikseli na dm elewacji
const cnv = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; };
const tex = (c, repeat) => {
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (repeat) t.wrapS = THREE.RepeatWrapping;
  return t;
};
const shade = (hex, k) => '#' + new THREE.Color(hex).multiplyScalar(k).getHexString();

// łuk o strzałce rise nad otworem x0..x1 ze szczytem w top: środek okręgu cy, promień R, kąt a0 wezgłowia od poziomu
export function archDims(x0, x1, top, rise) {
  const hw = (x1 - x0) / 2, R = (hw * hw + rise * rise) / (2 * rise);
  return { xc: (x0 + x1) / 2, sp: top - rise, R, cy: top - R, a0: Math.asin(Math.min(1, (R - rise) / R)) };
}

// tynk frontu (y od -2 do top): kolor ścian i parteru, cienie pod gzymsami, ciemne wnęki okien (szyby są w 3D);
// łuki (arches: [x0, x1, y0, top, rise]) i niebo nad skrajnymi osiami przy attyce są przezroczyste
export function facadeTex(S, len, holes, arches) {
  const top = S.top || S.eave, [c, g] = cnv(Math.ceil(len * PX), Math.ceil((top + 2) * PX)), R = rng(70 + S.seed);
  const X = x => x * PX, Y = y => (top - y) * PX;
  const rect = (x0, x1, y0, y1, col) => { g.fillStyle = col; g.fillRect(X(x0), Y(y1), X(x1 - x0), Y(y0) - Y(y1)); };
  rect(0, len, -2, top, S.wall);
  if (S.base) rect(0, len, -2, S.groundTop, S.base);
  for (let i = 0; i < 2600; i++) {                                                        // nierówny tynk
    const v = (R() - 0.5) * 0.09; g.fillStyle = v > 0 ? `rgba(255,255,255,${v})` : `rgba(0,0,0,${-v})`;
    g.fillRect(R() * c.width, R() * c.height, 2 + R() * 7, 2 + R() * 7);
  }
  if (S.stains) for (let i = 0; i < 46; i++) {                                           // zacieki na zaniedbanym tynku
    const x = R() * len, y1 = S.groundTop + 8 + R() * (S.eave - S.groundTop - 8), h = 12 + R() * 45, gr = g.createLinearGradient(0, Y(y1), 0, Y(y1 - h));
    gr.addColorStop(0, `rgba(90,84,70,${0.06 + R() * 0.14})`); gr.addColorStop(1, 'rgba(90,84,70,0)');
    g.fillStyle = gr; g.fillRect(X(x), Y(y1), X(1 + R() * 7), X(h));
  }
  rect(0, len, -2, 3, shade(S.base || S.wall, 0.8));                                   // cokół
  for (const [y0, , d, f0 = 0, f1 = 1] of S.bands) {                                     // cień pod gzymsem
    const gr = g.createLinearGradient(0, Y(y0), 0, Y(y0 - d * 1.8));
    gr.addColorStop(0, 'rgba(0,0,0,.24)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(X(f0 * len), Y(y0), X((f1 - f0) * len), X(d * 1.8));
  }
  for (const [x0, x1, y0, y1] of holes) rect(x0 - 0.2, x1 + 0.2, y0 - 0.2, y1 + 0.2, '#1e262d');
  g.globalCompositeOperation = 'destination-out';
  for (const [x0, x1, y0, t, rise] of arches) {
    const { xc, sp, R: r, cy, a0 } = archDims(x0, x1, t, rise);
    g.beginPath(); g.moveTo(X(x0), Y(y0)); g.lineTo(X(x0), Y(sp)); g.arc(X(xc), Y(cy), X(r), a0 - Math.PI, -a0); g.lineTo(X(x1), Y(y0)); g.fill();
  }
  if (S.attic) { g.fillRect(0, 0, X(S.attic[0] * len), Y(S.eave)); g.fillRect(X(S.attic[1] * len), 0, c.width, Y(S.eave)); }
  g.globalCompositeOperation = 'source-over';
  return tex(c);
}

// szyld w×h dm: tło, ramka, wiersze [tekst, wysokość i środek jako ułamek wysokości, kolor, krój '… {}px …']; round = tarcza
export function signTex(w, h, s) {
  const k = 24, [c, g] = cnv(Math.round(w * k), Math.round(h * k)), W = c.width, H = c.height;
  if (s.bg) {
    g.fillStyle = s.bg;
    if (s.round) { g.beginPath(); g.arc(W / 2, H / 2, Math.min(W, H) / 2 - 2, 0, 7); g.fill(); } else g.fillRect(0, 0, W, H);
  }
  if (s.border) { g.strokeStyle = s.border; g.lineWidth = k * 0.25; g.strokeRect(k * 0.3, k * 0.3, W - k * 0.6, H - k * 0.6); }
  g.textAlign = 'center'; g.textBaseline = 'middle';
  for (const [t, size, y, col = s.fg || '#ffffff', font = s.font || '700 {}px "Barlow Condensed", Arial, sans-serif'] of s.lines) {
    g.font = font.replace('{}', Math.round(size * H)); g.fillStyle = col;
    g.fillText(t, W / 2, y * H, W * (s.round ? 0.8 : 0.92));
  }
  return tex(c);
}

// kuta balustrada: pochwyt, listwa, pręty co 12,5 cm i esownice między nimi; 10 dm tekstury na powtórzenie
export function railTex() {
  const [c, g] = cnv(128, 96);
  g.fillStyle = g.strokeStyle = '#26282b'; g.lineWidth = 3;
  g.fillRect(0, 0, 128, 8); g.fillRect(0, 88, 128, 8); g.fillRect(0, 44, 128, 4);
  for (let x = 0; x < 128; x += 16) {
    g.fillRect(x, 0, 4, 96);
    g.beginPath(); g.arc(x + 10, x % 32 ? 26 : 66, 5, 0, 7); g.stroke();
  }
  return tex(c, true);
}
