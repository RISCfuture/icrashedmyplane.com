import './assets/fonts/Quicksand-VariableFont_wght.ttf'

import 'normalize.css'
import './assets/styles/font-faces.scss'
import './assets/styles/global.scss'
import './assets/styles/transitions.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as Sentry from '@sentry/vue'
import i18n from '@/i18n'
import { recoverFromPreloadErrors } from '@/utils/preloadRecovery'
import App from './App.vue'

recoverFromPreloadErrors()

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- .vue default export is untyped
const app = createApp(App)

// Users answer questions about their own aircraft accident here, and the site
// publishes no privacy policy. Session Replay, `sendDefaultPii` and the Pinia
// state plugin would each forward those answers to a third party, so none of
// them are enabled: crash reports carry stack traces only.
const sentryDSN = import.meta.env.VITE_SENTRY_DSN as string | undefined
Sentry.init({
  app,
  dsn: sentryDSN,
  release: import.meta.env.VITE_SENTRY_RELEASE || undefined,
  environment: import.meta.env.PROD ? 'production' : 'development',
  sendDefaultPii: false,
  integrations: [
    Sentry.vueIntegration({
      tracingOptions: {
        trackComponents: true,
      },
    }),
  ],
  tracesSampleRate: 1.0,
  enableLogs: true,
  ignoreErrors: [
    // Browser-extension content scripts inject WebExtension messaging into
    // the page; their failures are not our code and are unfixable here.
    // Sentry TIM-DOT-CODES-6.
    /runtime\.sendMessage/u,
    // vite-plugin-pwa's injected SW registration throws InvalidStateError
    // when Chrome registers during prerender. No elegant in-plugin or
    // newer-version fix exists, so we filter the noise. Sentry
    // TIM-DOT-CODES-5.
    /Failed to register a ServiceWorker/u,
    // Native in-app browsers (WKWebView wrappers) inject a bridge script that
    // calls `window.webkit.messageHandlers`; it throws when that handler is
    // absent. Not our code and unfixable here. Sentry TIM-DOT-CODES-8.
    /messageHandlers/u,
    // Android WebView tears down its JS bridge mid-post, so a `postMessage`
    // from the injected bridge rejects with "Java object is gone". Not our
    // code and unfixable here. Sentry RACCOONBETS-FRONTEND-D.
    /Java object is gone/u,
    // Microsoft's Outlook SafeLinks crawler rejects a promise from its own
    // injected instrumentation while previewing a link. It arrives without a
    // stacktrace from an Azure address, never from a visitor. Sentry
    // TIM-DOT-CODES-C.
    /Object Not Found Matching Id/u,
  ],
})

/**
 * Installs the Workbox service worker that backs offline use.
 *
 * A failed registration costs offline caching and nothing else, so the
 * rejection is logged rather than left to surface as an unhandled error.
 */
function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    const swURL = `${import.meta.env.BASE_URL}sw.js`
    navigator.serviceWorker
      .register(swURL, { scope: import.meta.env.BASE_URL })
      .catch((error: unknown) => {
        Sentry.logger.warn('Service worker registration failed', {
          reason: error instanceof Error ? error.message : String(error),
        })
      })
  })
}

const pinia = createPinia()
app.use(pinia)

app.use(i18n)

app.mount('#app')

// Only a production build emits `sw.js`.
if (import.meta.env.PROD) registerServiceWorker()
