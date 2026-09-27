# GTA Kalisz

Jazda Audi A4 B7 1.9 TDI (PKA 02209) po Kaliszu odtworzonym z danych OpenStreetMap. Gra powstała z trybu „Jazda testowa” projektu *Audi A4* i nie zawiera modelu silnika rozkładanego na części.

Adres: https://gta.patrykjagielski.tech

## Struktura

| Ścieżka | Zawartość |
| --- | --- |
| `src/0-strona.html` | HTML, style, menu startowe, pauza, HUD; w `<head>` strażnik startu (komunikat, gdy gra nie może ruszyć) |
| `src/1-scena.js` | renderer Three.js, światła, wspólny stan, pomocnicze bryły |
| `src/2-auto.js` | model Audi A4 B7 (nadwozie, wnętrze, koła) |
| `src/3-miasto.js` | budowanie Kalisza z danych miasta: ulice, budynki, drzewa, zabytki (ratusz, fontanna Noce i Dnie, kolegiata, kościół garnizonowy, mural, pomnik Jana Pawła II, kamienica na rogu) |
| `src/4-jazda.js` | fizyka, kolizje, kamery, minimapa, dźwięk diesla, dzień i noc |
| `src/5-gra.js` | wczytywanie mapy, menu, pauza, klawiatura i dotyk, utrata kontekstu WebGL, pętla gry |
| `scripts/build.mjs` | build: bundel esbuild, nazwy z hashem, CSP, sprawdzenie `kalisz.json`, pliki `.gz` |
| `public/kalisz.json` | dane miasta (wynik `dane/build.py`) |
| `dane/` | skrypt i zapytania Overpass, z których powstaje `kalisz.json` (`pip install -r dane/requirements.txt`) |
| `deploy/` | `docker-compose.yml` i konfiguracja nginx dla Mikrusa |

Pliki `src/1…5` są sklejane w kolejności numerów w jeden moduł ES, a esbuild dokleja do niego Three.js 0.160 z `node_modules` (wersje przypięte w `package-lock.json`). Gra nie pobiera skryptów z zewnętrznych CDN; z zewnątrz przychodzą tylko fonty Google (z zapasowymi fontami systemowymi).

## Budowanie i uruchamianie

Wymaga Node.js 18+.

```bash
npm ci
npm run build
```

Wynik trafia do `dist/`:

| Plik | Cache w nginx |
| --- | --- |
| `index.html` | `no-cache`: przeglądarka sprawdza ETag przy każdym wejściu |
| `app.<hash>.js` | rok, `immutable` |
| `kalisz.<hash>.json` | rok, `immutable` |

Każdy plik ma obok wersję `.gz` (nginx `gzip_static`). Hash liczony jest z treści, więc po zmianie `kalisz.json` albo kodu nic nie trzeba podbijać ręcznie. Build zatrzymuje się, jeśli `kalisz.json` nie ma kształtu, którego oczekuje `buildCity`.

Podgląd lokalny:

```bash
npm run serve
```

`npm run build:debug` buduje bez minifikacji, z mapą źródeł i `window.__gta` (stan auta, kamera, funkcje kolizji) do testów w konsoli.

### Bezpieczeństwo

`index.html` ma Content-Security-Policy w `<meta>`: skrypty tylko z własnej domeny plus hash jedynego skryptu inline, style z hashem bloku `<style>` i Google Fonts, `fetch` tylko do własnej domeny. Hashe wylicza build, więc po edycji skryptu lub stylów w `src/0-strona.html` wystarczy przebudować. Nie dodawaj atrybutów `style="…"` ani `on…="…"` w HTML, bo CSP je zablokuje. Resztę nagłówków (`frame-ancestors`, `nosniff`, HSTS, Referrer-Policy, Permissions-Policy) ustawia nginx.

## Wdrożenie

```bash
./deploy.sh
```

Skrypt buduje grę, wysyła `dist/` na Mikrusa i wdraża ją bez przerwy w działaniu: najpierw nowe pliki z hashem, potem atomowa podmiana `index.html`, na końcu usuwa wersje starsze niż 2 dni, których nowa już nie używa. Kończy się błędem, jeśli serwer nie oddaje nowej wersji.

Po zmianie `deploy/docker-compose.yml` lub `deploy/nginx/site.conf` (i przy pierwszym wdrożeniu):

```bash
./deploy.sh --config
```

Konfiguracja nginx jest najpierw sprawdzana (`nginx -t`) w osobnym kontenerze, dopiero potem podmieniana.

Kontener `gtakalisz-web` (nginx, system plików tylko do odczytu, bez dodatkowych uprawnień, limit 64 MB RAM) nasłuchuje tylko na `127.0.0.1:8083` i `172.17.0.1:8083`. Ruch publiczny wchodzi przez tunel Cloudflare `warta-tunnel` z trasą `gta.patrykjagielski.tech → http://172.17.0.1:8083`.

## Sterowanie

<kbd>W</kbd>/<kbd>↑</kbd> gaz · <kbd>S</kbd>/<kbd>↓</kbd> hamulec i wsteczny · <kbd>A</kbd> <kbd>D</kbd> skręt · <kbd>Spacja</kbd> ręczny · <kbd>C</kbd> kamera · <kbd>R</kbd> powrót na start · <kbd>N</kbd> dzień/noc · <kbd>M</kbd> dźwięk · <kbd>Esc</kbd> pauza. Na telefonie są przyciski dotykowe.

Mapa: © współtwórcy OpenStreetMap (ODbL).
