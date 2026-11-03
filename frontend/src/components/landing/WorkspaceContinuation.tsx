"use client";

import React from "react";
import { Cpu, Layers, Sparkles } from "lucide-react";
import { useWateera } from "../../context/WateeraContext";

const WORKSPACE_PILLARS = [
  {
    id: "modular-canvas",
    icon: Layers,
    accent: "#C84BFE",
    titleEn: "Adaptive Digital Canvas",
    titleAr: "مساحة عمل متكيفة ومرنة",
    descriptionEn:
      "Arrange your thoughts, tasks, and knowledge inside a minimalist, distraction-free environment engineered for deep work.",
    descriptionAr:
      "رتّب أفكارك ومهامك ومعارفك داخل بيئة مبسطة وخالية من المشتتات صُممت للعمل العميق.",
  },
  {
    id: "eva-companion",
    icon: Sparkles,
    accent: "#8B5CF6",
    titleEn: "Intelligent Orchestration",
    titleAr: "إدارة ذكية ومتكاملة",
    descriptionEn:
      "Interact effortlessly with EVA. She anticipates your needs, responds contextually, and keeps your momentum going without breaking your flow.",
    descriptionAr:
      "تفاعل بكل سهولة مع EVA؛ حيث تستبق احتياجاتك وتستجيب بذكاء للحفاظ على تدفق إنجازك دون انقطاع.",
  },
  {
    id: "fluid-engine",
    icon: Cpu,
    accent: "#4F46E5",
    titleEn: "Zero-Friction Fluidity",
    titleAr: "انسيابية فائقة بلا عوائق",
    descriptionEn:
      "Engineered for instant responsiveness. Your creative process, real-time collaboration, and navigation stay locked in perfect sync.",
    descriptionAr:
      "صُممت لاستجابة فورية؛ لتظل عمليتك الإبداعية وتعاونك في الوقت الفعلي وتنقلك في تناغم تام.",
  },
];

export const WorkspaceContinuation: React.FC = () => {
  const { lang } = useWateera();

  return (
    <section
      id="eva-showcase"
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
