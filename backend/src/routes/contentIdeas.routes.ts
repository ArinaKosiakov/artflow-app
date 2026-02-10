import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { getContentIdeaById, getContentIdeas, createContentIdea, updateContentIdea, toggleContentIdea, deleteContentIdea } from "../controllers/contentIdeas.controller";

const router = Router();

router.use(authenticate);

router.get("/ideas", getContentIdeas);
router.get("/ideas/:id", getContentIdeaById);
router.post("/ideas", createContentIdea);
router.put("/ideas/:id", updateContentIdea);
router.put("/ideas/:id/toggle", toggleContentIdea);
router.delete("/ideas/:id", deleteContentIdea);

export default router;