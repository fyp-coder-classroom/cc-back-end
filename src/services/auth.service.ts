import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { CreateUser, IUser } from "../types/user.type";
import Token from "../models/token.model";
import tokenService from "./token.service";
import emailService from "./email.service";
import userService from "./user.service";
import httpStatus from "http-status";
import { ApiError } from "@/utils";
import { tokenTypes } from "@/config/token";
import { logger } from "@/config/logger";
import moment from "moment";
import { env } from "@/config/env";
import jwt, { JwtPayload } from "jsonwebtoken";

const initiateRegistration = async (data: CreateUser) => {
  const existingUser = await userService.getUserByEmail(data.email);
  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email is already taken");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedOtp = await bcrypt.hash(otp, 8);

  const registrationPayload = {
    type: "registration",
    userData: data,
    otpHash: hashedOtp,
  };

  const registrationToken = jwt.sign(registrationPayload, env.jwt.secret, {
    expiresIn: "3m",
  });

  await emailService.sendRegistrationOtpEmail(data.email, otp);

  return {
    message: "OTP sent successfully. It is valid for 3 minutes.",
    registrationToken,
  };
};

const completeRegistration = async (registrationToken: string, otp: string) => {
  try {
    const payload = jwt.verify(registrationToken, env.jwt.secret) as any;

    if (payload.type !== "registration") {
      throw new Error("Invalid token type");
    }

    const isOtpValid = await bcrypt.compare(otp, payload.otpHash);
    if (!isOtpValid) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
    }

    const { userData } = payload;
    const existingUser = await userService.getUserByEmail(userData.email);
    if (existingUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email is already taken");
    }

    const user = await userService.createUser(userData);

    const authTokens = await tokenService.generateAuthTokens(user);

    return {
      user,
      authTokens,
    };
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Registration token is invalid or has expired",
    );
  }
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

const forgetPassword = async (email: string) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const otp = await tokenService.generateOtpToken(user);

  await emailService.sendForgetPasswordOtpEmail(user.email, otp);

  return { message: "Password reset OTP sent to email" };
};

const verifyPasswordResetOtp = async (email: string, otp: string) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  await tokenService.verifyOtp(otp, user._id);

  const resetTokenExpires = moment().add(15, "minutes");
  const resetToken = tokenService.generateToken(
    user._id,
    resetTokenExpires,
    tokenTypes.RESET_PASSWORD,
    user.role,
    user.email,
  );

  return {
    message: "OTP verified successfully. Please enter your new password.",
    resetToken,
  };
};

const resetPassword = async (resetToken: string, newPassword: string) => {
  try {
    const payload = jwt.verify(resetToken, env.jwt.secret) as JwtPayload;
    if (payload.type !== tokenTypes.RESET_PASSWORD) {
      throw new Error();
    }

    const user = await userService.getUserById(payload.sub!.toString());
    if (!user) {
      throw new Error();
    }

    const hashedPassword = await bcrypt.hash(newPassword, 8);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    await Token.deleteMany({ user: user._id });

    return { message: "Password has been successfully updated" };
  } catch (error) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Invalid or expired reset token",
    );
  }
};

export default {
  initiateRegistration,
  completeRegistration,
  login,
  logout,
  refreshAuth,
  forgetPassword,
  verifyPasswordResetOtp,
  resetPassword,
};
