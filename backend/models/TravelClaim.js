const mongoose = require('mongoose');

const travelClaimSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    travelType: {
        type: String,
        enum: ['flight', 'train', 'bus'],
        required: true
    },
    transportationDetails: {
        carrier: String,
        flightNumber: String,
        bookingReference: String,
        departureTime: Date,
        arrivalTime: Date,
        origin: String,
        destination: String
    },
    issueType: {
        type: String,
        enum: ['delay', 'cancellation', 'overbooking', 'baggage', 'other'],
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    evidence: [{
        type: String,
        trim: true
    }],
    compensationAmount: {
        amount: Number,
        currency: {
            type: String,
            default: 'USD'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'reviewing', 'approved', 'rejected', 'paid'],
        default: 'pending'
    },
    adminNotes: {
        type: String,
        trim: true
    },
    timeline: [{
        status: String,
        date: {
            type: Date,
            default: Date.now
        },
        note: String
    }]
}, {
    timestamps: true
});

const TravelClaim = mongoose.model('TravelClaim', travelClaimSchema);
module.exports = TravelClaim;
