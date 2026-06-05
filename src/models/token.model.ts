import mongoose, { model, Schema } from "mongoose";
import { tokenTypes } from "@/config/token";
import { IToken } from "@/types/token.type";
import { toJSON } from "./plugins";

const tokenSchema = new Schema<IToken>(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    type: {
      type: String,
      enum: [
        tokenTypes.REFRESH,
        tokenTypes.RESET_PASSWORD,
        tokenTypes.VERIFY_EMAIL,
      ],
      required: true,
    },
    expires: {
      type: Date,
      default: null,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

tokenSchema.plugin(toJSON);

const Token = model<IToken>("Token", tokenSchema);
export default Token;
