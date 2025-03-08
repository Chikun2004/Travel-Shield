const mongoose = require('mongoose');

const homestaySchema = new mongoose.Schema({
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
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
        state: String,
        country: String,
        zipCode: String
    },
    amenities: [{
        type: String,
        trim: true
    }],
    images: [{
        type: String,
        required: true
    }],
    price: {
        perNight: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'USD'
        },
        cleaningFee: Number,
        serviceFee: Number
    },
    capacity: {
        guests: Number,
        bedrooms: Number,
        beds: Number,
        bathrooms: Number
    },
    rules: [{
        type: String,
        trim: true
    }],
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    rating: {
        average: {
            type: Number,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    },
    availability: [{
        startDate: Date,
        endDate: Date
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'maintenance'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Index for geospatial queries
homestaySchema.index({ location: '2dsphere' });

const Homestay = mongoose.model('Homestay', homestaySchema);
module.exports = Homestay;
