"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { WateeraProvider } from "../context/WateeraContext";

type ThemeMode = "dark" | "light";

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setThemeState] = useState<ThemeMode>("dark");

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      setThemeState("dark");
      setMounted(true);
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newTheme);
    }
    try {
      localStorage.setItem("wateera_theme", newTheme);
    } catch {
      // ignore
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div
        id="wateera-hydration-shell"
        suppressHydrationWarning
        className="min-h-screen"
      >
        {mounted ? (
          <WateeraProvider>{children}</WateeraProvider>
        ) : (
          <div
            suppressHydrationWarning
            className="fixed inset-0 z-[150] bg-[#060314]"
          />
        )}
      </div>
    </ThemeContext.Provider>
  );
}
