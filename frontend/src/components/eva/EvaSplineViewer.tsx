"use client";

import React, { useEffect, useRef, useState } from "react";
import { syncSplineEyeMeshes } from "./EvaEmotions";
import { SplineRuntimeApp, TeleportPhase } from "./evaTypes";

export const DEFAULT_SPLINE_URL = "/eva.splinecode";
const SPLINE_SCRIPT_SRC =
  "https://cdn.spline.design/@splinetool/viewer@2.0.107/build/spline-viewer.webgpu.js";

export interface EvaSplineViewerProps {
  splineUrl?: string;
  splineAppRef?: React.MutableRefObject<SplineRuntimeApp | null>;
  showHappyEyesRef?: React.MutableRefObject<boolean>;
  blinkScaleYRef?: React.MutableRefObject<number>;
  teleportPhaseRef?: React.MutableRefObject<TeleportPhase>;
  size?: number;
  className?: string;
  showContourBorder?: boolean;
  onReady?: (app: SplineRuntimeApp) => void;
}

export const EvaSplineViewer: React.FC<EvaSplineViewerProps> = ({
  splineUrl = DEFAULT_SPLINE_URL,
  splineAppRef: externalSplineAppRef,
  showHappyEyesRef: externalShowHappyEyesRef,
  blinkScaleYRef: externalBlinkScaleYRef,
  teleportPhaseRef: externalTeleportPhaseRef,
  size = 150,
  className,
  showContourBorder = true,
  onReady,
}) => {
  const internalSplineAppRef = useRef<SplineRuntimeApp | null>(null);
  const internalShowHappyRef = useRef<boolean>(false);
  const internalBlinkRef = useRef<number>(1.0);
  const internalTeleportRef = useRef<TeleportPhase>("idle");
  const onReadyRef = useRef<((app: SplineRuntimeApp) => void) | undefined>(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);
  const hasNotifiedReadyRef = useRef<boolean>(false);

  const splineAppRef = externalSplineAppRef || internalSplineAppRef;
  const showHappyEyesRef = externalShowHappyEyesRef || internalShowHappyRef;
  const blinkScaleYRef = externalBlinkScaleYRef || internalBlinkRef;
  const teleportPhaseRef = externalTeleportPhaseRef || internalTeleportRef;

  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
  const viewerContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;

    // Guard against zero-sized WebGPU texture allocations (Dawn GPUValidationError)
    if (typeof window !== "undefined") {
      const anyWin = window as unknown as {
        GPUDevice?: {
          prototype: {
            createTexture: (desc: Record<string, unknown>) => unknown;
            __textureGuarded?: boolean;
          };
        };
        GPUCanvasContext?: {
          prototype: {
            configure: (desc: Record<string, unknown>) => unknown;
            canvas?: HTMLCanvasElement;
            __configureGuarded?: boolean;
          };
        };
      };

      if (anyWin.GPUDevice?.prototype && !anyWin.GPUDevice.prototype.__textureGuarded) {
        anyWin.GPUDevice.prototype.__textureGuarded = true;
        const origCreate = anyWin.GPUDevice.prototype.createTexture;
        anyWin.GPUDevice.prototype.createTexture = function (desc: Record<string, unknown>) {
          if (desc && desc.size) {
            if (Array.isArray(desc.size)) {
              if ((desc.size[0] as number) <= 0) desc.size[0] = 150;
              if ((desc.size[1] as number) <= 0) desc.size[1] = 150;
            } else if (typeof desc.size === "object") {
              const sz = desc.size as { width?: number; height?: number };
              if ((sz.width ?? 0) <= 0) sz.width = 150;
              if ((sz.height ?? 0) <= 0) sz.height = 150;
            }
          }
          return origCreate.call(this, desc);
        };
      }

      if (anyWin.GPUCanvasContext?.prototype && !anyWin.GPUCanvasContext.prototype.__configureGuarded) {
        anyWin.GPUCanvasContext.prototype.__configureGuarded = true;
        const origConfigure = anyWin.GPUCanvasContext.prototype.configure;
        anyWin.GPUCanvasContext.prototype.configure = function (desc: Record<string, unknown>) {
          if (this.canvas) {
            if (this.canvas.width <= 0) this.canvas.width = 150;
            if (this.canvas.height <= 0) this.canvas.height = 150;
          }
          return origConfigure.call(this, desc);
        };
      }
    }

    const onUnhandledRejection = (e: PromiseRejectionEvent) => {
      const msg = String(e?.reason || "");
      if (
        msg.includes("WebGPU") ||
        msg.includes("GPUValidationError") ||
        msg.includes("depthBuffer") ||
        msg.includes("swapchain")
      ) {
        e.preventDefault();
      }
    };
    const onError = (e: ErrorEvent) => {
      const msg = String(e?.message || "");
      if (
        msg.includes("WebGPU") ||
        msg.includes("GPUValidationError") ||
        msg.includes("depthBuffer") ||
        msg.includes("swapchain")
      ) {
        e.preventDefault();
      }
    };
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    window.addEventListener("error", onError);

    const origError = console.error;
    const origWarn = console.warn;
    const isNoisyThirdPartyLog = (args: unknown[]) => {
      const msg = args.map((a) => (typeof a === "string" ? a : String(a))).join(" ");
      return (
        msg.includes("No variable named") ||
        msg.includes("This scene was exported for WebGPU only") ||
        msg.includes("WebGPU") ||
        msg.includes("GPUValidationError") ||
        msg.includes("depthBuffer") ||
        msg.includes("TextureDescriptor") ||
        msg.includes("swapchain texture") ||
        msg.includes("Extent3D") ||
        msg.includes("ValidateTextureDescriptor") ||
        msg.includes("Multiple instances of Three.js") ||
        msg.includes("THREE.Clock: This module has been deprecated")
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
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      window.removeEventListener("error", onError);
      console.error = origError;
      console.warn = origWarn;
    };
  }, []);

  useEffect(() => {
    if (!scriptLoaded) return;
    const container = viewerContainerRef.current;
    if (!container) return;

    type SplineViewerElement = HTMLElement & {
      shadowRoot: ShadowRoot | null;
      _spline?: SplineRuntimeApp;
    };

    let viewerEl = container.querySelector("spline-viewer") as SplineViewerElement | null;

    if (!viewerEl) {
      const newViewer = document.createElement("spline-viewer") as SplineViewerElement;
      newViewer.setAttribute("width", String(size));
      newViewer.setAttribute("height", String(size));
      newViewer.style.width = `${size}px`;
      newViewer.style.height = `${size}px`;
      newViewer.style.minWidth = `${size}px`;
      newViewer.style.minHeight = `${size}px`;
      newViewer.style.display = "block";
      newViewer.style.background = "transparent";
      newViewer.style.border = "none";
      newViewer.style.outline = "none";
      newViewer.style.pointerEvents = "none";
      newViewer.setAttribute("url", splineUrl);
      container.appendChild(newViewer);
      viewerEl = newViewer;
    } else if (viewerEl.getAttribute("url") !== splineUrl) {
      viewerEl.setAttribute("url", splineUrl);
    }

    const currentViewer = viewerEl;

    const urlTimer = setTimeout(() => {
      if (currentViewer?.shadowRoot) {
        const innerContainer = currentViewer.shadowRoot.querySelector("#container") as HTMLElement | null;
        if (innerContainer) {
          innerContainer.style.width = `${size}px`;
          innerContainer.style.height = `${size}px`;
          innerContainer.style.background = "transparent";
          innerContainer.style.pointerEvents = "none";
        }
        const canvas = currentViewer.shadowRoot.querySelector("canvas") as HTMLCanvasElement | null;
        if (canvas) {
          canvas.width = size;
          canvas.height = size;
          canvas.style.width = `${size}px`;
          canvas.style.height = `${size}px`;
          canvas.style.background = "transparent";
          canvas.style.pointerEvents = "none";
        }
      }
    }, 60);

    const cleanShadowTimer = setInterval(() => {
      const anyViewer = currentViewer as HTMLElement & {
        shadowRoot?: ShadowRoot;
        _spline?: SplineRuntimeApp;
      };

      if (anyViewer?.shadowRoot) {
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

      if (anyViewer?._spline) {
        const app = anyViewer._spline;
        splineAppRef.current = app;
        syncSplineEyeMeshes(app, showHappyEyesRef.current, blinkScaleYRef.current);

        const rigObj = app.findObjectByName?.("EVA");
        if (rigObj && !hasNotifiedReadyRef.current) {
          hasNotifiedReadyRef.current = true;
          onReadyRef.current?.(app);
        }

        // Guard renderer setSize against zero values
        const renderer = app._renderer as unknown as {
          setSize?: (w: number, h: number, updateStyle?: boolean) => void;
          clearAlphaOverride?: number;
          setClearAlpha?: (a: number) => void;
          __sizeGuarded?: boolean;
        } | null;

        if (renderer && renderer.setSize && !renderer.__sizeGuarded) {
          renderer.__sizeGuarded = true;
          const origSetSize = renderer.setSize.bind(renderer);
          renderer.setSize = (w: number, h: number, updateStyle?: boolean) => {
            const safeW = Math.max(size, w || size);
            const safeH = Math.max(size, h || size);
            return origSetSize(safeW, safeH, updateStyle);
          };
        }

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
  }, [blinkScaleYRef, scriptLoaded, showHappyEyesRef, size, splineAppRef, splineUrl, teleportPhaseRef]);

  return (
    <>
      {showContourBorder && (
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
      )}
      <div
        ref={viewerContainerRef}
        style={{ width: `${size}px`, height: `${size}px`, pointerEvents: "none" }}
        className={
          showContourBorder
            ? "eva-clean-border-60 relative z-10 pointer-events-none bg-transparent border-0 outline-none"
            : className || "relative z-10 pointer-events-none bg-transparent border-0 outline-none"
        }
      />
    </>
  );
};
