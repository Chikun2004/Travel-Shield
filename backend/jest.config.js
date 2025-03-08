module.exports = {
    testEnvironment: 'node',
    verbose: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/config/',
        '/tests/fixtures/'
    ],
    testMatch: ['**/tests/**/*.test.js'],
    setupFiles: ['./tests/setup.js']
};
