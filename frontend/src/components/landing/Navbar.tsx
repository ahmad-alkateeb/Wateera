"use client";

import React from "react";
import { useWateera } from "../../context/WateeraContext";
import { toggleEvaTeleport } from "../eva";

interface NavbarProps {
  isEvaVisible?: boolean;
  onToggleEva?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isEvaVisible = false,
  onToggleEva,
}) => {
  const { lang, setLang } = useWateera();

  return (
    <header
      id="landing-navbar"
      dir="ltr"
      className="fixed top-0 left-0 right-0 z-50 w-full bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 grid grid-cols-1 md:grid-cols-3 items-center bg-transparent">
        {/* Left: Empty column spacer to keep center links balanced on desktop */}
        <div className="hidden md:block" aria-hidden="true" />

        {/* Center: Pure Floating Text Navigation Links (No Icons/Emojis) */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center justify-center bg-transparent"
        >
          <div className="flex items-center gap-7 lg:gap-9 bg-transparent">
            <a
              href="#hero"
              className="py-1.5 bg-transparent text-xs lg:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              {lang === "ar" ? "المقدمة" : "Intro"}
            </a>

            <a
              href="#eva-showcase"
              className="py-1.5 bg-transparent text-xs lg:text-sm font-semibold text-slate-300 hover:text-[#C84BFE] transition-colors"
            >
              {lang === "ar" ? "بوابة EVA" : "EVA Stage"}
            </a>

            <a
              href="#meet-eva"
              className="py-1.5 bg-transparent text-xs lg:text-sm font-semibold text-slate-300 hover:text-[#C84BFE] transition-colors"
            >
              {lang === "ar" ? "مميزات EVA" : "EVA Features"}
            </a>

            <a
              href="#platform-features"
              className="py-1.5 bg-transparent text-xs lg:text-sm font-semibold text-slate-300 hover:text-[#C84BFE] transition-colors"
            >
              {lang === "ar" ? "المميزات" : "Features"}
            </a>
          </div>
        </nav>

        {/* Right: Pure Floating Text Controls (EVA + Language Switcher Only) */}
        <div className="flex items-center justify-end gap-5 sm:gap-6 bg-transparent">
          <button
            type="button"
            id="nav-eva-beam-toggle"
            onClick={() => {
              if (onToggleEva) {
                onToggleEva();
              } else {
                toggleEvaTeleport();
              }
            }}
            title={
              isEvaVisible
                ? lang === "ar"
                  ? "إخفاء EVA مؤقتاً"
                  : "Dismiss EVA"
                : lang === "ar"
                  ? "استدعاء EVA"
                  : "Summon EVA"
            }
            className={`py-1.5 bg-transparent text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              isEvaVisible
                ? "text-[#C84BFE] hover:text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            EVA
          </button>

          <button
            type="button"
            id="nav-lang-toggle"
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="py-1.5 bg-transparent text-xs sm:text-sm font-bold text-slate-300 hover:text-[#C84BFE] transition-colors cursor-pointer"
          >
            {lang === "ar" ? "EN" : "AR"}
          </button>
        </div>
      </div>
    </header>
  );
};
