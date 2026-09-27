import { $ } from '../core/dom.js';
import { drive, st } from './state.js';

/* ---------- minimapa: gotowy plan miasta obracany za autem, strzałka auta i kierunek północy ---------- */
const mapCanvas = $('minimap'), mapG = mapCanvas.getContext('2d');
export function drawMinimap(cx, cz) {
  const g = mapG, C = drive.city, n = mapCanvas.width, rot = st.psi - Math.PI / 2;
  g.fillStyle = '#7b8a63'; g.fillRect(0, 0, n, n);
  g.save(); g.translate(n / 2, n / 2); g.rotate(rot);
  g.drawImage(C.map, -(cx - C.bounds[0]) * C.MS, -(cz - C.bounds[1]) * C.MS);
  g.restore();
  g.save(); g.translate(n / 2, n / 2);
  g.fillStyle = '#e09a12'; g.strokeStyle = '#1b1300'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(0, -13); g.lineTo(8, 8); g.lineTo(0, 4); g.lineTo(-8, 8); g.closePath(); g.fill(); g.stroke();
  const na = rot - Math.PI / 2, nr = n / 2 - 22;                               // północ na brzegu mapy
  g.translate(Math.cos(na) * nr, Math.sin(na) * nr);
  g.fillStyle = 'rgba(20,24,28,.78)'; g.beginPath(); g.arc(0, 0, 15, 0, 7); g.fill();
  g.fillStyle = '#fff'; g.font = '700 18px Barlow Condensed, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('N', 0, 1);
  g.restore();
}
