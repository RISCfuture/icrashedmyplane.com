import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import Container from '../Container.vue'
import i18n from '@/i18n'
import { createTestingPinia } from '@pinia/testing'
import { type QuestionnaireState } from '@/stores/questionnaire'
import { accidentAnswer } from '@cypress/fixtures/answers'

describe('Container', () => {
  it('renders the welcome page', () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        questionnaire: {
          responses: {},
          clickedContinue: false
        } as QuestionnaireState
      }
    })

    render(Container, {
      global: {
        plugins: [i18n, pinia]
      }
    })

    expect(screen.getByText('Help! I crashed my plane!')).toBeTruthy()
  })

  it('renders the question page', () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        questionnaire: {
          responses: {},
          clickedContinue: true
        } as QuestionnaireState
      }
    })

    render(Container, {
      global: {
        plugins: [i18n, pinia]
      }
    })

    expect(screen.getByText('Which of these apply at the time of the incident?')).toBeTruthy()
  })

  it('renders the finished page', () => {
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

    render(Container, {
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
})
