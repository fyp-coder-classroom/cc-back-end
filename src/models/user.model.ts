import { model, Schema } from "mongoose";
import { IUser, IUserModel } from "../types/user.type";
import validator from "validator";
import { paginate, toJSON } from "./plugins";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
      },
    },

    role: {
      type: String,
      required: true,
      enum: ["teacher", "student"],
    },

    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.plugin(paginate);
userSchema.plugin(toJSON);

const User = model<IUser, IUserModel>("User", userSchema);

export default User;
