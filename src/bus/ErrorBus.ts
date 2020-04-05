import Vue from 'vue'

/**
 * This bus is used to emit error events (usually from the store, but errors can be emitted from
 * anywhere) up to the root-level component, so that the error page can be displayed.
 */

const ErrorBus = new Vue()
export default ErrorBus
