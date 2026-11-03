"use client";

import React from "react";

const WORDMARK_TEXT_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontSize: "298px",
  fontWeight: 400,
  letterSpacing: "0.016em",
};

export const WateeraHeroWordmark: React.FC = () => {
  return (
    <div
      dir="ltr"
      className="relative w-full max-w-[95vw] xl:max-w-[1540px] mx-auto flex items-center justify-center select-none"
    >
      <div className="relative z-10 w-full">
        <svg
          viewBox="0 0 1600 420"
          className="w-full h-auto overflow-visible block"
          role="img"
          aria-label="WATEERA"
        >
          <defs>
            {/* Primary Vertical Brushed Silver-Lavender -> Smoky Violet-Charcoal */}
            <linearGradient
              id="wtr-metal-dark"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="-216"
              x2="0"
              y2="4"
            >
              <stop offset="0%" stopColor="#F3F0FC" />
              <stop offset="18%" stopColor="#DFD8F2" />
              <stop offset="45%" stopColor="#B4A8CF" />
              <stop offset="70%" stopColor="#7A6E97" />
              <stop offset="88%" stopColor="#3A3152" />
              <stop offset="100%" stopColor="#140F22" />
            </linearGradient>

            {/* Horizontal Studio Vignette */}
            <linearGradient
              id="wtr-horizontal-vignette"
              gradientUnits="userSpaceOnUse"
              x1="-760"
              y1="0"
              x2="760"
              y2="0"
            >
              <stop offset="0%" stopColor="#000000" stopOpacity="0.34" />
              <stop offset="22%" stopColor="#000000" stopOpacity="0" />
              <stop offset="78%" stopColor="#000000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.34" />
            </linearGradient>

            {/* Center-Bottom Ambient Electric-Violet Uplight */}
            <radialGradient
              id="wtr-purple-uplight"
              gradientUnits="userSpaceOnUse"
              cx="0"
              cy="12"
              r="440"
            >
              <stop offset="0%" stopColor="#C84BFE" stopOpacity="0.34" />
              <stop offset="55%" stopColor="#4F46E5" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
            </radialGradient>

            {/* Razor-Sharp Overhead Anodized Specular Rim Light */}
            <linearGradient
              id="wtr-top-specular-rim"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="-216"
              x2="0"
              y2="-60"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
              <stop offset="45%" stopColor="#DDD5F3" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
          </defs>

          <g transform="translate(800, 356) scale(1, 1.30)">
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fill="url(#wtr-metal-dark)"
              style={WORDMARK_TEXT_STYLE}
            >
              WATEERA
            </text>

            <text
              x="0"
              y="0"
              textAnchor="middle"
              fill="url(#wtr-horizontal-vignette)"
              style={WORDMARK_TEXT_STYLE}
            >
              WATEERA
            </text>

            <text
              x="0"
              y="0"
              textAnchor="middle"
              fill="url(#wtr-purple-uplight)"
              style={WORDMARK_TEXT_STYLE}
            >
              WATEERA
            </text>

            <text
              x="0"
              y="0"
              textAnchor="middle"
              fill="none"
              stroke="url(#wtr-top-specular-rim)"
              strokeWidth="1.1"
              style={WORDMARK_TEXT_STYLE}
            >
              WATEERA
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
