import './assets/fonts/Quicksand-VariableFont_wght.ttf'

import 'normalize.css'
import './assets/styles/font-faces.scss'
import './assets/styles/global.scss'
import './assets/styles/transitions.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as Sentry from '@sentry/vue'
import i18n from '@/i18n'
import App from './App.vue'

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
})

const pinia = createPinia()
app.use(pinia)

app.use(i18n)

app.mount('#app')
