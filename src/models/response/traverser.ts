/* eslint-disable import/no-cycle */

import { isPlainObject } from 'lodash-es'
import Response from '@/models/response/index'
import {
  Action, Option, Question
} from '@/models/survey'
import {
  AnswerNode, endNode, isActionNode, isQuestionNode
} from '@/models/response/answer'
import SurveyTraverser from '@/models/survey/traverser'

export type BeyondEndNode = 'beyondEndNode'
export const beyondEndNode: BeyondEndNode = 'beyondEndNode'

type CurrentNode = AnswerNode | BeyondEndNode | undefined

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isAnswerNode(value: any): value is AnswerNode {
  if (!isPlainObject(value)) return false
  return isActionNode(value) || isQuestionNode(value)
}

/**
 * Interface for the callback receiver, used when traversing a {@link Response} with a
 * {@link ResponseTraverser}.
 */

export interface ResponseVisitor {

  /**
   * Wraps a call to {@link .visitQuestion}, allowing you to perform tail recursion on the call.
   * If you do not call `run` within your implementation, no downstream nodes will be traversed.
   *
   * @param question The Question being visited in the {@link Survey} tree.
   * @param node The corresponding node in the {@link Response} tree.
   * @param run Call this method within your implementation, after your setup code and before your
   * tail recursion code, to continue the traversal. Returns the value returned by the visitor
   * method.
   */

  aroundVisitQuestion?: (
    question: Question,
    node: CurrentNode,
    run: () => boolean
  ) => void;

  /**
   * Called when a Question node is visited in the {@link Survey} tree.
   *
   * @param question The Question being visited in the {@link Survey} tree.
   * @param node The corresponding node in the {@link Response} tree.
   * @return `true` to continue traversing, `false` to end all traversing (of the whole tree).
   */

  visitQuestion?: (question: Question, node: CurrentNode) => boolean;

  /**
   * Wraps a call to {@link .visitOption}, allowing you to perform tail recursion on the call.
   * If you do not call `run` within your implementation, no downstream nodes will be traversed.
   *
   * @param option The Option being visited in the {@link Survey} tree.
   * @param node The corresponding node in the {@link Response} tree.
   * @param run Call this method within your implementation, after your setup code and before your
   * tail recursion code, to continue the traversal. Returns the value returned by the visitor
   * method.
   */

  aroundVisitOption?: (
    option: Option,
    index: number,
    node: CurrentNode,
    run: () => boolean
  ) => void;

  /**
   * Called when an Option node is visited in the {@link Survey} tree.
   *
   * @param option The Option being visited in the {@link Survey} tree.
   * @param node The corresponding node in the {@link Response} tree.
   * @return `true` to continue traversing, `false` to end all traversing (of the whole tree).
   */

  visitOption?: (option: Option, index: number, node: CurrentNode) => boolean;

  /**
   * Wraps a call to {@link .visitAction}, allowing you to perform tail recursion on the call.
   * If you do not call `run` within your implementation, no downstream nodes will be traversed.
   *
   * @param action The Action being visited in the {@link Survey} tree.
   * @param node The corresponding node in the {@link Response} tree.
   * @param run Call this method within your implementation, after your setup code and before your
   * tail recursion code, to continue the traversal. Returns the value returned by the visitor
   * method.
   */

  aroundVisitAction?: (
    action: Action,
    node: CurrentNode,
    run: () => boolean
  ) => void;

  /**
   * Called when an Action node is visited in the {@link Survey} tree.
   *
   * @param action The Action being visited in the {@link Survey} tree.
   * @param node The corresponding node in the {@link Response} tree.
   * @return `true` to continue traversing, `false` to end all traversing (of the whole tree).
   */

  visitAction?: (action: Action, node: CurrentNode) => boolean;
}

/**
 * This class traverses paired {@link Survey} and {@link Response} trees simultaneously, yielding
 * matched nodes from each tree to a provided {@link ResponseVisitor} implementation.
 *
 * Call {@link .traverse} to begin traversal. The tree is traversed depth-first, the same order that
 * it is presented to the user.
 */

export default class ResponseTraverser {
  /**
   * Creates a new traverser for a response tree.
   * @param response The response tree.
   */

  constructor(private response: Response) {
  }

  /**
   * Call this method to begin traversal.
   *
   * @param visitor The object to receive callback functions as nodes are visited during traversal.
   */

  traverse(visitor: ResponseVisitor) {
    let currentNode: CurrentNode = this.response.answerRoot
    new SurveyTraverser(this.response.survey).traverse({
      aroundVisitQuestion(question, run) {
        if (visitor.aroundVisitQuestion) visitor.aroundVisitQuestion(question, currentNode, run)
        else run()
      },

      visitQuestion(question: Question) {
        if (currentNode === endNode) {
          // we reached the end of one branch of the answer tree at the last action; for the rest of
          // this path, we are beyond the end of the answer tree
          currentNode = beyondEndNode
        }

        if (visitor.visitQuestion) return visitor.visitQuestion(question, currentNode)
        return true
      },

      aroundVisitOption(option, index, run) {
        const wrappedRun = () => {
          const oldNode = currentNode
          if (isAnswerNode(currentNode) && isActionNode(currentNode)) {
            throw new Error('Expected Question node, got Action node')
          }
          if (isAnswerNode(currentNode) && isQuestionNode(currentNode)) {
            currentNode = currentNode.nodes[index]
          }

          const shouldContinue = run()

          currentNode = oldNode
          return shouldContinue
        }

        if (visitor.aroundVisitOption) {
          visitor.aroundVisitOption(option, index, currentNode, wrappedRun)
        } else wrappedRun()
      },

      visitOption(option, index) {
        if (visitor.visitOption) {
          return visitor.visitOption(option, index, currentNode)
        }
        return true
      },

      aroundVisitAction(action, run) {
        const wrappedRun = () => {
          const oldNode = currentNode
          if (isAnswerNode(currentNode) && isQuestionNode(currentNode)) {
            throw new Error('Expected Action node, got Question node')
          }
          if (isAnswerNode(currentNode) && isActionNode(currentNode)) {
            currentNode = currentNode.next
          }

          const shouldContinue = run()

          currentNode = oldNode
          return shouldContinue
        }

        if (visitor.aroundVisitAction) {
          visitor.aroundVisitAction(action, currentNode, wrappedRun)
        } else wrappedRun()
      },

      visitAction(action) {
        if (visitor.visitAction) return visitor.visitAction(action, currentNode)
        return true
      }
    })
  }
}
