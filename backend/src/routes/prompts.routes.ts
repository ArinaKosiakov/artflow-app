import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  getPrompts,
  getPromptById,
  createPrompt,
  updatePrompt,
  deletePrompt,
  reorderPrompts,
} from "../controllers/prompts.controller";

const router = Router();

router.use(authenticate);

router.get("/prompts", getPrompts);
router.get("/prompts/:id", getPromptById);
router.post("/prompts", createPrompt);
router.put("/prompts/:id", updatePrompt);
router.delete("/prompts/:id", deletePrompt);
router.put("/prompts", reorderPrompts);

export default router;