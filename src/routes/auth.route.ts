import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import validate from "@/middlewares/validate";
import authValidation from "@/validations/auth.validation";

const router = Router();

router.post(
  "/register/initiate",
  validate(authValidation.initiateRegistration),
  AuthController.initiateRegistration,
);

router.post(
  "/register/complete",
  validate(authValidation.completeRegistration),
  AuthController.completeRegistration,
);

router.post("/login", validate(authValidation.login), AuthController.login);

router.post("/logout", validate(authValidation.logout), AuthController.logout);

router.post(
  "/refresh-token",
  validate(authValidation.refreshTokens),
  AuthController.refreshAuth,
);

router.post(
  "/forgot-password",
  validate(authValidation.forgotPassword),
  AuthController.forgetPassword,
);

router.post(
  "/verify-reset-otp",
  validate(authValidation.verifyPasswordResetOtp),
  AuthController.verifyPasswordResetOtp,
);

router.post(
  "/reset-password",
  validate(authValidation.resetPassword),
  AuthController.resetPassword,
);

export default router;
