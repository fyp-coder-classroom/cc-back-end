import { Request, Response } from "express";
import httpStatus from "http-status";
import * as ClassroomService from "@/services/classroom.service";

export const createClassroom = async (req: Request, res: Response) => {
  const teacherId = (req as any).user?.id || "";
  const classroom = await ClassroomService.createClassroom(teacherId, req.body);
  res.status(httpStatus.CREATED).json({ data: classroom });
};

export const getClassroomById = async (req: Request, res: Response) => {
  console.log("this gets called !");
  const classroomId = (req.params.classroomId as string) || "";
  const classroom = await ClassroomService.getClassroomDetails(classroomId);
  res
    .status(httpStatus.OK)
    .json({ message: "Classroom retrieved", data: classroom });
};

export const getTeacherClassrooms = async (req: Request, res: Response) => {
  const teacherId = (req as any).user?.id || "";
  const userRole = (req as any).user?.role;

  if (userRole !== "teacher") {
    return res.status(httpStatus.FORBIDDEN).json({
      code: httpStatus.FORBIDDEN,
      message: "Only teachers can view their classrooms",
    });
  }

  const classrooms = await ClassroomService.getTeacherClassrooms(teacherId);
  res.status(httpStatus.OK).json({ data: classrooms });
};

export const getStudentClassrooms = async (req: Request, res: Response) => {
  const studentId = (req as any).user?.id || "";
  const userRole = (req as any).user?.role;

  if (userRole !== "student") {
    return res.status(httpStatus.FORBIDDEN).json({
      code: httpStatus.FORBIDDEN,
      message: "Only students can view their classrooms",
    });
  }

  const classrooms = await ClassroomService.getStudentClassrooms(studentId);
  res.status(httpStatus.OK).json({ data: classrooms });
};

export const joinClassroom = async (req: Request, res: Response) => {
  const studentId = (req as any).user?.id || "";
  const userRole = (req as any).user?.role;

  if (userRole !== "student") {
    return res.status(httpStatus.FORBIDDEN).json({
      code: httpStatus.FORBIDDEN,
      message: "Only students can join classrooms",
    });
  }

  const classroom = await ClassroomService.joinClassroom(
    studentId,
    req.body.classCode,
  );
  res.status(httpStatus.OK).json({ data: classroom });
};

export const updateClassroom = async (req: Request, res: Response) => {
  const classroomId = (req.params.classroomId as string) || "";
  const teacherId = (req as any).user?.id || "";
  const userRole = (req as any).user?.role;

  if (userRole !== "teacher") {
    return res.status(httpStatus.FORBIDDEN).json({
      code: httpStatus.FORBIDDEN,
      message: "Only teachers can update classrooms",
    });
  }

  const classroom = await ClassroomService.updateClassroom(
    classroomId,
    teacherId,
    req.body,
  );
  res.status(httpStatus.OK).json({ data: classroom });
};

export const deleteClassroom = async (req: Request, res: Response) => {
  const classroomId = (req.params.classroomId as string) || "";
  const teacherId = (req as any).user?.id || "";
  const userRole = (req as any).user?.role;

  if (userRole !== "teacher") {
    return res.status(httpStatus.FORBIDDEN).json({
      code: httpStatus.FORBIDDEN,
      message: "Only teachers can delete classrooms",
    });
  }

  await ClassroomService.deleteClassroom(classroomId, teacherId);
  res.status(httpStatus.NO_CONTENT).send();
};

export const removeStudentFromClassroom = async (
  req: Request,
  res: Response,
) => {
  const classroomId = (req.params.classroomId as string) || "";
  const studentId = (req.params.studentId as string) || "";
  const teacherId = (req as any).user?.id || "";
  const userRole = (req as any).user?.role;

  if (userRole !== "teacher") {
    return res.status(httpStatus.FORBIDDEN).json({
      code: httpStatus.FORBIDDEN,
      message: "Only teachers can remove students",
    });
  }

  await ClassroomService.removeStudentFromClassroom(
    classroomId,
    studentId,
    teacherId,
  );
  res.status(httpStatus.OK).json({ message: "Student removed successfully" });
};

export default {
  createClassroom,
  getClassroomById,
  getTeacherClassrooms,
  getStudentClassrooms,
  joinClassroom,
  updateClassroom,
  deleteClassroom,
  removeStudentFromClassroom,
};
