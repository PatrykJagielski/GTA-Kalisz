import { rng } from '../core/random.js';
import { canvasTex } from '../core/textures.js';

/* ---------- elewacje frontowe kamienic przy Głównym Rynku (odbudowa 1919–1933, klasycyzm „około 1800”) ---------- */
// Tekstura = 4 osie okienne na całą wysokość od chodnika do okapu (v = 0 przy ziemi, 1 pod okapem). Tło szare, detal biały:
// kolor tynku z wierzchołków, więc opaski, gzymsy i pilastry wychodzą jaśniejsze od ściany.
// Jak na zdjęciach Street View: parter ze sklepami (często witryny zamknięte łukiem) i trzy piętra, okap ok. 17,5 m.
// Warianty: 0 boniowany parter i opaski, 1 pilastry i naczółki trójkątne, 2 witryny łukowe i naczółki odcinkowe,
// 3 witryny łukowe i płyciny podokienne
export const RYNEK_H = 175;
const FL = [[62, 88], [99, 124], [135, 158]], fl = peds => FL.map((f, i) => [...f, peds[i]]);
const PLAN = [
  { H: RYNEK_H, shop: [7, 40, false], kordon: 48, floors: fl(['hood', 'key', 'sill']), frieze: 163, rust: true },
  { H: RYNEK_H, shop: [7, 40, false], kordon: 48, floors: fl(['tri', 'hood', 'sill']), frieze: 163, pil: true },
  { H: RYNEK_H, shop: [7, 42, true], kordon: 48, floors: fl(['seg', 'hood', 'key']), frieze: 163, rust: true },
  { H: RYNEK_H, shop: [7, 42, true], kordon: 48, floors: fl(['hood', 'sill', 'sill']), frieze: 163, panel: true },
];
export const RYNEK_VARIANTS = PLAN.length, RYNEK_PLAN = PLAN;

export function rynekFacade(variant, lit) {
  const P = PLAN[variant], R = rng(90 + variant);
  return canvasTex(512, (g, n) => {
    const Y = y => n - (y + 2) / (P.H + 2) * n, bw = n / 4;                              // dm nad jezdnią -> piksel
    const rect = (x0, x1, y0, y1, c) => { g.fillStyle = c; g.fillRect(x0, Y(y1), x1 - x0, Y(y0) - Y(y1)); };
    const glass = (x0, x1, y0, y1, arch) => {
      const t = Y(y1), b = Y(y0), w = x1 - x0, gr = g.createLinearGradient(0, t, 0, b);
      gr.addColorStop(0, '#71889b'); gr.addColorStop(1, '#2c3d4d'); g.fillStyle = gr; g.beginPath();
      if (arch) { g.moveTo(x0, b); g.lineTo(x0, t + w / 2); g.arc((x0 + x1) / 2, t + w / 2, w / 2, Math.PI, 0); g.lineTo(x1, b); } else g.rect(x0, t, w, b - t);
      g.fill();
    };
    const litWin = (x0, x1, y0, y1, p) => { if (R() < p) rect(x0, x1, y0, y1, R() < 0.5 ? '#ffd79a' : '#ffe9c2'); };
    g.fillStyle = lit ? '#000' : '#dcdcdc'; g.fillRect(0, 0, n, n);
    for (let i = 0; i < 4; i++) {
      const cx = bw * (i + 0.5), [s0, s1, sArch] = P.shop, sw = bw * 0.62;
      if (lit) {
        litWin(cx - sw / 2, cx + sw / 2, s0, s1, 0.8);                                   // sklepy i kawiarnie w parterze
        for (const [y0, y1] of P.floors) litWin(cx - 21, cx + 21, y0, y1, 0.4);
        continue;
      }
      // parter: witryna w ramie, naświetle, pas na szyld
      if (sArch) { g.fillStyle = '#f4f4f4'; g.beginPath(); g.arc(cx, Y(s1) + sw / 2, sw / 2 + 6, Math.PI, 0); g.fill(); rect(cx - sw / 2 - 6, cx + sw / 2 + 6, s0 - 1, s1 - sw / 2 / (n / (P.H + 2)), '#f4f4f4'); }
      else rect(cx - sw / 2 - 5, cx + sw / 2 + 5, s0 - 1, s1 + 2, '#f0f0f0');
      glass(cx - sw / 2, cx + sw / 2, s0, s1, sArch);
      g.fillStyle = '#e8e8e8'; g.fillRect(cx - 2, Y(s1), 4, Y(s0) - Y(s1)); g.fillRect(cx - sw / 2, Y(s1 - 7) - 2, sw, 4);   // słupek i ślemię witryny
      if (!sArch) rect(cx - sw / 2 - 5, cx + sw / 2 + 5, s1 + 2, s1 + 8, 'rgba(0,0,0,.07)');
      // piętra: okno w opasce, parapet, naczółek
      for (const [y0, y1, ped] of P.floors) {
        const w = 44, x0 = cx - w / 2, x1 = cx + w / 2;
        rect(x0 - 7, x1 + 7, y0 - 2, y1 + 2, '#fbfbfb');
        glass(x0, x1, y0, y1, false);
        g.fillStyle = '#f6f6f6'; g.fillRect(cx - 2, Y(y1), 4, Y(y0) - Y(y1)); g.fillRect(x0, Y(y1 - (y1 - y0) * 0.3) - 2, w, 4);   // krzyż okienny
        rect(x0 - 10, x1 + 10, y0 - 4, y0 - 2, '#ffffff'); rect(x0 - 10, x1 + 10, y0 - 5, y0 - 4, 'rgba(0,0,0,.25)');           // parapet
        const top = Y(y1 + 3);
        g.fillStyle = '#ffffff';
        if (ped === 'tri') { g.beginPath(); g.moveTo(x0 - 12, top); g.lineTo(cx, top - 20); g.lineTo(x1 + 12, top); g.closePath(); g.fill(); rect(x0 - 12, x1 + 12, y1 + 2, y1 + 4, 'rgba(0,0,0,.2)'); }
        if (ped === 'seg') { g.beginPath(); g.moveTo(x0 - 12, top); g.quadraticCurveTo(cx, top - 26, x1 + 12, top); g.closePath(); g.fill(); }
        if (ped === 'hood') { g.fillRect(x0 - 12, top - 8, w + 24, 8); rect(x0 - 12, x1 + 12, y1 + 2, y1 + 3, 'rgba(0,0,0,.22)'); }
        if (ped === 'key') { g.beginPath(); g.moveTo(cx - 8, top + 6); g.lineTo(cx + 8, top + 6); g.lineTo(cx + 5, top - 10); g.lineTo(cx - 5, top - 10); g.closePath(); g.fill(); }
        if (P.panel && y0 === P.floors[0][0]) { rect(x0, x1, y0 - 13, y0 - 6, '#f2f2f2'); rect(x0 + 3, x1 - 3, y0 - 11, y0 - 8, 'rgba(0,0,0,.08)'); }
      }
      if (P.pil) { rect(i * bw - 7, i * bw + 7, P.kordon + 5, P.frieze, '#f7f7f7'); rect(i * bw - 10, i * bw + 10, P.frieze - 5, P.frieze, '#ffffff'); rect(i * bw - 9, i * bw + 9, P.kordon + 5, P.kordon + 8, '#ffffff'); }
    }
    if (lit) return;
    if (P.pil) for (const x of [n - 7]) rect(x, n, P.kordon + 5, P.frieze, '#f7f7f7');   // pilaster na styku powtórzeń tekstury
    rect(0, n, -2, 5, '#bdbdbd');                                                        // cokół
    if (P.rust) for (let y = 9; y < P.kordon - 2; y += 5) rect(0, n, y, y + 0.6, 'rgba(0,0,0,.1)');   // boniowanie parteru
    rect(0, n, P.kordon, P.kordon + 5, '#ffffff'); rect(0, n, P.kordon - 1, P.kordon, 'rgba(0,0,0,.2)');   // gzyms kordonowy
    rect(0, n, P.frieze, P.frieze + 5, '#e6e6e6');                                       // fryz
    rect(0, n, P.frieze + 5, P.H + 1, '#ffffff'); rect(0, n, P.frieze + 4, P.frieze + 5, 'rgba(0,0,0,.25)');   // gzyms koronujący
    for (let x = 3; x < n; x += 9) rect(x, x + 4, P.frieze + 5, P.frieze + 8, 'rgba(0,0,0,.14)');           // ząbki
  });
}
