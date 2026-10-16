import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Studio VIP — treinamento personalizado em Poços de Caldas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function dataUri(file: string, mime: string): Promise<string> {
  const buffer = await readFile(join(process.cwd(), "public", "studio-vip", file));
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

/** Imagem de compartilhamento (WhatsApp, redes), gerada no build com a foto real da equipe. */
export default async function OpengraphImage() {
  const [team, logo] = await Promise.all([
    dataUri("equipe.jpg", "image/jpeg"),
    dataUri("logo.png", "image/png"),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "linear-gradient(135deg, #022a46 0%, #04375a 45%, #064875 100%)",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: 600,
          padding: "0 0 0 64px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} width={96} height={104} alt="" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 36,
            fontSize: 64,
            fontWeight: 800,
            fontStyle: "italic",
            lineHeight: 1,
            letterSpacing: -1,
            textTransform: "uppercase",
          }}
        >
          <span>Seu treino.</span>
          <span>Sua rotina.</span>
          <span style={{ color: "#83c832" }}>Sua evolução.</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 32, fontSize: 22 }}>
          <div style={{ width: 6, height: 34, background: "#83c832", marginRight: 16 }} />
          Treinamento personalizado em Poços de Caldas
        </div>
      </div>
      <div
        style={{
          display: "flex",
          position: "absolute",
          right: 0,
          top: 0,
          width: 600,
          height: 630,
          overflow: "hidden",
          borderBottomLeftRadius: 160,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={team}
          width={935}
          height={630}
          alt=""
          style={{ position: "absolute", left: -175, top: 0 }}
        />
      </div>
    </div>,
    size,
  );
}
