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

export const SUCCESS_STATUS_ID = 3;
export const COMPILE_ERROR_STATUS_ID = 6;
