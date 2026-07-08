import Joi from "joi";

const createAssignment = {
  params: Joi.object().keys({
    classroomId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    title: Joi.string().required().trim(),
    statement: Joi.string().required().trim(),
    marks: Joi.number().integer().min(1).required(),
    deadline: Joi.date().greater("now").required().messages({
      "date.greater": "Deadline must be set in the future",
    }),
  }),
};

const updateAssignment = {
  params: Joi.object().keys({
    assignmentId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().optional().trim(),
      statement: Joi.string().optional().trim(),
      marks: Joi.number().integer().min(1).optional(),
      deadline: Joi.date().greater("now").optional().messages({
        "date.greater": "Deadline must be set in the future",
      }),
    })
    .min(1),
};

const assignmentById = {
  params: Joi.object().keys({
    assignmentId: Joi.string().required(),
  }),
};

export default {
  createAssignment,
  updateAssignment,
  assignmentById,
};
