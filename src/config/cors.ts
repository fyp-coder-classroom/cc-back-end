import type { CorsOptions } from "cors";
import { env } from "./env";

const isProduction = process.env.NODE_ENV === "production";

export const corsOptions: CorsOptions = {
  origin: isProduction ? env.frontend.url : "*",
  credentials: isProduction,
};
