import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#4f3cc9",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 120,
            height: 148,
            borderRadius: 32,
            background: "#faf9f6",
            border: "6px solid #392a99",
            marginBottom: 40,
          }}
        />
        <div style={{ display: "flex", fontSize: 96, fontWeight: 700, color: "#faf9f6" }}>flippie</div>
        <div style={{ display: "flex", marginTop: 20, fontSize: 32, color: "#e8e3fb" }}>
          Sell your phone or tablet for cash — trusted across Europe
        </div>
      </div>
    ),
    { ...size },
  );
}
