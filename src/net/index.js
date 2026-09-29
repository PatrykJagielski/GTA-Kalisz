import { active } from '../car/index.js';
import { S } from '../core/state.js';
import { hornPressed } from '../drive/horn.js';
import { readInput } from '../drive/physics.js';
import { drive, st } from '../drive/state.js';
import { me } from '../foot/index.js';
import { chatLine, clearChat, initChat } from './chat.js';
import { paintPlayers } from './players.js';
import { applyStates, clearOthers, keepOnly, nickOf, updateOthers } from './remote.js';
import { net } from './state.js';
import { initNetUi, paintNet, roomFromHash } from './ui.js';

/* ================= gra online: połączenie z serwerem (/ws), wysyłanie własnego stanu ================= */
// Serwer (server/index.mjs) od razu przekazuje stany w obrębie pokoju; fizykę każdy liczy u siebie.
// Bez serwera (np. npm run serve) gra działa jak dotąd, a menu pokazuje, że online jest niedostępne.
const SEND_EVERY = 1 / 30;                     // s: gęstsze stany = krótszy bufor wygładzania u innych (net/remote.js)
const PING_EVERY = 2000;                       // ms
const RETRY = [1, 2, 5, 10, 20, 30];           // s: kolejne próby po zerwaniu połączenia
const LIST_EVERY = 1;                          // s: odświeżanie listy graczy w pauzie (odległości)
let ws = null, sendT = 0, listT = 0, tries = 0, retryTimer = 0, pingTimer = 0;

const r1 = v => Math.round(v * 10) / 10, r3 = v => Math.round(v * 1000) / 1000;
function sendState() {
  const inCar = S.driving && !drive.onFoot, gas = inCar && readInput(drive.keys).gas ? 1 : 0;
  const s = [r1(st.x), r1(st.z), r3(st.psi), r1(st.y), r3(st.pitch), r3(st.roll), r3(st.steer), r1(st.v),
    inCar ? Math.round(st.rpm) : 0, gas, hornPressed() ? 1 : 0];
  const p = drive.ride ? drive.ride.id : 0;
  ws.send(JSON.stringify({ t: 's', k: Math.round(performance.now()), c: active.model.id, s, f: p ? 0 : footState(), p, q: Math.round(net.rtt) }));
}
// postać: na ziemi [x, z, y, psi]; na aucie innego gracza dodatkowo jego id i położenie w układzie tego auta
function footState() {
  if (!drive.onFoot) return 0;
  const f = [r1(me.x), r1(me.z), r1(me.y), r3(me.psi)], c = me.on;
  if (!c) return f;
  const dx = me.x - c.cx, dz = me.z - c.cz, co = Math.cos(c.psi), s = Math.sin(c.psi);
  return [...f, c.id, r1(dx * co - dz * s), r1(dx * s + dz * co), r1(me.y - c.y), r3(me.psi - c.psi)];
}
function onMessage(e) {
  let m;
  try { m = JSON.parse(e.data); } catch (err) { return; }
  if (m.t === 'hi') {
    net.id = m.id; net.room = m.room; tries = 0; net.status = 'on'; paintNet();
  } else if (m.t === 'u' && Array.isArray(m.p)) applyStates([m.p], performance.now());   // stan jednego gracza, od razu
  else if (m.t === 'w' && Array.isArray(m.p)) applyStates(m.p, performance.now());        // pełny stan pokoju, raz na sekundę
  else if (m.t === 'pong' && Number.isFinite(m.k)) {
    const rtt = performance.now() - m.k;
    net.rtt = net.rtt ? net.rtt * 0.7 + rtt * 0.3 : rtt;
    paintNet();
  } else if (m.t === 'r' && Array.isArray(m.r)) {
    const prev = net.roster;
    net.roster = new Map(m.r.map(([id, nick]) => [id, String(nick)]));
    net.n = net.roster.size;
    keepOnly(net.roster);                      // kto wyszedł z pokoju, znika od razu
    if (prev.size) announce(prev, net.roster);
    paintNet(); paintPlayers();
  } else if (m.t === 'c' && typeof m.text === 'string') chatLine(nickOf(m.id), m.text);
}
// wejście, wyjście i zmiana nicku innych graczy jako linie czatu (bez pierwszego składu po połączeniu)
function announce(prev, next) {
  for (const [id, nick] of next) {
    if (id === net.id) continue;
    if (!prev.has(id)) chatLine('', `${nick} dołącza do gry`);
    else if (prev.get(id) !== nick) chatLine('', `${prev.get(id)} to teraz ${nick}`);
  }
  for (const [id, nick] of prev) if (!next.has(id)) chatLine('', `${nick} wychodzi z gry`);
}
function sendNick() { ws.send(JSON.stringify({ t: 'n', name: net.nick })); }
export function setNick(nick) {
  if (nick === net.nick) return;
  net.nick = nick;
  if (ws && ws.readyState === 1) sendNick();
}
export function connect() {
  clearTimeout(retryTimer); clearInterval(pingTimer);
  if (ws) { ws.onclose = null; ws.close(); }
  clearOthers(); clearChat();
  net.room = roomFromHash(); net.n = 0; net.rtt = 0; net.roster = new Map(); net.status = 'connecting'; paintNet(); paintPlayers();
  const q = `room=${encodeURIComponent(net.room)}&nick=${encodeURIComponent(net.nick)}`;   // nick od razu: bez „Gracz 5 to teraz …”
  const url = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws?${q}`;
  const sock = ws = new WebSocket(url);
  sock.onmessage = onMessage;
  const ping = () => { if (sock.readyState === 1) sock.send(JSON.stringify({ t: 'ping', k: performance.now() })); };
  sock.onopen = () => { ping(); pingTimer = setInterval(ping, PING_EVERY); };
  sock.onclose = e => {
    if (ws !== sock) return;
    ws = null; clearOthers(); clearInterval(pingTimer);
    net.status = e.code === 4001 ? 'full' : 'down'; net.n = 0; net.roster = new Map(); paintNet(); paintPlayers();
    if (e.code === 4001) return;               // pełny pokój: bez ponawiania, gracz może założyć własny
    retryTimer = setTimeout(connect, RETRY[Math.min(tries++, RETRY.length - 1)] * 1000);
  };
}
export function initNet() {
  initNetUi(connect, setNick);
  initChat(text => { if (ws && ws.readyState === 1) ws.send(JSON.stringify({ t: 'c', text })); });
  addEventListener('hashchange', () => { if (roomFromHash() !== net.room) connect(); });
  connect();
}
// co klatkę (game/loop.js): auta innych graczy i własny stan, gdy gra już trwa
export function updateNet(dt) {
  updateOthers(dt, performance.now());
  if (!S.paused) listT = LIST_EVERY;           // po wejściu w pauzę lista od razu aktualna
  else if ((listT += dt) >= LIST_EVERY) { listT = 0; paintPlayers(); }
  sendT += dt;
  if (sendT < SEND_EVERY) return;
  sendT = Math.min(sendT - SEND_EVERY, SEND_EVERY);   // reszta zostaje: przy 60 kl./s co druga klatka, bez dryfu
  if (ws && ws.readyState === 1 && S.started && drive.city && ws.bufferedAmount < 4096) sendState();
}
