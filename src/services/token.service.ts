import Token from "@/models/token.model";
import { IToken, JwtPayload, TokenTypes } from "@/types/token.type";
import moment from "moment";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";
import { tokenTypes } from "@/config/token";
import { IUser } from "@/types/user.type";
import httpStatus from "http-status";
import { ApiError } from "@/utils";
import { Types } from "mongoose";

const generateToken = (
  userId: Types.ObjectId,
  expires: moment.Moment,
  type: TokenTypes,
  role: string, // ← ADD THIS
  email: string, // ← ADD THIS
  secret = env.jwt.secret,
) => {
  const payload = {
    sub: userId,
    role, // ← ADD THIS
    email, // ← ADD THIS
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (authToken: IToken) => {
  const tokenDoc = await Token.create(authToken);
  return tokenDoc;
};

const verifyToken = async (token: string, type: TokenTypes) => {
  const payload = jwt.verify(token, env.jwt.secret) as JwtPayload;
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
  });
  if (!tokenDoc) {
    throw new Error("Token not found");
  }
  return tokenDoc;
};

const generateAuthTokens = async (user: IUser) => {
  const accessTokenExpires = moment().add(
    env.jwt.accessExpirationMinutes,
    "minutes",
  );
  const accessToken = generateToken(
    user._id,
    accessTokenExpires,
    tokenTypes.ACCESS,
    user.role, // ← PASS ROLE
    user.email, // ← PASS EMAIL
  );

  const refreshTokenExpires = moment().add(
    env.jwt.refreshExpirationDays,
    "days",
  );
  const refreshToken = generateToken(
    user._id,
    refreshTokenExpires,
    tokenTypes.REFRESH,
    user.role, // ← PASS ROLE
    user.email, // ← PASS EMAIL
  );

  // saving refresh token to DB
  await saveToken({
    user: user._id,
    token: refreshToken,
    type: tokenTypes.REFRESH,
    expires: refreshTokenExpires.toDate(),
  });

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

const deleteToken = async (where: Partial<IToken>) => {
  await Token.findOneAndDelete(where);
};

export default {
  generateAuthTokens,
  deleteToken,
  verifyToken,
  saveToken,
};
