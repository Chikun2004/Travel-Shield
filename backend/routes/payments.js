const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const QRCode = require('qrcode');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');

// Generate QR code for payment
router.post('/generate-qr', [
    auth,
    body('bookingId').notEmpty(),
    body('amount').isNumeric()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { bookingId, amount } = req.body;

        // Verify booking exists and belongs to user
        const booking = await Booking.findOne({
            _id: bookingId,
            guest: req.user.id
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Generate unique payment ID
        const paymentId = crypto.randomBytes(16).toString('hex');
        
        // Generate QR code data
        const qrData = {
            paymentId,
            amount,
            bookingId,
            timestamp: Date.now()
        };

        // Generate QR code
        const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData));

        // Create payment record
        const payment = new Payment({
            booking: bookingId,
            amount,
            paymentMethod: 'qr_code',
            qrCode: {
                id: paymentId,
                url: qrCodeUrl,
                expiresAt: new Date(Date.now() + 30 * 60000) // 30 minutes expiry
            }
        });

        await payment.save();

        res.json({
            paymentId,
            qrCodeUrl,
            expiresAt: payment.qrCode.expiresAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify QR payment status
router.get('/verify/:paymentId', auth, async (req, res) => {
    try {
        const payment = await Payment.findOne({
            'qrCode.id': req.params.paymentId
        });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.json({
            status: payment.status,
            amount: payment.amount,
            paymentMethod: payment.paymentMethod,
            transactionId: payment.transactionId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Process QR payment (webhook endpoint)
router.post('/process-qr', async (req, res) => {
    try {
        const { paymentId, transactionId, status, paymentDetails } = req.body;

        const payment = await Payment.findOne({
            'qrCode.id': paymentId
        });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Update payment status
        payment.status = status;
        payment.transactionId = transactionId;
        payment.paymentDetails = paymentDetails;

        // If payment is completed, update booking status
        if (status === 'completed') {
            const booking = await Booking.findById(payment.booking);
            booking.paymentStatus = 'completed';
            booking.status = 'confirmed';
            await booking.save();
        }

        await payment.save();

        res.json({ message: 'Payment processed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get payment history
router.get('/history', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ guest: req.user.id });
        const bookingIds = bookings.map(booking => booking._id);

        const payments = await Payment.find({
            booking: { $in: bookingIds }
        }).sort({ createdAt: -1 });

        res.json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
