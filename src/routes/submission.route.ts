import { Router } from "express";
import * as SubmissionController from "@/controllers/submission.controller";
import validate from "@/middlewares/validate";
import auth from "@/middlewares/auth";
import submissionValidation from "@/validations/submission.validation";
import { STUDENT, TEACHER } from "@/config/roles";

const router = Router();

// POST /api/submissions
router.post(
  "/",
  auth([STUDENT]),
  validate(submissionValidation.submitAssignment),
  SubmissionController.submitAssignment,
);

// GET /api/submissions/assignment/:assignmentId - Teacher views all submissions
router.get(
  "/assignment/:assignmentId",
  auth([TEACHER]),
  validate(submissionValidation.getSubmissionsByAssignment),
  SubmissionController.getSubmissionsByAssignment,
);

// GET /api/submissions/my/:assignmentId - Student views their own submission
router.get(
  "/my/:assignmentId",
  auth([STUDENT]),
  validate(submissionValidation.getStudentSubmission),
  SubmissionController.getStudentSubmission,
);

// GET /api/submissions/:submissionId - Get specific submission
router.get(
  "/:submissionId",
  auth([STUDENT, TEACHER]),
  validate(submissionValidation.getSubmissionById),
  SubmissionController.getSubmissionById,
);

// PUT /api/submissions/:submissionId/grade - Teacher grades submission
router.put(
  "/:submissionId/grade",
  auth([TEACHER]),
  validate(submissionValidation.gradeSubmission),
  SubmissionController.gradeSubmission,
);

// DELETE /api/submissions/:submissionId - Teacher deletes submission
router.delete(
  "/:submissionId",
  auth([TEACHER]),
  validate(submissionValidation.deleteSubmission),
  SubmissionController.deleteSubmission,
);

export default router;
