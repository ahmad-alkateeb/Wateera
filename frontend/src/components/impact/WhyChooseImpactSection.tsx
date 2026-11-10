"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, Sparkles, Zap, Cpu, Activity } from "lucide-react";
import { useWateera } from "../../context/WateeraContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const WhyChooseImpactSection: React.FC = () => {
  const { lang } = useWateera();
  const isAr = lang === "ar";

  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  // Direct DOM refs for CountUp numbers to avoid React re-renders during 60fps GSAP animation
  const count3xRef = useRef<HTMLSpanElement | null>(null);
  const count0Ref = useRef<HTMLSpanElement | null>(null);
  const count999Ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    const ctx = gsap.context(() => {
      const cards = grid.querySelectorAll(".bento-card");

      // Initial hidden state for header & Bento cards
      if (header) {
        gsap.set(header, { opacity: 0, y: 35 });
      }
      gsap.set(cards, { opacity: 0, y: 50 });

      // Reset initial number texts
      if (count3xRef.current) count3xRef.current.textContent = "0x";
      if (count0Ref.current) count0Ref.current.textContent = "0";
      if (count999Ref.current) count999Ref.current.textContent = "0.0%";

      // Counter proxy objects (zero React state re-renders)
      const counter3x = { val: 0 };
      const counter0 = { val: 0 };
      const counter999 = { val: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          once: true,
          invalidateOnRefresh: true,
        },
      });

      // 1. Section Header Reveal
      if (header) {
        tl.to(
          header,
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
          },
          0
        );
      }

      // 2. Bento Cards Stagger Reveal (fade in + slide up from y: 50 with stagger: 0.15)
      tl.to(
        cards,
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.15,
          ease: "power3.out",
        },
        0.15
      );

      // 3. Number Counting (CountUp) Animations triggered as cards enter
      // Card 1: 0 -> 3x
      tl.to(
        counter3x,
        {
          val: 3,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => {
            if (count3xRef.current) {
              const formatted =
                counter3x.val >= 2.95
                  ? "3x"
                  : `${counter3x.val.toFixed(1).replace(/\.0$/, "")}x`;
              count3xRef.current.textContent = formatted;
            }
          },
        },
        0.25
      );

      // Card 3: 0 -> 0 (with a crisp scale-in emphasis on the zero)
      tl.to(
        counter0,
        {
          val: 0,
          duration: 1.2,
          ease: "power2.out",
          onUpdate: () => {
            if (count0Ref.current) {
              count0Ref.current.textContent = `${Math.round(counter0.val)}`;
            }
          },
        },
        0.45
      );
      if (count0Ref.current) {
        tl.fromTo(
          count0Ref.current,
          { scale: 0.75 },
          { scale: 1, duration: 0.8, ease: "back.out(2)" },
          0.45
        );
      }

      // Card 5: 0.0% -> 99.9%
      tl.to(
        counter999,
        {
          val: 99.9,
          duration: 2.2,
          ease: "power2.out",
          onUpdate: () => {
            if (count999Ref.current) {
              count999Ref.current.textContent = `${counter999.val.toFixed(1)}%`;
            }
          },
        },
        0.55
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-choose-wateera"
      dir={isAr ? "rtl" : "ltr"}
      className="relative z-30 w-full bg-[#050505] py-32 px-4 sm:px-6 lg:px-8 overflow-hidden select-none"
    >
      {/* Subtle Ambient Volumetric Background Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/4 w-[520px] h-[520px] rounded-full bg-[#C84BFE] blur-[220px] opacity-[0.09]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 right-1/4 w-[560px] h-[560px] rounded-full bg-[#8B5CF6] blur-[230px] opacity-[0.10]"
      />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-[#C84BFE]/25 text-xs font-mono uppercase tracking-[0.2em] text-[#C84BFE] mb-4 shadow-[0_0_15px_rgba(200,75,254,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C84BFE] animate-pulse" />
            {isAr ? "لماذا وتيرة // أثرنا الرقمي" : "WHY CHOOSE WATEERA // OUR IMPACT"}
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
            {isAr ? "صُممت للأداء. وأثبتت بالأرقام." : "Engineered for Flow. Proven by Impact."}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            {isAr
              ? "مزيج متكامل من الأتمتة الذكية والأمان غير المرئي، يمنح فريقك أقصى درجات التركيز والإنتاجية."
              : "A unified architecture combining autonomous orchestration with measurable engineering velocity."}
          </p>
        </div>

        {/* Bento Box Grid Layout (4 columns on desktop, balanced 2-row Bento matrix) */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(250px,auto)]"
        >
          {/* ==================== CARD 1 (Impact - Large: col-span-2) ==================== */}
          <div className="bento-card group relative md:col-span-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:border-[#8B5CF6]/60 hover:bg-white/[0.07] hover:shadow-[0_0_45px_rgba(139,92,246,0.16)]">
            {/* Subtle Corner Aura on Hover */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-[#C84BFE]/25 to-[#8B5CF6]/10 blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
            />

            <div className="relative z-10 flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C84BFE]/10 border border-[#C84BFE]/25 text-xs font-mono uppercase tracking-wider text-[#C84BFE]">
                <Zap className="w-3.5 h-3.5" />
                {isAr ? "مضاعفة الإنتاجية" : "VELOCITY METRIC"}
              </span>
              <span className="text-xs font-mono text-slate-500">01 // IMPACT</span>
            </div>

            <div className="relative z-10 my-auto py-2">
              <span
                ref={count3xRef}
                dir="ltr"
                className="inline-block text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight bg-gradient-to-r from-white via-[#F3E8FF] to-[#C84BFE] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(200,75,254,0.3)]"
              >
                0x
              </span>
            </div>

            <div className="relative z-10 mt-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {isAr ? "تركيز عمل عميق (Deep Work Focus)" : "Deep Work Focus"}
              </h3>
              <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed">
                {isAr
                  ? "من خلال القضاء على العوائق الإدارية، تضاعف وتيرة ساعات البرمجة المتواصلة دون مقاطعة إلى 3 أضعاف."
                  : "By eliminating administrative friction, Wateera triples your uninterrupted coding hours."}
              </p>
            </div>
          </div>

          {/* ==================== CARD 2 (Feature - Medium: col-span-1) ==================== */}
          <div className="bento-card group relative md:col-span-1 bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:border-[#8B5CF6]/60 hover:bg-white/[0.07] hover:shadow-[0_0_45px_rgba(139,92,246,0.16)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#8B5CF6]/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"
            />

            <div className="relative z-10 flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#C84BFE] group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-slate-500">02 // SECURITY</span>
            </div>

            <div className="relative z-10 mt-auto">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                {isAr ? "أمان واعي بالسياق" : "Context-Aware Security"}
              </h3>
              <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed">
                {isAr
                  ? "تحقق ثنائي شفاف يحمي جلساتك بالكامل دون كسر تدفق عملك أو تركيزك."
                  : "Transparent dual-layer verification keeps your sessions locked down without breaking your flow."}
              </p>
            </div>
          </div>

          {/* ==================== CARD 3 (Impact - Small: col-span-1) ==================== */}
          <div className="bento-card group relative md:col-span-1 bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:border-[#8B5CF6]/60 hover:bg-white/[0.07] hover:shadow-[0_0_45px_rgba(139,92,246,0.16)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full bg-[#C84BFE]/15 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"
            />

            <div className="relative z-10 flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] font-mono uppercase tracking-wider text-slate-300">
                <Sparkles className="w-3 h-3 text-[#C84BFE]" />
                {isAr ? "بيئة صافية" : "PURE FLOW"}
              </span>
              <span className="text-xs font-mono text-slate-500">03 // FOCUS</span>
            </div>

            <div className="relative z-10 my-auto py-2">
              <span
                ref={count0Ref}
                dir="ltr"
                className="inline-block text-6xl sm:text-7xl font-black tracking-tight bg-gradient-to-b from-white to-[#C84BFE] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(200,75,254,0.28)]"
              >
                0
              </span>
            </div>

            <div className="relative z-10 mt-4">
              <h3 className="text-xl font-bold text-white mb-1.5">
                {isAr ? "مشتتات (Distractions)" : "Distractions"}
              </h3>
              <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed">
                {isAr
                  ? "تركيز مطلق تديره إيفا بذكاء."
                  : "Absolute focus orchestrated by EVA."}
              </p>
            </div>
          </div>

          {/* ==================== CARD 4 (Feature - Large: col-span-2) ==================== */}
          <div className="bento-card group relative md:col-span-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:border-[#8B5CF6]/60 hover:bg-white/[0.07] hover:shadow-[0_0_45px_rgba(139,92,246,0.16)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-tl from-[#8B5CF6]/25 via-[#C84BFE]/15 to-transparent blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
            />

            <div className="relative z-10 flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#C84BFE]/15 border border-[#C84BFE]/30 flex items-center justify-center text-[#C84BFE] group-hover:scale-110 transition-transform duration-500">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-slate-500">04 // AUTONOMOUS CORE</span>
            </div>

            <div className="relative z-10 mt-auto">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                {isAr ? "تناغم وأتمتة ذاتية (Autonomous Orchestration)" : "Autonomous Orchestration"}
              </h3>
              <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-2xl">
                {isAr
                  ? "من الساعات الذكية إلى مصفوفة النقاط، تدير إيفا فوضى بيئة العمل تلقائياً في الخلفية دون تدخل يدوي."
                  : "From Smart Hours to the Points Matrix, EVA handles the workspace chaos autonomously in the background."}
              </p>
            </div>
          </div>

          {/* ==================== CARD 5 (Impact - Medium: col-span-2) ==================== */}
          <div className="bento-card group relative md:col-span-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:border-[#8B5CF6]/60 hover:bg-white/[0.07] hover:shadow-[0_0_45px_rgba(139,92,246,0.16)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-br from-[#8B5CF6]/25 to-[#C84BFE]/15 blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
            />

            <div className="relative z-10 flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-xs font-mono uppercase tracking-wider text-[#A78BFA]">
                <Activity className="w-3.5 h-3.5" />
                {isAr ? "اعتمادية فائقة" : "RELIABILITY SLA"}
              </span>
              <span className="text-xs font-mono text-slate-500">05 // STABILITY</span>
            </div>

            <div className="relative z-10 my-auto py-2">
              <span
                ref={count999Ref}
                dir="ltr"
                className="inline-block text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-[#E9D5FF] to-[#8B5CF6] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]"
              >
                0.0%
              </span>
            </div>

            <div className="relative z-10 mt-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {isAr ? "سلامة واستقرار الجلسات (Session Integrity)" : "Session Integrity"}
              </h3>
              <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed">
                {isAr
                  ? "استقرار بمستوى المؤسسات الكبرى لحماية عالمك الرقمي على مدار الساعة."
                  : "Enterprise-grade stability for your digital universe."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseImpactSection;
