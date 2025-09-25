import User from '../../models/user.js';
import ApiError from '../../utils/ApiError.js';

/**
 * Add pincodes to municipal admin's jurisdiction
 * @route POST /api/municipal-admin/pincodes
 * @access Private (Super Admin only)
 */
export const addPincodes = async (req, res, next) => {
    try {
        const { adminId, pincodes } = req.body;

        // Validate input
        if (!adminId || !pincodes || !Array.isArray(pincodes)) {
            throw new ApiError(400, 'Please provide adminId and pincodes array');
        }

        // Validate pincode format
        const validPincodeFormat = /^[0-9]{6}$/;
        const areAllPincodesValid = pincodes.every(pincode => validPincodeFormat.test(pincode));
        if (!areAllPincodesValid) {
            throw new ApiError(400, 'All pincodes must be 6 digits');
        }

        // Find the municipal admin
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== 'municipal_admin') {
            throw new ApiError(404, 'Municipal admin not found');
        }

        // Add new pincodes (avoiding duplicates)
        admin.adminArea = [...new Set([...admin.adminArea, ...pincodes])];
        await admin.save();

        res.status(200).json({
            success: true,
            message: 'Pincodes added successfully',
            data: {
                adminId: admin._id,
                pincodes: admin.adminArea
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Remove pincodes from municipal admin's jurisdiction
 * @route DELETE /api/municipal-admin/pincodes
 * @access Private (Super Admin only)
 */
export const removePincodes = async (req, res, next) => {
    try {
        const { adminId, pincodes } = req.body;

        // Validate input
        if (!adminId || !pincodes || !Array.isArray(pincodes)) {
            throw new ApiError(400, 'Please provide adminId and pincodes array');
        }

        // Find the municipal admin
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== 'municipal_admin') {
            throw new ApiError(404, 'Municipal admin not found');
        }

        // Remove specified pincodes
        admin.adminArea = admin.adminArea.filter(p => !pincodes.includes(p));
        await admin.save();

        res.status(200).json({
            success: true,
            message: 'Pincodes removed successfully',
            data: {
                adminId: admin._id,
                pincodes: admin.adminArea
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Get all pincodes assigned to a municipal admin
 * @route GET /api/municipal-admin/:adminId/pincodes
 * @access Private (Super Admin & Municipal Admin)
 */
export const getPincodes = async (req, res, next) => {
    try {
        const { adminId } = req.params;

        const admin = await User.findById(adminId).select('adminArea firstName lastName email');
        if (!admin || admin.role !== 'municipal_admin') {
            throw new ApiError(404, 'Municipal admin not found');
        }

        res.status(200).json({
            success: true,
            data: {
                admin: {
                    id: admin._id,
                    name: `${admin.firstName} ${admin.lastName}`,
                    email: admin.email
                },
                pincodes: admin.adminArea
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Update all pincodes for a municipal admin (replace existing ones)
 * @route PUT /api/municipal-admin/:adminId/pincodes
 * @access Private (Super Admin only)
 */
export const updatePincodes = async (req, res, next) => {
    try {
        const { adminId } = req.params;
        const { pincodes } = req.body;

        // Validate input
        if (!pincodes || !Array.isArray(pincodes)) {
            throw new ApiError(400, 'Please provide pincodes array');
        }

        // Validate pincode format
        const validPincodeFormat = /^[0-9]{6}$/;
        const areAllPincodesValid = pincodes.every(pincode => validPincodeFormat.test(pincode));
        if (!areAllPincodesValid) {
            throw new ApiError(400, 'All pincodes must be 6 digits');
        }

        // Find and update the municipal admin
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== 'municipal_admin') {
            throw new ApiError(404, 'Municipal admin not found');
        }

        admin.adminArea = pincodes;
        await admin.save();

        res.status(200).json({
            success: true,
            message: 'Pincodes updated successfully',
            data: {
                adminId: admin._id,
                pincodes: admin.adminArea
            }
        });

    } catch (error) {
        next(error);
    }
};