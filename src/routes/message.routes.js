import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.middleware.js';
import { getChatHistory, sendMessage, uploadFile } from '../controllers/message.controller.js';
import path from 'path';

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/:userId', protect, getChatHistory);
router.post('/send', protect, sendMessage);
router.post('/upload', protect, upload.single('file'), uploadFile);

export default router;
