const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'USD'
    },
    paymentMethod: {
        type: String,
        enum: ['qr_code', 'card', 'bank_transfer'],
        required: true
    },
    qrCode: {
        id: String,
        url: String,
        expiresAt: Date
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'expired'],
        default: 'pending'
    },
    transactionId: {
        type: String,
        unique: true,
        sparse: true
    },
    paymentDetails: {
        bankName: String,
        accountLast4: String,
        upiId: String
    },
    metadata: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

// Index for quick lookups
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ 'qrCode.id': 1 });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
