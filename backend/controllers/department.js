

import Department from '../models/department.js';
import User from '../models/user.js';
import ApiError from '../utils/ApiError.js';
import logger from '../config/logger.js';

// @desc    Create a new department
// @route   POST /api/departments
// @access  Private/Admin


const createADepartment = async (req, res, next) => {
    try {
        const {
            name,
            description,
            code,
            categories,
            serviceArea,
            head,
            offices
        } = req.body;

        // Validate required fields
        if (!name || !code || !categories || !Array.isArray(categories) || categories.length === 0) {
            return next(new ApiError(400, 'Please provide name, code, and at least one category', 'MISSING_FIELDS', 'Name, code, and categories are required fields'));
        }

        // Check if department with same name or code already exists
        const existingDepartment = await Department.findOne({
            $or: [
                { name: name.trim() },
                { code: code.toUpperCase().trim() }
            ]
        });

        if (existingDepartment) {
            if (existingDepartment.name === name.trim()) {
                return next(new ApiError(400, 'Department with this name already exists', 'DEPARTMENT_EXISTS', 'Department name must be unique'));
            }
            if (existingDepartment.code === code.toUpperCase().trim()) {
                return next(new ApiError(400, 'Department with this code already exists', 'DEPARTMENT_CODE_EXISTS', 'Department code must be unique'));
            }
        }

        // If head is provided, validate that the user exists and has appropriate role
        let headUser = null;
        if (head) {
            headUser = await User.findById(head);
            if (!headUser) {
                return next(new ApiError(404, 'Department head user not found', 'USER_NOT_FOUND', 'The specified department head does not exist'));
            }

            // Check if user has appropriate role (department_head or admin)
            if (!['department_head', 'admin'].includes(headUser.role)) {
                return next(new ApiError(400, 'User must have department_head or admin role to be assigned as department head', 'INVALID_ROLE', 'Only users with department_head or admin role can be assigned as department head'));
            }

            // Check if user is already head of another department
            const existingDepartmentWithHead = await Department.findOne({ head: head });
            if (existingDepartmentWithHead) {
                return next(new ApiError(400, 'User is already head of another department', 'USER_ALREADY_HEAD', 'A user can only be head of one department'));
            }
        }

        // Validate office addresses if provided
        if (offices && Array.isArray(offices)) {
            for (const office of offices) {
                if (office.address && office.address.pincode) {
                    if (!/^[0-9]{6}$/.test(office.address.pincode)) {
                        return next(new ApiError(400, 'Invalid pincode format', 'INVALID_PINCODE', 'Pincode must be 6 digits'));
                    }
                }
            }
        }

        // Validate service area pin codes if provided
        if (serviceArea && Array.isArray(serviceArea)) {
            for (const pincode of serviceArea) {
                if (!/^[0-9]{6}$/.test(pincode)) {
                    return next(new ApiError(400, 'Invalid service area pincode format', 'INVALID_SERVICE_AREA_PINCODE', 'All service area pincodes must be 6 digits'));
                }
            }
        }

        // Create department data
        const departmentData = {
            name: name.trim(),
            code: code.trim(),
            categories: categories.map(cat => cat.trim()),
            description: description?.trim(),
            serviceArea: serviceArea && Array.isArray(serviceArea) ? serviceArea.map(pin => pin.trim()) : [],
            head: head || null,
            offices: offices || []
        };

        // Create the department
        const department = await Department.create(departmentData);

        // If head is assigned, update the user's department field
        if (headUser) {
            headUser.department = department._id;
            await headUser.save();
        }

        // Populate the head information before sending response
        await department.populate('head', 'firstName lastName email employeeId');

        logger.info(`Department created successfully: ${department.name} (${department.code}) by user ${req.user?.id}`);

        res.status(201).json({
            success: true,
            message: 'Department created successfully',
            data: department
        });

    } catch (error) {
        logger.error('Error creating department:', error);

        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return next(new ApiError(400, 'Validation Error', 'VALIDATION_ERROR', messages));
        }

        // Handle mongoose duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            return next(new ApiError(400, `Department with ${field} '${value}' already exists`, 'DUPLICATE_ENTRY', `${field} must be unique`));
        }

        next(error);
    }
};

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
const getAllDepartments = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const startIndex = (page - 1) * limit;

        // Build filter object
        const filter = {};

        // Area-based access control for municipal_admin
        if (req.user && req.user.role === 'municipal_admin') {
            // Municipal admin can only see departments in their admin area
            if (req.user.adminArea && req.user.adminArea.length > 0) {
                filter.serviceArea = { $in: req.user.adminArea };
            } else {
                // If municipal admin has no admin area defined, return empty result
                return res.status(200).json({
                    success: true,
                    count: 0,
                    total: 0,
                    data: []
                });
            }
        }
        // Admin role can see all departments (no additional filter)

        if (req.query.category) {
            filter.categories = { $in: [req.query.category] };
        }
        if (req.query.pincode) {
            if (filter.serviceArea) {
                // If already filtered by admin area, intersect with query pincode
                filter.serviceArea = { $in: [req.query.pincode, ...req.user.adminArea] };
            } else {
                filter.serviceArea = { $in: [req.query.pincode] };
            }
        }
        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { code: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const total = await Department.countDocuments(filter);
        const departments = await Department.find(filter)
            .populate('head', 'firstName lastName email employeeId')
            .populate('staff.user', 'firstName lastName email employeeId')
            .sort({ name: 1 })
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
            count: departments.length,
            total,
            pagination,
            data: departments
        });

    } catch (error) {
        logger.error('Error fetching departments:', error);
        next(error);
    }
};

// @desc    Get single department by ID
// @route   GET /api/departments/:id
// @access  Public
const getDepartmentById = async (req, res, next) => {
    try {
        const department = await Department.findById(req.params.id)
            .populate('head', 'firstName lastName email employeeId phone')
            .populate('staff.user', 'firstName lastName email employeeId phone role');

        if (!department) {
            return next(new ApiError(404, 'Department not found', 'DEPARTMENT_NOT_FOUND', 'Department with this ID does not exist'));
        }

        // Area-based access control for municipal_admin
        if (req.user && req.user.role === 'municipal_admin') {
            // Check if municipal admin has access to this department
            if (req.user.adminArea && req.user.adminArea.length > 0) {
                const hasAccess = department.serviceArea.some(pincode => req.user.adminArea.includes(pincode));
                if (!hasAccess) {
                    return next(new ApiError(403, 'Access denied', 'ACCESS_DENIED', 'You do not have permission to access this department'));
                }
            } else {
                return next(new ApiError(403, 'Access denied', 'ACCESS_DENIED', 'No admin area defined for your account'));
            }
        }
        // Admin role can access any department (no additional check)

        res.status(200).json({
            success: true,
            data: department
        });

    } catch (error) {
        logger.error('Error fetching department:', error);
        if (error.kind === 'ObjectId') {
            return next(new ApiError(404, 'Department not found', 'INVALID_ID', 'Invalid department ID format'));
        }
        next(error);
    }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private/Admin
const updateDepartment = async (req, res, next) => {
    try {
        const {
            name,
            description,
            code,
            categories,
            serviceArea,
            head,
            offices
        } = req.body;

        const department = await Department.findById(req.params.id);

        if (!department) {
            return next(new ApiError(404, 'Department not found', 'DEPARTMENT_NOT_FOUND', 'Department with this ID does not exist'));
        }

        // Check for duplicate name or code (excluding current department)
        if (name || code) {
            const duplicateFilter = {
                _id: { $ne: req.params.id }
            };

            if (name) duplicateFilter.name = name.trim();
            if (code) duplicateFilter.code = code.toUpperCase().trim();

            const existingDepartment = await Department.findOne({
                $or: [
                    name ? { name: name.trim(), _id: { $ne: req.params.id } } : {},
                    code ? { code: code.trim(), _id: { $ne: req.params.id } } : {}
                ].filter(obj => Object.keys(obj).length > 0)
            });

            if (existingDepartment) {
                if (name && existingDepartment.name === name.trim()) {
                    return next(new ApiError(400, 'Department with this name already exists', 'DEPARTMENT_EXISTS', 'Department name must be unique'));
                }
                if (code && existingDepartment.code === code.trim()) {
                    return next(new ApiError(400, 'Department with this code already exists', 'DEPARTMENT_CODE_EXISTS', 'Department code must be unique'));
                }
            }
        }

        // Validate service area pin codes if provided
        if (serviceArea && Array.isArray(serviceArea)) {
            for (const pincode of serviceArea) {
                if (!/^[0-9]{6}$/.test(pincode)) {
                    return next(new ApiError(400, 'Invalid service area pincode format', 'INVALID_SERVICE_AREA_PINCODE', 'All service area pincodes must be 6 digits'));
                }
            }
        }

        // Validate new head if provided
        if (head && head !== department.head?.toString()) {
            const headUser = await User.findById(head);
            if (!headUser) {
                return next(new ApiError(404, 'Department head user not found', 'USER_NOT_FOUND', 'The specified department head does not exist'));
            }

            if (!['department_head', 'admin'].includes(headUser.role)) {
                return next(new ApiError(400, 'User must have department_head or admin role', 'INVALID_ROLE', 'Only users with department_head or admin role can be assigned as department head'));
            }

            // Check if user is already head of another department
            const existingDepartmentWithHead = await Department.findOne({
                head: head,
                _id: { $ne: req.params.id }
            });
            if (existingDepartmentWithHead) {
                return next(new ApiError(400, 'User is already head of another department', 'USER_ALREADY_HEAD', 'A user can only be head of one department'));
            }
        }

        // Update fields
        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (description !== undefined) updateData.description = description?.trim();
        if (code !== undefined) updateData.code = code.trim();
        if (categories !== undefined) updateData.categories = categories.map(cat => cat.trim());
        if (serviceArea !== undefined) updateData.serviceArea = serviceArea && Array.isArray(serviceArea) ? serviceArea.map(pin => pin.trim()) : [];
        if (head !== undefined) updateData.head = head;
        if (offices !== undefined) updateData.offices = offices;

        const updatedDepartment = await Department.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).populate('head', 'firstName lastName email employeeId');

        logger.info(`Department updated successfully: ${updatedDepartment.name} by user ${req.user?.id}`);

        res.status(200).json({
            success: true,
            message: 'Department updated successfully',
            data: updatedDepartment
        });

    } catch (error) {
        logger.error('Error updating department:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return next(new ApiError(400, 'Validation Error', 'VALIDATION_ERROR', messages));
        }

        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            return next(new ApiError(400, `Department with ${field} '${value}' already exists`, 'DUPLICATE_ENTRY', `${field} must be unique`));
        }

        if (error.kind === 'ObjectId') {
            return next(new ApiError(404, 'Department not found', 'INVALID_ID', 'Invalid department ID format'));
        }

        next(error);
    }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
const deleteDepartment = async (req, res, next) => {
    try {
        const department = await Department.findById(req.params.id);

        if (!department) {
            return next(new ApiError(404, 'Department not found', 'DEPARTMENT_NOT_FOUND', 'Department with this ID does not exist'));
        }

        // Check if department has active staff or complaints (you might want to add this check)
        // For now, we'll allow deletion but you can add validation later

        await Department.findByIdAndDelete(req.params.id);

        logger.info(`Department deleted successfully: ${department.name} by user ${req.user?.id}`);

        res.status(200).json({
            success: true,
            message: 'Department deleted successfully',
            data: {}
        });

    } catch (error) {
        logger.error('Error deleting department:', error);

        if (error.kind === 'ObjectId') {
            return next(new ApiError(404, 'Department not found', 'INVALID_ID', 'Invalid department ID format'));
        }

        next(error);
    }
};

// @desc    Get departments by pincode
// @route   GET /api/departments/by-pincode/:pincode
// @access  Public
const getDepartmentsByPincode = async (req, res, next) => {
    try {
        const { pincode } = req.params;

        // Validate pincode format
        if (!/^[0-9]{6}$/.test(pincode)) {
            return next(new ApiError(400, 'Invalid pincode format', 'INVALID_PINCODE', 'Pincode must be 6 digits'));
        }

        const departments = await Department.find({
            serviceArea: { $in: [pincode] }
        })
            .populate('head', 'firstName lastName email employeeId phone')
            .select('name code categories serviceArea head stats')
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: departments.length,
            data: departments
        });

    } catch (error) {
        logger.error('Error fetching departments by pincode:', error);
        next(error);
    }
};

// @desc    Add staff member to department
// @route   POST /api/departments/:id/staff
// @access  Private/Admin/Department Head
const addStaff = async (req, res, next) => {
    try {
        const { id: departmentId } = req.params;
        const { userId, role: staffRole } = req.body;

        // Validate required fields
        if (!userId) {
            return next(new ApiError(400, 'User ID is required', 'MISSING_FIELDS', 'Please provide userId to add as staff'));
        }

        // Find the department
        const department = await Department.findById(departmentId);
        if (!department) {
            return next(new ApiError(404, 'Department not found', 'DEPARTMENT_NOT_FOUND', 'Department with this ID does not exist'));
        }

        // Area-based access control for municipal_admin
        if (req.user && req.user.role === 'municipal_admin') {
            // Check if municipal admin has access to this department
            if (req.user.adminArea && req.user.adminArea.length > 0) {
                const hasAccess = department.serviceArea.some(pincode => req.user.adminArea.includes(pincode));
                if (!hasAccess) {
                    return next(new ApiError(403, 'Access denied', 'ACCESS_DENIED', 'You do not have permission to manage this department'));
                }
            } else {
                return next(new ApiError(403, 'Access denied', 'ACCESS_DENIED', 'No admin area defined for your account'));
            }
        }

        // Check if user is department head trying to manage their own department
        if (req.user.role === 'department_head') {
            if (department.head?.toString() !== req.user._id.toString()) {
                return next(new ApiError(403, 'Access denied', 'ACCESS_DENIED', 'Department heads can only manage their own department staff'));
            }
        }

        // Find the user to be added as staff
        const user = await User.findById(userId);
        if (!user) {
            return next(new ApiError(404, 'User not found', 'USER_NOT_FOUND', 'The specified user does not exist'));
        }

        // Validate user role - only staff members can be added to department staff
        if (user.role !== 'staff') {
            return next(new ApiError(400, 'Invalid user role', 'INVALID_ROLE', 'Only users with staff role can be added to department staff'));
        }

        // Check if user is already a staff member of this department
        const existingStaff = department.staff.find(staff =>
            staff.user.toString() === userId
        );

        if (existingStaff) {
            if (existingStaff.isActive) {
                return next(new ApiError(400, 'User is already an active staff member', 'STAFF_EXISTS', 'This user is already an active staff member of this department'));
            } else {
                // Reactivate existing staff member
                existingStaff.isActive = true;
                existingStaff.role = staffRole || existingStaff.role || 'Staff Member';
                existingStaff.joinedAt = new Date();
            }
        } else {
            // Add new staff member
            department.staff.push({
                user: userId,
                role: staffRole || 'Staff Member',
                isActive: true,
                joinedAt: new Date()
            });
        }

        // Update user's department field if not already set
        if (!user.department || user.department.toString() !== departmentId) {
            user.department = departmentId;
            await user.save();
        }

        // Save department with new staff member
        await department.save();

        // Populate staff information for response
        await department.populate('staff.user', 'firstName lastName email employeeId phone role');

        logger.info(`Staff member added to department: User ${userId} added to ${department.name} by user ${req.user?.id}`);

        res.status(200).json({
            success: true,
            message: 'Staff member added successfully',
            data: {
                department: {
                    _id: department._id,
                    name: department.name,
                    code: department.code
                },
                staff: department.staff
            }
        });

    } catch (error) {
        logger.error('Error adding staff to department:', error);

        if (error.kind === 'ObjectId') {
            return next(new ApiError(404, 'Invalid ID format', 'INVALID_ID', 'Invalid department or user ID format'));
        }

        next(error);
    }
};

// @desc    Remove staff member from department
// @route   DELETE /api/departments/:id/staff/:userId
// @access  Private/Admin/Department Head
const removeStaff = async (req, res, next) => {
    try {
        const { id: departmentId, userId } = req.params;

        // Find the department
        const department = await Department.findById(departmentId);
        if (!department) {
            return next(new ApiError(404, 'Department not found', 'DEPARTMENT_NOT_FOUND', 'Department with this ID does not exist'));
        }

        // Area-based access control for municipal_admin
        if (req.user && req.user.role === 'municipal_admin') {
            if (req.user.adminArea && req.user.adminArea.length > 0) {
                const hasAccess = department.serviceArea.some(pincode => req.user.adminArea.includes(pincode));
                if (!hasAccess) {
                    return next(new ApiError(403, 'Access denied', 'ACCESS_DENIED', 'You do not have permission to manage this department'));
                }
            } else {
                return next(new ApiError(403, 'Access denied', 'ACCESS_DENIED', 'No admin area defined for your account'));
            }
        }

        // Check if user is department head trying to manage their own department
        if (req.user.role === 'department_head') {
            if (department.head?.toString() !== req.user._id.toString()) {
                return next(new ApiError(403, 'Access denied', 'ACCESS_DENIED', 'Department heads can only manage their own department staff'));
            }
        }

        // Find the staff member in the department
        const staffIndex = department.staff.findIndex(staff =>
            staff.user.toString() === userId
        );

        if (staffIndex === -1) {
            return next(new ApiError(404, 'Staff member not found', 'STAFF_NOT_FOUND', 'This user is not a staff member of this department'));
        }

        // Mark staff member as inactive instead of removing completely (for audit trail)
        department.staff[staffIndex].isActive = false;

        // Update user's department field and role
        const user = await User.findById(userId);
        if (user && user.department?.toString() === departmentId) {
            user.department = null;
            user.role = 'citizen';
            await user.save();
        }

        // Save department
        await department.save();

        logger.info(`Staff member removed from department: User ${userId} removed from ${department.name} by user ${req.user?.id}`);

        res.status(200).json({
            success: true,
            message: 'Staff member removed successfully',
            data: {}
        });

    } catch (error) {
        logger.error('Error removing staff from department:', error);

        if (error.kind === 'ObjectId') {
            return next(new ApiError(404, 'Invalid ID format', 'INVALID_ID', 'Invalid department or user ID format'));
        }

        next(error);
    }
};

// @desc    Get department staff members
// @route   GET /api/departments/:id/staff
// @access  Private/Staff and above
const getDepartmentStaff = async (req, res, next) => {
    try {
        const { id: departmentId } = req.params;
        const { includeInactive = 'false' } = req.query;

        // Find the department
        const department = await Department.findById(departmentId)
            .populate('staff.user', 'firstName lastName email employeeId phone role isActive');

        if (!department) {
            return next(new ApiError(404, 'Department not found', 'DEPARTMENT_NOT_FOUND', 'Department with this ID does not exist'));
        }

        // Area-based access control for municipal_admin
        if (req.user && req.user.role === 'municipal_admin') {
            if (req.user.adminArea && req.user.adminArea.length > 0) {
                const hasAccess = department.serviceArea.some(pincode => req.user.adminArea.includes(pincode));
                if (!hasAccess) {
                    return next(new ApiError(403, 'Access denied', 'ACCESS_DENIED', 'You do not have permission to view this department'));
                }
            } else {
                return next(new ApiError(403, 'Access denied', 'ACCESS_DENIED', 'No admin area defined for your account'));
            }
        }

        // Filter staff based on active status
        let staff = department.staff;
        if (includeInactive !== 'true') {
            staff = staff.filter(member => member.isActive);
        }

        res.status(200).json({
            success: true,
            count: staff.length,
            data: {
                department: {
                    _id: department._id,
                    name: department.name,
                    code: department.code
                },
                staff: staff
            }
        });

    } catch (error) {
        logger.error('Error fetching department staff:', error);

        if (error.kind === 'ObjectId') {
            return next(new ApiError(404, 'Department not found', 'INVALID_ID', 'Invalid department ID format'));
        }

        next(error);
    }
};

export {
    createADepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
    getDepartmentsByPincode,
    addStaff,
    removeStaff,
    getDepartmentStaff
};