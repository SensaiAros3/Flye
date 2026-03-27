import { Request, Response, NextFunction } from "express";
import { db, sessionsTable, usersTable } from "@workspace/db";
import { eq, and, gt } from "drizzle-orm";
import { computeRank, xpForNextRank, xpProgress, RANK_LABELS } from "./xp";

export function buildUserProfile(user: typeof usersTable.$inferSelect) {
  const rank = computeRank(user.xp) as "D" | "C" | "B" | "A" | "S";
  return {
    id: user.id,
    username: user.username,
    xp: user.xp,
    rank,
    rankLabel: RANK_LABELS[rank],
    xpForNextRank: xpForNextRank(rank),
    xpProgress: xpProgress(user.xp, rank),
    totalWorkouts: user.totalWorkouts,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.["flye_session"];
  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const [session] = await db
    .select()
    .from(sessionsTable)
    .where(
      and(
        eq(sessionsTable.sessionToken, token),
        gt(sessionsTable.expiresAt, new Date())
      )
    );

  if (!session) {
    res.status(401).json({ error: "Session expired or invalid" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, session.userId));

  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  (req as any).user = user;
  next();
}
