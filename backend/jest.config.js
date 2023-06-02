console.log('jest.config.js read');

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  testTimeout: 60000,
  projects: [
    {
      testPathIgnorePatterns: ['dist'],
      displayName: 'envTests',
      globalSetup: './src/core/test/globalSetup.ts',
      globalTeardown: './src/core/test/globalTeardown.ts',
      transform: {
        '^.+\\.(t|j)sx?$': [
          '@swc/jest',
          // {
          //   // https://github.com/swc-project/jest/blob/master/README.md#q-what-ecmascript-target-is-set-by-jsctarget
          //   jsc: {
          //     target: 'es2022',
          //   },
          // },
        ],
      },
      // using only regex matching via package.json for now
      // testPathIgnorePatterns: ['dist', '*.prod.spec.ts'],
      // testMatch: ['**/*.spec.ts'],
    },
    // Prod tests can not setup/teardown prod DATABASE!
    {
      testPathIgnorePatterns: ['dist'],
      displayName: 'envProd',
      transform: {
        '^.+\\.(t|j)sx?$': ['@swc/jest'],
      },
      // using only regex matching via package.json for now
      // testMatch: ['**/*.prod.spec.ts'],
    },
  ],
};

module.exports = config;
