/* ---------- stan połączenia: wspólny dla połączenia (net/index.js) i interfejsu (net/ui.js) ---------- */
// status: off | connecting | on | full | down; room = pokój, id = własny numer na serwerze, n = połączonych w pokoju
export const net = { status: 'off', room: '', id: 0, n: 0 };
