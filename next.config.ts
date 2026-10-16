import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  /*
    Projeto próprio do Studio VIP na Vercel: o build roda com
    STUDIO_VIP_STANDALONE=1 e a raiz passa a servir a landing page do estúdio.
    No projeto da Vertex a variável não existe e nada muda.
  */
  async rewrites() {
    // beforeFiles: precisa vencer o app/page.tsx da Vertex, que também responde em "/".
    return {
      beforeFiles:
        process.env.STUDIO_VIP_STANDALONE === "1"
          ? [{ source: "/", destination: "/studio-vip" }]
          : [],
      afterFiles: [],
      fallback: [],
    };
  },
  images: {
    formats: ["image/avif", "image/webp"],
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
