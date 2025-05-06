
// This is a mock module for platform-specific Rollup dependencies
console.log('Using rollup mock for platform-specific dependencies');

// Create a mock that provides the minimum functionality needed
module.exports = {
  createBundle: () => {
    return {
      generate: async () => ({})
    };
  },
  rollup: async () => {
    return {
      generate: async () => ({}),
      write: async () => ({})
    };
  },
  // Export a default object with all the methods that might be needed
  default: {
    rollup: async () => ({
      generate: async () => ({}),
      write: async () => ({})
    })
  }
};
