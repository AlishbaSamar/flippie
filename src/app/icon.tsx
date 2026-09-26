import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 7,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 18,
            height: 22,
            borderRadius: 4,
            background: "#faf9f6",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", left: 4, top: 9, width: 2.5, height: 2.5, borderRadius: 999, background: "#14121f" }} />
          <div style={{ position: "absolute", right: 4, top: 9, width: 2.5, height: 2.5, borderRadius: 999, background: "#14121f" }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
