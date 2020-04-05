import {
  cloneDeep, isEmpty, isPlainObject, isUndefined
} from 'lodash-es'

/** A node in a response tree representing a {@link Question} that was answered. */

export interface QuestionNode {

  /**
   * For each {@link Option} under {@link Question.options}, this array contains either an
   * ActionNode if the user chose that option, or `undefined` if not.
   */

  nodes: (ActionNode | undefined)[];
}

/**
 * A node in a response tree that links {@link QuestionNode}s together. ActionNodes in a response
 * tree correspond to {@link Action}s in a {@link Survey}.
 */

export interface ActionNode {

  /**
   * The next node this node is linking to. If {@link .endNode}, this is the end of a path in the
   * response tree.
   */

  next: QuestionNode | EndNode;
}

export type EndNode = 'end'

/** Represents the end of a path in a response tree. */
export const endNode = 'end'

export type AnswerNode = QuestionNode | ActionNode | EndNode

/**
 * Determines if a given node is a {@link QuestionNode}.
 *
 * @param node A node to test.
 * @return Whether it is a QuestionNode.
 */

export function isQuestionNode(node: AnswerNode): node is QuestionNode {
  if (!isPlainObject(node)) return false
  return !isUndefined((<QuestionNode>node).nodes)
}

/**
 * Determines if a given node is an {@link ActionNode}.
 *
 * @param node A node to test.
 * @return Whether it is a ActionNode.
 */

export function isActionNode(node: AnswerNode): node is ActionNode {
  if (!isPlainObject(node)) return false
  return !isUndefined((<ActionNode>node).next)
}

function walkResponseTreeEatingPath(node: QuestionNode, path: number[]): ActionNode {
  if (isEmpty(path)) throw new Error('Path ended prematurely')
  // didn't get to the end of the tree at end of path

  const next = node.nodes[<number>path.shift()]
  if (!next) throw new Error('Invalid index for Question node')

  if (next.next === endNode) { // we've reached the end of the tree
    if (isEmpty(path)) return next // hopefully that also corresponds with the end of the path!
    throw new Error('Walked past the end of the tree')
  }

  return walkResponseTreeEatingPath(next.next, path)
}

/**
 * Given an answer path, walks a response tree according to that path, returning the node at the
 * end of the path.
 *
 * @param node The root node of the response tree.
 * @param path The path to walk.
 * @return The node at the end of the path.
 * @throws Error If the path does not terminate in a leaf node.
 * @throws Error If the path continues past a leaf node.
 * @throws Error If the path includes an out-of-bounds index for a QuestionNode.
 * @see AnswerPath
 */

export function walkResponseTree(node: QuestionNode, path: number[]): ActionNode {
  if (isEmpty(path)) throw new Error('Path must have at least one element')
  return walkResponseTreeEatingPath(node, cloneDeep(path))
}
