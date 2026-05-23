import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { sendConnectionRequest, reviewConnectionRequest, clearFakeRequests } from '../controllers/request.controller.js';

const router = express.Router();

router.delete('/clear', clearFakeRequests);
router.post('/send/:status/:toUserId', protect, sendConnectionRequest);
router.post('/review/:status/:requestId', protect, reviewConnectionRequest);

export default router;
