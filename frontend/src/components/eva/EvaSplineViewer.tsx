"use client";

import React, { useEffect, useRef, useState } from "react";
import { syncSplineEyeMeshes } from "./EvaEmotions";
import { SplineRuntimeApp, TeleportPhase } from "./evaTypes";

export const DEFAULT_SPLINE_URL = "/eva.splinecode";
const SPLINE_SCRIPT_SRC =
  "https://cdn.spline.design/@splinetool/viewer@2.0.107/build/spline-viewer.webgpu.js";

interface EvaSplineViewerProps {
  splineUrl: string;
  splineAppRef: React.MutableRefObject<SplineRuntimeApp | null>;
  showHappyEyesRef: React.MutableRefObject<boolean>;
  blinkScaleYRef: React.MutableRefObject<number>;
  teleportPhaseRef: React.MutableRefObject<TeleportPhase>;
}

export const EvaSplineViewer: React.FC<EvaSplineViewerProps> = ({
  splineUrl,
  splineAppRef,
  showHappyEyesRef,
  blinkScaleYRef,
  teleportPhaseRef,
}) => {
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
  const viewerContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const origError = console.error;
    const origWarn = console.warn;
    const isNoisyThirdPartyLog = (args: unknown[]) => {
      const msg = args.map((a) => (typeof a === "string" ? a : String(a))).join(" ");
      return (
        msg.includes("No variable named") ||
        msg.includes("This scene was exported for WebGPU only") ||
        msg.includes("Uncaptured WebGPU GPUValidationError") ||
        msg.includes("Multiple instances of Three.js") ||
        msg.includes("THREE.Clock: This module has been deprecated") ||
        msg.includes("swapchain texture of size 0")
      );
    };

    console.error = (...args: unknown[]) => {
      if (isNoisyThirdPartyLog(args)) return;
      origError.apply(console, args);
    };
    console.warn = (...args: unknown[]) => {
      if (isNoisyThirdPartyLog(args)) return;
      origWarn.apply(console, args);
    };

    const existing = document.querySelector(`script[src="${SPLINE_SCRIPT_SRC}"]`);
    let readyRaf: number | null = null;
    if (existing) {
      readyRaf = requestAnimationFrame(() => setScriptLoaded(true));
    } else {
      const script = document.createElement("script");
      script.type = "module";
      script.src = SPLINE_SCRIPT_SRC;
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      document.head.appendChild(script);
    }

    return () => {
      if (readyRaf !== null) cancelAnimationFrame(readyRaf);
      console.error = origError;
      console.warn = origWarn;
    };
  }, []);

  useEffect(() => {
    if (!scriptLoaded) return;
    const container = viewerContainerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const viewerEl = document.createElement("spline-viewer");
    viewerEl.setAttribute("width", "150");
    viewerEl.setAttribute("height", "150");
    viewerEl.style.width = "150px";
    viewerEl.style.height = "150px";
    viewerEl.style.display = "block";
    viewerEl.style.background = "transparent";
    viewerEl.style.border = "none";
    viewerEl.style.outline = "none";
    viewerEl.style.pointerEvents = "none";
    container.appendChild(viewerEl);

    const urlTimer = setTimeout(() => {
      if (viewerEl.shadowRoot) {
        const innerContainer = viewerEl.shadowRoot.querySelector("#container") as HTMLElement | null;
        if (innerContainer) {
          innerContainer.style.width = "150px";
          innerContainer.style.height = "150px";
          innerContainer.style.background = "transparent";
          innerContainer.style.pointerEvents = "none";
        }
        const canvas = viewerEl.shadowRoot.querySelector("canvas") as HTMLCanvasElement | null;
        if (canvas) {
          canvas.width = 150;
          canvas.height = 150;
          canvas.style.width = "150px";
          canvas.style.height = "150px";
          canvas.style.background = "transparent";
          canvas.style.pointerEvents = "none";
        }
      }
      viewerEl.setAttribute("url", splineUrl);
    }, 60);

    const cleanShadowTimer = setInterval(() => {
      const anyViewer = viewerEl as HTMLElement & {
        shadowRoot?: ShadowRoot;
        _spline?: SplineRuntimeApp;
      };

      if (anyViewer.shadowRoot) {
        const logo = anyViewer.shadowRoot.querySelector("#logo") as HTMLElement | null;
        if (logo) logo.style.display = "none";

        const innerContainer = anyViewer.shadowRoot.querySelector("#container") as HTMLElement | null;
        if (innerContainer) innerContainer.style.pointerEvents = "none";

        const canvas = anyViewer.shadowRoot.querySelector("canvas") as HTMLElement | null;
        if (canvas) {
          canvas.style.background = "transparent";
          canvas.style.pointerEvents = "none";
        }
      }

      if (anyViewer._spline) {
        const app = anyViewer._spline;
        splineAppRef.current = app;
        syncSplineEyeMeshes(app, showHappyEyesRef.current, blinkScaleYRef.current);

        if (app._controls) {
          app._controls.enabled = false;
          app._controls.enableRotate = false;
          app._controls.enableZoom = false;
          app._controls.enablePan = false;
        }
        if (app._scene?.activePage?.bgColor) {
          app._scene.activePage.bgColor.a = 0;
          if (app._renderer) {
            app._renderer.clearAlphaOverride = 0;
            app._renderer.setClearAlpha?.(0);
          }
          app._requestRenderAutoMode?.();
        }
      }

      if (container && teleportPhaseRef.current === "idle") {
        container.style.transform = "none";
      }
    }, 300);

    return () => {
      clearTimeout(urlTimer);
      clearInterval(cleanShadowTimer);
    };
  }, [blinkScaleYRef, scriptLoaded, showHappyEyesRef, splineAppRef, splineUrl, teleportPhaseRef]);

  return (
    <>
      <style>{`
        @keyframes evaContourBorder60 {
          0%, 100% {
            filter:
              drop-shadow(0.75px 0 0px #C84BFE)
              drop-shadow(-0.75px 0 0px #4F46E5)
              drop-shadow(0 0.75px 0px #8B5CF6)
              drop-shadow(0 -0.75px 0px #C84BFE);
          }
          33% {
            filter:
              drop-shadow(0.75px 0 0px #8B5CF6)
              drop-shadow(-0.75px 0 0px #C84BFE)
              drop-shadow(0 0.75px 0px #4F46E5)
              drop-shadow(0 -0.75px 0px #8B5CF6);
          }
          66% {
            filter:
              drop-shadow(0.75px 0 0px #4F46E5)
              drop-shadow(-0.75px 0 0px #8B5CF6)
              drop-shadow(0 0.75px 0px #C84BFE)
              drop-shadow(0 -0.75px 0px #4F46E5);
          }
        }
        .eva-clean-border-60 {
          animation: evaContourBorder60 3.5s linear infinite;
        }
      `}</style>
      <div
        ref={viewerContainerRef}
        style={{ width: "150px", height: "150px", pointerEvents: "none" }}
        className="eva-clean-border-60 relative z-10 pointer-events-none bg-transparent border-0 outline-none"
      />
    </>
  );
};
