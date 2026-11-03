"use client";

import React from "react";
import { useWateera } from "../../context/WateeraContext";
import { Eva } from "../eva";
import { HeroSection } from "../hero";
import { WorkspaceShowcase } from "../showcase";
import { Navbar } from "./Navbar";
import { WorkspaceContinuation } from "./WorkspaceContinuation";

interface LandingPageProps {
  isEvaVisible?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ isEvaVisible = true }) => {
  const { lang } = useWateera();

  return (
    <div
      id="wateera-landing-root"
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="relative min-h-screen w-full bg-[#000000] text-[#F8FAFC] overflow-x-clip"
    >
      <Navbar isEvaVisible={isEvaVisible} />

      <main id="wateera-landing-main" className="relative w-full bg-[#000000]">
        <HeroSection />
        <WorkspaceContinuation />
        <WorkspaceShowcase />
      </main>

      {/* Mounted outside GSAP's pinned transform stage so position: fixed viewport coordinates stay exact */}
      <Eva />
    </div>
  );
};
