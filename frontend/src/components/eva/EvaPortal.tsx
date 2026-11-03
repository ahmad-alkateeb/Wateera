"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { EVA_BASE_PITCH_X } from "./EvaPaths";
import { SplineRuntimeApp, TeleportPhase } from "./evaTypes";

let globalToggleEvaTeleport: (() => void) | null = null;

export function toggleEvaTeleport() {
  if (globalToggleEvaTeleport) {
    globalToggleEvaTeleport();
  }
}

interface UseEvaPortalParams {
  splineAppRef: React.MutableRefObject<SplineRuntimeApp | null>;
  rotRef: React.MutableRefObject<{ x: number; y: number; z: number }>;
  onDisappearStart: () => void;
  onAppearComplete: () => void;
}

export function useEvaPortal({
  splineAppRef,
  rotRef,
  onDisappearStart,
  onAppearComplete,
}: UseEvaPortalParams) {
  const [isEvaVisible, setIsEvaVisible] = useState<boolean>(true);
  const [teleportPhase, setTeleportPhase] = useState<TeleportPhase>("idle");

  const isEvaVisibleRef = useRef<boolean>(true);
  const teleportPhaseRef = useRef<TeleportPhase>("idle");

  useEffect(() => {
    isEvaVisibleRef.current = isEvaVisible;
  }, [isEvaVisible]);

  useEffect(() => {
    teleportPhaseRef.current = teleportPhase;
  }, [teleportPhase]);

  const handleToggleTeleport = useCallback(() => {
    if (teleportPhaseRef.current !== "idle") return;

    const totalDuration = 1600;
    const app = splineAppRef.current;
    const rigObj = app?.findObjectByName?.("EVA");

    if (rigObj) {
      rigObj.rotation.x = EVA_BASE_PITCH_X;
      rigObj.rotation.y = 0;
      rigObj.rotation.z = 0;
      rigObj.scale.x = 1;
      rigObj.scale.y = 1;
      rigObj.scale.z = 1;
      app?._requestRenderAutoMode?.();
    }
    rotRef.current = { x: EVA_BASE_PITCH_X, y: 0, z: 0 };

    if (isEvaVisibleRef.current) {
      onDisappearStart();
      setTeleportPhase("disappearing");
      teleportPhaseRef.current = "disappearing";

      setTimeout(() => {
        setIsEvaVisible(false);
        isEvaVisibleRef.current = false;
        setTeleportPhase("idle");
        teleportPhaseRef.current = "idle";
        window.dispatchEvent(
          new CustomEvent("wateera:eva-visibility-change", {
            detail: { visible: false },
          })
        );
      }, totalDuration);
    } else {
      setIsEvaVisible(true);
      isEvaVisibleRef.current = true;
      setTeleportPhase("appearing");
      teleportPhaseRef.current = "appearing";
      window.dispatchEvent(
        new CustomEvent("wateera:eva-visibility-change", {
          detail: { visible: true },
        })
      );

      setTimeout(() => {
        setTeleportPhase("idle");
        teleportPhaseRef.current = "idle";
        onAppearComplete();
      }, totalDuration);
    }
  }, [onAppearComplete, onDisappearStart, rotRef, splineAppRef]);

  useEffect(() => {
    globalToggleEvaTeleport = handleToggleTeleport;
    const onWindowToggle = () => handleToggleTeleport();
    window.addEventListener("wateera:toggle-eva-teleport", onWindowToggle);
    return () => {
      globalToggleEvaTeleport = null;
      window.removeEventListener("wateera:toggle-eva-teleport", onWindowToggle);
    };
  }, [handleToggleTeleport]);

  return {
    isEvaVisible,
    teleportPhase,
    isEvaVisibleRef,
    teleportPhaseRef,
    handleToggleTeleport,
  };
}

interface EvaPortalStageProps {
  teleportPhase: TeleportPhase;
  isEvaVisible: boolean;
  children: React.ReactNode;
}

export const EvaPortalStage: React.FC<EvaPortalStageProps> = ({
  teleportPhase,
  isEvaVisible,
  children,
}) => {
  return (
    <>
      <style>{`
        .eva-space-beam {
          position: absolute;
          bottom: 4px;
          left: 50%;
          width: 92px;
          height: 360px;
          margin-left: -46px;
          pointer-events: none;
          z-index: 10;
          transform-origin: top center;
          background: linear-gradient(
            180deg,
            rgba(56, 189, 248, 0) 0%,
            rgba(56, 189, 248, 0.42) 30%,
            rgba(168, 85, 247, 0.58) 72%,
            rgba(232, 121, 249, 0.85) 100%
          );
          box-shadow: 0 0 32px rgba(56, 189, 248, 0.45);
          filter: blur(5px);
          transform: scaleY(0);
          opacity: 0;
        }
        .eva-space-beam.is-active {
          animation: evaSpaceBeamSequence 1600ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .eva-ground-portal-back,
        .eva-ground-portal-front {
          position: absolute;
          top: 133px;
          left: 50%;
          width: 140px;
          height: 34px;
          margin-left: -70px;
          border-radius: 50%;
          pointer-events: none;
          transform: scale3d(0, 0, 1);
          opacity: 0;
        }
        .eva-ground-portal-back {
          z-index: 5;
          background: radial-gradient(
            ellipse at 50% 45%,
            #000000 0%,
            #05010f 38%,
            #1e0a3c 62%,
            #7c3aed 84%,
            #e879f9 100%
          );
          box-shadow: 0 0 16px #38bdf8, 0 0 34px #a855f7, 0 0 58px rgba(232, 121, 249, 0.7);
          border: 2px solid rgba(186, 230, 253, 0.85);
        }
        .eva-ground-portal-front {
          z-index: 30;
          background: transparent;
          border: 3px solid #e0f2fe;
          box-shadow: 0 4px 12px #38bdf8, 0 6px 26px #a855f7, inset 0 -3px 8px rgba(232, 121, 249, 0.9);
          clip-path: inset(50% -30px -30px -30px);
        }
        .eva-ground-portal-back.is-active,
        .eva-ground-portal-front.is-active {
          animation: evaGroundPortalSequence 1600ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .eva-floor-mask-viewport {
          position: relative;
          width: 150px;
          height: 150px;
          overflow: visible;
          z-index: 20;
        }
        .eva-floor-mask-viewport.is-portal-active {
          clip-path: path("M -60 -140 H 210 V 150 H 141 A 66 15 0 0 1 9 150 H -60 Z");
        }
        .eva-elevator {
          width: 150px;
          height: 150px;
          will-change: transform;
          transform: translate3d(0, 0%, 0);
        }
        .eva-elevator.is-disappearing,
        .eva-elevator.is-appearing {
          filter: drop-shadow(0 8px 10px rgba(168, 85, 247, 0.55));
        }
        .eva-elevator.is-disappearing {
          animation: evaSinkIntoPortal 1600ms cubic-bezier(0.45, 0, 0.55, 1) forwards;
        }
        .eva-elevator.is-appearing {
          animation: evaRiseFromPortal 1600ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .eva-elevator.is-hidden {
          transform: translate3d(0, 150%, 0);
        }
        @keyframes evaSpaceBeamSequence {
          0% { transform: scaleY(0) scaleX(0.35); opacity: 0; }
          18% { transform: scaleY(1) scaleX(1); opacity: 1; }
          78% { transform: scaleY(1) scaleX(0.92); opacity: 0.95; }
          100% { transform: scaleY(0) scaleX(0.15); opacity: 0; }
        }
        @keyframes evaGroundPortalSequence {
          0%, 10% { transform: scale3d(0, 0, 1); opacity: 0; }
          26% { transform: scale3d(1.06, 1.06, 1); opacity: 1; }
          76% { transform: scale3d(1, 1, 1); opacity: 1; }
          100% { transform: scale3d(0, 0, 1); opacity: 0; }
        }
        @keyframes evaSinkIntoPortal {
          0%, 24% { transform: translate3d(0, 0%, 0); }
          78%, 100% { transform: translate3d(0, 150%, 0); }
        }
        @keyframes evaRiseFromPortal {
          0%, 24% { transform: translate3d(0, 150%, 0); }
          78%, 100% { transform: translate3d(0, 0%, 0); }
        }
      `}</style>

      {teleportPhase !== "idle" && (
        <>
          <div className="eva-space-beam is-active" />
          <div className="eva-ground-portal-back is-active" />
        </>
      )}

      <div
        className={`eva-floor-mask-viewport ${
          teleportPhase !== "idle" || !isEvaVisible ? "is-portal-active" : ""
        }`}
      >
        <div
          className={`eva-elevator relative ${
            teleportPhase === "appearing"
              ? "is-appearing"
              : teleportPhase === "disappearing"
                ? "is-disappearing"
                : !isEvaVisible
                  ? "is-hidden"
                  : ""
          }`}
        >
          {children}
        </div>
      </div>

      {teleportPhase !== "idle" && <div className="eva-ground-portal-front is-active" />}
    </>
  );
};
