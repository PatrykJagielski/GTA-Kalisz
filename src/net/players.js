import { active } from '../car/index.js';
import { $ } from '../core/dom.js';
import { drive, st } from '../drive/state.js';
import { me } from '../foot/index.js';
import { othersWhere } from './remote.js';
import { net } from './state.js';

/* ---------- lista graczy w pauzie: nick, auto albo „pieszo”, odległość ---------- */
const far = d => d < 100 ? `${Math.round(d)} m` : d < 1000 ? `${Math.round(d / 10) * 10} m` : `${(d / 1000).toFixed(1).replace('.', ',')} km`;
function myPlace() {                           // postać albo środek auta (dm)
  if (drive.onFoot) return [me.x, me.z];
  const { REAR } = active.geo;
  return [st.x + Math.cos(st.psi) * REAR, st.z - Math.sin(st.psi) * REAR];
}
export function paintPlayers() {
  const list = $('pPlayers');
  if (net.status !== 'on' || net.roster.size < 2) { list.hidden = true; return; }
  const [mx, mz] = myPlace(), where = new Map(othersWhere().map(w => [w.id, w]));
  const rows = [...net.roster].map(([id, nick]) => {
    if (id === net.id) return { nick, what: 'ty', d: -1 };
    const w = where.get(id);
    if (!w) return { nick, what: 'w menu', d: Infinity };
    const d = Math.hypot(w.x - mx, w.z - mz) / 10;                  // m
    return { nick, what: `${w.foot ? 'pieszo' : w.model.name} · ${far(d)}`, d };
  }).sort((a, b) => a.d - b.d);
  list.replaceChildren(...rows.map(({ nick, what }) => {
    const li = document.createElement('li');
    li.append(Object.assign(document.createElement('b'), { textContent: nick }), Object.assign(document.createElement('span'), { textContent: what }));
    return li;
  }));
  list.hidden = false;
}
