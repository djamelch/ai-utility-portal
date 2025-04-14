
// This plugin will mock platform-specific Rollup dependencies
import type { Plugin } from 'vite';

export default function rollupMockPlugin(): Plugin {
  return {
    name: 'rollup-mock-plugin',
    resolveId(id: string) {
      // Intercept platform-specific Rollup modules
      if (id.startsWith('@rollup/rollup-linux') || 
          id.startsWith('@rollup/rollup-darwin') || 
          id.startsWith('@rollup/rollup-win32')) {
        // Return a virtual module path
        return `\0virtual:${id}`;
      }
      return null;
    },
    load(id: string) {
      // Provide a mock implementation for virtual modules
      if (id.startsWith('\0virtual:@rollup/rollup-')) {
        console.log(`Mocking Rollup platform-specific module: ${id}`);
        // Return an empty module
        return 'export default {}';
      }
      return null;
    }
  };
}
