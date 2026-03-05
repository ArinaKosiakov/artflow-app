import { Router } from 'express';
import {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  deleteUserProfile,
} from "../controllers/userProfile.controller";
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getUserProfile);
router.put('/', updateUserProfile);
router.put("/password", updateUserPassword);
router.delete('/', deleteUserProfile);

export default router;