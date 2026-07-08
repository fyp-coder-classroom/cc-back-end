import Assignment from "@/models/assignment.model";
import Classroom from "@/models/classroom.model";
import {
  IAssignment,
  CreateAssignment,
  UpdateAssignment,
} from "@/types/assignment.type";
import { ApiError } from "@/utils";
import httpStatus from "http-status";

export const createAssignment = async (
  teacherId: string,
  classroomId: string,
  assignmentBody: CreateAssignment,
): Promise<IAssignment> => {
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, "Classroom not found");
  }

  if (classroom.teacherId.toString() !== teacherId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You can only create assignments in your own classrooms",
    );
  }

  const deadline = new Date(assignmentBody.deadline);
  if (deadline <= new Date()) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Deadline must be set in the future",
    );
  }

  const assignment = await Assignment.create({
    title: assignmentBody.title,
    statement: assignmentBody.statement,
    marks: assignmentBody.marks,
    deadline,
    classroomId,
    teacherId,
  });

  return assignment;
};

export const getAssignmentsByClassroom = async (
  classroomId: string,
  userId: string,
  userRole: string,
): Promise<IAssignment[]> => {
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, "Classroom not found");
  }

  // Teachers must own the classroom; students must be enrolled
  if (userRole === "teacher" && classroom.teacherId.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You do not have access to this classroom",
    );
  }

  if (
    userRole === "student" &&
    !classroom.students.some((id) => id.toString() === userId)
  ) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not enrolled in this classroom",
    );
  }

  const assignments = await Assignment.find({ classroomId }).sort({
    createdAt: -1,
  });

  return assignments;
};

export const getAssignmentById = async (
  assignmentId: string,
  userId: string,
  userRole: string,
): Promise<IAssignment> => {
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Assignment not found");
  }

  const classroom = await Classroom.findById(assignment.classroomId);
  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, "Classroom not found");
  }

  if (userRole === "teacher" && classroom.teacherId.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You do not have access to this assignment",
    );
  }

  if (
    userRole === "student" &&
    !classroom.students.some((id) => id.toString() === userId)
  ) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not enrolled in this classroom",
    );
  }

  return assignment;
};

export const updateAssignment = async (
  assignmentId: string,
  teacherId: string,
  updateBody: UpdateAssignment,
): Promise<IAssignment> => {
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Assignment not found");
  }

  if (assignment.teacherId.toString() !== teacherId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You can only update your own assignments",
    );
  }

  if (updateBody.deadline) {
    const deadline = new Date(updateBody.deadline);
    if (deadline <= new Date()) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Deadline must be set in the future",
      );
    }
    updateBody.deadline = deadline;
  }

  Object.assign(assignment, updateBody);
  await assignment.save();

  return assignment;
};

export const deleteAssignment = async (
  assignmentId: string,
  teacherId: string,
): Promise<void> => {
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Assignment not found");
  }

  if (assignment.teacherId.toString() !== teacherId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You can only delete your own assignments",
    );
  }

  await Assignment.findByIdAndDelete(assignmentId);
};
