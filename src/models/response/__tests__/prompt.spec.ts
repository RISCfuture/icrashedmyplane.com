import { describe, expect, it } from 'vitest'
import incidentSurvey from '@/data/surveys/incident'
import { type QuestionAction } from '@/models/survey'
import { answerPathFromQuestionPath } from '../prompt'

describe('answerPathFromQuestionPath', () => {
  it('returns the answer path for a question path', () => {
    const questionPath = [
      incidentSurvey.root,
      incidentSurvey.root.options[2],
      incidentSurvey.root.options[2].action,
      (incidentSurvey.root.options[2].action as QuestionAction).question,
      (incidentSurvey.root.options[2].action as QuestionAction).question.options[0]
    ]
    expect(answerPathFromQuestionPath(questionPath)).toEqual([2, 0])
  })
})
