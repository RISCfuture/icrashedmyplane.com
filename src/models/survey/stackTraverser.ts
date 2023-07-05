import Survey, { SurveyNode } from '@/models/survey/index'
import SurveyTraverser from '@/models/survey/traverser'

/**
 * Interface for the callback receiver, used when traversing a {@link Survey} with a
 * {@link SurveyStackTraverser}.
 */

export interface SurveyStackVisitor {

  /**
   * Called when a node is visited in the {@link Survey} tree.
   *
   * @param nodes The stack of nodes visited, leading up to and including, the current node.
   * @return `true` to continue traversing, `false` to end all traversing (of the whole tree).
   */

  visitNode: (nodes: SurveyNode[]) => boolean;
}

/**
 * An implementation of {@link SurveyTraverser} that maintains and yields a stack of previously
 * visited nodes with each callback.
 */

export default class SurveyStackTraverser {
  /**
   * Creates a new traverser for a Survey.
   *
   * @param survey The Survey to traverse.
   */

  constructor(public survey: Survey) {
  }

  /**
   * Call this method to begin traversal.
   *
   * @param visitor The object to receive callback functions as nodes are visited during traversal.
   */

  traverse(visitor: SurveyStackVisitor): void {
    const stack: SurveyNode[] = []
    new SurveyTraverser(this.survey).traverse({
      aroundVisitQuestion(question, run) {
        stack.push(question)
        run()
        stack.pop()
      },

      visitQuestion() {
        return visitor.visitNode(stack)
      },

      aroundVisitOption(option, index, run) {
        stack.push(option)
        run()
        stack.pop()
      },

      visitOption() {
        return visitor.visitNode(stack)
      },

      aroundVisitAction(action, run) {
        stack.push(action)
        run()
        stack.pop()
      },

      visitAction() {
        return visitor.visitNode(stack)
      },
    })
  }
}
