import express from "express";

import authRoutes from "./auth.route";
import classroomRoutes from "./classroom.routes";
import assignmentRoutes from "./assignment.route";
import codeExecutionRoutes from "./code-execution.route";
import submissionRoutes from "./submission.route";
import statsRoutes from "./stats.route";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/classroom",
    route: classroomRoutes,
  },
  {
    path: "/classroom/:classroomId/assignment",
    route: assignmentRoutes,
  },
  {
    path: "/code-execution",
    route: codeExecutionRoutes,
  },
  {
    path: "/submission",
    route: submissionRoutes,
  },
  {
    path: "/statistic",
    route: statsRoutes,
  },
];

defaultRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
