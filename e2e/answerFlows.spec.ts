import { test, expect } from './fixtures/index.js'
import { makeResponse } from '@test-support/answerUtils'
import { accidentAnswer, incidentAnswer, seriousIncidentAnswer } from '@test-support/answers'
import { endNode } from '@/models/response/answer'

test.describe('Answer flows', () => {
  test.describe('Basic flows', () => {
    test('runs the ACCIDENT flow', async ({ welcomePage, resultPage }) => {
      await welcomePage.open()
      const questions = await welcomePage.clickGetStarted()

      await questions.runResponse(makeResponse('profile', { nodes: [] }))
      await questions.runResponse(makeResponse('incident', accidentAnswer))

      await expect(resultPage.heading).toContainText(
        'Based on your answers, this qualifies as an accident',
      )
    })

    test('runs the SERIOUS INCIDENT flow', async ({ welcomePage, resultPage }) => {
      await welcomePage.open()
      const questions = await welcomePage.clickGetStarted()

      await questions.runResponse(makeResponse('profile', { nodes: [{ next: endNode }] }))
      await questions.runResponse(makeResponse('incident', seriousIncidentAnswer))

      await expect(resultPage.heading).toContainText(
        'Based on your answers, this qualifies as a serious incident',
      )
    })

    test('runs the INCIDENT flow', async ({ welcomePage, resultPage }) => {
      await welcomePage.open()
      const questions = await welcomePage.clickGetStarted()

      await questions.runResponse(makeResponse('profile', { nodes: [{ next: endNode }] }))
      await questions.runResponse(makeResponse('incident', incidentAnswer))

      await expect(resultPage.heading).toContainText(
        'Based on your answers, this qualifies as an incident',
      )
    })
  })

  test.describe('Flags', () => {
    test('hides certain options if flags are not chosen', async ({ welcomePage }) => {
      await welcomePage.open()
      const questions = await welcomePage.clickGetStarted()

      await questions.selectOptionByText(
        'I was flying a multi-engine aircraft with certified MTOW > 12,500 lbs.',
      )
      await questions.selectOptionByText('I was flying a helicopter')
      await questions.clickNext()

      await expect(
        questions.optionByText('Takeoff or landing from an incorrect runway'),
      ).toBeHidden()
      await expect(questions.optionByText('Takeoff or landing from a taxiway')).toBeHidden()
      await expect(questions.optionByText('Runway incursion')).toBeHidden()
    })

    test('shows those options if flags are chosen', async ({ welcomePage }) => {
      await welcomePage.open()
      const questions = await welcomePage.clickGetStarted()

      await questions.selectOptionByText('I was engaged in air carrier operations (Part 119)')
      await questions.clickNext()

      await expect(
        questions.optionByText('Takeoff or landing from an incorrect runway'),
      ).toBeVisible()
      await expect(questions.optionByText('Takeoff or landing from a taxiway')).toBeVisible()
      await expect(questions.optionByText('Runway incursion')).toBeVisible()
    })
  })

  test('ends the questioning early once the ACCIDENT level is reached', async ({
    welcomePage,
    resultPage,
  }) => {
    await welcomePage.open()
    const questions = await welcomePage.clickGetStarted()

    // Skip profile by clicking "None of the above" (the submit button when nothing is selected)
    await questions.clickNext()

    await questions.selectOptionByText('Death or fatal injury')
    await questions.selectOptionByText('Hospitalization')
    await questions.clickNext()

    await questions.selectOptionByText('Yes')

    await expect(resultPage.heading).toBeVisible()
    await expect(resultPage.heading).toContainText(
      'Based on your answers, this qualifies as an accident',
    )
  })
})
