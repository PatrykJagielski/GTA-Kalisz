import * as THREE from 'three';
import { active } from '../car/index.js';
import { scene } from '../core/renderer.js';
import { st } from './state.js';

/* ---------- ślady opon: ciemne paski za tylnymi kołami, gdy auto jest w poślizgu ---------- */
// jeden InstancedMesh z pierścieniem MAX odcinków: najstarsze ślady znikają, gdy przybywa nowych
const MAX = 1200;
const MIN_SKID = 0.1;                          // |sin poślizgu|, od którego opony zostawiają ślad
const LIFT = 0.06;                             // dm nad nawierzchnią
let mesh = null, next = 0, prev = null;
const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), pos = new THREE.Vector3(), scl = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);

function build() {
  const geo = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
  // nieprzezroczyste (zachodzące na siebie odcinki nie tworzą ciemniejszych prążków) i oświetlone jak jezdnia, więc ciemnieją nocą
  const mat = new THREE.MeshStandardMaterial({ color: 0x1c1c1e, roughness: 0.95, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  mesh = new THREE.InstancedMesh(geo, mat, MAX);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.count = 0; mesh.frustumCulled = false; mesh.renderOrder = 1;
  scene.add(mesh);
}
// położenie tylnych kół (środek tylnej osi ± połowa rozstawu kół) z wysokością nawierzchni pod nimi
function rearWheels() {
  const t = active.model.dims.trackZ, s = Math.sin(st.psi), c = Math.cos(st.psi);
  return [[st.x - t * s, st.wh[2], st.z - t * c], [st.x + t * s, st.wh[3], st.z + t * c]];
}
function segment([x0, y0, z0], [x1, y1, z1], w) {
  const dx = x1 - x0, dz = z1 - z0, len = Math.hypot(dx, dz);
  if (len < 0.05) return;
  pos.set((x0 + x1) / 2, Math.max(y0, y1) + LIFT, (z0 + z1) / 2);
  q.setFromAxisAngle(up, Math.atan2(-dz, dx));
  m4.compose(pos, q, scl.set(len + 0.3, 1, w));
  mesh.setMatrixAt(next, m4);
  next = (next + 1) % MAX; mesh.count = Math.max(mesh.count, next === 0 ? MAX : next);
  mesh.instanceMatrix.needsUpdate = true;
}
export function updateSkids() {
  if (!mesh) build();
  const skid = Math.abs(Math.sin(st.slip)) > MIN_SKID && Math.abs(st.v) > 15;
  const now = skid ? rearWheels() : null;
  if (now && prev) {
    const w = active.model.wheels.width * 0.85;
    for (let i = 0; i < 2; i++) segment(prev[i], now[i], w);
  }
  prev = now;
}
