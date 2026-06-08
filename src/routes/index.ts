
import express from "express";
import authRoutes from "./auth.route";
import classroomRoutes from "./classroom.routes";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/classrooms",
    route: classroomRoutes,
  },
];

defaultRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});


export default router;
