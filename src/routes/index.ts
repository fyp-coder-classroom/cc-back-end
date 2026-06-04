import express from "express";
import authRoutes from "./auth.route";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
];

defaultRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
