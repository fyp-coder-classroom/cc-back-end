import { Request, Response } from "express";
import httpStatus from "http-status";
import * as CodeExecutionService from "@/services/code-execution.service";

export const executeCode = async (req: Request, res: Response) => {
  const { sourceCode, language, stdin } = req.body;

  const result = await CodeExecutionService.executeCode({
    sourceCode,
    language,
    stdin,
  });

  res.status(httpStatus.OK).json({ data: result });
};

export const getSupportedLanguages = async (req: Request, res: Response) => {
  const languages = CodeExecutionService.getSupportedLanguages();
  res.status(httpStatus.OK).json({ data: languages });
};

export default {
  executeCode,
  getSupportedLanguages,
};
