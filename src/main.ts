import './assets/fonts/Quicksand-VariableFont_wght.ttf'

import 'normalize.css'
import './assets/styles/font-faces.scss'
import './assets/styles/global.scss'
import './assets/styles/transitions.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as Sentry from '@sentry/vue'
import { createSentryPiniaPlugin } from '@sentry/vue'
import i18n from '@/i18n'
import App from './App.vue'

const app = createApp(App)

const sentryDSN = import.meta.env.VITE_SENTRY_DSN
Sentry.init({
  app,
  dsn: sentryDSN,
  sendDefaultPii: true,
  integrations: [
    Sentry.vueIntegration({
      tracingOptions: {
        trackComponents: true
      }
    }),
    Sentry.replayIntegration()
  ],
  tracesSampleRate: 1.0,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
})

const pinia = createPinia()
pinia.use(createSentryPiniaPlugin())
app.use(pinia)

app.use(i18n)

app.mount('#app')
