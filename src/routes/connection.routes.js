import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { getRequests, getConnections } from '../controllers/user.controller.js';
import { sendConnectionRequest, reviewConnectionRequest } from '../controllers/request.controller.js';

const router = express.Router();

router.get('/list', protect, getConnections);
router.get('/requests', protect, getRequests);
router.post('/send-request', protect, sendConnectionRequest);
router.post('/review/:status/:requestId', protect, reviewConnectionRequest);

export default router;
