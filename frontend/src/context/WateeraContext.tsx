"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "ar" | "en";

interface WateeraContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;
}

const WateeraContext = createContext<WateeraContextValue | undefined>(undefined);

export function WateeraProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  const [showSplash, setShowSplash] = useState<boolean>(true);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
  }, [lang]);

  const setLang = (nextLang: Language) => {
    setLangState(nextLang);
  };

  return (
    <WateeraContext.Provider
      value={{
        lang,
        setLang,
        showSplash,
        setShowSplash,
      }}
    >
      {children}
    </WateeraContext.Provider>
  );
}

export function useWateera(): WateeraContextValue {
  const context = useContext(WateeraContext);
  if (!context) {
    throw new Error("useWateera must be used within a WateeraProvider");
  }
  return context;
}
