#!/bin/sh
# Buduje grę i wdraża ją na Mikrusa (/root/gtakalisz).
#   ./deploy.sh           nowa wersja gry: pliki w site/, kontener działa dalej bez restartu
#   ./deploy.sh --config  dodatkowo docker-compose.yml i konfiguracja nginx (sprawdzona w kontenerze przed
#                         podmianą); przy pierwszym wdrożeniu tworzy kontener gtakalisz-web
#
# Kolejność nie psuje gry osobom, które właśnie ją wczytują: najpierw dochodzą nowe pliki z hashem w nazwie,
# potem atomowo podmieniany jest index.html, a na końcu znikają stare pliki (starsze niż 2 dni i nieużywane).
# Skrypt kończy się błędem, jeśli po wdrożeniu serwer nie oddaje nowej wersji.
set -eu
cd "$(dirname "$0")"

HOST=mikrus
DIR=/root/gtakalisz
SSH="ssh -o BatchMode=yes -o ConnectTimeout=15"
export COPYFILE_DISABLE=1                       # tar z macOS bez plików ._* z atrybutami rozszerzonymi
TAR_OUT="tar --no-xattrs --no-mac-metadata"
tar --version | grep -q bsdtar || TAR_OUT="tar"   # GNU tar (Linux) nie zna tych opcji i nie potrzebuje ich

CONFIG=0
case "${1:-}" in
  '') ;;
  --config | --init) CONFIG=1 ;;
  *) echo "użycie: $0 [--config]" >&2; exit 2 ;;
esac

[ -d node_modules ] || npm ci --no-audit --no-fund
npm run --silent build
APP=$(cd dist && ls | grep -E '^app\.[0-9a-f]+\.js$')
CITY=$(cd dist && ls | grep -E '^kalisz\.[0-9a-f]+\.json$')

echo "wysyłanie: $APP, $CITY"
$SSH "$HOST" "mkdir -p '$DIR/site' '$DIR/nginx' && rm -rf '$DIR/.staging' && mkdir '$DIR/.staging'"
$TAR_OUT -C dist -cf - . | $SSH "$HOST" "tar -C '$DIR/.staging' -xf -"
if [ "$CONFIG" = 1 ]; then
  $TAR_OUT -C deploy -cf - docker-compose.yml nginx/site.conf | $SSH "$HOST" "mkdir -p '$DIR/.staging/.config' && tar -C '$DIR/.staging/.config' -xf -"
fi

$SSH "$HOST" sh -s -- "$DIR" "$APP" "$CITY" "$CONFIG" <<'REMOTE'
set -eu
DIR=$1 APP=$2 CITY=$3 CONFIG=$4
STAGE=$DIR/.staging
cd "$DIR"

# atomowe umieszczenie pliku w site/ (rename w obrębie katalogu); nginx nie serwuje plików z kropką
put() { cp "$STAGE/$1" "site/.$1.tmp" && mv -f "site/.$1.tmp" "site/$1"; }

if [ "$CONFIG" = 1 ]; then
  docker run --rm --entrypoint nginx -v "$STAGE/.config/nginx/site.conf:/etc/nginx/conf.d/default.conf:ro" nginx:1.27-alpine -t -q
  # zapis w miejscu, nie mv: plik jest zamontowany w kontenerze, a bind mount trzyma się i-węzła
  cat "$STAGE/.config/nginx/site.conf" > nginx/site.conf
  cp "$STAGE/.config/docker-compose.yml" docker-compose.yml
fi

# 1. nowe pliki z hashem (pliki o tej samej nazwie mają tę samą treść)
for f in "$STAGE"/app.* "$STAGE"/kalisz.*; do n=${f##*/}; [ -e "site/$n" ] || put "$n"; done
# 2. strona wskazująca na nowe pliki
put index.html.gz
put index.html

if [ "$CONFIG" = 1 ]; then
  if [ "$(docker inspect -f '{{.State.Running}}' gtakalisz-web 2>/dev/null)" = true ]; then docker exec gtakalisz-web nginx -s reload; fi
  docker compose up -d --remove-orphans          # tworzy kontener od nowa tylko, jeśli zmienił się docker-compose.yml
fi

# 3. sprzątanie: poprzednie wersje zostają 2 dni dla kart otwartych przed wdrożeniem
find site -maxdepth 1 -type f \( -name 'app.*' -o -name 'kalisz.*' \) -mtime +2 | while read -r f; do
  [ -e "$STAGE/${f##*/}" ] || rm -f "$f"
done
rm -rf "$STAGE"

# 4. test: serwer odpowiada i oddaje nową wersję
B=http://172.17.0.1:8083
i=0; until curl -fsS -o /dev/null "$B/healthz"; do i=$((i + 1)); [ $i -lt 20 ] || { echo 'serwer nie odpowiada' >&2; exit 1; }; sleep 1; done
curl -fsS "$B/" | grep -q "$APP" || { echo "index.html nie wskazuje na $APP" >&2; exit 1; }
curl -fsS -o /dev/null "$B/$APP"
curl -fsS -o /dev/null -w "serwer: %{http_code}, $CITY %{size_download} B\n" -H 'Accept-Encoding: gzip' "$B/$CITY"
REMOTE
echo "wdrożono: https://gta.patrykjagielski.tech"
