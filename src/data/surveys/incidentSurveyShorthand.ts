import {
  IncidentLevel,
  makeLevelAction,
  makeOption,
  makeQuestionAction,
  type Option,
  type Question
} from '@/models/survey'

export const classifyAsAccident = makeLevelAction(IncidentLevel.ACCIDENT)
export const classifyAsSeriousIncident = makeLevelAction(IncidentLevel.SERIOUS_INCIDENT)
export const classifyAsIncident = makeLevelAction(IncidentLevel.INCIDENT)

export function yesAskQuestion(question: Question): Option {
  return makeOption('yes', makeQuestionAction(question))
}

export function noAskQuestion(question: Question): Option {
  return makeOption('no', makeQuestionAction(question))
}

export const yesMeansIncident = makeOption('yes', classifyAsIncident)
export const noMeansIncident = makeOption('no', classifyAsIncident)
export const yesMeansAccident = makeOption('yes', classifyAsAccident)
export const yesMeansSeriousIncident = makeOption('yes', classifyAsSeriousIncident)
export const noMeansAccident = makeOption('no', classifyAsAccident)
export const noMeansSeriousIncident = makeOption('no', classifyAsSeriousIncident)

export const yesMeansAccidentNoMeansIncident: Option[] = [yesMeansAccident, noMeansIncident]

export const yesMeansSeriousIncidentNoMeansIncident: Option[] = [
  yesMeansSeriousIncident,
  noMeansIncident
]

export const noMeansAccidentYesMeansIncident: Option[] = [yesMeansIncident, noMeansAccident]

export const noMeansSeriousIncidentYesMeansIncident: Option[] = [
  yesMeansIncident,
  noMeansSeriousIncident
]
