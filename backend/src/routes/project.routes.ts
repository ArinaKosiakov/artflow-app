import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { getProjects, getProjectById, createProject, updateProject, deleteProject, toggleStep } from "../controllers/project.controller";

const router = Router();

router.use(authenticate);

router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);
router.put('/projects/:id/:stepId', toggleStep);

export default router;