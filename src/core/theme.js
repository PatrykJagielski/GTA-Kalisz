/* ---------- motyw: dzień / noc ---------- */
export const sysDark = matchMedia('(prefers-color-scheme: dark)');
export const isDark = () => { const t = document.documentElement.getAttribute('data-theme'); return t ? t === 'dark' : sysDark.matches; };
