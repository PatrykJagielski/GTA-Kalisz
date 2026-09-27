import { buildCity } from '../city/build.js';
import { CITY_BYTES, CITY_URL } from '../city/config.js';
import { applySky } from '../city/sky.js';
import { $ } from '../core/dom.js';
import { resetCar } from '../drive/physics.js';
import { drive } from '../drive/state.js';

/* ---------- wczytywanie Kalisza: pobranie danych z postępem, budowa miasta, komunikaty błędów ---------- */
const LOAD_TIMEOUT = 60000;                                                      // ms; 1,3 MB także na słabym LTE
async function fetchCity(onProgress) {
  const abort = new AbortController(), timer = setTimeout(() => abort.abort(), LOAD_TIMEOUT);
  try {
    const r = await fetch(CITY_URL, { signal: abort.signal });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    if (!r.body) return await r.json();
    // strumień jest już rozpakowany (gzip), więc postęp liczymy względem rozmiaru znanego z buildu
    const rd = r.body.getReader(), chunks = []; let got = 0;
    for (;;) {
      const { done, value } = await rd.read(); if (done) break;
      chunks.push(value); got += value.length; onProgress(Math.min(1, got / CITY_BYTES));
    }
    return JSON.parse(new TextDecoder().decode(await new Blob(chunks).arrayBuffer()));
  } finally { clearTimeout(timer); }
}
export async function loadCity() {
  const status = $('mStatus'), bar = $('mBar');
  drive.loading = true; $('mPlay').disabled = true; $('mMenu').classList.add('busy');
  status.textContent = 'Wczytywanie Kalisza…'; bar.style.width = '0%';
  try {
    const data = await fetchCity(p => { bar.style.width = Math.round(p * 80) + '%'; });
    status.textContent = 'Budowanie miasta…'; bar.style.width = '85%';
    await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame);   // pokaż komunikat przed długą budową
    drive.city = buildCity(data);
    bar.style.width = '100%';
    resetCar(); applySky(drive.city);
    status.textContent = 'Gotowe. Auto czeka na Placu Jana Pawła II.';
    $('mPlay').disabled = false; $('mMenu').classList.remove('busy');
    $('mPlay').focus({ preventScroll: true });
  } catch (e) {
    console.error('Nie udało się wczytać Kalisza:', e);
    status.textContent = e.name === 'AbortError' ? 'Mapa wczytuje się zbyt długo. Sprawdź połączenie i spróbuj ponownie.'
      : !navigator.onLine ? 'Brak połączenia z internetem. Połącz się i spróbuj ponownie.'
      : 'Nie udało się wczytać mapy. Spróbuj ponownie za chwilę.';
    $('mMenu').classList.remove('busy');
    $('mRetry').hidden = false; $('mRetry').focus({ preventScroll: true });
  }
  drive.loading = false;
}
