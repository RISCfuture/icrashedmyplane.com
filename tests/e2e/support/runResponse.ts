import { compact, isUndefined } from 'lodash-es'
import Response from '@/models/response'
import ResponseTraverser, { beyondEndNode } from '@/models/response/traverser'
import { endNode, isQuestionNode } from '@/models/response/answer'

export default function runResponse(response: Response) {
  console.log(response)
  new ResponseTraverser(response).traverse({
    visitQuestion(question, node) {
      if (isUndefined(node) || node === endNode || node === beyondEndNode) return true

      if (isQuestionNode(node)) {
        const chosenOptions = compact(
          node.nodes.map((next, i) => (next ? question.options[i] : null))
        )

        if (question.multi) {
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
