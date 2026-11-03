import React, { useCallback, useEffect, useRef, useState } from "react";
import { syncSplineEyeMeshes } from "./EvaEmotions";
import {
  EVA_BASE_PITCH_X,
  EVA_PATHS,
  findNextWaypointIndex,
  resolveActivePath,
} from "./EvaPaths";
import {
  EvaPathId,
  EvaPathMode,
  SplineRuntimeApp,
  TeleportPhase,
} from "./evaTypes";

interface UseEvaPhysicsParams {
  pathMode: EvaPathMode;
  isWanderingEnabled: boolean;
  isChatOpen: boolean;
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
  isEvaVisibleRef: React.MutableRefObject<boolean>;
  teleportPhaseRef: React.MutableRefObject<TeleportPhase>;
  splineAppRef: React.MutableRefObject<SplineRuntimeApp | null>;
  showHappyEyesRef: React.MutableRefObject<boolean>;
  blinkScaleYRef: React.MutableRefObject<number>;
  rotRef: React.MutableRefObject<{ x: number; y: number; z: number }>;
  isJumpingSpinningRef: React.MutableRefObject<boolean>;
  isDraggingRef: React.MutableRefObject<boolean>;
  onEvaClick: () => void;
}

export function useEvaPhysics({
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
  onEvaClick,
}: UseEvaPhysicsParams) {
  const [evaPos, setEvaPos] = useState({ xVw: 74, yVh: 54, bobPx: 0 });
  const [activeRandomPathId, setActiveRandomPathId] = useState<EvaPathId>("perimeter-orbit");
  const [isNaturallyPaused, setIsNaturallyPaused] = useState<boolean>(true);

  const posRef = useRef({ xVw: 74, yVh: 54 });
  const prevPosRef = useRef({ xVw: 74, yVh: 54 });
  const velRef = useRef({ vx: 0, vy: 0 });
  const dragVxRef = useRef<number>(0);

  const activeWaypointIdxRef = useRef<number>(1);
  const activeRandomPathIdRef = useRef<EvaPathId>("perimeter-orbit");
  const naturalPauseRemainingRef = useRef<number>(2.5);
  const isNaturallyPausedRef = useRef<boolean>(true);

  const isChatOpenRef = useRef(isChatOpen);
  const isWanderingEnabledRef = useRef(isWanderingEnabled);
  const isHoveredRef = useRef(isHovered);
  const pathModeRef = useRef(pathMode);

  const pointerDownRef = useRef<{
    startX: number;
    startY: number;
    originXVw: number;
    originYVh: number;
    dragging: boolean;
  } | null>(null);

  useEffect(() => {
    isChatOpenRef.current = isChatOpen;
  }, [isChatOpen]);

  useEffect(() => {
    isWanderingEnabledRef.current = isWanderingEnabled;
  }, [isWanderingEnabled]);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  const triggerNaturalPause = useCallback((durationSeconds: number) => {
    naturalPauseRemainingRef.current = Math.max(naturalPauseRemainingRef.current, durationSeconds);
    isNaturallyPausedRef.current = true;
    setIsNaturallyPaused(true);
    velRef.current = { vx: 0, vy: 0 };
  }, []);

  const syncWaypointsToPosition = useCallback((pos: { xVw: number; yVh: number }) => {
    velRef.current = { vx: 0, vy: 0 };
    const currentPath = resolveActivePath(pathModeRef.current, activeRandomPathIdRef.current);
    activeWaypointIdxRef.current = findNextWaypointIndex(pos, currentPath.waypoints);
  }, []);

  useEffect(() => {
    pathModeRef.current = pathMode;
    const rafId = requestAnimationFrame(() => {
      if (pathMode === "random-wander") {
        const rand = EVA_PATHS[Math.floor(Math.random() * EVA_PATHS.length)];
        activeRandomPathIdRef.current = rand.id;
        setActiveRandomPathId(rand.id);
      }
      syncWaypointsToPosition(posRef.current);
      if (pathMode !== "pinned") {
        triggerNaturalPause(2.0 + Math.random() * 2.0);
      }
    });
    return () => cancelAnimationFrame(rafId);
  }, [pathMode, syncWaypointsToPosition, triggerNaturalPause]);

  useEffect(() => {
    let animFrameId: number;
    let lastTimestamp: number | null = null;
    const lerp = (a: number, b: number, alpha: number) => a + (b - a) * alpha;
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

    const step = (now: number) => {
      if (lastTimestamp === null) lastTimestamp = now;
      const dt = Math.max(0, Math.min(0.05, (now - lastTimestamp) / 1000));
      lastTimestamp = now;

      const isDragging = Boolean(pointerDownRef.current?.dragging);
      isDraggingRef.current = isDragging;
      const wanderingOn = isWanderingEnabledRef.current && pathModeRef.current !== "pinned";
      const bobPx = isDragging ? 0 : Math.sin(now * 0.0032) * 6;

      const decelAlpha = clamp(0.14 * (dt * 60), 0, 1);
      const accelAlpha = clamp(0.075 * (dt * 60), 0, 1);
      const rotXAlpha = clamp(0.08 * (dt * 60), 0, 1);
      const rotYAlpha = clamp(0.09 * (dt * 60), 0, 1);
      const bankZAlpha = clamp(0.1 * (dt * 60), 0, 1);

      if (!isEvaVisibleRef.current || teleportPhaseRef.current !== "idle") {
        velRef.current = { vx: 0, vy: 0 };
        dragVxRef.current = 0;
        rotRef.current.x = lerp(rotRef.current.x, EVA_BASE_PITCH_X, rotXAlpha);
        rotRef.current.y = lerp(rotRef.current.y, 0, rotYAlpha);
        rotRef.current.z = lerp(rotRef.current.z, 0, bankZAlpha);
        prevPosRef.current = { ...posRef.current };
        setEvaPos({ ...posRef.current, bobPx: 0 });
      } else if (isDragging) {
        const rawDragVx = (posRef.current.xVw - prevPosRef.current.xVw) / Math.max(dt, 0.012);
        prevPosRef.current = { ...posRef.current };
        dragVxRef.current = lerp(dragVxRef.current, rawDragVx, clamp(0.22 * (dt * 60), 0, 1));
        velRef.current = { vx: 0, vy: 0 };

        const dragNormVx = clamp(dragVxRef.current / 26.0, -1, 1);
        const dragRotAlpha = clamp(0.16 * (dt * 60), 0, 1);
        rotRef.current.x = lerp(rotRef.current.x, EVA_BASE_PITCH_X, dragRotAlpha);
        rotRef.current.y = lerp(rotRef.current.y, clamp(dragNormVx * 0.52, -0.55, 0.55), dragRotAlpha);
        rotRef.current.z = lerp(rotRef.current.z, clamp(-dragNormVx * 0.22, -0.25, 0.25), dragRotAlpha);
        setEvaPos({ ...posRef.current, bobPx });
      } else if (isChatOpenRef.current || isHoveredRef.current || !wanderingOn) {
        dragVxRef.current = lerp(dragVxRef.current, 0, decelAlpha);
        velRef.current.vx = Math.abs(velRef.current.vx) < 0.02 ? 0 : lerp(velRef.current.vx, 0, decelAlpha);
        velRef.current.vy = Math.abs(velRef.current.vy) < 0.02 ? 0 : lerp(velRef.current.vy, 0, decelAlpha);

        posRef.current = {
          xVw: clamp(posRef.current.xVw + velRef.current.vx * dt, 2, 86),
          yVh: clamp(posRef.current.yVh + velRef.current.vy * dt, 4, 80),
        };
        prevPosRef.current = { ...posRef.current };

        const settleAlpha = clamp(0.15 * (dt * 60), 0, 1);
        rotRef.current.x = lerp(rotRef.current.x, EVA_BASE_PITCH_X, settleAlpha);
        rotRef.current.y = lerp(rotRef.current.y, 0, settleAlpha);
        rotRef.current.z = lerp(rotRef.current.z, 0, settleAlpha);
        setEvaPos({ ...posRef.current, bobPx });
      } else {
        if (isNaturallyPausedRef.current) {
          naturalPauseRemainingRef.current -= dt;
          if (naturalPauseRemainingRef.current <= 0) {
            naturalPauseRemainingRef.current = 0;
            isNaturallyPausedRef.current = false;
            setIsNaturallyPaused(false);
          }
        }

        if (isNaturallyPausedRef.current) {
          velRef.current.vx = lerp(velRef.current.vx, 0, decelAlpha);
          velRef.current.vy = lerp(velRef.current.vy, 0, decelAlpha);
          const settleAlpha = clamp(0.15 * (dt * 60), 0, 1);
          rotRef.current.x = lerp(rotRef.current.x, EVA_BASE_PITCH_X, settleAlpha);
          rotRef.current.y = lerp(rotRef.current.y, 0, settleAlpha);
          rotRef.current.z = lerp(rotRef.current.z, 0, settleAlpha);
          setEvaPos({ ...posRef.current, bobPx });
        } else {
          const maxSpeed = 11.5;
          const activePath = resolveActivePath(pathModeRef.current, activeRandomPathIdRef.current);
          const waypoints = activePath.waypoints;
          const safeIdx = ((activeWaypointIdxRef.current % waypoints.length) + waypoints.length) % waypoints.length;
          const targetWp = waypoints[safeIdx] || waypoints[0];

          const dx = targetWp.x - posRef.current.xVw;
          const dy = targetWp.y - posRef.current.yVh;
          const dist = Math.hypot(dx, dy);

          let desiredVx = 0;
          let desiredVy = 0;

          if (dist < 2.5) {
            if (safeIdx === waypoints.length - 1) {
              triggerNaturalPause(4.5 + Math.random() * 3.5);
              if (pathModeRef.current === "random-wander") {
                const available = EVA_PATHS.filter((p) => p.id !== activeRandomPathIdRef.current);
                const nextPath = available[Math.floor(Math.random() * available.length)];
                activeRandomPathIdRef.current = nextPath.id;
                setActiveRandomPathId(nextPath.id);
                activeWaypointIdxRef.current = findNextWaypointIndex(posRef.current, nextPath.waypoints);
              } else {
                activeWaypointIdxRef.current = 0;
              }
            } else {
              activeWaypointIdxRef.current = (safeIdx + 1) % waypoints.length;
              if (Math.random() < 0.3) {
                triggerNaturalPause(3.5 + Math.random() * 3.5);
              }
            }
          } else {
            const speed = maxSpeed * clamp(dist / 6.0, 0.45, 1.0);
            desiredVx = (dx / dist) * speed;
            desiredVy = (dy / dist) * speed;
          }

          velRef.current.vx = lerp(velRef.current.vx, desiredVx, accelAlpha);
          velRef.current.vy = lerp(velRef.current.vy, desiredVy, accelAlpha);

          posRef.current = {
            xVw: clamp(posRef.current.xVw + velRef.current.vx * dt, 2, 86),
            yVh: clamp(posRef.current.yVh + velRef.current.vy * dt, 4, 80),
          };
          prevPosRef.current = { ...posRef.current };

          const normVx = clamp(velRef.current.vx / maxSpeed, -1, 1);
          const normVy = clamp(velRef.current.vy / maxSpeed, -1, 1);
          rotRef.current.y = lerp(rotRef.current.y, clamp(normVx * 0.42, -0.45, 0.45), rotYAlpha);
          rotRef.current.x = lerp(rotRef.current.x, EVA_BASE_PITCH_X + clamp(normVy * 0.08, -0.09, 0.09), rotXAlpha);
          rotRef.current.z = lerp(rotRef.current.z, clamp(-normVx * 0.1, -0.12, 0.12), bankZAlpha);

          setEvaPos({ ...posRef.current, bobPx });
        }
      }

      const app = splineAppRef.current;
      if (app) {
        syncSplineEyeMeshes(app, showHappyEyesRef.current, blinkScaleYRef.current);
        if (!isJumpingSpinningRef.current && teleportPhaseRef.current === "idle") {
          const rigObj = app.findObjectByName?.("EVA");
          if (rigObj) {
            rigObj.position.x = 0;
            rigObj.position.y = 0;
            rigObj.position.z = 0;
            rigObj.rotation.x = rotRef.current.x;
            rigObj.rotation.y = rotRef.current.y;
            rigObj.rotation.z = rotRef.current.z;
            app._requestRenderAutoMode?.();
          }
        }
      }

      animFrameId = requestAnimationFrame(step);
    };

    animFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrameId);
  }, [
    blinkScaleYRef,
    isDraggingRef,
    isEvaVisibleRef,
    isJumpingSpinningRef,
    rotRef,
    showHappyEyesRef,
    splineAppRef,
    teleportPhaseRef,
    triggerNaturalPause,
  ]);

  const handleEvaPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
    prevPosRef.current = { ...posRef.current };
    dragVxRef.current = 0;
    pointerDownRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originXVw: posRef.current.xVw,
      originYVh: posRef.current.yVh,
      dragging: false,
    };
  };

  const handleEvaPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerDownRef.current) return;
    e.stopPropagation();
    const dxPx = e.clientX - pointerDownRef.current.startX;
    const dyPx = e.clientY - pointerDownRef.current.startY;

    if (Math.hypot(dxPx, dyPx) > 8) {
      pointerDownRef.current.dragging = true;
      const newXVw = Math.max(1, Math.min(86, pointerDownRef.current.originXVw + (dxPx / window.innerWidth) * 100));
      const newYVh = Math.max(2, Math.min(80, pointerDownRef.current.originYVh + (dyPx / window.innerHeight) * 100));
      posRef.current = { xVw: newXVw, yVh: newYVh };
      setEvaPos({ xVw: newXVw, yVh: newYVh, bobPx: 0 });
    }
  };

  const handleEvaPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerDownRef.current) return;
    e.stopPropagation();
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }

    const dxPx = e.clientX - pointerDownRef.current.startX;
    const dyPx = e.clientY - pointerDownRef.current.startY;
    const wasDrag = pointerDownRef.current.dragging || Math.hypot(dxPx, dyPx) > 8;
    pointerDownRef.current = null;
    isDraggingRef.current = false;

    if (wasDrag) {
      setIsHovered(false);
      isHoveredRef.current = false;
      syncWaypointsToPosition(posRef.current);
      triggerNaturalPause(2.5 + Math.random() * 2.0);
    } else {
      onEvaClick();
    }
  };

  return {
    evaPos,
    posRef,
    activeRandomPathId,
    isNaturallyPaused,
    triggerNaturalPause,
    syncWaypointsToPosition,
    handleEvaPointerDown,
    handleEvaPointerMove,
    handleEvaPointerUp,
  };
}
