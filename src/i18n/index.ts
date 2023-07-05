import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from './strings/en'

Vue.use(VueI18n)

export default new VueI18n({
  locale: window.navigator.language,
  fallbackLocale: 'en',
  messages: { en },
})
