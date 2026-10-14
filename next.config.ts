import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  /*
    Projetos de cliente na Vercel apontam para este mesmo repositório e
    definem SITE_HOME (ex.: "/ailton-davila"): a raiz do domínio passa a
    abrir a landing do cliente. Sem a variável — o projeto da Vertex —, nada
    muda.
  */
  async redirects() {
    const home = process.env.SITE_HOME;
    if (!home || home === "/") return [];
    return [{ source: "/", destination: home, permanent: false }];
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
    ];
  },
};

export default nextConfig;
