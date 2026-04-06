import type { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage.js'

/**
 * Page object for the Finished/Result screen shown after all surveys
 * are complete (Accident, Serious Incident, or Incident).
 */
export class ResultPage extends BasePage {
  /** The primary heading element for assertions. */
  readonly heading: Locator

  constructor(page: Page) {
    super(page)
    this.heading = page.getByRole('heading', { level: 1 })
  }
}
