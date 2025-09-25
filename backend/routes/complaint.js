import express from 'express';
import { fileComplaint } from '../controllers/complaint.js';
import multer from 'multer';
import { protect } from '../middleware/auth.js';

// Use multer for file uploads (memory storage for direct upload to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// Route: File a new complaint
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'voiceRecordings', maxCount: 3 },
    { name: 'videos', maxCount: 2 },
  ]),
  fileComplaint
);

export default router;
