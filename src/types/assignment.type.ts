import { Document, Model, Types } from "mongoose";

export interface IAssignment extends Document {
  title: string;
  statement: string;
  marks: number;
  deadline: Date;
  classroomId: Types.ObjectId;
  teacherId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAssignmentModel extends Model<IAssignment> {}

export interface CreateAssignment {
  title: string;
  statement: string;
  marks: number;
  deadline: Date | string;
}

export interface UpdateAssignment {
  title?: string;
  statement?: string;
  marks?: number;
  deadline?: Date | string;
}
