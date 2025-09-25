import express from 'express';
import { protect } from '../../middleware/auth.js';
import {
    addPincodes,
    removePincodes,
    getPincodes,
    updatePincodes
} from '../../controllers/municipal_admin/pincode.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes for managing municipal admin pincodes
router.post('/pincodes', addPincodes);
router.delete('/pincodes', removePincodes);
router.get('/:adminId/pincodes', getPincodes);
router.put('/:adminId/pincodes', updatePincodes);

export default router;