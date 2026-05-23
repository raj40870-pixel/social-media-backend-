import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { getRequests, getConnections, getFeed, checkUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/check', protect, checkUser);
router.get('/requests/received', protect, getRequests);
router.get('/connections', protect, getConnections);
router.get('/feed', protect, getFeed);

export default router;
