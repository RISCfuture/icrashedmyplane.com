import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(async ({ command }) => {
  let cspPlugin: unknown = null
  if (command === 'build') {
    try {
      const { default: csp } = await import('vite-plugin-csp-guard')
      cspPlugin = csp({
        dev: { run: false },
        build: { sri: false },
        policy: {
          'default-src': ["'self'"],
          'script-src': ["'self'"],
          'style-src': ["'self'"],
          'style-src-attr': ["'unsafe-inline'"],
          'img-src': ["'self'", 'data:', 'blob:'],
          'font-src': ["'self'"],
          'connect-src': ["'self'", 'https://*.ingest.sentry.io', 'https://*.sentry.io'],
          'worker-src': ["'self'", 'blob:'],
          'child-src': ["'self'", 'blob:'],
          'object-src': ["'none'"],
          'base-uri': ["'self'"],
          'form-action': ["'self'"],
        },
      })
    } catch {
      // Ignore: static analysis tools (e.g. knip) may run this config under a
      // loader that can't resolve the plugin's strict ESM exports. The plugin
      // is only required for `vite build`, which Vite itself can resolve.
    }
  }

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins: [vue(), vueDevTools({ launchEditor: 'rubymine' }), cspPlugin as any].filter(Boolean),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      sourcemap: true,
    },
  }
})
