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

router.get("/", getPrompts);
router.get("/:id", getPromptById);
router.post("/", createPrompt);
router.put("/:id", updatePrompt);
router.delete("/:id", deletePrompt);
router.put("/reorder", reorderPrompts);

export default router;