/* ---------- wspólne części opisów kamienic przy ulicy Zamkowej (zamkowa-nw.js, zamkowa-se.js) ---------- */
// Format jak w spec.js (kamienice Rynku), a do tego:
//   panels    pasy innego tynku [od, do, kolor, y0 (domyślnie groundTop), y1 (okap)]: ryzality, sąsiednie domy w jednym obrysie
//   awnings   markizy [od, do, y przy ścianie, wysięg, kolor]
//   ground    arch z wood (drewniane drzwi z naświetlem) albo gate (brama z kratą), ring = kolor opaski łuku na tynku
//   signs     w = szerokość w dm wokół ułamka x (tabliczki), z = odsunięcie od ściany (napis na balkonie)
//   medColor  kolor medalionów, stripY0 = od jakiej wysokości biegną lizeny (strips)
// Ułamki frontu liczone od lewego końca patrząc z ulicy: po stronie NW to koniec od Rynku, po stronie SE koniec od placu
// św. Józefa. Okap (eave) i okna według zdjęć, nie według wysokości z OSM.
const plate = { fg: '#f4f4f4', border: '#d8d8d8', font: '700 {}px Arial, sans-serif' };
export const nr = (x, y, t) => ({ x, w: 2.6, y: [y, y + 2.2], bg: '#1d2533', ...plate, lines: [[t, 0.62, 0.56]] });
export const street = (x, y) => ({ x, w: 10, y: [y, y + 2.6], bg: '#21468f', ...plate, lines: [['ul. ZAMKOWA', 0.62, 0.55]] });
// trzy piętra nad parterem, okap ok. 17 m: okna [dół, góra] i szerokość; o = naczółki
export const floors3 = (w = 10, o = {}) => [{ y: [62, 87], w, ...o }, { y: [99, 124], w, ...o }, { y: [135, 157], w: w - 0.5, ...o }];
export const bands3 = (d = 2.2, top = 172) => [[48, 53, d], [top - 9, top - 5, 1.6], [top - 5, top, 4.2]];
