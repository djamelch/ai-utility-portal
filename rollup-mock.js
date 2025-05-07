
// This is a mock module for platform-specific Rollup dependencies
console.log('Using rollup mock for platform-specific dependencies');

// Create a mock that provides the minimum functionality needed
const noop = () => {};

// Create minimal output objects that match what rollup expects
const emptyOutput = { 
  output: [],
  code: '',
  map: null,
  content: null,
  modules: {},
  chunks: [],
  assets: {},
  fileName: '',
  assetFileName: ''
};

// Mock object with all required methods
const rollupMock = {
  // Core rollup methods
  createBundle: () => ({
    generate: async () => emptyOutput,
    write: async () => emptyOutput,
    close: noop
  }),
  
  rollup: async () => ({
    generate: async () => emptyOutput,
    write: async () => emptyOutput,
    close: noop
  }),
  
  // Required by rollup internals
  loadAndParseConfigFile: async () => ({
    options: [],
    warnings: { flush: noop }
  }),
  
  // Plugin related functionality
  parseModuleUrl: () => ({}),
  VERSION: '4.40.0',
  watch: () => ({ 
    close: noop,
    on: noop,
    off: noop,
    emit: noop,
    add: noop,
    remove: noop
  }),
  defineConfig: config => config,
  
  // Add more common rollup methods
  normalizePath: path => path,
  createFilter: () => () => true,
  dataToEsm: data => `export default ${JSON.stringify(data)};`,
  
  // Plugin helpers
  pluginUtils: {
    createFilter: () => () => true,
    normalizePath: path => path,
    dataToEsm: data => `export default ${JSON.stringify(data)};`
  }
};

// Export all required methods and properties
module.exports = rollupMock;
// Also export as default for ES modules
module.exports.default = rollupMock;
