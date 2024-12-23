import React from "react";

import HeroSection from "./_component/hero";
import CompaniesLogo from "./_component/logocarousel";
import CallToAction from "./_component/cta";
import Footer from "./_component/footer";

const LandingPage = () => {
  return (
    <div>
      <HeroSection />
      <CompaniesLogo />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default LandingPage;
