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

export const PAL = {
  wall: [['#eadfc6', '#dcc9a6', '#e6d2b6', '#d3dad4', '#e8d6ab', '#dcbca3', '#cdc6b7', '#f0e8d9', '#d9c39d', '#c4ccce', '#e2c7b8', '#c9d3c0'],
    ['#efe9de', '#ddd1bb', '#d0c4ad', '#e6ddca'], ['#a3a097', '#b4b0a6', '#928f89'], ['#d0d8de', '#b5c3cd', '#dde0e2'], ['#b8694b', '#aa5d43', '#d8cdb8']],
  roof: [['#8c5a45', '#6d7073', '#7c6f66', '#5f6367', '#94604a'], ['#8f4b36', '#7a4130', '#6a5f58'], ['#6b6d70', '#7d7f81'], ['#5c6064', '#6e7276'], ['#7d4331', '#4f5b5e']],
};
