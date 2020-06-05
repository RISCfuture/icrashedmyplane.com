import { expect } from 'chai'
import { QuestionAction } from 'i-just-crashed-my-plane-survey'
import incidentSurvey from '@/data/surveys/incident'
import { answerPathFromQuestionPath } from '@/models/response/prompt'

describe('answerPathFromQuestionPath', () => {
  it('returns the answer path for a question path', () => {
    const questionPath = [
      incidentSurvey.root,
      incidentSurvey.root.options[2],
      incidentSurvey.root.options[2].action,
      (<QuestionAction>incidentSurvey.root.options[2].action).question,
      (<QuestionAction>incidentSurvey.root.options[2].action).question.options[0]
    ]
    expect(answerPathFromQuestionPath(questionPath)).to.eql([2, 0])
  })
})
