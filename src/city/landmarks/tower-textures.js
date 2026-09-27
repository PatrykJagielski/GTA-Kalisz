import { canvasTex } from '../../core/textures.js';

/* ---------- tekstury wież wspólne dla ratusza i kolegiaty: tarcza zegara, ściana z łukowym otworem ---------- */
export function clockTex() {
  return canvasTex(256, (g, n) => {
    const c = n / 2;
    g.fillStyle = '#c9a24a'; g.beginPath(); g.arc(c, c, c - 2, 0, 7); g.fill();
    g.fillStyle = '#1f2a33'; g.beginPath(); g.arc(c, c, c - 14, 0, 7); g.fill();
    g.strokeStyle = '#d8b660'; g.lineCap = 'round';
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.lineWidth = i % 3 ? 5 : 9; g.beginPath(); g.moveTo(c + Math.cos(a) * (c - 24), c + Math.sin(a) * (c - 24)); g.lineTo(c + Math.cos(a) * (c - 44), c + Math.sin(a) * (c - 44)); g.stroke(); }
    g.lineWidth = 9; g.beginPath(); g.moveTo(c, c); g.lineTo(c + 42, c - 40); g.stroke();       // 10:10
    g.lineWidth = 6; g.beginPath(); g.moveTo(c, c); g.lineTo(c - 62, c - 58); g.stroke();
    g.fillStyle = '#d8b660'; g.beginPath(); g.arc(c, c, 8, 0, 7); g.fill();
  }, false);
}
export function archTex(base, open, frame) {                                           // ściana hełmu / latarni z łukowym otworem
  return canvasTex(128, (g, n) => {
    g.fillStyle = base; g.fillRect(0, 0, n, n);
    g.fillStyle = frame; g.fillRect(24, 16, 80, 106);
    g.fillStyle = open; g.beginPath(); g.moveTo(34, 118); g.lineTo(34, 52); g.arc(64, 52, 30, Math.PI, 0); g.lineTo(94, 118); g.fill();
    g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(0, 0, 5, n);
  });
}
