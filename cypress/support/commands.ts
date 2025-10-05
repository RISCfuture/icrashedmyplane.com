/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
/// <reference types="./commands" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import '@testing-library/cypress/add-commands'
import { Response as ResponseModel } from '@/models/response'
import ResponseTraverser, { beyondEndNode } from '../../src/models/response/traverser'
import { compact, isUndefined } from 'lodash-es'
import { endNode, isQuestionResponseNode } from '../../src/models/response/answer'

Cypress.Commands.add('runResponse', (response: ResponseModel) => {
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
           
          chosenOptions.forEach((option) => cy.findByTestId(option.identifier).click())
          cy.findByRole('button').click()
        } else {
          const firstOption = chosenOptions[0]
          if (firstOption) {
            cy.findByTestId(firstOption.identifier).click()
          }
        }
      }

      return true
    }
  })
})
