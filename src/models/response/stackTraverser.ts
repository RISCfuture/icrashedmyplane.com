import { type SurveyNode } from '@/models/survey'
import { Response } from '@/models/response/index'
import ResponseTraverser, { type CurrentResponseNode } from '@/models/response/traverser'

/**
 * Interface for the callback receiver, used when traversing a {@link Response} with a
 * {@link ResponseStackTraverser}.
 */

export interface ResponseStackVisitor {
  /**
   * Called when a responseNode is visited in the {@link Survey} tree.
   *
   * @param surveyNodes The stack of nodes visited, leading up to and including, the current
   * responseNode.
   * @return `true` to continue traversing, `false` to end all traversing (of the whole tree).
   */

  visitNode: (surveyNodes: SurveyNode[], responseNode: CurrentResponseNode) => boolean
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

  constructor(public response: Response) {}

  /**
   * Call this method to begin traversal.
   *
   * @param visitor The object to receive callback functions as nodes are visited during traversal.
   */

  traverse(visitor: ResponseStackVisitor): void {
    const stack: SurveyNode[] = []
    new ResponseTraverser(this.response).traverse({
      aroundVisitQuestion(question, responseNode, run) {
        stack.push(question)
        run()
        stack.pop()
      },

      visitQuestion(question, responseNode) {
        return visitor.visitNode(stack, responseNode)
      },

      aroundVisitOption(option, index, responseNode, run) {
        stack.push(option)
        run()
        stack.pop()
      },

      visitOption(option, index, responseNode) {
        return visitor.visitNode(stack, responseNode)
      },

      aroundVisitAction(action, responseNode, run) {
        stack.push(action)
        run()
        stack.pop()
      },

      visitAction(action, responseNode) {
        return visitor.visitNode(stack, responseNode)
      }
    })
  }
}
