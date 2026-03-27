import { Router } from "express";
import { db, usersTable, sessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { requireAuth, buildUserProfile } from "../lib/auth";

const router = Router();

// Hash password with SHA-256 (no bcrypt needed as per spec, simple auth)
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "flye_salt_2024").digest("hex");
}

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  if (username.length < 3 || username.length > 30) {
    res.status(400).json({ error: "Username must be 3-30 characters" });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  }

  const existing = await db.select().from(usersTable).where(eq(usersTable.username, username));
  if (existing.length > 0) {
    res.status(409).json({ error: "Username already taken" });
    return;
  }

  const passwordHash = hashPassword(password);
  const [user] = await db
    .insert(usersTable)
    .values({ username, passwordHash })
    .returning();

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await db.insert(sessionsTable).values({
    sessionToken: token,
    userId: user.id,
    expiresAt,
  });

  res.cookie("flye_session", token, {
    httpOnly: true,
    expires: expiresAt,
    sameSite: "lax",
  });

  res.status(201).json({
    user: buildUserProfile(user),
    message: "Welcome to Flye, Hunter!",
  });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.username, username));
  if (!user || user.passwordHash !== hashPassword(password)) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await db.insert(sessionsTable).values({
    sessionToken: token,
    userId: user.id,
    expiresAt,
  });

  res.cookie("flye_session", token, {
    httpOnly: true,
    expires: expiresAt,
    sameSite: "lax",
  });

  res.json({
    user: buildUserProfile(user),
    message: "Welcome back, Hunter!",
  });
});

// POST /api/auth/logout
router.post("/logout", async (req, res) => {
  const token = req.cookies?.["flye_session"];
  if (token) {
    await db.delete(sessionsTable).where(eq(sessionsTable.sessionToken, token));
  }
  res.clearCookie("flye_session");
  res.json({ message: "Logged out successfully" });
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  const user = (req as any).user;
  res.json(buildUserProfile(user));
});

export default router;
