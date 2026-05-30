import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export const AuthController = {

  async register(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password || !role) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      const result = await AuthService.register({ name, email, password, role });

      res.status(201).json({
        message: "User registered successfully",
        ...result,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required to login" });
        return;
      }

      const result = await AuthService.login(email, password);

      res.status(200).json({
        message: "Login successful",
        ...result,
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  },

  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({ message: "Refresh token is required" });
        return;
      }

      const result = await AuthService.logout(refreshToken);

      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async refreshToken(req: Request, res: Response){
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({ message: "Refresh token is required" });
        return;
      }

      const result = await AuthService.refreshToken(refreshToken);

      res.status(200).json({
        message: "Access token refreshed successfully",
        ...result,
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  },
};