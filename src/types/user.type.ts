import { Model, Types } from "mongoose";
import { PaginationOptions, PaginationFilters } from "./common.type";

export interface IUser {
  _id: Types.ObjectId;
  id: string;
  role: UserRole;
  name: string;
  email: string;
  password: string;
}

export interface CreateUser {
  role: UserRole;
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
}

export type UserRole = "teacher" | "student";

export interface IUserModel extends Model<IUser> {
  paginate(
    options: PaginationOptions,
    filters: PaginationFilters<IUser>,
  ): Promise<any>;
}
