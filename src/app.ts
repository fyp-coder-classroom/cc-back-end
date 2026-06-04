import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "@/routes";
import mongoSanitize from "express-mongo-sanitize";
import httpStatus from "http-status";
import { ApiError } from "./utils/api-error";
import { corsOptions } from "./config/cors";
import { errorConverter, errorHandler } from "./middlewares/error";

const app = express();

// enable cors
app.use(cors(corsOptions));

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// sanitize request data
app.use(mongoSanitize());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use("/v1", routes);
// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "No endpoint found"));
});

// converting error to ApiError, if needed
app.use(errorConverter);
app.use(errorHandler);

export default app;
