import { describe, expect, it, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { type QuestionnaireState } from '../../stores/questionnaire'
import { render, screen } from '@testing-library/vue'
import Finished from '../Finished.vue'
import i18n from '@/i18n'
import { accidentAnswer, incidentAnswer, seriousIncidentAnswer } from '@cypress/fixtures/answers'

describe('Finished', () => {
  it('renders an accident', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        questionnaire: {
          responses: {
            profile: {
              surveyIdentifier: 'profile',
              rootNode: { nodes: [] }
            },
            incident: {
              surveyIdentifier: 'incident',
              rootNode: accidentAnswer
            }
          },
          clickedContinue: true
        } as QuestionnaireState
      }
    })

    render(Finished, {
      global: {
        plugins: [i18n, pinia]
      }
    })

    expect(screen.getByTestId('accident')).toBeTruthy()
  })

  it('renders a serious incident', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        questionnaire: {
          responses: {
            profile: {
              surveyIdentifier: 'profile',
              rootNode: { nodes: [] }
            },
            incident: {
              surveyIdentifier: 'incident',
              rootNode: seriousIncidentAnswer
            }
          },
          clickedContinue: true
        } as QuestionnaireState
      }
    })

    render(Finished, {
      global: {
        plugins: [i18n, pinia]
      }
    })

    expect(screen.getByTestId('serious-incident')).toBeTruthy()
  })

  it('renders an incident', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        questionnaire: {
          responses: {
            profile: {
              surveyIdentifier: 'profile',
              rootNode: { nodes: [] }
            },
            incident: {
              surveyIdentifier: 'incident',
              rootNode: incidentAnswer
            }
          },
          clickedContinue: true
        } as QuestionnaireState
      }
    })

    render(Finished, {
      global: {
        plugins: [i18n, pinia]
      }
    })

    expect(screen.getByTestId('incident')).toBeTruthy()
  })
})
