
import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';
import path from "path";
import type { ConfigEnv, UserConfig, Plugin } from 'vite';

// Mock esbuild if it fails to load
let esbuild;
try {
  esbuild = require('esbuild');
} catch (e) {
  console.warn('Could not load esbuild directly, using mock implementation');
  esbuild = {
    version: '0.19.8',
    transform: () => ({ code: '', map: '' }),
    buildSync: () => ({ outputFiles: [] }),
    build: async () => ({ outputFiles: [] })
  };
}

// Try to load the componentTagger or use a no-op function
let componentTagger;
try {
  const lovableTagger = require('lovable-tagger');
  componentTagger = lovableTagger.componentTagger;
} catch (e) {
  console.warn('Could not load lovable-tagger, using no-op implementation');
  componentTagger = () => ({
    name: 'lovable-tagger-mock',
    transform: (code: string) => ({ code, map: null })
  });
}

// Define a custom plugin to handle rollup native module failures
function mockRollupNativePlugin(): Plugin {
  return {
    name: 'mock-rollup-native',
    configResolved(config: any) {
      // Run our fix-dependencies script early
      try {
        console.log('Running fix-dependencies script from vite config...');
        require('./fix-dependencies');
        
        // Also try to patch the rollup native module directly
        require('./install-rollup-patch');
      } catch (err) {
        console.warn('Could not run dependency scripts:', err);
      }
    }
  };
}

export default defineConfig(({ mode }: ConfigEnv): UserConfig => ({
  base: "./",
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      "db825216-e5a9-4398-a5a6-ae9c4daf4d9b.lovableproject.com"
    ]
  },

  plugins: [
    mockRollupNativePlugin(),
    react(),
    componentTagger()
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Mock platform-specific rollup dependencies with a single mock file
      "@rollup/rollup-win32-x64-msvc": path.resolve(__dirname, "./rollup-mock.js"),
      "@rollup/rollup-linux-x64-gnu": path.resolve(__dirname, "./rollup-mock.js"),
      "@rollup/rollup-darwin-x64": path.resolve(__dirname, "./rollup-mock.js"),
      "@rollup/rollup-darwin-arm64": path.resolve(__dirname, "./rollup-mock.js"),
      // Alias for esbuild
      "esbuild": path.resolve(__dirname, "node_modules/esbuild/lib/esbuild.js"),
    },
    dedupe: ['react', 'react-dom']
  },

  optimizeDeps: {
    exclude: [
      '@rollup/rollup-win32-x64-msvc',
      '@rollup/rollup-linux-x64-gnu',
      '@rollup/rollup-darwin-x64',
      '@rollup/rollup-darwin-arm64'
    ],
    esbuildOptions: {
      define: {
        'process.env.NODE_ENV': JSON.stringify(mode)
      }
    }
  },

  esbuild: {
    legalComments: 'none',
    minifyIdentifiers: false,
    minifySyntax: mode === 'production',
    minifyWhitespace: mode === 'production',
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: mode === 'development',
    minify: mode === 'production' ? 'esbuild' : false,
    target: 'es2015',
    
    rollupOptions: {
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
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-aspect-ratio'],
          supabase: ['@supabase/supabase-js'],
          forms: ['react-hook-form', '@hookform/resolvers'],
          utils: ['date-fns', 'clsx', 'tailwind-merge'],
          vendor: ['@tanstack/react-query', 'sonner', 'lucide-react']
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
}));
