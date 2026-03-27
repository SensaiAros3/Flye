import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

// GET /api/leaderboard - top users by XP
router.get("/", async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 10, 50);

  const users = await db
    .select()
    .from(usersTable)
    .orderBy(desc(usersTable.xp))
    .limit(limit);

  const leaderboard = users.map((user, index) => ({
    rank: index + 1,
    userId: user.id,
    username: user.username,
    userRank: user.rank,
    xp: user.xp,
    totalWorkouts: user.totalWorkouts,
  }));

  res.json(leaderboard);
});

export default router;
