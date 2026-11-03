"use client";

import React, { useEffect, useRef } from "react";
import { WATEERA_LOGO_RIBBONS } from "./introPaths";
import { IntroStyles } from "./IntroStyles";

interface WateeraIntroProps {
  onComplete: () => void;
}

export function WateeraIntro({ onComplete }: WateeraIntroProps) {
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onCompleteRef.current();
    }, 3250);
    return () => clearTimeout(timer);
  }, []);

  const ribbons = [
    { d: WATEERA_LOGO_RIBBONS.archOuterPath, cls: "wtr-ribbon-1", wOut: 22, wIn: 7 },
    { d: WATEERA_LOGO_RIBBONS.mainRibbonUpperPath, cls: "wtr-ribbon-2", wOut: 22, wIn: 7 },
    { d: WATEERA_LOGO_RIBBONS.mainRibbonLowerPath, cls: "wtr-ribbon-3", wOut: 22, wIn: 7 },
    { d: WATEERA_LOGO_RIBBONS.bottomOuterWPath, cls: "wtr-ribbon-4", wOut: 22, wIn: 7 },
    { d: WATEERA_LOGO_RIBBONS.checkmarkSwooshPath, cls: "wtr-ribbon-5", wOut: 18, wIn: 6 },
  ];

  return (
    <div
      onClick={() => onCompleteRef.current()}
      onAnimationEnd={(e) => {
        if (e.animationName === "wtrOverlayLifecycle") {
          onCompleteRef.current();
        }
      }}
      className="wtr-intro-overlay fixed inset-0 z-[150] flex flex-col items-center justify-center bg-[#060314] overflow-hidden select-none cursor-pointer"
    >
      <IntroStyles />

      <div
        className="wtr-glow-orb absolute w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(217,70,239,0.34) 0%, rgba(130,62,235,0.20) 45%, transparent 75%)",
        }}
      />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onCompleteRef.current();
        }}
        className="fixed bottom-7 right-7 z-[170] px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 text-xs font-bold border border-white/20 backdrop-blur-md transition-all cursor-pointer"
      >
        تخطي المقدمة / Skip ➔
      </button>

      <div className="wtr-logo-stage relative w-[360px] h-[230px] sm:w-[600px] sm:h-[380px] flex items-center justify-center">
        <svg viewBox="0 0 1000 620" className="w-full h-full overflow-visible" fill="none">
          <defs>
            <linearGradient id="wtrOuterGrad" x1="0%" y1="15%" x2="95%" y2="85%">
              <stop offset="0%" stopColor="#E84CFF" />
              <stop offset="35%" stopColor="#B845FA" />
              <stop offset="70%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#4338CA" />
            </linearGradient>
            <linearGradient id="wtrInnerHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5B8FF" />
              <stop offset="50%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
            <filter id="wtrGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {ribbons.map((r, i) => (
            <g key={i}>
              <path
                d={r.d}
                pathLength={1}
                stroke="url(#wtrOuterGrad)"
                strokeWidth={r.wOut}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#wtrGlow)"
                className={r.cls}
              />
              <path
                d={r.d}
                pathLength={1}
                stroke="url(#wtrInnerHighlight)"
                strokeWidth={r.wIn}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={r.cls}
              />
            </g>
          ))}

          <path
            d={WATEERA_LOGO_RIBBONS.smallArrowheadPath}
            pathLength={1}
            stroke="url(#wtrOuterGrad)"
            strokeWidth={12}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#wtrGlow)"
            className="wtr-ribbon-5"
          />
        </svg>
      </div>

      <div className="wtr-subtitle-anim mt-3 text-center pointer-events-none px-4">
        <span className="text-[10px] sm:text-xs tracking-[0.26em] sm:tracking-[0.34em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#F062FF] via-[#A855F7] to-[#6366F1] font-bold">
          WATEERA • THE NEXT-GEN WORKSPACE
        </span>
      </div>
    </div>
  );
}
