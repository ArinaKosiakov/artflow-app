import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, AppError } from '../types';

/**
 * JWT Authentication middleware
 * Verifies JWT token from Authorization header and attaches user to request
 */
export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'No token provided');
    }

    const token = authHeader.replace('Bearer ', '');
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined in environment variables');
      throw new AppError(500, 'Server configuration error');
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as {
        id: string;
        email: string;
        name?: string;
      };

      // Attach user to request
      req.user = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name
      };

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError(401, 'Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError(401, 'Invalid token');
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};


export const optionalAuthenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.replace('Bearer ', '');
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as {
        id: string;
        email: string;
        name?: string;
      };

      req.user = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name
      };
    } catch (error) {
      // Ignore token errors for optional auth
    }

    next();
  } catch (error) {
    next();
  }
};

