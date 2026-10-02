/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENTRY_DSN: string
  readonly VITE_SENTRY_RELEASE: string
}

interface ServiceWorkerContainer {
  register(
    scriptURL: string | URL | TrustedScriptURL,
    options?: RegistrationOptions,
  ): Promise<ServiceWorkerRegistration>
}
