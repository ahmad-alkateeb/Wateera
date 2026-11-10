"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HelpCircle, Plus } from "lucide-react";
import { useWateera } from "../../context/WateeraContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface FaqItem {
  id: number;
  question: string;
  questionAr: string;
  answer: string;
  answerAr: string;
}

const faqs: FaqItem[] = [
  {
    id: 1,
    question: "Why is a corporate email and credit card required for the trial?",
    questionAr: "لماذا يتطلب التسجيل في الفترة التجريبية بريداً رسمياً للشركة وبطاقة ائتمان؟",
    answer:
      "Wateera is an enterprise-grade platform built for serious teams. The credit card wall and domain gating ensure our premium resources and EVA's computational power are dedicated exclusively to committed users. You won't be charged during the 14-day trial.",
    answerAr:
      "وتيرة منصة بمستوى المؤسسات صُممت للفرق الجادة. يضمن التحقق من نطاق الشركة والبطاقة الائتمانية تخصيص مواردنا الفائقة والقدرة الحاسوبية لإيفا حصرياً للمستخدمين الملتزمين. لن يتم خصم أي مبلغ خلال فترة التجربة الممتدة لـ 14 يوماً.",
  },
  {
    id: 2,
    question: "How does the Context-Aware Security work?",
    questionAr: "كيف يعمل نظام الأمان الواعي بالسياق (Context-Aware Security)؟",
    answer:
      "It operates invisibly in the background. EVA uses dual-layer verification and continuous behavioral monitoring to ensure session integrity without forcing you through constant manual authentication loops.",
    answerAr:
      "يعمل بشكل غير مرئي تماماً في الخلفية؛ حيث تستخدم إيفا التحقق الثنائي والمراقبة السلوكية المستمرة لضمان سلامة الجلسة دون إجبارك على خطوات تحقق يدوية متكررة تقطع تركيزك.",
  },
  {
    id: 3,
    question: "Will EVA disrupt our current development tools like GitHub?",
    questionAr: "هل ستتعارض إيفا مع أدوات التطوير الحالية لدينا مثل GitHub؟",
    answer:
      "Not at all. EVA is designed to be an autonomous orchestrator. She seamlessly integrates with GitHub, Jira, and your current stack to align tasks and prepare your environment, rather than replacing your core tools.",
    answerAr:
      "على الإطلاق؛ صُممت إيفا لتكون منسقاً ذاتياً ذكياً. فهي تتكامل بسلاسة مع GitHub وJira وبيئتك البرمجية الحالية لمواءمة المهام وتجهيز مساحة عملك، بدلاً من استبدال أدواتك الأساسية.",
  },
  {
    id: 4,
    question: "Is the Points Matrix fair for different types of developers?",
    questionAr: "هل مصفوفة النقاط (Points Matrix) عادلة لمختلف تخصصات المطورين؟",
    answer:
      "Yes. The Points Matrix gamifies productivity by tracking 'Green Streaks' and deep work hours dynamically. It evaluates consistency and focus rather than just lines of code, syncing fairly with your Unified HR Dashboards.",
    answerAr:
      "نعم بكل تأكيد. تحفّز مصفوفة النقاط الإنتاجية من خلال تتبع «السلاسل الخضراء» وساعات العمل العميق ديناميكياً؛ فهي تقيّم الاستمرارية والتركيز بدلاً من مجرد عدد أسطر الكود، وتتزامن بعدالة مع لوحات الموارد البشرية الموحدة.",
  },
  {
    id: 5,
    question: "Do you offer On-Premise hosting for large enterprises?",
    questionAr: "هل توفرون استضافة داخلية خاصة (On-Premise) للمؤسسات الكبرى؟",
    answer:
      "Absolutely. Our Enterprise plan includes custom on-premise deployment, Active Directory sync, and completely customized workflows tailored to your organization's internal security protocols.",
    answerAr:
      "بالتأكيد. تتضمن باقة المؤسسات (Enterprise) استضافة داخلية مخصصة بالكامل، ومزامنة مع Active Directory، ومسارات عمل مصممة خصيصاً لتتوافق مع بروتوكولات الأمان الداخلية لمؤسستك.",
  },
];

export const FaqSection: React.FC = () => {
  const { lang } = useWateera();
  const isAr = lang === "ar";

  const [openId, setOpenId] = useState<number | null>(1);

  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const bodyRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const contentRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // GSAP ScrollTrigger Staggered Entrance for Header & FAQ Items
  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const list = listRef.current;
    if (!section || !list) return;

    const ctx = gsap.context(() => {
      const items = list.querySelectorAll(".faq-item");

      if (header) {
        gsap.set(header, { opacity: 0, y: 28 });
      }
      gsap.set(items, { opacity: 0, y: 32 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
          invalidateOnRefresh: true,
        },
      });

      if (header) {
        tl.to(
          header,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
          },
          0
        );
      }

      tl.to(
        items,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
        },
        0.15
      );
    }, section);

    return () => ctx.revert();
  }, []);

  // GSAP Smooth Accordion Height & Opacity Animation on `openId` or `lang` change
  useEffect(() => {
    faqs.forEach((faq) => {
      const bodyEl = bodyRefs.current[faq.id];
      const contentEl = contentRefs.current[faq.id];
      if (!bodyEl || !contentEl) return;

      const isOpen = openId === faq.id;

      gsap.killTweensOf(bodyEl);
      gsap.killTweensOf(contentEl);

      if (isOpen) {
        const targetHeight = contentEl.scrollHeight;
        gsap.to(bodyEl, {
          height: targetHeight,
          duration: 0.42,
          ease: "power3.out",
          onComplete: () => {
            gsap.set(bodyEl, { height: "auto" });
            ScrollTrigger.refresh();
          },
        });
        gsap.to(contentEl, {
          opacity: 1,
          y: 0,
          duration: 0.36,
          delay: 0.05,
          ease: "power2.out",
        });
      } else {
        gsap.to(bodyEl, {
          height: 0,
          duration: 0.34,
          ease: "power3.inOut",
          onComplete: () => {
            ScrollTrigger.refresh();
          },
        });
        gsap.to(contentEl, {
          opacity: 0,
          y: -6,
          duration: 0.22,
          ease: "power2.in",
        });
      }
    });
  }, [openId, lang]);

  const toggleFaq = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      dir={isAr ? "rtl" : "ltr"}
      className="relative z-30 w-full bg-[#050505] py-28 sm:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden select-none"
    >
      {/* Ambient Wateera Volumetric Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] sm:w-[680px] h-[480px] sm:h-[680px] rounded-full bg-gradient-to-tr from-[#C84BFE]/12 via-[#8B5CF6]/12 to-transparent blur-[170px]"
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-[#C84BFE]/25 text-xs font-mono uppercase tracking-[0.2em] text-[#C84BFE] mb-4 shadow-[0_0_15px_rgba(200,75,254,0.15)]">
            <HelpCircle className="w-3.5 h-3.5 text-[#C84BFE]" />
            {isAr ? "الأسئلة الشائعة // مركز المعرفة" : "FAQ // FREQUENTLY ASKED QUESTIONS"}
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            {isAr ? "كل ما تحتاج معرفته عن وتيرة" : "Everything You Need to Know"}
          </h2>

          <p className="mt-3.5 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed">
            {isAr
              ? "إجابات واضحة ومباشرة حول الأمان، إيفا، ونظام التقييم الذكي في بيئة العمل."
              : "Clear answers on enterprise onboarding, EVA orchestration, security, and fair evaluation."}
          </p>
        </div>

        {/* Accordion List */}
        <div ref={listRef} className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openId === faq.id;
            const numBadge = String(idx + 1).padStart(2, "0");

            return (
              <div
                key={faq.id}
                className={`faq-item group relative rounded-2xl backdrop-blur-md transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-white/[0.07] border border-[#C84BFE]/50 shadow-[0_0_40px_rgba(200,75,254,0.15)]"
                    : "bg-white/5 border border-white/10 hover:border-white/25 hover:bg-white/[0.06]"
                }`}
              >
                {/* Top Active Accent Line */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C84BFE] to-transparent transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* Accordion Header Button */}
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full p-6 sm:p-7 flex items-center justify-between gap-4 text-start cursor-pointer"
                >
                  <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                    <span
                      dir="ltr"
                      className={`inline-flex items-center justify-center w-9 h-9 rounded-xl font-mono text-xs font-bold shrink-0 transition-all duration-300 ${
                        isOpen
                          ? "bg-gradient-to-br from-[#C84BFE] to-[#8B5CF6] text-black shadow-[0_0_18px_rgba(200,75,254,0.45)]"
                          : "bg-white/[0.05] border border-white/10 text-slate-400 group-hover:text-white"
                      }`}
                    >
                      {numBadge}
                    </span>

                    <h3
                      className={`text-base sm:text-lg lg:text-xl font-bold tracking-tight transition-colors duration-300 ${
                        isOpen ? "text-white" : "text-slate-200 group-hover:text-white"
                      }`}
                    >
                      {isAr ? faq.questionAr : faq.question}
                    </h3>
                  </div>

                  {/* Animated Plus / Close Icon */}
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                      isOpen
                        ? "bg-[#C84BFE]/20 border-[#C84BFE]/50 text-[#C84BFE] rotate-45 shadow-[0_0_15px_rgba(200,75,254,0.3)]"
                        : "bg-white/[0.04] border-white/10 text-slate-400 group-hover:border-white/25 group-hover:text-white"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </span>
                </button>

                {/* Collapsible Answer Body */}
                <div
                  ref={(el) => {
                    bodyRefs.current[faq.id] = el;
                  }}
                  style={{ height: faq.id === 1 ? "auto" : 0 }}
                  className="overflow-hidden"
                >
                  <div
                    ref={(el) => {
                      contentRefs.current[faq.id] = el;
                    }}
                    className="px-6 sm:px-7 pb-6 sm:pb-7 pt-0"
                  >
                    <div className="pt-4 border-t border-white/10 sm:ps-14">
                      <p className="text-sm sm:text-base text-slate-300/95 leading-relaxed">
                        {isAr ? faq.answerAr : faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
