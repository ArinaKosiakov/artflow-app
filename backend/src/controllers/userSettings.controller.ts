import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middleware/errorHandler';
import { SettingsService } from '../services/settings.service';

const settingsService = new SettingsService();

export const getSettings = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const userId = req.user!.id;
    const settings = await settingsService.getSettings(userId);
    res.json(settings);
  }
);
export const updateSettings = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
        const userId = req.user!.id;
        const {darkMode, language} = req.body;
        const settings = await settingsService.updateSettings(userId, {darkMode, language});
        res.json({success: true, data: settings});
    }
);
export const deleteSettings = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
        const userId = req.user!.id;
        await settingsService.deleteSettings(userId);
        res.json({success: true, message: 'Settings deleted successfully'});
    })