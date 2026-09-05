import ClassroomStats from "@/models/stats.model";
import Submission from "@/models/submission.model";
import Assignment from "@/models/assignment.model";
import Classroom from "@/models/classroom.model";
import User from "@/models/user.model";
import { IClassroomStats, PerStudentStats, PerformanceTrend } from "@/types/stats.type";
import { ApiError } from "@/utils";
import httpStatus from "http-status";

/**
 * Recompute and store classroom statistics
 * Called whenever a submission is made, graded, or deleted
 */
export const recomputeClassroomStats = async (
  classroomId: string
): Promise<IClassroomStats> => {
  // 1. Verify classroom exists
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, "Classroom not found");
  }

  // 2. Get all assignments in classroom
  const assignments = await Assignment.find({ classroomId });
  const totalAssignments = assignments.length;

  // 3. Get all submissions for all assignments
  const submissions = await Submission.find({
    assignmentId: { $in: assignments.map((a) => a._id) },
  }).populate("assignmentId", "marks deadline");

  // 4. Calculate class-level stats
  const gradedSubmissions = submissions.filter((s) => s.marks !== null && s.marks !== undefined);
  
  let classAverageScore: number | null = null;
  if (gradedSubmissions.length > 0) {
    const totalPercentage = gradedSubmissions.reduce((sum, sub) => {
      const maxMarks = (sub.assignmentId as any).marks || 1;
      const marks = sub.marks || 0;
      const percentage = (marks / maxMarks) * 100;
      return sum + percentage;
    }, 0);
    classAverageScore = Math.round((totalPercentage / gradedSubmissions.length) * 100) / 100;
  }

  // On-time submission rate
  let onTimeSubmissionRate: number | null = null;
  if (submissions.length > 0) {
    const onTimeCount = submissions.filter((s) => !s.isLate).length;
    onTimeSubmissionRate = Math.round((onTimeCount / submissions.length) * 10000) / 100;
  }

  // Participation rate
  const submittedStudentIds = new Set(submissions.map((s) => s.studentId.toString()));
  let participationRate: number | null = null;
  if (classroom.students.length > 0) {
    participationRate =
      Math.round((submittedStudentIds.size / classroom.students.length) * 10000) / 100;
  }

  // Grading backlog
  const gradingBacklog = submissions.filter(
    (s) => s.marks === null || s.marks === undefined
  ).length;

  // 5. Calculate per-student stats
  const perStudent: PerStudentStats[] = [];

  for (const student of classroom.students) {
    const studentId = student._id || student;
    const studentSubmissions = submissions.filter((s) =>
      s.studentId.equals(studentId)
    );

    // Submissions made
    const submissionsMade = studentSubmissions.length;

    // Average score for this student
    const studentGradedSubmissions = studentSubmissions.filter(
      (s) => s.marks !== null && s.marks !== undefined
    );
    let averageScore: number | null = null;
    if (studentGradedSubmissions.length > 0) {
      const totalPercentage = studentGradedSubmissions.reduce((sum, sub) => {
        const maxMarks = (sub.assignmentId as any).marks || 1;
        const marks = sub.marks || 0;
        const percentage = (marks / maxMarks) * 100;
        return sum + percentage;
      }, 0);
      averageScore = Math.round((totalPercentage / studentGradedSubmissions.length) * 100) / 100;
    }

    // Performance trend (last 5 graded submissions)
    const performanceTrend: PerformanceTrend[] = studentGradedSubmissions
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 5)
      .map((sub) => {
        const maxMarks = (sub.assignmentId as any).marks || 1;
        const marks = sub.marks || 0;
        const percentage = (marks / maxMarks) * 100;
        return {
          submissionId: sub._id,
          score: Math.round(percentage * 100) / 100,
          submittedAt: sub.submittedAt,
        };
      })
      .reverse(); // chronological order

    // Late submissions count
    const lateSubmissions = studentSubmissions.filter((s) => s.isLate).length;

    // Missing assignments
    const submittedAssignmentIds = new Set(
      studentSubmissions.map((s) => s.assignmentId.toString())
    );
    const missingAssignmentIds = assignments
      .filter((a) => !submittedAssignmentIds.has(a._id.toString()))
      .map((a) => a._id);

    // Class rank (relative to class average)
    let classRank: "above_average" | "around_average" | "below_average" | null = null;
    if (averageScore !== null && classAverageScore !== null) {
      const tolerance = 2; // within 2% = "around average"
      if (averageScore > classAverageScore + tolerance) {
        classRank = "above_average";
      } else if (averageScore < classAverageScore - tolerance) {
        classRank = "below_average";
      } else {
        classRank = "around_average";
      }
    }

    perStudent.push({
      studentId: studentId as any,
      submissionsMade,
      totalAssignments,
      averageScore,
      performanceTrend,
      lateSubmissions,
      missingAssignmentIds,
      classRank,
    });
  }

  // 6. Upsert the stats document
  const stats = (await ClassroomStats.findOneAndUpdate(
    { classroomId },
    {
      classroomId,
      totalAssignments,
      classAverageScore,
      onTimeSubmissionRate,
      participationRate,
      gradingBacklog,
      perStudent,
      computedAt: new Date(),
    },
    { upsert: true, new: true }
  )) as any;

  return stats;
};

/**
 * Get classroom statistics
 * If none exist, compute and store immediately (self-healing)
 */
export const getClassroomStats = async (
  classroomId: string
): Promise<IClassroomStats> => {
  let stats = await ClassroomStats.findOne({ classroomId });

  // Self-healing: if no stats exist yet, compute them
  if (!stats) {
    stats = await recomputeClassroomStats(classroomId);
  }

  return stats;
};

/**
 * Get student's own stats from a classroom
 * Returns only the student's personal entry
 */
export const getMyStats = async (
  classroomId: string,
  studentId: string
): Promise<{
  classroomStats: IClassroomStats;
  studentStats: PerStudentStats | undefined;
  studentUser: any;
}> => {
  // Get stats
  const stats = await getClassroomStats(classroomId);

  // Get student's entry
  const studentStats = stats.perStudent.find((s) =>
    s.studentId.equals(studentId)
  );

  // Get student info
  const studentUser = await User.findById(studentId).select("name email");

  return { classroomStats: stats, studentStats, studentUser };
};