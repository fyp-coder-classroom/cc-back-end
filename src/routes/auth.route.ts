import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import validate from "@/middlewares/validate";
import authValidation from "@/validations/auth.validation";

const router = Router();

router.post(
  "/register",
  validate(authValidation.register),
  AuthController.register,
);

router.post("/login", validate(authValidation.login), AuthController.login);

router.post("/logout", validate(authValidation.logout), AuthController.logout);

router.post(
  "/refresh-token",
  validate(authValidation.refreshTokens),
  AuthController.refreshAuth,
);

export default router;
