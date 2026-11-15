"use client";

import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useWateera } from "../../context/WateeraContext";
import { HeroSection } from "../hero";
import { WorkspaceShowcase } from "../showcase";
import { PlatformFeatures } from "../features";
import { SummonEvaSection } from "../summon";
import { TestimonialsSection } from "../testimonials";
import { PricingPlansSection } from "../pricing";
import { FaqSection } from "../faq";
import { FooterSection } from "../footer";
import { Navbar } from "./Navbar";
import { WorkspaceContinuation } from "./WorkspaceContinuation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const LandingPage: React.FC = () => {
  const { lang } = useWateera();

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    const timerId = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, [lang]);

  return (
    <div
      id="wateera-landing-root"
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="relative min-h-screen w-full bg-[#000000] text-[#F8FAFC] overflow-x-clip"
    >
      <Navbar />

      <main id="wateera-landing-main" className="relative w-full bg-[#000000]">
        {/* 1. Hero Section (including the 6 bottom Hero cards) */}
        <div id="intro" className="scroll-mt-28">
          <HeroSection />
          <WorkspaceContinuation />
        </div>

        {/* 2. Laptop / Product Video Showcase Section */}
        <div id="showcase" className="scroll-mt-28">
          <WorkspaceShowcase />
        </div>

        {/* 3. Our Services - Accordion Section */}
        <div id="services" className="scroll-mt-28">
          <PlatformFeatures />
        </div>

        {/* 4. Who is EVA & The Mind of Wateera */}
        <div id="eva" className="scroll-mt-28">
          <SummonEvaSection />
        </div>

        {/* 5. Testimonials - 3D Rotating Cards Section */}
        <div id="testimonials" className="scroll-mt-28">
          <TestimonialsSection />
        </div>

        {/* 6. Pricing Section */}
        <div id="pricing" className="scroll-mt-28">
          <PricingPlansSection />
        </div>

        {/* 7. FAQ Section */}
        <div id="faq" className="scroll-mt-28">
          <FaqSection />
        </div>

        {/* 8. Final CTA & Footer */}
        <FooterSection />
      </main>
    </div>
  );
};
