import type { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage.js'
import { QuestionPage } from './QuestionPage.js'

/**
 * Page object for the Welcome screen shown when the app first loads.
 */
export class WelcomePage extends BasePage {
  readonly heading: Locator
  private readonly getStartedButton: Locator

  constructor(page: Page) {
    super(page)
    this.heading = page.getByRole('heading', { level: 1 })
    this.getStartedButton = page.getByText('Let\u2019s get started')
  }

  /** Navigate to the app root and land on the welcome screen. */
  async open(): Promise<this> {
    await this.visit('/')
    return this
  }

  /** Click the "Let's get started" button, which navigates to the first question. */
  async clickGetStarted(): Promise<QuestionPage> {
    await this.getStartedButton.click()
    await this.getStartedButton.waitFor({ state: 'hidden' })
    return new QuestionPage(this.page)
  }
}
