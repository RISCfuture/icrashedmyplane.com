import type { Page } from '@playwright/test'
import { Response as ResponseModel } from '@/models/response/index'
import ResponseTraverser, { beyondEndNode } from '@/models/response/traverser'
import { compact, isUndefined } from 'lodash-es'
import { endNode, isQuestionResponseNode } from '@/models/response/answer'

/**
 * Drive the questionnaire programmatically by replaying a pre-built Response
 * through the UI. This is the Playwright equivalent of the Cypress
 * `cy.runResponse()` app-action command.
 *
 * The ResponseTraverser walks the survey + response trees simultaneously.
 * For each answered question it clicks the matching options (by test ID)
 * and, for multi-choice questions, clicks the submit button.
 */
export async function runResponse(page: Page, response: ResponseModel): Promise<void> {
  // Collect the sequence of UI actions to perform
  const actions: (() => Promise<void>)[] = []

  new ResponseTraverser(response).traverse({
    visitQuestion(question, answerNode) {
      if (isUndefined(answerNode) || answerNode === endNode || answerNode === beyondEndNode) {
        return true
      }

      if (isQuestionResponseNode(answerNode)) {
        const chosenOptions = compact(
          answerNode.nodes.map((next, i) => (next ? question.options[i] : null)),
        )

        if (question.multi) {
          actions.push(async () => {
            for (const option of chosenOptions) {
              await page.getByTestId(option.identifier).click()
            }
            await page.getByRole('button').click()
          })
        } else {
          const firstOption = chosenOptions[0]
          if (firstOption) {
            actions.push(async () => {
              await page.getByTestId(firstOption.identifier).click()
            })
          }
        }
      }

      return true
    },
  })

  // Execute the collected actions sequentially
  for (const action of actions) {
    await action()
  }
}
