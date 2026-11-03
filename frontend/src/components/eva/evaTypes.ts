export type EvaEmotion = "default" | "happy";

export type EvaPathId =
  | "perimeter-orbit"
  | "top-canopy-glide"
  | "bottom-dock-cruise"
  | "side-dock-patrol"
  | "gentle-u-turn"
  | "butterfly-wings"
  | "horizontal-serpentine"
  | "oval-arena"
  | "corners-scout"
  | "wave-sine"
  | "hourglass-glide"
  | "diamond-shield"
  | "center-orbit-circle"
  | "infinity-wave";

export type EvaPathMode = "random-wander" | "pinned" | EvaPathId;

export type TeleportPhase = "idle" | "appearing" | "disappearing";

export interface EvaPathDefinition {
  id: EvaPathId;
  nameAr: string;
  nameEn: string;
  icon: string;
  waypoints: Array<{ x: number; y: number }>;
}

export interface SplineObject3D {
  visible?: boolean;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

export interface SplineRuntimeApp {
  setVariable?: (name: string, value: unknown) => void;
  emitEvent?: (eventName: string, nameOrUuid?: string) => void;
  findObjectByName?: (name: string) => SplineObject3D | undefined;
  findObjectById?: (id: string) => SplineObject3D | undefined;
  _scene?: { activePage?: { bgColor?: { a: number } } };
  _renderer?: { clearAlphaOverride?: number; setClearAlpha?: (a: number) => void };
  _controls?: {
    enabled?: boolean;
    enableRotate?: boolean;
    enableZoom?: boolean;
    enablePan?: boolean;
  };
  _requestRenderAutoMode?: () => void;
}

export interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
}
