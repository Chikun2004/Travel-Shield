const cron = require('node-cron');
const backup = require('./backup');
const logger = require('./logger');
const User = require('../models/User');
const SafetyAlert = require('../models/SafetyAlert');
const emailService = require('./emailService');

class CronJobs {
    constructor() {
        this.jobs = [];
    }

    // Daily database backup at 2 AM
    setupDatabaseBackup() {
        this.jobs.push(
            cron.schedule('0 2 * * *', async () => {
                try {
                    logger.info('Starting daily database backup');
                    await backup.createBackup();
                    backup.cleanOldBackups(7); // Keep backups for 7 days
                } catch (error) {
                    logger.error('Database backup failed:', error);
                }
            })
        );
    }

    // Clean up old safety alerts every week
    setupSafetyAlertCleanup() {
        this.jobs.push(
            cron.schedule('0 3 * * 0', async () => {
                try {
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                    await SafetyAlert.deleteMany({
                        createdAt: { $lt: thirtyDaysAgo },
                        status: 'resolved'
                    });

                    logger.info('Old safety alerts cleaned up');
                } catch (error) {
                    logger.error('Safety alert cleanup failed:', error);
                }
            })
        );
    }

    // Send weekly safety digest to users
    setupSafetyDigest() {
        this.jobs.push(
            cron.schedule('0 8 * * 1', async () => {
                try {
                    const users = await User.find({ role: 'user' });
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                    for (const user of users) {
                        const alerts = await SafetyAlert.find({
                            createdAt: { $gte: oneWeekAgo },
                            'location.city': user.address.city
                        });

                        if (alerts.length > 0) {
                            await emailService.sendSafetyDigest(user.email, alerts);
                        }
                    }

                    logger.info('Weekly safety digest sent');
                } catch (error) {
                    logger.error('Safety digest sending failed:', error);
                }
            })
        );
    }

    // Monitor system health
    setupHealthCheck() {
        this.jobs.push(
            cron.schedule('*/15 * * * *', async () => {
                try {
                    const used = process.memoryUsage();
                    const systemHealth = {
                        memory: {
                            heapTotal: `${Math.round(used.heapTotal / 1024 / 1024 * 100) / 100} MB`,
                            heapUsed: `${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`
                        },
                        uptime: process.uptime()
                    };

                    logger.info('System health check:', systemHealth);
                } catch (error) {
                    logger.error('Health check failed:', error);
                }
            })
        );
    }

    // Start all cron jobs
    startAll() {
        this.setupDatabaseBackup();
        this.setupSafetyAlertCleanup();
        this.setupSafetyDigest();
        this.setupHealthCheck();
        logger.info('All cron jobs started');
    }

    // Stop all cron jobs
    stopAll() {
        this.jobs.forEach(job => job.stop());
        this.jobs = [];
        logger.info('All cron jobs stopped');
    }
}

module.exports = new CronJobs();
