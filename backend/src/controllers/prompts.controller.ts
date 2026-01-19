import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middleware/errorHandler';
import { PromptService } from '../services/prompts.service';
const promptService = new PromptService();

export const getPrompts = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
        const userId = req.user!.id;
        const prompts = await promptService.getPrompts(userId);
        res.json({success: true, data: prompts});
    }
)
export const getPromptById = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
        const userId = req.user!.id;
        const { id } = req.params;
        const prompt = await promptService.getPromptById(id, userId);
        res.json({success: true, data: prompt});
    }
)
export const createPrompt = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
        const userId = req.user!.id;
        const data=req.body;
        const prompt = await promptService.createPrompt(userId, data);
        res.json({success: true, data: prompt});
    }
)
export const updatePrompt = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
        const userId = req.user!.id;
        const {id} =req.params;
        const data=req.body;
        const prompt = await promptService.updatePrompt(id,userId,data)
        res.json({success: true, data: prompt});
    }
)
export const deletePrompt = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
        const userId = req.user!.id;
        const {id} = req.params;
        await promptService.deletePrompt(id,userId);
        res.json({success: true, message: 'Prompt deleted successfully'});
    }
)
export const reorderPrompts = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
        const userId = req.user!.id;
        const data = req.body;
        const prompt = await promptService.reorderPrompts(userId,data);
        res.json({success: true, data: prompt});
    }
)
export const savePrompt = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const userId = req.user!.id;
    const data = req.body;
    const prompt = await promptService.reorderPrompts(userId,data);
    res.json({success: true, data: prompt});
})