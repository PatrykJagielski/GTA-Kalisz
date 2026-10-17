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
| `src/city/kamienice/` | kamienice odtworzone ze zdjęć 1:1, każda z własną liczbą osi, balkonami, witrynami i szyldami. Główny Rynek: wszystkie cztery pierzeje według Street View — `spec.js` (północno-zachodnia między Złotą a Piskorzewską: Salon Firan z kolumnami i attyką z kulami, Pod Filarami z podcieniem i medalionami, Żak, Bank Millennium), `rynek-nw.js` (dalszy ciąg za Piskorzewską), `rynek-ne.js`, `rynek-se.js`, `rynek-sw.js` (łącznie 22 kamienice ze sklepami, balkonami, oknami łukowymi i szyldami; wspólne części w `rynek-kit.js`). Ulica Zamkowa według Street View (`zamkowa-nw.js`, `zamkowa-se.js`): obie pierzeje od Rynku do placu św. Józefa ze sklepami i lokalami (m.in. Bussola, Cukiernia Sowa, Pięterko, Poczta Polska, Cukiernia na rogu Rynku, Luxinn, Notariusz, Loombard, Sklep Joker, Euro Kebab). Plac św. Józefa (`jozefa.js`): blok ze sklepem Skala, kamienice z Cook Pizza bis i BRENDy, gmach z apteką (kolumny wielkiego porządku, fronton), pałac z Galerią Sztuki im. Jana Tarasina; pozostałe ulice według Street View, po jednym pliku na ulicę, opisuje lista „Ulice ze Street View” niżej; `fronts.js` przypina opisy do krawędzi obrysów OSM (albo, przez `span`, do całej elewacji rozbitej w OSM na ząbki pilastrów) |
| `src/city/landmarks/` | zabytki: ratusz (ryzalit wsparty na arkadach, pod którymi da się przejść: `ratusz-arcade.js`; sień i klatka schodowa w wieży: `ratusz-inside.js`, izba i galeria widokowa: `ratusz-tower.js`, piętra dla pieszego: `ratusz-walk.js`), fontanna Noce i Dnie, kolegiata, kościół garnizonowy, mural (sgraffito), Plac św. Józefa z pomnikiem Jana Pawła II, kamienica na rogu |
| `src/drive/` | jazda: fizyka i zawieszenie, kolizje, skrzynia biegów, kamery, HUD, minimapa, dźwięk silnika, klakson (`horn.js`), inni gracze jako przeszkody (`traffic.js`); `index.js` = jeden krok jazdy |
| `src/foot/` | pieszo: postać bez animacji (`person.js`: bryła, kolizje z budynkami, słupkami i drzewami, wysokość podłoża), wierzch auta, własnego i innych graczy, na który da się wskoczyć (`car-top.js`), jazda jako pasażer w aucie innego gracza (`ride.js`), schody i piętra wieży ratusza (posadzka zależna od wysokości stóp, w środku kamera z oczu postaci), wysiadanie i wsiadanie (`F`), chodzenie, bieg (`Shift`), skok (`Spacja`), kamera za postacią (`index.js`) |
| `src/game/` | wczytywanie mapy, wybór auta (`cars.js`), start i pauza, klawiatura i dotyk, przyciski, dzień/noc, ustawienie dźwięku, utrata kontekstu WebGL, pętla |
| `src/net/` | gra online: połączenie z serwerem i wysyłanie własnego stanu 30 razy na sekundę i ping (`index.js`), inni gracze z płynnym ruchem między stanami i przewidywaniem do zderzeń (`remote.js`, `predict.js`), ich wygląd: kopia auta, postać, gdy wysiedli, i nick nad głową (`avatar.js`), ich silniki i klaksony (`sound.js`), czat (`chat.js`), lista graczy w pauzie (`players.js`), pokój z linku, nick, stan połączenia i „Zaproś znajomych” (`ui.js`) |
| `server/` | serwer gry online (Node + `ws`): pokoje i przekazywanie stanów graczy; `static.mjs` tylko do testów lokalnych |
| `scripts/build.mjs` | build: bundel esbuild, nazwy z hashem, CSP, sprawdzenie `kalisz.json`, pliki `.gz`; serwer online do `dist-server/gta-net.cjs` |
| `public/kalisz.json` | dane miasta (wynik `dane/build.py`) |
| `dane/` | skrypt i zapytania Overpass, z których powstaje `kalisz.json` (`pip install -r dane/requirements.txt`) |
| `deploy/` | `docker-compose.yml` (nginx z grą i Node z serwerem online) i konfiguracja nginx dla Mikrusa |

esbuild dokleja Three.js 0.160 z `node_modules` (wersje przypięte w `package-lock.json`). Gra nie pobiera skryptów z zewnętrznych CDN; z zewnątrz przychodzą tylko fonty Google (z zapasowymi fontami systemowymi).

ESLint (`npm run lint`) pilnuje nieużywanych i niezdefiniowanych nazw oraz długości plików: moduł ponad 250 linii kodu to błąd — znak, że trzeba go podzielić. `deploy.sh` nie wdroży kodu, który nie przechodzi lintera.

### Ulice ze Street View

Kamienice odtworzone ze zdjęć Street View, po jednym pliku w `src/city/kamienice/` na ulicę (w nawiasie numer pierwotnego PR). Na dalszych ulicach okna są często przybliżone, a przy długich ulicach odwzorowany jest tylko odcinek najbliżej Rynku. Kolejność na liście `ALL` w `fronts.js` ma znaczenie: krawędź obrysu, którą opisują dwa pliki, bierze opis z pierwszego.

- Ulica Piekarska (`piekarska.js`): 19 frontów obu pierzei według Street View (łukowe witryny przy Rynku, różowa kamienica z wejściem 2a, szare i ciemne parterowe wnęki, secesyjny daszek z dachówki, miętowa kamienica z rustyką, studio tatuażu, ArtDent, ślepa ściana przy skwerze). (#14)
- Ulica Łazienna (`lazienna.js`): pięć frontów (kamienica z Kram i Prestige, miętowa, biały parter z łukowymi witrynami, żółta z kamiennym portalem). (#15)
- Ulica Śródmiejska (`srodmiejska.js`): 26 frontów na pierwszych ok. 170 m od Rynku, z lokalami (m.in. Trafika, Rossmann, Santander, Joker, Radomski, Geers, Żabka). (#16)
- Ulica Kanonicka (`kanonicka.js`): obie pierzeje od Zamkowej do zakrętu (zielona kamienica z Pozytywką, Forthis, Sharker i Verą, Carla z bramą „u Romana”, Deni Cler, Enico, Apteka Prima, a po stronie kolegiaty Red Door, Fujifilm, Mustang i Jubiler z Lombardem). (#17)
- Ulica Mariańska według Street View (`marianska.js`): obie pierzeje, w tym kamienice z Tontorem, Architektem, Eko Kącikiem, Biurem Poselskim i kawiarnią Mario Coffee. (#18)
- Ulica Rzeźnicza (`rzeznicza.js`): narożna kamienica, King Kong z bramą i markizą oraz niski budynek z arkadowymi niszami. (#19)
- Ulica Świętego Stanisława (`stanislawa.js`): osiem kamienic od Kanonickiej do zakrętu, przybliżone okna i dokładniejsze parterowe bramy. (#20)
- Ulica Biskupia według Street View (`biskupia.js`): ceglana ściana po stronie SE, jasna ściana po stronie NW i dwie kamienice w głębi uliczki (zdjęcia tylko od strony Chodyńskiego). (#21)
- Ulica Złota (`zlota.js`): pierwsze ok. 230 m od Rynku, 16 kamienic (Guccio, Zakład rzemieślniczy, Veroni, Jubiler, przejazd bramowy i inne). (#22)
- Ulica Garbarska (`garbarska.js`): cała ulica, 13 frontów (m.in. ENICO, niebieska kamienica z łukowymi portalami, Tkaniny, Yazar, ABE-2). (#24)
- Ulica Kolegialna według Street View (`kolegialna.js`): narożna żółta kamienica ze sklepem w łuku, kremowa i brunatna kamienica, biały blok, ciemny budynek z kamiennym portalem oraz dawne Kolegium Jezuickie z boniowanym parterem i trzema portalami. (#25)
- Ulica Browarna według Street View (`browarna.js`): obie pierzeje od Śródmiejskiej do Kazimierzowskiej, m.in. różowa kamienica z secesyjnymi opaskami, żółtawe kamienice z bramami w łuku, ciemne domy z zielonymi balkonami, narożny sklep z odzieżą i biały blok. (#26)
- Ulica Grodzka (`grodzka.js`): 19 frontów po stronie kamienic i modernistycznego łuku (m.in. Salon Marta, kremowa z portalem granitowym, biała z bramą w łuku, szary łuk z okratowanymi oknami; kościół po drugiej stronie zostaje generyczny). (#27)
- Plac św. Józefa, biały gmach po stronie NW według Street View (`jozefa-biala.js`): długa elewacja z kamiennym cokołem, witrynami lokali i bramą. (#28)
- Ulica Franciszkańska (`franciszkanska.js`): cała ulica, 11 frontów (m.in. Kantor, kamienica z bramą z kutą kratą, oliwkowa z łukowymi oknami, bordowy parter z portalem, Zegarmistrz). (#29)
- Ulica Piskorzewska (`piskorzewska.js`): obie pierzeje od Wrocławskiej do placu św. Józefa (m.in. kamienica z sgraffito, Radość, Straż Pożarna, ceglany domek z zielonymi drzwiami). (#30)
- Ulica Targowa według Street View (`targowa.js`): kolorowy szereg kamienic po stronie SE (żółty dom z barem, pomarańczowa, różowa, zielona i liliowa), ciemnoszary dom z kratami i żółty pałac za żywopłotem. (#31)
- Ulica Szklarska (`szklarska.js`): cała ulica, 4 fronty (narożna niebieskoszara, żółta z balkonami, beżowe). (#32)
- Ulica Kazimierzowska według Street View (`kazimierzowska.js`): łukowy gmach z lat 50. z prążkowanym parterem i zielonymi balkonami, biały blok przy Browarnej i klasycystyczny gmach z przyczółkiem. (#33)
- Ulica Gabriela Narutowicza (`narutowicza.js`): cała ulica, 9 frontów (m.in. Hermetic z łukowymi witrynami, butiki w drewnianych ramach, różowa z girlandą, żółto-czerwone kamienice). (#34)
- Ulica Kadecka (`kadecka.js`): cała ulica, 5 frontów (piaskowe kamienice z łukowymi oknami o wachlarzowych nadprożach). (#36)
- Ulica Parczewskiego według Street View (`parczewskiego.js`): szary narożny dom z lat 50. z boniowanym parterem i jasnozielona kamienica z balkonami i łukowymi witrynami. (#37)
- Ulica Przechodnia (`przechodnia.js`): zabudowa północna z łukowymi oknami parteru, bramą nr 4 i długim brudnoszarym blokiem. (#38)
- Aleja Wolności (`aleja-wolnosci.js`): odcinek ok. 90 m po jednej stronie, Willa Calesia, klub i bloki modernistyczne. (#39)
- Plac Jana Pawła II według Street View (`jp2.js`): Dom Pielgrzyma z portalem i napisem oraz żółta kamienica z lokalami (kebab, cukiernia). (#40)
- Ulica Mostowa (`mostowa.js`): 7 frontów (bank z granitowym cokołem i łukowymi oknami, terakotowa Mostowa, ochrowa z naczółkami). (#41)
- Ulica Babina (`babina.js`, odcinek najbliżej Rynku): kamienice z bramami i balkonem na wysięgnikach, długi blok ze sklepem Stara Zielarnia i pasażem bramowym, blok z apteką Wodnik i willa z ryzalitem. (#42)
- Ulica Wodna według Street View (`wodna.js`): zabudowa NE nad kanałem, narożny dom z barem i dwie długie wyblakłe kamienice z balkonami i bramami. (#43)
- Ulica Jasna (`jasna.js`): 6 frontów przy ulicy i Alei Wolności (secesyjna z półokrągłymi balkonami, dwie zdobione narożne, ochrowa z kratami). (#44)
- Plac Kilińskiego według Street View (`kilinskiego.js`): ozdobne kamienice i długi gmach po stronie W oraz brunatny i żółty dom z dachami z dachówki po stronie E. (#45)
- Ulica Niecała (`niecala.js`): kamienica z bramą, różowa kamienica z naczółkami, długi gmach z lat trzydziestych z bordowym cokołem, pawilon i modernistyczna willa. (#46)
- Wał Staromiejski według Street View (`wal.js`): pałac przy moście z balustradą i narożną wieżyczką, kamienica z butami na rogu Śródmiejskiej oraz długa żółta kamienica nad kanałem. (#48)
- Wał Staromiejski (`wal-staromiejski.js`): 4 fronty przy bloku mieszkalnym (Buty Buciki, łukowe witryny, zielone balkony). (#47)
- Ulica Kredytowa (`kredytowa.js`): cała ulica, 7 frontów (okopcone kamienice z boniowanym parterem i łukowymi oknami, zaniedbane ściany ze złuszczonym tynkiem). (#49)
- Ulica Bankowa według Street View (`bankowa.js`): parterowa oficyna z kratami w oknach i ceglanym cokołem oraz modernistyczny blok z zaokrąglonymi balkonami. (#50)
- Plac Bogusławskiego według Street View (`boguslawskiego.js`): różowa kamienica z wieżyczką, pilastrami i czerwonym portalem oraz budynek Uniwersytetu Kaliskiego. (#51)
- Ulica Ciasna (`ciasna.js`, odcinek najbliżej Rynku): powojenne bloki z balkonami, ciemne kamienice z naczółkami, kamienica z przejazdem bramowym, sklep z zabawkami i narożna kamienica Firany. (#52)
- Ulica Kazimierza Pułaskiego (`pulaskiego.js`): pierwsze ok. 220 m od zachodniego końca, 15 frontów (ozdobne kamienice z balkonami, ceglane z bramami, zrujnowane domy i szary blok z PRL). (#53)
- Ulica Adama Chodyńskiego (`chodynskiego.js`): cztery pierzeje z przybliżonymi oknami. (#54)
- Ulica Krótka (`krotka.js`): cała ulica, 7 frontów (kremowa kamienica z bramą, ciemnoszara okopcona, różowa z apteką, niskie garaże i murki). (#55)
- Ulica 3 Maja (`trzeciego-maja.js`): kremowy gmach z ryzalitem i ubezpieczalnią. (#56)
- Ulica Stawiszyńska (`stawiszynska.js`, początek ulicy): brama i kaplica kościelna, kamienice z kutymi balkonami, zdobiona kamienica z mansardą. (#57)
- Ulica Majkowska (`majkowska.js`): pięciokondygnacyjny blok z lat 50. z cokołem z płytek. (#58)
- Ulica Podwale (`podwale.js`): cała ulica, 9 frontów (kamienica, blok z ochrowym tynkiem, garaże i pawilony). (#59)
- Wał Bernardyński (`wal-bernardynski.js`): narożna kamienica z boniowanym parterem. (#60)
- Ulica Częstochowska (`czestochowska.js`): zniszczona kamienica, różowa kamienica z balkonami i biały blok. (#61)
- Ulica Teatralna (`teatralna.js`): ściana gmachu i biurowiec. (#62)
- Ulica Berka Joselewicza (`berka.js`): cała ulica, 7 frontów (odnowione kamienice, okopcone ciemne kamienice z balkonami i blok z oliwkowym tynkiem). (#63)
- Ulica Towarowa (`towarowa.js`): ceglana fabryka, klub i dwa budynki mieszkalne. (#64)
- Ulica Chopina (`chopina.js`): blok z ceglanym cokołem i półokrągłymi balkonami. (#65)
- Ulica Fabryczna (`fabryczna.js`): blok, kamienica z bramą, hala z cegły i sklep Żabka. (#66)
- Ulica Wspólna (`wspolna.js`): powojenne bloki. (#67)
- Ulica Piskorzewie (`piskorzewie.js`): długa dawna fabryka z okratowanym parterem. (#68)
- Ulica Tadeusza Kościuszki (`kosciuszki.js`): 23 fronty z dwóch odcinków pokrytych Street View (szkoła z arkadami, okopcone kamienice z bramami i balkonami, bloki, pawilony). (#69)
- Ulica Szkolna (`szkolna.js`): cała ulica, 8 frontów (blok z niebieskimi pasami, kamienice, hala szkolna i mury). (#70)
- Ulica Kopernika (`kopernika.js`): białe kamienice narożne z balkonami i sklepami. (#71)
- Ulica Czaszkowska (`czaszkowska.js`): cała ulica, 8 frontów (bloki z lat 50., kamienice i nowszy dom z loggiami). (#72)
- Aleja Wojska Polskiego (`wojska-polskiego.js`): ślepa ściana z przejazdem. (#73)
- Ulica Jabłkowskiego (`jablkowskiego.js`): pierzeja czynszowych kamienic z ciemnym boniowanym parterem. (#74)
- Ulica Zacisze (`zacisze.js`): 4 fronty (zrujnowana narożna kamienica, beżowa boniowana kamienica i blok). (#75)
- Ulica Sukiennicza (`sukiennicza.js`): obie pierzeje od Rynku po ul. Łazienną (Sultan, Don Kichot, tatuażysta, kamienice z łukami i balkonami, bloki z lat 30. i 50.). (#76)
- Ulica Mazurska (`mazurska.js`): powojenne bloki w pastelowych pasach tynku. (#77)
- Ulica Prosta (`prosta.js`): niskie kamienice i oficyny. (#78)
- Ulica Nowy Świat (`nowy-swiat.js`): kamienice przy jezdni na odcinku najbliżej Rynku: różowa z lukarnami, szara z boniowanym parterem, zaniedbana z zabitymi oknami, biała z balkonami, trzy beżowe fronty, zielona i ceglana. (#79)
- Ulica Górnośląska (`gornoslaska.js`): powojenny blok z galeriami balkonowymi i sklepami w parterze. (#80)
- Ulica Gliniana (`gliniana.js`): ceglane budynki gospodarcze. (#81)
- Ulica Lotnicza (`lotnicza.js`): ceglane budynki. (#82)
- Ulica Kokanińska (`kokaninska.js`): szczyt kamienicy z zabitymi oknami i niski dom z szarego tynku. (#83)
- Ulica Wronia (`wronia.js`): zaniedbane czynszówki i ceglany blok przy brukowanej uliczce. (#84)
- Ulica Kasztelańska (`kasztelanska.js`): ślepa ściana z szarych płyt, bok kremowej kamienicy i biały dom z balkonem. (#85)
- Ulica Łączna (`lacznej.js`): blade czynszówki z podwyższonym parterem. (#86)
- Ulica Jana Długosza (`dlugosza.js`): szara czteropiętrowa kamienica z fryzami ząbkowymi, zielona z łukowymi oknami, długa ściana hali i kamienica z ceglanymi opaskami. (#87)
- Ulica Podgórze (`podgorze.js`): cała ulica, 23 fronty (zniszczone ceglane i tynkowane kamienice, blok, pawilon). (#88)
- Ulica Rzemieślnicza (`rzemieslnicza.js`): dawna fabryka z czerwonej cegły i białego tynku. (#89)
- Ulica Poznańska (`poznanska.js`): 13 frontów (zniszczone kamienice z bramami, żółte domy, kamienice z zielonymi balkonami). (#90)
- Ulica Handlowa (`handlowa.js`): ceglana ruina, szary domek, kamienica ze szczytem i dwa bloki z balkonami. (#91)
- Ulica Ogrodowa (`ogrodowa.js`): sześć kamienic robotniczych z cegły i tynku. (#92)
- Ulica Więzienna (`wiezienna.js`): mur zakładu karnego i domy po przeciwnej stronie. (#93)

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

Z grą online (gra i serwer pod jednym adresem, http://127.0.0.1:8766; pokój z linku, np. `/#pokoj=test`; w Claude Code podgląd `gta-online` na porcie 8767):

```bash
npm run build:debug
npm run server
```

Drugi gracz to druga karta albo drugie okno. `npm run serve` (sam Python) też działa, ale wtedy menu pokazuje, że online jest niedostępne.

`npm run build:debug` buduje bez minifikacji, z mapą źródeł i `window.__gta` (stan auta, kamera, funkcje kolizji, `updateDrive`) do testów w konsoli; w wersji produkcyjnej ten kod jest usuwany.

### Bezpieczeństwo

`index.html` ma Content-Security-Policy w `<meta>`: skrypty tylko z własnej domeny plus hash jedynego skryptu inline, style z hashem bloku `<style>` i Google Fonts, `fetch` tylko do własnej domeny, WebSocket tylko do `wss://` produkcji i stagingu (w wersji debug też do `ws://127.0.0.1`). Hashe wylicza build, więc po edycji skryptu lub stylów w `src/index.html` wystarczy przebudować. Nie dodawaj atrybutów `style="…"` ani `on…="…"` w HTML, bo CSP je zablokuje. Resztę nagłówków (`frame-ancestors`, `nosniff`, HSTS, Referrer-Policy, Permissions-Policy) ustawia nginx.

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

### Gra online

Każdy gracz liczy fizykę swojego auta u siebie i 30 razy na sekundę wysyła stan (położenie, kurs, przechyły, skręt, prędkość). Serwer (`server/index.mjs`, kontener `gtakalisz-net` / `gtakalisz-staging-net`) nie liczy fizyki: każdy stan od razu przekazuje pozostałym w pokoju, a raz na sekundę (i zaraz po wejściu) wysyła pełny stan pokoju. Przeglądarka pokazuje cudze auto z krótkim opóźnieniem i wygładza ruch między dwoma stanami, więc nierówne odstępy między pakietami nie szarpią autem. To opóźnienie dopasowuje się do łącza każdego gracza: odstęp między jego stanami plus 95. centyl spóźnień pakietów (40–250 ms; lokalnie wychodzi ok. 50 ms, na produkcji dochodzi do tego droga przez serwer, ok. 76 ms). Ping do serwera jest w HUD („Online: 3 · 45 ms”) i przy każdym graczu na liście w pauzie. Auta i postacie innych graczy są kopiami tych samych brył (bez dodatkowej pamięci na geometrię). Gracz, który wysiadł, jest widoczny jako postać obok swojego zaparkowanego auta.

Nick wpisuje się w menu (zapamiętany w przeglądarce); serwer usuwa z niego znaki sterujące i niewidoczne i skraca go do 16 znaków, a pusty zastępuje „Gracz <numer>”. Nick wisi nad autem albo postacią, widać go przez budynki do 300 m. Inni gracze są niebieskimi kropkami na minimapie (ci poza jej zasięgiem na brzegu, w swoim kierunku), a pauza ma listę pokoju: nick, auto albo „pieszo” i odległość.

Zderzenia (`src/drive/traffic.js`): każdy gracz rozwiązuje je tylko dla własnego auta. Auto, które nachodzi na cudze, jest z niego wypychane (jeśli nie wjedzie przez to w budynek) i dostaje odbicie jak przy zderzeniu dwóch aut o tej samej masie; drugi gracz robi to samo u siebie. Cudzy pieszy zatrzymuje auto jak słupek, a własny pieszy nie wejdzie w cudze auto ani postać. Zderzenie liczy się z położeniem cudzego auta przewidzianym na „teraz” (ostatni stan przesunięty modelem rowerowym o jego wiek i drogę pakietu, najwyżej 0,3 s), a nie z tym, które widać na ekranie; przy gwałtownym manewrze drugiego gracza odbicie może nastąpić kilkadziesiąt centymetrów przed widocznym autem. Gdy miejsce startu zajmuje inne auto, gra stawia gracza obok albo za nim.

Auta innych graczy są dla pieszego jak własne: da się na nie wskoczyć, a stojąc na jadącym aucie, postać jedzie razem z nim. Inni widzą ją przypiętą do tego auta (stan postaci ma wtedy id auta i położenie w jego układzie), więc nie zostaje w tyle za autem mimo opóźnienia. <kbd>F</kbd> obok cudzego auta wsadza na miejsce pasażera: kamera jedzie z kierowcą (<kbd>C</kbd>: za autem, fotel pasażera, swobodna), własne auto zostaje zaparkowane, nick pasażera jest dopisany do nicku kierowcy („Ania + Bartek”), a kierowca dostaje w czacie informację, kto z nim jedzie. Kolejne <kbd>F</kbd> wysiada po stronie pasażera; gdy kierowca wyjdzie z gry, pasażer wysiada tam, gdzie ostatnio było widać auto.

Dźwięk innych graczy: silnik (ta sama pętla co własny, z ich obrotami i gazem) i klakson, ciszej z odległością (do 90 m) i z lewej albo z prawej względem kamery; głosy tylko dla 4 najbliższych aut. Czat: <kbd>T</kbd> albo przycisk „Czat”, do 140 znaków, najwyżej jedna wiadomość na 0,7 s; w czacie pojawia się też wejście, wyjście i zmiana nicku innych graczy.

Bez `#pokoj=…` w adresie gracz trafia do pokoju wspólnego; „Zaproś znajomych” zakłada pokój z losową nazwą i kopiuje link do niego. Pokój mieści 16 graczy, serwer do 300 połączeń i do 6 z jednego IP, przyjmuje połączenia tylko ze strony gry (`GTA_ORIGIN`), wiadomości do 1 kB i do 40 na sekundę od gracza.

nginx przekazuje `/ws` do kontenera `net` przez sieć Dockera danego środowiska (produkcja i staging mają osobne serwery). `deploy.sh` wysyła `dist-server/gta-net.cjs` do `server/` i restartuje kontener tylko, gdy kod serwera się zmienił (gracze łączą się wtedy ponownie sami); na końcu sprawdza, czy `/ws` odpowiada.

Kontener `gtakalisz-web` (nginx, system plików tylko do odczytu, bez dodatkowych uprawnień, limit 64 MB RAM) nasłuchuje tylko na `127.0.0.1:8083` i `172.17.0.1:8083`, a `gtakalisz-staging-web` tak samo na porcie 8084. Kontener serwera online (Node, tylko do odczytu, użytkownik `node`, limit 96 MB RAM) nie ma portów na hoście. Ruch publiczny wchodzi przez tunel Cloudflare `warta-tunnel` z trasami `gta.patrykjagielski.tech → http://172.17.0.1:8083` i `gta-staging.patrykjagielski.tech → http://172.17.0.1:8084`.

## Sterowanie

<kbd>W</kbd>/<kbd>↑</kbd> gaz · <kbd>S</kbd>/<kbd>↓</kbd> hamulec i wsteczny · <kbd>A</kbd> <kbd>D</kbd> skręt · <kbd>Spacja</kbd> ręczny · <kbd>H</kbd> klakson · <kbd>T</kbd> czat (gra online) · <kbd>C</kbd> kamera · <kbd>R</kbd> powrót na start · <kbd>N</kbd> dzień/noc · <kbd>M</kbd> dźwięk · <kbd>Esc</kbd> pauza. Na telefonie są przyciski dotykowe.

Auto wybiera się w menu startowym albo w pauzie (zmiana w pauzie następuje w miejscu, w którym auto stoi); wybór zostaje zapamiętany w przeglądarce.

| | Audi A4 B7 1.9 TDI | BMW 645Ci (E63) |
| --- | --- | --- |
| 0–50 km/h | 3,0 s | 2,0 s |
| 0–100 km/h | 10,0 s | 5,0 s |
| prędkość maks. | ok. 212 km/h | 250 km/h (ogranicznik) |
| skrzynia | automat, 5 biegów | automat, 6 biegów |
| silnik (dźwięk) | 4 cylindry, diesel z turbo | V8 |

Mapa: © współtwórcy OpenStreetMap (ODbL).
