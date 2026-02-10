import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middleware/errorHandler';
import  {UserProfileService} from '../services/userProfile.service';
const userProfileService = new UserProfileService();

export const getUserProfile = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
        const userId = req.user!.id;
        const userProfile = await userProfileService.getUserProfile(userId);
        res.json({success: true, data: userProfile});
    }
)
export const updateUserProfile = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
        const userId = req.user!.id;
        const data = req.body
        const userProfile = await userProfileService.updateUserProfile(userId,data);
        res.json({success: true, data: userProfile});
    })

export const deleteUserProfile = asyncHandler(
async (req: AuthRequest, res: Response, _next: NextFunction)=>{
    const userId = req.user!.id
    await userProfileService.deleteUserProfile(userId);
    res.json({success: true, message: 'User profile deleted successfully'});
})
