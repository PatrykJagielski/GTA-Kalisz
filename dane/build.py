# OSM (Overpass JSON) -> kalisz.json: geometria miasta w decymetrach, x = wschód, z = południe, (0,0) = Główny Rynek
import json, math, random, re, sys
from shapely.geometry import Polygon, MultiPolygon, LineString, Point, box, GeometryCollection
from shapely.ops import unary_union, linemerge
from shapely.strtree import STRtree
from shapely import set_precision

SRC = sys.argv[1]; OUT = sys.argv[2]
LAT0, LON0 = 51.76265, 18.08975
KX = 111320 * math.cos(math.radians(LAT0)); KY = 110540
XMAX, ZMAX = 1400, 1250
RECT = box(-XMAX, -ZMAX, XMAX, ZMAX)
random.seed(20050427)

d = json.load(open(SRC))
nodes = {e['id']: ((e['lon'] - LON0) * KX, -(e['lat'] - LAT0) * KY) for e in d['elements'] if e['type'] == 'node'}
ntags = [e for e in d['elements'] if e['type'] == 'node' and 'tags' in e]
ways = {e['id']: e for e in d['elements'] if e['type'] == 'way'}
rels = [e for e in d['elements'] if e['type'] == 'relation']

def coords(w):
    return [nodes[n] for n in w['nodes'] if n in nodes]
def way_poly(w):
    c = coords(w)
    if len(c) < 4 or w['nodes'][0] != w['nodes'][-1]: return None
    p = Polygon(c)
    return p if p.is_valid else p.buffer(0)
def rel_poly(r):
    outer, inner = [], []
    for m in r['members']:
        if m['type'] != 'way' or m['ref'] not in ways: continue
        (inner if m.get('role') == 'inner' else outer).append(LineString(coords(ways[m['ref']])))
    from shapely.ops import polygonize
    o = unary_union(list(polygonize(linemerge(outer) if outer else []))) if outer else None
    if o is None or o.is_empty: return None
    if inner:
        i = unary_union(list(polygonize(linemerge(inner))))
        o = o.difference(i)
    return o
def num(s):
    m = re.match(r'\s*([0-9]+(?:[.,][0-9]+)?)', s or '')
    return float(m.group(1).replace(',', '.')) if m else None
def polys(g):
    if g is None or g.is_empty: return []
    if isinstance(g, Polygon): return [g]
    if isinstance(g, (MultiPolygon, GeometryCollection)): return [p for x in g.geoms for p in polys(x)]
    return []

# ---------- budynki ----------
DEF_H = {'house': 7.5, 'detached': 7.5, 'semidetached_house': 7.5, 'terrace': 9, 'garage': 2.8, 'garages': 2.8, 'shed': 2.6,
         'church': 17, 'cathedral': 19, 'chapel': 8, 'apartments': 14, 'residential': 12, 'commercial': 10, 'retail': 6,
         'industrial': 8, 'warehouse': 7, 'school': 12, 'university': 14, 'college': 12, 'office': 13, 'public': 12,
         'hospital': 16, 'service': 3.2, 'kiosk': 3, 'hotel': 15, 'civic': 11, 'convent': 12, 'kindergarten': 7,
         'transportation': 6, 'train_station': 9, 'farm_auxiliary': 4, 'hut': 3, 'greenhouse': 3, 'sports_hall': 10, 'government': 12}
def bkind(t):
    b = t.get('building') or t.get('building:part') or 'yes'
    if b in ('garage', 'garages', 'shed', 'service', 'hut', 'farm_auxiliary', 'kiosk', 'greenhouse', 'transformer_tower'): return 2
    if b in ('church', 'cathedral', 'chapel') or t.get('amenity') == 'place_of_worship': return 4
    if b in ('house', 'detached', 'semidetached_house'): return 1
    if b in ('commercial', 'office', 'retail', 'hospital', 'university', 'hotel', 'industrial', 'warehouse', 'sports_hall'): return 3
    return 0
bl = []   # (poly, h, minh, kind, tags)
def add_building(p, t):
    if p is None: return
    b = t.get('building') or t.get('building:part')
    if b in ('roof', 'no', 'construction', 'ruins') or t.get('location') == 'underground': return
    h = num(t.get('height'))
    lv = num(t.get('building:levels'))
    if h is None and lv is not None: h = lv * 3.1 + 1.2 + (num(t.get('roof:levels')) or 0) * 2.5
    if h is None:
        h = DEF_H.get(b)
        if h is None: h = random.choice([7.5, 9, 10.5, 12, 13.5])
    minh = num(t.get('min_height')) or 0
    kind = bkind(t)
    c = p.centroid
    # biura i sklepy w śródmieściu to zwykle kamienice; ratusz i zabytki też
    if kind == 3 and (math.hypot(c.x, c.y) < 450 or t.get('amenity') == 'townhall' or 'historic' in t or 'heritage' in t): kind = 0
    for q in polys(p.intersection(RECT)):
        if q.area > 4: bl.append((q.simplify(0.1), h, minh, kind, t))
RATUSZ_REL, RATUSZ_PARTS = 2263102, (170166673, 170166672, 173958451, 173958454)
GARNIZON = 168640446             # Kościół garnizonowy św. Wojciecha i św. Stanisława: model osobny
KOLEGIATA = 168610565            # Bazylika kolegiacka Wniebowzięcia NMP (Sanktuarium św. Józefa): model osobny
for w in ways.values():
    t = w.get('tags', {})
    if w['id'] in RATUSZ_PARTS or w['id'] in (KOLEGIATA, GARNIZON): continue
    if 'building' in t or 'building:part' in t: add_building(way_poly(w), t)
for r in rels:
    t = r.get('tags', {})
    if 'building' in t and r['id'] != RATUSZ_REL: add_building(rel_poly(r), t)
print('buildings', len(bl))
bparts = [b for b in bl if 'building:part' in b[4]]
# ---------- ratusz (Główny Rynek 20): obrys z dziedzińcem, wieża, front z ryzalitem ----------
rat_poly = rel_poly([r for r in rels if r['id'] == RATUSZ_REL][0])
rat_poly = max(polys(rat_poly), key=lambda p: p.area)
shaft = way_poly(ways[170166673])
T = shaft.centroid
sc = list(shaft.exterior.coords)
tower_side = (math.dist(sc[0], sc[1]) + math.dist(sc[1], sc[2])) / 2
ring_c = list(rat_poly.exterior.coords)
best = None
for a, b in zip(ring_c, ring_c[1:]):
    L = math.dist(a, b)
    if L < 12: continue
    ux, uz = (b[0] - a[0]) / L, (b[1] - a[1]) / L
    t = (T.x - a[0]) * ux + (T.y - a[1]) * uz
    if t < 0 or t > L: continue
    dist = abs((T.x - a[0]) * uz - (T.y - a[1]) * ux)
    if best is None or dist < best[0]: best = (dist, a, b)
_, A, B = best
ux, uz = (B[0] - A[0]), (B[1] - A[1])
mx, mz = (A[0] + B[0]) / 2, (A[1] + B[1]) / 2
if ((mx - T.x) * -uz + (mz - T.y) * ux) < 0: A, B = B, A     # lokalne +z (−uz, ux) ma wskazywać na zewnątrz
cornice = rat_poly.buffer(0.55, join_style='mitre')
kol_poly = way_poly(ways[KOLEGIATA])
kr = kol_poly.minimum_rotated_rectangle; kc = list(kr.exterior.coords)
ed = max(((kc[i], kc[i + 1]) for i in range(4)), key=lambda e: math.dist(*e))
kux, kuz = (ed[1][0] - ed[0][0]) / math.dist(*ed), (ed[1][1] - ed[0][1]) / math.dist(*ed)
if kuz > 0: kux, kuz = -kux, -kuz                                  # oś od wieży (SSW) do prezbiterium (NNE)
gar_poly = way_poly(ways[GARNIZON])
gr_ = gar_poly.minimum_rotated_rectangle; gc = list(gr_.exterior.coords)
ed = max(((gc[i], gc[i + 1]) for i in range(4)), key=lambda e: math.dist(*e))
gux, guz = (ed[1][0] - ed[0][0]) / math.dist(*ed), (ed[1][1] - ed[0][1]) / math.dist(*ed)
GC = gar_poly.centroid
def span_at(sign):                                                    # szerokość obrysu przy jednym z końców osi
    pts = [((x - GC.x) * gux + (z - GC.y) * guz, (x - GC.x) * -guz + (z - GC.y) * gux) for x, z in gar_poly.exterior.coords]
    um = max(p[0] * sign for p in pts)
    vs = [p[1] for p in pts if p[0] * sign > um - 3]
    return max(vs) - min(vs)
if span_at(-1) > span_at(1): gux, guz = -gux, -guz                 # +u wskazuje fasadę (szerszy koniec), prezbiterium z tyłu
bfoot_extra = [rat_poly, kol_poly, gar_poly]

bfoot = unary_union([b[0] for b in bl if 'building:part' not in b[4] and b[3] != 2] + bfoot_extra)
btree = STRtree([b[0] for b in bl if b[3] != 2] + bfoot_extra)

# ---------- drogi ----------
ROADW = {'primary': 12, 'secondary': 10, 'tertiary': 8, 'primary_link': 6, 'secondary_link': 6, 'tertiary_link': 6,
         'residential': 6, 'unclassified': 5.5, 'living_street': 5, 'service': 4.5}
roads, cobble_lines, ped_lines, path_lines, crossings, names = [], [], [], [], [], []
name_idx = {}
ped_areas, parking = [], []
for w in ways.values():
    t = w.get('tags', {}); hw = t.get('highway')
    if not hw: 
        if t.get('amenity') == 'parking' and t.get('parking', 'surface') == 'surface':
            p = way_poly(w)
            if p: parking.append(p)
        continue
    c = coords(w)
    if len(c) < 2: continue
    line = LineString(c)
    if not line.intersects(RECT.buffer(50)): continue
    if hw in ROADW:
        if t.get('area') == 'yes': continue
        if t.get('access') == 'no' or t.get('service') in ('emergency_access',): continue
        one = t.get('oneway') in ('yes', '1', '-1') or t.get('junction') == 'roundabout'
        wd = num(t.get('width'))
        if wd is None:
            ln = num(t.get('lanes'))
            wd = ln * 3.2 if ln else ROADW[hw] * (0.62 if one and hw in ('primary', 'secondary', 'tertiary') else 1)
            if hw == 'service': wd = {'parking_aisle': 5.5, 'driveway': 3.2, 'alley': 3.5}.get(t.get('service'), wd)
        roads.append({'line': line, 'hw': hw, 'w': max(3.2, min(wd, 16)), 'one': one, 'name': t.get('name'), 'bridge': t.get('bridge') == 'yes' or t.get('man_made') == 'bridge'})
    elif hw == 'pedestrian':
        if t.get('area') == 'yes' and w['nodes'][0] == w['nodes'][-1]:
            p = way_poly(w)
            if p: ped_areas.append(p)
        else: ped_lines.append((line, 5))
    elif hw in ('footway', 'path', 'cycleway', 'track', 'bridleway'):
        if t.get('footway') == 'crossing' or t.get('cycleway') == 'crossing': crossings.append(line); continue
        if t.get('footway') == 'sidewalk': continue
        if t.get('area') == 'yes': continue
        path_lines.append((line, {'track': 3, 'cycleway': 2.4}.get(hw, 2)))
print('roads', len(roads))

# zwężanie jezdni, które wcinają się w budynki (węższe uliczki starówki)
shrunk = 0
for r in roads:
    while r['w'] > 3.4:
        g = r['line'].buffer(r['w'] / 2, cap_style='flat')
        hit = sum(g.intersection(btf).area for btf in (btree.geometries[i] for i in btree.query(g)) )
        if hit < 1.5 + 0.02 * r['line'].length: break
        r['w'] -= 0.5; shrunk += 1
print('shrink steps', shrunk)
road_geoms = [r['line'].buffer(r['w'] / 2, quad_segs=3) for r in roads]
parking_area = unary_union(parking).difference(bfoot) if parking else Polygon()
road_area = unary_union(road_geoms + [parking_area]).intersection(RECT)
road_area = road_area.simplify(0.15)
print('road area', round(road_area.area))

# ---------- woda ----------
water = []
for w in ways.values():
    t = w.get('tags', {})
    if t.get('natural') == 'water' and t.get('water') != 'wastewater':
        p = way_poly(w)
        if p: water.append(p)
    ww = t.get('waterway')
    if ww in ('river', 'canal', 'stream', 'drain', 'ditch') and t.get('tunnel') not in ('culvert', 'yes') and t.get('layer', '0') >= '0':
        c = coords(w)
        if len(c) > 1: water.append(LineString(c).buffer({'river': 9, 'canal': 5, 'stream': 1.8, 'drain': 1.2, 'ditch': 1}[ww], quad_segs=3))
for r in rels:
    if r['tags'].get('natural') == 'water': 
        p = rel_poly(r)
        if p: water.append(p)
water_area = unary_union(water).intersection(RECT).difference(road_area).simplify(0.3)
print('water area', round(water_area.area))

# ---------- kwartały (wszystko poza jezdnią i wodą), zieleń, deptaki ----------
blocks = RECT.difference(road_area).difference(water_area)
green_src = []
for w in list(ways.values()):
    t = w.get('tags', {})
    if t.get('leisure') in ('park', 'garden', 'pitch', 'playground') or t.get('landuse') in ('grass', 'forest', 'meadow', 'cemetery', 'recreation_ground', 'village_green', 'allotments') or t.get('natural') in ('wood', 'scrub', 'grassland'):
        if t.get('surface') in ('asphalt', 'paved', 'concrete', 'paving_stones', 'tartan', 'artificial_turf'): continue
        p = way_poly(w)
        if p: green_src.append((p, t))
for r in rels:
    t = r['tags']
    if t.get('leisure') == 'park' or t.get('landuse') in ('grass', 'forest', 'cemetery'):
        p = rel_poly(r)
        if p: green_src.append((p, t))
green = unary_union([p for p, _ in green_src]).intersection(blocks).difference(bfoot).simplify(0.3)
wood = unary_union([p for p, t in green_src if t.get('leisure') in ('park', 'garden') or t.get('landuse') in ('forest', 'cemetery') or t.get('natural') == 'wood']).intersection(green)
plaza = unary_union(ped_areas + [l.buffer(wd / 2, quad_segs=2) for l, wd in ped_lines]).intersection(blocks).simplify(0.2) if ped_areas or ped_lines else Polygon()
paths = unary_union([l.buffer(wd / 2, quad_segs=2) for l, wd in path_lines]).intersection(blocks).difference(bfoot).simplify(0.2)
yards = blocks.buffer(-4, join_style='mitre').simplify(0.3)
cobble = unary_union([r['line'].buffer(r['w'] / 2, quad_segs=3) for r in roads if r['hw'] == 'living_street']).intersection(road_area).simplify(0.2)
print('blocks', len(polys(blocks)), 'green', len(polys(green)), 'paths', len(polys(paths)))

# ---------- fontanna „Noce i Dnie” (Plac Jana Pawła II / Niecała) ----------
import os
fj = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fountains.json')))
fw = [e for e in fj['elements'] if e['type'] == 'way' and e['id'] == 241614301][0]
fpoly = Polygon([((g['lon'] - LON0) * KX, -(g['lat'] - LAT0) * KY) for g in fw['geometry']])
FC = fpoly.centroid
fpts = list(fpoly.exterior.coords)[:-1]
dists = [math.dist(p, (FC.x, FC.y)) for p in fpts]
tips = []
for i in sorted(range(len(fpts)), key=lambda i: -dists[i]):          # trzy wierzchołki trójkątnej niecki
    if all(math.dist(fpts[i], t) > 5 for t in tips): tips.append(fpts[i])
    if len(tips) == 3: break
FOUNTAIN_R = 19                                                       # okrągły plac wokół fontanny

# ---------- drzewa i latarnie ----------
occupied = unary_union([bfoot, water_area, road_area]).buffer(1.2)
occ_tree = STRtree(polys(occupied))
def free(pt):
    return not any(occ_tree.geometries[i].contains(pt) for i in occ_tree.query(pt))
path_tree = STRtree(polys(paths.buffer(1.5)))
def off_path(pt):
    return not any(path_tree.geometries[i].contains(pt) for i in path_tree.query(pt))
trees = []
for n in ntags:
    if n['tags'].get('natural') == 'tree':
        x, z = nodes[n['id']]
        if RECT.contains(Point(x, z)) and free(Point(x, z)) and math.dist((x, z), (FC.x, FC.y)) > FOUNTAIN_R + 1: trees.append((x, z))
wood_t = STRtree(polys(wood)); green_t = STRtree(polys(green))
def inside(tree, pt): return any(tree.geometries[i].contains(pt) for i in tree.query(pt))
minx, minz, maxx, maxz = green.bounds
S = 8.5
gz = minz
while gz < maxz:
    gx = minx
    while gx < maxx:
        pt = Point(gx + random.uniform(-3, 3), gz + random.uniform(-3, 3))
        if inside(green_t, pt):
            pr = 0.62 if inside(wood_t, pt) else 0.1
            if random.random() < pr and free(pt) and off_path(pt) and pt.distance(FC) > FOUNTAIN_R + 2: trees.append((pt.x, pt.y))
        gx += S
    gz += S
print('trees', len(trees))
lamps = []
for r in roads:
    if r['hw'] not in ('primary', 'secondary', 'tertiary', 'living_street'): continue
    L = r['line'].length; s = 12.0
    while s < L - 6:
        p0 = r['line'].interpolate(s); p1 = r['line'].interpolate(min(L, s + 1))
        dx, dz = p1.x - p0.x, p1.y - p0.y; n = math.hypot(dx, dz) or 1
        for side in (1, -1):
            ox, oz = -dz / n * side, dx / n * side
            q = Point(p0.x + ox * (r['w'] / 2 + 1.3), p0.y + oz * (r['w'] / 2 + 1.3))
            if RECT.contains(q) and free(q) and all((q.x - a) ** 2 + (q.y - b) ** 2 > 36 for a, b in trees[-400:]):
                lamps.append((q.x, q.y, math.atan2(-oz, -ox)))
        s += 32
print('lamps', len(lamps))

# ---------- wieże kościołów (heurystyka: wieża od zachodu) ----------
towers = []
for p, h, minh, kind, t in bl:
    if kind == 4 and t.get('building') in ('church', 'cathedral') and p.area > 250:
        rr = p.minimum_rotated_rectangle; cs = list(rr.exterior.coords)[:4]
        e = [(cs[i], cs[(i + 1) % 4]) for i in range(4)]
        lens = [math.dist(a, b) for a, b in e]
        i = 0 if lens[0] >= lens[1] else 1
        a, b = e[i]; ux, uz = (b[0] - a[0]) / lens[i], (b[1] - a[1]) / lens[i]
        short = lens[1 - i]; c = rr.centroid
        if ux > 0: ux, uz = -ux, -uz              # w stronę zachodu
        sz = max(5, short * 0.5)
        tx, tz = c.x + ux * (lens[i] / 2 - sz / 2 - 0.5), c.y + uz * (lens[i] / 2 - sz / 2 - 0.5)
        towers.append((tx, tz, sz, max(34, h * 2.3), math.atan2(uz, ux)))
print('towers', len(towers))

# ---------- zapis (decymetry, liczby całkowite) ----------
Q = lambda v: int(round(v * 10))
def ring(cs):
    cs = list(cs)[:-1]; out = []
    for x, z in cs: out += [Q(x), Q(z)]
    return out
def enc(g, min_area=1.0):
    return [[ring(p.exterior.coords)] + [ring(i.coords) for i in p.interiors] for p in polys(g) if p.area >= min_area]
nameset = {}
def nid(n):
    if not n: return -1
    if n not in nameset: nameset[n] = len(nameset)
    return nameset[n]
CLS = {'primary': 0, 'primary_link': 0, 'secondary': 1, 'secondary_link': 1, 'tertiary': 2, 'tertiary_link': 2, 'residential': 3, 'unclassified': 3, 'living_street': 4, 'service': 5}
road_out = []
for r in roads:
    cl = r['line'].intersection(RECT.buffer(20))
    for ln in (cl.geoms if hasattr(cl, 'geoms') else [cl]):
        if ln.is_empty or ln.geom_type != 'LineString': continue
        pts = []
        for x, z in ln.simplify(0.3).coords: pts += [Q(x), Q(z)]
        road_out.append([CLS[r['hw']], nid(r['name']), Q(r['w']), 1 if r['one'] else 0, 1 if r['bridge'] else 0] + pts)
cross_out = []
for c in crossings:
    seg = c.intersection(road_area)
    for ln in (seg.geoms if hasattr(seg, 'geoms') else [seg]):
        if ln.geom_type == 'LineString' and ln.length > 2:
            (x0, z0), (x1, z1) = ln.coords[0], ln.coords[-1]; cross_out.append([Q(x0), Q(z0), Q(x1), Q(z1)])
b_out = []
for p, h, minh, kind, t in bl:
    b_out.append([Q(h), Q(minh), kind] + ring(p.exterior.coords))
# start: jezdnia Placu Jana Pawła II najbliżej fontanny, prawy pas, 20 m przed fontanną; fontanna po prawej
cands = []
for r in roads:
    if r['name'] != 'Plac Jana Pawła II': continue
    ln = r['line']; s0 = ln.project(FC); p0 = ln.interpolate(s0)
    q0 = ln.interpolate(min(ln.length, s0 + 1)); q1 = ln.interpolate(max(0, s0 - 1))
    dx, dz = q0.x - q1.x, q0.y - q1.y
    right = (FC.x - p0.x) * -dz + (FC.y - p0.y) * dx                  # > 0: fontanna po prawej (x = wschód, z = południe)
    if right > 0: cands.append((p0.distance(FC), r))
_, sr = min(cands, key=lambda c: c[0])
ln = sr['line']; s_f = ln.project(FC)
# cofnij się o 20 m (także na poprzedni odcinek tej samej ulicy, jeśli fontanna jest blisko początku)
back = 20.0
if s_f >= back: line_s, s = ln, s_f - back
else:
    prev = [r for r in roads if r['name'] == sr['name'] and r is not sr and Point(r['line'].coords[-1]).distance(Point(ln.coords[0])) < 1]
    if prev: line_s = prev[0]['line']; s = max(2, line_s.length - (back - s_f)); sr = prev[0]
    else: line_s, s = ln, 2
p0 = line_s.interpolate(s); p1 = line_s.interpolate(min(line_s.length, s + 1))
dx, dz = p1.x - p0.x, p1.y - p0.y; n = math.hypot(dx, dz); dx, dz = dx / n, dz / n
side = sr['w'] / 4
start = [Q(p0.x - dz * side), Q(p0.y + dx * side), round(math.atan2(-dz, dx), 4)]
out = {
    'bounds': [Q(-XMAX), Q(-ZMAX), Q(XMAX), Q(ZMAX)],
    'origin': [LAT0, LON0],
    'names': list(nameset.keys()),
    'roads': road_out, 'roadArea': enc(road_area, 2), 'cobble': enc(cobble, 2), 'blocks': enc(blocks, 1),
    'yards': enc(yards, 4), 'green': enc(green, 4), 'wood': [], 'plaza': enc(plaza, 2), 'paths': enc(paths, 1),
    'water': enc(water_area, 4), 'buildings': b_out, 'towers': [[Q(a), Q(b), Q(c), Q(d_), round(e, 3)] for a, b, c, d_, e in towers],
    'trees': [v for x, z in trees for v in (Q(x), Q(z))], 'lamps': [v for x, z, a in lamps for v in (Q(x), Q(z), round(a, 2))],
    'crossings': cross_out, 'start': start,
    'kolegiata': {'ring': ring(kol_poly.exterior.coords), 'c': [Q(kol_poly.centroid.x), Q(kol_poly.centroid.y)], 'u': [round(kux, 4), round(kuz, 4)]},
    'garnizon': {'ring': ring(gar_poly.exterior.coords), 'c': [Q(GC.x), Q(GC.y)], 'u': [round(gux, 4), round(guz, 4)]},
    'fountain': {'c': [Q(FC.x), Q(FC.y)], 'tips': [[Q(x), Q(z)] for x, z in tips], 'r': Q(FOUNTAIN_R)},
    'ratusz': {'body': enc(rat_poly)[0], 'cornice': enc(cornice)[0], 'front': [Q(A[0]), Q(A[1]), Q(B[0]), Q(B[1])],
               'tower': [Q(T.x), Q(T.y), Q(tower_side)]},
}
s = json.dumps(out, separators=(',', ':'), ensure_ascii=False)
open(OUT, 'w').write(s)
print('bytes', len(s), 'start', start)
