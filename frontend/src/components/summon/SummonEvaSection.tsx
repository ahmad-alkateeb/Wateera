"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useWateera } from "../../context/WateeraContext";
import { EvaSplineViewer } from "../eva/EvaSplineViewer";
import { syncSplineEyeMeshes } from "../eva/EvaEmotions";
import { SplineRuntimeApp } from "../eva/evaTypes";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const EVA_BASE_PITCH_X = 0.15;
const EVA_HERO_SIZE = 600; // Larger 3D canvas viewport so EVA's bottom tail is never clipped by the frustum
const EVA_3D_SCALE = 0.84; // Slightly smaller inside 3D camera space to give generous bottom margin in canvas
const EVA_3D_OFFSET_Y = 22; // Lift slightly inside 3D camera space so bottom tail stays well inside canvas
const TRACKING_DELAY_MS = 1000; // 1-second delay before cursor look-at activates on section enter

// --- Bilingual Content (English & Arabic) ---
const WHOS_EVA_CONTENT = {
  badge: {
    en: "WHO'S EVA // AUTONOMOUS CORE",
    ar: "من هي EVA // النواة الذاتية الذكية",
  },
  title: {
    en: "The Mind of Wateera",
    ar: "العقل المدبّر لمنصة وتيرة",
  },
  phase1: {
    point1Title: {
      en: "01 // SILENT PARTNER",
      ar: "01 // الشريك الصامت",
    },
    point1Body: {
      en: "More than a digital assistant, EVA is the silent partner powering your workday. She exists to remove friction, learning your rhythms to create an environment where deep focus is the default.",
      ar: "أكثر من مجرد مساعد رقمي؛ إيفا هي الشريك الصامت الذي يقود يوم عملك بذكاء. صُممت لإزالة أي عوائق، حيث تتعلم إيقاع عملك لتبتكر بيئة يكون فيها التركيز العميق هو الأساس.",
    },
    point2Title: {
      en: "02 // SMART FLOW",
      ar: "02 // التدفق الذكي",
    },
    point2Body: {
      en: "She autonomously balances your Smart Hours and development workflows. By anticipating your next move, EVA eliminates administrative clutter, letting you stay immersed in your code.",
      ar: "توازن إيفا تلقائياً بين ساعات عملك الذكية ومسارات التطوير البرمجية. ومن خلال استباق خطوتك التالية، تقضي على الفوضى الإدارية لتبقيك منغمساً بالكامل في كتابة الكود.",
    },
  },
  phase2: {
    point3Title: {
      en: "03 // INVISIBLE PRECISION",
      ar: "03 // دقة غير مرئية",
    },
    point3Body: {
      en: "Security is handled with invisible precision. EVA’s context-aware protocols and dual-layer verification protect your sessions continuously, ensuring ironclad privacy without interrupting your flow.",
      ar: "يُدار الأمان بدقة خفية فائقة؛ فبروتوكولات إيفا الواعية بالسياق والتحقق الثنائي يحميان جلساتك باستمرار، مما يضمن خصوصية صارمة دون مقاطعة تدفق عملك.",
    },
    point4Title: {
      en: "04 // HUMAN ELEMENT",
      ar: "04 // البُعد الإنساني",
    },
    point4Body: {
      en: "She even manages the human element. From evaluating the Points Matrix to syncing your HR dashboard, EVA tracks your streaks fairly and resolves disputes—all in the background.",
      ar: "تعتني إيفا حتى بالجانب الإنساني؛ فمن تقييم مصفوفة النقاط إلى مزامنة لوحة الموارد البشرية، تتبع سلاسل إنجازاتك بعدالة وتفصل في الاعتراضات بسلاسة تامة في الخلفية.",
    },
  },
};

/**
 * Splits paragraph text into word spans so words reveal neatly and gradually one by one
 * in reading order while keeping Arabic cursive ligatures 100% intact.
 */
const renderGradualWords = (text: string, wordClass: string): React.ReactNode[] => {
  const words = text.split(" ");
  return words.map((word, idx) => (
    <React.Fragment key={`${wordClass}-${idx}`}>
      <span
        className={`${wordClass} inline-block will-change-[transform,opacity,filter]`}
      >
        {word}
      </span>
      {idx < words.length - 1 ? " " : ""}
    </React.Fragment>
  ));
};

interface SummonEvaSectionProps {
  onSummonComplete?: () => void;
}

export const SummonEvaSection: React.FC<SummonEvaSectionProps> = ({
  onSummonComplete,
}) => {
  const { lang } = useWateera();
  const isAr = lang === "ar";

  const onSummonCompleteRef = useRef(onSummonComplete);
  useEffect(() => {
    onSummonCompleteRef.current = onSummonComplete;
  }, [onSummonComplete]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleWrapRef = useRef<HTMLDivElement | null>(null);

  // Floating Plain Text Refs (Phase 1: 01 & 02 | Phase 2: 03 & 04)
  const point01Ref = useRef<HTMLDivElement | null>(null);
  const point02Ref = useRef<HTMLDivElement | null>(null);
  const point03Ref = useRef<HTMLDivElement | null>(null);
  const point04Ref = useRef<HTMLDivElement | null>(null);

  const splineAppRef = useRef<SplineRuntimeApp | null>(null);

  // Dynamic 3D orientation ref (Pitch X, Yaw Y, Roll/Bank Z)
  const rot3DRef = useRef({
    x: EVA_BASE_PITCH_X,
    y: 0,
    z: 0,
  });

  // Target 3D orientation for cursor look-at
  const targetRotRef = useRef({
    x: EVA_BASE_PITCH_X,
    y: 0,
    z: 0,
  });

  // Smooth blend weight (0 -> 1) so cursor tracking engages smoothly after the 1s delay
  const trackingBlendRef = useRef({ weight: 0 });

  // Blinking state refs
  const blinkScaleRef = useRef<number>(1.0);
  const blinkRafRef = useRef<number | null>(null);

  // Lifecycle & state flags
  const isTrackingActiveRef = useRef<boolean>(false);
  const hasPhase1RevealedRef = useRef<boolean>(false);
  const trackingDelayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Continuous GSAP ticker (60/120fps) with responsive 1s-delayed cursor tracking (damping: 0.12)
  // Also enforces transparent scene background every single frame so a gray box can never appear.
  useEffect(() => {
    const updateRig = () => {
      const app = splineAppRef.current;
      if (!app) return;

      if (app._scene?.activePage?.bgColor) {
        app._scene.activePage.bgColor.a = 0;
      }
      if (app._renderer) {
        app._renderer.clearAlphaOverride = 0;
        app._renderer.setClearAlpha?.(0);
      }

      const rigObj = app.findObjectByName?.("EVA");
      if (!rigObj) return;

      if (isTrackingActiveRef.current) {
        const blend = trackingBlendRef.current.weight;
        const desiredX =
          EVA_BASE_PITCH_X + (targetRotRef.current.x - EVA_BASE_PITCH_X) * blend;
        const desiredY = targetRotRef.current.y * blend;
        const desiredZ = targetRotRef.current.z * blend;

        const damping = 0.12;
        rot3DRef.current.x += (desiredX - rot3DRef.current.x) * damping;
        rot3DRef.current.y += (desiredY - rot3DRef.current.y) * damping;
        rot3DRef.current.z += (desiredZ - rot3DRef.current.z) * damping;
      } else {
        rot3DRef.current.x = EVA_BASE_PITCH_X;
        rot3DRef.current.y = 0;
        rot3DRef.current.z = 0;
      }

      rigObj.position.x = 0;
      rigObj.position.y = EVA_3D_OFFSET_Y;
      rigObj.position.z = 0;
      rigObj.scale.x = EVA_3D_SCALE;
      rigObj.scale.y = EVA_3D_SCALE;
      rigObj.scale.z = EVA_3D_SCALE;
      rigObj.rotation.x = rot3DRef.current.x;
      rigObj.rotation.y = rot3DRef.current.y;
      rigObj.rotation.z = rot3DRef.current.z;
      app._requestRenderAutoMode?.();
    };

    gsap.ticker.add(updateRig);
    return () => {
      gsap.ticker.remove(updateRig);
    };
  }, []);

  // Ambient smooth eye blinking every ~12-14 seconds
  useEffect(() => {
    let blinkTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let isCancelled = false;

    const triggerBlink = () => {
      if (blinkRafRef.current !== null) {
        cancelAnimationFrame(blinkRafRef.current);
      }
      const blinkDuration = 180;
      const startTime = performance.now();

      const animateBlink = (now: number) => {
        const progress = Math.min(1, (now - startTime) / blinkDuration);
        blinkScaleRef.current = 1.0 - 0.92 * Math.sin(progress * Math.PI);

        if (splineAppRef.current) {
          syncSplineEyeMeshes(splineAppRef.current, false, blinkScaleRef.current);
        }

        if (progress < 1) {
          blinkRafRef.current = requestAnimationFrame(animateBlink);
        } else {
          blinkScaleRef.current = 1.0;
          blinkRafRef.current = null;
          if (splineAppRef.current) {
            syncSplineEyeMeshes(splineAppRef.current, false, 1.0);
          }
        }
      };

      blinkRafRef.current = requestAnimationFrame(animateBlink);
    };

    const scheduleNextBlink = () => {
      if (isCancelled) return;
      const delay = Math.floor(12000 + Math.random() * 2000);
      blinkTimeoutId = setTimeout(() => {
        if (isCancelled) return;
        if (isTrackingActiveRef.current) {
          triggerBlink();
        }
        scheduleNextBlink();
      }, delay);
    };

    scheduleNextBlink();

    return () => {
      isCancelled = true;
      if (blinkTimeoutId) clearTimeout(blinkTimeoutId);
      if (blinkRafRef.current) cancelAnimationFrame(blinkRafRef.current);
      if (trackingDelayTimerRef.current) clearTimeout(trackingDelayTimerRef.current);
    };
  }, []);

  // Cursor Look-At handler: active after the 1000ms delay
  const handleSectionMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isTrackingActiveRef.current) return;
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width * 0.42)));
    const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height * 0.42)));

    targetRotRef.current.y = normX * 0.52;
    targetRotRef.current.x = EVA_BASE_PITCH_X + normY * 0.25;
    targetRotRef.current.z = -normX * 0.09;
  };

  const handleSectionMouseLeave = () => {
    targetRotRef.current.y = 0;
    targetRotRef.current.x = EVA_BASE_PITCH_X;
    targetRotRef.current.z = 0;
  };

  // Neat, Gradual Word-by-Word Reveal Animation + Compact 2-Phase Scroll Timeline
  useEffect(() => {
    const container = containerRef.current;
    const point01 = point01Ref.current;
    const point02 = point02Ref.current;
    const point03 = point03Ref.current;
    const point04 = point04Ref.current;

    if (!container || !point01 || !point02 || !point03 || !point04) {
      return;
    }

    hasPhase1RevealedRef.current = false;

    const ctx = gsap.context(() => {
      const tag01 = point01.querySelector(".eva-point-tag");
      const line01 = point01.querySelector(".eva-point-line");
      const words01 = point01.querySelectorAll(".p1-word");

      const tag02 = point02.querySelector(".eva-point-tag");
      const line02 = point02.querySelector(".eva-point-line");
      const words02 = point02.querySelectorAll(".p2-word");

      const tag03 = point03.querySelector(".eva-point-tag");
      const line03 = point03.querySelector(".eva-point-line");
      const words03 = point03.querySelectorAll(".p3-word");

      const tag04 = point04.querySelector(".eva-point-tag");
      const line04 = point04.querySelector(".eva-point-line");
      const words04 = point04.querySelectorAll(".p4-word");

      // Initial state for Phase 1 plain text (ready for neat, gradual word-by-word reveal)
      gsap.set([point01, point02], { autoAlpha: 1, x: 0, y: 0, filter: "blur(0px)" });
      gsap.set([tag01, tag02], { opacity: 0, y: 16, filter: "blur(5px)" });
      gsap.set([line01, line02], { scaleX: 0, opacity: 0 });
      gsap.set([words01, words02], { opacity: 0, y: 12, filter: "blur(4px)" });

      // Initial state for Phase 2 plain text (hidden until scroll transition)
      gsap.set([point03, point04], { autoAlpha: 0, x: 0, y: 0, filter: "blur(0px)" });
      gsap.set([tag03, tag04], { opacity: 0, y: 16, filter: "blur(5px)" });
      gsap.set([line03, line04], { scaleX: 0, opacity: 0 });
      gsap.set([words03, words04], { opacity: 0, y: 12, filter: "blur(4px)" });

      // Gradual, Ordered Word-by-Word Reveal for Phase 1 Text (01 then 02) right as section locks in view
      const revealPhase1Text = () => {
        if (hasPhase1RevealedRef.current) return;
        hasPhase1RevealedRef.current = true;

        const revealTl = gsap.timeline();

        // 1. Point 01 Title + Glowing Accent Line + Gradual Word-by-Word Body
        revealTl.to(
          tag01,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.45,
            ease: "power3.out",
          },
          0
        );
        revealTl.to(
          line01,
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.45,
            ease: "expo.out",
          },
          0.08
        );
        revealTl.to(
          words01,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.38,
            stagger: 0.032,
            ease: "power2.out",
          },
          0.14
        );

        // 2. Point 02 Title + Glowing Accent Line + Gradual Word-by-Word Body (gracefully staggered after 01 starts)
        revealTl.to(
          tag02,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.45,
            ease: "power3.out",
          },
          0.32
        );
        revealTl.to(
          line02,
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.45,
            ease: "expo.out",
          },
          0.4
        );
        revealTl.to(
          words02,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.38,
            stagger: 0.032,
            ease: "power2.out",
          },
          0.46
        );

        // Engage 1-second snappy cursor look-at tracking
        if (trackingDelayTimerRef.current) {
          clearTimeout(trackingDelayTimerRef.current);
        }
        trackingDelayTimerRef.current = setTimeout(() => {
          isTrackingActiveRef.current = true;
          gsap.to(trackingBlendRef.current, {
            weight: 1,
            duration: 0.45,
            ease: "power2.out",
          });
          onSummonCompleteRef.current?.();
        }, TRACKING_DELAY_MS);
      };

      // Trigger Phase 1 reveal when the section is clearly in front of the user ("top 35%")
      ScrollTrigger.create({
        trigger: container,
        start: "top 35%",
        once: true,
        onEnter: revealPhase1Text,
      });

      // Responsive 2-Phase Scroll Timeline across 250vh container
      const scrubTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.45,
          invalidateOnRefresh: true,
          onEnter: revealPhase1Text,
        },
      });

      // 0.00 -> 0.26: Hold Phase 1 (01 & 02)
      scrubTl.to({}, { duration: 0.26 }, 0);

      // 0.26 -> 0.39: Smooth upward exit of Phase 1 text (01 & 02)
      scrubTl.fromTo(
        [point01, point02],
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
        },
        {
          autoAlpha: 0,
          y: -22,
          filter: "blur(5px)",
          duration: 0.13,
          ease: "power2.inOut",
          immediateRender: false,
        },
        0.26
      );

      // 0.41 -> 0.72: Neat, Gradual Word-by-Word Reveal for Phase 2 text (03 & 04)
      scrubTl.fromTo(
        [point03, point04],
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.01, immediateRender: false },
        0.41
      );

      // Point 03 Tag + Line + Words
      scrubTl.fromTo(
        tag03,
        { opacity: 0, y: 16, filter: "blur(5px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.07,
          ease: "power3.out",
        },
        0.41
      );
      scrubTl.fromTo(
        line03,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.07,
          ease: "expo.out",
        },
        0.43
      );
      scrubTl.fromTo(
        words03,
        { opacity: 0, y: 12, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.08,
          stagger: 0.006,
          ease: "power2.out",
        },
        0.45
      );

      // Point 04 Tag + Line + Words (staggered slightly after Point 03 starts)
      scrubTl.fromTo(
        tag04,
        { opacity: 0, y: 16, filter: "blur(5px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.07,
          ease: "power3.out",
        },
        0.47
      );
      scrubTl.fromTo(
        line04,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.07,
          ease: "expo.out",
        },
        0.49
      );
      scrubTl.fromTo(
        words04,
        { opacity: 0, y: 12, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.08,
          stagger: 0.006,
          ease: "power2.out",
        },
        0.51
      );

      // 0.72 -> 1.00: Hold Phase 2 (03 & 04) cleanly before unpinning into #testimonials
      scrubTl.to({}, { duration: 0.28 }, 0.72);
    }, containerRef);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
    };
  }, [lang]);

  const handleSplineReady = (app: SplineRuntimeApp) => {
    splineAppRef.current = app;
    if (app._scene?.activePage?.bgColor) {
      app._scene.activePage.bgColor.a = 0;
    }
    if (app._renderer) {
      app._renderer.clearAlphaOverride = 0;
      app._renderer.setClearAlpha?.(0);
    }

    const rigObj = app.findObjectByName?.("EVA");
    if (rigObj) {
      rigObj.position.x = 0;
      rigObj.position.y = EVA_3D_OFFSET_Y;
      rigObj.position.z = 0;
      rigObj.scale.x = EVA_3D_SCALE;
      rigObj.scale.y = EVA_3D_SCALE;
      rigObj.scale.z = EVA_3D_SCALE;
      rigObj.rotation.x = EVA_BASE_PITCH_X;
      rigObj.rotation.y = 0;
      rigObj.rotation.z = 0;
    }
    syncSplineEyeMeshes(app, false, 1.0);
    app._requestRenderAutoMode?.();
  };

  const primarySideStyle: React.CSSProperties = {
    left: isAr ? "auto" : "clamp(1.5rem, 5vw, 5rem)",
    right: isAr ? "clamp(1.5rem, 5vw, 5rem)" : "auto",
  };

  const secondarySideStyle: React.CSSProperties = {
    right: isAr ? "auto" : "clamp(1.5rem, 5vw, 5rem)",
    left: isAr ? "clamp(1.5rem, 5vw, 5rem)" : "auto",
  };

  const textAlignClass = isAr ? "text-right" : "text-left";

  return (
    /* Compact 250vh Sticky Track Container (~150vh pinned travel for brisk, natural scrolling) */
    <div
      ref={containerRef}
      id="eva-showcase"
      dir="ltr"
      className="relative w-full h-[250vh] bg-[#050505] overflow-x-clip"
    >
      {/* Continuous Idle Levitation Keyframes */}
      <style>{`
        @keyframes evaIdleLevitate {
          0%, 100% {
            transform: translate3d(0, -8px, 0);
          }
          50% {
            transform: translate3d(0, 8px, 0);
          }
        }
        .eva-idle-levitate {
          animation: evaIdleLevitate 3.5s ease-in-out infinite;
          will-change: transform;
        }
      `}</style>

      <section
        ref={sectionRef}
        id="whos-eva-section"
        onMouseMove={handleSectionMouseMove}
        onMouseLeave={handleSectionMouseLeave}
        className="sticky top-0 w-full h-screen bg-[#050505] overflow-hidden flex items-center justify-center select-none"
      >
        {/* Top-Left Section Header (Left in English LTR, Right in Arabic RTL — cleanly below the Navbar) */}
        <div
          key="eva-section-header"
          ref={titleWrapRef}
          dir={isAr ? "rtl" : "ltr"}
          style={primarySideStyle}
          className={`pointer-events-none absolute top-24 sm:top-[100px] z-30 max-w-xl ${textAlignClass}`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-[#C84BFE]/25 text-xs font-mono uppercase tracking-[0.15em] text-[#C84BFE] mb-2.5 shadow-[0_0_15px_rgba(200,75,254,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C84BFE] animate-pulse" />
            {isAr ? WHOS_EVA_CONTENT.badge.ar : WHOS_EVA_CONTENT.badge.en}
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-white leading-tight">
            {isAr ? WHOS_EVA_CONTENT.title.ar : WHOS_EVA_CONTENT.title.en}
          </h2>
        </div>

        {/* Pre-rendered Radial Neon-Violet Ambient Aura Behind EVA */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[54%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[460px] h-[380px] sm:h-[460px] rounded-full bg-gradient-to-r from-[#C84BFE] via-[#8B5CF6] to-[#4F46E5] blur-[150px] opacity-35 z-10"
        />

        {/* ==================== PRE-RENDERED 3D EVA MODEL (No Entrance Animation, Ready on Page Load) ==================== */}
        <div
          className="pointer-events-none select-none relative z-20 flex items-center justify-center translate-y-[16px] sm:translate-y-[22px] scale-[0.95] sm:scale-[1.05] lg:scale-[1.1]"
          style={{
            width: `${EVA_HERO_SIZE}px`,
            height: `${EVA_HERO_SIZE}px`,
            transformOrigin: "center center",
            maskImage:
              "linear-gradient(to bottom, black 68%, rgba(0,0,0,0.45) 84%, transparent 97%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 68%, rgba(0,0,0,0.45) 84%, transparent 97%)",
          }}
        >
          <div className="eva-idle-levitate w-full h-full flex items-center justify-center">
            <EvaSplineViewer
              splineAppRef={splineAppRef}
              size={EVA_HERO_SIZE}
              showContourBorder={false}
              onReady={handleSplineReady}
            />
          </div>
        </div>

        {/* ==================== PRIMARY SIDE PLAIN TEXT (01 & 03) ==================== */}
        {/* Point 01 (Phase 1 — Left in EN, Right in AR) */}
        <div
          key="eva-point-01"
          id="eva-point-01"
          ref={point01Ref}
          dir={isAr ? "rtl" : "ltr"}
          style={primarySideStyle}
          className={`pointer-events-none absolute ${textAlignClass} top-[34%] sm:top-[58%] sm:-translate-y-1/2 z-30 w-full max-w-[250px] sm:max-w-[290px] lg:max-w-[330px] xl:max-w-[360px] will-change-[transform,opacity,filter]`}
        >
          <h3
            className={`eva-point-tag mb-2 font-bold text-[#C84BFE] drop-shadow-[0_0_12px_rgba(200,75,254,0.35)] ${
              isAr
                ? "text-lg sm:text-xl lg:text-2xl font-extrabold"
                : "text-xs sm:text-sm lg:text-base font-mono uppercase tracking-[0.18em]"
            }`}
          >
            {isAr
              ? WHOS_EVA_CONTENT.phase1.point1Title.ar
              : WHOS_EVA_CONTENT.phase1.point1Title.en}
          </h3>
          <div
            className={`eva-point-line h-[1.5px] w-16 mb-3.5 rounded-full bg-gradient-to-r from-[#C84BFE] via-[#8B5CF6] to-transparent shadow-[0_0_10px_#C84BFE] ${
              isAr ? "origin-right bg-gradient-to-l" : "origin-left"
            }`}
          />
          <p
            className={`eva-point-body text-slate-200/95 leading-relaxed ${
              isAr
                ? "text-sm sm:text-base lg:text-lg leading-[1.85]"
                : "text-xs sm:text-sm lg:text-[15.5px] leading-[1.75]"
            }`}
          >
            {renderGradualWords(
              isAr
                ? WHOS_EVA_CONTENT.phase1.point1Body.ar
                : WHOS_EVA_CONTENT.phase1.point1Body.en,
              "p1-word"
            )}
          </p>
        </div>

        {/* Point 03 (Phase 2 — Left in EN, Right in AR) */}
        <div
          key="eva-point-03"
          id="eva-point-03"
          ref={point03Ref}
          dir={isAr ? "rtl" : "ltr"}
          style={primarySideStyle}
          className={`pointer-events-none invisible opacity-0 absolute ${textAlignClass} top-[34%] sm:top-[58%] sm:-translate-y-1/2 z-30 w-full max-w-[250px] sm:max-w-[290px] lg:max-w-[330px] xl:max-w-[360px] will-change-[transform,opacity,filter]`}
        >
          <h3
            className={`eva-point-tag mb-2 font-bold text-[#C84BFE] drop-shadow-[0_0_12px_rgba(200,75,254,0.35)] ${
              isAr
                ? "text-lg sm:text-xl lg:text-2xl font-extrabold"
                : "text-xs sm:text-sm lg:text-base font-mono uppercase tracking-[0.18em]"
            }`}
          >
            {isAr
              ? WHOS_EVA_CONTENT.phase2.point3Title.ar
              : WHOS_EVA_CONTENT.phase2.point3Title.en}
          </h3>
          <div
            className={`eva-point-line h-[1.5px] w-16 mb-3.5 rounded-full bg-gradient-to-r from-[#C84BFE] via-[#8B5CF6] to-transparent shadow-[0_0_10px_#C84BFE] ${
              isAr ? "origin-right bg-gradient-to-l" : "origin-left"
            }`}
          />
          <p
            className={`eva-point-body text-slate-200/95 leading-relaxed ${
              isAr
                ? "text-sm sm:text-base lg:text-lg leading-[1.85]"
                : "text-xs sm:text-sm lg:text-[15.5px] leading-[1.75]"
            }`}
          >
            {renderGradualWords(
              isAr
                ? WHOS_EVA_CONTENT.phase2.point3Body.ar
                : WHOS_EVA_CONTENT.phase2.point3Body.en,
              "p3-word"
            )}
          </p>
        </div>

        {/* ==================== SECONDARY SIDE PLAIN TEXT (02 & 04) ==================== */}
        {/* Point 02 (Phase 1 — Right in EN, Left in AR) */}
        <div
          key="eva-point-02"
          id="eva-point-02"
          ref={point02Ref}
          dir={isAr ? "rtl" : "ltr"}
          style={secondarySideStyle}
          className={`pointer-events-none absolute ${textAlignClass} bottom-[12%] sm:bottom-auto sm:top-[58%] sm:-translate-y-1/2 z-30 w-full max-w-[250px] sm:max-w-[290px] lg:max-w-[330px] xl:max-w-[360px] will-change-[transform,opacity,filter]`}
        >
          <h3
            className={`eva-point-tag mb-2 font-bold text-[#A78BFA] drop-shadow-[0_0_12px_rgba(167,139,250,0.35)] ${
              isAr
                ? "text-lg sm:text-xl lg:text-2xl font-extrabold"
                : "text-xs sm:text-sm lg:text-base font-mono uppercase tracking-[0.18em]"
            }`}
          >
            {isAr
              ? WHOS_EVA_CONTENT.phase1.point2Title.ar
              : WHOS_EVA_CONTENT.phase1.point2Title.en}
          </h3>
          <div
            className={`eva-point-line h-[1.5px] w-16 mb-3.5 rounded-full bg-gradient-to-r from-[#A78BFA] via-[#8B5CF6] to-transparent shadow-[0_0_10px_#A78BFA] ${
              isAr ? "origin-right bg-gradient-to-l" : "origin-left"
            }`}
          />
          <p
            className={`eva-point-body text-slate-200/95 leading-relaxed ${
              isAr
                ? "text-sm sm:text-base lg:text-lg leading-[1.85]"
                : "text-xs sm:text-sm lg:text-[15.5px] leading-[1.75]"
            }`}
          >
            {renderGradualWords(
              isAr
                ? WHOS_EVA_CONTENT.phase1.point2Body.ar
                : WHOS_EVA_CONTENT.phase1.point2Body.en,
              "p2-word"
            )}
          </p>
        </div>

        {/* Point 04 (Phase 2 — Right in EN, Left in AR) */}
        <div
          key="eva-point-04"
          id="eva-point-04"
          ref={point04Ref}
          dir={isAr ? "rtl" : "ltr"}
          style={secondarySideStyle}
          className={`pointer-events-none invisible opacity-0 absolute ${textAlignClass} bottom-[12%] sm:bottom-auto sm:top-[58%] sm:-translate-y-1/2 z-30 w-full max-w-[250px] sm:max-w-[290px] lg:max-w-[330px] xl:max-w-[360px] will-change-[transform,opacity,filter]`}
        >
          <h3
            className={`eva-point-tag mb-2 font-bold text-[#A78BFA] drop-shadow-[0_0_12px_rgba(167,139,250,0.35)] ${
              isAr
                ? "text-lg sm:text-xl lg:text-2xl font-extrabold"
                : "text-xs sm:text-sm lg:text-base font-mono uppercase tracking-[0.18em]"
            }`}
          >
            {isAr
              ? WHOS_EVA_CONTENT.phase2.point4Title.ar
              : WHOS_EVA_CONTENT.phase2.point4Title.en}
          </h3>
          <div
            className={`eva-point-line h-[1.5px] w-16 mb-3.5 rounded-full bg-gradient-to-r from-[#A78BFA] via-[#8B5CF6] to-transparent shadow-[0_0_10px_#A78BFA] ${
              isAr ? "origin-right bg-gradient-to-l" : "origin-left"
            }`}
          />
          <p
            className={`eva-point-body text-slate-200/95 leading-relaxed ${
              isAr
                ? "text-sm sm:text-base lg:text-lg leading-[1.85]"
                : "text-xs sm:text-sm lg:text-[15.5px] leading-[1.75]"
            }`}
          >
            {renderGradualWords(
              isAr
                ? WHOS_EVA_CONTENT.phase2.point4Body.ar
                : WHOS_EVA_CONTENT.phase2.point4Body.en,
              "p4-word"
            )}
          </p>
        </div>
      </section>
    </div>
  );
};
