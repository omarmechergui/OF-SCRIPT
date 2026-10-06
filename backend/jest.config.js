/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.js'],
  // MongoMemoryReplSet download + startup genuinely takes 10-20s on first run;
  // individual tests should complete in well under 10s after that.
  testTimeout: 30000,
};
