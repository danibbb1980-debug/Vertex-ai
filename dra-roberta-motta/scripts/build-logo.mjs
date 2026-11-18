// Gera o logotipo recriado (vetores do emblema + texto "DRA. ROBERTA MOTTA" em Bellefair convertido em curvas)
import fs from 'fs'; import opentype from 'opentype.js'; import sharp from 'sharp';
const MONO=fs.readFileSync('/tmp/claude-0/mono.d','utf8'), PROF=fs.readFileSync('/tmp/claude-0/prof.d','utf8');
const buf=fs.readFileSync('node_modules/@fontsource/bellefair/files/bellefair-latin-400-normal.woff');
const font=opentype.parse(buf.buffer.slice(buf.byteOffset,buf.byteOffset+buf.byteLength));
// small caps: inicial maior, demais menores
function word(str,x,base,big,small,track){
  let d='',cx=x;
  [...str].forEach((ch,i)=>{const s=i===0?big:small;const p=font.getPath(ch,cx,base,s);d+=p.toPathData(2);cx+=font.getAdvanceWidth(ch,s)+track;});
  return {d,w:cx-x-track};
}
function measure(str,big,small,track){return word(str,0,0,big,small,track).w}
// Linha 1: "DRA." pequeno + ROBERTA ; Linha 2: MOTTA (proporções do original)
const big=86, small=64, track=7;
const wR=measure('ROBERTA',big,small,track), wM=measure('MOTTA',big,small,track);
const dra=word('DRA.',0,0,30,30,3).w;
const cx=350; // eixo do emblema
const l1x=cx-(wR+dra+10)/2+ dra+10;
const r=word('ROBERTA',l1x,358,big,small,track);
const d1=word('DRA.',l1x-dra-10,358,30,30,3);
const m=word('MOTTA',cx-wM/2+18,478,big,small,track);
const TEXT=d1.d+r.d+m.d;
// versão em linha única para o cabeçalho
const la=word('DRA.',0,64,30,30,3); const lb=word('ROBERTA',la.w+14,64,big,small,track); const lc=word('MOTTA',la.w+14+lb.w+30,64,big,small,track);
const LINHA=la.d+lb.d+lc.d; const LINHA_W=Math.ceil(la.w+14+lb.w+30+lc.w);
const VB_FULL='128 -2 456 490', VB_MARK='130 0 445 266';
fs.writeFileSync('src/brand/marca.ts',`// Gerado por scripts/build-logo.mjs a partir de referencias/logo-original.jpg. Não edite à mão.
export const MONOGRAMA = ${JSON.stringify(MONO)};
export const PERFIL_RAMO = ${JSON.stringify(PROF)};
export const LOGOTIPO_TEXTO = ${JSON.stringify(TEXT)};
export const VB_COMPLETO = '${VB_FULL}';
export const LOGOTIPO_LINHA = ${JSON.stringify(LINHA)};
export const VB_LINHA = '0 0 ${LINHA_W} 66';
export const VB_MARCA = '${VB_MARK}';
`);
const svg=(fill,bg,vb,parts,w,h)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"${w?` width="${w}" height="${h}"`:''}>${bg?`<rect x="-1000" y="-1000" width="3000" height="3000" fill="${bg}"/>`:''}<g fill="${fill}">${parts.map(p=>`<path d="${p}"/>`).join('')}</g></svg>`;
const OURO='#B39C6B', AMEIXA='#24132A';
fs.mkdirSync('public/marca',{recursive:true});
fs.writeFileSync('public/marca/logo-dourado.svg',svg(OURO,null,VB_FULL,[MONO,PROF,TEXT]));
fs.writeFileSync('public/marca/logo-ameixa.svg',svg(AMEIXA,null,VB_FULL,[MONO,PROF,TEXT]));
fs.writeFileSync('public/favicon.svg',svg(OURO,AMEIXA,'205 -10 375 375',[MONO]));
await sharp(Buffer.from(svg(OURO,AMEIXA,'205 -10 375 375',[MONO],180,180))).png().toFile('public/apple-touch-icon.png');
await sharp(Buffer.from(svg(OURO,AMEIXA,'205 -10 375 375',[MONO],48,48))).png().toFile('public/favicon-48.png');
// Prévia em 2x (checagem de nitidez) e imagem de compartilhamento
await sharp(Buffer.from(svg(OURO,'#491A50',VB_FULL,[MONO,PROF,TEXT],1860,1960))).png().toFile('/tmp/claude-0/logo-2x.png');
const og=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="${AMEIXA}"/><svg x="380" y="40" width="440" height="550" viewBox="${VB_FULL}"><g fill="${OURO}"><path d="${MONO}"/><path d="${PROF}"/><path d="${TEXT}"/></g></svg></svg>`;
await sharp(Buffer.from(og)).png().toFile('public/og.png');
console.log('ok', wR, wM);
