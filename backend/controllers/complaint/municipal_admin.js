import Complaint from '../../models/complaint.js';
import User from '../../models/user.js';
import ApiError from '../../utils/ApiError.js';
import { sendEmail } from '../../utils/emailService.js';

/**
 * Assign a staff member to a complaint
 * @route POST /api/complaints/:complaintId/assign
 * @access Private (Municipal Admin only)
 */
export const assignStaffToComplaint = async (req, res, next) => {
    try {
        const { complaintId } = req.params;
        const { staffId } = req.body;

        // Find the complaint
        const complaint = await Complaint.findById(complaintId);
        if (!complaint) {
            throw new ApiError(404, 'Complaint not found');
        }

        // Check if municipal admin has jurisdiction (pincode check)
        if (!req.user.adminArea.includes(complaint.pincode)) {
            throw new ApiError(403, 'You do not have permission to assign staff to complaints in this area');
        }

        // Check if complaint is already assigned
        if (complaint.assignedTo) {
            throw new ApiError(400, 'Complaint is already assigned to a staff member');
        }

        // Find the staff member
        const staffMember = await User.findById(staffId);
        if (!staffMember || staffMember.role !== 'staff') {
            throw new ApiError(404, 'Staff member not found');
        }

        // Update complaint with staff assignment
        complaint.assignedTo = staffId;
        complaint.status = 'assigned';
        complaint.assignedAt = new Date();
        await complaint.save();

        // Send notification to staff member
        await sendEmail({
            email: staffMember.email,
            subject: 'New Complaint Assignment',
            message: `You have been assigned to handle complaint #${complaint._id}. Please check your dashboard for details.`
        });

        // Send notification to complaint creator
        const complainant = await User.findById(complaint.userId);
        await sendEmail({
            email: complainant.email,
            subject: 'Complaint Update - Staff Assigned',
            message: `Your complaint #${complaint._id} has been assigned to our staff member. They will begin working on it shortly.`
        });

        res.status(200).json({
            success: true,
            message: 'Staff assigned successfully',
            data: {
                complaintId: complaint._id,
                staffId: staffMember._id,
                assignedAt: complaint.assignedAt
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Get all complaints in municipal admin's jurisdiction
 * @route GET /api/complaints/jurisdiction
 * @access Private (Municipal Admin only)
 */
export const getJurisdictionComplaints = async (req, res, next) => {
    try {
        // Ensure admin has assigned pincodes
        if (!req.user.adminArea || req.user.adminArea.length === 0) {
            throw new ApiError(400, 'No pincodes assigned to this municipal admin');
        }

        // Get complaints matching any of the municipal admin's pincodes
        const complaints = await Complaint.find({
            pincode: { $in: req.user.adminArea }
        })
            .populate('userId', 'name email')
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 });

        // Group complaints by pincode for better organization
        const complaintsByPincode = complaints.reduce((acc, complaint) => {
            if (!acc[complaint.pincode]) {
                acc[complaint.pincode] = [];
            }
            acc[complaint.pincode].push(complaint);
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            count: complaints.length,
            data: {
                complaints,
                complaintsByPincode,
                pincodes: req.user.adminArea
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Get complaint assignment statistics
 * @route GET /api/complaints/stats
 * @access Private (Municipal Admin only)
 */
export const getAssignmentStats = async (req, res, next) => {
    try {
        const stats = await Complaint.aggregate([
            { $match: { pincode: { $in: req.user.adminArea } } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: stats
        });

    } catch (error) {
        next(error);
    }
};

