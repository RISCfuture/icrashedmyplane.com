import { beforeEach, describe, expect, it } from 'vitest'
import { endNode, type QuestionResponseNode, walkResponseTree } from '../answer'
import { mergeAnswers } from '@cypress/support/answerUtils'
import { accidentAnswer, answerWithNestedQuestion } from '@cypress/fixtures/answers'

describe('walkResponseTree', () => {
  let answer: QuestionResponseNode

  beforeEach(() => {
    answer = mergeAnswers(accidentAnswer, answerWithNestedQuestion)
  })

  it('walks the tree', () => {
    expect(walkResponseTree(answer, [10, 2, 0])).toEqual({ next: endNode })
  })

  it('throws an error given an invalid path', () => {
    expect(() => walkResponseTree(answer, [10, 2])).toThrow('Path ended prematurely')
    expect(() => walkResponseTree(accidentAnswer, [100])).toThrow('Invalid index for Question node')
    expect(() => walkResponseTree(answerWithNestedQuestion, [10, 2, 0, 1])).toThrow(
      'Walked past the end of the tree'
    )
  })
})
