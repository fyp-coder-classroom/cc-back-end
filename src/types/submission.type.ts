import { Document, Model, Types } from "mongoose";

export interface ISubmission extends Document {
  studentId: Types.ObjectId;
  assignmentId: Types.ObjectId;
  code: string;
  submittedAt: Date;
  isLate: boolean;
  marks?: number;
  feedback?: string;
  gradedAt?: Date;
  gradedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubmissionModel extends Model<ISubmission> {}

export interface CreateSubmission {
  assignmentId: string;
  code: string;
}

export interface GradeSubmission {
  marks: number;
  feedback?: string;
}