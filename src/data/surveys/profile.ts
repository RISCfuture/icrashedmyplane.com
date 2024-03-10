import { Flag, makeFlagAction, makeOption, makeQuestion, type Survey } from '@/models/survey'

const profileSurvey: Survey = {
  identifier: 'profile',
  root: makeQuestion(
    'root',
    [
      makeOption('largeMulti', makeFlagAction(Flag.LARGE_MULTI)),
      makeOption('airCarrier', makeFlagAction(Flag.AIR_CARRIER)),
      makeOption('helicopter', makeFlagAction(Flag.HELICOPTER))
    ],
    { multi: true }
  )
}

export default profileSurvey
