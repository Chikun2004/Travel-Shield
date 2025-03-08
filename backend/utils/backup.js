const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');

class DatabaseBackup {
    constructor() {
        this.backupDir = path.join(__dirname, '../backups');
        this.createBackupDirectory();
    }

    createBackupDirectory() {
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
    }

    async createBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(this.backupDir, `backup-${timestamp}`);
        
        const cmd = `mongodump --uri="${process.env.MONGODB_URI}" --out="${backupPath}"`;

        return new Promise((resolve, reject) => {
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    logger.error('Backup failed:', error);
                    reject(error);
                    return;
                }
                
                logger.info('Backup completed successfully');
                logger.debug('Backup output:', stdout);
                
                if (stderr) {
                    logger.warn('Backup warnings:', stderr);
                }

                resolve(backupPath);
            });
        });
    }

    async restoreBackup(backupPath) {
        if (!fs.existsSync(backupPath)) {
            throw new Error('Backup path does not exist');
        }

        const cmd = `mongorestore --uri="${process.env.MONGODB_URI}" "${backupPath}"`;

        return new Promise((resolve, reject) => {
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    logger.error('Restore failed:', error);
                    reject(error);
                    return;
                }

                logger.info('Restore completed successfully');
                logger.debug('Restore output:', stdout);

                if (stderr) {
                    logger.warn('Restore warnings:', stderr);
                }

                resolve(true);
            });
        });
    }

    cleanOldBackups(daysToKeep = 7) {
        const files = fs.readdirSync(this.backupDir);
        const now = new Date();

        files.forEach(file => {
            const filePath = path.join(this.backupDir, file);
            const stats = fs.statSync(filePath);
            const daysOld = (now - stats.mtime) / (1000 * 60 * 60 * 24);

            if (daysOld > daysToKeep) {
                fs.rmSync(filePath, { recursive: true, force: true });
                logger.info(`Deleted old backup: ${file}`);
            }
        });
    }
}

module.exports = new DatabaseBackup();
