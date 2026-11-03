"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  Compass,
  Pause,
  Pin,
  Play,
  Send,
  Settings2,
  Smile,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { Language } from "../../context/WateeraContext";
import { EVA_PATHS, EVA_PATHS_MAP } from "./EvaPaths";
import { ChatMessage, EvaEmotion, EvaPathId, EvaPathMode } from "./evaTypes";

interface EvaChatProps {
  lang: Language;
  evaPos: { xVw: number; yVh: number };
  emotion: EvaEmotion;
  pathMode: EvaPathMode;
  setPathMode: (mode: EvaPathMode) => void;
  activeRandomPathId: EvaPathId;
  isWanderingEnabled: boolean;
  setIsWanderingEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isNaturallyPaused: boolean;
  splineUrl: string;
  setSplineUrl: (url: string) => void;
  onTriggerHappy: () => void;
  onTriggerNaturalPause: (sec: number) => void;
  onClose: () => void;
}

export const EvaChat: React.FC<EvaChatProps> = ({
  lang,
  evaPos,
  emotion,
  pathMode,
  setPathMode,
  activeRandomPathId,
  isWanderingEnabled,
  setIsWanderingEnabled,
  isNaturallyPaused,
  splineUrl,
  setSplineUrl,
  onTriggerHappy,
  onTriggerNaturalPause,
  onClose,
}) => {
  const [showUrlConfig, setShowUrlConfig] = useState(false);
  const [inputMsg, setInputMsg] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text:
        lang === "ar"
          ? "مرحباً بك في وتيرة! 🤖 أنا EVA، رفيقك الذكي ثلاثي الأبعاد. اسألني عن مسارات طيراني الـ 14 أو بوابة الشعاع الفضائي أو تفاعل معي مباشرة!"
          : "Welcome to Wateera! 🤖 I'm EVA, your 3D AI companion. Ask me about my 14 autonomous flight paths, visor expressions, or sci-fi beam portal!",
      time: lang === "ar" ? "الآن" : "Now",
    },
  ]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateBotReply = (question: string): string => {
    const q = question.trim().toLowerCase();

    if (q.includes("مسار") || q.includes("طيران") || q.includes("path") || q.includes("14")) {
      return lang === "ar"
        ? "🧭 **نظام الطيران المستقل (14 مساراً):**\nأحلق بانسيابية عبر 14 مساراً هندسياً (مثل مدار المحيط، أجنحة الفراشة، والإنفينيتي ∞) مع ميلان فيزيائي طبيعي وتوقفات تأمل تلقائية."
        : "🧭 **14 Autonomous Flight Paths:**\nI glide smoothly across 14 geometric trajectories (Perimeter Orbit, Butterfly Wings, Infinity Wave ∞, etc.) with real aerodynamic banking and natural pauses.";
    }

    if (q.includes("سعيد") || q.includes("مشاعر") || q.includes("تعبير") || q.includes("happy") || q.includes("state")) {
      onTriggerHappy();
      return lang === "ar"
        ? "😊 **حالات EVA المحسّنة:**\nأعمل بحالتين فائقتي الخفة والانسيابية:\n1️⃣ **الحالة الأساسية (Basic):** عيون بيضاوية طبيعية مع رمش ثلاثي الأبعاد واقعي.\n2️⃣ **حالة السعادة (Happy):** عيون هلالية مضيئة وقفزة ترحيبية بزاوية 360°!"
        : "😊 **Optimized 3D States:**\nI run on two ultra-clean visor states:\n1️⃣ **Basic State:** Natural oval 3D eyes with smooth organic blinking.\n2️⃣ **Happy State:** Glowing crescent eyes + a celebratory 360° jump-spin!";
    }

    if (q.includes("شعاع") || q.includes("بوابة") || q.includes("beam") || q.includes("portal")) {
      return lang === "ar"
        ? "⚡ **بوابة الانتقال الفضائي (Sci-Fi Portal):**\nيمكنك استدعائي أو إخفائي في أي لحظة عبر زر EVA في الأعلى، حيث تفتح بوابة أرضية ثنائية الطبقات مع شعاع عمودي لانتقالي بسلاسة."
        : "⚡ **Sci-Fi Beam & Floor Portal:**\nUse the EVA button in the navbar or showcase to summon or beam me away through a two-layer holographic ground portal!";
    }

    return lang === "ar"
      ? `🤖 وصلتني رسالتك: "${question}"!\nيمكنك سحبي بالماوس لأي مكان على الشاشة، أو تغيير مسار طيراني من القائمة بالأعلى، أو تجربة أزرار المميزات السريعة.`
      : `🤖 Got your message: "${question}"!\nYou can drag me anywhere on screen, pick any of my 14 flight paths above, or tap a quick feature chip below!`;
  };

  const handleSendMessage = (customText?: string) => {
    const textToSend = (customText ?? inputMsg).trim();
    if (!textToSend) return;

    const timeLabel = new Date().toLocaleTimeString(lang === "ar" ? "ar-JO" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [
      ...prev,
      { id: `usr-${Date.now()}`, sender: "user", text: textToSend, time: timeLabel },
    ]);
    if (!customText) setInputMsg("");

    setTimeout(() => {
      const reply = generateBotReply(textToSend);
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now() + 1}`, sender: "bot", text: reply, time: timeLabel },
      ]);
    }, 380);
  };

  const isEvaOnRightHalf = evaPos.xVw > 50;
  const isEvaOnBottomHalf = evaPos.yVh > 52;

  const chatWindowStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 145,
    ...(isEvaOnRightHalf
      ? { left: `${Math.max(3, Math.min(62, evaPos.xVw - 26))}vw` }
      : { left: `${Math.max(4, Math.min(62, evaPos.xVw + 12))}vw` }),
    ...(isEvaOnBottomHalf
      ? { top: `${Math.max(4, Math.min(36, evaPos.yVh - 38))}vh` }
      : { top: `${Math.max(6, Math.min(38, evaPos.yVh + 2))}vh` }),
  };

  const activeDef =
    EVA_PATHS_MAP[pathMode === "random-wander" ? activeRandomPathId : pathMode] || EVA_PATHS[0];
  const activePathName = lang === "ar" ? activeDef.nameAr : activeDef.nameEn;

  return (
    <div
      style={chatWindowStyle}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="w-[92vw] sm:w-[390px] max-h-[80vh] p-[2.5px] rounded-3xl eva-gradient-border-60 shadow-sm animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="w-full h-full max-h-[calc(80vh-5px)] flex flex-col rounded-[calc(1.5rem-2.5px)] overflow-hidden backdrop-blur-2xl bg-white dark:bg-[#09051d]/95 text-slate-900 dark:text-white">
        {/* Header & Flight Controls */}
        <div className="p-4 bg-gradient-to-r from-[#C84BFE]/25 via-[#8B5CF6]/20 to-[#4F46E5]/25 border-b border-[#8B5CF6]/30 dark:border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#C84BFE] via-[#8B5CF6] to-[#4F46E5] flex items-center justify-center shadow-md shadow-purple-500/25">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold flex items-center gap-1.5">
                  {lang === "ar" ? "المساعد الذكي EVA (3D)" : "AI Assistant EVA (3D)"}
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-white/70">
                  {emotion === "happy"
                    ? lang === "ar"
                      ? "الحالة: سعيدة 😊"
                      : "State: Happy 😊"
                    : lang === "ar"
                      ? "الحالة: أساسية متوازنة • اضغط لإغلاق الشات"
                      : "State: Basic • Click EVA to close"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsWanderingEnabled((w) => !w)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  isWanderingEnabled
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                    : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                }`}
              >
                {isWanderingEnabled ? <Pause size={13} /> : <Play size={13} />}
                <span>{isWanderingEnabled ? (lang === "ar" ? "إيقاف" : "Pause") : (lang === "ar" ? "استئناف" : "Resume")}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowUrlConfig((s) => !s)}
                title="Spline 3D Scene URL"
                className="p-2 rounded-xl bg-slate-200/70 dark:bg-white/10 text-slate-700 dark:text-white/90 cursor-pointer"
              >
                <Settings2 size={14} />
              </button>
              <button
                type="button"
                onClick={onClose}
                title="Close"
                className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-600 dark:text-rose-300 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* 14 Paths Selector */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center justify-between gap-1 flex-wrap">
              <span className="text-[10px] font-bold text-slate-600 dark:text-white/70 flex items-center gap-1">
                <Compass size={12} className="text-[#8B5CF6]" />
                {lang === "ar" ? "مسار حركة EVA:" : "EVA Flight Path:"}
              </span>
              {pathMode === "random-wander" && isWanderingEnabled && (
                <span className="text-[9px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {isNaturallyPaused
                    ? lang === "ar" ? `تأمل 🍃 (${activePathName})` : `Observing 🍃 (${activePathName})`
                    : activePathName}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setPathMode("random-wander");
                  setIsWanderingEnabled(true);
                  onTriggerNaturalPause(2.0);
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                  pathMode === "random-wander" && isWanderingEnabled
                    ? "bg-gradient-to-r from-[#C84BFE] to-[#4F46E5] text-white"
                    : "bg-slate-200/70 dark:bg-white/10 text-slate-700 dark:text-white/75"
                }`}
              >
                <span>🎲</span>
                <span>{lang === "ar" ? "تجوال حر" : "Free Random"}</span>
              </button>

              <select
                value={pathMode === "random-wander" || pathMode === "pinned" ? "" : pathMode}
                onChange={(e) => {
                  if (e.target.value) {
                    setPathMode(e.target.value as EvaPathMode);
                    setIsWanderingEnabled(true);
                    onTriggerNaturalPause(2.0);
                  }
                }}
                className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white/80 dark:bg-white/10 text-slate-800 dark:text-white/90 border border-slate-300 dark:border-white/15 outline-none cursor-pointer max-w-[165px]"
              >
                <option value="" disabled>
                  {lang === "ar" ? "اختر مساراً (14) ▾" : "Pick path (14) ▾"}
                </option>
                {EVA_PATHS.map((p) => (
                  <option key={p.id} value={p.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {p.icon} {lang === "ar" ? p.nameAr : p.nameEn}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  setPathMode("pinned");
                  setIsWanderingEnabled(false);
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                  pathMode === "pinned" || !isWanderingEnabled
                    ? "bg-amber-500 text-slate-950"
                    : "bg-slate-200/70 dark:bg-white/10 text-slate-700 dark:text-white/75"
                }`}
              >
                <Pin size={10} />
                <span>{lang === "ar" ? "تثبيت" : "Pin"}</span>
              </button>
            </div>
          </div>

          {showUrlConfig && (
            <div className="pt-2 border-t border-slate-200 dark:border-white/10">
              <input
                type="text"
                value={splineUrl}
                onChange={(e) => setSplineUrl(e.target.value)}
                placeholder="/eva.splinecode"
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-black/50 border border-slate-300 dark:border-white/20 text-[11px] font-mono focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Quick EVA Feature Chips */}
        <div className="px-3.5 py-2.5 bg-slate-50/80 dark:bg-white/5 border-b border-slate-200/80 dark:border-white/10 flex gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => handleSendMessage(lang === "ar" ? "اشرح مسارات الطيران الـ 14" : "Explain the 14 flight paths")}
            className="shrink-0 px-2.5 py-1 rounded-full bg-[#C84BFE]/15 border border-[#C84BFE]/40 text-[11px] font-bold text-[#8B5CF6] dark:text-[#C84BFE] flex items-center gap-1 cursor-pointer"
          >
            <Sparkles size={11} />
            {lang === "ar" ? "14 مسار طيران" : "14 Flight Paths"}
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage(lang === "ar" ? "أرني حالة السعادة Happy" : "Show Happy state")}
            className="shrink-0 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <Smile size={11} />
            {lang === "ar" ? "حالة السعادة" : "Happy State"}
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage(lang === "ar" ? "كيف تعمل بوابة الشعاع؟" : "How does the Beam Portal work?")}
            className="shrink-0 px-2.5 py-1 rounded-full bg-sky-500/15 border border-sky-500/40 text-[11px] font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1 cursor-pointer"
          >
            <Zap size={11} />
            {lang === "ar" ? "بوابة الشعاع" : "Beam Portal"}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[290px]">
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                  m.sender === "user"
                    ? "bg-gradient-to-r from-[#C84BFE] to-[#8B5CF6] text-white font-semibold rounded-ee-none"
                    : "bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/15 text-slate-800 dark:text-white/95 rounded-es-none"
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-slate-400 dark:text-white/45 mt-1 px-1">{m.time}</span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-slate-50/90 dark:bg-black/40 border-t border-slate-200/80 dark:border-white/10 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder={lang === "ar" ? "تحدث مع المساعد الذكي EVA..." : "Chat with AI Assistant EVA..."}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/15 text-xs focus:outline-none focus:border-[#C84BFE]"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#C84BFE] to-[#4F46E5] text-white hover:opacity-95 shadow-md cursor-pointer"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
