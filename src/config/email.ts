import nodemailer from "nodemailer";
import { logger } from "@/config/logger";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify connection configuration
transporter
  .verify()
  .then(() => logger.info("Connected to email server"))
  .catch((err) =>
    logger.warn(
      "Unable to connect to email server. Make sure you have configured the SMTP options in .env",
      err,
    ),
  );

export default transporter;
