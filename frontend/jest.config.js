console.log("jest.config.js read");

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  transformIgnorePatterns: [
    "node_modules/(?!(fetch-blob|node-fetch|data-uri-to-buffer|jest-runtime|formdata-polyfill)/)",
  ],
  testPathIgnorePatterns: ["dist", "src/e2e"],
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
};

module.exports = config;

// Or async function
// module.exports = async () => {
//   return {
//     verbose: true,
//   };
// };
