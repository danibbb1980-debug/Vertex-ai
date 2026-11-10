import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { existsSync } from "node:fs";
import { cabecalhoSeo } from "./src/lib/seo";

/** Injeta título, metas, canonical, Open Graph e JSON-LD gerados a partir de src/config.ts. */
function seo(): Plugin {
  return {
    name: "phd-seo",
    transformIndexHtml(html) {
      return html.replace("<!--seo-->", cabecalhoSeo({ temImagemOg: existsSync("public/og-image.png") }));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
  build: { cssCodeSplit: false },
  // Preact com camada de compatibilidade: mesma API do React, ~4x menos JavaScript
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom/client": "preact/compat/client",
      "react-dom/server": "preact/compat/server",
      "react-dom": "preact/compat",
      "react/jsx-runtime": "preact/jsx-runtime",
    },
  },
  ssr: { noExternal: ["preact", "preact-render-to-string"] },
});
