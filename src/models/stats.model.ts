import { model, Schema } from "mongoose";
import { IClassroomStats, IClassroomStatsModel } from "@/types/stats.type";
import { paginate, toJSON } from "./plugins";

const performanceTrendSchema = new Schema({
  submissionId: {
    type: Schema.Types.ObjectId,
    ref: "Submission",
    required: true,
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  submittedAt: {
    type: Date,
    required: true,
  },
});

const perStudentStatsSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  submissionsMade: {
    type: Number,
    default: 0,
  },
  totalAssignments: {
    type: Number,
    default: 0,
  },
  averageScore: {
    type: Number,
    min: 0,
    max: 100,
    default: null,
  },
  performanceTrend: [performanceTrendSchema],
  lateSubmissions: {
    type: Number,
    default: 0,
  },
  missingAssignmentIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
    },
  ],
  classRank: {
    type: String,
    enum: ["above_average", "around_average", "below_average", null],
    default: null,
  },
});

const classroomStatsSchema = new Schema<IClassroomStats>(
  {
    classroomId: {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
      unique: true,
    },
    totalAssignments: {
      type: Number,
      default: 0,
    },
    classAverageScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    onTimeSubmissionRate: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    participationRate: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    gradingBacklog: {
      type: Number,
      default: 0,
    },
    perStudent: [perStudentStatsSchema],
    computedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

classroomStatsSchema.plugin(paginate);
classroomStatsSchema.plugin(toJSON);

const ClassroomStats = model<IClassroomStats, IClassroomStatsModel>(
  "ClassroomStats",
  classroomStatsSchema
) as any;

export default ClassroomStats;