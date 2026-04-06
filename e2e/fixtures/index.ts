import { test as base } from '@playwright/test'
import { WelcomePage } from '../pages/WelcomePage.js'
import { QuestionPage } from '../pages/QuestionPage.js'
import { ResultPage } from '../pages/ResultPage.js'

type PageObjects = {
  welcomePage: WelcomePage
  questionPage: QuestionPage
  resultPage: ResultPage
}

export const test = base.extend<PageObjects>({
  welcomePage: async ({ page }, use) => {
    await use(new WelcomePage(page))
  },
  questionPage: async ({ page }, use) => {
    await use(new QuestionPage(page))
  },
  resultPage: async ({ page }, use) => {
    await use(new ResultPage(page))
  },
})

export { expect } from '@playwright/test'
