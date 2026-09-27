import { rng } from '../core/random.js';
import { canvasTex } from '../core/textures.js';

/* ---------- elewacje i kolory zwykłych budynków ---------- */
// elewacja 4 × 4 okna (komórka 4 m × 3,3 m); druga tekstura: okna zapalone nocą
export function facade(big, lit) {
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

// elewacja kamienicy: okna w opaskach z parapetem i gzymsem nadokiennym, gzyms międzypiętrowy; górny wiersz tekstury
// to górne piętro z gzymsem koronującym (współrzędna v liczona od okapu w dół). Komórka jak wyżej: 4 m × 3,3 m.
export function oldFacade(lit) {
  const R = rng(51);
  return canvasTex(256, (g, n) => {
    g.fillStyle = lit ? '#000' : '#fff'; g.fillRect(0, 0, n, n);
    for (let j = 0; j < 4; j++) {
      const oy = j * 64;
      if (!lit) {
        g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(0, oy + (j ? 3 : 7), n, 2);                  // cień pod gzymsem
        g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(0, oy, n, j ? 3 : 7);                    // gzyms (koronujący w górnym wierszu)
        if (!j) for (let x = 2; x < n; x += 6) { g.fillStyle = 'rgba(0,0,0,.1)'; g.fillRect(x, oy + 7, 3, 3); }   // ząbki pod gzymsem
      }
      for (let i = 0; i < 4; i++) {
        const ox = i * 64, x0 = ox + 22, x1 = ox + 42, y0 = oy + 16, y1 = oy + 52, on = R() < 0.35;
        if (lit) { if (on) { g.fillStyle = R() < 0.5 ? '#ffd79a' : '#ffe9c2'; g.fillRect(x0, y0, x1 - x0, y1 - y0); } continue; }
        g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(x0 - 4, y0 - 4, x1 - x0 + 8, y1 - y0 + 7);   // opaska
        g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(x0 - 7, y0 - 9, x1 - x0 + 14, 2);                    // gzyms nadokienny
        g.fillStyle = 'rgba(255,255,255,.8)'; g.fillRect(x0 - 7, y0 - 11, x1 - x0 + 14, 3);
        const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, '#6f879b'); gr.addColorStop(1, '#2f4254');
        g.fillStyle = gr; g.fillRect(x0, y0, x1 - x0, y1 - y0);
        g.strokeStyle = '#f3f1ea'; g.lineWidth = 1.6; g.strokeRect(x0, y0, x1 - x0, y1 - y0);
        g.beginPath(); g.moveTo(ox + 32, y0); g.lineTo(ox + 32, y1); g.moveTo(x0, y0 + 11); g.lineTo(x1, y0 + 11); g.stroke();   // krzyż okienny
        g.fillStyle = 'rgba(0,0,0,.22)'; g.fillRect(x0 - 5, y1 + 3, x1 - x0 + 10, 2);                    // parapet
      }
    }
  });
}
// dachówka ceramiczna: rzędy z cieniem u dołu, przesunięte spoiny; kolor daje kolor wierzchołków
export function tileTex() {
  const R = rng(19);
  return canvasTex(128, (g, n) => {
    for (let row = 0; row < 8; row++) for (let col = 0; col < 9; col++) {
      const y = row * 16, x = col * 16 - (row % 2) * 8, v = 225 + Math.floor(R() * 30);
      const gr = g.createLinearGradient(0, y, 0, y + 16); gr.addColorStop(0, `rgb(${v},${v},${v})`); gr.addColorStop(1, `rgb(${v - 45},${v - 45},${v - 45})`);
      g.fillStyle = gr; g.fillRect(x, y, 16, 16);
      g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x, y, 1, 16);
    }
    g.fillStyle = 'rgba(0,0,0,.35)'; for (let y = 14; y < n; y += 16) g.fillRect(0, y, n, 2);
  });
}

export const PAL = {
  wall: [['#eadfc6', '#dcc9a6', '#e6d2b6', '#d3dad4', '#e8d6ab', '#dcbca3', '#cdc6b7', '#f0e8d9', '#d9c39d', '#c4ccce', '#e2c7b8', '#c9d3c0'],
    ['#efe9de', '#ddd1bb', '#d0c4ad', '#e6ddca'], ['#a3a097', '#b4b0a6', '#928f89'], ['#d0d8de', '#b5c3cd', '#dde0e2'], ['#b8694b', '#aa5d43', '#d8cdb8']],
  // tynki kamienic: kremowe, piaskowe, żółte, białe, bladoróżowe, szarozielone
  old: ['#ecd9b0', '#e3c998', '#efe4cc', '#e0c4a0', '#d6bb8e', '#ead3a4', '#e4c3b0', '#dcdcce', '#f0dfc0', '#e2bb85', '#d4cab4', '#ebcd9e',
    '#e0ab8c', '#c9d4c4', '#d0d8dc', '#eed191', '#e4dac2', '#cfb792'],
  // dachy spadziste: dachówka w odcieniach czerwieni i brązu, czasem blacha
  tiles: ['#a8411f', '#b44a24', '#9a3b1f', '#bb5530', '#8e3a22', '#ad4b2a', '#a2432a', '#833522', '#b85a36', '#963f28', '#5f666b', '#545b60', '#6e5c52'],
  roof: [['#8c5a45', '#6d7073', '#7c6f66', '#5f6367', '#94604a'], ['#8f4b36', '#7a4130', '#6a5f58'], ['#6b6d70', '#7d7f81'], ['#5c6064', '#6e7276'], ['#7d4331', '#4f5b5e']],
};
