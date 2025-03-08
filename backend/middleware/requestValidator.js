const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

const validateRequest = (validations) => {
    return async (req, res, next) => {
        // Run all validations
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        // Log validation errors
        logger.warn('Request validation failed', {
            path: req.path,
            errors: errors.array()
        });

        // Format errors for response
        const formattedErrors = errors.array().reduce((acc, error) => {
            const field = error.path;
            if (!acc[field]) {
                acc[field] = [];
            }
            acc[field].push(error.msg);
            return acc;
        }, {});

        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: formattedErrors
        });
    };
};

// Common validation rules
const commonValidations = {
    pagination: [
        {
            field: 'page',
            rules: {
                optional: true,
                isInt: { min: 1 },
                toInt: true
            },
            message: 'Page must be a positive integer'
        },
        {
            field: 'limit',
            rules: {
                optional: true,
                isInt: { min: 1, max: 100 },
                toInt: true
            },
            message: 'Limit must be between 1 and 100'
        }
    ],
    coordinates: [
        {
            field: 'latitude',
            rules: {
                isFloat: { min: -90, max: 90 },
                toFloat: true
            },
            message: 'Invalid latitude value'
        },
        {
            field: 'longitude',
            rules: {
                isFloat: { min: -180, max: 180 },
                toFloat: true
            },
            message: 'Invalid longitude value'
        }
    ],
    dateRange: [
        {
            field: 'startDate',
            rules: {
                isISO8601: true,
                toDate: true
            },
            message: 'Invalid start date format'
        },
        {
            field: 'endDate',
            rules: {
                isISO8601: true,
                toDate: true,
                custom: {
                    options: (value, { req }) => {
                        return !req.body.startDate || new Date(value) >= new Date(req.body.startDate);
                    }
                }
            },
            message: 'End date must be after start date'
        }
    ]
};

module.exports = {
    validateRequest,
    commonValidations
};
