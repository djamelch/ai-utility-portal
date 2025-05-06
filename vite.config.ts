
import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { ConfigEnv, UserConfig } from 'vite';

export default defineConfig(({ mode }: ConfigEnv): UserConfig => ({
  base: "./", // Move base to the top level of the configuration
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      "db825216-e5a9-4398-a5a6-ae9c4daf4d9b.lovableproject.com"
    ]
  },

  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Mock platform-specific rollup dependencies
      "@rollup/rollup-win32-x64-msvc": path.resolve(__dirname, "./rollup-mock.js"),
      "@rollup/rollup-linux-x64-gnu": path.resolve(__dirname, "./rollup-mock.js"),
      "@rollup/rollup-darwin-x64": path.resolve(__dirname, "./rollup-mock.js"),
      "@rollup/rollup-darwin-arm64": path.resolve(__dirname, "./rollup-mock.js"),
    },
  },

  optimizeDeps: {
    // Exclude platform-specific rollup dependencies
    exclude: [
      '@rollup/rollup-win32-x64-msvc',
      '@rollup/rollup-linux-x64-gnu',
      '@rollup/rollup-darwin-x64',
      '@rollup/rollup-darwin-arm64'
    ],
    // Force inclusion of esbuild
    include: ['esbuild'],
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: mode === 'development',
    
    // Using esbuild minifier
    minify: 'esbuild',
    
    // Configure esbuild minification options
    target: 'es2015',
    
    rollupOptions: {
      // Explicitly exclude platform-specific rollup packages
      external: [
        '@rollup/rollup-win32-x64-msvc',
        '@rollup/rollup-linux-x64-gnu',
        '@rollup/rollup-darwin-x64',
        '@rollup/rollup-darwin-arm64'
      ],
      
      output: {
        manualChunks: {
          // Optimizing bundle chunks
          react: ['react', 'react-dom', 'react-router-dom'],
          radix: ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-aspect-ratio',
                 '@radix-ui/react-avatar', '@radix-ui/react-checkbox', '@radix-ui/react-collapsible'],
          supabase: ['@supabase/supabase-js'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          utils: ['date-fns', 'clsx', 'tailwind-merge'],
          vendor: ['@tanstack/react-query', 'sonner', 'lucide-react']
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    
    chunkSizeWarningLimit: 1000,
  }
}));
