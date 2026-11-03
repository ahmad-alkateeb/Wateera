"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArchCurtain } from "./ArchCurtain";
import { FlowFieldBackground } from "./FlowFieldBackground";
import { WateeraHeroWordmark } from "./WateeraHeroWordmark";

gsap.registerPlugin(ScrollTrigger);

export const HeroSection: React.FC = () => {
  const stageRef = useRef<HTMLElement | null>(null);
  const wordmarkWrapRef = useRef<HTMLDivElement | null>(null);
  const archCurtainRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const wordmark = wordmarkWrapRef.current;
    const curtain = archCurtainRef.current;
    if (!stage || !wordmark || !curtain) return;

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

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=210%",
          pin: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

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

      // Phase 3 (0.88 -> 1.00): Short settle beat before ScrollTrigger unlocks normal page scrolling
      tl.to({}, { duration: 0.12 });
    }, stage);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={stageRef}
      id="hero"
      className="relative isolate h-screen w-full flex flex-col items-center justify-center overflow-hidden px-3 sm:px-6 lg:px-10 bg-[#000000]"
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

      {/* Layer 20: Sliding Pitch-Black Arch Curtain (stops at ~48% height below "WATEERA") */}
      <ArchCurtain ref={archCurtainRef} />
    </section>
  );
};
