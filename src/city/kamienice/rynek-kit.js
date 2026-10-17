/* ---------- wspólne części opisów kamienic Głównego Rynku (rynek-ne.js, rynek-sw.js, rynek-se.js, rynek-nw.js) ---------- */
// Format jak w spec.js; ułamki frontu od lewego końca patrząc z płyty Rynku. Dodatkowo:
//   archWins(len, osie, y0, y1, w, o)  okna zamknięte łukiem (window3d takich nie ma): wnęki łukowe ze szkłem na piętrze;
//                                       piętro w floors dostaje wtedy at: [], żeby numery pięter dla balkonów się zgadzały
//   ax(n, od, do)                       n równych osi w przedziale [od, do] frontu
export const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => +(a + (b - a) * (i + 0.5) / n).toFixed(3));
export const archWins = (len, axes, y0, y1, w = 9, o = {}) =>
  axes.map(f => ({ k: 'arch', x: [f - w / 2 / len, f + w / 2 / len], y: [y0, y1], rise: w / 2, frame: '#f4f2ec', ...o }));
export const plateR = (x, y, t = 'GŁÓWNY RYNEK') => ({ x, w: 11, y: [y, y + 2.6], bg: '#d8d4c9', fg: '#2e2e2e', border: '#2e2e2e', font: '700 {}px Arial, sans-serif', lines: [[t, 0.55, 0.55]] });
