import Joi from "joi";
import { SUPPORTED_LANGUAGES } from "@/types/code-execution.type";

const executeCode = {
  body: Joi.object().keys({
    sourceCode: Joi.string().required().min(1),
    language: Joi.string()
      .valid(...Object.keys(SUPPORTED_LANGUAGES))
      .required()
      .messages({
        "any.only": `Language must be one of: ${Object.keys(SUPPORTED_LANGUAGES).join(", ")}`,
      }),
    stdin: Joi.string().optional().allow(""),
  }),
};

export default { executeCode };
