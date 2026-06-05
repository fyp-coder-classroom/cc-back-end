import User from "@/models/user.model";
import { PaginationFilters, PaginationOptions } from "@/types/common.type";
import { env } from "@/config/env";
import { CreateUser, IUser } from "@/types/user.type";
import { ApiError } from "@/utils";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";

const isEmailTaken = async (email: string, excludeUserId?: string) => {
  const user = await User.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

const createUser = async (userBody: CreateUser) => {
  if (await isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  const hashedPassword = await bcrypt.hash(userBody.password, env.passwordSalt);
  const user = await User.create({
    name: userBody.name,
    email: userBody.email,
    password: hashedPassword,
    role: userBody.role,
  });

  return sanitizeUser(user);
};

const queryUsers = async (
  options: PaginationOptions,
  filters: PaginationFilters<IUser>,
) => {
  return await User.paginate(options, filters);
};

const getUserById = async (id: string, withPassword = false) => {
  const user = await User.findById(id).select(withPassword ? "+password" : "");

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

const getUserByEmail = async (email: string, withPassword = false) => {
  return User.findOne({ email }).select(withPassword ? "+password" : "");
};

const updateUserById = async (userId: string, updateBody: Partial<IUser>) => {
  const user = await getUserById(userId);

  if (updateBody.email && (await isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUserById = async (userId: string) => {
  const user = await User.findOneAndDelete({ _id: userId });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

const sanitizeUser = (user: any) => {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.password;
  delete obj.__v;
  return obj;
};

export default {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
