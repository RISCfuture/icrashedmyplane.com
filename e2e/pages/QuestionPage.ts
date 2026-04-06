import type { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage.js'
import { Response as ResponseModel } from '@/models/response/index'
import { runResponse } from '../support/runResponse.js'

/**
 * Page object for the Question screen (both single- and multi-choice).
 */
export class QuestionPage extends BasePage {
  /** Click a single-choice or multi-choice option by its visible text. */
  async selectOptionByText(text: string): Promise<this> {
    await this.page.getByText(text).click()
    return this
  }

  /** Click the "Next" / "None of the above" button (multi-choice questions). */
  async clickNext(): Promise<this> {
    await this.page.getByRole('button').click()
    return this
  }

  /**
   * Drive the questionnaire programmatically by replaying a pre-built Response
   * through the UI.
   */
  async runResponse(response: ResponseModel): Promise<this> {
    await runResponse(this.page, response)
    return this
  }

  /** Return an option locator by its visible text for assertions. */
  optionByText(text: string): Locator {
    return this.page.getByText(text)
  }
}
