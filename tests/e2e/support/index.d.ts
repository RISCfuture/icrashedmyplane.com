/* eslint-disable spaced-comment */

// load type definitions that come with Cypress module
/// <reference types="cypress" />

/** TypeScript declarations for commands added in `commands.js`. */

declare namespace Cypress {
  interface Chainable {

    /**
     * Select a DOM element by its `data-cy` attribute.
     *
     * @param value The value for the attribute.
     * @return The element(s) whose `data-cy` attribute matches `value`.
     */

    dataCy(value: string): Chainable<Element>;
  }
}
