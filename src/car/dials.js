import * as THREE from 'three';

// tarcze zegarów: łuk 270°, wskazówka, opcjonalne czerwone pole
export function dialTexture(max, minor, labelStep, label, red) {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const draw = () => {
    const g = c.getContext('2d'), a0 = Math.PI * 0.75, a1 = Math.PI * 2.25, ang = v => a0 + (a1 - a0) * v / max;
    g.clearRect(0, 0, 256, 256);
    g.fillStyle = '#0b0c0e'; g.beginPath(); g.arc(128, 128, 126, 0, 7); g.fill();
    g.strokeStyle = '#c9cdd3'; g.lineWidth = 6; g.beginPath(); g.arc(128, 128, 122, 0, 7); g.stroke();
    if (red) { g.strokeStyle = '#d0141e'; g.lineWidth = 12; g.beginPath(); g.arc(128, 128, 102, ang(red), a1); g.stroke(); }
    g.strokeStyle = g.fillStyle = '#f2f2f2'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '600 24px "Barlow Condensed", "Arial Narrow", Arial, sans-serif';
    for (let v = 0; v <= max + 1e-6; v += minor) {
      const a = ang(v), major = Math.abs(v / labelStep - Math.round(v / labelStep)) < 1e-6, r2 = major ? 88 : 98;
      g.lineWidth = major ? 4 : 2; g.beginPath(); g.moveTo(128 + 110 * Math.cos(a), 128 + 110 * Math.sin(a)); g.lineTo(128 + r2 * Math.cos(a), 128 + r2 * Math.sin(a)); g.stroke();
      if (major) g.fillText(String(v), 128 + 70 * Math.cos(a), 128 + 70 * Math.sin(a));
    }
    g.fillStyle = '#9aa0a8'; g.font = '500 15px "IBM Plex Sans", Arial, sans-serif'; g.fillText(label, 128, 182);
    const av = ang(max * 0.1);
    g.strokeStyle = '#ff2a14'; g.lineWidth = 5; g.beginPath(); g.moveTo(128, 128); g.lineTo(128 + 100 * Math.cos(av), 128 + 100 * Math.sin(av)); g.stroke();
    g.fillStyle = '#2a2c30'; g.beginPath(); g.arc(128, 128, 13, 0, 7); g.fill();
    tex.needsUpdate = true;
  };
  draw();
  if (document.fonts) document.fonts.load('600 24px "Barlow Condensed"').then(draw).catch(() => {});
  return tex;
}
