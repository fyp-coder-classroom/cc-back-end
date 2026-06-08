import Classroom from "@/models/classroom.model";
import User from "@/models/user.model";
import {
  IClassroom,
  CreateClassroom,
  UpdateClassroom,
} from "@/types/classroom.type";
import { ApiError } from "@/utils";
import httpStatus from "http-status";
import crypto from "crypto";

const generateClassCode = (): string => {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
};

export const createClassroom = async (
  teacherId: string,
  classroomBody: CreateClassroom,
): Promise<IClassroom> => {
  const teacher = await User.findById(teacherId);
  if (!teacher) {
    throw new ApiError(httpStatus.NOT_FOUND, "Teacher not found");
  }

  if (teacher.role !== "teacher") {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only teachers can create classrooms",
    );
  }

  const classCode = generateClassCode();

  const classroom = await Classroom.create({
    name: classroomBody.name,
    description: classroomBody.description || "",
    teacherId,
    classCode,
    students: [],
  });

  return classroom;
};

export const getClassroomById = async (classroomId: string): Promise<IClassroom> => {
  const classroom = await Classroom.findById(classroomId)
    .populate("teacherId", "name email")
    .populate("students", "name email");

  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, "Classroom not found");
  }

  return classroom;
};

export const getTeacherClassrooms = async (teacherId: string): Promise<IClassroom[]> => {
  const classrooms = await Classroom.find({ teacherId })
    .populate("students", "name email")
    .sort({ createdAt: -1 });

  return classrooms;
};

export const getStudentClassrooms = async (studentId: string): Promise<IClassroom[]> => {
  const classrooms = await Classroom.find({ students: studentId })
    .populate("teacherId", "name email")
    .sort({ createdAt: -1 });

  return classrooms;
};

export const joinClassroom = async (
  studentId: string,
  classCode: string,
): Promise<IClassroom> => {
  const student = await User.findById(studentId);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, "Student not found");
  }

  if (student.role !== "student") {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only students can join classrooms",
    );
  }

  const classroom = await Classroom.findOne({ classCode });
  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid class code");
  }

  if (classroom.students.includes(studentId as any)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have already joined this classroom",
    );
  }

  classroom.students.push(studentId as any);
  await classroom.save();

  return classroom;
};

export const updateClassroom = async (
  classroomId: string,
  teacherId: string,
  updateBody: UpdateClassroom,
): Promise<IClassroom> => {
  const classroom = await getClassroomById(classroomId);

  if (classroom.teacherId.toString() !== teacherId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You can only update your own classrooms",
    );
  }

  Object.assign(classroom, updateBody);
  await classroom.save();

  return classroom;
};

export const deleteClassroom = async (
  classroomId: string,
  teacherId: string,
): Promise<void> => {
  const classroom = await getClassroomById(classroomId);

  if (classroom.teacherId.toString() !== teacherId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You can only delete your own classrooms",
    );
  }

  await Classroom.findByIdAndDelete(classroomId);
};

export const removeStudentFromClassroom = async (
  classroomId: string,
  studentId: string,
  teacherId: string,
): Promise<IClassroom> => {
  const classroom = await getClassroomById(classroomId);

  if (classroom.teacherId.toString() !== teacherId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only the classroom teacher can remove students",
    );
  }

  classroom.students = classroom.students.filter(
    (id) => id.toString() !== studentId,
  );

  await classroom.save();

  return classroom;
};