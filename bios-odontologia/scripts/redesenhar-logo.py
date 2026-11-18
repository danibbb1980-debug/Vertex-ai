"""Redesenha o wordmark BIOS como polígonos limpos e exporta paths SVG."""
import json, math, sys
from shapely.geometry import box, Point, LineString, Polygon
from shapely.affinity import scale
from shapely.ops import unary_union

def ellipse(cx, cy, rx, ry):
    return scale(Point(cx, cy).buffer(1, 128), rx, ry)

def circle(cx, cy, r):
    return Point(cx, cy).buffer(r, 256)

# ---- B ----
stem = box(44, 50, 104, 310)
up_outer = unary_union([box(44, 50, 176, 172), ellipse(176, 111, 60, 61)])
lo_outer = unary_union([box(44, 160, 200, 310), ellipse(200, 235, 70, 75)])
up_counter = unary_union([box(104, 108, 170, 145), ellipse(170, 126.5, 12, 18.5)])
lo_counter = unary_union([box(104, 198, 194, 252), ellipse(194, 225, 16, 27)])
B = unary_union([stem, up_outer, lo_outer]).difference(up_counter).difference(lo_counter)

# ---- I ----
I = box(292, 50, 350, 310)

# ---- O + crescente (o corte) ----
OC = (516, 175)
O = circle(*OC, 140).difference(circle(*OC, 73))
gap = circle(*OC, 153)
# contorno externo do crescente: borda reta à esquerda + curva inferior
outer = Polygon(
    [(372, 200), (372, 342)]
    + [  # curva inferior (bezier amostrada)
        (
            (1 - t) ** 3 * 372 + 3 * (1 - t) ** 2 * t * 380 + 3 * (1 - t) * t ** 2 * 470 + t ** 3 * 520,
            (1 - t) ** 3 * 342 + 3 * (1 - t) ** 2 * t * 362 + 3 * (1 - t) * t ** 2 * 362 + t ** 3 * 356,
        )
        for t in [i / 40 for i in range(1, 41)]
    ]
    + [
        (
            (1 - t) ** 3 * 520 + 3 * (1 - t) ** 2 * t * 565 + 3 * (1 - t) * t ** 2 * 592 + t ** 3 * 612,
            (1 - t) ** 3 * 356 + 3 * (1 - t) ** 2 * t * 348 + 3 * (1 - t) * t ** 2 * 330 + t ** 3 * 296,
        )
        for t in [i / 40 for i in range(1, 41)]
    ]
    + [(640, 250), (640, 200)]
)
crescent = outer.difference(gap).intersection(box(372, 170, 700, 400))
# fica só a parte de baixo
crescent = crescent.intersection(box(0, OC[1], 1000, 400))

# ---- S (traço geométrico com terminais horizontais) ----
def arc(cx, cy, rx, ry, a0, a1, n=80):
    return [(cx + rx * math.cos(math.radians(a0 + (a1 - a0) * i / n)),
             cy + ry * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]

def bez(p0, p1, p2, p3, n=60):
    out = []
    for i in range(1, n + 1):
        t = i / n
        out.append(tuple((1-t)**3*p0[k] + 3*(1-t)**2*t*p1[k] + 3*(1-t)*t**2*p2[k] + t**3*p3[k] for k in range(2)))
    return out

W = 64
cx, rx = 760, 78
top_cy, ry_t = 113, 53
bot_cy, ry_b = 232, 50
center = []
center += arc(cx, top_cy, rx, ry_t, 0, -180)          # direita -> por cima -> esquerda
center += bez((cx - rx, top_cy), (cx - rx, 168), (cx + rx, 172), (cx + rx, bot_cy))
center += arc(cx, bot_cy, rx, ry_b, 0, 180)[1:]        # direita -> por baixo -> esquerda
S = LineString(center).buffer(W / 2, cap_style=2, join_style=1, resolution=64)
# terminais cortados na horizontal
S = S.difference(box(cx + rx - 40, top_cy, cx + rx + 40, top_cy + 40))
S = S.difference(box(cx - rx - 40, bot_cy - 40, cx - rx + 40, bot_cy))

parts = {"B": B, "I": I, "O": O.union(crescent) if False else O, "corte": crescent, "S": S}

def to_path(geom):
    geoms = getattr(geom, "geoms", [geom])
    d = []
    for g in geoms:
        for ring in [g.exterior, *g.interiors]:
            pts = list(ring.coords)
            # simplifica levemente
            d.append("M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts[:-1]) + "Z")
    return "".join(d)

allg = unary_union([B, I, O, crescent, S])
print("bounds", allg.bounds, file=sys.stderr)
out = {k: to_path(v.simplify(0.25)) for k, v in parts.items()}
json.dump(out, open(sys.argv[1], "w"))
