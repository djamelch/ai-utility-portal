
// This is a mock module for platform-specific Rollup dependencies
console.log('Using rollup mock for platform-specific dependencies');

// Create a mock that provides the minimum functionality needed
const noop = () => {};

// Mock object with all required methods
const rollupMock = {
  createBundle: () => ({
    generate: async () => ({}),
    write: async () => ({}),
    close: noop
  }),
  rollup: async () => ({
    generate: async () => ({}),
    write: async () => ({}),
    close: noop
  }),
  parseModuleUrl: () => ({}),
  VERSION: '4.40.0',
  watch: () => ({ close: noop }),
  defineConfig: config => config
};

// Export all required methods and properties
module.exports = rollupMock;
// Also export as default for ES modules
module.exports.default = rollupMock;
