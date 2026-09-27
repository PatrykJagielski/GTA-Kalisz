import * as THREE from 'three';
import { scene } from '../core/renderer.js';
import { AUDI_A4 } from './models/audi-a4/index.js';
import { BMW_E63 } from './models/bmw-e63/index.js';
import { makeProfile } from './profile.js';
import { createShadow } from './shadow.js';
import { buildWheels } from './wheels.js';

/* ================= auta do wyboru i auto aktualnie prowadzone ================= */
export const MODELS = [AUDI_A4, BMW_E63];
export const rig = new THREE.Group();          // auto + cień: przesuwane razem po mieście
export const wheelGroups = [];                 // { w: skręt, spin: obrót koła, front }
// model = dane wybranego auta (car/models/), geo = wielkości dla fizyki
export const active = { model: null, geo: null };
const built = new Map();                       // zbudowane auta: przy zmianie wraca gotowe, bez ponownego liczenia brył
let shadow = null;

export const modelById = id => MODELS.find(m => m.id === id) || MODELS[0];
export function buildCar(model) {
  if (active.model === model) return;
  let entry = built.get(model.id);
  if (!entry) {
    const car = new THREE.Group(), P = makeProfile(model);
    model.build(car, P);
    entry = { car, wheels: buildWheels(car, model.dims, model.wheels) };
    built.set(model.id, entry);
  }
  shadow = shadow || createShadow();
  shadow.scale.set(model.shadow[0], model.shadow[1], 1);
  rig.clear(); rig.add(entry.car, shadow);
  wheelGroups.length = 0; wheelGroups.push(...entry.wheels);
  const C = model.dims;
  active.model = model;
  active.geo = {
    WB: C.axF - C.axR,                         // rozstaw osi
    REAR: -C.axR,                              // środek auta leży tyle przed tylną osią
    WHEELS: [[C.axF, -C.trackZ], [C.axF, C.trackZ], [C.axR, -C.trackZ], [C.axR, C.trackZ]],   // LP, PP, LT, PT
  };
  if (!rig.parent) scene.add(rig);
}
