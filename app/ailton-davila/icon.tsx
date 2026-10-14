import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Favicon da landing do Ailton: monograma AD em verde-limão sobre preto. */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#090909",
        color: "#c6f36b",
        fontSize: 18,
        fontWeight: 800,
        letterSpacing: -1,
        fontFamily: "sans-serif",
      }}
    >
      AD
    </div>,
    size,
  );
}
