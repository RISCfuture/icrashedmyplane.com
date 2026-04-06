import { BasePage } from './BasePage'
import { Response as ResponseModel } from '@/models/response'

/**
 * Page object for the Question screen (both single- and multi-choice).
 */
export class QuestionPage extends BasePage {
  /** Click a single-choice or multi-choice option by its visible text. */
  selectOptionByText(text: string): this {
    cy.findByText(text).click()
    return this
  }

  /** Click the "Next" / "None of the above" button (multi-choice questions). */
  clickNext(): this {
    cy.findByRole('button').click()
    return this
  }

  /**
   * App Action: drive the questionnaire programmatically by replaying a
   * pre-built Response through the UI via the custom `runResponse` command.
   */
  runResponse(response: ResponseModel): this {
    cy.runResponse(response)
    return this
  }

  /** Return an option element by its visible text for assertions. */
  optionByText(text: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.findByText(text)
  }
}
