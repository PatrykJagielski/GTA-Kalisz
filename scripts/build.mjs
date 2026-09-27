// Składa grę do dist/:
//   index.html               strona z CSP (hashe skryptu i stylów inline)
//   app.<hash>.js            src/1…5 sklejone w jeden moduł, z Three.js, zminifikowane
//   kalisz.<hash>.json       dane miasta (sprawdzone przed wdrożeniem)
//   *.gz                     wersje skompresowane dla gzip_static w nginx
// Nazwy z hashem treści można cache'ować na zawsze; index.html przeglądarka sprawdza przy każdym wejściu.
//
//   node scripts/build.mjs          wersja do wdrożenia
//   node scripts/build.mjs --debug  bez minifikacji, z mapą źródeł i window.__gta (stan gry w konsoli)
import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync, constants as zlib } from 'node:zlib';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src'), DIST = join(ROOT, 'dist');
const DEBUG = process.argv.includes('--debug');
const JS_PARTS = ['1-scena.js', '2-auto.js', '3-miasto.js', '4-jazda.js', '5-gra.js'];
const DEBUG_HOOK = 'window.__gta = { S, st, drive, rig, camera, controls, renderer, scene, resetCar, placeCar, hits, surfaceAt, streetAt, startGame, pauseGame };';

const fail = msg => { console.error(`build: ${msg}`); process.exit(1); };
const hash = buf => createHash('sha256').update(buf).digest('hex').slice(0, 10);
const cspHash = text => `'sha256-${createHash('sha256').update(text, 'utf8').digest('base64')}'`;
const kB = n => `${(n / 1024).toFixed(0)} kB`;

/* ---------- dane miasta ---------- */
// kształt kalisz.json, na którym polega buildCity (3-miasto.js); zły plik ma zatrzymać build, a nie grę u gracza
function checkCity(D) {
  const LISTS = ['names', 'roads', 'roadArea', 'cobble', 'blocks', 'yards', 'green', 'plaza', 'paths', 'water',
    'buildings', 'towers', 'trees', 'lamps', 'crossings'];
  const finite = a => Array.isArray(a) && a.every(Number.isFinite);
  const errs = [];
  for (const k of LISTS) if (!Array.isArray(D[k])) errs.push(`brak tablicy "${k}"`);
  if (!finite(D.bounds) || D.bounds.length !== 4 || D.bounds[0] >= D.bounds[2] || D.bounds[1] >= D.bounds[3]) errs.push('"bounds" musi być [x0, z0, x1, z1]');
  if (!finite(D.start) || D.start.length !== 3) errs.push('"start" musi być [x, z, kurs]');
  if (Array.isArray(D.trees) && D.trees.length % 2) errs.push('"trees" musi mieć pary x, z');
  if (Array.isArray(D.lamps) && D.lamps.length % 3) errs.push('"lamps" musi mieć trójki x, z, kąt');
  if (Array.isArray(D.roads) && Array.isArray(D.names)) {
    const bad = D.roads.findIndex(r => !finite(r) || r.length < 9 || r[1] >= D.names.length);
    if (bad >= 0) errs.push(`zła ulica roads[${bad}]`);
  }
  if (Array.isArray(D.buildings)) {
    const bad = D.buildings.findIndex(b => !finite(b) || b.length < 9 || (b.length - 3) % 2);
    if (bad >= 0) errs.push(`zły budynek buildings[${bad}]`);
  }
  for (const k of ['ratusz', 'kolegiata', 'garnizon', 'fountain']) if (D[k] !== undefined && (typeof D[k] !== 'object' || D[k] === null)) errs.push(`"${k}" musi być obiektem`);
  if (errs.length) fail(`public/kalisz.json:\n  ${errs.join('\n  ')}`);
}

const cityRaw = readFileSync(join(ROOT, 'public/kalisz.json'));
let city;
try { city = JSON.parse(cityRaw); } catch (e) { fail(`public/kalisz.json to niepoprawny JSON: ${e.message}`); }
checkCity(city);
const cityFile = `kalisz.${hash(cityRaw)}.json`;

/* ---------- skrypt gry ---------- */
const parts = JS_PARTS.map(f => `// ---- src/${f} ----\n${readFileSync(join(SRC, f), 'utf8')}`);
if (DEBUG) parts.push(DEBUG_HOOK);
const out = await build({
  stdin: { contents: parts.join('\n'), resolveDir: SRC, sourcefile: 'gta-kalisz.js', loader: 'js' },
  bundle: true,
  format: 'esm',
  target: ['es2020', 'chrome90', 'firefox90', 'safari15'],
  minify: !DEBUG,
  sourcemap: DEBUG ? 'inline' : false,
  legalComments: 'none',
  define: { __CITY_URL__: JSON.stringify(cityFile), __CITY_BYTES__: String(cityRaw.length) },
  write: false,
  logLevel: 'warning',
}).catch(() => fail('esbuild zgłosił błędy (wyżej)'));
const js = out.outputFiles[0].contents;
const jsFile = `app.${hash(js)}.js`;

/* ---------- strona ---------- */
let html = readFileSync(join(SRC, '0-strona.html'), 'utf8');
if (!html.includes('</body>')) fail('src/0-strona.html: brak </body>');
html = html.replace('</body>', `<script type="module" src="${jsFile}"></script>\n</body>`);
const inline = (tag) => [...html.matchAll(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'g'))].map(m => cspHash(m[1]));
const csp = [
  "default-src 'none'",
  `script-src 'self' ${inline('script').join(' ')}`,
  `style-src 'self' ${inline('style').join(' ')} https://fonts.googleapis.com`,
  'font-src https://fonts.gstatic.com',
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ');
html = html.replace('<meta charset="utf-8">', `<meta charset="utf-8">\n<meta http-equiv="Content-Security-Policy" content="${csp}">`);
if (!html.includes('Content-Security-Policy')) fail('src/0-strona.html: brak <meta charset="utf-8"> (tam trafia CSP)');

/* ---------- zapis ---------- */
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
const files = { 'index.html': Buffer.from(html), [jsFile]: Buffer.from(js), [cityFile]: cityRaw };
for (const [name, buf] of Object.entries(files)) {
  writeFileSync(join(DIST, name), buf);
  writeFileSync(join(DIST, `${name}.gz`), gzipSync(buf, { level: zlib.Z_BEST_COMPRESSION }));
}
for (const f of readdirSync(DIST).filter(f => !f.endsWith('.gz'))) {
  const size = statSync(join(DIST, f)).size, gz = statSync(join(DIST, `${f}.gz`)).size;
  console.log(`dist/${f.padEnd(24)} ${kB(size).padStart(8)}  gzip ${kB(gz).padStart(7)}`);
}
if (DEBUG) console.log('tryb debug: window.__gta dostępne w konsoli');
