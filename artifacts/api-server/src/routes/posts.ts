import { Router } from "express";
import { db, postsTable, usersTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { requireAuth, buildUserProfile } from "../lib/auth";
import { WORKOUT_XP, computeRank } from "../lib/xp";

const router = Router();

// GET /api/posts - fetch feed
router.get("/", async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 50);
  const offset = Number(req.query.offset) || 0;

  const posts = await db
    .select({
      id: postsTable.id,
      userId: postsTable.userId,
      username: usersTable.username,
      userRank: usersTable.rank,
      workoutType: postsTable.workoutType,
      description: postsTable.description,
      xpEarned: postsTable.xpEarned,
      location: postsTable.location,
      createdAt: postsTable.createdAt,
    })
    .from(postsTable)
    .innerJoin(usersTable, eq(postsTable.userId, usersTable.id))
    .orderBy(desc(postsTable.createdAt))
    .limit(limit)
    .offset(offset);

  res.json(
    posts.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
    }))
  );
});

// POST /api/posts - create a workout post
router.post("/", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const { workoutType, description, location } = req.body;

  if (!workoutType || !["calisthenics", "gym", "power"].includes(workoutType)) {
    res.status(400).json({ error: "Invalid workout type. Choose: calisthenics, gym, or power" });
    return;
  }

  if (!description || description.length < 5) {
    res.status(400).json({ error: "Description must be at least 5 characters" });
    return;
  }

  const xpGained = WORKOUT_XP[workoutType] ?? 40;
  const newXp = user.xp + xpGained;
  const oldRank = computeRank(user.xp);
  const newRank = computeRank(newXp);
  const leveledUp = newRank !== oldRank;

  // Create the post
  const [post] = await db
    .insert(postsTable)
    .values({
      userId: user.id,
      workoutType,
      description,
      xpEarned: xpGained,
      location: location || null,
    })
    .returning();

  // Update user XP, rank, and workout count
  const [updatedUser] = await db
    .update(usersTable)
    .set({
      xp: newXp,
      rank: newRank,
      totalWorkouts: sql`${usersTable.totalWorkouts} + 1`,
    })
    .where(eq(usersTable.id, user.id))
    .returning();

  res.status(201).json({
    post: {
      ...post,
      username: user.username,
      userRank: newRank,
      createdAt: post.createdAt.toISOString(),
    },
    xpGained,
    leveledUp,
    newRank: leveledUp ? newRank : null,
    user: buildUserProfile(updatedUser),
  });
});

// POST /api/posts/:postId/workout - do a workout from a post (gain XP)
router.post("/:postId/workout", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const postId = Number(req.params.postId);

  const [post] = await db.select().from(postsTable).where(eq(postsTable.id, postId));
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  const xpGained = Math.floor(post.xpEarned / 2); // Half XP for doing someone else's workout
  const newXp = user.xp + xpGained;
  const oldRank = computeRank(user.xp);
  const newRank = computeRank(newXp);
  const leveledUp = newRank !== oldRank;

  const [updatedUser] = await db
    .update(usersTable)
    .set({
      xp: newXp,
      rank: newRank,
      totalWorkouts: sql`${usersTable.totalWorkouts} + 1`,
    })
    .where(eq(usersTable.id, user.id))
    .returning();

  res.json({
    xpGained,
    leveledUp,
    newRank: leveledUp ? newRank : null,
    user: buildUserProfile(updatedUser),
  });
});

export default router;
