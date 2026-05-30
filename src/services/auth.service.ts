import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { IUser } from "../types/user.type";
import Token from "../models/token.model";

const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || "15m") as jwt.SignOptions["expiresIn"] }
  );
};

const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "3d") as jwt.SignOptions["expiresIn"] }
  );
};

export const AuthService = {

  async register(data: Pick<IUser, "name" | "email" | "password" | "role">) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error("Amount with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = new User({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    });

    await user.save();

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    // storing refresh token
    await Token.create({
      userId: user._id.toString(),
      type: 'refresh',
      token: refreshToken
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // bcrypt extracts salt from stored hash automatically — no need to pass salt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    // Deleting all previous tokens (if any exists)
    await Token.deleteMany({ userId: user._id.toString() });

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

       // storing refresh token
    await Token.create({
      userId: user._id.toString(),
      type: 'refresh',
      token: refreshToken
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  async logout(refreshToken: string) {
    // deleting refresh token from db
    const deleted = await Token.findOneAndDelete({ type: 'refresh', token: refreshToken });
    if (!deleted) {
      throw new Error("Invalid refresh token");
    }
    return { message: "Logged out successfully" };
  },

  async refreshToken(refreshToken: string) {
    try {
      // verifying jwt
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      ) as { userId: string };

      // checking the token exisstance in db
      const storedToken = await Token.findOne({
        type: 'refresh',
        token: refreshToken,
        userId: decoded.userId
      });

      if (!storedToken) {
        throw new Error("Refresh token not found or does not belong to this user");
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new Error("User not found");
      }

      // generating new access token
      const newAccessToken = generateAccessToken(user._id.toString(), user.role);

      return { accessToken: newAccessToken };

    } catch {
      throw new Error("Invalid or expired refresh token");
    }
  },
};