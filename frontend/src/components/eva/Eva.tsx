"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useWateera } from "../../context/WateeraContext";
import { EvaChat } from "./EvaChat";
import { useEvaEmotions } from "./EvaEmotions";
import { EVA_BASE_PITCH_X } from "./EvaPaths";
import { EvaPortalStage, useEvaPortal } from "./EvaPortal";
import { DEFAULT_SPLINE_URL, EvaSplineViewer } from "./EvaSplineViewer";
import { EvaPathMode, SplineRuntimeApp } from "./evaTypes";
import { useEvaPhysics } from "./useEvaPhysics";

export function Eva() {
  const { lang } = useWateera();

  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isWanderingEnabled, setIsWanderingEnabled] = useState<boolean>(true);
  const [pathMode, setPathMode] = useState<EvaPathMode>("random-wander");
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [splineUrl, setSplineUrl] = useState<string>(DEFAULT_SPLINE_URL);

  const splineAppRef = useRef<SplineRuntimeApp | null>(null);
  const rotRef = useRef({ x: EVA_BASE_PITCH_X, y: 0, z: 0 });
  const isJumpingSpinningRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const isChatOpenRef = useRef<boolean>(false);
  const isWanderingActiveRef = useRef<boolean>(true);

  useEffect(() => {
    isChatOpenRef.current = isChatOpen;
  }, [isChatOpen]);

  useEffect(() => {
    isWanderingActiveRef.current = isWanderingEnabled && pathMode !== "pinned";
  }, [isWanderingEnabled, pathMode]);

  const onPortalAppearRef = useRef<() => void>(() => {});

  const {
    isEvaVisible,
    teleportPhase,
    isEvaVisibleRef,
    teleportPhaseRef,
  } = useEvaPortal({
    splineAppRef,
    rotRef,
    onDisappearStart: useCallback(() => setIsChatOpen(false), []),
    onAppearComplete: useCallback(() => onPortalAppearRef.current(), []),
  });

  const {
    emotion,
    showHappyEyesRef,
    blinkScaleYRef,
    triggerHappyState,
    triggerJumpAndSpin360,
  } = useEvaEmotions({
    splineAppRef,
    isEvaVisibleRef,
    teleportPhaseRef,
    isWanderingActiveRef,
    isChatOpenRef,
    isDraggingRef,
    rotRef,
    isJumpingSpinningRef,
  });

  const onEvaClickRef = useRef<() => void>(() => {});

  const {
    evaPos,
    posRef,
    activeRandomPathId,
    isNaturallyPaused,
    triggerNaturalPause,
    syncWaypointsToPosition,
    handleEvaPointerDown,
    handleEvaPointerMove,
    handleEvaPointerUp,
  } = useEvaPhysics({
    pathMode,
    isWanderingEnabled,
    isChatOpen,
    isHovered,
    setIsHovered,
    isEvaVisibleRef,
    teleportPhaseRef,
    splineAppRef,
    showHappyEyesRef,
    blinkScaleYRef,
    rotRef,
    isJumpingSpinningRef,
    isDraggingRef,
    onEvaClick: useCallback(() => onEvaClickRef.current(), []),
  });

  const handleCloseChat = useCallback(() => {
    setIsChatOpen(false);
    triggerHappyState(2500);
    syncWaypointsToPosition(posRef.current);
    triggerNaturalPause(2.5 + Math.random() * 2.0);
  }, [posRef, syncWaypointsToPosition, triggerHappyState, triggerNaturalPause]);

  useEffect(() => {
    onPortalAppearRef.current = () => {
      syncWaypointsToPosition(posRef.current);
      triggerNaturalPause(3.5 + Math.random() * 2.5);
    };
  }, [posRef, syncWaypointsToPosition, triggerNaturalPause]);

  useEffect(() => {
    onEvaClickRef.current = () => {
      if (!isChatOpenRef.current) {
        setIsChatOpen(true);
        triggerJumpAndSpin360();
      } else {
        handleCloseChat();
      }
    };
  }, [handleCloseChat, triggerJumpAndSpin360]);

  return (
    <>
      <div
        style={{
          position: "fixed",
          left: `${evaPos.xVw}vw`,
          top: `${evaPos.yVh}vh`,
          transform: `translate3d(0, ${evaPos.bobPx}px, 0)`,
          zIndex: 146,
          touchAction: "none",
          opacity: !isEvaVisible && teleportPhase === "idle" ? 0 : 1,
          pointerEvents: !isEvaVisible && teleportPhase === "idle" ? "none" : "auto",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          triggerNaturalPause(2.5 + Math.random() * 2.5);
        }}
        onPointerDown={handleEvaPointerDown}
        onPointerMove={handleEvaPointerMove}
        onPointerUp={handleEvaPointerUp}
        onPointerCancel={handleEvaPointerUp}
        className="select-none cursor-grab active:cursor-grabbing bg-transparent border-0 outline-none shadow-none"
      >
        <EvaPortalStage teleportPhase={teleportPhase} isEvaVisible={isEvaVisible}>
          <EvaSplineViewer
            splineUrl={splineUrl}
            splineAppRef={splineAppRef}
            showHappyEyesRef={showHappyEyesRef}
            blinkScaleYRef={blinkScaleYRef}
            teleportPhaseRef={teleportPhaseRef}
          />
        </EvaPortalStage>
      </div>

      {isChatOpen && isEvaVisible && (
        <EvaChat
          lang={lang}
          evaPos={evaPos}
          emotion={emotion}
          pathMode={pathMode}
          setPathMode={setPathMode}
          activeRandomPathId={activeRandomPathId}
          isWanderingEnabled={isWanderingEnabled}
          setIsWanderingEnabled={setIsWanderingEnabled}
          isNaturallyPaused={isNaturallyPaused}
          splineUrl={splineUrl}
          setSplineUrl={setSplineUrl}
          onTriggerHappy={() => triggerHappyState(2500)}
          onTriggerNaturalPause={triggerNaturalPause}
          onClose={handleCloseChat}
        />
      )}
    </>
  );
}
