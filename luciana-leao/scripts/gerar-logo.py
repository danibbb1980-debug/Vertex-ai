import math, json, sys, os, re
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = sys.argv[1]
FR = ROOT + "/node_modules/@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2"
AB = ROOT + "/node_modules/@fontsource/alex-brush/files/alex-brush-latin-400-normal.woff2"

def text_path(font, text, size, x0=0, y0=0, tracking=0):
    gs = font.getGlyphSet(); cmap = font.getBestCmap(); upm = font['head'].unitsPerEm
    s = size / upm; pen = SVGPathPen(gs); x = 0
    for ch in text:
        gn = cmap[ord(ch)]
        tp = TransformPen(pen, (s, 0, 0, -s, x0 + x * s, y0))
        gs[gn].draw(tp)
        x += gs[gn].width + tracking
    d = re.sub(r"-?\d+\.\d+", lambda m: f"{float(m.group()):.1f}".rstrip("0").rstrip("."), pen.getCommands())
    return d, (x - tracking) * s

fr = TTFont(FR)
axes = {a.axisTag: a for a in fr['fvar'].axes}
loc = {"wght": 600}
if "opsz" in axes: loc["opsz"] = 24
for t in ("SOFT", "WONK"):
    if t in axes: loc[t] = axes[t].defaultValue
fr = instantiateVariableFont(fr, loc)
ab = TTFont(AB)

def cubic(p, t):
    (x0,y0),(x1,y1),(x2,y2),(x3,y3) = p; u = 1-t
    return (u**3*x0+3*u*u*t*x1+3*u*t*t*x2+t**3*x3, u**3*y0+3*u*u*t*y1+3*u*t*t*y2+t**3*y3)

def brush(p, maxw, minw=0.35, n=24, bias=0.5):
    pts = [cubic(p, i/n) for i in range(n+1)]
    L, R = [], []
    for i,(x,y) in enumerate(pts):
        a = pts[max(i-1,0)]; b = pts[min(i+1,n)]
        dx, dy = b[0]-a[0], b[1]-a[1]; d = math.hypot(dx,dy) or 1
        nx, ny = -dy/d, dx/d; t = i/n
        # peak position controlled by bias
        tt = t**(math.log(0.5)/math.log(bias)) if 0<t<1 else t
        w = minw + (maxw-minw)*math.sin(math.pi*tt)**0.9
        L.append((x+nx*w/2, y+ny*w/2)); R.append((x-nx*w/2, y-ny*w/2))
    poly = L + R[::-1]
    return "M" + "L".join(f"{x:.1f} {y:.1f}" for x,y in poly) + "Z"

def mirror(p): return [(200-x, y) for x,y in p]

strokes = [
  ([(102,88),(84,66),(82,32),(92,10)], 3.4, 0.5),
  ([(98,88),(116,66),(118,32),(112,10)], 3.4, 0.5),
  ([(100,88),(92,92),(87,108),(88,126)], 2.8, 0.45),
  ([(88,46),(62,40),(34,50),(18,68)], 1.8, 0.5),
  ([(18,68),(32,96),(66,104),(100,88)], 6.0, 0.55),
  ([(96,96),(72,100),(42,110),(24,124)], 4.8, 0.6),
  ([(24,124),(48,128),(76,118),(94,102)], 2.0, 0.5),
]
orchid = []
for i,(p,w,b) in enumerate(strokes):
    orchid.append(brush(p,w*1.45,bias=b))
    if i >= 2: orchid.append(brush(mirror(p),w*1.45,bias=b))
orchid_d = " ".join(orchid)

# Wordmark layout, viewBox 600 x 300
centro, cw = text_path(fr, "Centro de Dermatologia", 1, 0, 0)
target_cw = 430; cs = target_cw / cw
centro, cw = text_path(fr, "Centro de Dermatologia", cs, (600-target_cw)/2, 158, tracking=10)
# recompute width with tracking to center
_, cw2 = text_path(fr, "Centro de Dermatologia", cs, 0, 0, tracking=10)
centro, _ = text_path(fr, "Centro de Dermatologia", cs, (600-cw2)/2, 158, tracking=10)

_, nw = text_path(ab, "Dra. Luciana Leão", 1)
ns = 560 / nw
nome, _ = text_path(ab, "Dra. Luciana Leão", ns, 20, 236)

swoosh = brush([(6,272),(160,236),(380,282),(594,238)], 8.0, minw=0.4, n=80, bias=0.38)

# orchid placement in logo: scale 0.78, centered
osc = 0.84; ox = 300 - 100*osc; oy = 2
logo_inner = f'<g transform="translate({ox:.2f} {oy}) scale({osc})"><path d="{orchid_d}"/></g><path d="{centro}"/><path d="{nome}"/><path d="{swoosh}"/>'

def svg(fill, inner, vb="0 0 600 290", title="Centro de Dermatologia Dra. Luciana Leão"):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="{title}"><title>{title}</title><g fill="{fill}">{inner}</g></svg>\n'

pub = ROOT + "/public"; os.makedirs(pub + "/marca", exist_ok=True)
open(pub + "/marca/logo-vinho.svg","w").write(svg("#5A1E33", logo_inner))
open(pub + "/marca/logo-claro.svg","w").write(svg("#F5F0EA", logo_inner))
fav = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -6 216 150"><rect x="-8" y="-6" width="216" height="150" rx="24" fill="#F5F0EA"/><path fill="#5A1E33" d="{orchid_d}"/></svg>\n'
open(pub + "/favicon.svg","w").write(fav)
open(pub + "/marca/orquidea.svg","w").write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 140"><path fill="#5A1E33" d="{orchid_d}"/></svg>\n')

ts = f"""// Gerado por scripts/gerar-logo.py. Reprodução do logo existente da Dra. Luciana Leão,
// a partir da arte de referência. Substituir pelo arquivo original quando disponível.
export const ORQUIDEA_D = {json.dumps(orchid_d)};
export const CENTRO_D = {json.dumps(centro)};
export const NOME_D = {json.dumps(nome)};
export const SWOOSH_D = {json.dumps(swoosh)};
export const ORQUIDEA_LOGO = {{ x: {ox:.2f}, y: {oy}, s: {osc} }};
"""
open(ROOT + "/src/brand/orquideaMarca.ts","w").write("// Orquídea do logo (gerada por scripts/gerar-logo.py).\nexport const ORQUIDEA_D = " + json.dumps(orchid_d) + "\n")
print("ok", len(ts))

# Bounding boxes (for cropped viewBoxes in the horizontal header lockup)
from fontTools.pens.boundsPen import BoundsPen
def text_bounds(font, text, size, x0, y0, tracking=0):
    gs = font.getGlyphSet(); cmap = font.getBestCmap(); upm = font['head'].unitsPerEm
    s = size / upm; bp = BoundsPen(gs); x = 0
    for ch in text:
        gn = cmap[ord(ch)]
        gs[gn].draw(TransformPen(bp, (s, 0, 0, -s, x0 + x * s, y0)))
        x += gs[gn].width + tracking
    a,b,c,d = bp.bounds
    return [round(a,1), round(b,1), round(c-a,1), round(d-b,1)]
cb = text_bounds(fr, "Centro de Dermatologia", cs, (600-cw2)/2, 158, tracking=10)
nb = text_bounds(ab, "Dra. Luciana Leão", ns, 20, 236)

# Versão horizontal (cabeçalho): orquídea à esquerda, texto empilhado à direita. viewBox 414 x 72
ob = [17.9, 9.9, 164.3, 116.1]
so = 70 / ob[3]; sn = 300 / nb[2]; sc = 0.47
horiz = (f'<g transform="translate(0 1) scale({so:.4f}) translate({-ob[0]} {-ob[1]})"><path d="{orchid_d}"/></g>'
         f'<g transform="translate(114 4) scale({sc}) translate({-cb[0]} {-cb[1]})"><path d="{centro}"/></g>'
         f'<g transform="translate(110 {72 - nb[3]*sn - 1:.2f}) scale({sn:.4f}) translate({-nb[0]} {-nb[1]})"><path d="{nome}"/></g>')
open(pub + "/marca/logo-horizontal-vinho.svg","w").write(svg("#5A1E33", horiz, vb="0 0 414 72"))
open(pub + "/marca/logo-horizontal-claro.svg","w").write(svg("#F5F0EA", horiz, vb="0 0 414 72"))
