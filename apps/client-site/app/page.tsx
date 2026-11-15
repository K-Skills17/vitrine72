import type { Metadata } from "next";
import { config } from "@/lib/config";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Reviews from "@/components/sections/Reviews";
import About from "@/components/sections/About";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: { absolute: config.businessName },
  description: config.copyBlocks.heroSubheadline,
};

/**
 * Section order follows the builder's layoutVariant:
 * 1 standard · 2 services-first · 3 story-first.
 */
const orders: Record<number, Array<"services" | "reviews" | "about" | "faq">> = {
  1: ["services", "reviews", "about", "faq"],
  2: ["services", "about", "reviews", "faq"],
  3: ["about", "services", "reviews", "faq"],
};

const sections = {
  services: <Services key="services" limit={4} />,
  reviews: <Reviews key="reviews" />,
  about: <About key="about" />,
  faq: <Faq key="faq" limit={4} />,
};

export default function HomePage() {
  const order = orders[config.layoutVariant] ?? orders[1]!;
  return (
    <>
      <Hero />
      {order.map((name) => sections[name])}
      <Contact />
    </>
  );
}
