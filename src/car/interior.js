import * as THREE from 'three';
import { box, cyl, rbox, rodBetween, torus } from '../core/geometry.js';
import { dialTexture } from './dials.js';
import { loft } from './loft.js';
import { bodyMat, redM, reflM, trimM } from './materials.js';

/* ---------- wnętrze (widoczne przez szyby i z kamery kierowcy) ---------- */
// P = profil nadwozia; o = układ kabiny modelu (zob. interior w car/models/*/index.js):
//   dx, dy      przesunięcie przedniej części kabiny (deska, konsola, kierownica, fotele) względem układu Audi
//   m           materiały: leather, cloth, dash, alu, head, carpet, screen, led, opcjonalnie wheel (kierownica)
//   dials       [obroty, prędkość]: argumenty dialTexture
//   rear        'bench' (kanapa na trzy osoby) albo 'pair' (dwa fotele w coupé 2+2); rearX = położenie
//   doors       boczki drzwi [x, długość]; doorZ = odległość boczków od osi auta
//   head        zakres podsufitki [x0, x1]; shelf = półka tylna [x, y]; floor = podłoga [x, długość]
export function buildInterior(car, P, o) {
  const { m, dx, dy } = o;
  const put = (geom, mat, pos, rot = [0, 0, 0], parent = car) => { const g = new THREE.Mesh(geom, mat); g.position.set(...pos); g.rotation.set(...rot); parent.add(g); return g; };
  const grp = (pos, rot = [0, 0, 0], parent = car) => { const g = new THREE.Group(); g.position.set(...pos); g.rotation.set(...rot); parent.add(g); return g; };
  const F = (x, y, z) => [x + dx, y + dy, z];                                     // punkt przedniej części kabiny
  // deska rozdzielcza: profil boczny wyciągnięty na szerokość kabiny
  {
    const s = new THREE.Shape();
    [[8.75, 9.3], [6.6, 10.2], [5.6, 10.3], [5.15, 10.05], [5.0, 9.3], [5.25, 8.3], [5.9, 7.2], [6.7, 6.2], [8.6, 5.9], [9.1, 6.6]]
      .forEach(([x, y], i) => (i ? s.lineTo(x + dx, y + dy) : s.moveTo(x + dx, y + dy)));
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: o.dashW, bevelEnabled: true, bevelSize: 0.18, bevelThickness: 0.25, bevelSegments: 3 });
    g.translate(0, 0, -o.dashW / 2);
    put(g, m.dash, [0, 0, 0]);
  }
  put(rbox(0.1, 0.16, o.dashW - 0.6, 0.04), m.alu, F(5.0, 8.95, 0));              // listwa ozdobna
  put(rbox(1.5, 0.8, 4.2, 0.35), m.dash, F(5.75, 10.45, -3.7));                   // daszek nad zegarami
  put(rbox(0.12, 1.45, 3.7, 0.08), m.screen, F(5.02, 9.72, -3.7));                // tło zegarów
  const [rpmDial, kmhDial] = o.dials;
  const tacho = new THREE.Mesh(new THREE.CircleGeometry(0.64, 40), bodyMat({ map: dialTexture(...rpmDial), roughness: 0.4 }));
  tacho.geometry.rotateY(-Math.PI / 2); tacho.position.set(...F(4.95, 9.72, -4.5)); car.add(tacho);
  const speedo = new THREE.Mesh(new THREE.CircleGeometry(0.64, 40), bodyMat({ map: dialTexture(...kmhDial), roughness: 0.4 }));
  speedo.geometry.rotateY(-Math.PI / 2); speedo.position.set(...F(4.95, 9.72, -2.9)); car.add(speedo);
  put(rbox(0.05, 0.5, 0.42, 0.03), m.led, F(4.96, 9.62, -3.7));                   // wyświetlacz między zegarami
  for (const z of [-6.2, 6.2]) put(rbox(0.14, 0.45, 0.95, 0.08), m.screen, F(5.05, 9.45, z));   // nawiewy boczne
  if (o.screen) put(rbox(0.9, 1.0, 2.8, 0.2), m.dash, F(...o.screen));             // ekran nawigacji pod daszkiem na środku deski

  // konsola środkowa: nawiewy, radio, klimatyzacja
  {
    const g = grp(F(5.45, 8.2, 0), [0, 0, 0.4]);
    put(rbox(0.35, 2.9, 2.6, 0.12), m.dash, [0, 0, 0], [0, 0, 0], g);
    for (const z of [-0.62, 0.62]) {
      put(rbox(0.1, 0.55, 1.05, 0.06), m.screen, [-0.2, 1.05, z], [0, 0, 0], g);
      for (const y of [0.9, 1.05, 1.2]) put(box(0.12, 0.03, 0.95), m.alu, [-0.24, y, z], [0, 0, 0], g);
    }
    put(rbox(0.1, 0.2, 0.2, 0.04), m.led, [-0.22, 0.66, 0], [0, 0, 0], g);        // światła awaryjne
    put(rbox(0.1, 0.78, 2.3, 0.06), m.screen, [-0.2, 0.2, 0], [0, 0, 0], g);       // radio
    put(rbox(0.11, 0.2, 1.1, 0.03), m.led, [-0.23, 0.36, 0], [0, 0, 0], g);
    for (const z of [-0.88, 0.88]) put(cyl(0.13, 0.12, 'x', 20), m.alu, [-0.28, 0.14, z], [0, 0, 0], g);
    put(rbox(0.1, 0.62, 2.3, 0.06), m.screen, [-0.2, -0.62, 0], [0, 0, 0], g);    // klimatyzacja
    for (const z of [-0.62, 0.62]) put(rbox(0.11, 0.15, 0.46, 0.03), m.led, [-0.23, -0.52, z], [0, 0, 0], g);
    for (let i = 0; i < 5; i++) put(rbox(0.1, 0.1, 0.3, 0.03), m.alu, [-0.24, -0.8, -0.8 + i * 0.4], [0, 0, 0], g);
  }
  put(rbox(6.6, 1.5, 2.3, 0.3), m.dash, F(2.2, 5.6, 0));                         // tunel i konsola
  put(rbox(2.6, 0.4, 2.2, 0.18), m.leather, F(0.0, 6.95, 0));                    // podłokietnik
  put(cyl(0.34, 0.3, 'y', 18, 0.5), m.leather, F(4.0, 6.5, 0));                  // mieszek lewarka
  put(rodBetween(F(4.0, 6.5, 0), F(3.9, 7.4, 0), 0.06, 10), m.alu, [0, 0, 0]);
  put(new THREE.SphereGeometry(0.27, 20, 14), m.leather, F(3.88, 7.58, 0));
  put(cyl(0.2, 0.06, 'y', 16), m.alu, F(3.88, 7.83, 0));
  put(rbox(1.9, 0.22, 0.32, 0.1), m.leather, F(2.3, 6.62, 0.62), [0, 0, -0.3]);  // hamulec ręczny

  // kierownica 3-ramienna z kolumną (kierowca po lewej stronie)
  {
    const w = grp(F(4.25, 9.15, -3.7), [0, 0, -0.395]);
    put(torus(1.72, 0.17, 'x', 44), m.wheel || m.leather, [0, 0, 0], [0, 0, 0], w);
    put(rbox(0.5, 1.05, 1.25, 0.3), m.dash, [0.08, 0, 0], [0, 0, 0], w);
    for (const z of [-1.05, 1.05]) put(rbox(0.16, 0.3, 1.2, 0.1), m.dash, [0.06, -0.05, z], [0, 0, 0], w);
    put(rbox(0.16, 1.15, 0.36, 0.1), m.dash, [0.06, -1.05, 0], [0, 0, 0], w);
    for (const z of [-1.05, 1.05]) put(rbox(0.05, 0.1, 0.9, 0.03), m.alu, [-0.03, 0.08, z], [0, 0, 0], w);
    put(rbox(0.06, 0.18, 0.62, 0.05), m.alu, [-0.2, 0.18, 0], [0, 0, 0], w);
    put(rodBetween([0.1, 0, 0], [1.45, 0, 0], 0.22, 16), m.dash, [0, 0, 0], [0, 0, 0], w);
  }

  // fotel z boczkami i zagłówkiem
  function seat(pos) {
    const s = grp(pos);
    put(rbox(3.6, 0.7, 3.6, 0.15), m.dash, [0, 0.45, 0], [0, 0, 0], s);
    put(rbox(3.9, 0.6, 2.5, 0.25), m.cloth, [0.05, 1.05, 0], [0, 0, 0], s);
    for (const d of [-1.62, 1.62]) put(rbox(3.9, 0.85, 0.85, 0.32), m.leather, [0.05, 1.15, d], [0, 0, 0], s);
    const b = grp([-1.9, 1.3, 0], [0, 0, 0.22], s);
    put(rbox(0.6, 4.6, 2.5, 0.25), m.cloth, [0.15, 2.6, 0], [0, 0, 0], b);
    for (const d of [-1.62, 1.62]) put(rbox(1.0, 4.7, 0.85, 0.35), m.leather, [0.05, 2.55, d], [0, 0, 0], b);
    put(rbox(0.35, 5.0, 4.1, 0.2), m.leather, [-0.4, 2.6, 0], [0, 0, 0], b);
    put(rbox(0.8, 1.4, 2.5, 0.35), m.leather, [-0.05, 5.95, 0], [0, 0, 0], b);
    for (const d of [-0.6, 0.6]) put(cyl(0.05, 0.5, 'y', 8), m.alu, [-0.1, 5.15, d], [0, 0, 0], b);
    return s;
  }
  for (const z of [-3.7, 3.7]) seat(F(1.3, 4.9, z));
  if (o.rear === 'bench') {                                                       // kanapa tylna: trzy miejsca, dwa zagłówki
    const s = grp([o.rearX, 4.9 + dy, 0]);
    put(rbox(4.0, 0.8, 13.0, 0.2), m.dash, [0, 0.45, 0], [0, 0, 0], s);
    for (const z of [-4.3, 0, 4.3]) put(rbox(3.8, 0.7, 4.1, 0.3), m.cloth, [0.05, 1.2, z], [0, 0, 0], s);
    const b = grp([-1.9, 1.4, 0], [0, 0, 0.3], s);
    for (const z of [-4.3, 0, 4.3]) put(rbox(0.9, 4.2, 4.1, 0.35), m.cloth, [0, 2.1, z], [0, 0, 0], b);
    for (const z of [-4.3, 4.3]) {
      put(rbox(0.7, 1.1, 2.3, 0.3), m.leather, [-0.1, 4.85, z], [0, 0, 0], b);
      for (const d of [-0.55, 0.55]) put(cyl(0.05, 0.4, 'y', 8), m.alu, [-0.1, 4.2, z + d], [0, 0, 0], b);
    }
  } else {                                                                        // coupé 2+2: dwa fotele z tunelem pośrodku
    for (const z of [-3.5, 3.5]) seat([o.rearX, 4.7 + dy, z]).scale.set(0.95, 0.9, 0.95);
    put(rbox(4.2, 2.2, 2.6, 0.3), m.leather, [o.rearX, 6.0 + dy, 0]);
  }
  // boczki drzwi
  const dz = o.doorZ;
  for (const s of [-1, 1]) for (const [x, len] of o.doors) {
    put(rbox(len, 4.4, 0.35, 0.15), m.leather, [x, 7.25 + dy, s * dz]);
    put(rbox(len * 0.5, 0.35, 0.7, 0.12), m.leather, [x - len * 0.05, 7.7 + dy, s * (dz - 0.4)]);
    put(rbox(len * 0.92, 0.08, 0.06, 0.02), m.alu, [x, 9.1 + dy, s * (dz - 0.19)]);
    put(rbox(0.8, 0.25, 0.12, 0.05), m.alu, [x + len * 0.27, 8.5 + dy, s * (dz - 0.19)]);
    put(cyl(0.55, 0.06, 'z', 24), m.dash, [x + len * 0.3, 5.9 + dy, s * (dz - 0.18)]);
  }
  // podsufitka pod dachem (cienka powłoka o kształcie dachu)
  function headHalf(x) {
    const top = P.glassHalf(x).filter(p => p[2] === 'top'), c = top[0], mid = top[top.length - 1];
    return [[0, mid[1] - 0.38, 'h', 0], [c[0] - 0.35, c[1] - 0.42, 'h', 0], ...top.map(([z, y]) => [z * 0.96, y - 0.14, 'h', 0])];
  }
  loft(car, o.head[0], o.head[1], 70, headHalf, () => 0, [m.head]);
  const RF = P.roofFront, roofInner = P.roofInner;
  for (const s of [-1, 1]) {                                                      // osłony przeciwsłoneczne pod szybą
    const xa = RF - 0.3, xb = RF + 1.1, zo = s * 5.6, ya = roofInner(xa, zo), yb = roofInner(xb, zo);
    put(rbox(1.45, 0.12, 4.2, 0.06), m.head, [(xa + xb) / 2, (ya + yb) / 2 - 0.34, s * 3.5], [0, 0, Math.atan2(yb - ya, xb - xa)]);
  }
  {                                                                               // lusterko wsteczne na szybie
    const xs = RF + 1.5, ys = roofInner(xs, 0) - 0.08, xm = RF + 1.15, ym = roofInner(xm + 0.3, 0.9) - 0.75;
    put(rodBetween([xs, ys, 0], [xm + 0.1, ym + 0.2, 0], 0.06, 8), m.dash, [0, 0, 0]);
    put(rbox(0.25, 0.55, 2.4, 0.15), m.dash, [xm, ym, 0]);
    put(rbox(0.05, 0.44, 2.2, 0.05), reflM, [xm - 0.13, ym, 0]);
  }
  // półka tylna, trzecie światło stop, podłoga z tunelem
  const [shx, shy] = o.shelf;
  put(rbox(4.4, 0.25, 14.2, 0.1), m.carpet, [shx, shy, 0]);
  put(rbox(0.4, 0.22, 2.6, 0.08), redM, [shx - 1.6, shy + 0.22, 0]);
  const [fx, flen] = o.floor;
  put(box(flen, 0.3, 15.2), m.carpet, [fx, 4.7, 0]);
  put(rbox(flen - 0.5, 1.0, 2.4, 0.3), m.carpet, [fx, 5.0, 0]);
  // podłoga pod kabiną
  { const under = new THREE.Mesh(box(flen - 0.5, 0.25, 14.5), trimM); under.position.set(fx + 1.25, 2.3, 0); car.add(under); }
}
