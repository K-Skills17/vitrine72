import type { Metadata } from "next";
import { config } from "@/lib/config";
import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";
import ReviewsStrip from "@/components/ReviewsStrip";
import AboutSection from "@/components/AboutSection";
import FAQAccordion from "@/components/FAQAccordion";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: config.businessName,
  description: config.copyBlocks.heroSubheadline,
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesGrid limit={3} />
      {config.gbpData && config.gbpData.reviews.length > 0 && <ReviewsStrip />}
      <AboutSection />
      <FAQAccordion limit={3} />
      <ContactSection />
    </>
  );
}
