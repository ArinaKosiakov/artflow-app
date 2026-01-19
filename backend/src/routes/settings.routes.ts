import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getSettings, updateSettings, deleteSettings } from '../controllers/userSettings.controller';

const router = Router();

router.use(authenticate);

router.get('/', getSettings);
router.put('/', updateSettings);
router.delete('/', deleteSettings);

export default router;