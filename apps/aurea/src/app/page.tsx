import { Approach } from "@/components/sections/Approach";
import { ClinicTeaser } from "@/components/sections/ClinicTeaser";
import { FinalCta } from "@/components/sections/FinalCta";
import { HomeHero } from "@/components/sections/HomeHero";
import { Journey } from "@/components/sections/Journey";
import { TreatmentIndex } from "@/components/sections/TreatmentIndex";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <Approach />
      <TreatmentIndex />
      <Journey />
      <ClinicTeaser />
      <FinalCta />
    </>
  );
}
