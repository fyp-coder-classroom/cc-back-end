import { Request, Response } from "express";
import httpStatus from "http-status";
import * as StatsService from "@/services/stats.service";
import Classroom from "@/models/classroom.model";

/**
 * GET /statistic/classroom/:classroomId
 * Teacher views classroom statistics
 */
export const getClassroomStats = async (req: Request, res: Response) => {
  const classroomId = (req.params.classroomId as string) || "";
  const teacherId = (req as any).user?.id || "";

  // Verify teacher owns this classroom
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    return res.status(httpStatus.NOT_FOUND).json({
      code: httpStatus.NOT_FOUND,
      message: "Classroom not found",
    });
  }

  if (classroom.teacherId.toString() !== teacherId) {
    return res.status(httpStatus.FORBIDDEN).json({
      code: httpStatus.FORBIDDEN,
      message: "You are not authorized to view statistics for this classroom",
    });
  }

  // Get stats
  const stats = await StatsService.getClassroomStats(classroomId);

  res.status(httpStatus.OK).json({ data: stats });
};

/**
 * GET /statistic/my/:classroomId
 * Student views their own statistics in a classroom
 */
export const getMyStats = async (req: Request, res: Response) => {
  const classroomId = (req.params.classroomId as string) || "";
  const studentId = (req as any).user?.id || "";

  // Verify student is enrolled
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    return res.status(httpStatus.NOT_FOUND).json({
      code: httpStatus.NOT_FOUND,
      message: "Classroom not found",
    });
  }

  const isEnrolled = classroom.students.some((id) => id.equals(studentId));
  if (!isEnrolled) {
    return res.status(httpStatus.FORBIDDEN).json({
      code: httpStatus.FORBIDDEN,
      message: "You are not enrolled in this classroom",
    });
  }

  // Get stats
  const { classroomStats, studentStats, studentUser } = await StatsService.getMyStats(
    classroomId,
    studentId
  );

  // Build response with only student's own data
  const response = {
    classroomId: classroomStats.classroomId,
    studentId: studentId,
    studentName: studentUser?.name || "Unknown",
    studentEmail: studentUser?.email || "Unknown",
    // Student's own stats
    mySubmissionsMade: studentStats?.submissionsMade || 0,
    myTotalAssignments: studentStats?.totalAssignments || 0,
    myAverageScore: studentStats?.averageScore || null,
    myPerformanceTrend: studentStats?.performanceTrend || [],
    myLateSubmissions: studentStats?.lateSubmissions || 0,
    myMissingAssignmentIds: studentStats?.missingAssignmentIds || [],
    myClassRank: studentStats?.classRank || null,
    // Class context
    classAverageScore: classroomStats.classAverageScore,
    computedAt: classroomStats.computedAt,
  };

  res.status(httpStatus.OK).json({ data: response });
};

/**
 * POST /statistic/classroom/:classroomId/recompute
 * Teacher manually triggers recompute of statistics
 */
export const recomputeStats = async (req: Request, res: Response) => {
  const classroomId = (req.params.classroomId as string) || "";
  const teacherId = (req as any).user?.id || "";

  // Verify teacher owns this classroom
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    return res.status(httpStatus.NOT_FOUND).json({
      code: httpStatus.NOT_FOUND,
      message: "Classroom not found",
    });
  }

  if (classroom.teacherId.toString() !== teacherId) {
    return res.status(httpStatus.FORBIDDEN).json({
      code: httpStatus.FORBIDDEN,
      message: "You are not authorized to recompute statistics for this classroom",
    });
  }

  // Force recompute
  const stats = await StatsService.recomputeClassroomStats(classroomId);

  res.status(httpStatus.OK).json({ data: stats });
};

export default {
  getClassroomStats,
  getMyStats,
  recomputeStats,
};