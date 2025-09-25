import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.js';
import { fileComplaint } from '../controllers/complaint/create.js';
import { 
  assignStaffToComplaint,
  getJurisdictionComplaints,
  getAssignmentStats
} from '../controllers/complaint/municipal_admin.js';

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

// Municipal Admin Routes
router.post('/:complaintId/assign', protect, assignStaffToComplaint);
router.get('/jurisdiction', protect, getJurisdictionComplaints);
router.get('/stats', protect, getAssignmentStats);

export default router;
