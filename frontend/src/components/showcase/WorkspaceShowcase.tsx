"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useWateera } from "../../context/WateeraContext";

gsap.registerPlugin(ScrollTrigger);

const SHOWCASE_VIDEO_URL = "/firePlace.mp4";
const DESK_BG_IMAGE =
  "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?q=80&w=2560&auto=format&fit=crop";

const VolumeOnIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M11 5 6 9H3v6h3l5 4V5z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
    <path d="M18.5 5.5a9 9 0 0 1 0 13" />
  </svg>
);

const VolumeOffIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M11 5 6 9H3v6h3l5 4V5z" />
    <path d="m22 9-6 6" />
    <path d="m16 9 6 6" />
  </svg>
);

export const WorkspaceShowcase: React.FC = () => {
  const { lang } = useWateera();

  const sectionRef = useRef<HTMLElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const monitorRef = useRef<HTMLDivElement | null>(null);
  const monitorScreenRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const captionRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isMuted, setIsMuted] = useState(true);

  // Ensure native video autoplays reliably
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay handled silently
      });
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    } else {
      setIsMuted((prev) => !prev);
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    const scene = sceneRef.current;
    const monitor = monitorRef.current;
    const glow = glowRef.current;
    const caption = captionRef.current;
    if (!section || !scene || !monitor || !glow || !caption) return;

    const ctx = gsap.context(() => {
      // Dynamic initial scale calculation: ensures the Monitor Screen div exactly fills
      // the browser viewport (100vw and 100vh) without aggressive cropping or over-zooming.
      const getInitialScale = () => {
        const monitorScreen = monitorScreenRef.current || monitorRef.current;
        if (!monitorScreen) return 2.5;
        const w = monitorScreen.offsetWidth || 1;
        const h = monitorScreen.offsetHeight || 1;
        const scaleX = window.innerWidth / w;
        const scaleY = window.innerHeight / h;
        return Math.max(scaleX, scaleY);
      };

      // Perfectly center transformOrigin on the center of the monitor screen div
      gsap.set(scene, {
        transformOrigin: "center center",
        force3D: true,
      });
      gsap.set(caption, { autoAlpha: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Zoom-out reveal: Dynamically calculated scale to exactly fit viewport -> scale: 1 (GPU accelerated)
      tl.fromTo(
        scene,
        { scale: () => getInitialScale(), force3D: true },
        { scale: 1, ease: "power3.out", duration: 0.85, force3D: true },
        0
      )
        .fromTo(glow, { autoAlpha: 0 }, { autoAlpha: 1, ease: "power2.out", duration: 0.6 }, 0.2)
        .to(caption, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.25 }, 0.72);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="workspace-showcase"
      className="relative z-40 w-full w-screen h-screen max-w-none p-0 m-0 overflow-hidden bg-black"
    >
      {/* 1. The Scene Container (Target of GSAP Scale Animation with aggressive GPU acceleration) */}
      <div
        ref={sceneRef}
        className="relative w-full h-full max-w-none p-0 m-0 overflow-hidden will-change-transform transform-gpu select-none"
        style={{
          transformOrigin: "center center",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {/* 2. Environment Image (Background Desk Scene) - w-full h-full object-cover for zero gaps at scale: 1 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={DESK_BG_IMAGE}
          alt="Wateera Calm Next-Gen Workspace Environment"
          className="w-full h-full object-cover select-none pointer-events-none"
        />

        {/* Wateera Dark/Purple Ambient Overlay Gradients */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/60 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 75% 65% at 50% 50%, rgba(200, 75, 254, 0.15) 0%, rgba(79, 70, 229, 0.09) 45%, transparent 75%)",
          }}
        />

        {/* Ambient brand atmosphere backlight behind the monitor */}
        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[58vw] max-w-[860px] aspect-video rounded-full blur-3xl opacity-60"
          style={{
            background:
              "radial-gradient(circle, rgba(200, 75, 254, 0.35) 0%, rgba(139, 92, 246, 0.2) 40%, rgba(79, 70, 229, 0.1) 70%, transparent 100%)",
          }}
        />

        {/* 3. The Monitor Video Screen (Centered at 50% 50% matching transformOrigin) */}
        <div
          ref={monitorRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[88vw] sm:w-[54vw] max-w-[800px] aspect-video rounded-lg sm:rounded-xl overflow-hidden p-[3px] sm:p-1 bg-[#15141d] border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_60px_rgba(200,75,254,0.35)] flex flex-col z-10"
        >
          {/* Monitor Screen Frame (Target measured for dynamic viewport scale) */}
          <div
            ref={monitorScreenRef}
            className="relative w-full h-full rounded-md sm:rounded-[8px] overflow-hidden bg-black ring-1 ring-white/10 shadow-inner"
          >
            {/* Native HTML5 Video with aggressive GPU composite layering for buttery smooth 60fps */}
            <video
              ref={videoRef}
              src={SHOWCASE_VIDEO_URL}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-md pointer-events-none will-change-transform transform-gpu"
              style={{
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
                WebkitFontSmoothing: "antialiased",
              }}
            />

            {/* Glossy Screen Reflection Overlay */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05]"
            />

            {/* Floating Mute / Unmute Button */}
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              className="absolute bottom-2.5 right-2.5 sm:bottom-3.5 sm:right-3.5 z-50 pointer-events-auto inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-white/90 hover:text-white bg-black/60 hover:bg-black/85 border border-white/20 hover:border-[#C84BFE]/70 backdrop-blur-md transition-all cursor-pointer shadow-[0_0_18px_rgba(200,75,254,0.35)] active:scale-95"
            >
              {isMuted ? <VolumeOffIcon /> : <VolumeOnIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Caption revealed at bottom once zoom-out settles */}
      <div
        ref={captionRef}
        dir={lang === "ar" ? "rtl" : "ltr"}
        className="pointer-events-none absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 text-center invisible"
      >
        <span className="block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#C84BFE] drop-shadow-[0_2px_12px_rgba(200,75,254,0.6)]">
          {lang === "ar" ? "استعراض مساحة العمل" : "THE WORKSPACE SHOWCASE"}
        </span>
      </div>
    </section>
  );
};
