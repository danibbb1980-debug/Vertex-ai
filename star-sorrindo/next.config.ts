import type { NextConfig } from "next";

/**
 * Exportação estática: `npm run build` gera a pasta `out/`, um site pronto
 * para qualquer hospedagem (Vercel, Netlify, Hostinger, cPanel…), sem servidor
 * Node. Por isso não há headers() aqui — configure-os na hospedagem
 * (ver README) — e as imagens não passam pelo otimizador do Next.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  // O repositório tem outros lockfiles; fixa a raiz neste app.
  turbopack: { root: process.cwd() },
};

export default nextConfig;
