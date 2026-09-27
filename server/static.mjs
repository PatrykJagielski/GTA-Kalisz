// Tylko lokalnie (STATIC_DIR): gra z dist/ pod tym samym adresem co /ws. Na Mikrusie grę serwuje nginx.
import { readFile } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.txt': 'text/plain' };

export async function serveStatic(dir, path, res) {
  try {
    const root = resolve(dir), file = join(root, path === '/' ? 'index.html' : decodeURIComponent(path));
    if (!file.startsWith(root + sep)) throw new Error('poza katalogiem');
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream', 'cache-control': 'no-cache' });
    res.end(body);
  } catch {
    res.writeHead(404); res.end();
  }
}
