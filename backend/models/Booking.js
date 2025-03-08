const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    homestay: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Homestay',
        required: true
    },
    guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    guests: {
        adults: {
            type: Number,
            required: true
        },
        children: {
            type: Number,
            default: 0
        }
    },
    totalAmount: {
        type: Number,
        required: true
    },
    fees: {
        base: Number,
        cleaning: Number,
        service: Number,
        taxes: Number
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'partial', 'completed', 'refunded'],
        default: 'pending'
    },
    cancellation: {
        date: Date,
        reason: String,
        refundAmount: Number,
        refundStatus: {
            type: String,
            enum: ['pending', 'processed', 'rejected']
        }
    },
    specialRequests: String,
    reviewSubmitted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for quick lookups
bookingSchema.index({ homestay: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ guest: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
