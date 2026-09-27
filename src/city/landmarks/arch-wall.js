import * as THREE from 'three';

/* ---------- ściana z łukowymi otworami (arkady, drzwi, okna) ---------- */
// lico w płaszczyźnie XY: x od 0 do len, y od 0 do top, grubość w −z; otwór [środek, szerokość, wierzchołek łuku, parapet]:
// bez parapetu sięga ziemi (arkada, drzwi), z parapetem jest oknem. UV lica = cała tekstura na całą ścianę.
// Materiały: 0 = lico, 1 = ościeża i krawędzie, 2 = lico tylne.
export function archWall(len, arches, top, thick) {
  const s = new THREE.Shape(); s.moveTo(0, 0);
  for (const [c, w, cr, sill = 0] of arches) {
    const r = w / 2;
    if (sill) {
      const h = new THREE.Path(); h.moveTo(c - r, sill); h.lineTo(c + r, sill); h.lineTo(c + r, cr - r); h.absarc(c, cr - r, r, 0, Math.PI, false); h.closePath();
      s.holes.push(h);
    } else { s.lineTo(c - r, 0); s.lineTo(c - r, cr - r); s.absarc(c, cr - r, r, Math.PI, 0, true); s.lineTo(c + r, 0); }
  }
  s.lineTo(len, 0); s.lineTo(len, top); s.lineTo(0, top); s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: thick, bevelEnabled: false, curveSegments: 20 }).translate(0, 0, -thick);
  const p = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / len, p.getY(i) / top);
  const [lids] = geo.groups.splice(0, 1), half = lids.count / 2;                 // ExtrudeGeometry: najpierw spód (tył), potem wierzch (lico)
  geo.addGroup(lids.start, half, 2); geo.addGroup(lids.start + half, half, 0);
  return geo;
}
