/* eslint-disable import/no-cycle */

import { each } from 'lodash-es'
import Survey, {
  Action,
  Option,
  Question,
  QuestionAction
} from '@/models/survey/index'

/**
 * Interface for the callback receiver, used when traversing a {@link Survey} with a
 * {@link SurveyTraverser}.
 */

export interface SurveyVisitor {

  /**
   * Wraps a call to {@link .visitQuestion}, allowing you to perform tail recursion on the call.
   * If you do not call `run` within your implementation, no downstream nodes will be traversed.
   *
   * @param question The Question being visited in the {@link Survey} tree.
   * @param run Call this method within your implementation, after your setup code and before your
   * tail recursion code, to continue the traversal. Returns the value returned by the visitor
   * method.
   */

  aroundVisitQuestion?: (question: Question, run: () => boolean) => void;

  /**
   * Called when a Question node is visited in the {@link Survey} tree.
   *
   * @param question The Question being visited in the {@link Survey} tree.
   * @return `true` to continue traversing, `false` to end all traversing (of the whole tree).
   */

  visitQuestion?: (question: Question) => boolean;

  /**
   * Wraps a call to {@link .visitOption}, allowing you to perform tail recursion on the call.
   * If you do not call `run` within your implementation, no downstream nodes will be traversed.
   *
   * @param option The Option being visited in the {@link Survey} tree.
   * @param run Call this method within your implementation, after your setup code and before your
   * tail recursion code, to continue the traversal. Returns the value returned by the visitor
   * method.
   */

  aroundVisitOption?: (option: Option, index: number, run: () => boolean) => void;

  /**
   * Called when an Option node is visited in the {@link Survey} tree.
   *
   * @param option The Option being visited in the {@link Survey} tree.
   * @return `true` to continue traversing, `false` to end all traversing (of the whole tree).
   */

  visitOption?: (option: Option, index: number) => boolean;

  /**
   * Wraps a call to {@link .visitAction}, allowing you to perform tail recursion on the call.
   * If you do not call `run` within your implementation, no downstream nodes will be traversed.
   *
   * @param action The Action being visited in the {@link Survey} tree.
   * @param run Call this method within your implementation, after your setup code and before your
   * tail recursion code, to continue the traversal. Returns the value returned by the visitor
   * method.
   */

  aroundVisitAction?: (action: Action, run: () => boolean) => void;

  /**
   * Called when an Action node is visited in the {@link Survey} tree.
   *
   * @param action The Action being visited in the {@link Survey} tree.
   * @return `true` to continue traversing, `false` to end all traversing (of the whole tree).
   */

  visitAction?: (action: Action) => boolean;
}

/**
 * This class traverses a {@link Survey}, yielding the nodes from the tree to a provided
 * {@link SurveyVisitor} implementation.
 *
 * Call {@link .traverse} to begin traversal. The tree is traversed depth-first, the same order that
 * it is presented to the user.
 */

export default class SurveyTraverser {
  /**
   * Creates a new traverser for a Survey.
   * @param survey The Survey to traverse.
   */

  constructor(public survey: Survey) {}

  /**
   * Call this method to begin traversal.
   *
   * @param visitor The object to receive callback functions as nodes are visited during traversal.
   */

  traverse(visitor: SurveyVisitor): void {
    this.visitQuestion(this.survey.root, visitor)
  }

  private visitQuestion(question: Question, visitor: SurveyVisitor): boolean {
    let shouldContinue = true
    const run = () => {
      if (visitor.visitQuestion) shouldContinue = visitor.visitQuestion(question)
      if (!shouldContinue) return shouldContinue

      each(question.options, (option, index) => {
        shouldContinue = this.visitOption(option, index, visitor)
        return shouldContinue
      })

      return shouldContinue
    }

    if (visitor.aroundVisitQuestion) visitor.aroundVisitQuestion(question, run)
    else run()

    return shouldContinue
  }

  private visitOption(option: Option, index: number, visitor: SurveyVisitor): boolean {
    let shouldContinue = true
    const run = () => {
      if (visitor.visitOption) shouldContinue = visitor.visitOption(option, index)
      if (!shouldContinue) return shouldContinue

      shouldContinue = this.visitAction(option.action, visitor)
      return shouldContinue
    }

    if (visitor.aroundVisitOption) visitor.aroundVisitOption(option, index, run)
    else run()

    return shouldContinue
  }

  private visitAction(action: Action, visitor: SurveyVisitor): boolean {
    let shouldContinue = true
    const run = () => {
      if (visitor.visitAction) shouldContinue = visitor.visitAction(action)
      if (!shouldContinue) return shouldContinue

      if (action instanceof QuestionAction) {
        shouldContinue = this.visitQuestion(action.question, visitor)
      }

      return shouldContinue
    }

    if (visitor.aroundVisitAction) visitor.aroundVisitAction(action, run)
    else run()

    return shouldContinue
  }
}
