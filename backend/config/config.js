const path = require('path');
const logger = require('../utils/logger');

// Load appropriate .env file based on environment
require('dotenv').config({
    path: path.join(__dirname, `../.env.${process.env.NODE_ENV || 'development'}`)
});

const config = {
    // Server configuration
    server: {
        port: process.env.PORT || 5000,
        env: process.env.NODE_ENV || 'development',
        apiUrl: process.env.API_URL || 'http://localhost:5000',
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
    },

    // Database configuration
    database: {
        url: process.env.MONGODB_URI,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },

    // JWT configuration
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
    },

    // Email configuration
    email: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        from: process.env.EMAIL_FROM || 'noreply@travelshield.com'
    },

    // Payment configuration
    payment: {
        stripeSecretKey: process.env.STRIPE_SECRET_KEY,
        stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        currency: process.env.PAYMENT_CURRENCY || 'usd'
    },

    // File upload configuration
    upload: {
        maxSize: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
        directory: path.join(__dirname, '../uploads')
    },

    // Security configuration
    security: {
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10'),
        rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
        rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100')
    },

    // Logging configuration
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        directory: path.join(__dirname, '../logs')
    },

    // Backup configuration
    backup: {
        directory: path.join(__dirname, '../backups'),
        retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '7')
    },

    // Cache configuration
    cache: {
        ttl: parseInt(process.env.CACHE_TTL || '3600'), // 1 hour
        checkPeriod: parseInt(process.env.CACHE_CHECK_PERIOD || '600') // 10 minutes
    }
};

// Validate required configuration
const validateConfig = () => {
    const requiredFields = [
        ['database.url', config.database.url],
        ['jwt.secret', config.jwt.secret],
        ['email.host', config.email.host],
        ['payment.stripeSecretKey', config.payment.stripeSecretKey]
    ];

    const missingFields = requiredFields
        .filter(([, value]) => !value)
        .map(([field]) => field);

    if (missingFields.length > 0) {
        const error = `Missing required configuration: ${missingFields.join(', ')}`;
        logger.error(error);
        throw new Error(error);
    }
};

try {
    validateConfig();
} catch (error) {
    if (process.env.NODE_ENV === 'production') {
        throw error;
    } else {
        logger.warn('Configuration validation failed:', error.message);
    }
}

module.exports = config;
