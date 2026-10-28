import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { tagsSeo } from "./seo.ts";

export default defineConfig({
  plugins: [
    preact({ prerender: { enabled: false } }),
    tailwindcss(),
    {
      name: "seo-a-partir-do-config",
      transformIndexHtml: (html) => html.replace("<!--seo-->", tagsSeo()),
    },
  ],
  // lucide-react importa "react": no build de servidor ele precisa passar pelo alias do Preact
  ssr: { noExternal: ["lucide-react"] },
  build: {
    target: "es2022",
    cssCodeSplit: false,
  },
});
