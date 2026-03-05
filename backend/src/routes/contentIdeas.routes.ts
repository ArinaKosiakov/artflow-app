import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { getContentIdeaById, getContentIdeas, createContentIdea, updateContentIdea, toggleContentIdea, deleteContentIdea } from "../controllers/contentIdeas.controller";

const router = Router();

router.use(authenticate);

router.get("/", getContentIdeas);
router.get("/:id", getContentIdeaById);
router.post("/", createContentIdea);
router.put("/:id", updateContentIdea);
router.put("/:id/toggle", toggleContentIdea);
router.delete("/:id", deleteContentIdea);

export default router;