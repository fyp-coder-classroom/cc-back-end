import { model, Schema } from "mongoose";
import { ISubmission, ISubmissionModel } from "@/types/submission.type";
import { paginate, toJSON } from "@/models/plugins";

const submissionSchema = new Schema<ISubmission>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    submittedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    isLate: {
      type: Boolean,
      default: false,
    },
    marks: {
      type: Number,
      min: 0,
      default: null,
    },
    feedback: {
      type: String,
      default: null,
    },
    gradedAt: {
      type: Date,
      default: null,
    },
    gradedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

// Compound unique index: one submission per student per assignment
submissionSchema.index(
  { studentId: 1, assignmentId: 1 },
  { unique: true }
);

submissionSchema.plugin(paginate);
submissionSchema.plugin(toJSON);

const Submission = model<ISubmission, ISubmissionModel>(
  "Submission",
  submissionSchema
);

export default Submission;