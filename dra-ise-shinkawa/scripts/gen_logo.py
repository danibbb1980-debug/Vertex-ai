"""Gera o monograma IS e os lockups do logo em SVG (texto convertido em curvas).
Logo recriado em vetor a partir de imagem de baixa resolução."""
import math, json, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

def bez(p0,p1,p2,p3,n=22):
    out=[]
    for i in range(n+1):
        t=i/n; u=1-t
        x=u**3*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t**3*p3[0]
        y=u**3*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t**3*p3[1]
        out.append((x,y))
    return out

# centro do traço do S (coordenadas do recorte ampliado)
segs=[
 ((243,99),(215,99),(180,99),(150,99)),
 ((150,99),(112,99),(92,140),(95,190)),
 ((95,190),(98,250),(160,282),(222,318)),
 ((222,318),(292,358),(318,402),(311,452)),
 ((311,452),(302,505),(242,530),(182,526)),
 ((182,526),(112,521),(62,474),(58,424)),
 ((58,424),(55,388),(68,362),(86,350)),
]
pts=[]
for s in segs:
    b=bez(*s); pts+= b if not pts else b[1:]
N=len(pts)
thin, thick = 2.6, 21
L=[0]
for i in range(1,N): L.append(L[-1]+math.dist(pts[i],pts[i-1]))
tot=L[-1]
left=[];right=[]
for i,(x,y) in enumerate(pts):
    a=pts[max(i-1,0)]; b=pts[min(i+1,N-1)]
    dx,dy=b[0]-a[0],b[1]-a[1]; d=math.hypot(dx,dy) or 1
    vert=abs(dy/d)
    w=thin+(thick-thin)*vert**3
    s=L[i]/tot
    # afina nas pontas
    taper=min(1, s/0.04 if s<0.04 else 1, (1-s)/0.05 if s>0.95 else 1)
    w=max(thin*0.8, w*(0.35+0.65*taper))
    nx,ny=-dy/d,dx/d
    left.append((x+nx*w/2,y+ny*w/2)); right.append((x-nx*w/2,y-ny*w/2))
poly=left+right[::-1]
S_path='M'+' L'.join(f'{x:.1f} {y:.1f}' for x,y in poly)+' Z'
stem='M187.6 74 L192.4 74 L192.4 452 L246 452 L246 456.5 L187.6 456.5 Z'
dot='M190 33 C194.5 40 197 44 197 47 C197 51 194 56 190 61 C186 56 183 51 183 47 C183 44 185.5 40 190 33 Z'
MONO_VB=(40,28,286,506)  # x y w h
mono_paths=[S_path,stem,dot]

def mono_svg(color,bg=None,size=None,pad=0):
    x,y,w,h=MONO_VB
    if bg:
        side=max(w,h)+pad*2
        cx=x+w/2; cy=y+h/2
        vb=f'{cx-side/2:.1f} {cy-side/2:.1f} {side:.1f} {side:.1f}'
        rect=f'<rect x="{cx-side/2:.1f}" y="{cy-side/2:.1f}" width="{side:.1f}" height="{side:.1f}" fill="{bg}"/>'
    else:
        vb=f'{x} {y} {w} {h}'; rect=''
    body=''.join(f'<path d="{p}"/>' for p in mono_paths)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">{rect}<g fill="{color}">{body}</g></svg>'

def text_path(fontfile,text,size,x,y,tracking=0,kern=None):
    f=TTFont(fontfile); gs=f.getGlyphSet(); cm=f.getBestCmap(); upm=f['head'].unitsPerEm
    sc=size/upm; out=[]; cx=x
    for i,ch in enumerate(text):
        if ch==' ':
            cx+=gs[cm[32]].width*sc+tracking; continue
        g=cm[ord(ch)]
        if kern and i in kern: cx+=kern[i]*size
        pen=SVGPathPen(gs)
        tp=TransformPen(pen,(sc,0,0,-sc,cx,y))
        gs[g].draw(tp)
        out.append(pen.getCommands())
        cx+=gs[g].width*sc+tracking
    return ' '.join(out), cx

IT='node_modules/@fontsource/italiana/files/italiana-latin-400-normal.woff2'
HK='node_modules/@fontsource/hanken-grotesk/files/hanken-grotesk-latin-600-normal.woff2'

def lockup(name_color,mono_color,sub_color,reg_color):
    # monograma a 0..H
    mx,my,mw,mh=MONO_VB
    H=200; s=H/mh
    mono=f'<g transform="translate(0 0) scale({s:.4f}) translate({-mx} {-my})" fill="{mono_color}">'+''.join(f'<path d="{p}"/>' for p in mono_paths)+'</g>'
    X=mw*s+34
    dra,_=text_path(IT,'DRA',26,X+2,52,tracking=3)
    # "WA" com ligação marcada: A recua sobre o W
    name,endx=text_path(IT,'ISE SHINKAWA',78,X,118,tracking=4,kern={11:-0.27})
    l1,e1=text_path(HK,'ESPECIALISTA EM CIRURGIA E',17.5,X+60,150,tracking=2.6)
    l2,e2=text_path(HK,'TRAUMATOLOGIA BUCOMAXILOFACIAL',17.5,X+4,174,tracking=2.6)
    reg,e3=text_path(HK,'CROSP 97439 | CROMG 33342',13,X+68,198,tracking=2.4)
    W=max(endx,e1,e2,e3)+6
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.0f} 204" role="img" aria-label="Dra. Ise Shinkawa, especialista em Cirurgia e Traumatologia Bucomaxilofacial, CROSP 97439, CROMG 33342">'
            f'{mono}<path fill="{name_color}" d="{dra}"/><path fill="{name_color}" d="{name}"/>'
            f'<path fill="{sub_color}" d="{l1} {l2}"/><path fill="{reg_color}" d="{reg}"/></svg>')

out=sys.argv[1]
INK='#0E1626'; IVORY='#F5F2EC'; CH='#B58E6A'; CHL='#D8BFA3'; CHD='#7A5A3C'
open(f'{out}/logo.svg','w').write(lockup(INK,CH,INK,CHD))
open(f'{out}/logo-marinho.svg','w').write(lockup(IVORY,CHL,IVORY,CHL))
open(f'{out}/monograma.svg','w').write(mono_svg(CH))
open(f'{out}/favicon.svg','w').write(mono_svg(CHL,bg=INK,pad=40))
json.dump({'viewBox':' '.join(map(str,MONO_VB)),'paths':mono_paths},open('src/monogram.json','w'))
print('ok')
