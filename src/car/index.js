import * as THREE from 'three';
import { scene } from '../core/renderer.js';
import { buildBody } from './body.js';
import { buildInterior } from './interior.js';
import { createShadow } from './shadow.js';
import { buildWheels } from './wheels.js';

/* ================= Audi A4 B7 sedan (2005), srebrny metalik, PKA 02209 ================= */
export const rig = new THREE.Group();          // auto + cień: przesuwane razem po mieście
export const wheelGroups = [];                 // { w: skręt, spin: obrót koła, front }
export function buildCar() {
  const car = new THREE.Group();
  buildBody(car);
  buildInterior(car);
  wheelGroups.push(...buildWheels(car));
  rig.add(car, createShadow());
  scene.add(rig);
}
