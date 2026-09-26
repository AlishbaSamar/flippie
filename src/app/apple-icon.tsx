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
          background: "#faf9f6",
        }}
      >
        <svg viewBox="0 0 72 92" width="140" height="179">
          <ellipse cx="36" cy="89" rx="17" ry="3" fill="#14121f" opacity="0.08" />
          <line x1="26" y1="80" x2="24" y2="88" stroke="#4f3cc9" strokeWidth="9" strokeLinecap="round" />
          <line x1="46" y1="80" x2="48" y2="88" stroke="#4f3cc9" strokeWidth="9" strokeLinecap="round" />
          <line x1="12" y1="46" x2="4" y2="60" stroke="#4f3cc9" strokeWidth="9" strokeLinecap="round" />
          <rect x="10" y="4" width="52" height="80" rx="15" fill="#4f3cc9" stroke="#392a99" strokeWidth="2" />
          <rect x="16.5" y="12" width="39" height="52" rx="7" fill="#faf9f6" />
          <circle cx="27" cy="35" r="3.1" fill="#14121f" />
          <circle cx="45" cy="35" r="3.1" fill="#14121f" />
          <path d="M25 45 Q36 54 47 45" stroke="#14121f" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <circle cx="36" cy="72" r="3" fill="none" stroke="#392a99" strokeWidth="2" opacity="0.6" />
          <line x1="58" y1="46" x2="65" y2="30" stroke="#4f3cc9" strokeWidth="9" strokeLinecap="round" />
          <rect x="60" y="16" width="15" height="23" rx="3.5" fill="#392a99" transform="rotate(8 67.5 27.5)" />
          <rect x="62" y="18.5" width="11" height="15.5" rx="1.6" fill="#faf9f6" transform="rotate(8 67.5 27.5)" />
          <circle cx="65" cy="24" r="1.3" fill="#f2b84b" transform="rotate(8 67.5 27.5)" />
          <circle cx="69" cy="24" r="1.3" fill="#1baf7a" transform="rotate(8 67.5 27.5)" />
          <circle cx="65" cy="28" r="1.3" fill="#2a78d6" transform="rotate(8 67.5 27.5)" />
          <circle cx="69" cy="28" r="1.3" fill="#e87ba4" transform="rotate(8 67.5 27.5)" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
