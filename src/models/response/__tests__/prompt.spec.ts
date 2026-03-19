import { describe, expect, it } from 'vitest'
import incidentSurvey from '@/data/surveys/incident'
import { isQuestionAction } from '@/models/survey'
import { answerPathFromQuestionPath } from '../prompt'

describe('answerPathFromQuestionPath', () => {
  it('returns the answer path for a question path', () => {
    const action = incidentSurvey.root.options[2]?.action
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- defensive runtime check
    if (!action || !isQuestionAction(action)) {
      throw new Error('Expected question action')
    }
    const option = action.question.options[0]
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- defensive runtime check
    if (!option) {
      throw new Error('Expected option')
    }
    const optionEntry = incidentSurvey.root.options[2]
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- defensive runtime check
    if (!optionEntry) {
      throw new Error('Expected option entry')
    }
    const questionPath = [incidentSurvey.root, optionEntry, action, action.question, option]
    expect(answerPathFromQuestionPath(questionPath)).toEqual([2, 0])
  })
})
