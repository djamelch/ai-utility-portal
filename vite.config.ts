
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import rollupMockPlugin from "./src/rollup-mock-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // Add our mock plugin to handle platform-specific Rollup modules
    rollupMockPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Add alias for problematic Rollup modules
      '@rollup/rollup-linux-x64-gnu': path.resolve(__dirname, './src/rollup-mock-plugin.ts'),
      '@rollup/rollup-darwin-x64': path.resolve(__dirname, './src/rollup-mock-plugin.ts'),
      '@rollup/rollup-win32-x64-msvc': path.resolve(__dirname, './src/rollup-mock-plugin.ts'),
    },
  },
  // Configure build options to handle Rollup platform-specific dependencies
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      // Explicitly exclude all platform-specific Rollup modules
      external: [
        /^@rollup\/rollup-linux-.*/, 
        /^@rollup\/rollup-darwin-.*/, 
        /^@rollup\/rollup-win32-.*/
      ],
      onwarn(warning, warn) {
        // Ignore certain warnings
        if (warning.code === 'MODULE_NOT_FOUND' && 
            /rollup-(linux|darwin|win32)/.test(warning.message)) {
          return;
        }
        warn(warning);
      },
    },
  },
  optimizeDeps: {
    // Skip optional dependencies that might cause issues
    exclude: [
      '@rollup/rollup-linux-x64-gnu', 
      '@rollup/rollup-darwin-x64', 
      '@rollup/rollup-win32-x64-msvc'
    ],
    esbuildOptions: {
      // Set platform to neutral to avoid platform-specific dependencies
      platform: 'neutral',
    },
  },
}));
