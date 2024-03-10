import { createI18n } from 'vue-i18n'

import en from './strings/en'

export default createI18n({
  locale: window.navigator.language,
  fallbackLocale: 'en',
  silentFallbackWarn: true,
  messages: { en },
  legacy: false
})
