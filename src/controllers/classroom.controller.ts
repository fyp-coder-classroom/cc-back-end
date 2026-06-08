import { Request, Response } from "express";
import httpStatus from "http-status";
import * as ClassroomService from "@/services/classroom.service";

export const createClassroom = async (req: Request, res: Response) => {
  const teacherId = (req as any).user?.id || "";
  const classroom = await ClassroomService.createClassroom(
    teacherId,
    req.body,
  );
  res
    .status(httpStatus.CREATED)
    .json({ message: "Classroom created successfully", data: classroom });
};

export const getClassroomById = async (req: Request, res: Response) => {
  const classroomId = (req.params.classroomId as string) || "";
  const classroom = await ClassroomService.getClassroomById(classroomId);
  res.status(httpStatus.OK).json({ message: "Classroom retrieved", data: classroom });
};

export const getTeacherClassrooms = async (req: Request, res: Response) => {
  const teacherId = (req as any).user?.id || "";
  const classrooms = await ClassroomService.getTeacherClassrooms(teacherId);
  res
    .status(httpStatus.OK)
    .json({ message: "Classrooms retrieved", data: classrooms });
};

export const getStudentClassrooms = async (req: Request, res: Response) => {
  const studentId = (req as any).user?.id || "";
  const classrooms = await ClassroomService.getStudentClassrooms(studentId);
  res
    .status(httpStatus.OK)
    .json({ message: "Classrooms retrieved", data: classrooms });
};

export const joinClassroom = async (req: Request, res: Response) => {
  const studentId = (req as any).user?.id || "";
  const classroom = await ClassroomService.joinClassroom(
    studentId,
    req.body.classCode,
  );
  res
    .status(httpStatus.OK)
    .json({ message: "Joined classroom successfully", data: classroom });
};

export const updateClassroom = async (req: Request, res: Response) => {
  const classroomId = (req.params.classroomId as string) || "";
  const teacherId = (req as any).user?.id || "";
  const classroom = await ClassroomService.updateClassroom(
    classroomId,
    teacherId,
    req.body,
  );
  res
    .status(httpStatus.OK)
    .json({ message: "Classroom updated successfully", data: classroom });
};

export const deleteClassroom = async (req: Request, res: Response) => {
  const classroomId = (req.params.classroomId as string) || "";
  const teacherId = (req as any).user?.id || "";
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
  await ClassroomService.removeStudentFromClassroom(
    classroomId,
    studentId,
    teacherId,
  );
  res
    .status(httpStatus.OK)
    .json({ message: "Student removed successfully" });
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