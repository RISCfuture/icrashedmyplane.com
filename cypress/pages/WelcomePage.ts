import { BasePage } from './BasePage'
import { QuestionPage } from './QuestionPage'

/**
 * Page object for the Welcome screen shown when the app first loads.
 */
export class WelcomePage extends BasePage {
  /** Navigate to the app root and land on the welcome screen. */
  open(): this {
    return this.visit('/')
  }

  /** Click the "Let's get started" button, which navigates to the first question. */
  clickGetStarted(): QuestionPage {
    cy.findByText('Let\u2019s get started').click()
    return new QuestionPage()
  }

  /** Return the page heading element for assertions. */
  heading(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.findByRole('heading', { level: 1 })
  }
}
