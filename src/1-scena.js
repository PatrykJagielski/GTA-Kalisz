import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { TessellateModifier } from 'three/addons/modifiers/TessellateModifier.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/* ================= GTA Kalisz: scena (jednostka = 1 dm) ================= */
const $ = id => document.getElementById(id);
const S = { driving: false, paused: false, started: false, contextLost: false };   // driving = fizyka i sterowanie działają
const frameHooks = [];                                          // kroki pętli dopisywane przez moduły

const canvas = $('c');
const view = $('view');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
} catch (e) {
  window.gtaFail?.('Ta przeglądarka lub karta graficzna nie obsługuje WebGL, bez którego gra nie działa.');
  throw e;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
// odbicia na lakierze; po utracie kontekstu WebGL trzeba je wyrenderować od nowa (resztę sceny Three.js wgrywa sam)
let envTarget = null;
function makeEnvironment(contextRestored = false) {
  const pmrem = new THREE.PMREMGenerator(renderer), room = new RoomEnvironment(renderer);
  if (!contextRestored) envTarget?.dispose();                    // po utracie kontekstu stare zasoby GPU już nie istnieją
  envTarget = pmrem.fromScene(room, 0.04);
  scene.environment = envTarget.texture;
  room.dispose(); pmrem.dispose();
}
makeEnvironment();

const camera = new THREE.PerspectiveCamera(55, 1, 0.5, 9000);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.maxPolarAngle = Math.PI * 0.49;
controls.minDistance = 2;
controls.maxDistance = 400;
controls.enabled = false;

scene.add(new THREE.HemisphereLight(0xdfe8f0, 0x3a3430, 0.55));
const key = new THREE.DirectionalLight(0xffffff, 1.6);
key.position.set(30, 50, 25);
scene.add(key);
const rim = new THREE.DirectionalLight(0xbfd6ff, 0.6);
rim.position.set(-40, 20, -30);
scene.add(rim);

// miękki cień pod autem (tekstura z canvas)
function blobTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(128, 128, 10, 128, 128, 128);
  gr.addColorStop(0, 'rgba(0,0,0,0.55)'); gr.addColorStop(0.6, 'rgba(0,0,0,0.18)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const shadow = new THREE.Mesh(new THREE.PlaneGeometry(62, 30), new THREE.MeshBasicMaterial({ map: blobTexture(), transparent: true, depthWrite: false }));
shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.02;

/* ---------- motyw: dzień / noc ---------- */
const sysDark = matchMedia('(prefers-color-scheme: dark)');
const isDark = () => { const t = document.documentElement.getAttribute('data-theme'); return t ? t === 'dark' : sysDark.matches; };

/* ---------- pomocnicze bryły ---------- */
const V = (x, y, z) => new THREE.Vector3(x, y, z);
function cyl(r, h, axis = 'y', seg = 32, r2 = r, open = false, t0 = 0, tl = Math.PI * 2) {
  const g = new THREE.CylinderGeometry(r, r2, h, seg, 1, open, t0, tl);
  if (axis === 'x') g.rotateZ(Math.PI / 2);
  if (axis === 'z') g.rotateX(Math.PI / 2);
  return g;
}
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const rbox = (w, h, d, r = 0.05) => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001));
function lathe(pts, seg = 40) { return new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg); }
function torus(R, r, axis = 'x', seg = 40) {
  const g = new THREE.TorusGeometry(R, r, 12, seg);
  if (axis === 'x') g.rotateY(Math.PI / 2);
  if (axis === 'y') g.rotateX(Math.PI / 2);
  return g;
}
// orientacja walca wzdłuż odcinka a->b
function rodBetween(a, b, r, seg = 16) {
  const A = V(...a), B = V(...b), d = B.clone().sub(A);
  const g = new THREE.CylinderGeometry(r, r, d.length(), seg);
  const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), d.clone().normalize());
  g.applyQuaternion(q); const c = A.add(B).multiplyScalar(0.5); g.translate(c.x, c.y, c.z);
  return g;
}
