import type { Page } from '@playwright/test'

/**
 * Base class for all page objects. Holds a reference to the Playwright Page.
 */
export class BasePage {
  constructor(protected readonly page: Page) {}

  /** Navigate to the given path. */
  async visit(path: string): Promise<void> {
    await this.page.goto(path)
  }
}
