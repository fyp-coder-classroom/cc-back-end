import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { CreateUser, IUser } from "../types/user.type";
import Token from "../models/token.model";
import tokenService from "./token.service";
import userService from "./user.service";
import httpStatus from "http-status";
import { ApiError } from "@/utils";
import { tokenTypes } from "@/config/token";
import { logger } from "@/config/logger";

const register = async (data: CreateUser) => {
  const user = await userService.createUser(data);

  const authTokens = await tokenService.generateAuthTokens(user);

  return {
    user,
    authTokens,
  };
};

const login = async (email: string, password: string) => {
  const user = await userService.getUserByEmail(email, true);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Email or Password !");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Email or Password !");
  }

  // Deleting all previous tokens (if any exists)
  await Token.deleteMany({ user: user._id });

  const authTokens = await tokenService.generateAuthTokens(user);

  return {
    user,
    authTokens,
  };
};

const logout = async (refreshToken: string) => {
  await tokenService.deleteToken({
    type: tokenTypes.REFRESH,
    token: refreshToken,
  });

  return { message: "Logged out successfully" };
};

const refreshAuth = async (refreshToken: string) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH,
    );
    const user = await userService.getUserById(refreshTokenDoc.user.toString());

    await tokenService.deleteToken({ user: refreshTokenDoc.user });
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    logger.error(error);
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

export default {
  register,
  login,
  logout,
  refreshAuth,
};
