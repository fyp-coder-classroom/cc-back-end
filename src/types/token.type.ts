import type { tokenTypes } from "@/config/token";
import { Types } from "mongoose";

export interface IToken {
  user: Types.ObjectId;
  token: string;
  type: TokenTypes;
  expires: Date;
}

export type TokenTypes = (typeof tokenTypes)[keyof typeof tokenTypes];

export interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
}
