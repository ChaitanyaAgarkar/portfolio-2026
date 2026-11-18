import path from 'node:path';
import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import Sitemap from 'vite-plugin-sitemap';
import { visualizer } from 'rollup-plugin-visualizer';

const SITE_URL =
  process.env.VITE_SITE_URL || 'https://agarkar-chaieeetanyas-portfolio-2026.vercel.app';

const PRERENDER_ROUTES = [
  '/about',
  '/work',
  '/experience',
  '/skills',
  '/coding',
  '/contact',
  '/projects',
  '/projects/chatttt',
  '/projects/lingo',
  '/projects/docs',
  '/projects/flight-predictor',
  '/projects/editum-ide',
  '/projects/ecommerce-platform',
];

export default defineConfig(({ mode, isSsrBuild }) => {
  const plugins: PluginOption[] = [react(), tailwindcss()];

  if (!isSsrBuild && mode === 'production') {
    plugins.push(
      Sitemap({
        hostname: SITE_URL,
        dynamicRoutes: PRERENDER_ROUTES,
        readable: true,
        robots: [
          {
            userAgent: '*',
            allow: '/',
          },
        ],
      }),
    );
  }

  if (mode === 'analyze') {
    plugins.push(
      visualizer({
        filename: 'dist/bundle-stats.html',
        gzipSize: true,
        brotliSize: true,
      }),
    );
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    build: {
      target: 'es2022',
      chunkSizeWarningLimit: 700,
      sourcemap: mode === 'analyze',
      rollupOptions: isSsrBuild
        ? undefined
        : {
            output: {
              manualChunks(id) {
                if (!id.includes('node_modules')) return undefined;
                if (id.includes('node_modules/three/')) {
                  return 'three-core';
                }
                if (id.includes('@dimforge/rapier')) {
                  return 'rapier-physics';
                }
                if (id.includes('@react-three') || id.includes('three-stdlib')) {
                  return 'r3f-vendor';
                }
                if (id.includes('recharts') || id.includes('d3-')) {
                  return 'charts-vendor';
                }
                if (id.includes('gsap') || id.includes('lenis')) {
                  return 'motion-gsap';
                }
                if (id.includes('framer-motion')) {
                  return 'motion-ui';
                }
                if (
                  id.includes('@radix-ui') ||
                  id.includes('cmdk') ||
                  id.includes('sonner') ||
                  id.includes('lucide-react')
                ) {
                  return 'ui-vendor';
                }
                if (
                  id.includes('@tanstack/react-query') ||
                  id.includes('react-hook-form') ||
                  id.includes('@hookform/resolvers') ||
                  id.includes('zod')
                ) {
                  return 'data-vendor';
                }
                if (
                  id.includes('node_modules/react/') ||
                  id.includes('node_modules/react-dom/') ||
                  id.includes('node_modules/react-router')
                ) {
                  return 'react-vendor';
                }
                return undefined;
              },
            },
          },
    },
  };
});
