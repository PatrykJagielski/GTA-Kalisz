// Serwer gry online: pokoje i przekazywanie pozycji graczy (WebSocket pod /ws).
// Nie liczy fizyki: każdy gracz liczy swoje auto u siebie i wysyła stan, a serwer 15 razy na sekundę
// rozsyła do pokoju ostatnie stany wszystkich graczy.
//
//   PORT=8080                        port HTTP (na Mikrusie widoczny tylko dla nginx w sieci Dockera)
//   ALLOWED_ORIGINS=https://a,https://b   strony, z których wolno się łączyć (puste = każda, lokalnie)
//   STATIC_DIR=dist                  lokalnie: serwuje też grę z dist/, więc gra i /ws są pod jednym adresem
//
// Protokół (JSON):
//   serwer → gracz   {t:'hi', id, room}                         po połączeniu
//                    {t:'w', n, p:[[id, auto, k, s, f], …]}     stan pokoju: n = liczba połączonych, p = gracze w grze
//   gracz → serwer   {t:'s', k, c, s:[x, z, psi, y, pitch, roll, steer, v], f:[x, z, y, psi] | 0}
//                    k = czas nadawcy (ms), c = id auta, f = postać, jeśli gracz wysiadł
import { createServer } from 'node:http';
import { WebSocketServer } from 'ws';
import { serveStatic } from './static.mjs';

const PORT = Number(process.env.PORT) || 8080;
const ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
const STATIC_DIR = process.env.STATIC_DIR;
const TICK = 1000 / 15;                        // rozsyłanie stanu pokoju
const ROOM_MAX = 16, CONN_MAX = 300, PER_IP = 6;
const MSG_PER_S = 40;                          // gracz wysyła 15/s; więcej to błąd albo nadużycie
const DEFAULT_ROOM = 'kalisz';
const ROOM_RE = /^[a-z0-9-]{1,24}$/, CAR_RE = /^[a-z0-9-]{1,16}$/;

const rooms = new Map();                       // nazwa → Set graczy
const players = new Map();                     // WebSocket → gracz
const perIp = new Map();
let nextId = 1;

const finite = (a, n) => Array.isArray(a) && a.length === n && a.every(v => typeof v === 'number' && Number.isFinite(v) && Math.abs(v) < 1e7);
function parseState(raw) {
  let m;
  try { m = JSON.parse(raw); } catch { return null; }
  if (!m || m.t !== 's' || !Number.isFinite(m.k) || typeof m.c !== 'string' || !CAR_RE.test(m.c) || !finite(m.s, 8)) return null;
  if (m.f !== 0 && !finite(m.f, 4)) return null;
  return { car: m.c, state: [m.k, m.s, m.f] };
}

const http = createServer((req, res) => {
  const path = req.url.split('?')[0];
  if (path === '/healthz') { res.writeHead(200, { 'content-type': 'text/plain' }); res.end('ok\n'); return; }
  if (path === '/ws') { res.writeHead(426, { 'content-type': 'text/plain' }); res.end('WebSocket\n'); return; }
  if (STATIC_DIR) { serveStatic(STATIC_DIR, path, res); return; }
  res.writeHead(404); res.end();
});

const wss = new WebSocketServer({ noServer: true, maxPayload: 512 });
function refuse(socket, code, text) {
  socket.end(`HTTP/1.1 ${code} ${text}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`);
}
http.on('upgrade', (req, socket, head) => {
  const url = new URL(req.url, 'http://x');
  const ip = String(req.headers['x-real-ip'] || req.socket.remoteAddress);   // X-Real-IP ustawia nginx (serwer nie jest wystawiony na zewnątrz)
  if (url.pathname !== '/ws') return refuse(socket, 404, 'Not Found');
  if (ORIGINS.length && !ORIGINS.includes(req.headers.origin)) return refuse(socket, 403, 'Forbidden');
  if (wss.clients.size >= CONN_MAX || (perIp.get(ip) || 0) >= PER_IP) return refuse(socket, 503, 'Busy');
  const q = (url.searchParams.get('room') || '').toLowerCase();
  const room = ROOM_RE.test(q) ? q : DEFAULT_ROOM;
  wss.handleUpgrade(req, socket, head, ws => join(ws, ip, room));
});

function join(ws, ip, room) {
  const members = rooms.get(room) || new Set();
  if (members.size >= ROOM_MAX) { ws.close(4001, 'room full'); return; }
  const p = { ws, id: nextId++, ip, room, car: '', state: null, alive: true, count: 0, second: 0 };
  members.add(p); rooms.set(room, members); players.set(ws, p);
  perIp.set(ip, (perIp.get(ip) || 0) + 1);
  ws.send(JSON.stringify({ t: 'hi', id: p.id, room }));
  ws.on('pong', () => { p.alive = true; });
  ws.on('message', (data, binary) => {
    const now = Math.floor(Date.now() / 1000);
    if (now !== p.second) { p.second = now; p.count = 0; }
    if (binary || ++p.count > MSG_PER_S) return;
    const m = parseState(data.toString());
    if (m) Object.assign(p, m);
  });
  ws.on('close', () => {
    members.delete(p); players.delete(ws);
    if (!members.size) rooms.delete(room);
    const n = perIp.get(ip) - 1;
    if (n > 0) perIp.set(ip, n); else perIp.delete(ip);
  });
  ws.on('error', () => { /* zamknięcie obsługuje 'close' */ });
}

setInterval(() => {
  for (const members of rooms.values()) {
    const p = [];
    for (const m of members) if (m.state) p.push([m.id, m.car, ...m.state]);
    const msg = JSON.stringify({ t: 'w', n: members.size, p });
    for (const m of members) if (m.ws.readyState === 1) m.ws.send(msg);
  }
}, TICK);

// połączenia, które przestały odpowiadać (uśpiony telefon, zerwana sieć), zamykamy po 30 s
setInterval(() => {
  for (const [ws, p] of players) {
    if (!p.alive) { ws.terminate(); continue; }
    p.alive = false; ws.ping();
  }
}, 30000);

process.on('SIGTERM', () => process.exit(0));  // docker stop: bez czekania 10 s na SIGKILL
http.listen(PORT, () => console.log(`gta-net: port ${PORT}${ORIGINS.length ? `, strony: ${ORIGINS.join(', ')}` : ''}${STATIC_DIR ? `, gra z ${STATIC_DIR}` : ''}`));
