// A tab may spend one reload per cooldown recovering a failed chunk. Beyond that, an asset that
// is genuinely unreachable would put the tab in a refresh loop.
const RELOAD_KEY = 'preload-error-reload'
const RELOAD_COOLDOWN_MS = 10 * 60 * 1000

/**
 * Reloads the page when a lazily-loaded chunk can't be fetched.
 *
 * Vite's preload helper rejects when a code-split chunk or its stylesheet fails to load — a
 * dropped request, or a tab whose `index.html` predates the current deploy and so asks for asset
 * hashes that no longer exist. Nothing downstream recovers on its own, so the reload fetches a
 * fresh `index.html` and with it the current hashes.
 *
 * Reloads are limited to one per cooldown: a deploy that really is broken surfaces the failure to
 * error reporting rather than refreshing forever, while a tab left open across several deploys
 * still heals each time.
 */
export function recoverFromPreloadErrors(): void {
  window.addEventListener('vite:preloadError', reloadOnce)
}

function reloadOnce(event: VitePreloadErrorEvent): void {
  if (!claimReload()) return

  // Suppresses Vite's rethrow: the reload is the recovery, so the rejection isn't worth
  // reporting. A failure that can't claim a reload stays unprevented and reaches Sentry.
  event.preventDefault()
  window.location.reload()
}

function claimReload(): boolean {
  try {
    const lastReload = Number(window.sessionStorage.getItem(RELOAD_KEY) ?? 0)
    if (Number.isFinite(lastReload) && Date.now() - lastReload < RELOAD_COOLDOWN_MS) return false

    window.sessionStorage.setItem(RELOAD_KEY, String(Date.now()))
    return true
  } catch {
    // sessionStorage may be unavailable (private mode, etc.). With nowhere to record the attempt
    // a reload could loop, so decline it.
    return false
  }
}
