import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import postsRouter from "./posts";
import usersRouter from "./users";
import leaderboardRouter from "./leaderboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/posts", postsRouter);
router.use("/users", usersRouter);
router.use("/leaderboard", leaderboardRouter);

export default router;
