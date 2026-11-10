"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Building2, CreditCard, Cpu, Flame } from "lucide-react";
import { useWateera } from "../../context/WateeraContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProcessStep {
  number: string;
  tagEn: string;
  tagAr: string;
  titleEn: string;
  titleAr: string;
  textEn: string;
  textAr: string;
  icon: React.ReactNode;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    tagEn: "STEP 01 // VERIFIED ACCESS",
    tagAr: "الخطوة 01 // وصول موثّق",
    titleEn: "Corporate Onboarding",
    titleAr: "تسجيل الشركات الموثّق (Corporate Onboarding)",
    textEn:
      "Wateera is built for serious teams. Registration is strictly gated by corporate domains to ensure a professional, secure ecosystem right from the start.",
    textAr:
      "صُممت وتيرة للفرق الجادة؛ لذلك يقتصر التسجيل حصرياً على النطاقات الرسمية للشركات لضمان بيئة عمل احترافية وآمنة منذ اللحظة الأولى.",
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    number: "02",
    tagEn: "STEP 02 // DEDICATED RESOURCES",
    tagAr: "الخطوة 02 // موارد مخصصة",
    titleEn: "The 14-Day Commitment",
    titleAr: "التزام الـ 14 يوماً (The 14-Day Commitment)",
    textEn:
      "Experience the full power of EVA. A 14-day trial secured by a credit card wall ensures our premium resources are dedicated exclusively to committed teams.",
    textAr:
      "اختبر القوة الكاملة لإيفا؛ تجربة متكاملة لمدة 14 يوماً محمية بتوثيق البطاقة الائتمانية لضمان تخصيص مواردنا الفائقة حصرياً للفرق الملتزمة.",
    icon: <CreditCard className="w-6 h-6" />,
  },
  {
    number: "03",
    tagEn: "STEP 03 // AUTONOMOUS SETUP",
    tagAr: "الخطوة 03 // تهيئة ذاتية",
    titleEn: "Workspace Initialization",
    titleAr: "تهيئة بيئة العمل (Workspace Initialization)",
    textEn:
      "Once inside, EVA takes over. She autonomously syncs with your tools, aligns your GitHub repositories, and builds your custom distraction-free environment.",
    textAr:
      "بمجرد دخولك، تتولى إيفا المهمة؛ حيث تتزامن تلقائياً مع أدواتك، وتربط مستودعات GitHub الخاصة بك، وتبني بيئتك المخصصة الخالية من المشتتات.",
    icon: <Cpu className="w-6 h-6" />,
  },
  {
    number: "04",
    tagEn: "STEP 04 // PEAK VELOCITY",
    tagAr: "الخطوة 04 // ذروة الإنجاز",
    titleEn: "Deep Work & Gamification",
    titleAr: "العمل العميق والتحفيز (Deep Work & Gamification)",
    textEn:
      "Your workspace is primed. Smart Hours activate immediately, while the Points Matrix begins tracking your green streaks and performance seamlessly in the background.",
    textAr:
      "بيئة عملك الآن في كامل جاهزيتها؛ تتفعل الساعات الذكية فوراً، بينما تبدأ مصفوفة النقاط بتتبع سلاسل إنجازاتك الخضراء وأدائك بسلاسة تامة في الخلفية.",
    icon: <Flame className="w-6 h-6" />,
  },
];

export const ProcessHowItWorksSection: React.FC = () => {
  const { lang } = useWateera();
  const isAr = lang === "ar";

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const section = sectionRef.current;
    const track = trackRef.current;
    const progressFill = progressFillRef.current;
    if (!wrapper || !section || !track) return;

    const ctx = gsap.context(() => {
      // Exact horizontal distance required so the track stops perfectly at the last card
      const getScrollAmount = () => {
        return Math.max(0, track.scrollWidth - window.innerWidth);
      };

      // Native CSS sticky container inside a 350vh track eliminates any pin jump or section overlap
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      // Brief initial hold so Card 01 and Header settle cleanly upon entering the section
      tl.to({}, { duration: 0.08 });

      // Move horizontal flex track from right to left (0 -> -getScrollAmount)
      tl.to(
        track,
        {
          x: () => -getScrollAmount(),
          ease: "none",
          duration: 0.84,
        },
        0.08
      );

      // Animate subtle progress bar indicator in sync with the horizontal scrub
      if (progressFill) {
        tl.fromTo(
          progressFill,
          { scaleX: 0.25 },
          { scaleX: 1, ease: "none", duration: 0.84 },
          0.08
        );
      }

      // Brief end hold on Card 04 before transitioning naturally into Pricing & Plans
      tl.to({}, { duration: 0.08 });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    /* 350vh Sticky Track Container: Native GPU sticky positioning prevents any overlap or fast-scroll lag */
    <div
      ref={wrapperRef}
      id="how-it-works"
      dir="ltr"
      className="relative z-30 w-full h-[350vh] bg-[#050505]"
    >
      <section
        ref={sectionRef}
        className="sticky top-0 w-full h-screen bg-[#050505] overflow-hidden flex flex-col justify-between pt-20 pb-10 sm:pt-24 sm:pb-12 select-none"
      >
        {/* Ambient Volumetric Background Glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] rounded-full bg-gradient-to-r from-[#C84BFE]/15 to-[#8B5CF6]/15 blur-[170px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-10 right-1/4 w-[460px] h-[460px] rounded-full bg-[#722F37]/20 blur-[180px]"
        />

        {/* Section Header */}
        <div
          dir={isAr ? "rtl" : "ltr"}
          className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-[#C84BFE]/25 text-xs font-mono uppercase tracking-[0.2em] text-[#C84BFE] mb-3 shadow-[0_0_15px_rgba(200,75,254,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C84BFE] animate-pulse" />
              {isAr ? "آلية العمل // رحلة وتيرة" : "THE PROCESS // HOW IT WORKS"}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              {isAr ? "من التسجيل إلى التركيز العميق" : "From Onboarding to Deep Flow"}
            </h2>
          </div>

          {/* Horizontal Progress Indicator */}
          <div className="flex flex-col items-start sm:items-end gap-2">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400">
              {isAr ? "مرّر لاستكشاف المراحل الأربع (01 — 04)" : "SCROLL TO EXPLORE (01 — 04)"}
            </span>
            <div
              dir="ltr"
              className="w-44 sm:w-56 h-1.5 rounded-full bg-white/10 overflow-hidden"
            >
              <div
                ref={progressFillRef}
                className="w-full h-full origin-left bg-gradient-to-r from-[#C84BFE] to-[#8B5CF6] rounded-full"
                style={{ transform: "scaleX(0.25)" }}
              />
            </div>
          </div>
        </div>

        {/* Horizontal Flex Track Holding the 4 Process Cards */}
        <div className="relative z-20 flex-1 flex items-center">
          <div
            ref={trackRef}
            className="flex flex-nowrap items-stretch gap-8 px-[10vw] w-max will-change-transform"
          >
            {PROCESS_STEPS.map((step, index) => (
              <div
                key={step.number}
                dir={isAr ? "rtl" : "ltr"}
                className="group relative w-[85vw] md:w-[60vw] lg:w-[40vw] flex-shrink-0 bg-white/[0.04] border border-white/10 backdrop-blur-md rounded-3xl p-8 sm:p-10 lg:p-12 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:border-[#8B5CF6]/55 hover:bg-white/[0.06] hover:shadow-[0_0_50px_rgba(139,92,246,0.16)]"
              >
                {/* Top Brand Gradient Accent Line */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C84BFE] via-[#8B5CF6] to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                />

                {/* Subtle Corner Glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-[#C84BFE]/20 to-[#8B5CF6]/10 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                />

                {/* Large Background Step Watermark Number */}
                <span
                  aria-hidden="true"
                  dir="ltr"
                  className={`pointer-events-none absolute -bottom-6 ${
                    isAr ? "left-6" : "right-6"
                  } text-[110px] sm:text-[140px] font-black leading-none tracking-tighter bg-gradient-to-b from-white/[0.08] to-transparent bg-clip-text text-transparent select-none`}
                >
                  {step.number}
                </span>

                {/* Top Row: Step Number Badge & Icon */}
                <div className="relative z-10 flex items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <span
                      dir="ltr"
                      className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#C84BFE]/20 to-[#8B5CF6]/20 border border-[#C84BFE]/35 text-sm font-mono font-extrabold text-[#C84BFE] shadow-[0_0_20px_rgba(200,75,254,0.2)]"
                    >
                      {step.number}
                    </span>
                    <span className="text-xs font-mono uppercase tracking-[0.16em] text-slate-400">
                      {isAr ? step.tagAr : step.tagEn}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#C84BFE] group-hover:border-[#C84BFE]/40 group-hover:scale-110 transition-all duration-500">
                    {step.icon}
                  </div>
                </div>

                {/* Middle/Bottom Content: Title & Description */}
                <div className="relative z-10 my-auto py-4">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 tracking-tight">
                    {isAr ? step.titleAr : step.titleEn}
                  </h3>
                  <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed max-w-xl">
                    {isAr ? step.textAr : step.textEn}
                  </p>
                </div>

                {/* Card Footer Stepper Dots */}
                <div className="relative z-10 pt-6 mt-6 border-t border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-2" dir="ltr">
                    {PROCESS_STEPS.map((_, dotIdx) => (
                      <span
                        key={dotIdx}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          dotIdx === index
                            ? "w-8 bg-gradient-to-r from-[#C84BFE] to-[#8B5CF6]"
                            : dotIdx < index
                            ? "w-2 bg-[#8B5CF6]/50"
                            : "w-2 bg-white/15"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-slate-400" dir="ltr">
                    {step.number} / 04
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProcessHowItWorksSection;
