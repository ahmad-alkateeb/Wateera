"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useWateera } from "../../context/WateeraContext";
import { ArchCurtain } from "./ArchCurtain";
import { FlowFieldBackground } from "./FlowFieldBackground";
import { WateeraHeroWordmark } from "./WateeraHeroWordmark";

gsap.registerPlugin(ScrollTrigger);

export const HeroSection: React.FC = () => {
  const { lang } = useWateera();
  const isAr = lang === "ar";

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLElement | null>(null);
  const wordmarkWrapRef = useRef<HTMLDivElement | null>(null);
  const archCurtainRef = useRef<HTMLDivElement | null>(null);
  const scrollHintRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    const wordmark = wordmarkWrapRef.current;
    const curtain = archCurtainRef.current;
    const scrollHint = scrollHintRef.current;
    if (!wrapper || !stage || !wordmark || !curtain) return;

    const ctx = gsap.context(() => {
      const revealItems = curtain.querySelectorAll(".arch-reveal-item");

      // Initial GPU-composited states (curtain tucked cleanly below viewport; typography hidden)
      gsap.set(curtain, {
        yPercent: 112,
        force3D: true,
      });
      gsap.set(wordmark, {
        yPercent: 0,
        scale: 1,
        force3D: true,
      });
      gsap.set(revealItems, {
        autoAlpha: 0,
        y: 28,
        force3D: true,
      });
      if (scrollHint) {
        gsap.set(scrollHint, {
          autoAlpha: 1,
          y: 0,
          force3D: true,
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      // Fade out the bottom "Scroll Down" hint immediately as the user starts scrolling
      if (scrollHint) {
        tl.to(
          scrollHint,
          {
            autoAlpha: 0,
            y: 20,
            duration: 0.16,
            ease: "power2.out",
          },
          0
        );
      }

      // Phase 1 (0.00 -> 0.52): Arch Curtain slides UP & STOPS at ~46-48% height right below "WATEERA"
      // while "WATEERA" glides smoothly into the upper half so both Flow Field & brand stay unobstructed.
      tl.to(
        curtain,
        {
          yPercent: 0,
          ease: "power2.inOut",
          duration: 0.52,
        },
        0
      ).to(
        wordmark,
        {
          y: () => -window.innerHeight * 0.17,
          scale: 0.9,
          ease: "power2.inOut",
          duration: 0.52,
        },
        0
      );

      // Phase 2 (0.54 -> 0.88): Arch stays stopped at ~48% height while typography stagger-fades in
      tl.to(
        revealItems,
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.3,
          ease: "power2.out",
        },
        0.54
      );

      // Phase 3 (0.88 -> 1.00): Short settle beat before sticky container finishes
      tl.to({}, { duration: 0.12 });
    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full h-[300vh] bg-[#000000]">
      <section
        ref={stageRef}
        id="hero"
        className="sticky top-0 isolate h-screen w-full flex flex-col items-center justify-center overflow-hidden px-3 sm:px-6 lg:px-10 bg-[#000000]"
      >
        {/* Layer -1: Pinned 8,000-Particle Additive Silk Flow Field (top half remains visible & live) */}
        <FlowFieldBackground
          particleCount={8000}
          noiseScale={0.001}
          speed={0.6}
          trailFadeAlpha={0.015}
          cursorRadius={250}
        />

        {/* Layer 10: Monumental "WATEERA" Centerpiece Typography */}
        <div
          ref={wordmarkWrapRef}
          className="relative z-10 w-full flex items-center justify-center will-change-transform"
        >
          <WateeraHeroWordmark />
        </div>

        {/* Layer 15: Bottom-Center "Scroll Down" Indicator with Dual Stacked Animated Chevrons */}
        <style>{`
          @keyframes wtrChevronCascade {
            0%, 100% {
              opacity: 0.28;
              transform: translate3d(0, -3px, 0);
            }
            50% {
              opacity: 1;
              transform: translate3d(0, 4px, 0);
            }
          }
          .wtr-chevron-1 {
            animation: wtrChevronCascade 1.7s ease-in-out infinite;
          }
          .wtr-chevron-2 {
            animation: wtrChevronCascade 1.7s ease-in-out 0.24s infinite;
          }
        `}</style>
        <button
          ref={scrollHintRef}
          type="button"
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight * 1.15,
              behavior: "smooth",
            });
          }}
          aria-label="Scroll Down"
          className="group absolute bottom-7 sm:bottom-9 left-1/2 -translate-x-1/2 z-15 flex flex-col items-center gap-1.5 cursor-pointer select-none bg-transparent border-0 outline-none"
        >
          <span className="text-[11px] sm:text-xs font-mono font-medium uppercase tracking-[0.28em] text-white/80 group-hover:text-white transition-colors duration-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            {isAr ? "مرّر للأسفل // SCROLL DOWN" : "SCROLL DOWN"}
          </span>

          {/* Two Stacked Downward Chevrons */}
          <div className="flex flex-col items-center -space-y-2.5 pt-0.5 filter drop-shadow-[0_2px_8px_rgba(200,75,254,0.55)]">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              className="wtr-chevron-1 text-white/85 group-hover:text-white transition-colors"
              aria-hidden="true"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              className="wtr-chevron-2 text-[#DFD8F2] group-hover:text-[#C84BFE] transition-colors"
              aria-hidden="true"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>

        {/* Layer 20: Sliding Pitch-Black Arch Curtain (stops at ~48% height below "WATEERA") */}
        <ArchCurtain ref={archCurtainRef} />
      </section>
    </div>
  );
};
