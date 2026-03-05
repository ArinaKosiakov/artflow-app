import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { getProjects, getProjectById, createProject, updateProject, deleteProject, toggleStep } from "../controllers/project.controller";

const router = Router();

router.use(authenticate);

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.put("/:id/:stepId", toggleStep);

export default router;