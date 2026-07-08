import Joi from "joi";
import { objectId } from "./custom.validation";

const createClassroom = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    description: Joi.string().optional().trim().default(""),
  }),
};

const joinClassroom = {
  body: Joi.object().keys({
    classCode: Joi.string().required().trim(),
  }),
};

const getClassroomById = {
  params: Joi.object().keys({
    classroomId: Joi.string().custom(objectId).required(),
  }),
};

const updateClassroom = {
  params: Joi.object().keys({
    classroomId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().optional().trim(),
      description: Joi.string().optional().trim(),
    })
    .min(1),
};

const removeStudentFromClassroom = {
  params: Joi.object().keys({
    classroomId: Joi.string().custom(objectId).required(),
    studentId: Joi.string().custom(objectId).required(),
  }),
};

export default {
  createClassroom,
  joinClassroom,
  getClassroomById,
  updateClassroom,
  removeStudentFromClassroom,
};