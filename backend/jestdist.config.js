console.log('jestdist.config.js read');

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  transformIgnorePatterns: [
    'node_modules/(?!(fetch-blob|node-fetch|data-uri-to-buffer|jest-runtime|formdata-polyfill)/)',
  ],
  testPathIgnorePatterns: ['src/e2e'],
  globalSetup: './dist/core/test/globalSetup.js',
  globalTeardown: './dist/core/test/globalTeardown.js',
  testTimeout: 60000,
};

module.exports = config;
