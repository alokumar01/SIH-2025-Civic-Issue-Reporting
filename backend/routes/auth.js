import express from 'express';
import {
    register,
    login,
    getMe,
    updateDetails,
    updatePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    logout,
    deleteAccount,
    getUsers,
    getUser,
    updateUser
} from '../controllers/auth.js';
import {
    protect,
    authorize,
    requireVerification,
    authRateLimit,
    adminOnly,
    staffAndAbove
} from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', authRateLimit(), register);
router.post('/login', authRateLimit(), login);
router.post('/forgotpassword', authRateLimit(15 * 60 * 1000, 3), forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/verify/:token', verifyEmail);

// Protected routes (require authentication)
router.use(protect); // All routes after this middleware require authentication

router.get('/me', getMe);
router.put('/updatedetails', updateDetails);
router.put('/updatepassword', updatePassword);
router.post('/resend-verification', resendVerification);
router.post('/logout', logout);
router.delete('/deleteaccount', deleteAccount);

// Admin routes (require admin role)
router.get('/users', adminOnly, getUsers);
router.get('/users/:id', staffAndAbove, getUser);
router.put('/users/:id', adminOnly, updateUser);

export default router;