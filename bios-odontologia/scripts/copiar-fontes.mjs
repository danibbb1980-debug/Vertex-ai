// Copia as fontes auto-hospedadas (@fontsource, subconjunto latin) para public/fonts.
import { copyFileSync, mkdirSync } from "node:fs";
const f = "node_modules/@fontsource/";
const arquivos = {
  "brygada-400.woff2": "brygada-1918/files/brygada-1918-latin-400-normal.woff2",
  "brygada-400-italic.woff2": "brygada-1918/files/brygada-1918-latin-400-italic.woff2",
  "hanken-400.woff2": "hanken-grotesk/files/hanken-grotesk-latin-400-normal.woff2",
  "hanken-600.woff2": "hanken-grotesk/files/hanken-grotesk-latin-600-normal.woff2",
};
mkdirSync("public/fonts", { recursive: true });
for (const [destino, origem] of Object.entries(arquivos)) copyFileSync(f + origem, "public/fonts/" + destino);
