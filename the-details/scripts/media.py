import sys
from PIL import Image, ImageFilter
U=sys.argv[1]; OUT=sys.argv[2]
items=[('36392785','suv-preto-frente'),('cea36d4d','suv-preto-capo'),('474d1a04','motor-depois'),('f6fc39c3','motor-antes'),
('71ad68ec','compacto-frente'),('7c7ccbc2','compacto-grade'),('ce95bb90','compacto-lanterna'),('3e664218','suv-branco-frente'),
('495c5bb1','suv-branco-traseira'),('ffac208f','suv-branco-lateral'),('2da3a87d','suv-branco-farol'),
('0628c503','suv-grafite-frente'),('70240938','suv-grafite-interior'),('732b1529','suv-grafite-noite'),('d47d7885','suv-grafite-grade')]
for h,name in items:
    im=Image.open(f'{U}/{h}-image.png').convert('RGB')
    if h=='732b1529':
        box=(620,1915,780,2000); im.paste(im.crop(box).filter(ImageFilter.GaussianBlur(14)),box[:2])
    im=im.crop((0,150,1170,2200))
    for w in (560,1100):
        r=im.resize((w,round(w*im.height/im.width)),Image.LANCZOS)
        r.save(f'{OUT}/{name}-{w}.webp',quality=78,method=6)
    print(name, im.size)
