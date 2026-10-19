import type { Metadata } from "next";
import { CookieBanner } from "@/components/CookieBanner";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <CookieBanner />
    </>
  );
}
