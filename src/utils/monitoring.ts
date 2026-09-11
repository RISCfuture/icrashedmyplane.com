import { init, logger, vueIntegration } from '@sentry/vue'
import type { App } from 'vue'

/**
 * Starts crash and performance reporting for a mounted application.
 *
 * Users answer questions about their own aircraft accident here, and the site publishes no
 * privacy policy. Session Replay, `sendDefaultPii` and the Pinia state plugin would each forward
 * those answers to a third party, so none of them are enabled: crash reports carry stack traces
 * only.
 *
 * @param app The application to report errors for.
 */
export function startErrorMonitoring(app: App): void {
  const sentryDSN = import.meta.env.VITE_SENTRY_DSN as string | undefined

  init({
    app,
    dsn: sentryDSN,
    release: import.meta.env.VITE_SENTRY_RELEASE || undefined,
    environment: import.meta.env.PROD ? 'production' : 'development',
    sendDefaultPii: false,
    integrations: [
      vueIntegration({
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
}

/**
 * Records something that went wrong without breaking the questionnaire.
 *
 * @param message What happened.
 * @param context Structured detail to attach to the entry.
 */
export function reportWarning(message: string, context: Record<string, string>): void {
  logger.warn(message, context)
}
