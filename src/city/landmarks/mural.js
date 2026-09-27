import * as THREE from 'three';
import { V } from '../../core/geometry.js';
import { rng } from '../../core/random.js';
import { LINE, MUR, SERIF, SG, circ, herbRound, pen, pl, river, road, runner, sgAge, sgBg, spaced, srect, tree, windRose } from './mural-drawing.js';

/* ---------- Sgraffito W. Kościelniaka (1974), ul. Stawiszyńska 3 / róg Warszawskiej: czerwony rysunek na żółtym tynku ---------- */
// ściana frontowa (od Warszawskiej): plan miasta z zabytkami, Prosna, drogi, drzewka, herb i róża wiatrów, napis u dołu;
// wąska ściana boczna po prawej: postacie w strojach ludowych i „Wita Was Ziemia Kaliska”
// ściana szczytowa (L × T, y w dół od szczytu T; wysokość h -> y = T − h)
function drawMuralMap(g, L, T) {
  const Y = h => T - h, R = rng(1974);
  sgBg(g, L, T + 2, 1974);
  const E = L - 185;                                                                     // kompozycja 18,5 m przy prawym narożniku, plan ciągnie się w lewo
  g.save(); g.translate(E, 0); pen(g);
  const topAt = x => Math.min(MUR.top, MUR.eave + (MUR.top - MUR.eave) * (x + E) / (0.3 * L));
  // Prosna: odnogi w lewym dolnym rogu i nurt przez środek ściany
  river(g, [[-E - 2, Y(58)], [-E / 2, Y(56)], [-2, Y(52)], [20, Y(48)], [40, Y(38)], [58, Y(30)], [70, Y(26)]], 5.5, R);
  river(g, [[-E - 2, Y(34)], [-E / 2, Y(33)], [-2, Y(30)], [18, Y(25)], [38, Y(19)], [60, Y(16)], [74, Y(15)]], 4.5, R);
  river(g, [[70, Y(164)], [69, Y(130)], [72, Y(95)], [73, Y(60)], [76, Y(30)], [80, Y(11)]], 6.5, R);
  // zabytki na planie (kwartały pod nimi zostają puste)
  const icons = [['katedra', 22, Y(110), 16], ['bliznieta', 41, Y(127), 14], ['palac', 20, Y(92), 12], ['ratusz', 42, Y(102), 16], ['kolegiata', 54, Y(86), 14],
    ['teatr', 20, Y(72), 12], ['dorotka', 37, Y(64), 12], ['palac', 58, Y(122), 10], ['dom', 10, Y(56), 8], ['palac', 33, Y(12), 11], ['teatr', 58, Y(12), 10], ['dom', 5, Y(16), 7],
    ['kolegiata', -E + 22, Y(88), 13], ['palac', -E + 50, Y(104), 12], ['bliznieta', -E + 70, Y(78), 13], ['dom', -E + 30, Y(66), 8], ['dorotka', -12, Y(112), 11], ['palac', -E + 40, Y(14), 10], ['dom', -30, Y(18), 8]];
  const nearIcon = ([x, y]) => icons.some(([, ix, iy, s]) => Math.abs(x - ix) < s * 0.75 && y > iy - s * 1.25 && y < iy + 4);
  // plan śródmieścia: kwartały w obróconej siatce ulic
  const a = [0.8, -0.6], b = [0.6, 0.8], O = [2, Y(66)], cw = 13.5, chh = 11;
  const spots = [];
  for (let i = -10; i < 9; i++) for (let j = -12; j < 7; j++) {
    const c = (p, q) => [O[0] + (i + p) * cw * a[0] + (j + q) * chh * b[0], O[1] + (i + p) * cw * a[1] + (j + q) * chh * b[1]];
    const ctr = c(0.5, 0.5), hC = T - ctr[1];
    if (ctr[0] < -E + 4 || ctr[0] > 62 || hC < 50 - Math.max(0, ctr[0]) * 0.25 + (ctr[0] < 0 ? 12 : 0) || hC > topAt(ctr[0]) - 9) continue;
    const ins = 0.12 + R() * 0.04, jit = () => (R() - 0.5) * 0.8;
    const q = [c(ins, ins), c(1 - ins, ins), c(1 - ins, 1 - ins), c(ins, 1 - ins)].map(([x, y]) => [x + jit(), y + jit()]);
    if (nearIcon(ctr)) continue;
    spots.push(ctr);
    if (R() < 0.18) { g.beginPath(); g.ellipse(ctr[0], ctr[1], 3.8, 3, 0.3, 0, 7); g.stroke(); } else pl(g, q, true);
  }
  for (const [k, x, y, s] of icons) LINE[k](g, x, y, s);
  // drogi wylotowe (z numerem drogi krajowej) i drzewka w parku
  road(g, [76, Y(92)], [141, Y(56)], 3.2); road(g, [78, Y(58)], [132, Y(20)], 3.2); road(g, [77, Y(140)], [102, Y(152)], 2.6); road(g, [98, Y(158)], [136, Y(96)], 2.6);
  pl(g, [[136, Y(64)], [146, Y(54)], [136, Y(50)]]); pl(g, [[143, Y(56)], [150, Y(58)]]);
  g.font = `600 5px ${SERIF}`; g.fillText('38', 150, Y(54));
  for (let i = 0; i < 38; i++) { const x = 82 + R() * 60, h = 20 + R() * 125; if (h > topAt(x) - 8 || Math.abs((T - h) - (Y(92) + (x - 76) * 36 / 65)) < 4) continue; tree(g, x, Y(h), 2.4); }
  // drobne symbole: biegacze, drogowskaz, tramwaj, medalion z jabłkiem, piorun
  runner(g, 122, Y(112), 9); runner(g, 117, Y(96), 8);
  pl(g, [[108, Y(152)], [108, Y(143)]]); pl(g, [[104, Y(152)], [112, Y(152)]]);
  circ(g, 97, Y(44), 4); circ(g, 97, Y(44), 3); circ(g, 97, Y(44.5), 1.6); pl(g, [[97, Y(46)], [97.6, Y(47.2)]]);
  srect(g, 102, Y(29), 11, 5); pl(g, [[104, Y(29)], [104, Y(33)], [111, Y(33)], [111, Y(29)]]); circ(g, 104, Y(23), 1.2); circ(g, 111, Y(23), 1.2); pl(g, [[99, Y(22)], [116, Y(22)]]);
  pl(g, [[123, Y(26)], [126, Y(22)], [124, Y(22)], [127, Y(18)]]);
  herbRound(g, 150, Y(140), 12); windRose(g, 150, Y(102), 13);
  g.restore();
  // napis przy chodniku
  g.fillStyle = SG.line; spaced(g, 'KALISZ - MIASTO ZE WSZYSTKICH W POLSCE NAJSTARSZE', L / 2, Y(3), `500 7.2px ${SERIF}`, 1.1, L - 10);
  sgAge(g, L, T + 2, 7401);
}

// postać kreską: woman = chusta, gorset, szeroka spódnica z zapaską; man = kapelusz, sukmana; flag = uniesiona ręka z chorągiewką
function lineFolk(g, x, y, h, woman, flag = false, dir = 1) {
  const u = h / 30, P = pts => pl(g, pts.map(([a, b]) => [x + a * u * dir, y - b * u]));
  pen(g, 0.5);
  if (woman) {
    g.fillStyle = SG.fill; g.beginPath(); [[-6, 3], [6, 3], [3, 15], [-3, 15]].forEach(([a, b], i) => i ? g.lineTo(x + a * u, y - b * u) : g.moveTo(x + a * u, y - b * u)); g.fill();
    P([[-6, 3], [6, 3], [3, 15], [-3, 15], [-6, 3]]); for (const b of [5, 7]) P([[-5.5 + (b - 3) * 0.25, b], [5.5 - (b - 3) * 0.25, b]]);
    P([[-2.2, 4.5], [2.2, 4.5], [1.8, 14.5], [-1.8, 14.5], [-2.2, 4.5]]);                // zapaska
    P([[-1.4, 3], [-1.4, 0]]); P([[1.4, 3], [1.4, 0]]);
    P([[-2.6, 15], [-2.2, 20.5], [2.2, 20.5], [2.6, 15]]); P([[0, 15.5], [0, 20]]);
    P([[-2.2, 20.5], [-4.2, 17], [-3.6, 13]]); P([[2.2, 20.5], [4.2, 17], [3.6, 13]]);
    circ(g, x, y - 23.2 * u, 1.9 * u); P([[-2.4, 22.6], [-2.2, 25.6], [0, 26.8], [2.2, 25.6], [2.4, 22.6]]); P([[2.2, 22.4], [3.6, 21], [3, 20.6]]);
    g.fillStyle = SG.line; for (let i = -2; i <= 2; i++) circ(g, x + i * 0.8 * u, y - 20.8 * u, 0.35 * u, true);
  } else {
    P([[-1.6, 0], [-1.4, 8]]); P([[1.6, 0], [1.4, 8]]); P([[-2.4, 0], [-0.8, 0]]); P([[0.8, 0], [2.4, 0]]);
    P([[-4, 7], [4, 7], [3, 21], [-3, 21], [-4, 7]]); P([[0, 7], [0, 21]]); P([[-3.5, 13.5], [3.5, 13.5]]);
    for (let b = 15; b < 21; b += 2) circ(g, x + 0.9 * u * dir, y - b * u, 0.25 * u, true);
    P([[-3, 21], [-4.6, 17], [-4.4, 12.5]]);
    if (flag) { P([[3, 21], [5, 24], [5.4, 27]]); P([[5.4, 22], [5.4, 33]]); P([[5.4, 33], [10, 31.5], [5.4, 30]]); }
    else P([[3, 21], [4.6, 17], [4.4, 12.5]]);
    circ(g, x, y - 23.6 * u, 1.9 * u); P([[-3.4, 25.6], [3.4, 25.6]]); P([[-1.8, 25.6], [-1.6, 28.4], [1.6, 28.4], [1.8, 25.6]]); P([[-1.2, 22.4], [1.2, 22.4]]);
  }
}
// ściana boczna przy narożniku (W × T)
function drawMuralFolk(g, W, T) {
  const Y = h => T - h;
  sgBg(g, W, T + 2, 1975);
  g.fillStyle = '#e8e3d6'; g.fillRect(44, Y(128), 11, 16); g.fillStyle = '#3c4852'; g.fillRect(45.2, Y(126.8), 8.6, 13.6);   // okno
  g.fillStyle = '#e8e3d6'; g.fillRect(49.1, Y(126.8), 0.8, 13.6); g.fillRect(45.2, Y(119.5), 8.6, 0.8);
  pen(g);
  lineFolk(g, 16, Y(98), 26, false, true);
  lineFolk(g, 30, Y(90), 26, false); lineFolk(g, 40, Y(88), 25, true);
  lineFolk(g, 18, Y(58), 28, false, false, -1); lineFolk(g, 30, Y(60), 27, true);
  lineFolk(g, 16, Y(24), 28, true); lineFolk(g, 30, Y(26), 28, true); lineFolk(g, 42, Y(56), 26, true);
  g.fillStyle = SG.line;
  g.font = `italic 500 5px ${SERIF}`; g.textBaseline = 'alphabetic'; g.fillText('Wita Was', 28, Y(19)); g.fillText('Ziemia Kaliska', 28, Y(12), W - 30);
  sgAge(g, W, T + 2, 7402);
}

function muralTex(W, T, draw) {                                                          // tekstura: 1 dm = 12 px, od h = −2 do h = T
  const k = Math.min(12, 2048 / Math.max(W, T + 2)), c = document.createElement('canvas');
  c.width = Math.round(W * k); c.height = Math.round((T + 2) * k);
  const g = c.getContext('2d'); g.setTransform(k, 0, 0, k, 0, 0); draw(g, W, T);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  return tex;
}
export function buildMural(group) {
  const mats = [], up = V(0, 1, 0);
  const frame = ([ax, az], [bx, bz]) => { const L = Math.hypot(bx - ax, bz - az), u = V((bx - ax) / L, 0, (bz - az) / L); return { L, u, n: V().crossVectors(u, up) }; };
  const place = (mesh, u, n, p) => { mesh.matrixAutoUpdate = false; mesh.matrix.makeBasis(u, up, n).setPosition(p); group.add(mesh); return mesh; };
  // ściana szczytowa: obrys z dachem skośnym po lewej, bryła szczytu nad dachem kamienicy, kominy
  {
    const [A, B] = MUR.map, { L, u, n } = frame(A, B), T = MUR.top;
    const sh = new THREE.Shape([[0, -2], [L, -2], [L, T], [0.3 * L, T], [0, MUR.eave]].map(([x, y]) => new THREE.Vector2(x, y)));
    const tex = muralTex(L, T, drawMuralMap); tex.repeat.set(1 / L, 1 / (T + 2)); tex.offset.set(0, 2 / (T + 2));
    const m = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.93, emissive: 0xfff0d2, emissiveIntensity: 0 }); mats.push(m);
    const p0 = V(A[0], 0, A[1]).addScaledVector(n, 0.4);
    place(new THREE.Mesh(new THREE.ShapeGeometry(sh), m), u, n, p0);
    const top = new THREE.Shape([[0, 100], [L, 100], [L, T], [0.3 * L, T], [0, MUR.eave]].map(([x, y]) => new THREE.Vector2(x, y)));
    const D = 56, body = new THREE.ExtrudeGeometry(top, { depth: D, bevelEnabled: false }).translate(0, 0, -D - 0.2);
    place(new THREE.Mesh(body, new THREE.MeshStandardMaterial({ color: 0xcfb676, roughness: 0.95 })), u, n, p0.clone());
    const roofM = new THREE.MeshStandardMaterial({ color: 0x57534e, roughness: 0.85 }), sl = Math.hypot(0.3 * L, T - MUR.eave);
    place(new THREE.Mesh(new THREE.BoxGeometry(0.7 * L, 1, D + 2).translate(0.65 * L, T + 0.5, -D / 2 - 0.2), roofM), u, n, p0.clone());   // papa na dachu
    place(new THREE.Mesh(new THREE.BoxGeometry(sl, 1, D + 2).rotateZ(Math.atan2(T - MUR.eave, 0.3 * L)).translate(0.15 * L, (T + MUR.eave) / 2 + 0.5, -D / 2 - 0.2), roofM), u, n, p0.clone());
    const brick = new THREE.MeshStandardMaterial({ color: 0xb6a172, roughness: 0.95 });
    for (const [f, w, hh] of [[0.36, 8, 9], [0.47, 7, 7], [0.6, 8, 10], [0.9, 6, 8]]) {
      const c = new THREE.Mesh(new THREE.BoxGeometry(w, hh, 6).translate(f * L, T + hh / 2 - 0.5, -4), brick); place(c, u, n, p0.clone());
      place(new THREE.Mesh(new THREE.BoxGeometry(w + 1.4, 1, 7.4).translate(f * L, T + hh, -4), brick), u, n, p0.clone());
    }
    place(new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 16, 6).translate(0.9 * L, T + 16, -4), new THREE.MeshStandardMaterial({ color: 0x6d7074, metalness: 0.6, roughness: 0.4 })), u, n, p0.clone());
  }
  // ściana boczna: pas od narożnika z postaciami
  {
    const [A, B] = MUR.folk, { L: W, u, n } = frame(A, B), T = MUR.top;
    const m = new THREE.MeshStandardMaterial({ map: muralTex(W, T, drawMuralFolk), roughness: 0.93, emissive: 0xfff0d2, emissiveIntensity: 0 }); mats.push(m);
    place(new THREE.Mesh(new THREE.PlaneGeometry(W, T + 2).translate(W / 2, T / 2 - 1, 0), m), u, n, V(A[0], 0, A[1]).addScaledVector(n, 0.4));
  }
  return mats;
}
