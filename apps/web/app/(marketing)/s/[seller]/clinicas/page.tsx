import { notFound } from "next/navigation";
import type { Metadata } from "next";
import sellers from "@/../../config/sellers.json";
import { ClinicPage } from "@/components/clinicas/ClinicPage";

export const revalidate = 3600;

interface Props {
  params: Promise<{ seller: string }>;
}

export const metadata: Metadata = {
  robots: { index: false },
  alternates: { canonical: "/clinicas" },
};

/** Seller-tracked copy of /clinicas: records the seller like /s/[seller] does. */
export default async function SellerClinicasPage({ params }: Props) {
  const { seller: sellerId } = await params;
  const seller = (sellers.sellers as Array<{ id: string }>).find((s) => s.id === sellerId);
  if (!seller) notFound();

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.cookie = "v72_source=${encodeURIComponent(`seller:${sellerId}`)}; path=/; max-age=${30 * 24 * 3600}; SameSite=Lax";`,
        }}
      />
      <ClinicPage />
    </>
  );
}
