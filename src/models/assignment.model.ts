import { model, Schema } from "mongoose";
import { IAssignment, IAssignmentModel } from "@/types/assignment.type";
import { paginate, toJSON } from "./plugins";

const assignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true, trim: true },
    statement: { type: String, required: true, trim: true },
    marks: { type: Number, required: true, min: 1 },
    deadline: { type: Date, required: true },
    classroomId: {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

assignmentSchema.plugin(paginate);
assignmentSchema.plugin(toJSON);

const Assignment = model<IAssignment, IAssignmentModel>(
  "Assignment",
  assignmentSchema,
);

export default Assignment;
