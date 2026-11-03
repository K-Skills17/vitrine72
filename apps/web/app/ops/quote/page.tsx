import type { Metadata } from "next";
import { QuoteClient } from "@/components/ops/QuoteClient";

export const metadata: Metadata = { title: "Cotação | Ops" };

export default function QuotePage() {
  return <QuoteClient />;
}
