/**
 * Base class for all page objects. Provides a fluent `wrap()` helper
 * and a common `visit()` method.
 */
export class BasePage {
  /** Wrap a Cypress chainable so fluent chains return `this`. */
  protected wrap(_chainable: Cypress.Chainable): this {
    return this
  }

  /** Navigate to the given path. */
  visit(path: string): this {
    return this.wrap(cy.visit(path))
  }
}
