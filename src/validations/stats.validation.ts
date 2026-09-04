import Joi from "joi";
import { objectId } from "./custom.validation";

const getClassroomStats = {
  params: Joi.object().keys({
    classroomId: Joi.string().custom(objectId).required(),
  }),
};

const getMyStats = {
  params: Joi.object().keys({
    classroomId: Joi.string().custom(objectId).required(),
  }),
};

const recomputeStats = {
  params: Joi.object().keys({
    classroomId: Joi.string().custom(objectId).required(),
  }),
};

export default {
  getClassroomStats,
  getMyStats,
  recomputeStats,
};