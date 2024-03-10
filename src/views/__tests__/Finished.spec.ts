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

    const heading = screen.getByRole('heading', {
      level: 1,
      name: 'Based on your answers, this qualifies as an accident .'
    })
    expect(heading).toBeTruthy()
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

    const heading = screen.getByRole('heading', {
      level: 1,
      name: 'Based on your answers, this qualifies as a serious incident .'
    })
    expect(heading).toBeTruthy()
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

    const heading = screen.getByRole('heading', {
      level: 1,
      name: 'Based on your answers, this qualifies as an incident .'
    })
    expect(heading).toBeTruthy()
  })
})
