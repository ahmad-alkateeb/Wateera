"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useWateera } from "../../context/WateeraContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type SectionId = "intro" | "services" | "eva" | "testimonials" | "pricing" | "faq";

interface NavItem {
  id: SectionId;
  labelEn: string;
  labelAr: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "intro", labelEn: "Home", labelAr: "الرئيسية" },
  { id: "services", labelEn: "Services", labelAr: "خدماتنا" },
  { id: "eva", labelEn: "Meet EVA", labelAr: "تعرف على EVA" },
  { id: "testimonials", labelEn: "Reviews", labelAr: "آراء العملاء" },
  { id: "pricing", labelEn: "Pricing", labelAr: "الأسعار" },
  { id: "faq", labelEn: "FAQ", labelAr: "الأسئلة الشائعة" },
];

export const Navbar: React.FC = () => {
  const { lang, setLang } = useWateera();
  const isAr = lang === "ar";
  const [activeSection, setActiveSection] = useState<SectionId>("intro");
  const [showLogo, setShowLogo] = useState<boolean>(false);

  // Accurate ScrollSpy & Scroll-Triggered Logo Visibility
  useEffect(() => {
    const updateOnScroll = () => {
      if (typeof window === "undefined") return;

      // Reveal top-left logo only after scrolling past the initial Flow Field screen
      // (as the glowing horizon arc / Hero content reveals)
      const shouldShowLogo = window.scrollY >= window.innerHeight * 0.45;
      setShowLogo((prev) => (prev === shouldShowLogo ? prev : shouldShowLogo));

      const triggerLine = window.innerHeight * 0.36;
      let currentActive: SectionId = "intro";

      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerLine) {
          currentActive = item.id;
        }
      }

      setActiveSection((prev) => (prev === currentActive ? prev : currentActive));
    };

    updateOnScroll();
    window.addEventListener("scroll", updateOnScroll, { passive: true });
    window.addEventListener("resize", updateOnScroll, { passive: true });
    ScrollTrigger.addEventListener("refresh", updateOnScroll);

    return () => {
      window.removeEventListener("scroll", updateOnScroll);
      window.removeEventListener("resize", updateOnScroll);
      ScrollTrigger.removeEventListener("refresh", updateOnScroll);
    };
  }, []);

  // Custom GSAP/ScrollTrigger-aware smooth scroll handler
  const scrollToSection = useCallback((sectionId: SectionId) => {
    if (typeof window === "undefined") return;

    setActiveSection(sectionId);
    ScrollTrigger.refresh();

    if (sectionId === "intro") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const targetEl = document.getElementById(sectionId);
    if (!targetEl) return;

    const NAVBAR_OFFSET = 100;
    const isZeroOffsetSection =
      sectionId === "services" ||
      sectionId === "testimonials" ||
      sectionId === "eva" ||
      (sectionId === "pricing" && window.innerWidth >= 1024);

    const rect = targetEl.getBoundingClientRect();
    const rawTop = window.scrollY + rect.top;
    const targetTop = Math.max(0, isZeroOffsetSection ? rawTop : rawTop - NAVBAR_OFFSET);

    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });
  }, []);

  return (
    <header
      id="landing-navbar"
      dir={isAr ? "rtl" : "ltr"}
      className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-none pt-3 sm:pt-4 px-4 sm:px-6 lg:px-8"
    >
      {/* Top Viewport Fade Mask (Scroll Guard) behind Logo & Navbar Pill */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 right-0 h-24 w-full bg-gradient-to-b from-[#050505] via-[#050505]/70 to-transparent -z-10"
      />

      <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-between gap-3 pointer-events-none">
        {/* Start Side: Official Wateera Logo (Hidden on initial Flow Field screen, reveals on scroll) */}
        <div className="flex-1 flex items-center justify-start pointer-events-none">
          <button
            type="button"
            onClick={() => scrollToSection("intro")}
            aria-label="Back to top"
            style={{
              opacity: showLogo ? 1 : 0,
              transform: showLogo
                ? "translateY(0px) scale(1)"
                : "translateY(-8px) scale(0.85)",
              pointerEvents: showLogo ? "auto" : "none",
            }}
            className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full bg-[#050505]/75 backdrop-blur-md border border-white/10 hover:border-[#C84BFE]/45 shadow-[0_10px_30px_rgba(0,0,0,0.65)] transition-all duration-500 ease-out cursor-pointer group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Wateera Logo"
              className="h-7 sm:h-8 w-auto object-contain select-none transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        </div>

        {/* Center: Glassmorphic Navigation Bar with Sliding Cyber Glass Pill (Desktop & Tablet) */}
        <nav
          aria-label="Main Navigation"
          className="pointer-events-auto hidden md:flex items-center gap-1 lg:gap-1.5 px-2 py-1.5 rounded-full bg-[#050505]/75 backdrop-blur-md border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.65)]"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={`relative px-4 py-1.5 rounded-full text-xs lg:text-sm transition-colors duration-300 cursor-pointer ${
                  isActive
                    ? "text-white font-semibold"
                    : "text-white/60 hover:text-white/90 font-medium"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-pill"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 32,
                    }}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-[#C84BFE]/25 to-[#4F46E5]/10 border border-[#C84BFE]/40 shadow-[0_0_20px_rgba(200,75,254,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] after:content-[''] after:absolute after:top-0 after:left-1/4 after:right-1/4 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-white/80 after:to-transparent"
                  />
                )}
                <span className="relative z-10">{isAr ? item.labelAr : item.labelEn}</span>
              </button>
            );
          })}
        </nav>

        {/* End Side: Language Switcher Pill (AR / EN) + Log In Button */}
        <div className="pointer-events-auto flex-1 flex items-center justify-end gap-2 sm:gap-2.5">
          <button
            type="button"
            id="nav-lang-toggle"
            onClick={() => setLang(isAr ? "en" : "ar")}
            className="inline-flex items-center justify-center px-3.5 sm:px-4 py-2 rounded-full bg-[#050505]/75 backdrop-blur-md border border-white/10 hover:border-[#C84BFE]/50 text-xs sm:text-sm font-bold text-slate-200 hover:text-[#C84BFE] shadow-lg transition-all duration-300 cursor-pointer"
          >
            {isAr ? "EN" : "AR"}
          </button>

          <button
            type="button"
            id="nav-login-btn"
            className="inline-flex items-center justify-center px-4 sm:px-5 py-2 rounded-full bg-gradient-to-b from-[#C84BFE]/25 to-[#8B5CF6]/15 hover:from-[#C84BFE]/35 hover:to-[#8B5CF6]/25 backdrop-blur-md border border-[#C84BFE]/45 hover:border-[#C84BFE]/75 text-xs sm:text-sm font-semibold text-white whitespace-nowrap shadow-[0_0_20px_rgba(200,75,254,0.28),inset_0_1px_1px_rgba(255,255,255,0.35)] hover:shadow-[0_0_28px_rgba(200,75,254,0.45)] transition-all duration-300 cursor-pointer"
          >
            {isAr ? "تسجيل الدخول" : "Log In"}
          </button>
        </div>
      </div>

      {/* Mobile Compact Scrollable Navigation Strip */}
      <div className="md:hidden mt-2.5 flex justify-center pointer-events-none">
        <nav
          aria-label="Mobile Navigation"
          className="pointer-events-auto flex items-center gap-1 px-2 py-1 rounded-full bg-[#050505]/75 backdrop-blur-md border border-white/10 shadow-lg max-w-full overflow-x-auto no-scrollbar"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`relative px-3 py-1 rounded-full text-[11px] whitespace-nowrap transition-colors duration-300 cursor-pointer ${
                  isActive
                    ? "text-white font-semibold"
                    : "text-white/60 hover:text-white/90 font-medium"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-pill-mobile"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 32,
                    }}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-[#C84BFE]/25 to-[#4F46E5]/10 border border-[#C84BFE]/40 shadow-[0_0_20px_rgba(200,75,254,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)]"
                  />
                )}
                <span className="relative z-10">{isAr ? item.labelAr : item.labelEn}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
