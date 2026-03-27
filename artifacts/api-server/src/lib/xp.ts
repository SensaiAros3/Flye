// XP thresholds per rank
export const RANK_THRESHOLDS: Record<string, number> = {
  D: 0,
  C: 1000,
  B: 3000,
  A: 7000,
  S: 15000,
};

export const RANK_ORDER = ["D", "C", "B", "A", "S"] as const;
export type Rank = (typeof RANK_ORDER)[number];

// XP awarded per workout type
export const WORKOUT_XP: Record<string, number> = {
  calisthenics: 50,
  gym: 40,
  power: 60,
};

// Rank label display
export const RANK_LABELS: Record<string, string> = {
  D: "D Rank - Novice",
  C: "C Rank - Beginner",
  B: "B Rank - Intermediate",
  A: "A Rank - Advanced",
  S: "S Rank - Elite Hunter",
};

// Compute rank from total XP
export function computeRank(xp: number): Rank {
  let current: Rank = "D";
  for (const rank of RANK_ORDER) {
    if (xp >= RANK_THRESHOLDS[rank]) {
      current = rank;
    }
  }
  return current;
}

// Get XP required for next rank
export function xpForNextRank(rank: Rank): number {
  const idx = RANK_ORDER.indexOf(rank);
  if (idx >= RANK_ORDER.length - 1) return RANK_THRESHOLDS["S"];
  return RANK_THRESHOLDS[RANK_ORDER[idx + 1]];
}

// XP progress (0-1) toward next rank
export function xpProgress(xp: number, rank: Rank): number {
  const current = RANK_THRESHOLDS[rank];
  const next = xpForNextRank(rank);
  if (next === current) return 1;
  return Math.min((xp - current) / (next - current), 1);
}
