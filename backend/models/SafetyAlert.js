const mongoose = require('mongoose');

const safetyAlertSchema = new mongoose.Schema({
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['theft', 'scam', 'unsafe_zone', 'harassment', 'other'],
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        },
        address: String,
        city: String,
        country: String
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    images: [{
        type: String,
        trim: true
    }],
    severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'resolved', 'investigating'],
        default: 'active'
    },
    verificationCount: {
        type: Number,
        default: 0
    },
    verifiedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for geospatial queries
safetyAlertSchema.index({ location: '2dsphere' });

const SafetyAlert = mongoose.model('SafetyAlert', safetyAlertSchema);
module.exports = SafetyAlert;
