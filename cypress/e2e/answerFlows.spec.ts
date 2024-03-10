import { makeResponse } from '../support/answerUtils'
import { accidentAnswer, incidentAnswer, seriousIncidentAnswer } from '../fixtures/answers'
import { endNode } from '@/models/response/answer'

describe('Answer flows', () => {
  context('Basic flows', () => {
    it('runs the ACCIDENT flow', () => {
      cy.visit('/')
      cy.findByText('Let’s get started').click()
      cy.runResponse(makeResponse('profile', { nodes: [] }))
      cy.runResponse(makeResponse('incident', accidentAnswer))

      cy.findByRole('heading', { level: 1 }).should(
        'contain',
        'Based on your answers, this qualifies as an accident'
      )
    })

    it('runs the SERIOUS INCIDENT flow', () => {
      cy.visit('/')
      cy.findByText('Let’s get started').click()
      cy.runResponse(makeResponse('profile', { nodes: [{ next: endNode }] }))
      cy.runResponse(makeResponse('incident', seriousIncidentAnswer))

      cy.findByRole('heading', { level: 1 }).should(
        'contain',
        'Based on your answers, this qualifies as a serious incident'
      )
    })

    it('runs the INCIDENT flow', () => {
      cy.visit('/')
      cy.findByText('Let’s get started').click()
      cy.runResponse(makeResponse('profile', { nodes: [{ next: endNode }] }))
      cy.runResponse(makeResponse('incident', incidentAnswer))

      cy.findByRole('heading', { level: 1 }).should(
        'contain',
        'Based on your answers, this qualifies as an incident'
      )
    })
  })

  context('Flags', () => {
    it('hides certain options if flags are not chosen', () => {
      cy.visit('/')
      cy.findByText('Let’s get started').click()

      cy.findByText(
        'I was flying a multi-engine aircraft with certified MTOW > 12,500 lbs.'
      ).click()
      cy.findByText('I was flying a helicopter').click()
      cy.findByText('Next').click()

      cy.findByText('Takeoff or landing from an incorrect runway').should('not.exist')
      cy.findByText('Takeoff or landing from a taxiway').should('not.exist')
      cy.findByText('Runway incursion').should('not.exist')
    })

    it('shows those options if flags are chosen', () => {
      cy.visit('/')
      cy.findByText('Let’s get started').click()

      cy.findByText('I was engaged in air carrier operations (Part 119)').click()
      cy.findByText('Next').click()

      cy.findByText('Takeoff or landing from an incorrect runway').should('exist')
      cy.findByText('Takeoff or landing from a taxiway').should('exist')
      cy.findByText('Runway incursion').should('exist')
    })
  })

  it('ends the questioning early once the ACCIDENT level is reached', () => {
    cy.visit('/')
    cy.findByText('Let’s get started').click()

    cy.findByText('None of the above').click()

    cy.findByText('Death or fatal injury').click()
    cy.findByText('Hospitalization').click()
    cy.findByText('Next').click()

    cy.findByText('Yes').click()

    cy.findByRole('heading', { level: 1 }).should('exist')
    cy.findByRole('heading', { level: 1 }).should(
      'contain',
      'Based on your answers, this qualifies as an accident'
    )
  })
})
