import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { protect } from '../middleware/auth.middleware.js';
import { getChatHistory, sendMessage, uploadFile } from '../controllers/message.controller.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'whatsapp_chat_uploads',
        resource_type: 'auto', // Allows images, video, raw documents
    },
});

const upload = multer({ storage: storage });

router.get('/:userId', protect, getChatHistory);
router.post('/send', protect, sendMessage);
router.post('/upload', protect, upload.single('file'), uploadFile);

export default router;
