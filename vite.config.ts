
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Add alias for our mock module
      '@rollup/rollup-linux-x64-gnu': path.resolve(__dirname, './src/rollup-mock.js'),
      '@rollup/rollup-darwin-x64': path.resolve(__dirname, './src/rollup-mock.js'),
      '@rollup/rollup-win32-x64-msvc': path.resolve(__dirname, './src/rollup-mock.js'),
    },
  },
  optimizeDeps: {
    exclude: ['@rollup/rollup-linux-x64-gnu', '@rollup/rollup-darwin-x64', '@rollup/rollup-win32-x64-msvc'],
  },
  build: {
    rollupOptions: {
      external: ['@rollup/rollup-linux-x64-gnu', '@rollup/rollup-darwin-x64', '@rollup/rollup-win32-x64-msvc'],
    }
  }
}));
