const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const config = require('./config/config');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/error');
const security = require('./middleware/security');
const { versionCheck } = require('./middleware/apiVersion');
const logger = require('./utils/logger');
const cronJobs = require('./utils/cron');

// Import routes
const authRoutes = require('./routes/auth');
const safetyRoutes = require('./routes/safety');
const stayRoutes = require('./routes/stay');
const rightsRoutes = require('./routes/rights');
const paymentRoutes = require('./routes/payments');

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(security.helmet);
app.use(security.rateLimiter);
app.use(security.mongoSanitize);
app.use(security.xss);
app.use(security.hpp);
app.use(security.customHeaders);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173', // Default Vite development port
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Basic middleware
app.use(express.json({ limit: config.upload.maxSize }));
app.use(express.urlencoded({ extended: true, limit: config.upload.maxSize }));

// Logging
app.use(morgan('combined', { stream: logger.stream }));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API version check
app.use('/api/v1', versionCheck);
app.use('/api/v2', versionCheck);

// Routes with versioning
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/safety', safetyRoutes);
app.use('/api/v1/stay', stayRoutes);
app.use('/api/v1/rights', rightsRoutes);
app.use('/api/v1/payments', paymentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: config.server.env,
        version: require('./package.json').version
    });
});

// Serve static files in production
if (config.server.env === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
}

// Error handling middleware
app.use(errorHandler);

// Create required directories
const fs = require('fs');
const directories = [
    'uploads/safety',
    'uploads/homestays',
    'uploads/claims',
    'uploads/profiles',
    'logs',
    'backups'
];

directories.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
});

// Start cron jobs in production
if (config.server.env === 'production') {
    cronJobs.startAll();
}

const server = app.listen(config.server.port, () => {
    logger.info(`Server running in ${config.server.env} mode on port ${config.server.port}`);
});

// Graceful shutdown
const gracefulShutdown = () => {
    logger.info('Received shutdown signal. Starting graceful shutdown...');
    
    server.close(() => {
        logger.info('HTTP server closed.');
        
        cronJobs.stopAll();
        logger.info('Cron jobs stopped.');
        
        mongoose.connection.close(false, () => {
            logger.info('MongoDB connection closed.');
            process.exit(0);
        });
    });

    // Force shutdown after 30 seconds
    setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 30000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = app;
