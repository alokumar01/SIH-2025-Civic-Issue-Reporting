

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/user.js';
import Department from '../models/department.js';
import ApiError from '../utils/ApiError.js';
import logger from '../config/logger.js';
import { sendVerificationEmail, sendWelcomeEmail } from '../utils/emailService.js';

// Generate email verification token
const generateEmailVerificationToken = () => {
    const token = crypto.randomBytes(20).toString('hex');
    return token;
};

// @desc    Create a new employee (staff/department_head/admin)
// @route   POST /api/employees
// @access  Private/Admin/Municipal_Admin
const createEmployee = async (req, res, next) => {
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
            address,
            notificationPreferences,
            serviceArea
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !password || !role || !employeeId) {
            return next(new ApiError(400, 'Please provide all required fields', 'MISSING_FIELDS', 'First name, last name, email, phone, password, role, and employee ID are required'));
        }

        // Validate serviceArea if provided for staff role
        if (role === 'staff' && serviceArea) {
            if (!Array.isArray(serviceArea)) {
                return next(new ApiError(400, 'Invalid service area format', 'INVALID_SERVICE_AREA', 'Service area must be an array of pincodes'));
            }
            
            // Validate each pincode format
            const validPincodeFormat = /^[0-9]{6}$/;
            const invalidPincodes = serviceArea.filter(pincode => !validPincodeFormat.test(pincode));
            if (invalidPincodes.length > 0) {
                return next(new ApiError(400, 'Invalid pincode format in service area', 'INVALID_PINCODES', `Invalid pincodes: ${invalidPincodes.join(', ')}`));
            }
        }

        // Validate employee role
        const validEmployeeRoles = ['staff', 'department_head', 'admin', 'municipal_admin'];
        if (!validEmployeeRoles.includes(role)) {
            return next(new ApiError(400, 'Invalid employee role', 'INVALID_ROLE', `Role must be one of: ${validEmployeeRoles.join(', ')}`));
        }

        // Validate department requirement for staff and department_head
        if (['staff', 'department_head'].includes(role) && !department) {
            return next(new ApiError(400, 'Department is required for staff and department head roles', 'MISSING_DEPARTMENT', 'Please specify a department for this role'));
        }

        // Validate address fields
        if (!address || !address.city || !address.state || !address.pincode) {
            return next(new ApiError(400, 'Complete address is required', 'MISSING_ADDRESS', 'City, state, and pincode are required in address'));
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { phone },
                { employeeId }
            ]
        });

        if (existingUser) {
            if (existingUser.email === email.toLowerCase()) {
                return next(new ApiError(400, 'Employee with this email already exists', 'EMAIL_EXISTS', 'An employee is already registered with this email'));
            }
            if (existingUser.phone === phone) {
                return next(new ApiError(400, 'Employee with this phone number already exists', 'PHONE_EXISTS', 'An employee is already registered with this phone number'));
            }
            if (existingUser.employeeId === employeeId) {
                return next(new ApiError(400, 'Employee ID already exists', 'EMPLOYEE_ID_EXISTS', 'This employee ID is already assigned to another employee'));
            }
        }

        // Validate department exists (if provided)
        let departmentDoc = null;
        if (department) {
            departmentDoc = await Department.findById(department);
            if (!departmentDoc) {
                return next(new ApiError(404, 'Department not found', 'DEPARTMENT_NOT_FOUND', 'The specified department does not exist'));
            }

            // Check if trying to assign department_head role and department already has a head
            if (role === 'department_head') {
                if (departmentDoc.head && departmentDoc.head.toString() !== '') {
                    return next(new ApiError(400, 'Department already has a head', 'DEPARTMENT_HEAD_EXISTS', 'This department already has a department head assigned'));
                }
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create employee data
        const employeeData = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            phone: phone.trim(),
            password: hashedPassword,
            role,
            employeeId: employeeId.trim(),
            address: {
                street: address.street?.trim(),
                city: address.city.trim(),
                state: address.state.trim(),
                pincode: address.pincode.trim(),
                coordinates: address.coordinates || null
            },
            notificationPreferences: {
                email: notificationPreferences?.email !== undefined ? notificationPreferences.email : true,
                sms: notificationPreferences?.sms !== undefined ? notificationPreferences.sms : false,
                push: notificationPreferences?.push !== undefined ? notificationPreferences.push : true,
                reportUpdates: notificationPreferences?.reportUpdates !== undefined ? notificationPreferences.reportUpdates : true,
                departmentAnnouncements: notificationPreferences?.departmentAnnouncements !== undefined ? notificationPreferences.departmentAnnouncements : true
            },
            emailVerificationToken: generateEmailVerificationToken(),
            emailVerificationExpire: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
            isVerified: false,
            isActive: true,
            serviceArea: role === 'staff' ? (serviceArea || []) : []
        };

        // Add department if provided
        if (department) {
            employeeData.department = department;
        }

        // Create the employee
        const employee = await User.create(employeeData);

        // If this is a department head, update the department
        if (role === 'department_head' && departmentDoc) {
            departmentDoc.head = employee._id;
            await departmentDoc.save();

            // Also add to department staff
            departmentDoc.staff.push({
                user: employee._id,
                role: 'department_head',
                isActive: true,
                joinedAt: new Date()
            });
            await departmentDoc.save();
        } else if (['staff'].includes(role) && departmentDoc) {
            // Add staff member to department
            departmentDoc.staff.push({
                user: employee._id,
                role: 'staff',
                isActive: true,
                joinedAt: new Date()
            });
            await departmentDoc.save();
        }

        // Send verification email
        try {
            await sendVerificationEmail(employee.email, employee.fullName, employee.emailVerificationToken);
            logger.info(`Verification email sent successfully to ${employee.email}`);
        } catch (emailError) {
            logger.error('Failed to send verification email:', emailError);
            // Continue with employee creation even if email fails
        }

        // Remove password from response
        const employeeResponse = await User.findById(employee._id)
            .populate('department', 'name code')
            .select('-password');

        logger.info(`Employee created successfully: ${employee.fullName} (${employee.employeeId}) with role ${role} by user ${req.user?.id}`);

        res.status(201).json({
            success: true,
            message: 'Employee created successfully. Verification email sent.',
            data: employeeResponse
        });

    } catch (error) {
        logger.error('Error creating employee:', error);

        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return next(new ApiError(400, 'Validation Error', 'VALIDATION_ERROR', messages));
        }

        // Handle mongoose duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            return next(new ApiError(400, `Employee with ${field} '${value}' already exists`, 'DUPLICATE_ENTRY', `${field} must be unique`));
        }

        next(error);
    }
};

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/Admin/Municipal_Admin
const getAllEmployees = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const startIndex = (page - 1) * limit;

        // Build base filter for employees only
        const filter = {
            role: { $in: ['staff', 'department_head', 'admin', 'municipal_admin'] }
        };

        // Role-based access control
        if (req.user.role === 'admin') {
            // admin: no additional filter
        } else if (req.user.role === 'department_head') {
            // Only employees in their department
            if (!req.user.department) {
                return next(new ApiError(403, 'No department assigned', 'NO_DEPARTMENT', 'Department head does not have a department assigned'));
            }
            filter.department = req.user.department;
        } else if (req.user.role === 'municipal_admin') {
            // Only employees whose address.pincode is in adminArea
            if (!req.user.adminArea || !Array.isArray(req.user.adminArea) || req.user.adminArea.length === 0) {
                return next(new ApiError(403, 'No admin area assigned', 'NO_ADMIN_AREA', 'Municipal admin does not have an admin area assigned'));
            }
            filter['address.pincode'] = { $in: req.user.adminArea };
        } else {
            return next(new ApiError(403, 'Access denied', 'ACCESS_DENIED', 'You do not have permission to view employees'));
        }

        // Additional filters
        if (req.query.role) filter.role = req.query.role;
        if (req.query.department) filter.department = req.query.department;
        if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';
        if (req.query.isVerified !== undefined) filter.isVerified = req.query.isVerified === 'true';

        // Search functionality
        if (req.query.search) {
            filter.$or = [
                { firstName: { $regex: req.query.search, $options: 'i' } },
                { lastName: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } },
                { employeeId: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const total = await User.countDocuments(filter);
        const employees = await User.find(filter)
            .populate('department', 'name code')
            .select('-password')
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
            count: employees.length,
            total,
            pagination,
            data: employees
        });

    } catch (error) {
        logger.error('Error fetching employees:', error);
        next(error);
    }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
// @access  Private/Admin/Municipal_Admin
const getEmployeeById = async (req, res, next) => {
    try {
        const employee = await User.findById(req.params.id)
            .populate('department', 'name code description')
            .select('-password');

        if (!employee) {
            return next(new ApiError(404, 'Employee not found', 'EMPLOYEE_NOT_FOUND', 'Employee with this ID does not exist'));
        }

        // Check if the user is actually an employee
        const employeeRoles = ['staff', 'department_head', 'admin', 'municipal_admin'];
        if (!employeeRoles.includes(employee.role)) {
            return next(new ApiError(400, 'User is not an employee', 'NOT_EMPLOYEE', 'The specified user is not an employee'));
        }

        res.status(200).json({
            success: true,
            data: employee
        });

    } catch (error) {
        logger.error('Error fetching employee:', error);
        if (error.kind === 'ObjectId') {
            return next(new ApiError(404, 'Employee not found', 'INVALID_ID', 'Invalid employee ID format'));
        }
        next(error);
    }
};


// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin/Department Head/Employee (self)
const updateEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateFields = { ...req.body };

        // Only allow certain fields to be updated
        const allowedFields = [
            'firstName', 'lastName', 'email', 'phone', 'address', 'notificationPreferences', 'isActive', 'isVerified', 'serviceArea'
        ];
        Object.keys(updateFields).forEach(key => {
            if (!allowedFields.includes(key)) delete updateFields[key];
        });

        const employee = await User.findById(id);
        if (!employee) {
            return next(new ApiError(404, 'Employee not found', 'EMPLOYEE_NOT_FOUND', 'Employee with this ID does not exist'));
        }

        // Role-based access control
        if (req.user.role === 'admin' || req.user.role === 'municipal_admin') {
            // Admins can update anyone, municipal_admin can only update in their area
            if (req.user.role === 'municipal_admin') {
                if (!employee.address || !req.user.adminArea?.includes(employee.address.pincode)) {
                    return next(new ApiError(403, 'Access denied', 'ACCESS_DENIED', 'You do not have permission to update this employee'));
                }
            }
        } else if (req.user.role === 'department_head') {
            // Department head can only update employees in their department
            if (!employee.department || employee.department.toString() !== req.user.department?.toString()) {
                return next(new ApiError(403, 'Access denied', 'ACCESS_DENIED', 'You can only update employees in your department'));
            }
        } else if (req.user.role === 'staff') {
            // Staff can only update their own profile
            if (req.user._id.toString() !== id) {
                return next(new ApiError(403, 'Access denied', 'ACCESS_DENIED', 'You can only update your own profile'));
            }
        } else {
            return next(new ApiError(403, 'Access denied', 'ACCESS_DENIED', 'You do not have permission to update employees'));
        }

        // Update employee
        Object.assign(employee, updateFields);
        await employee.save();

        const updatedEmployee = await User.findById(id)
            .populate('department', 'name code')
            .select('-password');

        res.status(200).json({
            success: true,
            message: 'Employee updated successfully',
            data: updatedEmployee
        });
    } catch (error) {
        logger.error('Error updating employee:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return next(new ApiError(400, 'Validation Error', 'VALIDATION_ERROR', messages));
        }
        next(error);
    }
};

// @desc    Deactivate (soft delete) employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin/Department Head
const deactivateEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const employee = await User.findById(id);
        if (!employee) {
            return next(new ApiError(404, 'Employee not found', 'EMPLOYEE_NOT_FOUND', 'Employee with this ID does not exist'));
        }

        // Role-based access control
        if (req.user.role === 'admin' || req.user.role === 'municipal_admin') {
            if (req.user.role === 'municipal_admin') {
                if (!employee.address || !req.user.adminArea?.includes(employee.address.pincode)) {
                    return next(new ApiError(403, 'Access denied', 'ACCESS_DENIED', 'You do not have permission to deactivate this employee'));
                }
            }
        } else if (req.user.role === 'department_head') {
            if (!employee.department || employee.department.toString() !== req.user.department?.toString()) {
                return next(new ApiError(403, 'Access denied', 'ACCESS_DENIED', 'You can only deactivate employees in your department'));
            }
        } else {
            return next(new ApiError(403, 'Access denied', 'ACCESS_DENIED', 'You do not have permission to deactivate employees'));
        }

        employee.isActive = false;
        await employee.save();

        res.status(200).json({
            success: true,
            message: 'Employee deactivated successfully',
            data: { _id: employee._id, isActive: employee.isActive }
        });
    } catch (error) {
        logger.error('Error deactivating employee:', error);
        next(error);
    }
};

export {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deactivateEmployee
};



