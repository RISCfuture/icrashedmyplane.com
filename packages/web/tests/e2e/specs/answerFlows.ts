import { makeResponse } from '../../unit/support'
import { accidentAnswer, incidentAnswer, seriousIncidentAnswer } from '../../unit/response/fixtures'
import runResponse from '../support/runResponse'
import { endNode } from '@/models/response/answer'

describe('Answer flows', () => {
  context('Basic flows', () => {
    it('runs the ACCIDENT flow', () => {
      cy.visit('/')
      cy.dataCy('startButton').click()
      runResponse(makeResponse('profile', { nodes: [] }))
      runResponse(makeResponse('incident', accidentAnswer))

      cy.dataCy('levelDescription').should('have.class', 'level-accident')
    })

    it('runs the SERIOUS INCIDENT flow', () => {
      cy.visit('/')
      cy.dataCy('startButton').click()
      runResponse(makeResponse('profile', { nodes: [{ next: endNode }] }))
      runResponse(makeResponse('incident', seriousIncidentAnswer))

      cy.dataCy('levelDescription').should('have.class', 'level-serious-incident')
    })

    it('runs the INCIDENT flow', () => {
      cy.visit('/')
      cy.dataCy('startButton').click()
      runResponse(makeResponse('profile', { nodes: [{ next: endNode }] }))
      runResponse(makeResponse('incident', incidentAnswer))

      cy.dataCy('levelDescription').should('have.class', 'level-incident')
    })
  })

  context('Flags', () => {
    it('hides certain options if flags are not chosen', () => {
      cy.visit('/')
      cy.dataCy('startButton').click()

      cy.dataCy('largeMulti').click()
      cy.dataCy('helicopter').click()
      cy.dataCy('nextButton').click()

      cy.dataCy('wrongRunway').should('not.exist')
      cy.dataCy('taxiway').should('not.exist')
      cy.dataCy('runwayIncursion').should('not.exist')
    })

    it('shows those options if flags are chosen', () => {
      cy.visit('/')
      cy.dataCy('startButton').click()

      cy.dataCy('airCarrier').click()
      cy.dataCy('nextButton').click()

      cy.dataCy('wrongRunway').should('exist')
      cy.dataCy('taxiway').should('exist')
      cy.dataCy('runwayIncursion').should('exist')
    })
  })


  it('ends the questioning early once the ACCIDENT level is reached', () => {
    cy.visit('/')
    cy.dataCy('startButton').click()

    cy.dataCy('nextButton').click()

    cy.dataCy('death').click()
    cy.dataCy('hospitalization').click()
    cy.dataCy('nextButton').click()

    cy.dataCy('yes').click()

    cy.dataCy('levelDescription').should('exist')
    cy.dataCy('levelDescription').should('have.class', 'level-accident')
  })
})
