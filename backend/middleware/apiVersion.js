const semver = require('semver');
const logger = require('../utils/logger');

const apiVersions = {
    'v1': {
        minVersion: '1.0.0',
        maxVersion: '1.9.9',
        deprecated: false
    },
    'v2': {
        minVersion: '2.0.0',
        maxVersion: '2.9.9',
        deprecated: false
    }
};

const versionCheck = (req, res, next) => {
    const clientVersion = req.headers['x-api-version'] || '1.0.0';
    const apiVersion = req.originalUrl.split('/')[2] || 'v1';

    if (!apiVersions[apiVersion]) {
        logger.error(`Invalid API version requested: ${apiVersion}`);
        return res.status(400).json({
            error: 'Invalid API version',
            message: 'The requested API version is not supported'
        });
    }

    const { minVersion, maxVersion, deprecated } = apiVersions[apiVersion];

    if (deprecated) {
        logger.warn(`Deprecated API version requested: ${apiVersion}`);
        res.set('X-API-Deprecated', 'true');
        res.set('X-API-Message', 'This API version is deprecated. Please upgrade to the latest version.');
    }

    if (!semver.valid(clientVersion)) {
        logger.error(`Invalid client version format: ${clientVersion}`);
        return res.status(400).json({
            error: 'Invalid version format',
            message: 'Client version must follow semantic versioning'
        });
    }

    if (semver.lt(clientVersion, minVersion) || semver.gt(clientVersion, maxVersion)) {
        logger.error(`Unsupported client version: ${clientVersion}`);
        return res.status(400).json({
            error: 'Unsupported version',
            message: `This API version supports clients from ${minVersion} to ${maxVersion}`,
            currentVersion: clientVersion,
            supportedVersions: { min: minVersion, max: maxVersion }
        });
    }

    next();
};

module.exports = {
    versionCheck,
    apiVersions
};
