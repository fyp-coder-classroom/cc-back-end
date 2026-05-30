import { model, Schema } from "mongoose";
import { IToken } from "../types/user.type";

const tokenSchema = new Schema<IToken>(
  {
    userId: {
      type: String,
      required: true,
      ref: "User"
    },
    type: {
      type: String,
      enum: ['access', 'refresh'],
      required: true
    },
    token: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Token = model<IToken>("Token", tokenSchema);
export default Token;