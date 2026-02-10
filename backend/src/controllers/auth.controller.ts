import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export const register = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }
    const result = await authService.register(
      name ?? '',
      email,
      password
    );
    res.status(201).json({
      success: true,
      data: result,
    });
  }
);

export const login = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }
    const result = await authService.login(email, password);
    res.json({
      success: true,
      data: result,
    });
  }
);

export const me = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const userId = req.user!.id;
    const user = await authService.getMe(userId);
    res.json({
      success: true,
      data: user,
    });
  }
);
