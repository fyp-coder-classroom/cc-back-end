import { Router } from "express";
import * as AssignmentController from "@/controllers/assignment.controller";
import validate from "@/middlewares/validate";
import auth from "@/middlewares/auth";
import assignmentValidation from "@/validations/assignment.validation";
import { STUDENT, TEACHER } from "@/config/roles";

const router = Router({ mergeParams: true });

router.post(
  "/",
  auth([TEACHER]),
  validate(assignmentValidation.createAssignment),
  AssignmentController.createAssignment,
);

router.patch(
  "/:assignmentId",
  auth([TEACHER]),
  validate(assignmentValidation.updateAssignment),
  AssignmentController.updateAssignment,
);

router.delete(
  "/:assignmentId",
  auth([TEACHER]),
  validate(assignmentValidation.assignmentById),
  AssignmentController.deleteAssignment,
);

router.get(
  "/",
  auth([TEACHER, STUDENT]),
  AssignmentController.getAssignmentsByClassroom,
);

router.get(
  "/:assignmentId",
  auth([TEACHER, STUDENT]),
  validate(assignmentValidation.assignmentById),
  AssignmentController.getAssignmentById,
);

export default router;
