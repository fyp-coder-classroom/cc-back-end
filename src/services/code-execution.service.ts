import { submitCode } from "@/lib/judge0";
import {
  COMPILE_ERROR_STATUS_ID,
  ExecutionRequest,
  ExecutionResult,
  SUCCESS_STATUS_ID,
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from "@/types/code-execution.type";
import { ApiError } from "@/utils";
import httpStatus from "http-status";

// Judge0 status IDs
// 1 = In Queue, 2 = Processing, 3 = Accepted, 4 = Wrong Answer
// 5 = Time Limit Exceeded, 6 = Compilation Error, 7-12 = Runtime Errors

export const executeCode = async (
  request: ExecutionRequest,
): Promise<ExecutionResult> => {
  const { sourceCode, language, stdin } = request;

  const languageConfig = SUPPORTED_LANGUAGES[language];

  const result = await submitCode({
    source_code: sourceCode,
    language_id: languageConfig.id,
    stdin: stdin || "",
  });

  const isSuccess = result.status.id === SUCCESS_STATUS_ID;

  // Compile error: show compile_output
  // Runtime error: show stderr
  // Success: show stdout
  let error: string | null = null;
  if (result.status.id === COMPILE_ERROR_STATUS_ID) {
    error = result.compile_output;
  } else if (!isSuccess) {
    error = result.stderr || result.message || result.status.description;
  }

  return {
    output: isSuccess ? result.stdout : null,
    error,
    status: result.status.description,
    isSuccess,
    executionTime: result.time,
    memoryUsed: result.memory,
  };
};

export const getSupportedLanguages = (): {
  key: SupportedLanguage;
  label: string;
}[] => {
  return Object.entries(SUPPORTED_LANGUAGES).map(([key, value]) => ({
    key: key as SupportedLanguage,
    label: value.label,
  }));
};
