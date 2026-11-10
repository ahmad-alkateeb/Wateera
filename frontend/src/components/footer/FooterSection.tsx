"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useWateera } from "../../context/WateeraContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface FooterLinkItem {
  labelEn: string;
  labelAr: string;
  href: string;
}

interface FooterColumn {
  id: string;
  titleEn: string;
  titleAr: string;
  links: FooterLinkItem[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    id: "product",
    titleEn: "Product",
    titleAr: "المنتج",
    links: [
      { labelEn: "Features", labelAr: "المميزات والخدمات", href: "#platform-features" },
      { labelEn: "Pricing", labelAr: "الأسعار والباقات", href: "#pricing-plans" },
      { labelEn: "Security", labelAr: "الأمان السياقي", href: "#why-choose-wateera" },
      { labelEn: "EVA", labelAr: "من هي EVA", href: "#eva-showcase" },
    ],
  },
  {
    id: "resources",
    titleEn: "Resources",
    titleAr: "المصادر",
    links: [
      { labelEn: "Documentation", labelAr: "التوثيق التقني", href: "#faq" },
      { labelEn: "API", labelAr: "واجهة البرمجة (API)", href: "#how-it-works" },
      { labelEn: "Community", labelAr: "مجتمع المطورين", href: "#testimonials" },
    ],
  },
  {
    id: "company",
    titleEn: "Company",
    titleAr: "الشركة",
    links: [
      { labelEn: "About", labelAr: "عن وتيرة", href: "#hero" },
      { labelEn: "Careers", labelAr: "الوظائف", href: "#why-choose-wateera" },
      { labelEn: "Contact", labelAr: "تواصل معنا", href: "#pricing-plans" },
    ],
  },
  {
    id: "legal",
    titleEn: "Legal",
    titleAr: "القانونية",
    links: [
      { labelEn: "Privacy", labelAr: "سياسة الخصوصية", href: "#faq" },
      { labelEn: "Terms", labelAr: "الشروط والأحكام", href: "#faq" },
    ],
  },
];

export const FooterSection: React.FC = () => {
  const { lang } = useWateera();
  const isAr = lang === "ar";

  const footerRef = useRef<HTMLElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const linksGridRef = useRef<HTMLDivElement | null>(null);
  const copyrightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const cta = ctaRef.current;
    const linksGrid = linksGridRef.current;
    const copyright = copyrightRef.current;

    if (!footer || !cta || !linksGrid || !copyright) return;

    const ctx = gsap.context(() => {
      const linkCols = linksGrid.querySelectorAll(".footer-col");
      const staggerTargets = [cta, ...Array.from(linkCols), copyright];

      gsap.set(staggerTargets, {
        opacity: 0,
        y: 40,
      });

      gsap.to(staggerTargets, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footer,
          start: "top 82%",
          once: true,
          invalidateOnRefresh: true,
        },
      });
    }, footer);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      id="wateera-footer"
      dir={isAr ? "rtl" : "ltr"}
      className="relative z-30 w-full bg-[#050505] pt-24 pb-12 sm:pt-32 sm:pb-16 overflow-hidden border-t border-white/10 select-none"
    >
      {/* Ambient Volumetric Brand Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] sm:w-[820px] h-[300px] rounded-full bg-gradient-to-r from-[#C84BFE]/15 via-[#8B5CF6]/12 to-[#4F46E5]/12 blur-[150px]"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        {/* 1. TOP SECTION: THE CALL TO ACTION (CTA) */}
        <div
          ref={ctaRef}
          className="relative rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md p-8 sm:p-12 lg:p-14 mb-16 sm:mb-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.65)]"
        >
          {/* Subtle Inner Corner Aura */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-[#C84BFE]/20 via-[#8B5CF6]/15 to-transparent blur-3xl"
          />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#C84BFE]/30 text-xs font-mono uppercase tracking-[0.2em] text-[#C84BFE] mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#C84BFE]" />
              {isAr ? "ابدأ رحلتك الآن // وتيرة" : "GET STARTED // WATEERA OS"}
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {isAr
                ? "هل أنت مستعد لقيادة عالمك الرقمي؟"
                : "Ready to command your digital universe?"}
            </h2>
          </div>

          {/* Premium Glass + Brand Glow CTA Button */}
          <div className="relative z-10 shrink-0">
            <a
              href="#pricing-plans"
              className="group relative inline-flex items-center gap-3 px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-white/[0.07] hover:bg-gradient-to-r hover:from-[#C84BFE] hover:to-[#8B5CF6] border border-[#C84BFE]/45 hover:border-transparent backdrop-blur-md text-sm sm:text-base font-bold text-white shadow-[0_0_30px_rgba(200,75,254,0.25)] hover:shadow-[0_0_50px_rgba(200,75,254,0.55)] transition-all duration-300"
            >
              <span>{isAr ? "ابدأ تجربة 14 يوماً" : "Start 14-Day Trial"}</span>
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* 2. MIDDLE SECTION: CLASSIC BRAND + 4-COLUMN LINKS GRID */}
        <div
          ref={linksGridRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 sm:pb-16 border-b border-white/10"
        >
          {/* Brand Column */}
          <div className="footer-col lg:col-span-4 flex flex-col justify-between">
            <div>
              <a
                href="#hero"
                className="inline-flex items-center gap-2.5 text-2xl font-black tracking-tight text-white mb-4"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#C84BFE] to-[#8B5CF6] shadow-[0_0_12px_rgba(200,75,254,0.8)]" />
                <span>WATEERA</span>
              </a>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-sm">
                {isAr
                  ? "بيئة العمل الرقمية المتكاملة للفرق الهندسية الجادة. تركيز عميق وأمان ذكي بقيادة EVA."
                  : "The autonomous workspace engineered for serious teams. Deep work, smart hours, and context-aware security powered by EVA."}
              </p>
            </div>
          </div>

          {/* 4 Link Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.id} className="footer-col flex flex-col">
                <h3 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.18em] text-white mb-4">
                  {isAr ? column.titleAr : column.titleEn}
                </h3>

                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.labelEn}>
                      <a
                        href={link.href}
                        className="inline-block text-sm text-slate-400 hover:text-[#C84BFE] ltr:hover:translate-x-1 rtl:hover:-translate-x-1 transition-all duration-300"
                      >
                        {isAr ? link.labelAr : link.labelEn}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 3. BOTTOM SECTION: CLASSIC COPYRIGHT BAR */}
        <div
          ref={copyrightRef}
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500"
        >
          <p dir="ltr">© 2026 Wateera. All rights reserved.</p>
          <p className="font-mono text-xs tracking-wider text-slate-500">
            {isAr
              ? "مُصمم للتركيز العميق • مدعوم بواسطة EVA"
              : "ENGINEERED FOR DEEP WORK • POWERED BY EVA"}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
