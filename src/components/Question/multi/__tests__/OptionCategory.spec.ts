import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import OptionCategory from '../OptionCategory.vue'
import i18n from '@/i18n'
import profileSurvey from '@/data/surveys/profile'

describe('OptionCategory', () => {
  it('renders', () => {
    render(OptionCategory, {
      global: {
        plugins: [i18n]
      },
      props: {
        surveyId: 'profile',
        category: null,
        options: profileSurvey.root.options,
        selections: new Set<string>()
      }
    })

    expect(
      screen.findByText('I was flying a multi-engine aircraft with certified MTOW > 12,500 lbs.')
    ).toBeTruthy()
    expect(screen.findByText('I was engaged in air carrier operations (Part 119)')).toBeTruthy()
    expect(screen.findByText('I was flying a helicopter')).toBeTruthy()
  })
})
