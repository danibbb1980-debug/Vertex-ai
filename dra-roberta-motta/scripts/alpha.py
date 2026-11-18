import numpy as np, sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGB')
a=np.asarray(im).astype(float)
bg=np.array([73,26,80.]); gold=np.array([178,158,112.])
d=gold-bg
t=((a-bg)@d)/(d@d)
t=np.clip(t,0,1)
al=Image.fromarray((t*255).astype('uint8'))
S=int(sys.argv[3]) if len(sys.argv)>3 else 6
al=al.resize((al.width*S,al.height*S),Image.LANCZOS)
al.save(sys.argv[2])
