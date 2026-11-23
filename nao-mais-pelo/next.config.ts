import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Este app vive numa subpasta de outro repositório com lockfile próprio.
  turbopack: { root: process.cwd() },
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2560],
    // Fotos em 90: as imagens de origem já são comprimidas, 75 deixava artefatos visíveis.
    qualities: [75, 90],
  },
  // Endereços do site antigo apontam para as páginas equivalentes.
  async redirects() {
    return [
      { source: "/onde-estamos", destination: "/unidades", permanent: true },
      { source: "/seja-um-franqueado", destination: "/franquias", permanent: true },
      { source: "/quem-somos", destination: "/#manifesto", permanent: true },
      { source: "/contato", destination: "/#agendar", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        source: "/img/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
