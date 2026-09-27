import * as THREE from 'three';

// polska tablica rejestracyjna 520 × 114 mm: pasek UE z „PL”, czarne znaki; tylna z naklejką legalizacyjną
export function plateTexture(text, sticker) {
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
