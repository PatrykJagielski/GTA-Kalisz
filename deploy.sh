#!/bin/sh
# Buduje grę i wdraża ją na Mikrusa.
#   ./deploy.sh [--config] [--staging]
#   bez --staging  produkcja: /root/gtakalisz, kontener gtakalisz-web, port 8083, https://gta.patrykjagielski.tech
#   --staging      staging:   /root/gtakalisz-staging, kontener gtakalisz-staging-web, port 8084,
#                             https://gta-staging.patrykjagielski.tech (robots.txt blokuje indeksowanie)
#   --config       dodatkowo docker-compose.yml i konfiguracja nginx (sprawdzona w kontenerze przed podmianą);
#                  włącza się samo przy pierwszym wdrożeniu do danego katalogu i tworzy wtedy kontener
#
# Kolejność nie psuje gry osobom, które właśnie ją wczytują: najpierw dochodzą nowe pliki z hashem w nazwie,
# potem atomowo podmieniany jest index.html, a na końcu znikają stare pliki (starsze niż 2 dni i nieużywane).
# Serwer gry online (server/gta-net.cjs, kontener *-net) jest restartowany tylko wtedy, gdy zmienił się jego kod;
# gracze online łączą się wtedy ponownie sami.
# Skrypt kończy się błędem, jeśli po wdrożeniu serwer nie oddaje nowej wersji.
set -eu
cd "$(dirname "$0")"

HOST=mikrus
SSH="ssh -o BatchMode=yes -o ConnectTimeout=15"
export COPYFILE_DISABLE=1                       # tar z macOS bez plików ._* z atrybutami rozszerzonymi
TAR_OUT="tar --no-xattrs --no-mac-metadata"
tar --version | grep -q bsdtar || TAR_OUT="tar"   # GNU tar (Linux) nie zna tych opcji i nie potrzebuje ich

CONFIG=0
STAGING=0
for arg in "$@"; do
  case "$arg" in
    --config | --init) CONFIG=1 ;;
    --staging) STAGING=1 ;;
    *) echo "użycie: $0 [--config] [--staging]" >&2; exit 2 ;;
  esac
done

if [ "$STAGING" = 1 ]; then
  DIR=/root/gtakalisz-staging CONTAINER=gtakalisz-staging-web NET=gtakalisz-staging-net PORT=8084 URL=https://gta-staging.patrykjagielski.tech
else
  DIR=/root/gtakalisz CONTAINER=gtakalisz-web NET=gtakalisz-net PORT=8083 URL=https://gta.patrykjagielski.tech
fi

[ -d node_modules ] || npm ci --no-audit --no-fund
npm run --silent lint                           # błąd lintera (np. zgubiony import) zatrzymuje wdrożenie
npm run --silent build
APP=$(cd dist && ls | grep -E '^app\.[0-9a-f]+\.js$')
CITY=$(cd dist && ls | grep -E '^kalisz\.[0-9a-f]+\.json$')

if [ "$STAGING" = 1 ]; then
  printf 'User-agent: *\nDisallow: /\n' > dist/robots.txt
fi

# pierwsze wdrożenie do katalogu (albo pierwsze z grą online): bez docker-compose.yml z kontenerem net nie ma czego uruchomić
if [ "$CONFIG" = 0 ] && ! $SSH "$HOST" "test -f '$DIR/docker-compose.yml' && test -d '$DIR/server'"; then
  echo "brak $DIR/docker-compose.yml albo $DIR/server na serwerze: wdrożenie z --config"
  CONFIG=1
fi

echo "wysyłanie ($URL): $APP, $CITY"
$SSH "$HOST" "mkdir -p '$DIR/site' '$DIR/nginx' && rm -rf '$DIR/.staging' && mkdir '$DIR/.staging'"
$TAR_OUT -C dist -cf - . | $SSH "$HOST" "tar -C '$DIR/.staging' -xf -"
$TAR_OUT -C dist-server -cf - gta-net.cjs | $SSH "$HOST" "mkdir '$DIR/.staging/.server' && tar -C '$DIR/.staging/.server' -xf -"
if [ "$CONFIG" = 1 ]; then
  $TAR_OUT -C deploy -cf - docker-compose.yml nginx/site.conf | $SSH "$HOST" "mkdir -p '$DIR/.staging/.config' && tar -C '$DIR/.staging/.config' -xf -"
fi

$SSH "$HOST" sh -s -- "$DIR" "$APP" "$CITY" "$CONFIG" "$CONTAINER" "$PORT" "$NET" "$URL" <<'REMOTE'
set -eu
DIR=$1 APP=$2 CITY=$3 CONFIG=$4 CONTAINER=$5 PORT=$6 NET=$7 URL=$8
STAGE=$DIR/.staging
cd "$DIR"

# atomowe umieszczenie pliku w site/ (rename w obrębie katalogu); nginx nie serwuje plików z kropką
put() { cp "$STAGE/$1" "site/.$1.tmp" && mv -f "site/.$1.tmp" "site/$1"; }

if [ "$CONFIG" = 1 ]; then
  docker run --rm --entrypoint nginx -v "$STAGE/.config/nginx/site.conf:/etc/nginx/conf.d/default.conf:ro" nginx:1.27-alpine -t -q
  # zapis w miejscu, nie mv: plik jest zamontowany w kontenerze, a bind mount trzyma się i-węzła
  cat "$STAGE/.config/nginx/site.conf" > nginx/site.conf
  cp "$STAGE/.config/docker-compose.yml" docker-compose.yml
  # nazwa kontenera i port dla docker-compose.yml (compose czyta .env z katalogu projektu)
  printf 'GTA_CONTAINER=%s\nGTA_PORT=%s\nGTA_NET_CONTAINER=%s\nGTA_ORIGIN=%s\n' "$CONTAINER" "$PORT" "$NET" "$URL" > .env
fi

# 0. serwer gry online: nowy kod tylko, jeśli się zmienił (restart rozłącza graczy na chwilę)
mkdir -p server
NET_NEW=0
if ! cmp -s "$STAGE/.server/gta-net.cjs" server/gta-net.cjs; then
  cp "$STAGE/.server/gta-net.cjs" server/.gta-net.cjs.tmp && mv -f server/.gta-net.cjs.tmp server/gta-net.cjs
  NET_NEW=1
fi
NET_WAS_UP=$(docker inspect -f '{{.State.Running}}' "$NET" 2>/dev/null || true)

# 1. nowe pliki z hashem (pliki o tej samej nazwie mają tę samą treść)
for f in "$STAGE"/app.* "$STAGE"/kalisz.*; do n=${f##*/}; [ -e "site/$n" ] || put "$n"; done
# 2. strona wskazująca na nowe pliki
put index.html.gz
put index.html
if [ -e "$STAGE/robots.txt" ]; then put robots.txt; fi

if [ "$CONFIG" = 1 ]; then
  if [ "$(docker inspect -f '{{.State.Running}}' "$CONTAINER" 2>/dev/null)" = true ]; then docker exec "$CONTAINER" nginx -s reload; fi
  docker compose up -d --remove-orphans          # tworzy kontener od nowa tylko, jeśli zmienił się docker-compose.yml
fi
# kontener, który już działał, ma w pamięci stary kod; nowo utworzony przez compose wczytał już nowy
if [ "$NET_NEW" = 1 ] && [ "$NET_WAS_UP" = true ]; then docker restart -t 5 "$NET" > /dev/null; fi

# 3. sprzątanie: poprzednie wersje zostają 2 dni dla kart otwartych przed wdrożeniem
find site -maxdepth 1 -type f \( -name 'app.*' -o -name 'kalisz.*' \) -mtime +2 | while read -r f; do
  [ -e "$STAGE/${f##*/}" ] || rm -f "$f"
done
rm -rf "$STAGE"

# 4. test: serwer odpowiada i oddaje nową wersję
B=http://172.17.0.1:$PORT
i=0; until curl -fsS -o /dev/null "$B/healthz"; do i=$((i + 1)); [ $i -lt 20 ] || { echo 'serwer nie odpowiada' >&2; exit 1; }; sleep 1; done
curl -fsS "$B/" | grep -q "$APP" || { echo "index.html nie wskazuje na $APP" >&2; exit 1; }
curl -fsS -o /dev/null "$B/$APP"
curl -fsS -o /dev/null -w "serwer: %{http_code}, $CITY %{size_download} B\n" -H 'Accept-Encoding: gzip' "$B/$CITY"
# gra online: /ws bez nagłówków WebSocket odpowiada 426, jeśli nginx widzi kontener net
i=0; until [ "$(curl -s -o /dev/null -w '%{http_code}' "$B/ws")" = 426 ]; do
  i=$((i + 1)); [ $i -lt 20 ] || { echo "serwer online ($NET) nie odpowiada pod /ws (./deploy.sh --config?)" >&2; exit 1; }; sleep 1
done
echo "serwer online: $NET odpowiada pod /ws"
REMOTE
echo "wdrożono: $URL"
