# GTA Kalisz

Jazda po Kaliszu odtworzonym z danych OpenStreetMap. Do wyboru dwa auta: Audi A4 B7 1.9 TDI (PKA 02209) i BMW 645Ci E63 coupé (V8, ciemnoczerwony metalik). Gra powstała z trybu „Jazda testowa” projektu *Audi A4* i nie zawiera modelu silnika rozkładanego na części.

Adres: https://gta.patrykjagielski.tech (staging z gałęzi `release`: https://gta-staging.patrykjagielski.tech)

## Struktura

Kod gry to moduły ES w `src/` (jednostka świata = 1 dm; x = wschód, z = południe, (0, 0) = Główny Rynek). Punkt wejścia `src/main.js` buduje wybrane auto, podpina interfejs, uruchamia pętlę i wczytuje miasto. Moduły nie robią nic przy imporcie poza tworzeniem renderera i stałych — resztę uruchamia `main.js` (`initCars`, `init*`, `startLoop`, `loadCity`).

| Katalog | Zawartość |
| --- | --- |
| `src/index.html` | HTML, style, menu startowe, pauza, HUD; w `<head>` strażnik startu (komunikat, gdy gra nie może ruszyć) |
| `src/core/` | renderer, scena, kamera i światła (`renderer.js`), stan gry, DOM, motyw, pomocnicze bryły (`geometry.js`), tekstury canvas, RNG |
| `src/car/` | część wspólna aut: bryła z profili (`makeProfile`, `loft`), dekale, wnętrze i koła z parametrami, tablice; `index.js` = lista aut, auto na scenie (`rig`) i aktywny model (`active`) |
| `src/car/models/` | modele: `audi-a4/` i `bmw-e63/`; każdy opisuje wymiary, krzywe nadwozia, osiągi, skrzynię, brzmienie silnika, kamerę kierowcy i obrys kolizji oraz buduje własne detale (grill, lampy, felgi) |
| `src/city/` | Kalisz z danych miasta: `build.js` (`buildCity`), `buildings.js` (budynki: elewacje, lukarny, kominy), `roofs.js` (dachy spadziste z obrysów OSM), `rynek*.js` (pierzeje Głównego Rynku według zdjęć Street View: kamienice o czterech kondygnacjach po ok. 6 osi w różnych kolorach, dachy z dachówki z lukarnami, okna w 3D z opaskami, parapetami i naczółkami, kute balkony, czerwone ławki na płycie, ogródki kawiarniane z parasolami, fortepian plenerowy ze sceną przy ratuszu i namioty restauracji The Jack), indeks przestrzenny, siatki, tekstury elewacji i dachówki, nazwy ulic, niebo dzień/noc |
| `src/city/kamienice/` | kamienice Rynku odtworzone ze zdjęć 1:1 (dane w `spec.js`): pierzeja między Złotą a Piskorzewską — Salon Firan z kolumnami i attyką z kulami, Pod Filarami z podcieniem i medalionami, Żak, Bank Millennium; każda z własną liczbą osi, balkonami, witrynami i szyldami |
| `src/city/landmarks/` | zabytki: ratusz (ryzalit wsparty na arkadach, pod którymi da się przejść: `ratusz-arcade.js`), fontanna Noce i Dnie, kolegiata, kościół garnizonowy, mural (sgraffito), Plac św. Józefa z pomnikiem Jana Pawła II, kamienica na rogu |
| `src/drive/` | jazda: fizyka i zawieszenie, kolizje, skrzynia biegów, kamery, HUD, minimapa, dźwięk silnika; `index.js` = jeden krok jazdy |
| `src/foot/` | pieszo: postać bez animacji (`person.js`: bryła, kolizje z budynkami, słupkami i drzewami, wysokość podłoża), wierzch auta, na który da się wskoczyć (`car-top.js`), wysiadanie i wsiadanie (`F`), chodzenie, bieg (`Shift`), skok (`Spacja`), kamera za postacią (`index.js`) |
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

Są dwa środowiska na tym samym Mikrusie:

| | Gałąź | Adres | Katalog na serwerze | Kontener, port |
| --- | --- | --- | --- | --- |
| produkcja | `main` | https://gta.patrykjagielski.tech | `/root/gtakalisz` | `gtakalisz-web`, 8083 |
| staging | `release` | https://gta-staging.patrykjagielski.tech | `/root/gtakalisz-staging` | `gtakalisz-staging-web`, 8084 |

Push do `main` wdraża produkcję. Żeby sprawdzić zmianę na stagingu, zanim trafi do `main`, wypchnij ją do `release`:

```bash
git push --force-with-lease origin <gałąź>:release
```

Staging korzysta na razie z tych samych sekretów (środowisko GitHub `production`) co produkcja.

Ręcznie, z własnego komputera:

```bash
./deploy.sh              # produkcja
./deploy.sh --staging    # staging
```

Skrypt buduje grę, wysyła `dist/` na Mikrusa i wdraża ją bez przerwy w działaniu: najpierw nowe pliki z hashem, potem atomowa podmiana `index.html`, na końcu usuwa wersje starsze niż 2 dni, których nowa już nie używa. Kończy się błędem, jeśli serwer nie oddaje nowej wersji. Staging dostaje `robots.txt`, który blokuje indeksowanie.

Po zmianie `deploy/docker-compose.yml` lub `deploy/nginx/site.conf` (przy pierwszym wdrożeniu do danego katalogu włącza się samo):

```bash
./deploy.sh --config             # albo: ./deploy.sh --staging --config
```

Konfiguracja nginx jest najpierw sprawdzana (`nginx -t`) w osobnym kontenerze, dopiero potem podmieniana. Oba środowiska używają tego samego `docker-compose.yml`; nazwę kontenera i port zapisuje `deploy.sh --config` w `.env` obok niego.

### Automatycznie (GitHub Actions)

Workflow `.github/workflows/deploy.yml` po każdym pushu do `main` uruchamia `./deploy.sh`, a po pushu do `release` `./deploy.sh --staging`; w obu przypadkach z `--config`, jeśli push zmienił coś w `deploy/`. Można go też uruchomić ręcznie: Actions → Deploy → Run workflow (gałąź `main` wdraża produkcję, `release` staging; opcja `--config`). W pull requestach robi tylko lint i build. Wdrożenia do jednego środowiska idą po kolei, nigdy dwa naraz; nieudany lint lub build zatrzymuje wdrożenie, zanim cokolwiek trafi na serwer.

Jednorazowo trzeba dodać sekrety w Settings → Secrets and variables → Actions:

| Sekret | Wartość |
| --- | --- |
| `MIKRUS_HOST` | host SSH Mikrusa, np. `srv12.mikr.us` |
| `MIKRUS_PORT` | port SSH Mikrusa |
| `MIKRUS_SSH_KEY` | klucz prywatny przeznaczony tylko do wdrożeń |
| `MIKRUS_KNOWN_HOSTS` | wynik `ssh-keyscan -p <port> <host>` (odcisk serwera; bez niego połączenie jest odrzucane) |
| `MIKRUS_USER` | opcjonalnie, domyślnie `root` |

```bash
ssh-keygen -t ed25519 -N '' -C gta-deploy -f gta-deploy            # osobny klucz dla GitHuba
ssh-copy-id -i gta-deploy.pub -p <port> root@<host>                # albo dopisać do /root/.ssh/authorized_keys
ssh-keyscan -p <port> <host>                                       # -> MIKRUS_KNOWN_HOSTS (sprawdź odcisk z serwerem)
```

Zawartość `gta-deploy` wklej do `MIKRUS_SSH_KEY`, a lokalną kopię usuń.

Kontener `gtakalisz-web` (nginx, system plików tylko do odczytu, bez dodatkowych uprawnień, limit 64 MB RAM) nasłuchuje tylko na `127.0.0.1:8083` i `172.17.0.1:8083`, a `gtakalisz-staging-web` tak samo na porcie 8084. Ruch publiczny wchodzi przez tunel Cloudflare `warta-tunnel` z trasami `gta.patrykjagielski.tech → http://172.17.0.1:8083` i `gta-staging.patrykjagielski.tech → http://172.17.0.1:8084`.

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
