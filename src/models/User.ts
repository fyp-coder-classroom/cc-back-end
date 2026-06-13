import mongoose, { Document, Schema } from "mongoose";

// This defines what a User object looks like in TypeScript
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "teacher" | "student";
  createdAt: Date;
}

// This is the actual MongoDB schema (blueprint)
const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,        // name is compulsory
      trim: true,            // removes extra spaces
    },
    email: {
      type: String,
      required: true,        // email is compulsory
      unique: true,          // no two users can have same email
      lowercase: true,       // always saves email in lowercase
      trim: true,
    },
    password: {
      type: String,
      required: true,        // password is compulsory
    },
    role: {
      type: String,
      enum: ["teacher", "student"],  // only these two values allowed
      required: true,
    },
  },
  {
    timestamps: true,  // automatically adds createdAt and updatedAt
  }
);

// This creates the Model from the schema
const User = mongoose.model<IUser>("User", UserSchema);

export default User;