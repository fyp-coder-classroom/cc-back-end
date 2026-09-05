import Joi from "joi";
import { objectId } from "./custom.validation";

const submitAssignment = {
  body: Joi.object().keys({
    assignmentId: Joi.string().custom(objectId).required(),
    code: Joi.string().required().trim(),
  }),
};

const getSubmissionsByAssignment = {
  params: Joi.object().keys({
    assignmentId: Joi.string().custom(objectId).required(),
  }),
};

const getStudentSubmission = {
  params: Joi.object().keys({
    assignmentId: Joi.string().custom(objectId).required(),
  }),
};

const getSubmissionById = {
  params: Joi.object().keys({
    submissionId: Joi.string().custom(objectId).required(),
  }),
};

const gradeSubmission = {
  params: Joi.object().keys({
    submissionId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    marks: Joi.number().integer().min(0).required(),
    feedback: Joi.string().optional().trim().allow("").default(""),
  }),
};

const deleteSubmission = {
  params: Joi.object().keys({
    submissionId: Joi.string().custom(objectId).required(),
  }),
};

export default {
  submitAssignment,
  getSubmissionsByAssignment,
  getStudentSubmission,
  getSubmissionById,
  gradeSubmission,
  deleteSubmission,
};