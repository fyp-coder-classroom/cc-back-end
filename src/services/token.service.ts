import jwt from "jsonwebtoken";

const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ||
      "15m") as jwt.SignOptions["expiresIn"],
  });
};

const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ||
      "3d") as jwt.SignOptions["expiresIn"],
  });
};

export default {
  generateAccessToken,
  generateRefreshToken,
};
