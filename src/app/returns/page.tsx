import type { Metadata } from "next";
import { ReturnLookup } from "@/components/returns/ReturnLookup";

export const metadata: Metadata = {
  title: "Start a return — flippie",
  description: "Request a return or refund for a device you bought from flippie.",
  alternates: { canonical: "/returns" },
};

export default function ReturnsPage() {
  return <ReturnLookup />;
}
