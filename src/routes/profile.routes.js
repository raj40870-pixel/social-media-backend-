import express from 'express';
import { getProfile, editProfile } from '../controllers/profile.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/view', protect, getProfile);
router.put('/edit', protect, editProfile);

export default router;
