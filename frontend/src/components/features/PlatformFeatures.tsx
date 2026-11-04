"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useWateera } from "../../context/WateeraContext";

// --- Framer Motion Scroll-Reveal Variants ---

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// --- Privacy-Focused Services Data (Tags Removed Completely) ---

interface Service {
  id: string;
  title: string;
  titleAr: string;
  desc: string;
  descAr: string;
  hudBadge: string;
  hudStat: string;
  hudPrivacyPill: string;
  hudPrivacyPillAr: string;
}

const services: Service[] = [
  {
    id: "01",
    title: "Context-Aware Security",
    titleAr: "أمان سياقي ذكي ومتكامل",
    desc: "Dual-layer authentication (QR & GPS) with randomized biometric checks. Designed with strict privacy protocols to guarantee session integrity without accessing or compromising personal device data.",
    descAr:
      "توثيق ثنائي (QR و GPS) مع فحوصات حيوية عشوائية. صُمم ببروتوكولات خصوصية صارمة لضمان سلامة الجلسة دون الوصول إلى بيانات الجهاز الشخصية أو المساس بها.",
    hudBadge: "ZERO-TRUST // PRIVACY PROTOCOL",
    hudStat: "Session Integrity: 100% Guaranteed",
    hudPrivacyPill: "Personal Data Isolation: Active",
    hudPrivacyPillAr: "عزل البيانات الشخصية: نشط",
  },
  {
    id: "02",
    title: "Smart Hours & Breaks",
    titleAr: "ساعات عمل واستراحات ذكية",
    desc: "Precision time tracking with interactive breaks. The system instantly halts all location and biometric tracking during breaks to ensure absolute personal privacy, seamlessly supporting flexible dev shifts.",
    descAr:
      "تتبع دقيق للوقت مع استراحات تفاعلية. يوقف النظام فوراً كل تتبع للموقع والقياسات الحيوية أثناء الاستراحات لضمان الخصوصية الشخصية المطلقة، مع دعم سلس لمناوبات التطوير المرنة.",
    hudBadge: "TIME MATRIX // PRIVACY SHIELD",
    hudStat: "05h 42m Tracked • Flexible Shift",
    hudPrivacyPill: "Tracking Halted on Breaks: 100%",
    hudPrivacyPillAr: "إيقاف التتبع أثناء الاستراحة: 100%",
  },
  {
    id: "03",
    title: "Automated Dev Workflows",
    titleAr: "أتمتة مسارات التطوير",
    desc: "Seamless GitHub and GitLab integrations tying active hours to real productivity. Enjoy automated task handoffs (Dev → QA) and intelligent bottleneck escalation.",
    descAr:
      "تكامل سلس مع GitHub و GitLab يربط ساعات العمل بالإنتاجية الحقيقية. استمتع بتسليم آلي للمهام (من المطورين إلى فرق الجودة) وتصعيد ذكي للاختناقات البرمجية.",
    hudBadge: "CI/CD PIPELINE // GIT HOOKS",
    hudStat: "Dev → QA Automated Handoff",
    hudPrivacyPill: "Code-Only Telemetry: Secure",
    hudPrivacyPillAr: "تتبع مقتصر على الشيفرة: آمن",
  },
  {
    id: "04",
    title: "The Points Matrix",
    titleAr: "مصفوفة النقاط والتقييم",
    desc: "A programmatic, fair evaluation engine. Earn green streaks and intelligently recover from infractions using the transparent 5x/15x logic to unlock merits.",
    descAr:
      "محرك تقييم برمجي وعادل. اكسب سلاسل الإنجاز الخضراء، وتجاوز المخالفات بذكاء عبر منطق 5x/15x الشفاف لفتح الاستحقاقات والترقيات.",
    hudBadge: "MERIT ENGINE // TRANSPARENT",
    hudStat: "14-Day Streak • 5x/15x Recovery",
    hudPrivacyPill: "Zero Arbitrary Penalties",
    hudPrivacyPillAr: "انعدام العقوبات العشوائية",
  },
  {
    id: "05",
    title: "Unified HR & Dashboards",
    titleAr: "لوحات تحكم وموارد بشرية موحدة",
    desc: "A centralized ecosystem featuring interactive Kanban boards, seamless leave management, and a transparent, fair dispute resolution workflow.",
    descAr:
      "منظومة مركزية تضم لوحات كانبان تفاعلية، وإدارة سلسة للإجازات، ومسار عمل عادل وشفاف لفض النزاعات والاعتراضات.",
    hudBadge: "CENTRAL ECOSYSTEM // KANBAN",
    hudStat: "Multi-Board Synchronization",
    hudPrivacyPill: "Confidential Dispute Flow",
    hudPrivacyPillAr: "مسار نزاعات سري وعادل",
  },
];

export const PlatformFeatures: React.FC = () => {
  const { lang } = useWateera();
  // Active row state: null initially; expands on hover and collapses when mouse leaves
  const [activeRow, setActiveRow] = useState<string | null>(null);

  return (
    <section
      id="platform-features"
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="relative z-30 w-full bg-[#050409] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] overflow-hidden"
    >
      {/* Ambient background atmosphere glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 900px 600px at 50% 20%, rgba(200, 75, 254, 0.08), rgba(79, 70, 229, 0.05) 40%, transparent 75%)",
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-[#C84BFE]/25 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C84BFE] mb-4 shadow-[0_0_15px_rgba(200,75,254,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C84BFE] animate-pulse" />
            {lang === "ar" ? "بنية منصة وتيرة" : "WATEERA PLATFORM ARCHITECTURE"}
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
            {lang === "ar" ? "خدماتنا" : "Our Services"}
          </h2>

          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            {lang === "ar"
              ? "معيارية، متصلة، ومصممة لتحقيق أعلى درجات التدفق والخصوصية والإنجاز."
              : "Modular, connected, and designed for flow."}
          </p>
        </div>

        {/* 1. Accordion Layout: Main Container with Scroll-Reveal Staggered Animation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          onMouseLeave={() => setActiveRow(null)}
          className="w-full border-t border-white/10"
        >
          {services.map((service) => {
            const isActive = activeRow === service.id;

            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                onMouseEnter={() => setActiveRow(service.id)}
                className={`group relative border-b border-white/10 transition-colors duration-300 ${
                  isActive ? "bg-white/[0.02]" : "hover:bg-white/[0.01]"
                }`}
              >
                {/* Default Row Header */}
                <div
                  onClick={() => setActiveRow(isActive ? null : service.id)}
                  className="flex items-center justify-between py-8 sm:py-10 px-4 sm:px-6 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-5 sm:gap-10">
                    {/* Numeric index: 05 // in Arabic (on the right), // 05 in English */}
                    <span
                      dir="ltr"
                      className={`font-mono text-sm sm:text-base font-semibold tracking-widest transition-colors duration-300 shrink-0 select-none ${
                        isActive ? "text-[#C84BFE]" : "text-slate-500"
                      }`}
                    >
                      {lang === "ar" ? `${service.id} //` : `// ${service.id}`}
                    </span>

                    {/* Service Title: Enlarged text-3xl md:text-4xl lg:text-5xl font-extrabold */}
                    <h3
                      className={`text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wide leading-tight transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r rtl:bg-gradient-to-l from-[#C84BFE] via-[#8B5CF6] to-[#4F46E5] bg-clip-text text-transparent rtl:-translate-x-2 ltr:translate-x-2"
                          : "text-white group-hover:text-slate-200"
                      }`}
                    >
                      {lang === "ar" ? service.titleAr : service.title}
                    </h3>
                  </div>

                  {/* Smooth Arrow Rotation Indicator */}
                  <div
                    className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border transition-all duration-300 shrink-0 ${
                      isActive
                        ? "border-[#C84BFE]/60 bg-[#C84BFE]/15 text-[#C84BFE] rotate-45 rtl:-rotate-45 shadow-[0_0_20px_rgba(200,75,254,0.35)]"
                        : "border-white/10 bg-white/[0.02] text-slate-400 group-hover:border-white/25 group-hover:text-white"
                    }`}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform duration-300 rtl:-scale-x-100"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </div>
                </div>

                {/* 2. Hover Expansion (Framer Motion: 60fps buttery-smooth height animation) */}
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      key={`accordion-content-${service.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: {
                          height: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.35, delay: 0.08 },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.18 },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-6 pb-10 sm:pb-12 pt-2">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                          {/* Column 1: Privacy-Emphasized Description (Enlarged for effortless readability) */}
                          <div className="lg:col-span-7 space-y-4 rtl:text-right ltr:text-left">
                            <p className="text-lg md:text-xl font-medium text-gray-200 leading-relaxed max-w-2xl">
                              {lang === "ar" ? service.descAr : service.desc}
                            </p>
                          </div>

                          {/* Column 2: Micro-UI Graphic (Dark Glassmorphic Box with Radiant Glow) */}
                          <div className="lg:col-span-5 flex justify-center lg:justify-end rtl:lg:justify-start">
                            <div className="relative w-full max-w-sm sm:max-w-md aspect-[16/10] rounded-xl bg-[#0B0A10] border border-white/10 p-4 sm:p-5 overflow-hidden flex flex-col justify-between shadow-[0_0_35px_rgba(200,75,254,0.18)]">
                              {/* Vibrant radial-gradient blur of #C84BFE, #8B5CF6, and #4F46E5 */}
                              <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -inset-6 opacity-80 blur-2xl"
                                style={{
                                  background:
                                    "radial-gradient(circle at 60% 40%, rgba(200, 75, 254, 0.45), rgba(139, 92, 246, 0.3) 30%, rgba(79, 70, 229, 0.25) 55%, transparent 75%)",
                                }}
                              />

                              {/* Card Glass Body Header */}
                              <div className="relative z-10 flex items-center justify-between text-xs font-mono">
                                <span className="flex items-center gap-2 text-white font-semibold">
                                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                  <span className="text-emerald-400 font-bold">Active</span>
                                  <span className="text-slate-500">•</span>
                                  <span>SERVICE // {service.id}</span>
                                </span>
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/[0.05] border border-white/15 text-slate-300 shadow-sm">
                                  WATEERA OS
                                </span>
                              </div>

                              {/* Center Graphic Details: Abstract Tech HUD Elements */}
                              <div className="relative z-10 my-auto py-2">
                                <div className="rounded-xl bg-black/60 border border-white/10 p-3.5 backdrop-blur-sm space-y-2 font-mono">
                                  <div className="flex justify-between items-center text-[11px]">
                                    <span className="text-slate-400">{service.hudBadge}</span>
                                    <span className="text-emerald-400 font-semibold">Protected ✓</span>
                                  </div>
                                  <div className="text-xs sm:text-sm text-white font-semibold flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#C84BFE]" />
                                    {service.hudStat}
                                  </div>
                                </div>
                              </div>

                              {/* Bottom Glass Footer: Privacy Protocol Status */}
                              <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-white/[0.08] pt-3">
                                <span className="flex items-center gap-1.5">
                                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                                  <span>
                                    {lang === "ar"
                                      ? service.hudPrivacyPillAr
                                      : service.hudPrivacyPill}
                                  </span>
                                </span>
                                <span className="text-[#C84BFE] font-medium shrink-0">
                                  {lang === "ar" ? "خصوصية صارمة" : "STRICT PRIVACY"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
