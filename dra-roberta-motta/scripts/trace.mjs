import potrace from 'potrace'; import fs from 'fs';
const S=6;
for (const n of ['mono','prof']) {
  await new Promise(r=>potrace.trace(`/tmp/claude-0/${n}.bmp`,{turdSize:60,optTolerance:0.8,alphaMax:1.0,threshold:128},(e,svg)=>{
    if(e) throw e; const d=svg.match(/ d="([^"]+)"/)[1];
    // scale to original coordinates
    const sd=d.replace(/-?\d+(\.\d+)?/g,v=>(+v/S).toFixed(2).replace(/\.?0+$/,''));
    fs.writeFileSync(`/tmp/claude-0/${n}.d`,sd); console.log(n,sd.length); r();}));
}
