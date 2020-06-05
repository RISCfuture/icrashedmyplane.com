import Survey, {
  Flag, FlagAction, Option, Question
} from '../../models/survey'

const profileSurvey = new Survey('profile',
  new Question('root', [
    new Option('largeMulti', new FlagAction(Flag.LARGE_MULTI)),
    new Option('airCarrier', new FlagAction(Flag.AIR_CARRIER)),
    new Option('helicopter', new FlagAction(Flag.HELICOPTER))
  ],
  { multi: true }))

export default profileSurvey
