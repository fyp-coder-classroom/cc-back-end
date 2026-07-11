import { Router } from "express";
import * as SubmissionController from "@/controllers/submission.controller";
import validate from "@/middlewares/validate";
import auth from "@/middlewares/auth";
import submissionValidation from "@/validations/submission.validation";

const router = Router();

// POST /api/submission - Student submits assignment
router.post(
  "/",
  auth,
  validate(submissionValidation.submitAssignment),
  SubmissionController.submitAssignment
);

// GET /api/submission/assignment/:assignmentId - Teacher views all submissions
router.get(
  "/assignment/:assignmentId",
  auth,
  validate(submissionValidation.getSubmissionsByAssignment),
  SubmissionController.getSubmissionsByAssignment
);

// GET /api/submission/my/:assignmentId - Student views their own submission
router.get(
  "/my/:assignmentId",
  auth,
  validate(submissionValidation.getStudentSubmission),
  SubmissionController.getStudentSubmission
);

// GET /api/submission/:submissionId - Get specific submission (teacher or student who submitted)
router.get(
  "/:submissionId",
  auth,
  validate(submissionValidation.getSubmissionById),
  SubmissionController.getSubmissionById
);

// PUT /api/submission/:submissionId/grade - Teacher grades submission
router.put(
  "/:submissionId/grade",
  auth,
  validate(submissionValidation.gradeSubmission),
  SubmissionController.gradeSubmission
);

// DELETE /api/submission/:submissionId - Teacher deletes submission
router.delete(
  "/:submissionId",
  auth,
  validate(submissionValidation.deleteSubmission),
  SubmissionController.deleteSubmission
);

export default router;