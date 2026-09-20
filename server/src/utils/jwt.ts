import jwt from 'jsonwebtoken';
import { config } from '../config';
import { JwtPayload } from '../types';

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload as object, config.jwt.secret, { expiresIn: 900 });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload as object, config.jwt.refreshSecret, { expiresIn: 604800 });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, config.jwt.secret);
  return decoded as unknown as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, config.jwt.refreshSecret);
  return decoded as unknown as JwtPayload;
};

export const generateTokens = (payload: JwtPayload) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};
