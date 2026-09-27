import * as THREE from 'three';
import { canvasTex } from '../../core/textures.js';
import { CURB } from '../config.js';
import { gridPut, ringBox } from '../spatial.js';
import { archWall } from './arch-wall.js';

/* ---------- podcienia ratusza: parter ryzalitu wsparty na arkadach, pod którymi da się przejść ---------- */
// według zdjęć: od rynku 3 łuki na szerokich, boniowanych filarach, z boków ryzalitu po jednym łuku;
// w środku sklepienia krzyżowe, w głębi ściana z drzwiami i oknami, w łukach wiszące latarnie
// układ lokalny frontu jak w ratusz.js: x wzdłuż ryzalitu, +z w stronę rynku, 0 = lico ryzalitu
export const ARC = { top: 57, crown: 48, open: 27, pier: 24, wall: 10, depth: 44, side: 22, vault: 51 };
const FACE = 0.6;                                                                // lico ściany parteru (tu stoi płaszczyzna frontu)
export const DOOR = { w: 17, h: 40 };                                           // drzwi z podcieni do sieni (x = 0)
export const archX = () => [-(ARC.open + ARC.pier), 0, ARC.open + ARC.pier];   // środki łuków od rynku = osie okien wyżej
const sideZ = -(ARC.wall + ARC.depth) / 2;                                       // środek łuku bocznego (między ścianą frontu a tylną)

// boniowanie: poziome fugi co 6,6 dm, pionowe na przemian co 14 dm; wokół łuków kliny rozchodzące się promieniście
function rusticTex(len, top, arches, size) {
  return canvasTex(size, (g, n) => {
    g.fillStyle = '#eeeae1'; g.fillRect(0, 0, n, n);
    g.setTransform(n / len, 0, 0, -n / top, 0, n);                               // rysunek w dm, y w górę
    g.fillStyle = '#e2ded5'; g.fillRect(0, 0, len, 4.6);                         // cokół
    const EXT = 7;
    const inRing = (x, y) => arches.some(([c, w, cr]) => { const r = w / 2; return y > cr - r - 0.2 && Math.hypot(x - c, y - cr + r) < r + EXT; });
    const joint = (pts) => {
      for (const [col, dy] of [['rgba(70,58,44,.38)', 0], ['rgba(255,255,255,.6)', -0.35]]) {
        g.strokeStyle = col; g.lineWidth = 0.3; g.beginPath();
        pts.forEach(([x, y], i) => (i ? g.lineTo(x, y + dy) : g.moveTo(x, y + dy))); g.stroke();
      }
    };
    const ROW = 6.6;
    for (let row = 1; row * ROW < top - 2; row++) {
      const y = row * ROW;
      let run = null;
      for (let x = 0; x <= len; x += 0.25) {                                     // fuga pozioma przerwana klinami łuków
        const ok = x < len && !inRing(x, y);
        if (ok && !run) run = [x];
        if (!ok && run) { joint([[run[0], y], [x, y]]); run = null; }
      }
      if (run) joint([[run[0], y], [len, y]]);
      for (let x = (row % 2) * 7; x < len; x += 14) if (!inRing(x, y - ROW / 2)) joint([[x, y - ROW], [x, y]]);
    }
    for (const [c, w, cr] of arches) {
      const r = w / 2, sp = cr - r;
      for (let k = 1; k < 9; k++) {
        const a = k * Math.PI / 9;
        joint([[c + Math.cos(a) * r, sp + Math.sin(a) * r], [c + Math.cos(a) * (r + EXT), sp + Math.sin(a) * (r + EXT)]]);
      }
      g.strokeStyle = 'rgba(70,58,44,.38)'; g.lineWidth = 0.3; g.beginPath(); g.arc(c, sp, r + EXT, 0, Math.PI); g.stroke();
    }
  });
}
// sklepienie krzyżowe nad prostokątnym przęsłem: sufit = wyższa z dwóch kolebek; szwy wypadają na przekątnych siatki
function groinVault(x0, x1, z0, z1, y0, rise, N = 20) {
  const pos = [], idx = [];
  for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) {
    const u = i / N * 2 - 1, v = j / N * 2 - 1;
    pos.push(x0 + (x1 - x0) * i / N, y0 + rise * Math.max(Math.sqrt(1 - u * u), Math.sqrt(1 - v * v)), z0 + (z1 - z0) * j / N);
  }
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const a = j * (N + 1) + i, b = a + 1, c = a + N + 1, d = c + 1;
    if ((i < N / 2) === (j < N / 2)) idx.push(a, b, d, a, d, c); else idx.push(a, b, c, b, d, c);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
  const f = g.toNonIndexed(); f.computeVertexNormals(); return f;
}
// ściana w głębi podcieni: boniowanie, opaska drzwi do sieni w środkowym przęśle, okna w bocznych, tablice
function backTex(W, H, X) {
  return canvasTex(1024, (g, n) => {
    g.fillStyle = '#ece8df'; g.fillRect(0, 0, n, n);
    g.setTransform(n / W, 0, 0, -n / H, n / 2, n);                             // x od środka ściany, y w górę
    g.fillStyle = '#dedad0'; g.fillRect(-W / 2, 0, W, 4.6);
    g.strokeStyle = 'rgba(70,58,44,.22)'; g.lineWidth = 0.3;
    for (let y = 5.4; y < H; y += 5.4) { g.beginPath(); g.moveTo(-W / 2, y); g.lineTo(W / 2, y); g.stroke(); }
    const arched = (c, w, y0, y1, fill) => { g.fillStyle = fill; g.beginPath(); g.moveTo(c - w / 2, y0); g.lineTo(c - w / 2, y1 - w / 2); g.arc(c, y1 - w / 2, w / 2, Math.PI, 0, true); g.lineTo(c + w / 2, y0); g.fill(); };
    for (const c of X) {
      const door = c === 0, w = door ? 17 : 13, y0 = door ? 0 : 11, y1 = door ? 40 : 34;
      arched(c, w + 4, y0, y1 + 2, '#e3dfd5');                                   // opaska
      if (!door) {                                                               // w miejscu drzwi otwór do sieni
        const gr = g.createLinearGradient(0, y1, 0, y0); gr.addColorStop(0, '#6f8598'); gr.addColorStop(1, '#2f3f4e');
        arched(c, w, y0, y1, gr);
        g.fillStyle = '#f4f2ec'; g.fillRect(c - 0.4, y0, 0.8, y1 - y0 - w / 2); g.fillRect(c - w / 2, y0 + 12, w, 0.8);      // szczebliny
        g.fillStyle = '#d8d4ca'; g.fillRect(c - w / 2 - 2, y0 - 1.5, w + 4, 1.5);                                            // parapet
      }
      g.fillStyle = '#2e2c29'; g.fillRect(c + w / 2 + 3, 20, 5, 4);            // tablica
    }
    g.fillStyle = '#c3322c'; g.fillRect(X[0] + 10, 18, 4, 5);                 // czerwona tabliczka z godłem
  });
}
function lantern(parent, mats, x, y, z) {
  const [ironM, glassM] = mats, L = new THREE.Group(); L.position.set(x, y, z); parent.add(L);
  const add = (geo, m) => L.add(new THREE.Mesh(geo, m));
  add(new THREE.CylinderGeometry(0.15, 0.15, 6, 4).translate(0, 3, 0), ironM);                                  // wysięgnik
  add(new THREE.ConeGeometry(1.9, 1.6, 6).translate(0, -0.8, 0), ironM);                                        // daszek
  add(new THREE.CylinderGeometry(1.5, 1.0, 4.2, 6).translate(0, -3.7, 0), glassM);                              // klosz
  add(new THREE.CylinderGeometry(1.1, 0.5, 1.2, 6).translate(0, -6.4, 0), ironM);
}

// buduje podcienia w grupie frontu F; toWorld(x, z) -> [x, z] na mapie; zwraca materiały do nocnej iluminacji
export function buildArcade(F, L, toWorld, solid, plaster, hallM) {
  const add = (geo, mat, parent = F) => { const m = new THREE.Mesh(geo, mat); parent.add(m); return m; };
  const sideM = plaster.clone(); sideM.color.set(0xe2ddd3);
  // nocna iluminacja (emissive z sky.js) mnożona przez teksturę, żeby nie zmywała fug, okien i drzwi; w podcieniach ciepłe światło latarń
  const lit = (m, warm = false) => { m.emissiveMap = m.map; if (warm) m.emissive.set(0xffc890); return m; };
  const shade = m => lit(Object.assign(m.clone(), { color: new THREE.Color(0xcdc8be) }), true);   // podcienia nie dostają cieni z silnika: przyciemnione ręcznie
  const X = archX(), len = L + 2 * FACE, back = -ARC.depth, inner = L / 2 - ARC.wall;
  // front: 3 łuki
  const fa = X.map(c => [c + len / 2, ARC.open, ARC.crown]);
  const frontM = plaster.clone(); frontM.map = rusticTex(len, ARC.top, fa, 1024); lit(frontM); const frontIn = shade(frontM);
  add(archWall(len, fa, ARC.top, ARC.wall).translate(-len / 2, 0, FACE), [frontM, sideM, frontIn]);
  // boki ryzalitu: po jednym łuku; ściana od lica frontu do ściany w głębi
  const slen = ARC.depth + FACE, sc = FACE - sideZ;                              // środek łuku liczony od przedniej krawędzi
  const sideTexM = plaster.clone(); sideTexM.map = rusticTex(slen, ARC.top, [[sc, ARC.side, ARC.crown - 4]], 512); lit(sideTexM); const sideIn = shade(sideTexM);
  for (const s of [1, -1]) {
    const a = [[s > 0 ? sc : slen - sc, ARC.side, ARC.crown - 4]];
    add(archWall(slen, a, ARC.top, ARC.wall).rotateY(s * Math.PI / 2).translate(s * (L / 2 + FACE), 0, s > 0 ? FACE : -ARC.depth), [sideTexM, sideM, sideIn]);
  }
  // gzyms nad arkadami (front i boki)
  add(new THREE.BoxGeometry(len + 1, 4, 1.4).translate(0, ARC.top - 3.6, FACE + 0.6), plaster);
  add(new THREE.BoxGeometry(len + 3, 1.8, 2.8).translate(0, ARC.top - 0.9, FACE + 1.2), plaster);
  for (const s of [1, -1]) {
    add(new THREE.BoxGeometry(1.4, 4, slen + 1).translate(s * (L / 2 + FACE + 0.6), ARC.top - 3.6, (FACE - ARC.depth) / 2), plaster);
    add(new THREE.BoxGeometry(2.8, 1.8, slen + 3).translate(s * (L / 2 + FACE + 1.2), ARC.top - 0.9, (FACE - ARC.depth) / 2 + 1.5), plaster);
  }
  // klucze łuków z kartuszem
  const key = new THREE.Shape([new THREE.Vector2(-2.2, 0), new THREE.Vector2(2.2, 0), new THREE.Vector2(3.4, 9), new THREE.Vector2(-3.4, 9)]);
  const keyG = new THREE.ExtrudeGeometry(key, { depth: 1.6, bevelEnabled: false });
  for (const c of X) add(keyG.clone().translate(c, ARC.crown - 1.5, FACE), plaster);
  for (const s of [1, -1]) add(keyG.clone().scale(0.85, 0.85, 1).translate(0, ARC.crown - 5.3, FACE).rotateY(s * Math.PI / 2).translate(s * L / 2, 0, sideZ), plaster);

  // wnętrze: sklepienia krzyżowe w trzech przęsłach (granice nad filarami), ściana w głębi, posadzka z płyt
  const vaultM = plaster.clone(); vaultM.color.set(0xc9c4ba); vaultM.emissive.set(0xffc890); vaultM.side = THREE.DoubleSide;
  const edges = [-inner - 1, (X[0] + X[1]) / 2, (X[1] + X[2]) / 2, inner + 1], spring = ARC.crown - ARC.open / 2;
  for (let k = 0; k < 3; k++) add(groinVault(edges[k], edges[k + 1], back, FACE - ARC.wall + 0.3, spring, ARC.vault - spring), vaultM);
  const bw = 2 * (inner + 1), backM = plaster.clone(); backM.color.set(0xd2cdc3); backM.map = backTex(bw, ARC.vault + 1, X); lit(backM, true);
  add(archWall(bw, [[bw / 2, DOOR.w, DOOR.h]], ARC.vault + 1, 2).translate(-bw / 2, 0, back), [backM, sideM, hallM]);   // od tyłu: ściana sieni
  const woodM = new THREE.MeshStandardMaterial({ color: 0x5a4838, roughness: 0.7 });
  for (const s of [1, -1]) add(new THREE.BoxGeometry(0.8, 30, DOOR.w / 2 - 0.5).translate(s * (DOOR.w / 2 - 0.4), CURB + 15, back - 2 - DOOR.w / 4), woodM);   // skrzydła otwarte do sieni

  // latarnie zawieszone w łukach
  const ironM = new THREE.MeshStandardMaterial({ color: 0x1b1d1f, roughness: 0.5, metalness: 0.6 });
  const glassM = new THREE.MeshStandardMaterial({ color: 0xf2e6c4, roughness: 0.2, emissiveIntensity: 0, transparent: true, opacity: 0.85 });
  glassM.emissive.setRGB(3.2, 2.3, 1.1);                                          // nocą sky.js daje 0,3: klosz świeci mocno
  for (const c of X) lantern(F, [ironM, glassM], c, ARC.crown - 6, FACE - ARC.wall / 2);
  for (const s of [1, -1]) lantern(F, [ironM, glassM], s * (L / 2 - ARC.wall / 2), ARC.crown - 10, sideZ);

  // kolizje: filary i ściany boczne jako osobne bryły, przestrzeń pod sklepieniami wolna
  const put = (x0, x1, z0, z1) => {
    const r = [[x0, z0], [x1, z0], [x1, z1], [x0, z1]].flatMap(([x, z]) => toWorld(x, z)), b = ringBox(r);
    gridPut(solid, b[0], b[1], b[2], b[3], { p: [r], b });
  };
  const cuts = [-len / 2, ...X.flatMap(c => [c - ARC.open / 2, c + ARC.open / 2]), len / 2];
  const plinth = (x0, x1, z0, z1) => add(new THREE.BoxGeometry(x1 - x0, 4.6, z1 - z0).translate((x0 + x1) / 2, 2.3, (z0 + z1) / 2), sideM);
  for (let i = 0; i < cuts.length; i += 2) {
    put(cuts[i], cuts[i + 1], FACE - ARC.wall, FACE);
    plinth(cuts[i] - (i ? 0.6 : 1.2), cuts[i + 1] + (i < cuts.length - 2 ? 0.6 : 1.2), FACE - ARC.wall - 0.6, FACE + 0.6);   // cokół filara
  }
  for (const s of [1, -1]) {
    const x0 = s > 0 ? inner : -len / 2, x1 = s > 0 ? len / 2 : -inner;
    put(x0, x1, back - 1, sideZ - ARC.side / 2); put(x0, x1, sideZ + ARC.side / 2, FACE);
    plinth(x0 - 0.6, x1 + 0.6, back, sideZ - ARC.side / 2 + 0.6); plinth(x0 - 0.6, x1 + 0.6, sideZ + ARC.side / 2 - 0.6, FACE);
  }
  return [frontM, frontIn, sideTexM, sideIn, sideM, vaultM, backM, glassM];
}
// obrys przestrzeni pod ryzalitem (w układzie lokalnym), wycinany z bryły kolizji korpusu
export const arcadeHole = L => [[-L / 2 - 2, -ARC.depth], [L / 2 + 2, -ARC.depth], [L / 2 + 2, 3], [-L / 2 - 2, 3]];
