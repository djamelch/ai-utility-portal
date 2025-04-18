
import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { ConfigEnv, UserConfig } from 'vite';

export default defineConfig(({ mode }: ConfigEnv): UserConfig => ({
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
      // Using a string key instead of RegExp for rollup mock
      "@rollup/rollup-": path.resolve(__dirname, "./rollup-mock.js"),
    },
  },

  optimizeDeps: {
    exclude: Object.keys(require('./package.json').dependencies)
      .filter(dep => dep.startsWith('@rollup/rollup-')),
  },

  build: {
    base: "./",
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: mode === 'development', // Source maps only for development
    
    rollupOptions: {
      external: Object.keys(require('./package.json').dependencies)
        .filter(dep => dep.startsWith('@rollup/rollup-')),
      
      output: {
        manualChunks: {
          // Optimizing bundle chunks to reduce bundle size
          react: ['react', 'react-dom', 'react-router-dom'],
          radix: ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-aspect-ratio', 
                  '@radix-ui/react-avatar', '@radix-ui/react-checkbox', '@radix-ui/react-collapsible',
                  '@radix-ui/react-context-menu', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu',
                  '@radix-ui/react-hover-card', '@radix-ui/react-label', '@radix-ui/react-menubar',
                  '@radix-ui/react-navigation-menu', '@radix-ui/react-popover', '@radix-ui/react-progress',
                  '@radix-ui/react-radio-group', '@radix-ui/react-scroll-area', '@radix-ui/react-select',
                  '@radix-ui/react-separator', '@radix-ui/react-slider', '@radix-ui/react-slot',
                  '@radix-ui/react-switch', '@radix-ui/react-tabs', '@radix-ui/react-toast',
                  '@radix-ui/react-toggle', '@radix-ui/react-toggle-group', '@radix-ui/react-tooltip'],
          supabase: ['@supabase/supabase-js'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          utils: ['date-fns', 'clsx', 'tailwind-merge'],
          vendor: ['@tanstack/react-query', 'sonner', 'lucide-react']
        },
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`
      }
    },
    
    // Increased limit with optimized chunk splitting
    chunkSizeWarningLimit: 1500,
    minify: mode === 'production' ? 'terser' : false,
  }
}));
