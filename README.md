# GTA Kalisz

Jazda po Kaliszu odtworzonym z danych OpenStreetMap. Do wyboru dwa auta: Audi A4 B7 1.9 TDI (PKA 02209) i BMW 645Ci E63 coupé (V8, ciemnoczerwony metalik). Gra powstała z trybu „Jazda testowa” projektu *Audi A4* i nie zawiera modelu silnika rozkładanego na części.

Adres: https://gta.patrykjagielski.tech

## Struktura

Kod gry to moduły ES w `src/` (jednostka świata = 1 dm; x = wschód, z = południe, (0, 0) = Główny Rynek). Punkt wejścia `src/main.js` buduje wybrane auto, podpina interfejs, uruchamia pętlę i wczytuje miasto. Moduły nie robią nic przy imporcie poza tworzeniem renderera i stałych — resztę uruchamia `main.js` (`initCars`, `init*`, `startLoop`, `loadCity`).

| Katalog | Zawartość |
| --- | --- |
| `src/index.html` | HTML, style, menu startowe, pauza, HUD; w `<head>` strażnik startu (komunikat, gdy gra nie może ruszyć) |
| `src/core/` | renderer, scena, kamera i światła (`renderer.js`), stan gry, DOM, motyw, pomocnicze bryły (`geometry.js`), tekstury canvas, RNG |
| `src/car/` | część wspólna aut: bryła z profili (`makeProfile`, `loft`), dekale, wnętrze i koła z parametrami, tablice; `index.js` = lista aut, auto na scenie (`rig`) i aktywny model (`active`) |
| `src/car/models/` | modele: `audi-a4/` i `bmw-e63/`; każdy opisuje wymiary, krzywe nadwozia, osiągi, skrzynię, brzmienie silnika, kamerę kierowcy i obrys kolizji oraz buduje własne detale (grill, lampy, felgi) |
| `src/city/` | Kalisz z danych miasta: `build.js` (`buildCity`), `buildings.js` (budynki: elewacje, lukarny, kominy), `roofs.js` (dachy spadziste z obrysów OSM), `rynek.js` i `rynek-facades.js` (pierzeje Głównego Rynku: jednolity gzyms, dachy mansardowe z lukarnami, elewacje z witrynami w parterze, gmach Holewińskiego z kolumnadą), indeks przestrzenny, siatki, tekstury elewacji i dachówki, nazwy ulic, niebo dzień/noc |
| `src/city/landmarks/` | zabytki: ratusz, fontanna Noce i Dnie, kolegiata, kościół garnizonowy, mural (sgraffito), Plac św. Józefa z pomnikiem Jana Pawła II, kamienica na rogu |
| `src/drive/` | jazda: fizyka i zawieszenie, kolizje, skrzynia biegów, kamery, HUD, minimapa, dźwięk silnika; `index.js` = jeden krok jazdy |
| `src/game/` | wczytywanie mapy, wybór auta (`cars.js`), start i pauza, klawiatura i dotyk, przyciski, dzień/noc, ustawienie dźwięku, utrata kontekstu WebGL, pętla |
| `scripts/build.mjs` | build: bundel esbuild, nazwy z hashem, CSP, sprawdzenie `kalisz.json`, pliki `.gz` |
| `public/kalisz.json` | dane miasta (wynik `dane/build.py`) |
| `dane/` | skrypt i zapytania Overpass, z których powstaje `kalisz.json` (`pip install -r dane/requirements.txt`) |
| `deploy/` | `docker-compose.yml` i konfiguracja nginx dla Mikrusa |

esbuild dokleja Three.js 0.160 z `node_modules` (wersje przypięte w `package-lock.json`). Gra nie pobiera skryptów z zewnętrznych CDN; z zewnątrz przychodzą tylko fonty Google (z zapasowymi fontami systemowymi).

ESLint (`npm run lint`) pilnuje nieużywanych i niezdefiniowanych nazw oraz długości plików: moduł ponad 250 linii kodu to błąd — znak, że trzeba go podzielić. `deploy.sh` nie wdroży kodu, który nie przechodzi lintera.

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

`npm run build:debug` buduje bez minifikacji, z mapą źródeł i `window.__gta` (stan auta, kamera, funkcje kolizji, `updateDrive`) do testów w konsoli; w wersji produkcyjnej ten kod jest usuwany.

### Bezpieczeństwo

`index.html` ma Content-Security-Policy w `<meta>`: skrypty tylko z własnej domeny plus hash jedynego skryptu inline, style z hashem bloku `<style>` i Google Fonts, `fetch` tylko do własnej domeny. Hashe wylicza build, więc po edycji skryptu lub stylów w `src/index.html` wystarczy przebudować. Nie dodawaj atrybutów `style="…"` ani `on…="…"` w HTML, bo CSP je zablokuje. Resztę nagłówków (`frame-ancestors`, `nosniff`, HSTS, Referrer-Policy, Permissions-Policy) ustawia nginx.

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

Auto wybiera się w menu startowym albo w pauzie (zmiana w pauzie następuje w miejscu, w którym auto stoi); wybór zostaje zapamiętany w przeglądarce.

| | Audi A4 B7 1.9 TDI | BMW 645Ci (E63) |
| --- | --- | --- |
| 0–50 km/h | 3,0 s | 2,0 s |
| 0–100 km/h | 10,0 s | 5,0 s |
| prędkość maks. | ok. 212 km/h | 250 km/h (ogranicznik) |
| skrzynia | automat, 5 biegów | automat, 6 biegów |
| silnik (dźwięk) | 4 cylindry, diesel z turbo | V8 |

Mapa: © współtwórcy OpenStreetMap (ODbL).
