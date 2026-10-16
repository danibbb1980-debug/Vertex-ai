import type { NextConfig } from "next";
import { site } from "./lib/site-data";

/**
 * STATIC_EXPORT=1 gera HTML estático em out/ (Netlify, por exemplo):
 * imagens sem otimização sob demanda e cabeçalhos via public/_headers.
 * Sem a variável, o build é o padrão do Next (Vercel).
 */
const staticExport = process.env.STATIC_EXPORT === "1";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Rascunho: não indexar (mesma regra de public/_headers).
  ...(site.rascunho ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : []),
];

const base: NextConfig = {
  // Há outro lockfile na raiz do repositório (site da Vertex): fixa a raiz deste app.
  turbopack: { root: process.cwd() },
};

const nextConfig: NextConfig = staticExport
  ? {
      ...base,
      reactStrictMode: true,
      output: "export",
      images: { unoptimized: true },
    }
  : {
      ...base,
      reactStrictMode: true,
      poweredByHeader: false,
      images: { formats: ["image/avif", "image/webp"] },
      async headers() {
        return [{ source: "/(.*)", headers: securityHeaders }];
      },
    };

export default nextConfig;
