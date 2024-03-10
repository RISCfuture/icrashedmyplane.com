import bugsnagVue from '@/config/bugsnag'

import './assets/fonts/Quicksand-VariableFont_wght.ttf'

import 'normalize.css'
import './assets/styles/font-faces.scss'
import './assets/styles/global.scss'
import './assets/styles/transitions.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import i18n from '@/i18n'
import App from './App.vue'

const app = createApp(App)

app.use(i18n)
app.use(createPinia())
if (bugsnagVue) app.use(bugsnagVue)

app.mount('#app')
