import { cloneDeep, isEmpty, isString } from 'lodash-es'

export type EndNode = 'end'

/** Represents the end of a path in a response tree. */
export const endNode = 'end'

/** A node in a response tree representing a {@link Question} that was answered. */

export interface QuestionResponseNode {
  /**
   * For each {@link Option} under {@link Question.options}, this array contains either an
   * ActionNode if the user chose that option, or `undefined` if not.
   */

  nodes: (ActionResponseNode | undefined)[]
}

/**
 * A node in a response tree that links {@link QuestionResponseNode}s together. ActionNodes in a
 * response tree correspond to {@link Action}s in a {@link Survey}.
 */

export interface ActionResponseNode {
  /**
   * The next node this node is linking to. If {@link .endNode}, this is the end of a path in the
   * response tree.
   */

  next: QuestionResponseNode | EndNode
}

export type ResponseNode = QuestionResponseNode | ActionResponseNode | EndNode

/**
 * Determines if a given node is a {@link QuestionResponseNode}.
 *
 * @param node A node to test.
 * @return Whether it is a QuestionNode.
 */

export function isQuestionResponseNode(node: ResponseNode): node is QuestionResponseNode {
  if (isString(node)) return false
  return 'nodes' in node
}

/**
 * Determines if a given node is an {@link ActionResponseNode}.
 *
 * @param node A node to test.
 * @return Whether it is a ActionNode.
 */

export function isActionResponseNode(node: ResponseNode): node is ActionResponseNode {
  if (isString(node)) return false
  return 'next' in node
}

function walkResponseTreeEatingPath(
  node: QuestionResponseNode,
  path: number[]
): ActionResponseNode {
  if (isEmpty(path)) throw new Error('Path ended prematurely')
  // didn't get to the end of the tree at end of path

  const next = node.nodes[path.shift()!]
  if (!next) throw new Error('Invalid index for Question node')

  if (next.next === endNode) {
    // we've reached the end of the tree
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

export function walkResponseTree(node: QuestionResponseNode, path: number[]): ActionResponseNode {
  if (isEmpty(path)) throw new Error('Path must have at least one element')
  return walkResponseTreeEatingPath(node, cloneDeep(path))
}
