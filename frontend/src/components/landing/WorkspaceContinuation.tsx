"use client";

import React from "react";
import { Building2, Code2, Cpu, Layers, ShieldCheck, Zap } from "lucide-react";
import { useWateera } from "../../context/WateeraContext";

const WORKSPACE_PILLARS = [
  // Row 1 — Who It's Built For (Target Software Roles)
  {
    id: "for-software-engineers",
    icon: Code2,
    accent: "#C84BFE",
    titleEn: "For Software Engineers",
    titleAr: "لمهندسي البرمجيات",
    descriptionEn:
      "Eliminate context-switching and ship clean code faster in a distraction-free environment integrated with your dev pipeline.",
    descriptionAr:
      "تخلص من التشتت وسرّع كتابة وتسليم الكود في بيئة عمل هادئة ومرتبطة مباشرة بمسار التطوير.",
  },
  {
    id: "for-tech-leads",
    icon: Cpu,
    accent: "#8B5CF6",
    titleEn: "For Tech Leads & Scrum Masters",
    titleAr: "لقادة الفرق التقنية (Tech Leads)",
    descriptionEn:
      "Gain instant clarity on sprint velocity, code bottlenecks, and developer workload without micromanaging.",
    descriptionAr:
      "احصل على رؤية لحظية لسرعة السبرنت، اختناقات الكود، وتوزيع المهام البرمجية بدون تعقيد إداري.",
  },
  {
    id: "for-software-houses",
    icon: Building2,
    accent: "#4F46E5",
    titleEn: "For Software Houses & Startups",
    titleAr: "لشركات البرمجة والـ Startups",
    descriptionEn:
      "Scale your engineering operations in one unified workspace covering backlogs, smart hours, and fair evaluation.",
    descriptionAr:
      "وسّع عملياتك الهندسية في منصة موحدة تجمع إدارة المشاريع، الساعات الذكية، والتقييم العادل للمطورين.",
  },

  // Row 2 — Our Impact & Why Choose Wateera
  {
    id: "deep-work-focus",
    icon: Zap,
    accent: "#C84BFE",
    titleEn: "3x Deep Work Focus",
    titleAr: "تركيز برمجي مضاعف 3 مرات",
    descriptionEn:
      "By automating administrative updates and status reporting, Wateera triples uninterrupted coding hours.",
    descriptionAr:
      "عبر أتمتة المتابعات الإدارية وتقارير الإنجاز، تضاعف وتيرة ساعات البرمجة العميقة بلا مقاطعة.",
  },
  {
    id: "session-security-integrity",
    icon: ShieldCheck,
    accent: "#8B5CF6",
    titleEn: "99.9% Session & Security Integrity",
    titleAr: "أمان وموثوقية جلسات 99.9%",
    descriptionEn:
      "Context-aware security and smart session tracking keep engineering workspaces protected without breaking flow.",
    descriptionAr:
      "حماية ذكية مدركة للسياق وتتبع دقيق للجلسات يحافظ على أمان بيئة العمل البرمجية دون قطع تركيز المطور.",
  },
  {
    id: "scattered-tools-replaced",
    icon: Layers,
    accent: "#4F46E5",
    titleEn: "5+ Scattered Tools Replaced",
    titleAr: "استبدال +5 أدوات مبعثرة",
    descriptionEn:
      "Stop paying for disconnected apps. Unify task boards, time tracking, points matrix, and AI orchestration.",
    descriptionAr:
      "توقف عن تشتيت فريقك بين التطبيقات؛ اجمع لوحات المهام، تتبع الوقت، مصفوفة النقاط، والذكاء الاصطناعي بمكان واحد.",
  },
];

export const WorkspaceContinuation: React.FC = () => {
  const { lang } = useWateera();

  return (
    <section
      id="features"
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="relative z-20 w-full bg-[#000000] py-24 sm:py-32 px-6 lg:px-10"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <div
          id="meet-eva"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full"
        >
          {WORKSPACE_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="group relative overflow-hidden rounded-2xl p-[2px] h-full"
              >
                {/* 2. The Spinning Gradient: dual chasing beams with Wateera's colors */}
                <div
                  className="absolute w-[200%] h-[200%] -left-1/2 -top-1/2 animate-spin [animation-duration:4s] pointer-events-none"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0 120deg, #C84BFE 120deg, #8B5CF6 150deg, #4F46E5 180deg, transparent 180deg 300deg, #C84BFE 300deg, #8B5CF6 330deg, #4F46E5 360deg)",
                  }}
                />

                {/* 3. Inner Card Content: 2px inset on top of spinning background */}
                <div className="relative z-10 h-full w-full bg-black rounded-xl flex flex-col p-7 sm:p-8">
                  <div
                    className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/[0.08]"
                    style={{ color: pillar.accent }}
                  >
                    <Icon size={20} />
                  </div>

                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2.5 tracking-tight">
                    {lang === "ar" ? pillar.titleAr : pillar.titleEn}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                    {lang === "ar" ? pillar.descriptionAr : pillar.descriptionEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
