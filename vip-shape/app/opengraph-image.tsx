import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site-data";

export const alt = `${site.name} — academia em ${site.city} – ${site.state}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem de compartilhamento gerada no build, com uma foto real da unidade. */
export default async function OpengraphImage() {
  const photo = await readFile(join(process.cwd(), "public/images/area-cardio.jpg"));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#090909", color: "#fff" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 720, padding: "64px 72px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="56" height="61" viewBox="0 0 120 130">
              <path d="M110 36 60 7 10 36v58l50 29 50-29" fill="none" stroke="#ff5a1f" strokeWidth="8" />
              <rect x="37" y="49" width="7" height="32" fill="#d9d9d9" />
              <rect x="44" y="62" width="32" height="6" fill="#d9d9d9" />
              <rect x="76" y="49" width="7" height="32" fill="#d9d9d9" />
            </svg>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: 1 }}>VIP SHAPE</span>
              <span style={{ fontSize: 14, letterSpacing: 8, color: "#b8b8b8" }}>ACADEMIA</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 20, letterSpacing: 5, color: "#ff5a1f", fontWeight: 700 }}>
              {`${site.city.toUpperCase()} • ${site.state}`}
            </span>
            <span style={{ fontSize: 76, fontWeight: 800, lineHeight: 0.95, marginTop: 18, letterSpacing: -2 }}>
              SEU PRÓXIMO
            </span>
            <span style={{ fontSize: 76, fontWeight: 800, lineHeight: 0.95, color: "#ff5a1f", letterSpacing: -2 }}>
              NÍVEL COMEÇA AQUI.
            </span>
          </div>
          <span style={{ fontSize: 22, color: "#b8b8b8" }}>Musculação • Hit Dance • Dança • Jump</span>
        </div>
        <div style={{ display: "flex", position: "relative", width: 480, height: "100%" }}>
          <img src={photoSrc} width={480} height={630} style={{ objectFit: "cover", width: 480, height: 630 }} alt="" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #090909 0%, rgba(9,9,9,0) 45%)" }} />
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 8, background: "#ff5a1f" }} />
        </div>
      </div>
    ),
    size,
  );
}
