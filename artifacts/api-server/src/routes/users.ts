import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { buildUserProfile } from "../lib/auth";

const router = Router();

// GET /api/users/:username - public profile
router.get("/:username", async (req, res) => {
  const { username } = req.params;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username));

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(buildUserProfile(user));
});

export default router;
