import { Document, Model, Types } from "mongoose";

export interface IClassroom extends Document {
  name: string;
  description: string;
  teacherId: Types.ObjectId;
  classCode: string;
  students: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IClassroomModel extends Model<IClassroom> {
  paginate?: (
    options: { limit?: number; page?: number },
    filters: Record<string, any>,
  ) => Promise<any>;
}

export interface CreateClassroom {
  name: string;
  description?: string;
}

export interface UpdateClassroom {
  name?: string;
  description?: string;
}

export interface ClassroomResponse {
  id: string;
  name: string;
  description: string;
  classCode: string;
  teacherId: string;
  studentCount: number;
  createdAt: Date;
  updatedAt: Date;
}