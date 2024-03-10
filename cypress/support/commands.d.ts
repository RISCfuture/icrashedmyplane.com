/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import { Response as ResponseModel } from '../../src/models/response'

declare global {
  namespace Cypress {
    interface Chainable {
      runResponse(response: ResponseModel): Chainable<void>
    }
  }
}

export {}
