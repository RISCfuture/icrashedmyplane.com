import { describe, expect, it, vi } from 'vitest'
import MultiQuestion from '../MultiQuestion.vue'
import i18n from '@/i18n'
import { render, screen } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'
import { endNode } from '@/models/response/answer'
import { type QuestionnaireState } from '@/stores/questionnaire'
import incidentSurvey from '@/data/surveys/incident'

describe('MultiQuestion', () => {
  it('renders a question', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        questionnaire: {
          responses: {
            incident: { rootNode: endNode, surveyIdentifier: 'incident' },
            profile: { rootNode: { nodes: [] }, surveyIdentifier: 'profile' }
          },
          clickedContinue: true
        } as QuestionnaireState
      }
    })

    render(MultiQuestion, {
      global: {
        plugins: [i18n, pinia]
      },
      props: {
        prompt: {
          surveyID: 'incident',
          answerPath: [],
          question: incidentSurvey.root,
          questionPath: []
        }
      }
    })

    expect(
      screen.queryAllByTestId('option-category').map((el) => el.firstChild!.textContent)
    ).toEqual([
      'Injuries to Crew or Passengers',
      'Damage to Your Aircraft',
      'Aircraft Systems Failures',
      'Involving Other Aircraft',
      'uncategorized'
    ])
  })
})
