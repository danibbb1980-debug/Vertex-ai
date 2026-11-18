import numpy as np
from PIL import Image, ImageFilter
S=6
al=Image.open('/tmp/claude-0/alpha6.png')
# slight blur to smooth jpeg noise then threshold
al=al.filter(ImageFilter.GaussianBlur(S*0.55))
A=np.asarray(al)>118
H,W=A.shape
yy,xx=np.mgrid[0:H,0:W]
X=xx/S; Y=yy/S
top=Y<272
mono=top&(Y>=34)&(((Y<=47)&(X>=216))|(X>=258)|((X>=246)&(Y>=120)&(Y<=140)))
prof=top&~mono
for name,m in [('mono',mono),('prof',prof)]:
    img=Image.fromarray(np.where(A&m,0,255).astype('uint8'))
    img.save(f'/tmp/claude-0/{name}.bmp')
