import Vue from 'vue'
import Bugsnag, { Plugin } from '@bugsnag/js'
import BugsnagPluginVue from '@bugsnag/plugin-vue'

Bugsnag.start({
  apiKey: '0c0bde4b2aaa0022601634717c4148d5',
  plugins: [<Plugin> new BugsnagPluginVue()],
  enabledReleaseStages: ['production']
})

// eslint-disable-next-line no-unused-expressions
Bugsnag.getPlugin('vue')?.installVueErrorHandler(Vue)
