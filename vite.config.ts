
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@rollup/rollup-linux-x64-gnu': path.resolve(__dirname, './rollup-mock.js'),
      '@rollup/rollup-darwin-x64': path.resolve(__dirname, './rollup-mock.js'),
      '@rollup/rollup-darwin-arm64': path.resolve(__dirname, './rollup-mock.js'),
      '@rollup/rollup-linux-arm64-gnu': path.resolve(__dirname, './rollup-mock.js'),
      '@rollup/rollup-linux-arm64-musl': path.resolve(__dirname, './rollup-mock.js'),
      '@rollup/rollup-win32-x64-msvc': path.resolve(__dirname, './rollup-mock.js'),
      '@rollup/rollup-linux-x64-musl': path.resolve(__dirname, './rollup-mock.js'),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: [
      '@rollup/rollup-linux-x64-gnu',
      '@rollup/rollup-darwin-x64',
      '@rollup/rollup-darwin-arm64',
      '@rollup/rollup-linux-arm64-gnu',
      '@rollup/rollup-linux-arm64-musl',
      '@rollup/rollup-win32-x64-msvc',
      '@rollup/rollup-linux-x64-musl',
    ],
  },
}));
