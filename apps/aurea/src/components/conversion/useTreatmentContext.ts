"use client";

import { usePathname } from "next/navigation";
import { getTreatmentSummary } from "@/content/treatments";
import type { TreatmentSummary } from "@/types/treatment";

/** The treatment of the current page, when on /tratamentos/[slug]. */
export function useTreatmentContext(): TreatmentSummary | undefined {
  const pathname = usePathname();
  const match = pathname?.match(/^\/tratamentos\/([^/]+)$/);
  return match ? getTreatmentSummary(match[1]!) : undefined;
}
