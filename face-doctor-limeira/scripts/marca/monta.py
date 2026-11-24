import math
from gera import *

def bez(p0,p1,p2,p3,t):
    u=1-t; return tuple(u**3*a+3*u*u*t*b+3*u*t*t*c+t**3*d for a,b,c,d in zip(p0,p1,p2,p3))
SEG=[((2048,1010),(1830,1235),(1360,1318),(1050,1342)),
     ((1050,1342),(790,1362),(690,1560),(702,1760)),
     ((702,1760),(712,1890),(800,1934),(980,1929))]
def laco(w0, w1):
    pts=[]
    for si,s in enumerate(SEG):
        for i in range(40):
            t=i/40; pts.append(bez(*s,t))
    pts.append(SEG[-1][3])
    n=len(pts); L=[];R=[]
    for i,(x,y) in enumerate(pts):
        a=pts[max(0,i-1)]; b=pts[min(n-1,i+1)]
        dx,dy=b[0]-a[0],b[1]-a[1]; m=math.hypot(dx,dy) or 1
        nx,ny=-dy/m,dx/m
        t=i/(n-1)
        # contraste à la Bodoni: fino nas pontas, cheio na curva da esquerda
        w=w0+(w1-w0)*max(0,math.sin(math.pi*min(1,t*1.15)))**1.5
        L.append((x+nx*w/2,y+ny*w/2)); R.append((x-nx*w/2,y-ny*w/2))
    poly=L+R[::-1]
    return 'M'+' L'.join(f'{x:.0f} {y:.0f}' for x,y in poly)+'Z'

def monograma(opsz, wght, w0, w1, rponto):
    f=fonte(opsz,wght); DX,DY=915,429
    F,_,_=glifo(f,'F',0,1500); D,_,_=glifo(f,'D',DX,1500+DY)
    return f'<path d="{F}"/><path d="{D}"/><circle cx="329" cy="1795" r="{rponto}"/><path d="{laco(w0,w1)}"/>'
VB=(-3,-40,2275,2029)
def svg(conteudo, vb=VB, extra=''):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{" ".join(str(round(v,1)) for v in vb)}" fill="currentColor"{extra}>{conteudo}</svg>'

mono=monograma(96,400,16,46,52)
mono_p=monograma(11,620,40,80,80)
open('monograma.svg','w').write(svg(mono))
open('monograma-pequeno.svg','w').write(svg(mono_p))

fl=fonte(11,400)
_,w1=texto(fl,'FACE DOCTOR',0,0,0.165,95)
_,w2=texto(fl,'LIMEIRA',0,0,0.1,175)
W=2275; LW=max(w1,W)+160; cx=LW/2
off=cx-(-3+W/2)
ty1=1989+400; ty2=ty1+300
t1,_=texto(fl,'FACE DOCTOR',cx-w1/2,ty1,0.165,95)
t2,_=texto(fl,'LIMEIRA',cx-w2/2+88,ty2,0.1,175)  # +100 compensa o tracking final
H=ty2+80
comp=svg(f'<g transform="translate({off:.1f} 0)">{mono}</g><path d="{t1}"/><path d="{t2}"/>',(0,-120,LW,H+120))
open('logo-completo.svg','w').write(comp)
print(LW,H)
