import axios from "axios";
import { ApiError } from "@/utils";
import httpStatus from "http-status";

const JUDGE0_BASE_URL = process.env.JUDGE0_API_URL || "http://localhost:2358";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || "";

const judge0Client = axios.create({
  baseURL: JUDGE0_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(JUDGE0_API_KEY && { "X-Auth-Token": JUDGE0_API_KEY }),
  },
});

export interface Judge0SubmissionPayload {
  source_code: string;
  language_id: number;
  stdin?: string;
}

export interface Judge0SubmissionResult {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: {
    id: number;
    description: string;
  };
  time: string | null;
  memory: number | null;
}

// Submit code and wait for result (synchronous mode with wait=true)
export const submitCode = async (
  payload: Judge0SubmissionPayload,
): Promise<Judge0SubmissionResult> => {
  try {
    const response = await judge0Client.post(
      "/submissions?wait=true&base64_encoded=false",
      payload,
    );
    return response.data;
  } catch (error: any) {
    throw new ApiError(
      httpStatus.BAD_GATEWAY,
      "Code execution service is unavailable",
    );
  }
};

// Fetch supported languages (useful for validation)
export const getLanguages = async (): Promise<
  { id: number; name: string }[]
> => {
  try {
    const response = await judge0Client.get("/languages");
    return response.data;
  } catch (error: any) {
    throw new ApiError(
      httpStatus.BAD_GATEWAY,
      "Code execution service is unavailable",
    );
  }
};
