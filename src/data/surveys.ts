import Survey from '@/models/survey'
import profileSurvey from '@/data/surveys/profile'
import incidentSurvey from '@/data/surveys/incident'

/** A dictionary of all {@link Survey}s, keyed by their identifier. */

const surveys: Record<string, Survey> = {
  profile: profileSurvey,
  incident: incidentSurvey,
}
export default surveys
