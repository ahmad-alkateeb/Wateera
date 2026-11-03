"use client";

import React, { forwardRef } from "react";
import { useWateera } from "../../context/WateeraContext";

export const ArchCurtain = forwardRef<HTMLDivElement>((_, ref) => {
  const { lang } = useWateera();

  return (
    <div
      ref={ref}
      id="hero-arch-curtain"
      className=" absolute inset-x-0 -bottom-px z-20 h-[48vh] min-h-[340px] flex flex-col justify-end pointer-events-auto will-change-transform"
    >
      {/* Smooth Curved Arch Top Cap with Glowing Brand Gradient Border */}
      <div className="relative w-full h-[72px] sm:h-[100px] lg:h-[124px] shrink-0 -mb-px select-none pointer-events-none">
        <svg
          viewBox="0 0 1440 130"
          preserveAspectRatio="none"
          className="w-full h-full block overflow-visible"
          aria-hidden="true"
        >
          <defs>
            {/* Core 2px Arch Border Gradient: Indigo -> Mid Purple -> Bright Purple -> Pure White -> Indigo */}
            <linearGradient id="wtr-arch-border-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="22%" stopColor="#8B5CF6" />
              <stop offset="38%" stopColor="#C84BFE" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="62%" stopColor="#C84BFE" />
              <stop offset="78%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>

            {/* Soft Outer Atmospheric Glow Gradient (GPU-friendly layered stroke, zero SVG blur lag) */}
            <linearGradient id="wtr-arch-halo-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
              <stop offset="25%" stopColor="#8B5CF6" stopOpacity="0.65" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="75%" stopColor="#C84BFE" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* Pitch-Black (#000000) Solid Arch Fill */}
          <path
            d="M -24,132 L -24,124 Q 720,-18 1464,124 L 1464,132 Z"
            fill="#000000"
          />

          {/* Layer 1: Wide Soft Ambient Halo */}
          <path
            d="M -24,124 Q 720,-18 1464,124"
            fill="none"
            stroke="url(#wtr-arch-halo-grad)"
            strokeWidth="14"
            strokeOpacity="0.18"
            vectorEffect="non-scaling-stroke"
          />

          {/* Layer 2: Tight Neon Bloom */}
          <path
            d="M -24,124 Q 720,-18 1464,124"
            fill="none"
            stroke="url(#wtr-arch-border-grad)"
            strokeWidth="5"
            strokeOpacity="0.42"
            vectorEffect="non-scaling-stroke"
          />

          {/* Layer 3: Razor-Sharp 2px Glowing Gradient Rim */}
          <path
            d="M -24,124 Q 720,-18 1464,124"
            fill="none"
            stroke="url(#wtr-arch-border-grad)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Pitch-Black (#000000) Curtain Body Hosting Stagger-Revealed Typography */}
      <div
        dir={lang === "ar" ? "rtl" : "ltr"}
        className="relative flex-1 w-full bg-[#000000] flex flex-col items-center justify-start pt-2 sm:pt-4 pb-8 px-6 text-center"
      >
        {/* Subtle inner horizon glow cast downward from the white/purple arch apex */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 46% 100% at 50% 0%, rgba(200, 75, 254, 0.14) 0%, rgba(79, 70, 229, 0.05) 55%, transparent 100%)",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-3.5 sm:gap-4">
          <span className="arch-reveal-item invisible opacity-0 inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#C84BFE]">
            {lang === "ar" ? "وتيرة • مساحة العمل من الجيل القادم" : "WATEERA • THE NEXT-GEN WORKSPACE"}
          </span>

          <h2 className="arch-reveal-item invisible opacity-0 text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-[1.12]">
            {lang === "ar"
              ? "تحكّم في عالمك الرقمي."
              : "Command Your Digital Universe."}
          </h2>

          <p className="arch-reveal-item invisible opacity-0 max-w-2xl text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed">
            {lang === "ar"
              ? "اختبر بيئة انسيابية متكيفة صُممت لأقصى درجات التركيز. أدر سير عملك بسلاسة تامة، بدعم من EVA، مرافقتك الذكية المستقلة."
              : "Experience a fluid, adaptive environment designed for absolute focus. Orchestrate your workflow seamlessly, powered by EVA, your autonomous AI companion."}
          </p>
        </div>
      </div>
    </div>
  );
});

ArchCurtain.displayName = "ArchCurtain";
