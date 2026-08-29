import { Request, Response } from "express";
import httpStatus from "http-status";
import * as SubmissionService from "@/services/submission.service";

export const submitAssignment = async (req: Request, res: Response) => {
  console.log("got there");
  const studentId = (req as any).user?.id || "";

  const submission = await SubmissionService.submitAssignment(
    studentId,
    req.body,
  );

  res.status(httpStatus.CREATED).json({ data: submission });
};

export const getSubmissionsByAssignment = async (
  req: Request,
  res: Response,
) => {
  const assignmentId = (req.params.assignmentId as string) || "";
  const teacherId = (req as any).user?.id || "";
  const userRole = (req as any).user?.role;

  if (userRole !== "teacher") {
    return res.status(httpStatus.FORBIDDEN).json({
      code: httpStatus.FORBIDDEN,
      message: "Only teachers can view submissions for an assignment",
    });
  }

  const submissions = await SubmissionService.getSubmissionsByAssignment(
    assignmentId,
    teacherId,
  );

  res.status(httpStatus.OK).json({ data: submissions });
};

export const getStudentSubmission = async (req: Request, res: Response) => {
  console.log("user came there");
  const studentId = (req as any).user?.id || "";
  const assignmentId = (req.params.assignmentId as string) || "";
  const userRole = (req as any).user?.role;

  if (userRole !== "student") {
    return res.status(httpStatus.FORBIDDEN).json({
      code: httpStatus.FORBIDDEN,
      message: "Only students can view their own submission",
    });
  }

  const submission = await SubmissionService.getStudentSubmission(
    studentId,
    assignmentId,
  );

  res.status(httpStatus.OK).json({ data: submission });
};

export const getSubmissionById = async (req: Request, res: Response) => {
  const submissionId = (req.params.submissionId as string) || "";
  const userId = (req as any).user?.id || "";
  const userRole = (req as any).user?.role;

  const submission = await SubmissionService.getSubmissionById(
    submissionId,
    userId,
    userRole,
  );

  res.status(httpStatus.OK).json({ data: submission });
};

export const gradeSubmission = async (req: Request, res: Response) => {
  const submissionId = (req.params.submissionId as string) || "";
  const teacherId = (req as any).user?.id || "";
  const userRole = (req as any).user?.role;

  if (userRole !== "teacher") {
    return res.status(httpStatus.FORBIDDEN).json({
      code: httpStatus.FORBIDDEN,
      message: "Only teachers can grade submissions",
    });
  }

  const submission = await SubmissionService.gradeSubmission(
    submissionId,
    teacherId,
    req.body,
  );

  res.status(httpStatus.OK).json({ data: submission });
};

export const deleteSubmission = async (req: Request, res: Response) => {
  const submissionId = (req.params.submissionId as string) || "";
  const teacherId = (req as any).user?.id || "";
  const userRole = (req as any).user?.role;

  if (userRole !== "teacher") {
    return res.status(httpStatus.FORBIDDEN).json({
      code: httpStatus.FORBIDDEN,
      message: "Only teachers can delete submissions",
    });
  }

  await SubmissionService.deleteSubmission(submissionId, teacherId);

  res.status(httpStatus.NO_CONTENT).send();
};

export default {
  submitAssignment,
  getSubmissionsByAssignment,
  getStudentSubmission,
  getSubmissionById,
  gradeSubmission,
  deleteSubmission,
};
