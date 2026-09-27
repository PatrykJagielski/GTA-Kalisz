import * as THREE from 'three';
import { TessellateModifier } from 'three/addons/modifiers/TessellateModifier.js';
import { V } from '../core/geometry.js';
import { sideZ, surfX } from './profile.js';

/* ---------- dekale: płaskie obrysy dopasowane do powierzchni nadwozia (grill, lampy, szczeliny drzwi) ---------- */
const tess = new TessellateModifier(0.22, 8);
function outlineGeom(outline) {
  const g = new THREE.ShapeGeometry(new THREE.Shape(outline.map(([a, b]) => new THREE.Vector2(a, b))), 4);
  return tess.modify(g);
}
export function decalsOn(car) {
  // dekal na przodzie (front=true) lub tyle; outline w rzucie [z, y]; off = odsunięcie wzdłuż normalnej
  function faceDecal(outline, front, off, mat, mirror = true, uvBox = null) {
    const make = (sgn) => {
      const g = outlineGeom(outline.map(([z, y]) => [z * sgn, y])), p = g.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const z = p.getX(i), y = p.getY(i), x = surfX(z, y, front), e = 0.06;
        const dz = (surfX(z + e, y, front) - surfX(z - e, y, front)) / (2 * e), dy = (surfX(z, y + e, front) - surfX(z, y - e, front)) / (2 * e);
        const nn = (front ? V(1, -dy, -dz) : V(-1, dy, dz)).normalize();   // normalna zewnętrzna
        if (uvBox) {                      // tekstura czytelna dla patrzącego z przodu lub z tyłu
          const [z0, y0, z1, y1] = uvBox;
          g.attributes.uv.setXY(i, front ? (z1 - z) / (z1 - z0) : (z - z0) / (z1 - z0), (y - y0) / (y1 - y0));
        }
        p.setXYZ(i, x + nn.x * off, y + nn.y * off, z + nn.z * off);
      }
      g.computeVertexNormals(); const m = new THREE.Mesh(g, mat); car.add(m); return m;
    };
    make(1); if (mirror) make(-1);
  }
  // dekal na boku: outline w rzucie [x, y], obie strony auta
  // strony: +1 = prawa (+z), −1 = lewa (−z, strona kierowcy)
  function sideDecal(outline, off, mat, sides = [1, -1]) {
    for (const sgn of sides) {
      const g = outlineGeom(outline), p = g.attributes.position;
      for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setXYZ(i, x, y, sgn * (sideZ(x, y) + off)); }
      g.computeVertexNormals(); car.add(new THREE.Mesh(g, mat));
    }
  }
  return { faceDecal, sideDecal };
}
export function strip(pts, w) {                 // cienki pasek wzdłuż łamanej -> obrys
  const L = [], R = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1]; const l = Math.hypot(tx, ty); tx /= l; ty /= l;
    L.push([p[0] - ty * w / 2, p[1] + tx * w / 2]); R.push([p[0] + ty * w / 2, p[1] - tx * w / 2]);
  });
  return L.concat(R.reverse());
}
export const circle = (cz, cy, r, n = 28) => Array.from({ length: n }, (_, i) => [cz + r * Math.cos(i / n * 6.283), cy + r * Math.sin(i / n * 6.283)]);
export const rect = (z0, y0, z1, y1) => [[z0, y0], [z1, y0], [z1, y1], [z0, y1]];
