import { $ } from '../core/dom.js';
import { net } from './state.js';

/* ---------- gra online w interfejsie: pokój z linku, stan połączenia, nick, zapraszanie znajomych ---------- */
// Pokój bierze się z adresu (#pokoj=abc123); bez niego gracz trafia do pokoju wspólnego.
const DEFAULT_ROOM = 'kalisz';
const ROOM_CHARS = 'abcdefghjkmnpqrstuvwxyz23456789';   // bez 0/o i 1/l/i: link da się przepisać
let note = '', noteTimer = 0;

export function roomFromHash() {
  const m = /(?:^#|&)pokoj=([a-z0-9-]{1,24})(?:&|$)/i.exec(location.hash);
  return m ? m[1].toLowerCase() : DEFAULT_ROOM;
}
function statusText() {
  const room = net.room === DEFAULT_ROOM ? 'pokój wspólny' : `pokój ${net.room}`;
  if (net.status === 'on') return `Online · ${room} · ${net.n === 1 ? 'tylko ty' : `${net.n} graczy`}`;
  if (net.status === 'connecting') return 'Online: łączenie…';
  if (net.status === 'full') return `Online: ${room} jest pełny. Załóż własny przyciskiem „Zaproś znajomych”.`;
  return 'Online niedostępne: grasz sam, gra spróbuje połączyć się ponownie.';
}
export function paintNet() {
  const t = note || statusText();
  $('mOnline').textContent = t; $('pOnline').textContent = t;
  $('mNet').dataset.status = net.status;
  const hud = $('dNet');
  hud.hidden = net.status !== 'on'; hud.textContent = `Online: ${net.n}`;
  $('dChat').hidden = net.status !== 'on';
}
function say(t) {
  note = t; paintNet();
  clearTimeout(noteTimer); noteTimer = setTimeout(() => { note = ''; paintNet(); }, 6000);
}
// „Zaproś znajomych”: z pokoju wspólnego (albo pełnego) przenosi do nowego pokoju i daje link do niego
async function invite(connect) {
  if (net.room === DEFAULT_ROOM || net.status === 'full') {
    const room = Array.from(crypto.getRandomValues(new Uint8Array(6)), b => ROOM_CHARS[b % ROOM_CHARS.length]).join('');
    history.replaceState(null, '', `#pokoj=${room}`);
    connect();
  }
  const url = `${location.origin}${location.pathname}#pokoj=${net.room}`;
  if (navigator.share && matchMedia('(pointer:coarse)').matches) {
    try { await navigator.share({ title: 'GTA Kalisz', text: 'Pojeździmy razem po Kaliszu?', url }); return; } catch (e) { /* zamknięte okno: link niżej */ }
  }
  try { await navigator.clipboard.writeText(url); say(`Link skopiowany, wyślij go znajomym: ${url}`); }
  catch (e) { say(`Wyślij znajomym ten link: ${url}`); }
}
// nick z menu: zapamiętany w przeglądarce, wysyłany po zatwierdzeniu (Enter albo wyjście z pola)
function initNick(setNick) {
  const input = $('mNick');
  try { input.value = localStorage.getItem('gta-nick') || ''; } catch (e) { /* bez zapisu */ }
  const apply = () => {
    const nick = input.value.replace(/\s+/g, ' ').trim();
    input.value = nick;
    try { localStorage.setItem('gta-nick', nick); } catch (e) { /* nick działa do przeładowania */ }
    setNick(nick);
  };
  input.addEventListener('change', apply);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') input.blur(); });
  apply();
}
export function initNetUi(connect, setNick) {
  for (const id of ['mInvite', 'pInvite']) $(id).onclick = () => invite(connect);
  initNick(setNick);
}
