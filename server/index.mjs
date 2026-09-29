// Serwer gry online: pokoje i przekazywanie pozycji graczy (WebSocket pod /ws).
// Nie liczy fizyki: każdy gracz liczy swoje auto u siebie i wysyła stan (30 razy na sekundę), a serwer od razu
// przekazuje go pozostałym w pokoju, bez czekania na wspólny takt (mniejsze i równiejsze opóźnienie). Raz na sekundę
// i zaraz po wejściu gracz dostaje też pełny stan pokoju: ostatnie stany wszystkich, także tych, którzy chwilowo
// nic nie wysyłają (karta w tle).
//
//   PORT=8080                        port HTTP (na Mikrusie widoczny tylko dla nginx w sieci Dockera)
//   ALLOWED_ORIGINS=https://a,https://b   strony, z których wolno się łączyć (puste = każda, lokalnie)
//   STATIC_DIR=dist                  lokalnie: serwuje też grę z dist/, więc gra i /ws są pod jednym adresem
//
// Protokół (JSON):
//   połączenie       /ws?room=<pokój>&nick=<nick>               nick od razu, żeby wejście do pokoju było już z nim
//   serwer → gracz   {t:'hi', id, room}                         po połączeniu
//                    {t:'u', p:[id, auto, k, s, f, p, q]}       nowy stan jednego gracza, przekazany od razu
//                    {t:'w', n, p:[[id, auto, k, s, f, p, q], …]}  pełny stan pokoju: n = liczba połączonych, p = gracze w grze
//                    {t:'pong', k}                              odpowiedź na ping (tylko do pytającego)
//                    {t:'r', r:[[id, nick], …]}                 skład pokoju: po wejściu, wyjściu i zmianie nicku
//                    {t:'c', id, text}                          wiadomość czatu (także do nadawcy: potwierdzenie)
//   gracz → serwer   {t:'s', k, c, s:[x, z, psi, y, pitch, roll, steer, v, rpm, gaz, klakson], f, p}
//                    k = czas nadawcy (ms), c = id auta, s z 8 liczbami: starszy klient;
//                    f = postać, jeśli gracz wysiadł: [x, z, y, psi] albo na cudzym aucie [x, z, y, psi, id auta, lx, lz, ly, lpsi], inaczej 0;
//                    p = id kierowcy, u którego gracz jedzie jako pasażer (0 albo brak = nie jedzie);
//                    q = ping gracza do serwera (ms, do listy graczy i przewidywania ruchu)
//                    {t:'ping', k}                              pomiar opóźnienia
//                    {t:'n', name}                              nick (do 16 znaków; pusty = „Gracz <id>”)
//                    {t:'c', text}                              czat (do 140 znaków, najwyżej co 0,7 s)
import { createServer } from 'node:http';
import { WebSocketServer } from 'ws';
import { serveStatic } from './static.mjs';

const PORT = Number(process.env.PORT) || 8080;
const ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
const STATIC_DIR = process.env.STATIC_DIR;
const FULL_EVERY = 1000;                       // ms: pełny stan pokoju (stany przechodzą od razu, zob. 'u')
const ROOM_MAX = 16, CONN_MAX = 300, PER_IP = 6;
const MSG_PER_S = 60;                          // gracz wysyła 30/s i ping co 2 s; więcej to błąd albo nadużycie
const DEFAULT_ROOM = 'kalisz';
const ROOM_RE = /^[a-z0-9-]{1,24}$/, CAR_RE = /^[a-z0-9-]{1,16}$/;
const NICK_MAX = 16, CHAT_MAX = 140, CHAT_GAP = 700;   // znaki, ms

const rooms = new Map();                       // nazwa → Set graczy
const players = new Map();                     // WebSocket → gracz
const perIp = new Map();
let nextId = 1;

const finite = (a, n) => Array.isArray(a) && a.length === n && a.every(v => typeof v === 'number' && Number.isFinite(v) && Math.abs(v) < 1e7);
function parseState(m) {
  if (!Number.isFinite(m.k) || typeof m.c !== 'string' || !CAR_RE.test(m.c) || !(finite(m.s, 11) || finite(m.s, 8))) return null;
  if (m.f !== 0 && !finite(m.f, 4) && !finite(m.f, 9)) return null;
  const p = m.p === undefined ? 0 : m.p, q = Number.isFinite(m.q) ? Math.min(Math.max(Math.round(m.q), 0), 9999) : 0;
  if (!Number.isInteger(p) || p < 0 || p > 1e9) return null;
  return { car: m.c, state: [m.k, m.s, m.f, p, q] };
}
// nick i czat: bez znaków sterujących i niewidocznych, pojedyncze spacje, najwyżej max znaków (nie bajtów)
function clean(text, max) {
  if (typeof text !== 'string') return '';
  return [...text.normalize('NFC').replace(/[\p{C}\p{Zl}\p{Zp}]/gu, '').replace(/\s+/gu, ' ').trim()].slice(0, max).join('').trim();
}
function broadcast(members, msg, except = null) {
  const raw = JSON.stringify(msg);
  for (const m of members) if (m !== except && m.ws.readyState === 1) m.ws.send(raw);
}
function fullState(members) {
  const p = [];
  for (const m of members) if (m.state) p.push([m.id, m.car, ...m.state]);
  return { t: 'w', n: members.size, p };
}
const sendRoster = members => broadcast(members, { t: 'r', r: [...members].map(m => [m.id, m.nick || `Gracz ${m.id}`]) });

const http = createServer((req, res) => {
  const path = req.url.split('?')[0];
  if (path === '/healthz') { res.writeHead(200, { 'content-type': 'text/plain' }); res.end('ok\n'); return; }
  if (path === '/ws') { res.writeHead(426, { 'content-type': 'text/plain' }); res.end('WebSocket\n'); return; }
  if (STATIC_DIR) { serveStatic(STATIC_DIR, path, res); return; }
  res.writeHead(404); res.end();
});

const wss = new WebSocketServer({ noServer: true, maxPayload: 1024 });   // czat: 140 znaków to do 560 B w UTF-8
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
  const nick = clean(url.searchParams.get('nick') || '', NICK_MAX);
  wss.handleUpgrade(req, socket, head, ws => join(ws, ip, room, nick));
});

function join(ws, ip, room, nick) {
  const members = rooms.get(room) || new Set();
  if (members.size >= ROOM_MAX) { ws.close(4001, 'room full'); return; }
  const p = { ws, id: nextId++, ip, room, nick, car: '', state: null, alive: true, count: 0, second: 0, chatAt: 0 };
  members.add(p); rooms.set(room, members); players.set(ws, p);
  perIp.set(ip, (perIp.get(ip) || 0) + 1);
  ws.send(JSON.stringify({ t: 'hi', id: p.id, room }));
  sendRoster(members);
  ws.send(JSON.stringify(fullState(members)));
  ws.on('pong', () => { p.alive = true; });
  ws.on('message', (data, binary) => {
    const now = Math.floor(Date.now() / 1000);
    if (now !== p.second) { p.second = now; p.count = 0; }
    if (binary || ++p.count > MSG_PER_S) return;
    let m;
    try { m = JSON.parse(data.toString()); } catch { return; }
    if (m && m.t === 's') {
      const s = parseState(m);
      if (!s) return;
      Object.assign(p, s);
      broadcast(members, { t: 'u', p: [p.id, p.car, ...p.state] }, p);
    } else if (m && m.t === 'ping') {
      if (Number.isFinite(m.k)) ws.send(JSON.stringify({ t: 'pong', k: m.k }));
    } else if (m && m.t === 'n') {
      const nick = clean(m.name, NICK_MAX);
      if (nick !== p.nick) { p.nick = nick; sendRoster(members); }
    } else if (m && m.t === 'c') {
      const text = clean(m.text, CHAT_MAX), now = Date.now();
      if (!text || now - p.chatAt < CHAT_GAP) return;
      p.chatAt = now;
      broadcast(members, { t: 'c', id: p.id, text });
    }
  });
  ws.on('close', () => {
    members.delete(p); players.delete(ws);
    if (!members.size) rooms.delete(room); else sendRoster(members);
    const n = perIp.get(ip) - 1;
    if (n > 0) perIp.set(ip, n); else perIp.delete(ip);
  });
  ws.on('error', () => { /* zamknięcie obsługuje 'close' */ });
}

setInterval(() => { for (const members of rooms.values()) broadcast(members, fullState(members)); }, FULL_EVERY);

// połączenia, które przestały odpowiadać (uśpiony telefon, zerwana sieć), zamykamy po 30 s
setInterval(() => {
  for (const [ws, p] of players) {
    if (!p.alive) { ws.terminate(); continue; }
    p.alive = false; ws.ping();
  }
}, 30000);

process.on('SIGTERM', () => process.exit(0));  // docker stop: bez czekania 10 s na SIGKILL
http.listen(PORT, () => console.log(`gta-net: port ${PORT}${ORIGINS.length ? `, strony: ${ORIGINS.join(', ')}` : ''}${STATIC_DIR ? `, gra z ${STATIC_DIR}` : ''}`));
