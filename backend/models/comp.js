import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema({
    // The Citizen
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    // Title of th COmplaint
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, "Title must be at least 3 characters long"],
        maxlength: [100, "Title cannot exceed 100 characters"],
    },

    // Description
    description: {
        type: String,
        trim: true,
        maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    // Supporting media, images. recordings
    media: {
        images: [{
            url: {
                type: String,
                validate: {
                    validator: function (v) {
                        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
                    },
                    message: "Invalid image URL format",
                }
            },
            caption: {
                type: String,
                maxlength: [200, "Caption cannot exceed 200 characters"]
            },
            uploadedAt: {
                type: Date,
                default: Date.now
            }
        }],
        voiceRecordings: [{
            url: {
                type: String,
                validate: {
                    validator: function (v) {
                        return /^https?:\/\/.+\.(mp3|wav|m4a|ogg)$/i.test(v);
                    },
                    message: "Invalid audio URL format",
                }
            },
            duration: Number,
            uploadedAt: {
                type: Date,
                default: Date.now
            }
        }]

        //TODO: Add video support
    },

    // Location of the site of complaint
    location: {
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
            validate: {
                validator: function (v) {
                    return v.length === 2 &&
                        v[0] >= -180 && v[0] <= 180 &&
                        v[1] >= -90 && v[1] <= 90;
                },
                message: 'Coordinates must be [longitude, latitude] with valid ranges'
            }
        },
    },
    
    state: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, "State cannot exceed 100 characters"]
    },

    district: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, "District cannot exceed 100 characters"]
    },

    locality: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, "Locality cannot exceed 100 characters"]
    },

    pinCode: {
        type: String,
        required: true,
        trim: true,
        match: [/^\d{6}$/, "Pin code must be a 6-digit number"]
    },

    address: {
        type: String,
        trim: true,
        maxlength: [200, "Address cannot exceed 200 characters"]
    },

    landmark: {
        type: String,
        trim: true,
        maxlength: [100, "Landmark cannot exceed 100 characters"]
    },

    // Type of complaint
    category: {
        type: String,
        enum: [
            "Road",
            "Sanitation",
            "Streetlight",
            "Water Supply",
            "Medical",
            "Food Safety",
            "Other",
        ],
        required: true,
    },

    // Department Assigned to
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
    },

    // Supervisor overlooking the complaint
    supervisorAssigned: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    // Priority of the COmplaint
    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Critical"],
        default: "Medium",
    },


    // Other Users(Citizens) views on the matter
    supportingComplaint: {
        viewCount: {
            type: Number,
            default: 0
        },
        upvotes: {
            type: Number,
            default: 1
        },
        reportedBy: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            reportedAt: {
                type: Date,
                default: Date.now
            }
        }],
    },

    // Feedback on the complaint by the citizen
    feedback: [{
        citizenRating: {
            type: Number,
            min: 1,
            max: 5
        },
        citizenComment: {
            type: String,
            maxlength: [500, "Feedback comment cannot exceed 500 characters"]
        },
        feedbackDate: Date
    }, { id: false }],

    // Notifying the User about the status of the complaint
    notifications: {
        emailSent: {
            type: Boolean,
            default: false
        },
        smsSent: {
            type: Boolean,
            default: false
        },
        pushNotificationSent: {
            type: Boolean,
            default: false
        }
    },

    timeline: [
        {
            status: {
                type: String,
                enum: ["Pending", "Acknowledged", "In Progress", "Resolved", "Rejected"],
                required: true
            },
            updatedAt: {
                type: Date,
                default: Date.now
            },
            updatedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            note: {
                type: String,
                maxlength: [500, "Timeline note cannot exceed 500 characters"]
            },
            attachments: [{
                type: String, // URLs of any proof/progress images
                validate: {
                    validator: function (v) {
                        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|pdf)$/i.test(v);
                    },
                    message: "Invalid attachment URL format",
                }
            }],
            estimatedCompletion: Date, // When this step is expected to complete
            notificationSent: {
                type: Boolean,
                default: false
            }
        },
    ],

    // Comlaint Date
    createdAt: {
        type: Date,
        default: Date.now,
    },

    // Complaint Resolve Date
    resolvedAt: {
        type: Date,
    },

    tags: [{
        type: String,
        trim: true
    }],

    relatedComplaints: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Complaint"
    }]
});

// Indexes for better performance and analytics
ComplaintSchema.index({ "location.coordinates": "2dsphere" });
ComplaintSchema.index({ category: 1 });
ComplaintSchema.index({ createdAt: -1 });
ComplaintSchema.index({ department: 1 });
ComplaintSchema.index({ assignedTo: 1 });
ComplaintSchema.index({ user: 1, createdAt: -1 });
ComplaintSchema.index({ priority: 1, urgencyLevel: 1 });
ComplaintSchema.index({ "timeline.status": 1 }); // For status filtering

// Virtual for getting current status from timeline
ComplaintSchema.virtual('currentStatus').get(function () {
    if (this.timeline && this.timeline.length > 0) {
        return this.timeline[this.timeline.length - 1].status;
    }
    return 'Pending'; // Default status
});

// Virtual for calculating response time
ComplaintSchema.virtual('responseTime').get(function () {
    if (this.timeline.length > 1) {
        const acknowledged = this.timeline.find(t => t.status === 'Acknowledged');
        if (acknowledged) {
            return acknowledged.updatedAt - this.createdAt;
        }
    }
    return null;
});

// Virtual for calculating resolution time
ComplaintSchema.virtual('resolutionTime').get(function () {
    if (this.resolvedAt) {
        return this.resolvedAt - this.createdAt;
    }
    return null;
});

// Method to update status (recommended way to change status)
ComplaintSchema.methods.updateStatus = function (newStatus, updatedBy, note = '') {
    const validStatuses = ["Pending", "Acknowledged", "In Progress", "Resolved", "Rejected"];

    if (!validStatuses.includes(newStatus)) {
        throw new Error(`Invalid status: ${newStatus}`);
    }

    // Add to timeline
    this.timeline.push({
        status: newStatus,
        updatedAt: new Date(),
        updatedBy: updatedBy,
        note: note || `Status changed to ${newStatus}`
    });

    // Update resolvedAt if status is Resolved
    if (newStatus === 'Resolved') {
        this.resolvedAt = new Date();
    }

    return this.save();
};

// Pre-save middleware to ensure initial timeline entry
ComplaintSchema.pre('save', function (next) {
    // If this is a new complaint and no timeline exists, create initial entry
    if (this.isNew && (!this.timeline || this.timeline.length === 0)) {
        this.timeline = [{
            status: 'Pending',
            updatedAt: new Date(),
            updatedBy: this.user,
            note: 'Complaint submitted'
        }];
    }
    next();
});

export default mongoose.model("Complaint", ComplaintSchema);