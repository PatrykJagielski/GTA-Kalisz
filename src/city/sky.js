import * as THREE from 'three';
import { scene } from '../core/renderer.js';
import { isDark } from '../core/theme.js';

/* ---------- niebo i oświetlenie miasta: dzień i noc ---------- */
export function applySky(city) {
  if (!city) return;
  const dark = isDark(), col = new THREE.Color(dark ? 0x10171f : 0xc9d6e1);
  scene.background = col; scene.fog = new THREE.Fog(col, 1400, 7500);
  city.lampHeadM.emissiveIntensity = dark ? 2.2 : 0.4;
  city.facM.emissiveIntensity = city.glassM.emissiveIntensity = city.oldM.emissiveIntensity = dark ? 0.9 : 0;
  for (const m of city.ratM) m.emissiveIntensity = dark ? 0.3 : 0;                  // iluminacja ratusza nocą
  if (city.fountain) for (const m of city.fountain.mats) m.emissiveIntensity = dark ? 0.9 : 0;   // podświetlona fontanna
}
