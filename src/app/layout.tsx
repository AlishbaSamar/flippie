import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITLE = "flippie — Sell your phone or tablet for cash";
const DESCRIPTION =
  "flippie buys your used iPhone, iPad, or Samsung Galaxy S phone directly and resells trusted, tested refurbished devices across Europe.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Every page sets its own full "... — flippie" title explicitly (no template),
  // since child pages already append the suffix themselves.
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "sell iPhone",
    "sell iPad",
    "sell Samsung Galaxy",
    "trade in phone",
    "refurbished iPhone",
    "refurbished devices Europe",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "flippie",
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_IE",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
