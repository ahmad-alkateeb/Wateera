"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Sparkles, AlertCircle, Shield, Building2, Zap } from "lucide-react";
import { useWateera } from "../../context/WateeraContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const PricingPlansSection: React.FC = () => {
  const { lang } = useWateera();
  const isAr = lang === "ar";

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const starterCardRef = useRef<HTMLDivElement | null>(null);
  const proCardRef = useRef<HTMLDivElement | null>(null);
  const enterpriseCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const section = sectionRef.current;
    const stage = stageRef.current;
    const starterCard = starterCardRef.current;
    const proCard = proCardRef.current;
    const enterpriseCard = enterpriseCardRef.current;

    if (!wrapper || !section || !stage || !starterCard || !proCard || !enterpriseCard) return;

    const mm = gsap.matchMedia();

    // Desktop Stack-to-Fan-Out Animation:
    // Native sticky 250vh track ensures the user ALWAYS sees the 3 cards stacked dead-center
    // first, then smoothly fanning out horizontally into upright positions as they scroll!
    mm.add("(min-width: 1024px)", () => {
      // Initial stacked state in the exact center of the stage (upright, layered neatly)
      gsap.set(starterCard, {
        x: "0%",
        y: 0,
        rotation: 0,
        scale: 0.94,
        opacity: 0.92,
        zIndex: 4,
        transformOrigin: "center center",
        force3D: true,
      });
      gsap.set(enterpriseCard, {
        x: "0%",
        y: 0,
        rotation: 0,
        scale: 0.96,
        opacity: 0.95,
        zIndex: 5,
        transformOrigin: "center center",
        force3D: true,
      });
      gsap.set(proCard, {
        x: "0%",
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        zIndex: 10,
        transformOrigin: "center center",
        force3D: true,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1 (0.00 -> 0.14): Brief hold in the stacked center state so the stack is clearly seen
      tl.to({}, { duration: 0.14 });

      // Phase 2 (0.14 -> 0.72): Cards fan out horizontally and settle completely upright (rotation: 0, y: 0)
      // Left Card (Starter): Animates from center stack (0%) to x: "-105%", upright
      tl.to(
        starterCard,
        {
          x: "-105%",
          rotation: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.58,
          ease: "back.out(1.2)",
        },
        0.14
      );

      // Center Card (Pro): Scales up to 1.05 in the center (zIndex: 10)
      tl.to(
        proCard,
        {
          x: "0%",
          y: 0,
          rotation: 0,
          scale: 1.05,
          zIndex: 10,
          opacity: 1,
          duration: 0.58,
          ease: "back.out(1.2)",
        },
        0.14
      );

      // Right Card (Enterprise): Animates from center stack (0%) to x: "105%", upright
      tl.to(
        enterpriseCard,
        {
          x: "105%",
          rotation: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.58,
          ease: "back.out(1.2)",
        },
        0.14
      );

      // Phase 3 (0.72 -> 1.00): Hold in the spread-out state so user can read & interact with all 3 cards
      tl.to({}, { duration: 0.28 });
    });

    // Tablet & Mobile Responsive Fallback (Graceful staggered reveal with reversible ScrollTrigger)
    mm.add("(max-width: 1023px)", () => {
      const cards = [starterCard, proCard, enterpriseCard];
      gsap.set(cards, { clearProps: "all" });
      gsap.set(cards, { opacity: 0, y: 45, scale: 0.96 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top 78%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
      });

      tl.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.2)",
      });
    });

    return () => mm.revert();
  }, []);

  const starterFeatures = isAr
    ? [
        "يتطلب بريد إلكتروني رسمي للشركة",
        "تجربة كاملة لمدة 14 يوماً (يتطلب بطاقة ائتمان)",
        "أدوات بيئة العمل الأساسية",
      ]
    : [
        "Corporate email required",
        "14-Day Full Trial (CC required)",
        "Core Workspace tools",
      ];

  const proFeatures = isAr
    ? [
        "التحقق السلوكي والحيوي المستمر",
        "ربط عميق ومتكامل مع GitHub",
        "تقارير وتحليلات متقدمة",
        "مصفوفة النقاط ونظام التحفيز (Gamification)",
      ]
    : [
        "Continuous Behavioral Auth",
        "Deep GitHub Integration",
        "Advanced Reporting",
        "Points Matrix & Gamification",
      ];

  const enterpriseFeatures = isAr
    ? [
        "استضافة داخلية خاصة (On-premise Hosting)",
        "مزامنة Active Directory",
        "مدير حساب مخصص",
        "مسارات عمل مخصصة بالكامل",
      ]
    : [
        "On-premise Hosting",
        "Active Directory Sync",
        "Dedicated Account Manager",
        "Custom Workflows",
      ];

  return (
    /* 250vh Sticky Track on Desktop: Guarantees smooth, zero-jump Card Stack to Fan-Out animation */
    <div
      ref={wrapperRef}
      id="pricing-plans"
      dir="ltr"
      className="relative z-30 w-full lg:h-[250vh] bg-[#050505]"
    >
      <section
        ref={sectionRef}
        className="lg:sticky lg:top-0 w-full min-h-screen lg:h-screen bg-[#050505] pt-20 pb-12 sm:pt-24 sm:pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col items-center justify-center select-none"
      >
        {/* Ambient Wateera Aura Behind the Card Fan */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] sm:w-[740px] h-[520px] sm:h-[740px] rounded-full bg-gradient-to-r from-[#C84BFE]/20 via-[#8B5CF6]/20 to-[#4F46E5]/15 blur-[160px]"
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
          {/* Section Header (Permanently Visible - Never Disappears on Card Animation) */}
          <div
            dir={isAr ? "rtl" : "ltr"}
            className="text-center max-w-3xl mx-auto mb-8 lg:mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-[#C84BFE]/25 text-xs font-mono uppercase tracking-[0.2em] text-[#C84BFE] mb-3 shadow-[0_0_15px_rgba(200,75,254,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C84BFE] animate-pulse" />
              {isAr ? "الأسعار والباقات // وتيرة" : "PRICING & PLANS // WATEERA WORKSPACE"}
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              {isAr ? "استثمر في التركيز العميق" : "Scale Your Autonomous Flow"}
            </h2>

            <p className="mt-2.5 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed">
              {isAr
                ? "باقات مرنة مصممة للفرق الطموحة والمؤسسات التي تبحث عن أقصى درجات الإنتاجية والأمان."
                : "Transparent plans designed for high-velocity engineering teams and enterprise organizations."}
            </p>
          </div>

          {/* Card Stack & Fan-Out Stage Container */}
          <div
            ref={stageRef}
            className="relative w-full min-h-[480px] xl:min-h-[510px] flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-0"
          >
            {/* ==================== CARD 1: STARTER (LEFT) ==================== */}
            <div
              ref={starterCardRef}
              dir={isAr ? "rtl" : "ltr"}
              className="w-full max-w-[360px] lg:w-[340px] xl:w-[365px] lg:absolute bg-[#0C0B12]/90 border border-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.75)] transition-colors duration-300 hover:border-white/25 will-change-transform"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-slate-300">
                      <Zap className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {isAr ? "الأساسية (Starter)" : "Starter"}
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-slate-400">
                    {isAr ? "حتى 5 مستخدمين" : "Up to 5 Users"}
                  </span>
                </div>

                <div className="mb-4 pb-4 border-b border-white/10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {isAr ? "مجاناً" : "Free"}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
                    {isAr
                      ? "بداية مثالية للفرق الصغيرة لاستكشاف بيئة وتيرة."
                      : "Ideal for small teams exploring the Wateera ecosystem."}
                  </p>
                </div>

                <ul className="space-y-3 mb-5">
                  {starterFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-200">
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-slate-300">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Note Callout */}
                <div className="rounded-2xl bg-amber-500/[0.07] border border-amber-400/20 p-3 mb-5 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200/90 leading-relaxed">
                    <strong className="font-semibold">
                      {isAr ? "ملاحظة: " : "Note: "}
                    </strong>
                    {isAr
                      ? "لا تشمل نظام التلعيب (Gamification) أو التحقق الحيوي المستمر."
                      : "No Gamification or Continuous Biometrics."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-3 px-6 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-sm font-bold text-white transition-all duration-300 cursor-pointer"
              >
                {isAr ? "ابدأ التجربة المجانية" : "Start 14-Day Trial"}
              </button>
            </div>

            {/* ==================== CARD 2: PRO (CENTER - HIGHLIGHTED) ==================== */}
            <div
              ref={proCardRef}
              dir={isAr ? "rtl" : "ltr"}
              className="w-full max-w-[360px] lg:w-[350px] xl:w-[375px] lg:absolute z-10 bg-[#120E1E]/95 border-2 border-purple-500/50 backdrop-blur-md rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_0_55px_rgba(168,85,247,0.32)] will-change-transform"
            >
              {/* Subtle Inner Top Glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-56 h-32 rounded-full bg-[#C84BFE]/25 blur-3xl"
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#C84BFE]/25 to-[#8B5CF6]/25 border border-purple-400/40 flex items-center justify-center text-[#C84BFE] shadow-[0_0_20px_rgba(200,75,254,0.3)]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                      {isAr ? "الاحترافية (Pro)" : "Pro"}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gradient-to-r from-[#C84BFE]/20 to-[#8B5CF6]/20 border border-purple-400/40 text-[#E9D5FF] shadow-[0_0_15px_rgba(200,75,254,0.25)]">
                    {isAr ? "الأكثر اختياراً" : "Recommended"}
                  </span>
                </div>

                <div className="mb-4 pb-4 border-b border-purple-500/25">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-white via-[#F3E8FF] to-[#C84BFE] bg-clip-text text-transparent">
                      $X
                    </span>
                    <span className="text-sm font-medium text-slate-300">
                      {isAr ? "/ لكل مستخدم / شهرياً" : "/ user / month"}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-300/90">
                    {isAr
                      ? "القوة الكاملة لإيفا والأتمتة الذكية لفرق التطوير."
                      : "Full autonomous EVA orchestration for high-performing teams."}
                  </p>
                </div>

                <ul className="space-y-3.5 mb-6">
                  {proFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base font-medium text-white">
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-gradient-to-br from-[#C84BFE] to-[#8B5CF6] flex items-center justify-center shrink-0 text-black shadow-[0_0_12px_rgba(200,75,254,0.5)]">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className="relative z-10 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#C84BFE] to-[#8B5CF6] hover:opacity-95 text-sm font-extrabold text-white shadow-[0_0_30px_rgba(200,75,254,0.4)] transition-all duration-300 cursor-pointer"
              >
                {isAr ? "اشترك في الباقة الاحترافية" : "Upgrade to Pro"}
              </button>
            </div>

            {/* ==================== CARD 3: ENTERPRISE (RIGHT) ==================== */}
            <div
              ref={enterpriseCardRef}
              dir={isAr ? "rtl" : "ltr"}
              className="w-full max-w-[360px] lg:w-[340px] xl:w-[365px] lg:absolute bg-[#0C0B12]/90 border border-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.75)] transition-colors duration-300 hover:border-white/25 will-change-transform"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-slate-300">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {isAr ? "المؤسسات (Enterprise)" : "Enterprise"}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-slate-400">
                    <Shield className="w-3 h-3 text-[#8B5CF6]" />
                    {isAr ? "حماية قصوى" : "Custom SLA"}
                  </span>
                </div>

                <div className="mb-4 pb-4 border-b border-white/10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {isAr ? "تسعير مخصص" : "Custom Pricing"}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
                    {isAr
                      ? "حلول سيادية متكاملة وتحكم كامل بالبنية التحتية."
                      : "Sovereign infrastructure and tailored workflows at scale."}
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {enterpriseFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-200">
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#A78BFA]">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className="w-full py-3 px-6 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-sm font-bold text-white transition-all duration-300 cursor-pointer"
              >
                {isAr ? "تواصل مع المبيعات" : "Contact Enterprise Sales"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPlansSection;
