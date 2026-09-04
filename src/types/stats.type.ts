import { Document, Model, Types } from "mongoose";

// Performance Trend - moving average of last 5 scores
export interface PerformanceTrend {
  submissionId: Types.ObjectId;
  score: number; // percentage 0-100
  submittedAt: Date;
}

// Per-student statistics
export interface PerStudentStats {
  studentId: Types.ObjectId;
  submissionsMade: number; // count submitted
  totalAssignments: number; // total in classroom
  averageScore: number | null; // percentage, null if no graded submissions
  performanceTrend: PerformanceTrend[]; // last N submissions
  lateSubmissions: number; // count of isLate=true
  missingAssignmentIds: Types.ObjectId[]; // assignments not submitted
  classRank: "above_average" | "around_average" | "below_average" | null; // relative to class average
}

// Classroom-level statistics (persisted document)
export interface IClassroomStats extends Document {
  classroomId: Types.ObjectId;
  totalAssignments: number;
  classAverageScore: number | null; // percentage, null if no graded submissions
  onTimeSubmissionRate: number | null; // percentage
  participationRate: number | null; // percentage
  gradingBacklog: number; // count of ungraded submissions
  perStudent: PerStudentStats[];
  computedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IClassroomStatsModel extends Model<IClassroomStats> {}

// Request/Response types
export interface GetClassroomStatsResponse {
  classroomId: Types.ObjectId;
  totalAssignments: number;
  classAverageScore: number | null;
  onTimeSubmissionRate: number | null;
  participationRate: number | null;
  gradingBacklog: number;
  perStudent: PerStudentStats[];
  computedAt: Date;
}

export interface GetMyStatsResponse {
  classroomId: Types.ObjectId;
  studentId: Types.ObjectId;
  studentName: string;
  studentEmail: string;
  // Student's own data
  mySubmissionsMade: number;
  myTotalAssignments: number;
  myAverageScore: number | null;
  myPerformanceTrend: PerformanceTrend[];
  myLateSubmissions: number;
  myMissingAssignmentIds: Types.ObjectId[];
  myClassRank: "above_average" | "around_average" | "below_average" | null;
  // Class context
  classAverageScore: number | null;
  computedAt: Date;
}