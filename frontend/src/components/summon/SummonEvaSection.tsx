"use client";

import React, { useCallback, useEffect, useRef } from "react";
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
const EVA_HERO_SIZE = 540; // Centered 3D Robot Hero Size
const TRACKING_DELAY_MS = 2000; // Strict 2000ms (2-second) delay before mouse tracking activates

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
 * Helper utility that splits text into `.scatter-char` spans with `display: inline-block`
 * while preserving spaces as `&nbsp;`.
 * - For English (`mode = "en"`): splits every character individually inside word wrappers.
 * - For Arabic (`mode = "ar"`): keeps each Arabic word intact inside `.scatter-char` so Arabic
 *   cursive letter-joining is never broken while still falling downwards by gravity.
 */
export const renderScatterChars = (
  text: string,
  phaseCharClass: string,
  mode: "en" | "ar" = "en"
): React.ReactNode[] => {
  const words = text.split(" ");
  const elements: React.ReactNode[] = [];
  let itemIndex = 0;

  words.forEach((word, wordIdx) => {
    if (mode === "ar") {
      elements.push(
        <span
          key={`ar-word-${itemIndex++}`}
          className={`scatter-char ${phaseCharClass} inline-block whitespace-nowrap will-change-[transform,opacity]`}
          style={{ display: "inline-block" }}
        >
          {word}
        </span>
      );
    } else {
      const wordChars: React.ReactNode[] = [];
      for (let i = 0; i < word.length; i++) {
        wordChars.push(
          <span
            key={`char-${itemIndex++}`}
            className={`scatter-char ${phaseCharClass} inline-block will-change-[transform,opacity]`}
            style={{ display: "inline-block" }}
          >
            {word[i]}
          </span>
        );
      }
      elements.push(
        <span key={`word-${wordIdx}`} className="inline-block whitespace-nowrap">
          {wordChars}
        </span>
      );
    }

    // Preserve space between words as &nbsp; inside its own .scatter-char span
    if (wordIdx < words.length - 1) {
      elements.push(
        <span
          key={`space-${itemIndex++}`}
          className={`scatter-char ${phaseCharClass} inline-block`}
          style={{ display: "inline-block" }}
        >
          &nbsp;
        </span>
      );
    }
  });

  return elements;
};

interface SummonEvaSectionProps {
  onSummonComplete?: () => void;
}

export const SummonEvaSection: React.FC<SummonEvaSectionProps> = ({
  onSummonComplete,
}) => {
  const { lang } = useWateera();
  const isAr = lang === "ar";

  // Keep callback in a ref so parent re-renders (e.g. when toggling language)
  // NEVER re-trigger or reset the GSAP ScrollTrigger timeline
  const onSummonCompleteRef = useRef(onSummonComplete);
  useEffect(() => {
    onSummonCompleteRef.current = onSummonComplete;
  }, [onSummonComplete]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleWrapRef = useRef<HTMLDivElement | null>(null);
  const evaWrapRef = useRef<HTMLDivElement | null>(null);
  const auraRef = useRef<HTMLDivElement | null>(null);
  const splineAppRef = useRef<SplineRuntimeApp | null>(null);

  // Phase 1 (Points 01 & 02) & Phase 2 (Points 03 & 04) text block refs
  const point1Ref = useRef<HTMLDivElement | null>(null);
  const point2Ref = useRef<HTMLDivElement | null>(null);
  const point3Ref = useRef<HTMLDivElement | null>(null);
  const point4Ref = useRef<HTMLDivElement | null>(null);

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

  // Smooth blend weight (0 -> 1) so cursor tracking engages smoothly after the 2s delay
  const trackingBlendRef = useRef({ weight: 0 });

  // Blinking state refs
  const blinkScaleRef = useRef<number>(1.0);
  const blinkRafRef = useRef<number | null>(null);

  // Lifecycle & state flags
  const isSettledRef = useRef<boolean>(false);
  const isTrackingActiveRef = useRef<boolean>(false);
  const isSplineReadyRef = useRef<boolean>(false);
  const isInViewRef = useRef<boolean>(false);
  const hasAnimatedRef = useRef<boolean>(false);
  const trackingDelayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initial Entrance Animation when native scroll reaches the section
  const playEntranceAnimation = useCallback(() => {
    const eva = evaWrapRef.current;
    const aura = auraRef.current;
    if (!eva) return;

    gsap.set(eva, {
      visibility: "visible",
      x: 0,
      y: -120,
      scale: 0.35,
      rotation: -8,
      opacity: 0,
      transformOrigin: "center center",
    });

    if (aura) {
      gsap.set(aura, {
        scale: 0.5,
        opacity: 0,
      });
    }

    rot3DRef.current.x = -0.16;
    rot3DRef.current.y = -0.42;
    rot3DRef.current.z = 0.18;
    trackingBlendRef.current.weight = 0;

    const tl = gsap.timeline({
      onComplete: () => {
        isSettledRef.current = true;
        isTrackingActiveRef.current = false;

        // Lock EVA perfectly still in the exact center facing forward
        gsap.set(eva, { x: 0, y: 0, scale: 1, rotation: 0 });
        rot3DRef.current.x = EVA_BASE_PITCH_X;
        rot3DRef.current.y = 0;
        rot3DRef.current.z = 0;

        // === STRICT 2-SECOND (2000ms) MOUSE TRACKING DELAY ===
        if (trackingDelayTimerRef.current) {
          clearTimeout(trackingDelayTimerRef.current);
        }
        trackingDelayTimerRef.current = setTimeout(() => {
          isTrackingActiveRef.current = true;

          gsap.to(trackingBlendRef.current, {
            weight: 1,
            duration: 0.9,
            ease: "sine.inOut",
          });

          gsap.to(eva, {
            y: "+=10",
            duration: 2.8,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });

          if (aura) {
            gsap.to(aura, {
              opacity: 0.42,
              scale: 1.08,
              duration: 3.2,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
          }

          onSummonCompleteRef.current?.();
        }, TRACKING_DELAY_MS);
      },
    });

    // 1. Wateera Brand Aura softly emanates behind EVA
    if (aura) {
      tl.to(
        aura,
        {
          opacity: 0.34,
          scale: 1.0,
          duration: 1.9,
          ease: "power2.out",
        },
        0
      );
    }

    // 2. EVA swoops in and settles in the exact center
    tl.to(
      eva,
      {
        x: 0,
        y: 0,
        scale: 1.0,
        opacity: 1,
        rotation: 0,
        duration: 1.9,
        ease: "power3.out",
      },
      0
    );

    // 3. 3D Body orientation banks into arrival and levels out straight ahead
    tl.to(
      rot3DRef.current,
      {
        keyframes: [
          { x: -0.16, y: -0.42, z: 0.18, duration: 0 },
          { x: 0.20, y: 0.22, z: -0.09, duration: 0.85, ease: "power2.inOut" },
          { x: EVA_BASE_PITCH_X, y: 0, z: 0, duration: 1.05, ease: "power3.out" },
        ],
      },
      0
    );
  }, []);

  // Trigger entrance when both scrolled into view and Spline model is ready
  const tryStartEntranceAnimation = useCallback(() => {
    if (hasAnimatedRef.current) return;
    if (!isInViewRef.current || !isSplineReadyRef.current) return;

    hasAnimatedRef.current = true;
    playEntranceAnimation();
  }, [playEntranceAnimation]);

  // Initial GSAP state before entrance
  useEffect(() => {
    if (!evaWrapRef.current) return;
    gsap.set(evaWrapRef.current, {
      x: 0,
      y: -120,
      scale: 0.35,
      rotation: -8,
      opacity: 0,
      visibility: "hidden",
      force3D: true,
      transformOrigin: "center center",
    });

    if (auraRef.current) {
      gsap.set(auraRef.current, {
        scale: 0.5,
        opacity: 0,
      });
    }

    rot3DRef.current.x = -0.16;
    rot3DRef.current.y = -0.42;
    rot3DRef.current.z = 0.18;
  }, []);

  // Continuous GSAP ticker (60/120fps)
  useEffect(() => {
    const updateRig = () => {
      const app = splineAppRef.current;
      if (!app) return;
      const rigObj = app.findObjectByName?.("EVA");
      if (!rigObj) return;

      if (isTrackingActiveRef.current) {
        const blend = trackingBlendRef.current.weight;
        const desiredX =
          EVA_BASE_PITCH_X + (targetRotRef.current.x - EVA_BASE_PITCH_X) * blend;
        const desiredY = targetRotRef.current.y * blend;
        const desiredZ = targetRotRef.current.z * blend;

        const damping = 0.055;
        rot3DRef.current.x += (desiredX - rot3DRef.current.x) * damping;
        rot3DRef.current.y += (desiredY - rot3DRef.current.y) * damping;
        rot3DRef.current.z += (desiredZ - rot3DRef.current.z) * damping;
      } else if (isSettledRef.current) {
        rot3DRef.current.x = EVA_BASE_PITCH_X;
        rot3DRef.current.y = 0;
        rot3DRef.current.z = 0;
      }

      rigObj.position.x = 0;
      rigObj.position.y = 0;
      rigObj.position.z = 0;
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

  // Ambient smooth eye blinking delayed to every ~15 seconds (14s - 16s)
  useEffect(() => {
    let blinkTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let isCancelled = false;

    const triggerBlink = () => {
      if (blinkRafRef.current !== null) {
        cancelAnimationFrame(blinkRafRef.current);
      }
      const blinkDuration = 190;
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
      const delay = Math.floor(14000 + Math.random() * 2000);
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

  // Cursor Look-At handler: only active after the 2000ms delay has passed
  const handleSectionMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isTrackingActiveRef.current) return;
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width * 0.45)));
    const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height * 0.45)));

    targetRotRef.current.y = normX * 0.48;
    targetRotRef.current.x = EVA_BASE_PITCH_X + normY * 0.22;
    targetRotRef.current.z = -normX * 0.08;
  };

  const handleSectionMouseLeave = () => {
    targetRotRef.current.y = 0;
    targetRotRef.current.x = EVA_BASE_PITCH_X;
    targetRotRef.current.z = 0;
  };

  // GSAP 400vh Sticky Track & Scrubbed 2-Phase Gravity Falling Timeline
  // Using a native CSS `sticky top-0 h-screen` stage inside a `h-[400vh]` container
  // eliminates any JS pin-jump / layout snap when scrolling from "Our Services" into EVA!
  useEffect(() => {
    const container = containerRef.current;
    const titleWrap = titleWrapRef.current;
    const p1 = point1Ref.current;
    const p2 = point2Ref.current;
    const p3 = point3Ref.current;
    const p4 = point4Ref.current;

    if (!container || !p1 || !p2 || !p3 || !p4) return;

    const ctx = gsap.context(() => {
      // 1. Trigger EVA's initial entrance smoothly as the section enters the viewport
      ScrollTrigger.create({
        trigger: container,
        start: "top 65%",
        once: true,
        onEnter: () => {
          isInViewRef.current = true;
          tryStartEntranceAnimation();
        },
      });

      const p1Chars = p1.querySelectorAll(".scatter-char");
      const p2Chars = p2.querySelectorAll(".scatter-char");
      const p3Chars = p3.querySelectorAll(".scatter-char");
      const p4Chars = p4.querySelectorAll(".scatter-char");

      // Set initial states for title and Phase 1 / Phase 2 text containers
      if (titleWrap) {
        gsap.set(titleWrap, { opacity: 0, y: 24 });
      }
      gsap.set([p1, p2], { opacity: 0, y: 40 });
      gsap.set([p3, p4], { opacity: 0, y: 40 });
      gsap.set([p1Chars, p2Chars, p3Chars, p4Chars], {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
      });

      // 2. Scrubbed 400vh Timeline over the sticky container (zero pin jump!)
      const scatterTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      // --- Title Entrance ---
      if (titleWrap) {
        scatterTl.to(
          titleWrap,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          0
        );
      }

      // --- PHASE 1 ENTRANCE (Points 01 & 02): Fade in and slide slightly up ---
      scatterTl.to(
        [p1, p2],
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          stagger: 0.15,
        },
        0.2
      );

      // Brief hold so the user can comfortably read Phase 1
      scatterTl.addLabel("phase1Hold", "+=0.8");

      // --- PHASE 1 FALLING EXIT: Individual characters/words fall downwards by gravity ---
      scatterTl.addLabel("phase1Scatter", "+=0.2");
      scatterTl.to(
        p1Chars,
        {
          opacity: 0,
          x: "random(-40, 40)",
          y: "random(280, 620)",
          rotation: "random(-65, 65)",
          stagger: { each: 0.012, from: "random" },
          duration: 1.4,
          ease: "power2.in",
        },
        "phase1Scatter"
      );
      scatterTl.to(
        p2Chars,
        {
          opacity: 0,
          x: "random(-40, 40)",
          y: "random(280, 620)",
          rotation: "random(-65, 65)",
          stagger: { each: 0.012, from: "random" },
          duration: 1.4,
          ease: "power2.in",
        },
        "phase1Scatter"
      );

      // --- PHASE 2 ENTRANCE (Points 03 & 04): Fade in and slide up ---
      scatterTl.addLabel("phase2Enter", "-=0.3");
      scatterTl.to(
        [p3, p4],
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          stagger: 0.15,
        },
        "phase2Enter"
      );

      // Brief hold so the user can comfortably read Phase 2
      scatterTl.addLabel("phase2Hold", "+=0.8");

      // --- PHASE 2 FALLING EXIT: Individual characters/words fall downwards before section ends ---
      scatterTl.addLabel("phase2Scatter", "+=0.2");
      scatterTl.to(
        p3Chars,
        {
          opacity: 0,
          x: "random(-40, 40)",
          y: "random(280, 620)",
          rotation: "random(-65, 65)",
          stagger: { each: 0.012, from: "random" },
          duration: 1.4,
          ease: "power2.in",
        },
        "phase2Scatter"
      );
      scatterTl.to(
        p4Chars,
        {
          opacity: 0,
          x: "random(-40, 40)",
          y: "random(280, 620)",
          rotation: "random(-65, 65)",
          stagger: { each: 0.012, from: "random" },
          duration: 1.4,
          ease: "power2.in",
        },
        "phase2Scatter"
      );

      // Subtle buffer before scrolling out of the 400vh track
      scatterTl.to({}, { duration: 0.4 });
    }, containerRef);

    const fallbackTimer = setTimeout(() => {
      if (isInViewRef.current && !hasAnimatedRef.current) {
        isSplineReadyRef.current = true;
        tryStartEntranceAnimation();
      }
    }, 1500);

    return () => {
      ctx.revert();
      clearTimeout(fallbackTimer);
    };
  }, [tryStartEntranceAnimation]);

  const handleSplineReady = (app: SplineRuntimeApp) => {
    splineAppRef.current = app;
    isSplineReadyRef.current = true;
    syncSplineEyeMeshes(app, false, 1.0);
    tryStartEntranceAnimation();
  };

  // Position classes that automatically mirror Left <-> Right based on language:
  // - In English (LTR): Odd points (01 & 03) are on the LEFT, Even points (02 & 04) are on the RIGHT.
  // - In Arabic (RTL): Odd points (01 & 03) are on the RIGHT, Even points (02 & 04) are on the LEFT.
  const primarySidePosClass = isAr
    ? "right-6 sm:right-10 lg:right-14 xl:right-20 text-right"
    : "left-6 sm:left-10 lg:left-14 xl:left-20 text-left";

  const secondarySidePosClass = isAr
    ? "left-6 sm:left-10 lg:left-14 xl:left-20 text-right"
    : "right-6 sm:right-10 lg:right-14 xl:right-20 text-right sm:text-left";

  return (
    /* 400vh Sticky Track Container: Native GPU sticky positioning eliminates any scroll jump */
    <div
      ref={containerRef}
      id="eva-showcase"
      dir="ltr"
      className="relative w-full h-[400vh] bg-[#050505]"
    >
      <section
        ref={sectionRef}
        id="whos-eva-section"
        onMouseMove={handleSectionMouseMove}
        onMouseLeave={handleSectionMouseLeave}
        className="sticky top-0 w-full h-screen bg-[#050505] overflow-hidden flex items-center justify-center select-none"
      >
        {/* Top Section Header: "The Mind of Wateera" / "العقل المدبّر لمنصة وتيرة" */}
        <div
          ref={titleWrapRef}
          dir={isAr ? "rtl" : "ltr"}
          className={`pointer-events-none absolute top-10 sm:top-14 z-30 ${
            isAr
              ? "right-6 sm:right-12 lg:right-20 text-right"
              : "left-6 sm:left-12 lg:left-20 text-left"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-[#C84BFE]/25 text-xs sm:text-sm font-mono uppercase tracking-[0.15em] text-[#C84BFE] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C84BFE] animate-pulse" />
            {isAr ? WHOS_EVA_CONTENT.badge.ar : WHOS_EVA_CONTENT.badge.en}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            {isAr ? WHOS_EVA_CONTENT.title.ar : WHOS_EVA_CONTENT.title.en}
          </h2>
        </div>

        {/* Wateera Brand Aura Effect strictly behind the centered EVA 3D model */}
        <div
          ref={auraRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] sm:w-[460px] h-[360px] sm:h-[460px] rounded-full bg-gradient-to-r from-[#C84BFE] to-[#8B5CF6] blur-[150px] opacity-0 will-change-[transform,opacity]"
        />

        {/* Pinned Center 3D EVA Robot */}
        <div
          ref={evaWrapRef}
          className="pointer-events-none select-none relative z-20 flex items-center justify-center bg-transparent border-0 outline-none"
          style={{
            width: `${EVA_HERO_SIZE}px`,
            height: `${EVA_HERO_SIZE}px`,
            maxWidth: "88vw",
            maxHeight: "78vh",
            transformOrigin: "center center",
          }}
        >
          <EvaSplineViewer
            splineAppRef={splineAppRef}
            size={EVA_HERO_SIZE}
            showContourBorder={false}
            onReady={handleSplineReady}
          />
        </div>

        {/* ==================== PHASE 1 TEXT CONTAINERS (01 & 02) ==================== */}
        {/* Point 01: Left in English, Right in Arabic */}
        <div
          ref={point1Ref}
          dir={isAr ? "rtl" : "ltr"}
          className={`pointer-events-none absolute ${primarySidePosClass} top-[26%] sm:top-1/2 sm:-translate-y-1/2 z-30 max-w-[280px] sm:max-w-[330px] lg:max-w-[370px] xl:max-w-[410px]`}
        >
          {/* English Layer */}
          <div className={isAr ? "hidden" : "block"}>
            <h3 className="mb-3 text-sm sm:text-base lg:text-lg font-bold font-mono uppercase tracking-[0.16em] text-[#C84BFE]">
              {renderScatterChars(WHOS_EVA_CONTENT.phase1.point1Title.en, "p1-char", "en")}
            </h3>
            <p className="text-sm sm:text-base lg:text-lg font-medium text-slate-200/95 leading-relaxed">
              {renderScatterChars(WHOS_EVA_CONTENT.phase1.point1Body.en, "p1-char", "en")}
            </p>
          </div>
          {/* Arabic Layer (Larger, bolder typography) */}
          <div className={isAr ? "block" : "hidden"}>
            <h3 className="mb-3.5 text-xl sm:text-2xl lg:text-[26px] font-extrabold tracking-normal text-[#C84BFE]">
              {renderScatterChars(WHOS_EVA_CONTENT.phase1.point1Title.ar, "p1-char", "ar")}
            </h3>
            <p className="text-base sm:text-lg lg:text-xl xl:text-[21px] font-medium text-slate-100 leading-[1.8]">
              {renderScatterChars(WHOS_EVA_CONTENT.phase1.point1Body.ar, "p1-char", "ar")}
            </p>
          </div>
        </div>

        {/* Point 02: Right in English, Left in Arabic */}
        <div
          ref={point2Ref}
          dir={isAr ? "rtl" : "ltr"}
          className={`pointer-events-none absolute ${secondarySidePosClass} bottom-[8%] sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 z-30 max-w-[280px] sm:max-w-[330px] lg:max-w-[370px] xl:max-w-[410px]`}
        >
          {/* English Layer */}
          <div className={isAr ? "hidden" : "block"}>
            <h3 className="mb-3 text-sm sm:text-base lg:text-lg font-bold font-mono uppercase tracking-[0.16em] text-[#A78BFA]">
              {renderScatterChars(WHOS_EVA_CONTENT.phase1.point2Title.en, "p2-char", "en")}
            </h3>
            <p className="text-sm sm:text-base lg:text-lg font-medium text-slate-200/95 leading-relaxed">
              {renderScatterChars(WHOS_EVA_CONTENT.phase1.point2Body.en, "p2-char", "en")}
            </p>
          </div>
          {/* Arabic Layer (Larger, bolder typography) */}
          <div className={isAr ? "block" : "hidden"}>
            <h3 className="mb-3.5 text-xl sm:text-2xl lg:text-[26px] font-extrabold tracking-normal text-[#A78BFA]">
              {renderScatterChars(WHOS_EVA_CONTENT.phase1.point2Title.ar, "p2-char", "ar")}
            </h3>
            <p className="text-base sm:text-lg lg:text-xl xl:text-[21px] font-medium text-slate-100 leading-[1.8]">
              {renderScatterChars(WHOS_EVA_CONTENT.phase1.point2Body.ar, "p2-char", "ar")}
            </p>
          </div>
        </div>

        {/* ==================== PHASE 2 TEXT CONTAINERS (03 & 04) ==================== */}
        {/* Point 03: Left in English, Right in Arabic */}
        <div
          ref={point3Ref}
          dir={isAr ? "rtl" : "ltr"}
          className={`pointer-events-none absolute ${primarySidePosClass} top-[26%] sm:top-1/2 sm:-translate-y-1/2 z-30 max-w-[280px] sm:max-w-[330px] lg:max-w-[370px] xl:max-w-[410px]`}
        >
          {/* English Layer */}
          <div className={isAr ? "hidden" : "block"}>
            <h3 className="mb-3 text-sm sm:text-base lg:text-lg font-bold font-mono uppercase tracking-[0.16em] text-[#C84BFE]">
              {renderScatterChars(WHOS_EVA_CONTENT.phase2.point3Title.en, "p3-char", "en")}
            </h3>
            <p className="text-sm sm:text-base lg:text-lg font-medium text-slate-200/95 leading-relaxed">
              {renderScatterChars(WHOS_EVA_CONTENT.phase2.point3Body.en, "p3-char", "en")}
            </p>
          </div>
          {/* Arabic Layer (Larger, bolder typography) */}
          <div className={isAr ? "block" : "hidden"}>
            <h3 className="mb-3.5 text-xl sm:text-2xl lg:text-[26px] font-extrabold tracking-normal text-[#C84BFE]">
              {renderScatterChars(WHOS_EVA_CONTENT.phase2.point3Title.ar, "p3-char", "ar")}
            </h3>
            <p className="text-base sm:text-lg lg:text-xl xl:text-[21px] font-medium text-slate-100 leading-[1.8]">
              {renderScatterChars(WHOS_EVA_CONTENT.phase2.point3Body.ar, "p3-char", "ar")}
            </p>
          </div>
        </div>

        {/* Point 04: Right in English, Left in Arabic */}
        <div
          ref={point4Ref}
          dir={isAr ? "rtl" : "ltr"}
          className={`pointer-events-none absolute ${secondarySidePosClass} bottom-[8%] sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 z-30 max-w-[280px] sm:max-w-[330px] lg:max-w-[370px] xl:max-w-[410px]`}
        >
          {/* English Layer */}
          <div className={isAr ? "hidden" : "block"}>
            <h3 className="mb-3 text-sm sm:text-base lg:text-lg font-bold font-mono uppercase tracking-[0.16em] text-[#A78BFA]">
              {renderScatterChars(WHOS_EVA_CONTENT.phase2.point4Title.en, "p4-char", "en")}
            </h3>
            <p className="text-sm sm:text-base lg:text-lg font-medium text-slate-200/95 leading-relaxed">
              {renderScatterChars(WHOS_EVA_CONTENT.phase2.point4Body.en, "p4-char", "en")}
            </p>
          </div>
          {/* Arabic Layer (Larger, bolder typography) */}
          <div className={isAr ? "block" : "hidden"}>
            <h3 className="mb-3.5 text-xl sm:text-2xl lg:text-[26px] font-extrabold tracking-normal text-[#A78BFA]">
              {renderScatterChars(WHOS_EVA_CONTENT.phase2.point4Title.ar, "p4-char", "ar")}
            </h3>
            <p className="text-base sm:text-lg lg:text-xl xl:text-[21px] font-medium text-slate-100 leading-[1.8]">
              {renderScatterChars(WHOS_EVA_CONTENT.phase2.point4Body.ar, "p4-char", "ar")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export const WhosEvaSection = SummonEvaSection;
export default SummonEvaSection;
