const logger = require('./logger');

class AppError extends Error {
    constructor(message, statusCode, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

class ErrorHandler {
    static handleError(err) {
        logger.error('Error:', {
            message: err.message,
            stack: err.stack,
            errorCode: err.errorCode,
            statusCode: err.statusCode
        });
    }

    static isTrustedError(error) {
        return error instanceof AppError;
    }

    static handleTrustedError(err, res) {
        res.status(err.statusCode).json({
            status: err.status,
            error: {
                code: err.errorCode,
                message: err.message
            }
        });
    }

    static handleCriticalError(err, res) {
        res.status(500).json({
            status: 'error',
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong on our end. We\'re looking into it.'
            }
        });
    }
}

// Error codes and messages
const ErrorCodes = {
    // Authentication errors (400-403)
    INVALID_CREDENTIALS: {
        code: 'AUTH001',
        status: 401,
        message: 'Invalid email or password'
    },
    TOKEN_EXPIRED: {
        code: 'AUTH002',
        status: 401,
        message: 'Your session has expired. Please log in again'
    },
    UNAUTHORIZED: {
        code: 'AUTH003',
        status: 401,
        message: 'You must be logged in to access this resource'
    },
    FORBIDDEN: {
        code: 'AUTH004',
        status: 403,
        message: 'You do not have permission to perform this action'
    },

    // Resource errors (404)
    NOT_FOUND: {
        code: 'RES001',
        status: 404,
        message: 'The requested resource was not found'
    },

    // Validation errors (400)
    VALIDATION_ERROR: {
        code: 'VAL001',
        status: 400,
        message: 'Invalid input data'
    },
    DUPLICATE_ENTRY: {
        code: 'VAL002',
        status: 400,
        message: 'This resource already exists'
    },

    // Business logic errors (409, 422)
    CONFLICT: {
        code: 'BUS001',
        status: 409,
        message: 'This operation conflicts with existing data'
    },
    UNPROCESSABLE: {
        code: 'BUS002',
        status: 422,
        message: 'The request was valid but could not be processed'
    },

    // Database errors (500)
    DB_ERROR: {
        code: 'DB001',
        status: 500,
        message: 'Database operation failed'
    },

    // External service errors (502, 503, 504)
    EXTERNAL_SERVICE_ERROR: {
        code: 'EXT001',
        status: 502,
        message: 'External service error'
    },
    SERVICE_UNAVAILABLE: {
        code: 'EXT002',
        status: 503,
        message: 'Service temporarily unavailable'
    },
    TIMEOUT: {
        code: 'EXT003',
        status: 504,
        message: 'Request timeout'
    }
};

// Error factory functions
const createError = (errorType, customMessage = null) => {
    const error = ErrorCodes[errorType];
    if (!error) {
        throw new Error(`Unknown error type: ${errorType}`);
    }
    return new AppError(
        customMessage || error.message,
        error.status,
        error.code
    );
};

module.exports = {
    AppError,
    ErrorHandler,
    ErrorCodes,
    createError
};
