import { LocaleMessages } from 'vue-i18n'
import survey from '@/i18n/strings/en/survey'

const en: LocaleMessages = {
  survey,

  error: {
    title: 'Sorry, an error occurred.',
    description: 'Please try refreshing the page. If that doesn’t work, I got nothin’.'
  },
  question: {
    checkAll: 'Check all that apply:',
    breadcrumbs: 'You selected {selection}.',
    nextButton: 'Next',
    regulation: '49 CFR § {part}'
  },
  welcome: {
    title: 'Help! I crashed my plane!',
    description: 'Oh no! I’m here to help you figure out if you have to notify the NTSB, and when.',
    startButton: 'Let’s get started',
    footer: 'This website was created by {me} during the COVID-19 shelter-in-place order of April 2020.'
  },
  level: {
    incident: {
      title: 'Based on your answers, this qualifies as an {level}.',
      level: 'incident',
      actions: 'You are not required to notify the NTSB or file an accident report.'
    },
    seriousIncident: {
      title: 'Based on your answers, this qualifies as a {level}.',
      level: 'serious incident',
      actions: '{notifyImmediately}, but you do not have to file an accident report.',
      notifyImmediately: 'You are required to notify the NTSB immediately'
    },
    accident: {
      title: 'Based on your answers, this qualifies as an {level}.',
      level: 'accident',
      actions: 'You are required to notify the NTSB immediately, and file an accident report.'
    },
    immediateNotification: {
      title: 'Immediate Notification',
      description: 'You must immediately notify the nearest NTSB regional office of this incident.',
      contact: 'Contact information for regional offices can be found at {URL}.'
        + ' You can also call the NTSB Response Operations Center at (844) 373-9922 or (202) 314-6290.',
      whatToInclude: 'You should reference 49 CFR § 830.6 for what to include in your notification.'
    },
    accidentReport: {
      title: 'Accident Report',
      description: 'You are required to make a report of this accident to the NTSB within 10 days'
        + ' after the accident.',
      form: 'You must fill out {form6120} or 6120.2 (OMB No. 3147-0001). Send the completed form to'
        + ' the applicable address shown in  the form description.',
      form6120: 'NTSB Form 6120.1'
    },
	disclaimer: 'Important disclaimer: This website should not be used as a source for legal advice.'
+ ' Consult an aviation attorney.'
  }
}
export default en
