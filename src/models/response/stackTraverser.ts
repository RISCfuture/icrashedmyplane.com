/* eslint-disable import/no-cycle */

import { SurveyStep } from '@/models/survey'
import Response from '@/models/response/index'
import ResponseTraverser, { CurrentNode } from '@/models/response/traverser'

/**
 * Interface for the callback receiver, used when traversing a {@link Response} with a
 * {@link ResponseStackTraverser}.
 */

export interface ResponseStackVisitor {

  /**
   * Called when a node is visited in the {@link Survey} tree.
   *
   * @param surveyNodes The stack of nodes visited, leading up to and including, the current node.
   * @return `true` to continue traversing, `false` to end all traversing (of the whole tree).
   */

  visitNode: (surveyNodes: SurveyStep[], responseNode: CurrentNode) => boolean;
}

/**
 * An implementation of {@link ResponseTraverser} that maintains and yields a stack of previously
 * visited survey nodes with each callback.
 */

export default class ResponseStackTraverser {
  /**
   * Creates a new traverser for a Response.
   *
   * @param response The Response to traverse.
   */

  constructor(public response: Response) {
  }

  /**
   * Call this method to begin traversal.
   *
   * @param visitor The object to receive callback functions as nodes are visited during traversal.
   */

  traverse(visitor: ResponseStackVisitor) {
    const stack: SurveyStep[] = []
    new ResponseTraverser(this.response).traverse({
      aroundVisitQuestion(question, node, run) {
        stack.push(question)
        run()
        stack.pop()
      },

      visitQuestion(question, node) {
        return visitor.visitNode(stack, node)
      },

      aroundVisitOption(option, index, node, run) {
        stack.push(option)
        run()
        stack.pop()
      },

      visitOption(option, index, node) {
        return visitor.visitNode(stack, node)
      },

      aroundVisitAction(action, node, run) {
        stack.push(action)
        run()
        stack.pop()
      },

      visitAction(action, node) {
        return visitor.visitNode(stack, node)
      }
    })
  }
}
