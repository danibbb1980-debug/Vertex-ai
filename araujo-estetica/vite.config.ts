import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";

/**
 * Monta a lista de mídia da seção "Trabalhos" no build, a partir de
 * public/videos/*.mp4 (pôster .webp com o mesmo nome) e public/fotos/*.
 * Pasta vazia ou ausente = lista vazia = a seção não é renderizada.
 */
function media(): Plugin {
  const id = "virtual:media";
  const read = (dir: string, re: RegExp) => {
    const d = path.resolve(import.meta.dirname, "public", dir);
    return fs.existsSync(d) ? fs.readdirSync(d).filter((f) => re.test(f)).sort() : [];
  };
  return {
    name: "araujo-media",
    resolveId: (s) => (s === id ? "\0" + id : undefined),
    load(s) {
      if (s !== "\0" + id) return;
      const videos = read("videos", /\.mp4$/i).slice(0, 3).map((f) => {
        const base = f.replace(/\.mp4$/i, "");
        const poster = read("videos", /\.webp$/i).includes(base + ".webp") ? `/videos/${base}.webp` : "";
        return { id: base, src: `/videos/${f}`, poster };
      });
      const fotos = read("fotos", /\.(jpe?g|png|webp|avif)$/i).map((f) => ({ id: f, src: `/fotos/${f}` }));
      return `export const videos = ${JSON.stringify(videos)};\nexport const fotos = ${JSON.stringify(fotos)};`;
    },
  };
}

/** Serviços com ativo: false não entram no bundle (nem no JS publicado). */
function stripInactive(): Plugin {
  return {
    name: "araujo-strip-inactive",
    enforce: "pre",
    transform(code, id) {
      if (!id.endsWith("/src/config.ts")) return;
      return code.replace(/^\s*\{[^\n]*ativo:\s*false\s*\},?\s*$/gm, "");
    },
  };
}

export default defineConfig({
  plugins: [stripInactive(), react(), tailwindcss(), media()],
  build: { cssCodeSplit: false, assetsInlineLimit: 0 },
});
