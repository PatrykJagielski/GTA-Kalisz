import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { $ } from './dom.js';

/* ================= renderer, scena, kamera, światła (jednostka = 1 dm) ================= */
export const canvas = $('c');
export const view = $('view');
export let renderer;
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

export const scene = new THREE.Scene();
// odbicia na lakierze; po utracie kontekstu WebGL trzeba je wyrenderować od nowa (resztę sceny Three.js wgrywa sam)
let envTarget = null;
export function makeEnvironment(contextRestored = false) {
  const pmrem = new THREE.PMREMGenerator(renderer), room = new RoomEnvironment(renderer);
  if (!contextRestored) envTarget?.dispose();                    // po utracie kontekstu stare zasoby GPU już nie istnieją
  envTarget = pmrem.fromScene(room, 0.04);
  scene.environment = envTarget.texture;
  room.dispose(); pmrem.dispose();
}
makeEnvironment();

export const camera = new THREE.PerspectiveCamera(55, 1, 0.5, 9000);
export const controls = new OrbitControls(camera, canvas);
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
