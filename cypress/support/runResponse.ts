import { compact, isUndefined } from 'lodash-es'
import ResponseTraverser, {
  beyondEndNode
} from '@/models/response/traverser'
import {
  endNode,
  isQuestionResponseNode
} from '@/models/response/answer'
import { Response } from '@/models/response'

export default function runResponse(response: Response): void {
  new ResponseTraverser(response).traverse({
    visitQuestion(question, answerNode) {
      if (isUndefined(answerNode) || answerNode === endNode || answerNode === beyondEndNode) {
        return true
      }

      if (isQuestionResponseNode(answerNode)) {
        const chosenOptions = compact(
          answerNode.nodes.map((next, i) => (next ? question.options[i] : null))
        )

        if (question.multi) {
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          chosenOptions.forEach(option => cy.dataCy(option.identifier).click())
          cy.dataCy('nextButton').click()
        } else {
          cy.dataCy(chosenOptions[0].identifier).click()
        }
      }

      return true
    }
  })
}
