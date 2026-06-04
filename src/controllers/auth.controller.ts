import { Request, RequestHandler, Response } from "express";
import AuthService from "../services/auth.service";
import httpStatus from "http-status";

const register: RequestHandler = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  const result = await AuthService.register({
    name,
    email,
    password,
    role,
  });

  res.status(httpStatus.OK).json(result);
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

const refreshToken: RequestHandler = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const result = await AuthService.refreshToken(refreshToken);

  res.status(httpStatus.OK).json(result);
};

export default {
  register,
  login,
  logout,
  refreshToken,
};
