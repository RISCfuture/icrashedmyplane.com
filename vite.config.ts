import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vueI18n from '@intlify/unplugin-vue-i18n/vite'
import { VitePWA } from 'vite-plugin-pwa'

const fontFileName = /Quicksand-.*\.woff2$/u

/**
 * Injects a `<link rel="preload">` for the Quicksand font into the built `index.html`.
 *
 * `global.scss` applies Quicksand to every element, so it is the font first-paint text settles
 * into, yet the browser only discovers it after fetching and parsing the stylesheet. The built
 * filename is content-hashed, so the link is read out of the bundle rather than hand-written.
 */
function preloadFont(): Plugin {
  let base = '/'

  return {
    name: 'preload-font',
    apply: 'build',

    configResolved(config) {
      base = config.base
    },

    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const fileName = Object.keys(ctx.bundle ?? {}).find((name) => fontFileName.test(name))
        if (!fileName) return

        return [
          {
            tag: 'link',
            attrs: {
              rel: 'preload',
              as: 'font',
              type: 'font/woff2',
              href: `${base}${fileName}`,
              crossorigin: true,
            },
            injectTo: 'head-prepend',
          },
        ]
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
      vue(),
      command === 'serve' && vueDevTools({ launchEditor: process.env.VITE_LAUNCH_EDITOR }),
      // The locale messages are a fixed, single-locale JSON resource, so they are compiled here
      // rather than shipping vue-i18n's message compiler to every visitor.
      vueI18n({ include: [fileURLToPath(new URL('./src/i18n/strings/**', import.meta.url))] }),
      preloadFont(),
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
      rollupOptions: {
        output: {
          // The framework changes on its own release cadence and the questionnaire changes on
          // mine, so they cache separately. Sentry keeps the chunk it already loads into.
          manualChunks(id: string) {
            if (id.includes('/node_modules/@sentry/')) return 'sentry'
            if (/\/node_modules\/(?:@intlify|@vue|pinia|vue|vue-i18n)\//u.test(id)) return 'vendor'
            return undefined
          },
        },
      },
    },
  }
})
