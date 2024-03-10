import Bugsnag, { type Plugin } from '@bugsnag/js'
import BugsnagPluginVue from '@bugsnag/plugin-vue'
import BugsnagPerformance from '@bugsnag/browser-performance'

Bugsnag.start({
  apiKey: '0c0bde4b2aaa0022601634717c4148d5',
  plugins: [new BugsnagPluginVue() as Plugin],
  releaseStage: import.meta.env.MODE,
  enabledReleaseStages: ['production']
})
BugsnagPerformance.start('0c0bde4b2aaa0022601634717c4148d5')

const bugsnagVue = Bugsnag.getPlugin('vue')
export default bugsnagVue
