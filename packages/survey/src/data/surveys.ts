import Survey from '../models/survey'
import profileSurvey from './surveys/profile'
import incidentSurvey from './surveys/incident'

/** A dictionary of all {@link Survey}s, keyed by their identifier. */

const surveys: {[key: string]: Survey} = {
  profile: profileSurvey,
  incident: incidentSurvey
}
export default surveys
