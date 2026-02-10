import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middleware/errorHandler';
import {ProjectsService} from '../services/project.service';
const projectsService = new ProjectsService()

export const getProjects = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
        const userId = req.user!.id;
        const projects = await projectsService.getProjects(userId);
        res.json({success: true, data: projects});
    }
)
export const getProjectById = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
        const userId = req.user!.id;
        const {id} = req.params
        const project = await projectsService.getProjectById(id,userId);
        res.json({success: true, data: project});
    }
)
export const createProject = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
        const userId = req.user!.id;
        const data = req.body
        const projects = await projectsService.createProject(userId,data);
        res.json({success: true, data: projects});
    }
)
export const updateProject = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
        const userId = req.user!.id
        const {id} = req.params
        const data = req.body
        const project = await projectsService.updateProject(id,userId,data);
        res.json({success: true, data: project});
    }
)
export const deleteProject = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
        const userId = req.user!.id
        const {id} =req.params
        await projectsService.deleteProject(id,userId);
        res.json({success: true, message: 'Project deleted successfully'});
    }
)
export const toggleStep = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
        const userId = req.user!.id
        const {id, stepId} = req.params
        const step = await projectsService.toggleStep(id,stepId,userId);
        res.json({success: true, data: step});
    }
)