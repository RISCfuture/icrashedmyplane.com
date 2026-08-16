import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
      vue(),
      command === 'serve' && vueDevTools({ launchEditor: process.env.VITE_LAUNCH_EDITOR }),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: false,
        // The generated registration snippet leaves its promise unhandled, so a
        // transient failure to fetch `sw.js` surfaces as an unhandled rejection.
        // `src/main.ts` registers the worker itself and handles that rejection.
        injectRegister: false,
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest,woff,woff2}'],
          // This site has no client-side router, so an unknown path is a real 404.
          // vite-plugin-pwa otherwise defaults this to index.html, which makes the
          // service worker answer every unknown path with the home page.
          navigateFallback: undefined,
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
        },
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      sourcemap: 'hidden',
    },
  }
})
