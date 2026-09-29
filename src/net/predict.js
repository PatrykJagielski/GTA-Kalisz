/* ---------- przewidywanie ruchu cudzego auta: model rowerowy jak w drive/physics.js, bez zmiany prędkości i skrętu ---------- */
// s = stan [x, z, psi, …, steer (6), v (7), …] (x, z = środek tylnej osi), wb = rozstaw osi (dm), t = s w przód;
// zwraca nowy stan (kopię). Na prostej dokładne; w zakręcie błąd rośnie z czasem, więc przewidujemy krótko (≤ 0,3 s).
const STEP = 0.02;                             // s

export function predict(s, wb, t) {
  const out = [...s], v = s[7], turn = v / wb * Math.tan(s[6]);
  let [x, z, psi] = s;
  for (let left = t; left > 1e-6; left -= STEP) {
    const h = Math.min(STEP, left);
    psi += turn * h; x += Math.cos(psi) * v * h; z -= Math.sin(psi) * v * h;
  }
  out[0] = x; out[1] = z; out[2] = psi;
  return out;
}
