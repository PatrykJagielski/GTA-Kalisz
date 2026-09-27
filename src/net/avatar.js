import * as THREE from 'three';
import { carParts, modelById } from '../car/index.js';
import { createShadow } from '../car/shadow.js';
import { scene } from '../core/renderer.js';
import { buildPerson } from '../foot/person.js';

/* ---------- wygląd innego gracza: auto, postać (gdy wysiadł) i nick nad głową ---------- */
// Auta i postacie to kopie gotowych brył: geometria i materiały są wspólne, więc kolejny gracz prawie nie kosztuje pamięci.
const LABEL_H = 0.045;                         // wysokość nicku na ekranie (część wysokości okna, stała z każdej odległości)
let carShadow = null, personTemplate = null, personShadow = null;

// kopia zbudowanego auta z własnymi kołami (wheels jak w car/wheels.js)
function cloneCar(model) {
  const { car, wheels } = carParts(model), copy = car.clone();
  const path = o => { const p = []; for (; o !== car; o = o.parent) p.unshift(o.parent.children.indexOf(o)); return p; };
  const at = p => p.reduce((o, i) => o.children[i], copy);
  return { car: copy, wheels: wheels.map(({ w, spin, front }) => ({ w: at(path(w)), spin: at(path(spin)), front })) };
}
function clonePerson() {
  personTemplate = personTemplate || buildPerson();
  if (!personShadow) { personShadow = createShadow(); personShadow.scale.set(0.16, 0.3, 1); }
  const g = new THREE.Group(), shadow = personShadow.clone();
  g.add(personTemplate.clone(), shadow);
  return { g, shadow };
}
// nick jako płaski obrazek zawsze zwrócony do kamery, widoczny także przez budynki (łatwiej znaleźć znajomych)
function makeLabel() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 96;
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false, sizeAttenuation: false }));
  s.renderOrder = 10; s.center.set(0.5, 0);
  return { sprite: s, canvas: c, tex, text: null };
}
export function setLabel(a, text) {
  const L = a.label;
  if (L.text === text) return;
  L.text = text;
  const g = L.canvas.getContext('2d'), H = L.canvas.height;
  g.clearRect(0, 0, L.canvas.width, H);
  g.font = '700 56px "Barlow Condensed", "Arial Narrow", sans-serif';
  const w = Math.min(L.canvas.width - 8, g.measureText(text).width + 40), x = (L.canvas.width - w) / 2;
  g.fillStyle = 'rgba(10,13,17,.72)'; g.beginPath();
  if (g.roundRect) g.roundRect(x, 8, w, H - 16, 14); else g.rect(x, 8, w, H - 16);   // roundRect: od Safari 16
  g.fill();
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, L.canvas.width / 2, H / 2 + 2, L.canvas.width - 48);
  L.tex.needsUpdate = true;
  L.sprite.scale.set(LABEL_H * L.canvas.width / H, LABEL_H, 1);
}

export function makeAvatar() {
  const rig = new THREE.Group(), person = clonePerson(), label = makeLabel();
  rig.rotation.order = 'YZX';                  // jak placeCar: kurs, potem pochylenie, potem przechył
  person.g.visible = false;
  scene.add(rig, person.g, label.sprite);
  return { rig, person, label, model: null, wheels: [] };
}
export function setCarModel(a, id) {
  const model = modelById(id);
  if (a.model === model) return;
  a.model = model;
  const { car, wheels } = cloneCar(model);
  carShadow = carShadow || createShadow();
  const shadow = carShadow.clone(); shadow.scale.set(model.shadow[0], model.shadow[1], 1);
  a.rig.clear(); a.rig.add(car, shadow); a.wheels = wheels;
}
export function removeAvatar(a) {
  scene.remove(a.rig, a.person.g, a.label.sprite);
  a.label.tex.dispose(); a.label.sprite.material.dispose();   // bryły aut i postaci są wspólne: zostają
}
