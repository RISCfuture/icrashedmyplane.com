import { expect } from 'chai'
import incidentSurvey from '@/data/surveys/incident'
import { QuestionAction } from '@/models/survey'
import { answerPathFromQuestionPath } from '@/models/response/prompt'

describe('answerPathFromQuestionPath', () => {
  it('returns the answer path for a question path', () => {
    const questionPath = [
      incidentSurvey.root,
      incidentSurvey.root.options[2],
      incidentSurvey.root.options[2].action,
      (incidentSurvey.root.options[2].action as QuestionAction).question,
      (incidentSurvey.root.options[2].action as QuestionAction).question.options[0]
    ]
    expect(answerPathFromQuestionPath(questionPath)).to.eql([2, 0])
  })
})
