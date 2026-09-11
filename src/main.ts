import './assets/fonts/Quicksand-VariableFont_wght.woff2'

import 'normalize.css'
import './assets/styles/font-faces.scss'
import './assets/styles/global.scss'
import './assets/styles/transitions.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import i18n from '@/i18n'
import { recoverFromPreloadErrors } from '@/utils/preloadRecovery'
import App from './App.vue'

recoverFromPreloadErrors()

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- .vue default export is untyped
const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

app.use(i18n)

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
      .catch(reportRegistrationFailure)
  })
}

/**
 * Records a service worker registration that didn't succeed.
 *
 * @param error Why the registration failed.
 */
async function reportRegistrationFailure(error: unknown): Promise<void> {
  const { reportWarning } = await import('@/utils/monitoring')
  reportWarning('Service worker registration failed', {
    reason: error instanceof Error ? error.message : String(error),
  })
}

app.mount('#app')

// Registered before error monitoring is awaited so that offline caching doesn't depend on a
// chunk arriving. Only a production build emits `sw.js`.
if (import.meta.env.PROD) registerServiceWorker()

// Sentry is over a quarter of the JavaScript this site ships and none of it is needed to answer
// the first question, so it loads in its own chunk once the questionnaire is interactive. The
// tradeoff is that a failure thrown before that chunk arrives goes unreported.
const { startErrorMonitoring } = await import('@/utils/monitoring')
startErrorMonitoring(app)
