import { submitCode } from "@/lib/judge0";
import { ApiError } from "@/utils";
import httpStatus from "http-status";

// Judge0 language IDs for supported languages
// Full list: https://github.com/judge0/judge0/blob/master/docs/languages/README.md
export const SUPPORTED_LANGUAGES = {
  javascript: { id: 63, label: "JavaScript (Node.js 12.14.0)" },
  python: { id: 71, label: "Python (3.8.1)" },
  cpp: { id: 54, label: "C++ (GCC 9.2.0)" },
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

export interface ExecutionRequest {
  sourceCode: string;
  language: SupportedLanguage;
  stdin?: string;
}

export interface ExecutionResult {
  output: string | null;
  error: string | null;
  status: string;
  isSuccess: boolean;
  executionTime: string | null;
  memoryUsed: number | null;
}

// Judge0 status IDs
// 1 = In Queue, 2 = Processing, 3 = Accepted, 4 = Wrong Answer
// 5 = Time Limit Exceeded, 6 = Compilation Error, 7-12 = Runtime Errors
const SUCCESS_STATUS_ID = 3;
const COMPILE_ERROR_STATUS_ID = 6;

export const executeCode = async (
  request: ExecutionRequest,
): Promise<ExecutionResult> => {
  const { sourceCode, language, stdin } = request;

  if (!sourceCode || sourceCode.trim() === "") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Source code cannot be empty");
  }

  const languageConfig = SUPPORTED_LANGUAGES[language];
  if (!languageConfig) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Unsupported language. Supported languages are: ${Object.keys(SUPPORTED_LANGUAGES).join(", ")}`,
    );
  }

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
