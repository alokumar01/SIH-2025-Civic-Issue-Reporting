import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
    // Department name
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: [100, "Department name cannot exceed 100 characters"]
    },

    // Short description about responsibilities
    description: {
        type: String,
        trim: true,
        maxlength: [500, "Description cannot exceed 500 characters"]
    },

    // Short code for department (for quick reference)
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        match: [/^[A-Z]{2,6}$/, 'Department code must be 2-6 uppercase letters']
    },

    // Categories handled (mapped with Complaint.category)
    categories: [{
        type: String,
        require: true
    }],

    // Department Head
    head: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // Must have role: "department_head"
    },

    // Staff users under this department
    staff: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        role: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Department analytics fields
    stats: {
        totalComplaints: { type: Number, default: 0 },
        resolvedComplaints: { type: Number, default: 0 },
        avgResolutionTime: { type: Number, default: 0 }, // milliseconds
        pendingComplaints: { type: Number, default: 0 }
    },

    // Location (optional - useful if multiple offices)
    offices: [{
        type: {
            type: String,
            default: "main"
        },
        name: String,
        address: {
            street: String,
            area: String,
            city: String,
            state: String,
            pincode: {
                type: String,
                match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
            },
        },
        contact: {
            phone: String,
            email: String
        }
    }],
}, {timestamps: true});

// Index for faster lookups
DepartmentSchema.index({ name: 1 });
DepartmentSchema.index({ categories: 1 });

export default mongoose.models.Department ||
    mongoose.model("Department", DepartmentSchema);