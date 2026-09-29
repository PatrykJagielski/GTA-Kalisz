/* ---------- stan połączenia: wspólny dla połączenia (net/index.js), innych graczy (net/remote.js) i interfejsu (net/ui.js) ---------- */
// status: off | connecting | on | full | down; room = pokój, id = własny numer na serwerze, n = połączonych w pokoju,
// roster = id → nick wszystkich w pokoju (także tych, którzy są jeszcze w menu), nick = własny nick ('' = nadaje serwer),
// rtt = ping do serwera w obie strony (ms, średnia z ostatnich pomiarów; 0 = jeszcze nie zmierzony)
export const net = { status: 'off', room: '', id: 0, n: 0, roster: new Map(), nick: '', rtt: 0 };
