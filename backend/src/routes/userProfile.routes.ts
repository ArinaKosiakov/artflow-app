import { Router } from 'express';
import { getUserProfile, updateUserProfile, deleteUserProfile } from '../controllers/userProfile.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getUserProfile);
router.put('/', updateUserProfile);
router.delete('/', deleteUserProfile);

export default router;