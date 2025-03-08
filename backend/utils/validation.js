const { body } = require('express-validator');

const validations = {
    userValidation: [
        body('username')
            .trim()
            .isLength({ min: 3 })
            .withMessage('Username must be at least 3 characters long'),
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please enter a valid email'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .matches(/\d/)
            .withMessage('Password must contain a number')
    ],

    homestayValidation: [
        body('title')
            .trim()
            .notEmpty()
            .withMessage('Title is required'),
        body('description')
            .trim()
            .isLength({ min: 50 })
            .withMessage('Description must be at least 50 characters long'),
        body('price.perNight')
            .isNumeric()
            .withMessage('Price must be a number'),
        body('location')
            .isObject()
            .withMessage('Location details are required')
    ],

    safetyAlertValidation: [
        body('type')
            .isIn(['theft', 'scam', 'unsafe_zone', 'harassment', 'other'])
            .withMessage('Invalid alert type'),
        body('description')
            .trim()
            .notEmpty()
            .withMessage('Description is required'),
        body('severity')
            .isIn(['low', 'medium', 'high'])
            .withMessage('Invalid severity level'),
        body('location')
            .isObject()
            .withMessage('Location details are required')
    ],

    claimValidation: [
        body('travelType')
            .isIn(['flight', 'train', 'bus'])
            .withMessage('Invalid travel type'),
        body('issueType')
            .isIn(['delay', 'cancellation', 'overbooking', 'baggage', 'other'])
            .withMessage('Invalid issue type'),
        body('description')
            .trim()
            .notEmpty()
            .withMessage('Description is required'),
        body('transportationDetails')
            .isObject()
            .withMessage('Transportation details are required')
    ],

    bookingValidation: [
        body('checkIn')
            .isISO8601()
            .withMessage('Invalid check-in date'),
        body('checkOut')
            .isISO8601()
            .withMessage('Invalid check-out date'),
        body('guests.adults')
            .isInt({ min: 1 })
            .withMessage('At least 1 adult guest is required'),
        body('guests.children')
            .isInt({ min: 0 })
            .withMessage('Number of children must be 0 or more')
    ],

    paymentValidation: [
        body('amount')
            .isNumeric()
            .withMessage('Amount must be a number'),
        body('paymentMethod')
            .isIn(['qr_code', 'card', 'bank_transfer'])
            .withMessage('Invalid payment method')
    ]
};

module.exports = validations;
