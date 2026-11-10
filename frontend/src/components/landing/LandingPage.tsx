"use client";

import React, { useState } from "react";
import { useWateera } from "../../context/WateeraContext";
import { HeroSection } from "../hero";
import { WorkspaceShowcase } from "../showcase";
import { PlatformFeatures } from "../features";
import { SummonEvaSection } from "../summon";
import { WhyChooseImpactSection } from "../impact";
import { PricingPlansSection } from "../pricing";
import { ProcessHowItWorksSection } from "../process";
import { TestimonialsSection } from "../testimonials";
import { FaqSection } from "../faq";
import { FooterSection } from "../footer";
import { Eva, toggleEvaTeleport } from "../eva";
import { Navbar } from "./Navbar";
import { WorkspaceContinuation } from "./WorkspaceContinuation";

interface LandingPageProps {
  isEvaVisible?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ isEvaVisible = true }) => {
  const { lang } = useWateera();
  const [isEvaActive, setIsEvaActive] = useState<boolean>(false);

  const handleToggleEva = () => {
    if (!isEvaActive) {
      setIsEvaActive(true);
    } else {
      toggleEvaTeleport();
    }
  };

  return (
    <div
      id="wateera-landing-root"
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="relative min-h-screen w-full bg-[#000000] text-[#F8FAFC] overflow-x-clip"
    >
      <Navbar
        isEvaVisible={isEvaActive && isEvaVisible}
        onToggleEva={handleToggleEva}
      />

      {isEvaActive && <Eva />}

      <main id="wateera-landing-main" className="relative w-full bg-[#000000]">
        <HeroSection />
        <WorkspaceContinuation />
        <WorkspaceShowcase />
        <PlatformFeatures />
        <SummonEvaSection />
        <WhyChooseImpactSection />
        <ProcessHowItWorksSection />
        <PricingPlansSection />
        <TestimonialsSection />
        <FaqSection />
        <FooterSection />
      </main>
    </div>
  );
};
