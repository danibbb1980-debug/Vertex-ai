import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { CONFIG } from "./src/config";
import { faviconSvg, headTags, naoEncontradaHtml, privacidadeHtml } from "./scripts/paginas";

/** Injeta SEO/noindex no index.html e emite páginas estáticas, favicon e cabeçalhos. */
function biosSite(): Plugin {
  return {
    name: "bios-site",
    transformIndexHtml(html) {
      if (/localhost|127\.0\.0\.1/.test(CONFIG.siteUrl)) {
        throw new Error("CONFIG.siteUrl não pode apontar para localhost.");
      }
      return html.replace("<!--HEAD-->", headTags());
    },
    generateBundle() {
      const emit = (fileName: string, source: string | Uint8Array) =>
        this.emitFile({ type: "asset", fileName, source });
      emit("privacidade.html", privacidadeHtml());
      emit("404.html", naoEncontradaHtml());
      emit("favicon.svg", faviconSvg());
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === "/favicon.svg") {
          res.setHeader("Content-Type", "image/svg+xml");
          res.end(faviconSvg());
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), biosSite()],
  build: { target: "es2020", cssMinify: true, assetsInlineLimit: 0 },
});
