import { EvaPathDefinition, EvaPathId, EvaPathMode } from "./evaTypes";

// Calibrated stationary pitch (~8.6°) so EVA faces forward cleanly
export const EVA_BASE_PITCH_X = 0.15;

export const EVA_PATHS: EvaPathDefinition[] = [
  {
    id: "perimeter-orbit",
    nameAr: "طواف المحيط الشامل",
    nameEn: "Perimeter Orbit",
    icon: "🔄",
    waypoints: [
      { x: 80, y: 68 }, { x: 82, y: 38 }, { x: 78, y: 12 }, { x: 45, y: 10 },
      { x: 8, y: 12 }, { x: 6, y: 38 }, { x: 8, y: 68 }, { x: 45, y: 70 },
    ],
  },
  {
    id: "top-canopy-glide",
    nameAr: "استكشاف الحافة العلوية",
    nameEn: "Top Canopy Glide",
    icon: "🌤️",
    waypoints: [
      { x: 80, y: 12 }, { x: 62, y: 16 }, { x: 45, y: 11 }, { x: 26, y: 16 },
      { x: 8, y: 12 }, { x: 26, y: 14 }, { x: 45, y: 16 }, { x: 62, y: 12 },
    ],
  },
  {
    id: "bottom-dock-cruise",
    nameAr: "دورية القاعدة السفلية",
    nameEn: "Bottom Dock Cruise",
    icon: "⚓",
    waypoints: [
      { x: 80, y: 68 }, { x: 62, y: 64 }, { x: 45, y: 70 }, { x: 26, y: 64 },
      { x: 8, y: 68 }, { x: 26, y: 71 }, { x: 45, y: 66 }, { x: 62, y: 71 },
    ],
  },
  {
    id: "side-dock-patrol",
    nameAr: "حراسة الجوانب الرأسية",
    nameEn: "Side Docks Patrol",
    icon: "🛡️",
    waypoints: [
      { x: 81, y: 68 }, { x: 82, y: 40 }, { x: 80, y: 14 }, { x: 45, y: 12 },
      { x: 8, y: 14 }, { x: 6, y: 40 }, { x: 8, y: 68 }, { x: 45, y: 70 },
    ],
  },
  {
    id: "gentle-u-turn",
    nameAr: "قوس الحذوة الانسيابي",
    nameEn: "Gentle U-Turn",
    icon: "🧲",
    waypoints: [
      { x: 8, y: 16 }, { x: 7, y: 46 }, { x: 18, y: 66 }, { x: 45, y: 71 },
      { x: 70, y: 66 }, { x: 81, y: 46 }, { x: 80, y: 16 }, { x: 68, y: 22 },
      { x: 45, y: 26 }, { x: 20, y: 22 },
    ],
  },
  {
    id: "butterfly-wings",
    nameAr: "أجنحة الفراشة المزدوجة",
    nameEn: "Butterfly Wings",
    icon: "🦋",
    waypoints: [
      { x: 45, y: 41 }, { x: 64, y: 22 }, { x: 79, y: 35 }, { x: 68, y: 56 },
      { x: 45, y: 41 }, { x: 22, y: 56 }, { x: 9, y: 35 }, { x: 24, y: 22 },
    ],
  },
  {
    id: "horizontal-serpentine",
    nameAr: "المسح الأفقي المنظم",
    nameEn: "Serpentine Sweep",
    icon: "〰️",
    waypoints: [
      { x: 10, y: 14 }, { x: 78, y: 18 }, { x: 80, y: 38 }, { x: 10, y: 42 },
      { x: 10, y: 64 }, { x: 78, y: 68 }, { x: 80, y: 52 }, { x: 45, y: 32 },
    ],
  },
  {
    id: "oval-arena",
    nameAr: "المدار البيضاوي الكوني",
    nameEn: "Oval Arena",
    icon: "🪐",
    waypoints: [
      { x: 77, y: 41 }, { x: 73, y: 54 }, { x: 61, y: 63 }, { x: 44, y: 66 },
      { x: 27, y: 63 }, { x: 15, y: 54 }, { x: 11, y: 41 }, { x: 15, y: 28 },
      { x: 27, y: 19 }, { x: 44, y: 16 }, { x: 61, y: 19 }, { x: 73, y: 28 },
    ],
  },
  {
    id: "corners-scout",
    nameAr: "حراسة الزوايا الأربع",
    nameEn: "Corners Scout",
    icon: "🧭",
    waypoints: [
      { x: 80, y: 68 }, { x: 45, y: 70 }, { x: 8, y: 68 }, { x: 6, y: 40 },
      { x: 8, y: 14 }, { x: 45, y: 12 }, { x: 80, y: 14 }, { x: 82, y: 40 },
    ],
  },
  {
    id: "wave-sine",
    nameAr: "التموج الجيبي الانسيابي",
    nameEn: "Sine Wave Float",
    icon: "🌊",
    waypoints: [
      { x: 8, y: 40 }, { x: 26, y: 22 }, { x: 45, y: 40 }, { x: 64, y: 58 },
      { x: 80, y: 40 }, { x: 64, y: 22 }, { x: 45, y: 40 }, { x: 26, y: 58 },
    ],
  },
  {
    id: "hourglass-glide",
    nameAr: "الساعة الرملية الهادئة",
    nameEn: "Hourglass Glide",
    icon: "⏳",
    waypoints: [
      { x: 10, y: 14 }, { x: 78, y: 14 }, { x: 54, y: 30 }, { x: 45, y: 41 },
      { x: 34, y: 52 }, { x: 10, y: 68 }, { x: 78, y: 68 }, { x: 54, y: 52 },
      { x: 45, y: 41 }, { x: 34, y: 30 },
    ],
  },
  {
    id: "diamond-shield",
    nameAr: "الدرع الماسي المتوازن",
    nameEn: "Diamond Shield",
    icon: "💎",
    waypoints: [
      { x: 45, y: 12 }, { x: 66, y: 26 }, { x: 80, y: 41 }, { x: 66, y: 56 },
      { x: 45, y: 70 }, { x: 24, y: 56 }, { x: 9, y: 41 }, { x: 24, y: 26 },
    ],
  },
  {
    id: "center-orbit-circle",
    nameAr: "الهالة المركزية",
    nameEn: "Center Halo Orbit",
    icon: "💫",
    waypoints: [
      { x: 59, y: 41 }, { x: 55, y: 31 }, { x: 45, y: 28 }, { x: 35, y: 31 },
      { x: 31, y: 41 }, { x: 35, y: 51 }, { x: 45, y: 54 }, { x: 55, y: 51 },
    ],
  },
  {
    id: "infinity-wave",
    nameAr: "الإنفينيتي الألماسي الأبدي",
    nameEn: "Infinity Wave ∞",
    icon: "∞",
    waypoints: [
      { x: 78, y: 41 }, { x: 69, y: 25 }, { x: 55, y: 33 }, { x: 45, y: 41 },
      { x: 35, y: 49 }, { x: 20, y: 57 }, { x: 10, y: 41 }, { x: 20, y: 25 },
      { x: 35, y: 33 }, { x: 45, y: 41 }, { x: 55, y: 49 }, { x: 69, y: 57 },
    ],
  },
];

export const EVA_PATHS_MAP: Record<string, EvaPathDefinition> = EVA_PATHS.reduce(
  (acc, path) => {
    acc[path.id] = path;
    return acc;
  },
  {} as Record<string, EvaPathDefinition>
);

export function resolveActivePath(
  mode: EvaPathMode,
  activeRandomPathId: EvaPathId
): EvaPathDefinition {
  if (mode === "random-wander" || mode === "pinned") {
    return EVA_PATHS_MAP[activeRandomPathId] || EVA_PATHS[0];
  }
  return EVA_PATHS_MAP[mode] || EVA_PATHS[0];
}

export function findNextWaypointIndex(
  currentPos: { xVw: number; yVh: number },
  waypoints: Array<{ x: number; y: number }>
): number {
  if (!waypoints || waypoints.length <= 1) return 0;

  const N = waypoints.length;
  let minDistanceSq = Infinity;
  let bestSegmentIdx = 0;
  let bestT = 0;

  for (let i = 0; i < N; i++) {
    const a = waypoints[i];
    const b = waypoints[(i + 1) % N];

    const abX = b.x - a.x;
    const abY = b.y - a.y;
    const apX = currentPos.xVw - a.x;
    const apY = currentPos.yVh - a.y;

    const abLenSq = abX * abX + abY * abY;
    const t = abLenSq > 0.0001
      ? Math.max(0, Math.min(1, (apX * abX + apY * abY) / abLenSq))
      : 0;

    const projX = a.x + t * abX;
    const projY = a.y + t * abY;
    const distSq = (currentPos.xVw - projX) ** 2 + (currentPos.yVh - projY) ** 2;

    if (distSq < minDistanceSq) {
      minDistanceSq = distSq;
      bestSegmentIdx = i;
      bestT = t;
    }
  }

  const targetWaypoint = waypoints[(bestSegmentIdx + 1) % N];
  const distToTarget = Math.hypot(
    currentPos.xVw - targetWaypoint.x,
    currentPos.yVh - targetWaypoint.y
  );

  if (bestT > 0.82 || distToTarget < 3.5) {
    return (bestSegmentIdx + 2) % N;
  }

  return (bestSegmentIdx + 1) % N;
}
