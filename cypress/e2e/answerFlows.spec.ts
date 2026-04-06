import { makeResponse } from '../support/answerUtils'
import { accidentAnswer, incidentAnswer, seriousIncidentAnswer } from '../fixtures/answers'
import { endNode } from '@/models/response/answer'
import { WelcomePage, QuestionPage, ResultPage } from '../pages'

describe('Answer flows', () => {
  let welcome: WelcomePage
  let questions: QuestionPage
  const result = new ResultPage()

  beforeEach(() => {
    welcome = new WelcomePage()
    questions = welcome.open().clickGetStarted()
  })

  context('Basic flows', () => {
    it('runs the ACCIDENT flow', () => {
      questions
        .runResponse(makeResponse('profile', { nodes: [] }))
        .runResponse(makeResponse('incident', accidentAnswer))

      result.heading().should('contain', 'Based on your answers, this qualifies as an accident')
    })

    it('runs the SERIOUS INCIDENT flow', () => {
      questions
        .runResponse(makeResponse('profile', { nodes: [{ next: endNode }] }))
        .runResponse(makeResponse('incident', seriousIncidentAnswer))

      result
        .heading()
        .should('contain', 'Based on your answers, this qualifies as a serious incident')
    })

    it('runs the INCIDENT flow', () => {
      questions
        .runResponse(makeResponse('profile', { nodes: [{ next: endNode }] }))
        .runResponse(makeResponse('incident', incidentAnswer))

      result.heading().should('contain', 'Based on your answers, this qualifies as an incident')
    })
  })

  context('Flags', () => {
    it('hides certain options if flags are not chosen', () => {
      questions
        .selectOptionByText(
          'I was flying a multi-engine aircraft with certified MTOW > 12,500 lbs.',
        )
        .selectOptionByText('I was flying a helicopter')
        .clickNext()

      questions.optionByText('Takeoff or landing from an incorrect runway').should('not.exist')
      questions.optionByText('Takeoff or landing from a taxiway').should('not.exist')
      questions.optionByText('Runway incursion').should('not.exist')
    })

    it('shows those options if flags are chosen', () => {
      questions.selectOptionByText('I was engaged in air carrier operations (Part 119)').clickNext()

      questions.optionByText('Takeoff or landing from an incorrect runway').should('exist')
      questions.optionByText('Takeoff or landing from a taxiway').should('exist')
      questions.optionByText('Runway incursion').should('exist')
    })
  })

  it('ends the questioning early once the ACCIDENT level is reached', () => {
    // Skip profile by clicking "None of the above" (the submit button when nothing is selected)
    questions.clickNext()

    questions.selectOptionByText('Death or fatal injury').selectOptionByText('Hospitalization')
    questions.clickNext()

    questions.selectOptionByText('Yes')

    result.heading().should('exist')
    result.heading().should('contain', 'Based on your answers, this qualifies as an accident')
  })
})
