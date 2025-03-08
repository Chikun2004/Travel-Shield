const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_PORT === '465',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendVerificationEmail(email, token) {
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
        
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Verify Your TravelShield Account',
            html: `
                <h1>Welcome to TravelShield!</h1>
                <p>Please click the link below to verify your email address:</p>
                <a href="${verificationUrl}">Verify Email</a>
                <p>If you didn't create an account, please ignore this email.</p>
            `
        };

        return this.transporter.sendMail(mailOptions);
    }

    async sendBookingConfirmation(email, booking) {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Booking Confirmation - TravelShield',
            html: `
                <h1>Booking Confirmed!</h1>
                <h2>Booking Details:</h2>
                <p>Check-in: ${booking.checkIn}</p>
                <p>Check-out: ${booking.checkOut}</p>
                <p>Total Amount: $${booking.totalAmount}</p>
                <p>Booking Reference: ${booking._id}</p>
                <p>Thank you for choosing TravelShield!</p>
            `
        };

        return this.transporter.sendMail(mailOptions);
    }

    async sendSafetyAlert(email, alert) {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Safety Alert - TravelShield',
            html: `
                <h1>Safety Alert in Your Area</h1>
                <h2>Alert Details:</h2>
                <p>Type: ${alert.type}</p>
                <p>Location: ${alert.location.address}</p>
                <p>Description: ${alert.description}</p>
                <p>Severity: ${alert.severity}</p>
                <p>Stay safe with TravelShield!</p>
            `
        };

        return this.transporter.sendMail(mailOptions);
    }

    async sendClaimUpdate(email, claim) {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Claim Update - TravelShield',
            html: `
                <h1>Update on Your Travel Claim</h1>
                <h2>Claim Details:</h2>
                <p>Claim ID: ${claim._id}</p>
                <p>Status: ${claim.status}</p>
                <p>Type: ${claim.travelType}</p>
                <p>Issue: ${claim.issueType}</p>
                ${claim.compensationAmount ? `<p>Compensation Amount: $${claim.compensationAmount.amount}</p>` : ''}
                <p>Thank you for using TravelShield!</p>
            `
        };

        return this.transporter.sendMail(mailOptions);
    }
}

module.exports = new EmailService();
