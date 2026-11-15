"use client";

import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WateeraIntro } from "../components/intro";
import { LandingPage } from "../components/landing/LandingPage";
import { useWateera } from "../context/WateeraContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const { showSplash, setShowSplash } = useWateera();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (showSplash) {
      document.body.style.overflow = "hidden";

      // Wait until the Intro overlay is actively playing on screen (350ms in),
      // then scroll the underlying page up to the top and refresh all ScrollTriggers behind the Intro!
      const resetBehindIntroTimer = setTimeout(() => {
        if ("scrollRestoration" in window.history) {
          window.history.scrollRestoration = "manual";
        }
        if (window.location.hash) {
          window.history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search
          );
        }
        ScrollTrigger.clearScrollMemory?.("manual");
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        ScrollTrigger.refresh(true);
      }, 350);

      return () => {
        clearTimeout(resetBehindIntroTimer);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      requestAnimationFrame(() => {
        ScrollTrigger.refresh(true);
      });
    }
  }, [showSplash]);

  return (
    <>
      {showSplash && <WateeraIntro onComplete={() => setShowSplash(false)} />}

      <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
        <LandingPage />
      </div>
    </>
  );
}
