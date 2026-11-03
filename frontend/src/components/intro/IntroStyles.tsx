import React from "react";

export const IntroStyles: React.FC = () => (
  <style>{`
    @keyframes wtrOverlayLifecycle {
      0%, 86% { opacity: 1; visibility: visible; pointer-events: auto; }
      100% { opacity: 0; visibility: hidden; pointer-events: none; }
    }
    @keyframes wtrRibbonDrawAndReverse {
      0% { stroke-dashoffset: 1; opacity: 0.25; }
      8% { opacity: 1; }
      40%, 58% { stroke-dashoffset: 0; opacity: 1; }
      92% { stroke-dashoffset: 1; opacity: 0.95; }
      100% { stroke-dashoffset: 1; opacity: 0; }
    }
    @keyframes wtrLogoScale {
      0% { transform: scale(0.96); }
      42%, 58% { transform: scale(1.05); }
      100% { transform: scale(0.98); }
    }
    @keyframes wtrAmbientGlow {
      0% { opacity: 0.15; transform: scale(0.8); }
      42%, 58% { opacity: 1; transform: scale(1.12); }
      92%, 100% { opacity: 0; transform: scale(0.75); }
    }
    @keyframes wtrSubtitleLifecycle {
      0%, 10% { opacity: 0; transform: translateY(8px); }
      38%, 62% { opacity: 0.95; transform: translateY(0px); }
      90%, 100% { opacity: 0; transform: translateY(6px); }
    }
    .wtr-intro-overlay { animation: wtrOverlayLifecycle 3.2s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
    .wtr-logo-stage { animation: wtrLogoScale 3.1s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
    .wtr-glow-orb { animation: wtrAmbientGlow 3.1s ease-in-out forwards; }
    .wtr-subtitle-anim { animation: wtrSubtitleLifecycle 3.0s ease-in-out forwards; }
    .wtr-ribbon-1 { stroke-dasharray: 1; stroke-dashoffset: 1; animation: wtrRibbonDrawAndReverse 2.85s cubic-bezier(0.4, 0, 0.2, 1) 0ms forwards; }
    .wtr-ribbon-2 { stroke-dasharray: 1; stroke-dashoffset: 1; animation: wtrRibbonDrawAndReverse 2.85s cubic-bezier(0.4, 0, 0.2, 1) 50ms forwards; }
    .wtr-ribbon-3 { stroke-dasharray: 1; stroke-dashoffset: 1; animation: wtrRibbonDrawAndReverse 2.85s cubic-bezier(0.4, 0, 0.2, 1) 100ms forwards; }
    .wtr-ribbon-4 { stroke-dasharray: 1; stroke-dashoffset: 1; animation: wtrRibbonDrawAndReverse 2.85s cubic-bezier(0.4, 0, 0.2, 1) 150ms forwards; }
    .wtr-ribbon-5 { stroke-dasharray: 1; stroke-dashoffset: 1; animation: wtrRibbonDrawAndReverse 2.85s cubic-bezier(0.4, 0, 0.2, 1) 200ms forwards; }
  `}</style>
);
