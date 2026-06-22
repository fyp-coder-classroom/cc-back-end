import { Request, Response } from "express";
import httpStatus from "http-status";
import * as AssignmentService from "@/services/assignment.service";

export const createAssignment = async (req: Request, res: Response) => {
  const teacherId = (req as any).user?.id || "";
  const classroomId = (req.params.classroomId as string) || "";

  const assignment = await AssignmentService.createAssignment(
    teacherId,
    classroomId,
    req.body,
  );

  res.status(httpStatus.CREATED).json({ data: assignment });
};

export const getAssignmentsByClassroom = async (
  req: Request,
  res: Response,
) => {
  const classroomId = (req.params.classroomId as string) || "";
  const userId = (req as any).user?.id || "";
  const userRole = (req as any).user?.role;

  const assignments = await AssignmentService.getAssignmentsByClassroom(
    classroomId,
    userId,
    userRole,
  );

  res.status(httpStatus.OK).json({ data: assignments });
};

export const getAssignmentById = async (req: Request, res: Response) => {
  const assignmentId = (req.params.assignmentId as string) || "";
  const userId = (req as any).user?.id || "";
  const userRole = (req as any).user?.role;

  const assignment = await AssignmentService.getAssignmentById(
    assignmentId,
    userId,
    userRole,
  );

  res
    .status(httpStatus.OK)
    .json({ message: "Assignment retrieved", data: assignment });
};

export const updateAssignment = async (req: Request, res: Response) => {
  const assignmentId = (req.params.assignmentId as string) || "";
  const teacherId = (req as any).user?.id || "";
  const userRole = (req as any).user?.role;

  if (userRole !== "teacher") {
    return res.status(httpStatus.FORBIDDEN).json({
      code: httpStatus.FORBIDDEN,
      message: "Only teachers can update assignments",
    });
  }

  const assignment = await AssignmentService.updateAssignment(
    assignmentId,
    teacherId,
    req.body,
  );

  res.status(httpStatus.OK).json({ data: assignment });
};

export const deleteAssignment = async (req: Request, res: Response) => {
  const assignmentId = (req.params.assignmentId as string) || "";
  const teacherId = (req as any).user?.id || "";
  const userRole = (req as any).user?.role;

  if (userRole !== "teacher") {
    return res.status(httpStatus.FORBIDDEN).json({
      code: httpStatus.FORBIDDEN,
      message: "Only teachers can delete assignments",
    });
  }

  await AssignmentService.deleteAssignment(assignmentId, teacherId);
  res.status(httpStatus.NO_CONTENT).send();
};

export default {
  createAssignment,
  getAssignmentsByClassroom,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
};
