import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#4f3cc9",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 104,
            height: 128,
            borderRadius: 24,
            background: "#faf9f6",
            border: "6px solid #392a99",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", left: 26, top: 52, width: 14, height: 14, borderRadius: 999, background: "#14121f" }} />
          <div style={{ position: "absolute", right: 26, top: 52, width: 14, height: 14, borderRadius: 999, background: "#14121f" }} />
          <div
            style={{
              position: "absolute",
              left: 30,
              top: 74,
              width: 44,
              height: 22,
              borderBottom: "6px solid #14121f",
              borderRadius: "0 0 22px 22px",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
