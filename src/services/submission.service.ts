import Submission from "@/models/submission.model";
import Assignment from "@/models/assignment.model";
import Classroom from "@/models/classroom.model";
import {
  ISubmission,
  CreateSubmission,
  GradeSubmission,
} from "@/types/submission.type";
import { ApiError } from "@/utils";
import httpStatus from "http-status";

export const submitAssignment = async (
  studentId: string,
  assignmentBody: CreateSubmission,
): Promise<ISubmission> => {
  const { assignmentId, code } = assignmentBody;

  // 1. Verify assignment exists
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Assignment not found");
  }

  // 2. Verify student is enrolled in the classroom
  const classroom = await Classroom.findById(assignment.classroomId);
  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, "Classroom not found");
  }

  const isEnrolled = classroom.students.some(
    (id) => id.toString() === studentId,
  );
  if (!isEnrolled) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not enrolled in this classroom",
    );
  }

  // 3. Check deadline
  const now = new Date();
  const deadline = new Date(assignment.deadline);
  const isLate = now > deadline;

  if (isLate) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Assignment deadline has passed",
    );
  }

  // 4. Check for duplicate submission (Option A: only one submission allowed)
  const existingSubmission = await Submission.findOne({
    studentId,
    assignmentId,
  });

  if (existingSubmission) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "You have already submitted this assignment",
    );
  }

  // 5. Create submission
  const submission = await Submission.create({
    studentId,
    assignmentId,
    code,
    submittedAt: now,
    isLate,
  });

  return submission;
};

export const getSubmissionsByAssignment = async (
  assignmentId: string,
  teacherId: string,
): Promise<ISubmission[]> => {
  // 1. Verify assignment exists
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Assignment not found");
  }

  // 2. Verify teacher owns the classroom
  const classroom = await Classroom.findById(assignment.classroomId);
  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, "Classroom not found");
  }

  if (classroom.teacherId.toString() !== teacherId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to view submissions for this assignment",
    );
  }

  // 3. Get submissions with populated student info
  const submissions = await Submission.find({ assignmentId })
    .populate("studentId", "name email")
    .sort({ submittedAt: -1 });

  return submissions;
};

export const getStudentSubmission = async (
  studentId: string,
  assignmentId: string,
): Promise<ISubmission | null> => {
  // 1. Verify assignment exists
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Assignment not found");
  }

  // 2. Verify student is enrolled
  const classroom = await Classroom.findById(assignment.classroomId);
  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, "Classroom not found");
  }

  const isEnrolled = classroom.students.some(
    (id) => id.toString() === studentId,
  );
  if (!isEnrolled) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not enrolled in this classroom",
    );
  }

  // 3. Get submission (may be null if not submitted yet)
  const submission = await Submission.findOne({
    studentId,
    assignmentId,
  });

  return submission;
};

export const getSubmissionById = async (
  submissionId: string,
  userId: string,
  userRole: string,
): Promise<ISubmission> => {
  // 1. Get submission
  const submission = await Submission.findById(submissionId)
    .populate("studentId", "name email")
    .populate("gradedBy", "name email");

  if (!submission) {
    throw new ApiError(httpStatus.NOT_FOUND, "Submission not found");
  }

  // 2. Verify access (teacher can view any, student can only view own)
  if (userRole === "student") {
    if (submission.studentId._id.toString() !== userId) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "You can only view your own submission",
      );
    }
  } else if (userRole === "teacher") {
    // Verify teacher owns the assignment's classroom
    const assignment = await Assignment.findById(submission.assignmentId);
    if (!assignment) {
      throw new ApiError(httpStatus.NOT_FOUND, "Assignment not found");
    }

    if (assignment.teacherId.toString() !== userId) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "You are not authorized to view this submission",
      );
    }
  }

  return submission;
};

export const gradeSubmission = async (
  submissionId: string,
  teacherId: string,
  gradeBody: GradeSubmission,
): Promise<ISubmission> => {
  const { marks, feedback } = gradeBody;

  // 1. Get submission
  const submission = await Submission.findById(submissionId);
  if (!submission) {
    throw new ApiError(httpStatus.NOT_FOUND, "Submission not found");
  }

  // 2. Verify teacher owns the assignment
  const assignment = await Assignment.findById(submission.assignmentId);
  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Assignment not found");
  }

  if (assignment.teacherId.toString() !== teacherId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to grade this submission",
    );
  }

  // 3. Validate marks
  if (marks < 0 || marks > assignment.marks) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Marks must be between 0 and ${assignment.marks}`,
    );
  }

  // 4. Update submission
  submission.marks = marks;
  submission.feedback = feedback && feedback.trim() ? feedback : undefined;
  submission.gradedAt = new Date();
  submission.gradedBy = teacherId as any;
  await submission.save();

  // 5. Return with populated fields
  await submission.populate("studentId", "name email");
  await submission.populate("gradedBy", "name email");

  return submission;
};

export const deleteSubmission = async (
  submissionId: string,
  teacherId: string,
): Promise<void> => {
  // 1. Get submission
  const submission = await Submission.findById(submissionId);
  if (!submission) {
    throw new ApiError(httpStatus.NOT_FOUND, "Submission not found");
  }

  // 2. Verify teacher owns the assignment
  const assignment = await Assignment.findById(submission.assignmentId);
  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Assignment not found");
  }

  if (assignment.teacherId.toString() !== teacherId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to delete this submission",
    );
  }

  // 3. Delete submission
  await Submission.findByIdAndDelete(submissionId);
};
