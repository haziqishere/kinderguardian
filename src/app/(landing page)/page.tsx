import React from "react";

import HeroSection from "./_component/hero-section";
import TechSection from "./_component/tecnicalFeature";
import CompaniesLogo from "./_component/logocarousel";
import FeaturesSection from "./_component/feature-section";
import CallToAction from "./_component/cta";
import Footer from "./_component/footer";
import FAQ from "./_component/faq";
import Bento from "@/components/bento";

const LandingPage = () => {
  return (
    <div className="relative">
      <HeroSection />
      <FeaturesSection />

      <TechSection />
      <CallToAction />
      <div className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-16 text-center text-4xl font-bold">
            Technical Implementation
          </h2>
          <Bento />
        </div>
      </div>
      <CompaniesLogo />
      <FAQ />
      <Footer />
    </div>
  );
};

export default LandingPage;
