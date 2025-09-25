import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.js';
import ApiError from '../utils/ApiError.js';
import logger from '../config/logger.js';
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from '../utils/emailService.js';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });
};

// Send response with token
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        success: true,
        token,
        data: user
    });
};

// Generate email verification token
const generateEmailVerificationToken = () => {
    const token = crypto.randomBytes(20).toString('hex');
    return token;
};

// Generate password reset token
const generatePasswordResetToken = () => {
    const resetToken = crypto.randomBytes(20).toString('hex');
    return crypto.createHash('sha256').update(resetToken).digest('hex');
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            password,
            role,
            department,
            employeeId,
            adminArea,
            address
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { phone },
                ...(employeeId ? [{ employeeId }] : [])
            ]
        });

        if (existingUser) {
            if (existingUser.email === email.toLowerCase()) {
                return next(new ApiError(400, 'User with this email already exists', 'USER_EXISTS', 'User already exists with this email'));
            }
            if (existingUser.phone === phone) {
                return next(new ApiError(400, 'User with this phone number already exists', 'USER_EXISTS', 'User already exists with this phone number'));
            }
            if (employeeId && existingUser.employeeId === employeeId) {
                return next(new ApiError(400, 'Employee ID already exists', 'USER_EXISTS', 'User already exists with this employee ID'));
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const userData = {
            firstName,
            lastName,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword,
            role: role || 'citizen',
            address,
            emailVerificationToken: generateEmailVerificationToken(),
            emailVerificationExpire: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        };

        // Add department and employeeId for staff/admin roles
        if (role && ['staff', 'admin', 'department_head'].includes(role)) {
            if (department) userData.department = department;
            if (employeeId) userData.employeeId = employeeId;
        }

        // Add employeeId for municipal_admin and adminArea for municipal_admin
        if (role === 'municipal_admin') {
            if (employeeId) userData.employeeId = employeeId;
            if (adminArea && Array.isArray(adminArea)) {
                // Validate admin area pin codes
                for (const pincode of adminArea) {
                    if (!/^[0-9]{6}$/.test(pincode)) {
                        return next(new ApiError(400, 'Invalid admin area pincode format', 'INVALID_ADMIN_AREA_PINCODE', 'All admin area pincodes must be 6 digits'));
                    }
                }
                userData.adminArea = adminArea.map(pin => pin.trim());
            }
        }

        const user = await User.create(userData);

        // Send verification email
        try {
            await sendVerificationEmail(user.email, user.fullName, user.emailVerificationToken);
            logger.info(`Verification email sent successfully to ${user.email}`);
        } catch (emailError) {
            logger.error('Failed to send verification email:', emailError);
            // Continue with registration even if email fails
        }

        sendTokenResponse(user, 201, res);
    } catch (error) {
        logger.error('Error in user registration:', error);
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return next(new ApiError(400, 'Please provide an email and password', 'MISSING_CREDENTIALS', 'Email and password are required'));
        }

        // Check for user
        const user = await User.findOne({ email: email.toLowerCase() })
            .select('+password')
            .populate('department', 'name');

        if (!user) {
            return next(new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS', 'User not found'));
        }

        // Check if account is locked
        if (user.lockUntil && user.lockUntil > Date.now()) {
            return next(new ApiError(423, `Account locked. Try again after ${new Date(user.lockUntil).toLocaleString()}`, 'ACCOUNT_LOCKED', 'Account is temporarily locked due to multiple failed login attempts'));
        }

        if (!user.isVerified) {
            return next(new ApiError(403, 'Email not verified. Please verify your email to login.', 'EMAIL_NOT_VERIFIED', 'Email verification is required to access this account'));
        }

        // Check if account is active
        if (!user.isActive) {
            return next(new ApiError(401, 'Account is deactivated. Please contact support', 'ACCOUNT_DEACTIVATED', 'Account is deactivated. Please contact support'));
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            // Increment login attempts
            user.loginAttempts = (user.loginAttempts || 0) + 1;

            // Lock account after 5 failed attempts
            if (user.loginAttempts >= 5) {
                user.lockUntil = Date.now() + 30 * 60 * 1000; // 30 minutes
                await user.save();
                return next(new ApiError(423, 'Account locked due to multiple failed login attempts', 'ACCOUNT_LOCKED', 'Account is temporarily locked due to multiple failed login attempts'));
            }

            await user.save();
            return next(new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS', 'User not found'));
        }

        // Reset login attempts on successful login
        user.loginAttempts = 0;
        user.lockUntil = undefined;
        user.lastLogin = new Date();
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (error) {
        logger.error('Error in user login:', error);
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('department', 'name');

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
export const updateDetails = async (req, res, next) => {
    try {
        const fieldsToUpdate = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            address: req.body.address,
            avatar: req.body.avatar,
            notificationPreferences: req.body.notificationPreferences
        };

        // Remove undefined fields
        Object.keys(fieldsToUpdate).forEach(key => {
            if (fieldsToUpdate[key] === undefined) {
                delete fieldsToUpdate[key];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.user.id,
            fieldsToUpdate,
            {
                new: true,
                runValidators: true
            }
        ).populate('department', 'name');

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return next(new ApiError('Please provide current and new password', 400));
        }

        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return next(new ApiError('Current password is incorrect', 401));
        }

        // Hash new password
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return next(new ApiError('Please provide an email', 400));
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return next(new ApiError('There is no user with that email', 404));
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and set to resetPasswordToken field
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save({ validateBeforeSave: false });

        // Create reset url
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

        // Send password reset email
        try {
            await sendPasswordResetEmail(user.email, user.fullName, resetUrl);
            logger.info(`Password reset email sent successfully to ${user.email}`);

            res.status(200).json({
                success: true,
                message: 'Password reset token sent to email'
            });
        } catch (emailError) {
            // If email fails, remove the reset token from user
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            logger.error('Failed to send password reset email:', emailError);
            return next(new ApiError('Email could not be sent. Please try again later.', 500));
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = async (req, res, next) => {
    try {
        const { password } = req.body;

        if (!password) {
            return next(new ApiError('Please provide a password', 400));
        }

        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return next(new ApiError('Invalid or expired token', 400));
        }

        // Set new password
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (error) {
        logger.error('Error in resetting password:', error);
        next(error);
    }
};

// @desc    Verify email
// @route   GET /api/auth/verify/:token
// @access  Public
export const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpire: { $gt: Date.now() }
        });

        if (!user) {
            return next(new ApiError('Invalid or expired verification token', 400));
        }

        user.isVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;

        await user.save();

        // Send welcome email after successful verification
        try {
            await sendWelcomeEmail(user.email, user.fullName);
            logger.info(`Welcome email sent successfully to ${user.email}`);
        } catch (emailError) {
            logger.error('Failed to send welcome email:', emailError);
            // Continue even if welcome email fails
        }

        res.status(200).json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Resend email verification
// @route   POST /api/auth/resend-verification
// @access  Private
export const resendVerification = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (user.isVerified) {
            return next(new ApiError('Email is already verified', 400));
        }

        // Generate new verification token
        user.emailVerificationToken = generateEmailVerificationToken();
        user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        await user.save();

        // Send verification email
        try {
            await sendVerificationEmail(user.email, user.fullName, user.emailVerificationToken);
            logger.info(`Verification email resent successfully to ${user.email}`);

            res.status(200).json({
                success: true,
                message: 'Verification email sent'
            });
        } catch (emailError) {
            logger.error('Failed to resend verification email:', emailError);
            return next(new ApiError('Failed to send verification email. Please try again later.', 500));
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user account
// @route   DELETE /api/auth/deleteaccount
// @access  Private
export const deleteAccount = async (req, res, next) => {
    try {
        const { password } = req.body;

        if (!password) {
            return next(new ApiError('Please provide your password to confirm deletion', 400));
        }

        const user = await User.findById(req.user.id).select('+password');

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return next(new ApiError('Incorrect password', 401));
        }

        // Instead of deleting, deactivate the account
        user.isActive = false;
        user.email = `deleted_${Date.now()}_${user.email}`;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Account deactivated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const startIndex = (page - 1) * limit;

        // Build filter object
        const filter = {};
        if (req.query.role) filter.role = req.query.role;
        if (req.query.isVerified !== undefined) filter.isVerified = req.query.isVerified === 'true';
        if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';
        if (req.query.department) filter.department = req.query.department;

        const total = await User.countDocuments(filter);
        const users = await User.find(filter)
            .populate('department', 'name')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(startIndex);

        // Pagination result
        const pagination = {};

        if (startIndex + limit < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            pagination,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single user (Admin only)
// @route   GET /api/auth/users/:id
// @access  Private/Admin
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).populate('department', 'name');

        if (!user) {
            return next(new ApiError('User not found', 404));
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user (Admin only)
// @route   PUT /api/auth/users/:id
// @access  Private/Admin
export const updateUser = async (req, res, next) => {
    try {
        const fieldsToUpdate = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            role: req.body.role,
            department: req.body.department,
            employeeId: req.body.employeeId,
            adminArea: req.body.adminArea,
            isVerified: req.body.isVerified,
            isActive: req.body.isActive,
            address: req.body.address
        };

        // Validate adminArea if provided
        if (req.body.adminArea && Array.isArray(req.body.adminArea)) {
            for (const pincode of req.body.adminArea) {
                if (!/^[0-9]{6}$/.test(pincode)) {
                    return next(new ApiError(400, 'Invalid admin area pincode format', 'INVALID_ADMIN_AREA_PINCODE', 'All admin area pincodes must be 6 digits'));
                }
            }
            fieldsToUpdate.adminArea = req.body.adminArea.map(pin => pin.trim());
        }

        // Remove undefined fields
        Object.keys(fieldsToUpdate).forEach(key => {
            if (fieldsToUpdate[key] === undefined) {
                delete fieldsToUpdate[key];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.params.id,
            fieldsToUpdate,
            {
                new: true,
                runValidators: true
            }
        ).populate('department', 'name');

        if (!user) {
            return next(new ApiError('User not found', 404));
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};
