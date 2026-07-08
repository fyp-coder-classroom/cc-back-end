import { model, Schema } from "mongoose";
import { IClassroom, IClassroomModel } from "@/types/classroom.type";
import { paginate, toJSON } from "./plugins";

const classroomSchema = new Schema<IClassroom>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    classCode: { type: String, required: true, unique: true, trim: true },
    students: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

classroomSchema.plugin(paginate);
classroomSchema.plugin(toJSON);

const Classroom = model<IClassroom, IClassroomModel>(
  "Classroom",
  classroomSchema,
);

export default Classroom;