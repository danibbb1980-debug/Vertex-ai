import sharp from 'sharp';
const U='referencias/prints/';
const crops=[
 ['profissional','f2e08bed-image.png',[120,471,930,1162]],
 ['profissional-sentada','a5387ab5-image.png',[418,452,752,1168]],
 ['consultorio','e4ba8c07-image.png',[127,487,1043,1558]],
 ['cafe','fe38aecd-image.png',[0,487,1170,1558]],
 ['xicara','c80cfaa7-image.png',[290,1240,600,420]],
];
for (const [n,f,[left,top,width,height]] of crops){
  const base=sharp(U+f).extract({left,top,width,height});
  await base.clone().jpeg({quality:84,mozjpeg:true}).toFile(`referencias/fotos/${n}.jpg`);
  for (const w of [480,960]) await base.clone().resize({width:Math.min(w,width)}).webp({quality:78}).toFile(`public/fotos/${n}-${w}.webp`);
  console.log(n,width,height);
}
