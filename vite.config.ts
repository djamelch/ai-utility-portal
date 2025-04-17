import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // إعدادات السيرفر لتطوير محلي فقط
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      "db825216-e5a9-4398-a5a6-ae9c4daf4d9b.lovableproject.com"
    ]
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
  build: {
    // 🔧 مهم للنشر على Cloudflare Workers أو Pages
    base: "./",
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: [
        '@rollup/rollup-linux-x64-gnu',
        '@rollup/rollup-darwin-x64',
        '@rollup/rollup-darwin-arm64',
        '@rollup/rollup-linux-arm64-gnu',
        '@rollup/rollup-linux-arm64-musl',
        '@rollup/rollup-win32-x64-msvc',
        '@rollup/rollup-linux-x64-musl',
      ],
      output: {
        // تحسين تقسيم الحزم
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-popover']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
}));
