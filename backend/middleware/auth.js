import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import ApiError from '../utils/ApiError.js';
import logger from '../config/logger.js';

// Protect routes - authenticate user
export const protect = async (req, res, next) => {
    try {
        let token;

        // Get token from Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            return next(new ApiError(401, 'Not authorized to access this route', 'NO_TOKEN', 'Authentication token is required'));
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded)

            // Get user from token
            const user = await User.findById(decoded.id).populate('department', 'name');

            if (!user) {
                return next(new ApiError(401, 'User not found', 'USER_NOT_FOUND', 'User associated with this token no longer exists'));
            }

            // Check if user is active
            if (!user.isActive) {
                return next(new ApiError(401, 'Account is deactivated', 'ACCOUNT_DEACTIVATED', 'This account has been deactivated'));
            }

            // Add user to request object
            req.user = user;
            next();
        } catch (error) {
            return next(new ApiError(401, 'Not authorized to access this route', 'INVALID_TOKEN', 'Authentication token is invalid or expired'));
        }
    } catch (error) {
        logger.error('Error in protect middleware:', error);
        next(error);
    }
};

// Role authorization middleware
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError(401, 'Not authorized to access this route', 'NO_USER', 'User must be authenticated'));
        }

        if (!roles.includes(req.user.role)) {
            return next(new ApiError(403, `User role ${req.user.role} is not authorized to access this route`, 'INSUFFICIENT_PERMISSIONS', 'You do not have permission to access this resource'));
        }

        next();
    };
};

// Check if user is verified
export const requireVerification = (req, res, next) => {
    if (!req.user) {
        return next(new ApiError(401, 'Not authorized to access this route', 'NO_USER', 'User must be authenticated'));
    }

    if (!req.user.isVerified) {
        return next(new ApiError(403, 'Email verification required', 'EMAIL_NOT_VERIFIED', 'Please verify your email address to access this resource'));
    }

    next();
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
    try {
        let token;

        // Get token from Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // If no token, continue without user
        if (!token) {
            return next();
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            const user = await User.findById(decoded.id).populate('department', 'name');

            if (user && user.isActive) {
                req.user = user;
            }
        } catch (error) {
            // Continue without user if token is invalid
            logger.warn('Invalid token in optional auth:', error.message);
        }

        next();
    } catch (error) {
        logger.error('Error in optional auth middleware:', error);
        next();
    }
};

// Rate limiting for auth routes
export const authRateLimit = (windowMs = 15 * 60 * 1000, max = 5) => {
    const attempts = new Map();

    return (req, res, next) => {
        const key = req.ip + ':' + (req.body.email || req.body.phone || 'unknown');
        const now = Date.now();

        // Clean old entries
        for (const [k, v] of attempts.entries()) {
            if (now - v.resetTime > windowMs) {
                attempts.delete(k);
            }
        }

        const attempt = attempts.get(key) || { count: 0, resetTime: now };

        if (attempt.count >= max) {
            return next(new ApiError(429, 'Too many attempts. Please try again later.', 'RATE_LIMIT_EXCEEDED', `Too many login attempts. Please try again after ${Math.ceil(windowMs / 60000)} minutes.`));
        }

        attempt.count++;
        attempt.resetTime = now;
        attempts.set(key, attempt);

        next();
    };
};

// Admin only access
export const adminOnly = authorize('admin');

// Staff and above access  
export const staffAndAbove = authorize('staff', 'department_head', 'admin', 'municipal_admin');

// Department head and admin access
export const departmentHeadAndAdmin = authorize('department_head', 'admin', 'municipal_admin');

export default {
    protect,
    authorize,
    requireVerification,
    optionalAuth,
    authRateLimit,
    adminOnly,
    staffAndAbove,
    departmentHeadAndAdmin
};