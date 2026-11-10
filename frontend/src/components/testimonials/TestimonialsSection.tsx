"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Sparkles } from "lucide-react";
import { useWateera } from "../../context/WateeraContext";

export interface ReviewItem {
  id: number;
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  gender: "male" | "female";
  rating: number;
  text: string;
  textAr: string;
  avatar: string;
}

const reviews: ReviewItem[] = [
  {
    id: 1,
    name: "Omar Yassin",
    nameAr: "عمر ياسين",
    role: "CTO at TechFlow",
    roleAr: "المدير التقني في TechFlow",
    gender: "male",
    rating: 4.9,
    text: "EVA's Smart Hours completely changed our workflow. The environment is pure focus, and deployment speed doubled.",
    textAr:
      "غيّرت الساعات الذكية من إيفا مسار عملنا بالكامل. بيئة تركيز صافية ضاعفت سرعة الإطلاق لدينا مرتين.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    nameAr: "سارة جينكنز",
    role: "Lead Developer",
    roleAr: "كبيرة المطورين",
    gender: "female",
    rating: 4.8,
    text: "The Points Matrix gamifies our sprints perfectly. It’s fair, transparent, and seamlessly integrated.",
    textAr:
      "تضيف مصفوفة النقاط روح التحفيز إلى مهامنا بشكل مثالي؛ نظام عادل، شفاف، ومتكامل بسلاسة تامة.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Tariq Mansour",
    nameAr: "طارق منصور",
    role: "Security Architect",
    roleAr: "مهندس معمارية الأمان",
    gender: "male",
    rating: 5.0,
    text: "Context-aware security that doesn't annoy developers. The dual-layer auth is practically invisible.",
    textAr:
      "أمان واعي بالسياق لا يزعج المطورين إطلاقاً؛ التحقق الثنائي يعمل بدقة غير مرئية في الخلفية.",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    id: 4,
    name: "Layla Haddad",
    nameAr: "ليلى حداد",
    role: "Product Manager",
    roleAr: "مديرة المنتجات",
    gender: "female",
    rating: 4.7,
    text: "Finally, a workspace that handles the administrative chaos for us. EVA is a brilliant autonomous orchestrator.",
    textAr:
      "أخيراً بيئة عمل تتولى الفوضى الإدارية نيابةً عنا. إيفا منظّم ذاتي عبقري يقود العمل بسلاسة.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 5,
    name: "David Chen",
    nameAr: "ديفيد تشن",
    role: "VP of Engineering",
    roleAr: "نائب رئيس الهندسة",
    gender: "male",
    rating: 4.9,
    text: "Eliminating background friction has saved us countless hours. Highly recommended for serious teams.",
    textAr:
      "القضاء على العوائق الجانبية وفّر علينا ساعات لا تُحصى. أنصح بها بشدة للفرق التقنية الجادة.",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
];

export const TestimonialsSection: React.FC = () => {
  const { lang } = useWateera();
  const isAr = lang === "ar";

  const trackRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [radius, setRadius] = useState<number>(370);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Exact 3D cylinder radius calculation for 5 compact landscape cards (72° apart):
  // R = W / (2 * tan(36°)) + gap -> ~370px on desktop (for 400px card), ~255px on mobile (for 290px card)
  useEffect(() => {
    const updateRadius = () => {
      if (typeof window === "undefined") return;
      const vw = window.innerWidth;
      if (vw < 640) {
        setRadius(255);
      } else if (vw < 1024) {
        setRadius(330);
      } else {
        setRadius(375);
      }
    };

    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  // Pure Y-axis rotation (rotateX: 0, rotateZ: 0) so cards NEVER tilt or distort
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      gsap.set(track, {
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        transformStyle: "preserve-3d",
      });

      const tl = gsap.timeline({ repeat: -1 });
      tl.to(track, {
        rotateY: -360,
        duration: 26,
        ease: "none",
      });

      tlRef.current = tl;
    }, track);

    return () => {
      tlRef.current = null;
      ctx.revert();
    };
  }, []);

  const handleMouseEnter = () => {
    setIsPaused(true);
    tlRef.current?.pause();
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    tlRef.current?.play();
  };

  const totalCards = reviews.length;
  const angleStep = 360 / totalCards; // 72deg per card for 5 cards

  return (
    <section
      id="testimonials"
      dir="ltr"
      className="relative z-30 w-full min-h-screen bg-[#050505] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* Subtle Wateera Ambient Glow Behind Cylinder */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[580px] h-[280px] sm:h-[360px] rounded-full bg-gradient-to-r from-[#C84BFE]/15 via-[#8B5CF6]/15 to-[#4F46E5]/10 blur-[140px]"
      />

      {/* Section Header */}
      <div
        dir={isAr ? "rtl" : "ltr"}
        className="relative z-20 text-center max-w-2xl mx-auto mb-14 sm:mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-[#C84BFE]/25 text-xs font-mono uppercase tracking-[0.2em] text-[#C84BFE] mb-3.5 shadow-[0_0_15px_rgba(200,75,254,0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-[#C84BFE]" />
          {isAr ? "آراء العملاء // ثقة الفرق التقنية" : "CUSTOMER REVIEWS // TRUSTED BY TEAMS"}
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
          {isAr ? "ماذا يقول قادة التقنية عن وتيرة" : "Loved by High-Velocity Teams"}
        </h2>

        <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
          {isAr
            ? "تجارب حقيقية لفرق هندسية ضاعفت تركيزها وإنتاجيتها مع إيفا."
            : "Real feedback from engineering leaders orchestrating their deep work with EVA."}
        </p>
      </div>

      {/* ==================== 3D CYLINDER STAGE (Zero X-Tilt, Pure Horizontal Ring) ==================== */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative z-20 w-full h-[250px] sm:h-[270px] flex items-center justify-center"
        style={{
          perspective: "1600px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* Inner Rotating Track Container */}
        <div
          ref={trackRef}
          className="relative w-[290px] sm:w-[360px] lg:w-[400px] h-[195px] sm:h-[205px] will-change-transform"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {reviews.map((review, index) => {
            const angle = index * angleStep;

            return (
              <article
                key={review.id}
                dir={isAr ? "rtl" : "ltr"}
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "visible",
                }}
                className="group absolute inset-0 w-[290px] sm:w-[360px] lg:w-[400px] h-[195px] sm:h-[205px] bg-[#0B0A12]/90 bg-white/5 border border-white/10 hover:border-[#C84BFE]/55 backdrop-blur-md rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-[0_18px_45px_rgba(0,0,0,0.7)] hover:shadow-[0_0_35px_rgba(200,75,254,0.2)] transition-colors duration-300"
              >
                {/* Top Subtle Brand Highlight */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 left-5 right-5 h-[1px] bg-gradient-to-r from-transparent via-[#C84BFE]/50 to-transparent"
                />

                {/* 1. TOP ROW: User Profile Picture, Name, Role & Gender-aware Badge */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full p-[1.5px] bg-gradient-to-tr from-[#C84BFE] to-[#8B5CF6] shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={review.avatar}
                        alt={isAr ? review.nameAr : review.name}
                        loading="lazy"
                        className="w-full h-full rounded-full object-cover bg-[#12101B]"
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-white truncate">
                        {isAr ? review.nameAr : review.name}
                      </h3>
                      <p className="text-xs text-slate-400 truncate">
                        {isAr ? review.roleAr : review.role}
                      </p>
                    </div>
                  </div>

                  {/* Rating Pill */}
                  <div
                    dir="ltr"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/25 text-xs font-mono font-bold text-yellow-400 shrink-0"
                  >
                    <span>★</span>
                    <span>{review.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* 2. MIDDLE ROW: 5 Gold Stars Rating */}
                <div className="flex items-center gap-1 my-1.5" dir="ltr">
                  {Array.from({ length: 5 }).map((_, starIdx) => (
                    <svg
                      key={starIdx}
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.35)]"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* 3. BOTTOM ROW: Italicized Testimonial Text */}
                <p className="text-xs sm:text-sm italic font-medium text-slate-200/95 leading-relaxed line-clamp-3">
                  “{isAr ? review.textAr : review.text}”
                </p>
              </article>
            );
          })}
        </div>
      </div>

      {/* Subtle Pause Status Indicator Below Cylinder */}
      <div className="relative z-20 mt-12 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-mono text-slate-400">
        <span
          className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
            isPaused ? "bg-amber-400" : "bg-emerald-400 animate-pulse"
          }`}
        />
        <span>
          {isAr
            ? isPaused
              ? "تم إيقاف الدوران مؤقتاً للقراءة"
              : "مرّر الماوس لإيقاف الدوران مؤقتاً"
            : isPaused
            ? "PAUSED FOR READING"
            : "HOVER TO PAUSE ROTATION"}
        </span>
      </div>
    </section>
  );
};

export default TestimonialsSection;
