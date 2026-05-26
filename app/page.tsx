import { Suspense } from "react";
import SearchHero from "@/components/SearchHero";
import ServiceGrid from "@/components/ServiceGrid";
import HowItWorks from "@/components/HowItWorks";

export default function HomePage() {
  return (
    <>
      {/* SearchHero reads `?service=` via useSearchParams(). Next.js
          requires that hook to live inside a Suspense boundary in
          production builds, otherwise static page generation throws. */}
      <Suspense>
        <SearchHero />
      </Suspense>
      <ServiceGrid />
      <HowItWorks />
    </>
  );
}
