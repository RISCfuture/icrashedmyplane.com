import profileSurvey from './surveys/profile'
import incidentSurvey from './surveys/incident'

/** The order to present {@link Survey}s to the user. */

const surveyOrder = [profileSurvey.identifier, incidentSurvey.identifier]
export default surveyOrder
