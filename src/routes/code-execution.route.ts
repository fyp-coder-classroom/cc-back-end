import { Router } from "express";
import * as CodeExecutionController from "@/controllers/code-execution.controller";
import validate from "@/middlewares/validate";
import auth from "@/middlewares/auth";
import codeExecutionValidation from "@/validations/code-execution.validation";
import { STUDENT, TEACHER } from "@/config/roles";

const router = Router();

router.get(
  "/languages",
  auth([STUDENT, TEACHER]),
  CodeExecutionController.getSupportedLanguages,
);

router.post(
  "/run",
  auth([STUDENT, TEACHER]),
  validate(codeExecutionValidation.executeCode),
  CodeExecutionController.executeCode,
);

export default router;
