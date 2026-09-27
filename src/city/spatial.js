/* ---------- wielokąty i siatka wyszukiwania (kolizje, podłoże, nazwy ulic) ---------- */
export const GRID = 200;                                                              // siatka wyszukiwania 20 m
const gkey = (i, j) => (i + 2000) * 4096 + (j + 2000);
export function gridPut(grid, x0, z0, x1, z1, item) {
  for (let i = Math.floor(x0 / GRID); i <= Math.floor(x1 / GRID); i++)
    for (let j = Math.floor(z0 / GRID); j <= Math.floor(z1 / GRID); j++) {
      const k = gkey(i, j); let a = grid.get(k);
      if (!a) grid.set(k, a = []);
      a.push(item);
    }
}
export const cellOf = (grid, x, z) => grid.get(gkey(Math.floor(x / GRID), Math.floor(z / GRID))) || [];
export function ringBox(r) {
  let x0 = Infinity, z0 = Infinity, x1 = -Infinity, z1 = -Infinity;
  for (let i = 0; i < r.length; i += 2) { x0 = Math.min(x0, r[i]); x1 = Math.max(x1, r[i]); z0 = Math.min(z0, r[i + 1]); z1 = Math.max(z1, r[i + 1]); }
  return [x0, z0, x1, z1];
}
function ringHas(r, x, z) {
  let inside = false;
  for (let i = 0, j = r.length - 2; i < r.length; j = i, i += 2) {
    const xi = r[i], zi = r[i + 1], xj = r[j], zj = r[j + 1];
    if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}
export function polyHas(p, x, z) {
  if (!ringHas(p[0], x, z)) return false;
  for (let k = 1; k < p.length; k++) if (ringHas(p[k], x, z)) return false;
  return true;
}
export function indexPolys(list, grid = new Map()) {
  for (const p of list) { const b = ringBox(p[0]); gridPut(grid, b[0], b[1], b[2], b[3], { p, b }); }
  return grid;
}
export function inGrid(grid, x, z) {
  for (const { p, b } of cellOf(grid, x, z)) if (x > b[0] && x < b[2] && z > b[1] && z < b[3] && polyHas(p, x, z)) return true;
  return false;
}
export const ringArea2 = r => { let a = 0; for (let i = 0, j = r.length - 2; i < r.length; j = i, i += 2) a += r[j] * r[i + 1] - r[i] * r[j + 1]; return a; };
