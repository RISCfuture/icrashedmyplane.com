import { LocaleMessageObject } from 'vue-i18n'

const profile: LocaleMessageObject = {
  questions: {
    root: 'Which of these apply at the time of the incident?'
  },
  options: {
    airCarrier: 'I was engaged in air carrier operations (Part 119)',
    helicopter: 'I was flying a helicopter',
    largeMulti: 'I was flying a multi-engine aircraft with certified MTOW > 12,500 lbs.'
  }
}
export default profile
