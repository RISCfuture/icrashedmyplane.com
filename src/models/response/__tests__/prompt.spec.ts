import { describe, expect, it } from 'vitest'
import incidentSurvey from '@/data/surveys/incident'
import { type QuestionAction, isQuestionAction } from '@/models/survey'
import { answerPathFromQuestionPath } from '../prompt'

describe('answerPathFromQuestionPath', () => {
  it('returns the answer path for a question path', () => {
    const action = incidentSurvey.root.options[2]?.action
    if (!action || !isQuestionAction(action)) {
      throw new Error('Expected question action')
    }
    const questionAction = action as QuestionAction
    const option = questionAction.question.options[0]
    if (!option) {
      throw new Error('Expected option')
    }
    const optionEntry = incidentSurvey.root.options[2]
    if (!optionEntry) {
      throw new Error('Expected option entry')
    }
    const questionPath = [incidentSurvey.root, optionEntry, action, questionAction.question, option]
    expect(answerPathFromQuestionPath(questionPath)).toEqual([2, 0])
  })
})
