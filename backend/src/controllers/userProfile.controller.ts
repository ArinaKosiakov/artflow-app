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
// Allowed profile picture filenames (e.g. "1.png" … "10.png")
const ALLOWED_PROFILE_PICTURES = /^([1-9]|10)\.png$/;

export const updateUserProfile = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
        const userId = req.user!.id;
        const data = { ...req.body };
        if (data.profilePicture !== undefined) {
          if (data.profilePicture === null) {
            data.profilePicture = null;
          } else if (
            typeof data.profilePicture !== "string" ||
            !ALLOWED_PROFILE_PICTURES.test(data.profilePicture)
          ) {
            res.status(400).json({
              success: false,
              error:
                'Invalid profile picture. Use a filename like "1.png" through "10.png".',
            });
            return;
          }
        }
        const userProfile = await userProfileService.updateUserProfile(
          userId,
          data,
        );
        res.json({ success: true, data: userProfile });
    })

export const deleteUserProfile = asyncHandler(
async (req: AuthRequest, res: Response, _next: NextFunction)=>{
    const userId = req.user!.id
    await userProfileService.deleteUserProfile(userId);
    res.json({success: true, message: 'User profile deleted successfully'});
})
