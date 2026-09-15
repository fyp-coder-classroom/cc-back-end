import Joi from "joi";
import { password } from "./custom.validation";

const initiateRegistration = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    role: Joi.string().required(),
  }),
};

const completeRegistration = {
  body: Joi.object().keys({
    registrationToken: Joi.string().required(),
    otp: Joi.string().length(6).required(), // Assuming 6-digit OTP
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const verifyPasswordResetOtp = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    resetToken: Joi.string().required(),
    newPassword: Joi.string().required().custom(password),
  }),
};

export default {
  initiateRegistration,
  completeRegistration,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  verifyPasswordResetOtp,
  resetPassword,
};
