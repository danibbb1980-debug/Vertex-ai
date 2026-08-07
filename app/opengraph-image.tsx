import { ImageResponse } from "next/og";
import { site, brl } from "@/lib/site";

export const alt = `${site.name} — site profissional por assinatura`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Generated at build time — no static asset to keep in sync with the copy. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #06060a 0%, #14101f 55%, #1b1440 100%)",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
          <div
            style={{
              width: 40,
              height: 40,
              background: "linear-gradient(135deg, #4f46e5, #a78bfa)",
              clipPath: "polygon(50% 0%, 100% 100%, 70% 100%, 50% 62%, 30% 100%, 0% 100%)",
            }}
          />
          <div style={{ fontSize: 28, fontWeight: 600 }}>Vertex Web Studios</div>
        </div>

        <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.1, letterSpacing: -2 }}>
          Seu site profissional
        </div>
        <div
          style={{
            fontSize: 66,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -2,
            background: "linear-gradient(90deg, #a78bfa, #7c6cf6)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          sem o alto custo inicial.
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 56 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              padding: "16px 28px",
              borderRadius: 999,
              background: "linear-gradient(90deg, #4f46e5, #7c6cf6)",
            }}
          >
            <span style={{ fontSize: 34, fontWeight: 700 }}>{brl(site.price)}</span>
            <span style={{ fontSize: 22, opacity: 0.85 }}>/mês</span>
          </div>
          <div style={{ fontSize: 24, color: "#a7a7b4" }}>
            {`Sem fidelidade · Sem taxa de setup · No ar em ${site.launchDays} dias`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
