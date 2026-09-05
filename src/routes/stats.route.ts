import { Router } from "express";
import * as StatsController from "@/controllers/stats.controller";
import validate from "@/middlewares/validate";
import auth from "@/middlewares/auth";
import statsValidation from "@/validations/stats.validation";
import { STUDENT, TEACHER } from "@/config/roles";

const router = Router();

// GET /statistic/classroom/:classroomId - Teacher views classroom stats
router.get(
  "/classroom/:classroomId",
  auth([TEACHER]),
  validate(statsValidation.getClassroomStats),
  StatsController.getClassroomStats,
);

// GET /statistic/my/:classroomId - Student views own stats
router.get(
  "/my/:classroomId",
  auth([STUDENT]),
  validate(statsValidation.getMyStats),
  StatsController.getMyStats,
);

// POST /statistic/classroom/:classroomId/recompute - Teacher forces recompute
router.post(
  "/classroom/:classroomId/recompute",
  auth([TEACHER]),
  validate(statsValidation.recomputeStats),
  StatsController.recomputeStats,
);

export default router;