// Gera as versões otimizadas (AVIF + WebP + PNG) das imagens de ./referencias
// em ./public. Rode com: npm run fotos
//
// Para trocar uma foto: substitua o arquivo em referencias/ mantendo o nome
// e rode o comando de novo.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const tarefas = [
  // Retratos dos profissionais (hoje: fotos de perfil do Instagram, 150 px).
  { de: "referencias/fotos/dra-poly-anderson.jpg", para: "public/fotos/dra-poly-anderson", largura: 300 },
  { de: "referencias/fotos/dr-joao-ricardo.jpg", para: "public/fotos/dr-joao-ricardo", largura: 300 },
  // Logo: recorte do logotipo oficial, fundo transparente.
  { de: "referencias/logo/logo-instituto-harmoniza.png", para: "public/marca/logo-instituto-harmoniza", largura: 411, png: true },
];

await mkdir("public/fotos", { recursive: true });
await mkdir("public/marca", { recursive: true });

for (const t of tarefas) {
  const base = sharp(t.de).resize({ width: t.largura, withoutEnlargement: false });
  await base.clone().avif({ quality: 62 }).toFile(`${t.para}.avif`);
  await base.clone().webp({ quality: 80 }).toFile(`${t.para}.webp`);
  if (t.png) await base.clone().png({ compressionLevel: 9 }).toFile(`${t.para}.png`);
  console.log("ok", t.para);
}

// Favicon e ícone a partir do símbolo do instituto (avatar do Instagram).
await sharp("referencias/logo/simbolo-avatar-instagram.jpg").resize(64).png().toFile("public/marca/favicon.png");
await sharp("referencias/logo/simbolo-avatar-instagram.jpg").resize(180).png().toFile("public/marca/apple-touch-icon.png");
console.log("ok favicon");

// Imagem de compartilhamento (og:image) 1200×630: logo oficial sobre marfim e a curva da identidade.
{
  const logo = await sharp("referencias/logo/logo-instituto-harmoniza.png").resize({ width: 520 }).toBuffer();
  const meta = await sharp(logo).metadata();
  const fundo = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <rect width="1200" height="630" fill="#f6f1ea"/>
    <g fill="none" stroke="#b08a4a" stroke-width="1.6" opacity=".8">
      <path d="M-20 470 C 220 380, 420 560, 600 470 S 980 380, 1220 470"/>
    </g>
    <line x1="520" y1="560" x2="680" y2="560" stroke="#b08a4a" stroke-width="1.2" opacity=".7"/>
    <circle cx="600" cy="552" r="7" fill="#7a5a2a"/>
    <rect x="24" y="24" width="1152" height="582" rx="18" fill="none" stroke="#1d1915" stroke-opacity=".12"/>
  </svg>`);
  await sharp(fundo)
    .composite([{ input: logo, left: Math.round((1200 - 520) / 2), top: Math.round(250 - meta.height / 2) }])
    .png({ compressionLevel: 9 })
    .toFile("public/marca/og-instituto-harmoniza.png");
  console.log("ok og-image");
}
