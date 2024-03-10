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

    expect(screen.findByText('Injuries to Crew or Passengers')).toBeTruthy()
    expect(screen.findByText('Damage to Your Aircraft')).toBeTruthy()
    expect(screen.findByText('Aircraft Systems Failures')).toBeTruthy()
    expect(screen.findByText('Involving Other Aircraft')).toBeTruthy()
    expect(screen.findByText('uncategorized')).toBeTruthy()
  })
})
