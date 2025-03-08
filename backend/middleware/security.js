const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Security middleware configuration
const securityMiddleware = {
    // Basic security headers
    helmet: helmet(),

    // Rate limiting
    rateLimiter: limiter,

    // Data sanitization against NoSQL query injection
    mongoSanitize: mongoSanitize(),

    // Data sanitization against XSS
    xss: xss(),

    // Prevent HTTP Parameter Pollution
    hpp: hpp(),

    // Custom security headers
    customHeaders: (req, res, next) => {
        res.setHeader('Permissions-Policy', 'geolocation=(), camera=()');
        res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
        next();
    },

    // CORS configuration
    corsOptions: {
        origin: process.env.NODE_ENV === 'production' 
            ? process.env.FRONTEND_URL 
            : 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
        exposedHeaders: ['x-auth-token'],
        credentials: true,
        maxAge: 600 // 10 minutes
    }
};

module.exports = securityMiddleware;
