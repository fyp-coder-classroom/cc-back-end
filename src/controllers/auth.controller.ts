import { Request, RequestHandler, Response } from "express";
import AuthService from "../services/auth.service";
import httpStatus from "http-status";

const initiateRegistration: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  const { name, email, password, role } = req.body;

  const result = await AuthService.initiateRegistration({
    name,
    email,
    password,
    role,
  });

  res.status(httpStatus.OK).json(result);
};

const completeRegistration: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  const { registrationToken, otp } = req.body;

  const result = await AuthService.completeRegistration(registrationToken, otp);

  // Status 201 Created is semantically correct here since the user is now in the DB
  res.status(httpStatus.CREATED).json(result);
};

const login: RequestHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await AuthService.login(email, password);

  res.status(httpStatus.OK).json(result);
};

const logout: RequestHandler = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const result = await AuthService.logout(refreshToken);

  res.status(httpStatus.OK).json(result);
};

const refreshAuth: RequestHandler = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const result = await AuthService.refreshAuth(refreshToken);

  res.status(httpStatus.OK).json(result);
};


const forgetPassword: RequestHandler = async (req: Request, res: Response) => {
  const { email } = req.body;

  const result = await AuthService.forgetPassword(email);

  res.status(httpStatus.OK).json(result);
};

const verifyPasswordResetOtp: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  const { email, otp } = req.body;

  const result = await AuthService.verifyPasswordResetOtp(email, otp);

  res.status(httpStatus.OK).json(result);
};

const resetPassword: RequestHandler = async (req: Request, res: Response) => {
  const { resetToken, newPassword } = req.body;

  const result = await AuthService.resetPassword(resetToken, newPassword);

  res.status(httpStatus.OK).json(result);
};

export default {
  initiateRegistration,
  completeRegistration,
  login,
  logout,
  refreshAuth,
  forgetPassword,
  verifyPasswordResetOtp,
  resetPassword,
};
