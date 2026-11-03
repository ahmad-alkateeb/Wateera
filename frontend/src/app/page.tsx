"use client";

import React, { useEffect, useState } from "react";
import { WateeraIntro } from "../components/intro";
import { LandingPage } from "../components/landing/LandingPage";
import { useWateera } from "../context/WateeraContext";

export default function Home() {
  const [isEvaVisible, setIsEvaVisible] = useState(true);
  const { showSplash, setShowSplash } = useWateera();

  useEffect(() => {
    const onEvaVis = (e: Event) => {
      const detail = (e as CustomEvent<{ visible: boolean }>).detail;
      if (detail) setIsEvaVisible(detail.visible);
    };
    window.addEventListener("wateera:eva-visibility-change", onEvaVis);
    return () => window.removeEventListener("wateera:eva-visibility-change", onEvaVis);
  }, []);

  return (
    <>
      {showSplash && <WateeraIntro onComplete={() => setShowSplash(false)} />}

      <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
        <LandingPage isEvaVisible={isEvaVisible} />
      </div>
    </>
  );
}
