import { $ } from '../core/dom.js';
import { drive } from './state.js';

/* ---------- minimapa: gotowy plan miasta obracany za graczem, strzałka gracza, auto (gdy idzie pieszo) i północ ---------- */
const mapCanvas = $('minimap'), mapG = mapCanvas.getContext('2d');
// car = środek zaparkowanego auta { cx, cz }, jeśli gracz wysiadł
export function drawMinimap(cx, cz, psi, car) {
  const g = mapG, C = drive.city, n = mapCanvas.width, rot = psi - Math.PI / 2;
  g.fillStyle = '#7b8a63'; g.fillRect(0, 0, n, n);
  g.save(); g.translate(n / 2, n / 2); g.rotate(rot);
  g.drawImage(C.map, -(cx - C.bounds[0]) * C.MS, -(cz - C.bounds[1]) * C.MS);
  if (car) {
    g.fillStyle = '#e8eef3'; g.strokeStyle = '#1b1300'; g.lineWidth = 2;
    g.beginPath(); g.arc((car.cx - cx) * C.MS, (car.cz - cz) * C.MS, 7, 0, 7); g.fill(); g.stroke();
  }
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
