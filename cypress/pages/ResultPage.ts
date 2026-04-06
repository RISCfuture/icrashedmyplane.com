import { BasePage } from './BasePage'

/**
 * Page object for the Finished/Result screen shown after all surveys
 * are complete (Accident, Serious Incident, or Incident).
 */
export class ResultPage extends BasePage {
  /** Return the primary heading element for assertions. */
  heading(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.findByRole('heading', { level: 1 })
  }
}
