import { applySky } from '../city/sky.js';
import { $ } from '../core/dom.js';
import { isDark, sysDark } from '../core/theme.js';
import { drive } from '../drive/state.js';

/* ---------- dzień i noc: przyciski, zapis wyboru, reakcja na motyw systemu ---------- */
const THEME_BTNS = ['dNight', 'pNight', 'mNight'];
const SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
function paintThemeBtns() {
  const d = isDark();
  for (const id of THEME_BTNS) {
    const b = $(id); b.hidden = false; b.setAttribute('aria-pressed', String(d));
    b.innerHTML = (d ? SUN : MOON) + `<span>${d ? 'Dzień' : 'Noc'}</span>`;
    b.title = d ? 'Przełącz na dzień' : 'Przełącz na noc';
  }
}
export function toggleNight() {
  const t = isDark() ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem('gta-theme', t); } catch (e) { /* bez zapisu: motyw działa do przeładowania */ }
}
export function initTheme() {
  const onThemeChange = () => { applySky(drive.city); paintThemeBtns(); };
  for (const id of THEME_BTNS) $(id).onclick = toggleNight;
  new MutationObserver(onThemeChange).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  sysDark.addEventListener('change', onThemeChange);
  paintThemeBtns();
}
