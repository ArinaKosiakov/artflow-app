import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middleware/errorHandler';
import { ContentIdeasService } from '../services/contentIdeas.service';
const contentIdeasService = new ContentIdeasService();

export const getContentIdeas = asyncHandler(
    async( req:AuthRequest, res: Response, _next: NextFunction) => {
        const userId = req.user!.id;
        const contentIdeas = await contentIdeasService.getContentIdeas(userId);
        res.json({success: true, data: contentIdeas});
    }
)

export const getContentIdeaById = asyncHandler(
    async( req:AuthRequest, res: Response, _next: NextFunction) => {
        const { id } = req.params;
        const userId = req.user!.id
        const contentIdea = await contentIdeasService.getContentIdeaById(id,userId)
        res.json({success:true, data: contentIdea});
    }
)

export const createContentIdea = asyncHandler(async (req:AuthRequest, res: Response, _next: NextFunction) => {
    const userID = req.user!.id;
    const data = req.body
    const contentIdea = await contentIdeasService.createContentIdea(userID, data);
    res.json({ success: true, data: contentIdea });
})
export const updateContentIdea = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const userId = req.user!.id
    const {id} = req.params
    const data = req.body
    const contentIdea = await contentIdeasService.updateContentIdea(id,userId,data)
    res.json({success: true, data: contentIdea});
})
export const toggleContentIdea = asyncHandler(async (req:AuthRequest, res: Response, _next: NextFunction) => {
    const userId = req.user!.id
    const {id} = req.params
    const contentIdea = await contentIdeasService.toggleContentIdea(id,userId)
    res.json({success: true, data: contentIdea});
})
export const deleteContentIdea = asyncHandler(async (req:AuthRequest, res: Response, _next: NextFunction) => {
const userId = req.user!.id
const {id} = req.params
await contentIdeasService.deleteContentIdea(id,userId)
res.json({success: true, message: 'Content idea deleted successfully'});
})

