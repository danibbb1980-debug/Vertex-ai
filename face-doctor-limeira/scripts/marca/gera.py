import sys, json
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

def fonte(opsz, wght):
    f = TTFont(__import__('os').environ.get('BODONI', 'bodoni-moda-latin-opsz-normal.woff2'))
    return instantiateVariableFont(f, {'opsz': opsz, 'wght': wght})

def glifo(f, ch, x, y, s=1.0):
    gs = f.getGlyphSet(); g = f.getBestCmap()[ord(ch)]
    pen = SVGPathPen(gs)
    # font y-up -> svg y-down
    tp = TransformPen(pen, (s, 0, 0, -s, x, y))
    gs[g].draw(tp)
    bp = BoundsPen(gs); gs[g].draw(bp)
    return pen.getCommands(), gs[g].width * s, bp.bounds

def texto(f, txt, x, y, s, track):
    gs = f.getGlyphSet(); cmap = f.getBestCmap(); d = []; cx = x
    for ch in txt:
        if ch == ' ':
            cx += gs[cmap[32]].width * s + track; continue
        p, w, _ = glifo(f, ch, cx, y, s); d.append(p); cx += w + track
    return ' '.join(d), cx - track - x

if __name__ == '__main__':
    f = fonte(96, 400)
    print('upm', f['head'].unitsPerEm, 'cap', f['OS/2'].sCapHeight)
    for ch in 'FD':
        p, w, b = glifo(f, ch, 0, 0); print(ch, w, b)
