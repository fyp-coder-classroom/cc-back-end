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

export const submitCode = async (
  payload: Judge0SubmissionPayload,
): Promise<Judge0SubmissionResult> => {
  try {
    const response = await judge0Client.post(
      "/submissions?wait=true&base64_encoded=true",
      {
        ...payload,
        source_code: Buffer.from(payload.source_code, "utf-8").toString(
          "base64",
        ),
        stdin: payload.stdin
          ? Buffer.from(payload.stdin, "utf-8").toString("base64")
          : undefined,
      },
    );

    if (!response.data || !response.data.status) {
      console.error("Judge0 malformed response:", response.data);
      throw new Error("Malformed Judge0 response");
    }

    const decode = (value: string | null) =>
      value ? Buffer.from(value, "base64").toString("utf-8") : value;

    return {
      ...response.data,
      stdout: decode(response.data.stdout),
      stderr: decode(response.data.stderr),
      compile_output: decode(response.data.compile_output),
      message: decode(response.data.message),
    };
  } catch (error: any) {
    console.error("Judge0 request failed:", {
      code: error.code,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
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
