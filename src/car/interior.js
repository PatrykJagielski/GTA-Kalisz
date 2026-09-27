import * as THREE from 'three';
import { box, cyl, rbox, rodBetween, torus } from '../core/geometry.js';
import { dialTexture } from './dials.js';
import { CAR } from './dimensions.js';
import { loft } from './loft.js';
import { aluM, bodyMat, carpetM, clothM, dashM, headM, leatherM, ledM, redM, reflM, screenM, trimM } from './materials.js';
import { ROOF_FRONT, glassHalf, roofY, topY } from './profile.js';

/* ---------- wnętrze (widoczne przez szyby) ---------- */
export function buildInterior(car) {
  const put = (geom, mat, pos, rot = [0, 0, 0], parent = car) => { const m = new THREE.Mesh(geom, mat); m.position.set(...pos); m.rotation.set(...rot); parent.add(m); return m; };
  const grp = (pos, rot = [0, 0, 0], parent = car) => { const g = new THREE.Group(); g.position.set(...pos); g.rotation.set(...rot); parent.add(g); return g; };
  // deska rozdzielcza: profil boczny wyciągnięty na szerokość kabiny
  {
    const s = new THREE.Shape();
    [[8.75, 9.3], [6.6, 10.2], [5.6, 10.3], [5.15, 10.05], [5.0, 9.3], [5.25, 8.3], [5.9, 7.2], [6.7, 6.2], [8.6, 5.9], [9.1, 6.6]]
      .forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 14.0, bevelEnabled: true, bevelSize: 0.18, bevelThickness: 0.25, bevelSegments: 3 });
    g.translate(0, 0, -7.0);
    put(g, dashM, [0, 0, 0]);
  }
  put(rbox(0.1, 0.16, 13.4, 0.04), aluM, [5.0, 8.95, 0]);                      // aluminiowa listwa
  put(rbox(1.5, 0.8, 4.2, 0.35), dashM, [5.75, 10.45, -3.7]);                   // daszek nad zegarami
  put(rbox(0.12, 1.45, 3.7, 0.08), screenM, [5.02, 9.72, -3.7]);                // tło zegarów
  const tacho = new THREE.Mesh(new THREE.CircleGeometry(0.64, 40), bodyMat({ map: dialTexture(6, 0.5, 1, '1/min ×1000', 4.5), roughness: 0.4 }));
  tacho.geometry.rotateY(-Math.PI / 2); tacho.position.set(4.95, 9.72, -4.5); car.add(tacho);
  const speedo = new THREE.Mesh(new THREE.CircleGeometry(0.64, 40), bodyMat({ map: dialTexture(260, 10, 40, 'km/h', 0), roughness: 0.4 }));
  speedo.geometry.rotateY(-Math.PI / 2); speedo.position.set(4.95, 9.72, -2.9); car.add(speedo);
  put(rbox(0.05, 0.5, 0.42, 0.03), ledM, [4.96, 9.62, -3.7]);                   // wyświetlacz między zegarami
  for (const z of [-6.2, 6.2]) put(rbox(0.14, 0.45, 0.95, 0.08), screenM, [5.05, 9.45, z]);   // nawiewy boczne

  // konsola środkowa: nawiewy, radio, Climatronic
  {
    const g = grp([5.45, 8.2, 0], [0, 0, 0.4]);
    put(rbox(0.35, 2.9, 2.6, 0.12), dashM, [0, 0, 0], [0, 0, 0], g);
    for (const z of [-0.62, 0.62]) {
      put(rbox(0.1, 0.55, 1.05, 0.06), screenM, [-0.2, 1.05, z], [0, 0, 0], g);
      for (const y of [0.9, 1.05, 1.2]) put(box(0.12, 0.03, 0.95), aluM, [-0.24, y, z], [0, 0, 0], g);
    }
    put(rbox(0.1, 0.2, 0.2, 0.04), ledM, [-0.22, 0.66, 0], [0, 0, 0], g);        // światła awaryjne
    put(rbox(0.1, 0.78, 2.3, 0.06), screenM, [-0.2, 0.2, 0], [0, 0, 0], g);       // radio
    put(rbox(0.11, 0.2, 1.1, 0.03), ledM, [-0.23, 0.36, 0], [0, 0, 0], g);
    for (const z of [-0.88, 0.88]) put(cyl(0.13, 0.12, 'x', 20), aluM, [-0.28, 0.14, z], [0, 0, 0], g);
    put(rbox(0.1, 0.62, 2.3, 0.06), screenM, [-0.2, -0.62, 0], [0, 0, 0], g);    // Climatronic
    for (const z of [-0.62, 0.62]) put(rbox(0.11, 0.15, 0.46, 0.03), ledM, [-0.23, -0.52, z], [0, 0, 0], g);
    for (let i = 0; i < 5; i++) put(rbox(0.1, 0.1, 0.3, 0.03), aluM, [-0.24, -0.8, -0.8 + i * 0.4], [0, 0, 0], g);
  }
  put(rbox(6.6, 1.5, 2.3, 0.3), dashM, [2.2, 5.6, 0]);                         // tunel i konsola
  put(rbox(2.6, 0.4, 2.2, 0.18), leatherM, [0.0, 6.95, 0]);                    // podłokietnik
  put(cyl(0.34, 0.3, 'y', 18, 0.5), leatherM, [4.0, 6.5, 0]);                  // mieszek lewarka
  put(rodBetween([4.0, 6.5, 0], [3.9, 7.4, 0], 0.06, 10), aluM, [0, 0, 0]);
  put(new THREE.SphereGeometry(0.27, 20, 14), leatherM, [3.88, 7.58, 0]);
  put(cyl(0.2, 0.06, 'y', 16), aluM, [3.88, 7.83, 0]);
  put(rbox(1.9, 0.22, 0.32, 0.1), leatherM, [2.3, 6.62, 0.62], [0, 0, -0.3]);  // hamulec ręczny

  // kierownica 3-ramienna z kolumną (kierowca po lewej stronie)
  {
    const w = grp([4.25, 9.15, -3.7], [0, 0, -0.395]);
    put(torus(1.72, 0.17, 'x', 44), leatherM, [0, 0, 0], [0, 0, 0], w);
    put(rbox(0.5, 1.05, 1.25, 0.3), dashM, [0.08, 0, 0], [0, 0, 0], w);
    for (const z of [-1.05, 1.05]) put(rbox(0.16, 0.3, 1.2, 0.1), dashM, [0.06, -0.05, z], [0, 0, 0], w);
    put(rbox(0.16, 1.15, 0.36, 0.1), dashM, [0.06, -1.05, 0], [0, 0, 0], w);
    for (const z of [-1.05, 1.05]) put(rbox(0.05, 0.1, 0.9, 0.03), aluM, [-0.03, 0.08, z], [0, 0, 0], w);
    put(rbox(0.06, 0.18, 0.62, 0.05), aluM, [-0.2, 0.18, 0], [0, 0, 0], w);
    put(rodBetween([0.1, 0, 0], [1.45, 0, 0], 0.22, 16), dashM, [0, 0, 0], [0, 0, 0], w);
  }

  // fotele przednie z boczkami i zagłówkami
  for (const z of [-3.7, 3.7]) {
    const s = grp([1.3, 4.9, z]);
    put(rbox(3.6, 0.7, 3.6, 0.15), dashM, [0, 0.45, 0], [0, 0, 0], s);
    put(rbox(3.9, 0.6, 2.5, 0.25), clothM, [0.05, 1.05, 0], [0, 0, 0], s);
    for (const d of [-1.62, 1.62]) put(rbox(3.9, 0.85, 0.85, 0.32), leatherM, [0.05, 1.15, d], [0, 0, 0], s);
    const b = grp([-1.9, 1.3, 0], [0, 0, 0.22], s);
    put(rbox(0.6, 4.6, 2.5, 0.25), clothM, [0.15, 2.6, 0], [0, 0, 0], b);
    for (const d of [-1.62, 1.62]) put(rbox(1.0, 4.7, 0.85, 0.35), leatherM, [0.05, 2.55, d], [0, 0, 0], b);
    put(rbox(0.35, 5.0, 4.1, 0.2), leatherM, [-0.4, 2.6, 0], [0, 0, 0], b);
    put(rbox(0.8, 1.4, 2.5, 0.35), leatherM, [-0.05, 5.95, 0], [0, 0, 0], b);
    for (const d of [-0.6, 0.6]) put(cyl(0.05, 0.5, 'y', 8), aluM, [-0.1, 5.15, d], [0, 0, 0], b);
  }
  // kanapa tylna: trzy miejsca, dwa zagłówki
  {
    const s = grp([-8.6, 4.9, 0]);
    put(rbox(4.0, 0.8, 13.0, 0.2), dashM, [0, 0.45, 0], [0, 0, 0], s);
    for (const z of [-4.3, 0, 4.3]) put(rbox(3.8, 0.7, 4.1, 0.3), clothM, [0.05, 1.2, z], [0, 0, 0], s);
    const b = grp([-1.9, 1.4, 0], [0, 0, 0.3], s);
    for (const z of [-4.3, 0, 4.3]) put(rbox(0.9, 4.2, 4.1, 0.35), clothM, [0, 2.1, z], [0, 0, 0], b);
    for (const z of [-4.3, 4.3]) {
      put(rbox(0.7, 1.1, 2.3, 0.3), leatherM, [-0.1, 4.85, z], [0, 0, 0], b);
      for (const d of [-0.55, 0.55]) put(cyl(0.05, 0.4, 'y', 8), aluM, [-0.1, 4.2, z + d], [0, 0, 0], b);
    }
  }
  // boczki drzwi
  for (const s of [-1, 1]) for (const [x, len] of [[1.3, 8.2], [-7.4, 8.6]]) {
    put(rbox(len, 4.4, 0.35, 0.15), leatherM, [x, 7.25, s * 7.95]);
    put(rbox(len * 0.5, 0.35, 0.7, 0.12), leatherM, [x - len * 0.05, 7.7, s * 7.55]);
    put(rbox(len * 0.92, 0.08, 0.06, 0.02), aluM, [x, 9.1, s * 7.76]);
    put(rbox(0.8, 0.25, 0.12, 0.05), aluM, [x + len * 0.27, 8.5, s * 7.76]);
    put(cyl(0.55, 0.06, 'z', 24), dashM, [x + len * 0.3, 5.9, s * 7.77]);
  }
  // podsufitka pod dachem (cienka powłoka o kształcie dachu)
  function headHalf(x) {
    const top = glassHalf(x).filter(p => p[2] === 'top'), c = top[0], mid = top[top.length - 1];
    return [[0, mid[1] - 0.38, 'h', 0], [c[0] - 0.35, c[1] - 0.42, 'h', 0], ...top.map(([z, y]) => [z * 0.96, y - 0.14, 'h', 0])];
  }
  loft(car, -10.2, ROOF_FRONT - 0.1, 70, headHalf, () => 0, [headM]);
  // wewnętrzna powierzchnia szyby / dachu w punkcie (x, z) — ten sam wzór co glassHalf
  function roofInner(x, z) {
    const y0 = topY(x) - 0.1, h = Math.max(0.001, roofY(x) - y0), wt = CAR.W - 0.95 - Math.min(1.25, h * 0.3);
    const crown = Math.min(0.42, h * 0.22), y1 = y0 + h - crown;
    return y1 + crown * (1 - (Math.min(Math.abs(z), wt) / wt) ** 2);
  }
  for (const s of [-1, 1]) {                                                      // osłony przeciwsłoneczne pod szybą
    const xa = ROOF_FRONT - 0.3, xb = ROOF_FRONT + 1.1, zo = s * 5.6, ya = roofInner(xa, zo), yb = roofInner(xb, zo);
    put(rbox(1.45, 0.12, 4.2, 0.06), headM, [(xa + xb) / 2, (ya + yb) / 2 - 0.34, s * 3.5], [0, 0, Math.atan2(yb - ya, xb - xa)]);
  }
  {                                                                               // lusterko wsteczne na szybie
    const xs = ROOF_FRONT + 1.5, ys = roofInner(xs, 0) - 0.08, xm = ROOF_FRONT + 1.15, ym = roofInner(xm + 0.3, 0.9) - 0.75;
    put(rodBetween([xs, ys, 0], [xm + 0.1, ym + 0.2, 0], 0.06, 8), dashM, [0, 0, 0]);
    put(rbox(0.25, 0.55, 2.4, 0.15), dashM, [xm, ym, 0]);
    put(rbox(0.05, 0.44, 2.2, 0.05), reflM, [xm - 0.13, ym, 0]);
  }
  // półka tylna, trzecie światło stop, podłoga z tunelem
  put(rbox(4.4, 0.25, 14.2, 0.1), carpetM, [-14.0, 10.0, 0]);
  put(rbox(0.4, 0.22, 2.6, 0.08), redM, [-15.6, 10.22, 0]);
  put(box(20.5, 0.3, 15.2), carpetM, [-1.75, 4.7, 0]);
  put(rbox(20, 1.0, 2.4, 0.3), carpetM, [-1.75, 5.0, 0]);
  // podłoga pod kabiną
  { const under = new THREE.Mesh(box(20, 0.25, 14.5), trimM); under.position.set(-0.5, 2.3, 0); car.add(under); }
}
