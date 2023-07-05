import {
  IncidentLevel, LevelAction, Option, Question, QuestionAction,
} from '@/models/survey'

export const classifyAsAccident = new LevelAction(IncidentLevel.ACCIDENT)
export const classifyAsSeriousIncident = new LevelAction(IncidentLevel.SERIOUS_INCIDENT)
export const classifyAsIncident = new LevelAction(IncidentLevel.INCIDENT)

export function yesAskQuestion(question: Question): Option {
  return new Option('yes', new QuestionAction(question))
}

export function noAskQuestion(question: Question): Option {
  return new Option('no', new QuestionAction(question))
}

export const yesMeansIncident = new Option('yes', classifyAsIncident)
export const noMeansIncident = new Option('no', classifyAsIncident)
export const yesMeansAccident = new Option('yes', classifyAsAccident)
export const yesMeansSeriousIncident = new Option('yes', classifyAsSeriousIncident)
export const noMeansAccident = new Option('no', classifyAsAccident)
export const noMeansSeriousIncident = new Option('no', classifyAsSeriousIncident)

export const yesMeansAccidentNoMeansIncident: Option[] = [
  yesMeansAccident,
  noMeansIncident,
]

export const yesMeansSeriousIncidentNoMeansIncident: Option[] = [
  yesMeansSeriousIncident,
  noMeansIncident,
]

export const noMeansAccidentYesMeansIncident: Option[] = [
  yesMeansIncident,
  noMeansAccident,
]

export const noMeansSeriousIncidentYesMeansIncident: Option[] = [
  yesMeansIncident,
  noMeansSeriousIncident,
]
