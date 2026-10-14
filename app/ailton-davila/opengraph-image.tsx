import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { ailton, ratingLabel } from "@/lib/ailton";

export const alt = `${ailton.name} — ${ailton.role} em ${ailton.city}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem de compartilhamento gerada no build, com a foto real do Ailton. */
export default async function OpengraphImage() {
  const photo = await readFile(join(process.cwd(), "public/ailton/ailton-davila-academia.jpg"));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#090909",
        color: "#f5f3ef",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 18,
            letterSpacing: 4,
            color: "#a3a3a3",
          }}
        >
          <div style={{ width: 40, height: 2, background: "#c6f36b" }} />
          {`PERSONAL TRAINER | ${ailton.city.toUpperCase()} — ${ailton.state}`}
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 92,
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: -2,
          }}
        >
          AILTON
        </div>
        <div
          style={{
            fontSize: 92,
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: -2,
            color: "#c6f36b",
          }}
        >
          D’AVILA
        </div>
        <div
          style={{ marginTop: 36, fontSize: 30, lineHeight: 1.35, color: "#f5f3ef", maxWidth: 560 }}
        >
          Seu próximo nível começa com o treino certo.
        </div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 22,
            color: "#a3a3a3",
          }}
        >
          <div style={{ display: "flex", gap: 4 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <svg key={i} width="24" height="24" viewBox="0 0 20 20" fill="#c6f36b">
                <path d="M10 1.5l2.6 5.5 6 .7-4.5 4.1 1.2 5.9L10 14.8l-5.3 2.9 1.2-5.9L1.4 7.7l6-.7z" />
              </svg>
            ))}
          </div>
          {`${ratingLabel} no Google · ${ailton.google.reviewCount} avaliações`}
        </div>
      </div>
      <div style={{ width: 400, height: "100%", display: "flex", position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoSrc}
          width={400}
          height={630}
          style={{ width: 400, height: 630, objectFit: "cover", objectPosition: "50% 30%" }}
          alt=""
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "linear-gradient(90deg, #090909 0%, rgba(9,9,9,0) 45%)",
          }}
        />
      </div>
    </div>,
    size,
  );
}
