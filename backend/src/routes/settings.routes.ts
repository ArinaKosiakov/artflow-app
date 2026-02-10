import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getSettings, updateSettings, deleteSettings } from '../controllers/userSettings.controller';

const router = Router();

router.use(authenticate);

router.get("/settings", getSettings);
router.put("/settings", updateSettings);
router.delete("/settings", deleteSettings);

export default router;