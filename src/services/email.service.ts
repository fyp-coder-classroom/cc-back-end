import transporter from "@/config/email";
import { logger } from "@/config/logger";
import { ApiError } from "@/utils";
import httpStatus from "http-status";

// ==========================================
// 1. BASE EMAIL TEMPLATE
// ==========================================
const baseHtmlTemplate = (title: string, content: string, note: string) => `
<div style="background-color: #ffffff; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #000000; color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);">
    
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px;">CODER CLASSROOM</h1>
    </div>
    
    <div style="margin-bottom: 30px; line-height: 1.6; color: #e0e0e0; font-size: 16px;">
      <h2 style="color: #ffffff; font-size: 20px; margin-top: 0;">${title}</h2>
      ${content}
    </div>
    
    <div style="border-top: 1px solid #333333; padding-top: 20px; text-align: center; color: #888888; font-size: 13px;">
      <p style="margin: 0;">${note}</p>
      <p style="margin: 5px 0 0 0;">If you did not request this, please safely ignore this email.</p>
    </div>
  </div>
</div>
`;

// Helper to wrap OTP codes in a stylish white box with black text
const otpBox = (otp: string) => `
<div style="background-color: #ffffff; color: #000000; padding: 15px 20px; text-align: center; font-size: 32px; letter-spacing: 8px; font-weight: bold; border-radius: 4px; margin: 30px 0;">
  ${otp}
</div>
`;

// ==========================================
// 2. CORE SEND FUNCTION
// ==========================================
const sendEmail = async (
  to: string,
  subject: string,
  htmlContent: string,
): Promise<void> => {
  try {
    const msg = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(msg);
    logger.info(`Email sent to ${to}`);
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error}`);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to send email",
    );
  }
};

// ==========================================
// 3. SPECIFIC EMAIL SENDERS
// ==========================================

const sendRegistrationOtpEmail = async (
  to: string,
  otp: string,
): Promise<void> => {
  const subject = "Verify Your Registration";

  const content = `
    <p>Welcome! We are excited to have you on board.</p>
    <p>Please use the following One-Time Password (OTP) to complete your registration:</p>
    ${otpBox(otp)}
  `;

  const note = "This OTP is valid for <strong>3 minutes</strong>.";
  const html = baseHtmlTemplate("Verify Your Email", content, note);

  await sendEmail(to, subject, html);
};

const sendForgetPasswordOtpEmail = async (
  to: string,
  otp: string,
): Promise<void> => {
  const subject = "Your Password Reset OTP";

  const content = `
    <p>We received a request to reset the password associated with your account.</p>
    <p>Please use the following One-Time Password (OTP) to reset your password:</p>
    ${otpBox(otp)}
  `;

  const note =
    "This OTP is valid for <strong>2 minutes</strong>. Do not share this with anyone.";
  const html = baseHtmlTemplate("Password Reset", content, note);

  await sendEmail(to, subject, html);
};

const send2FAEmail = async (to: string, code: string): Promise<void> => {
  const subject = "Your 2FA Login Code";

  const content = `
    <p>A sign-in attempt requires further verification.</p>
    <p>Please use the following authentication code to complete your login:</p>
    ${otpBox(code)}
  `;

  const note =
    "This code is valid for <strong>3 minutes</strong>. If you did not attempt to log in, please secure your account immediately.";
  const html = baseHtmlTemplate("Two-Factor Authentication", content, note);

  await sendEmail(to, subject, html);
};

export default {
  sendEmail,
  sendRegistrationOtpEmail,
  sendForgetPasswordOtpEmail,
  send2FAEmail,
};
