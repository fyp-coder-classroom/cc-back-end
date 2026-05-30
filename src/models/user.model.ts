import { model, Schema } from "mongoose";
import { IUser } from "../types/user.type";
import validator from "validator";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      }
    },

    role: {
      type: String,
      required: true,
      enum: ["teacher", "student"]
    },

    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;