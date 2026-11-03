import { useCallback, useEffect, useRef, useState } from "react";
import { EVA_BASE_PITCH_X } from "./EvaPaths";
import { EvaEmotion, SplineRuntimeApp, TeleportPhase } from "./evaTypes";

/**
 * Swaps cleanly between EVA's two active 3D visor states:
 * 1) "default" (Basic natural oval eyes + smooth natural blink)
 * 2) "happy"   (3D curved crescent eyes via Z-depth swap)
 */
export function syncSplineEyeMeshes(
  app: SplineRuntimeApp,
  showHappy: boolean,
  blinkScaleY = 1.0
) {
  const happyEyesObj =
    app.findObjectByName?.("EVA_Happy_Eyes") ||
    app.findObjectById?.("b689ff44-d8d8-43e6-93a4-550cac0065b2");
  const happyEyeL =
    app.findObjectByName?.("EVA_Happy_Eye_L") ||
    app.findObjectById?.("cce5bebb-c11a-4c05-99d0-f95f2da4eab9");
  const happyEyeR =
    app.findObjectByName?.("EVA_Happy_Eye_R") ||
    app.findObjectById?.("915219d0-0835-4a71-a2e9-cd75e1d7307c");

  const normalEyesObj =
    app.findObjectByName?.("EVA_Eyes") ||
    app.findObjectById?.("e344de66-70fd-4f7f-8f21-63a6273b9f5f");
  const evaEyeL =
    app.findObjectByName?.("EVA_Eye_L") ||
    app.findObjectById?.("15581d91-49c9-47dd-9107-125b5de0b82a");
  const evaEyeR =
    app.findObjectByName?.("EVA_Eye_R") ||
    app.findObjectById?.("51a97118-2c73-43a0-a3d7-dd5f99cf97e8");

  if (happyEyesObj) {
    happyEyesObj.visible = true;
    happyEyesObj.position.x = 0;
    happyEyesObj.position.y = 0;
    happyEyesObj.position.z = 0;
    happyEyesObj.scale.x = 1;
    happyEyesObj.scale.y = 1;
    happyEyesObj.scale.z = 1;
  }

  for (const hMesh of [happyEyeL, happyEyeR]) {
    if (hMesh) {
      hMesh.visible = true;
      hMesh.position.x = 0;
      hMesh.position.y = 0;
      hMesh.position.z = showHappy ? 0 : -25;
      hMesh.scale.x = 1;
      hMesh.scale.y = 1;
      hMesh.scale.z = 1;
    }
  }

  if (normalEyesObj) {
    normalEyesObj.visible = true;
    normalEyesObj.position.x = 0;
    normalEyesObj.position.y = 0;
    normalEyesObj.position.z = 0;
    normalEyesObj.scale.x = 1;
    normalEyesObj.scale.y = 1;
    normalEyesObj.scale.z = 1;
  }

  const sY = showHappy ? 1.0 : blinkScaleY;
  const blinkOffsetY = (1.0 - sY) * 160.86;

  for (const nMesh of [evaEyeL, evaEyeR]) {
    if (nMesh) {
      nMesh.visible = true;
      nMesh.position.x = 0;
      nMesh.position.y = blinkOffsetY;
      nMesh.position.z = showHappy ? -25 : 0;
      nMesh.scale.x = 1;
      nMesh.scale.y = sY;
      nMesh.scale.z = 1;
      nMesh.rotation.x = 0;
      nMesh.rotation.y = 0;
      nMesh.rotation.z = 0;
    }
  }

  app._requestRenderAutoMode?.();
}

interface UseEvaEmotionsParams {
  splineAppRef: React.MutableRefObject<SplineRuntimeApp | null>;
  isEvaVisibleRef: React.MutableRefObject<boolean>;
  teleportPhaseRef: React.MutableRefObject<TeleportPhase>;
  isWanderingActiveRef: React.MutableRefObject<boolean>;
  isChatOpenRef: React.MutableRefObject<boolean>;
  isDraggingRef: React.MutableRefObject<boolean>;
  rotRef: React.MutableRefObject<{ x: number; y: number; z: number }>;
  isJumpingSpinningRef: React.MutableRefObject<boolean>;
}

export function useEvaEmotions({
  splineAppRef,
  isEvaVisibleRef,
  teleportPhaseRef,
  isWanderingActiveRef,
  isChatOpenRef,
  isDraggingRef,
  rotRef,
  isJumpingSpinningRef,
}: UseEvaEmotionsParams) {
  const [emotion, setEmotion] = useState<EvaEmotion>("default");
  const showHappyEyesRef = useRef<boolean>(false);
  const blinkScaleYRef = useRef<number>(1.0);
  const happyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blinkRafRef = useRef<number | null>(null);
  const jumpSpinRafRef = useRef<number | null>(null);

  const triggerHappyState = useCallback((durationMs = 2500) => {
    if (happyTimerRef.current) {
      clearTimeout(happyTimerRef.current);
      happyTimerRef.current = null;
    }

    showHappyEyesRef.current = true;
    setEmotion("happy");

    const app = splineAppRef.current;
    if (app) {
      try {
        app.emitEvent?.("show_happy_eyes");
      } catch {
        // Handled via 3D Z-depth mesh swap
      }
      syncSplineEyeMeshes(app, true, blinkScaleYRef.current);
    }

    happyTimerRef.current = setTimeout(() => {
      showHappyEyesRef.current = false;
      setEmotion("default");

      const currentApp = splineAppRef.current;
      if (currentApp) {
        try {
          currentApp.emitEvent?.("return_to_normal");
        } catch {
          // Handled via 3D Z-depth mesh swap
        }
        syncSplineEyeMeshes(currentApp, false, blinkScaleYRef.current);
      }
    }, durationMs);
  }, [splineAppRef]);

  const triggerJumpAndSpin360 = useCallback(() => {
    const app = splineAppRef.current;
    if (app) {
      if (jumpSpinRafRef.current !== null) {
        cancelAnimationFrame(jumpSpinRafRef.current);
        jumpSpinRafRef.current = null;
      }

      const rigObj = app.findObjectByName?.("EVA");
      if (rigObj) {
        isJumpingSpinningRef.current = true;
        rigObj.position.x = 0;
        rigObj.position.y = 0;
        rigObj.position.z = 0;
        const duration = 800;
        const startTime = performance.now();

        const animateJumpSpin = (now: number) => {
          const progress = Math.min(1, (now - startTime) / duration);
          const eased = 0.5 - 0.5 * Math.cos(Math.PI * progress);

          rigObj.position.x = 0;
          rigObj.position.y = Math.sin(progress * Math.PI) * 18;
          rigObj.position.z = 0;
          rigObj.rotation.y = eased * Math.PI * 2;
          rigObj.rotation.z = 0;
          app._requestRenderAutoMode?.();

          if (progress < 1) {
            jumpSpinRafRef.current = requestAnimationFrame(animateJumpSpin);
          } else {
            rigObj.position.x = 0;
            rigObj.position.y = 0;
            rigObj.position.z = 0;
            rigObj.rotation.x = EVA_BASE_PITCH_X;
            rigObj.rotation.y = 0;
            rigObj.rotation.z = 0;
            rotRef.current = { x: EVA_BASE_PITCH_X, y: 0, z: 0 };
            isJumpingSpinningRef.current = false;
            jumpSpinRafRef.current = null;
            app._requestRenderAutoMode?.();
          }
        };

        jumpSpinRafRef.current = requestAnimationFrame(animateJumpSpin);
      }
    }

    triggerHappyState(2500);
  }, [isJumpingSpinningRef, rotRef, splineAppRef, triggerHappyState]);

  // Ambient default eye blink (every 5-15s) + periodic happy state (every 60s while roaming)
  useEffect(() => {
    let blinkTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let isCancelled = false;

    const triggerSmooth3DBlink = () => {
      if (blinkRafRef.current !== null) {
        cancelAnimationFrame(blinkRafRef.current);
      }
      const blinkDuration = 190;
      const startTime = performance.now();

      const animateBlink = (now: number) => {
        const progress = Math.min(1, (now - startTime) / blinkDuration);
        blinkScaleYRef.current = 1.0 - 0.92 * Math.sin(progress * Math.PI);

        if (splineAppRef.current) {
          syncSplineEyeMeshes(splineAppRef.current, showHappyEyesRef.current, blinkScaleYRef.current);
        }

        if (progress < 1) {
          blinkRafRef.current = requestAnimationFrame(animateBlink);
        } else {
          blinkScaleYRef.current = 1.0;
          blinkRafRef.current = null;
          if (splineAppRef.current) {
            syncSplineEyeMeshes(splineAppRef.current, showHappyEyesRef.current, 1.0);
          }
        }
      };

      blinkRafRef.current = requestAnimationFrame(animateBlink);
    };

    const scheduleNextRandomBlink = () => {
      if (isCancelled) return;
      const delayMs = Math.floor(5000 + Math.random() * 10000);
      blinkTimeoutId = setTimeout(() => {
        if (isCancelled) return;
        if (
          isEvaVisibleRef.current &&
          teleportPhaseRef.current === "idle" &&
          !showHappyEyesRef.current &&
          !isDraggingRef.current
        ) {
          triggerSmooth3DBlink();
        }
        scheduleNextRandomBlink();
      }, delayMs);
    };

    scheduleNextRandomBlink();

    const happyIdleInterval = setInterval(() => {
      if (
        isEvaVisibleRef.current &&
        teleportPhaseRef.current === "idle" &&
        !isChatOpenRef.current &&
        isWanderingActiveRef.current &&
        !showHappyEyesRef.current &&
        !isDraggingRef.current
      ) {
        triggerHappyState(2500);
      }
    }, 60000);

    return () => {
      isCancelled = true;
      if (blinkTimeoutId) clearTimeout(blinkTimeoutId);
      if (happyTimerRef.current) clearTimeout(happyTimerRef.current);
      if (blinkRafRef.current !== null) cancelAnimationFrame(blinkRafRef.current);
      if (jumpSpinRafRef.current !== null) cancelAnimationFrame(jumpSpinRafRef.current);
      clearInterval(happyIdleInterval);
    };
  }, [
    isChatOpenRef,
    isDraggingRef,
    isEvaVisibleRef,
    isWanderingActiveRef,
    splineAppRef,
    teleportPhaseRef,
    triggerHappyState,
  ]);

  return {
    emotion,
    showHappyEyesRef,
    blinkScaleYRef,
    triggerHappyState,
    triggerJumpAndSpin360,
  };
}
