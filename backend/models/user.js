import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // Basic Information
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [50, 'First name cannot be more than 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: [50, 'Last name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't include password in queries by default
    },

    // Role-based access control
    role: {
        type: String,
        enum: ['citizen', 'staff', 'admin', 'department_head', 'municipal_admin'],
        default: 'citizen'
    },

    // For staff/admin users
    department: {
        type: mongoose.Schema.ObjectId,
        ref: 'Department',
        required: function () {
            return this.role === 'staff' || this.role === 'department_head';
        }
    },
    employeeId: {
        type: String,
        sparse: true, // Allow null values but enforce uniqueness when present
        unique: true,
        required: function () {
            return this.role === 'staff' || this.role === 'department_head' || this.role === 'admin' || this.role === 'municipal_admin';
        }
    },

    // For municipal_admin users - defines their administrative area
    adminArea: [{
        type: String,
        match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode'],
        trim: true,
    }],

    serviceArea: [{
        type: String,
        match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode'],
        trim: true,
    }],



    // Address Information
    address: {
        street: String,
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        pincode: {
            type: String,
            match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
        },
        coordinates: {
            type: {
                type: String,
                enum: ['Point']
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                index: '2dsphere'
            }
        }
    },

    // Profile Information
    avatar: {
        type: String, // Cloudinary URL
        default: 'https://res.cloudinary.com/dsax7zaig/image/upload/v1758824024/defaultprofile_unxzhr.avif'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },

    // Notification Preferences
    notificationPreferences: {
        email: {
            type: Boolean,
            default: true
        },
        sms: {
            type: Boolean,
            default: false
        },
        push: {
            type: Boolean,
            default: true
        },
        reportUpdates: {
            type: Boolean,
            default: true
        },
        departmentAnnouncements: {
            type: Boolean,
            default: false
        }
    },

    // Statistics for citizens
    reportsSubmitted: {
        type: Number,
        default: 0
    },

    reportsResoved: {
        type: Number,
        default: 0
    },

    // Password reset functionality
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // Email verification
    emailVerificationToken: String,
    emailVerificationExpire: Date,

    // Login tracking
    lastLogin: Date,
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: Date

}, { timestamps: true });

// Virtual for full name
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});


// Index for email verification and password reset
userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ resetPasswordToken: 1 });

export default mongoose.model('User', userSchema);
